from selenium import webdriver
from selenium.webdriver.common.by import By
import re
import time
import csv

months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November",
          "December", "in"]
citations = ["S.Ct.", "L.Ed.", "L Ed", "F.Supp.", "U.S.", "F.2d", "C.A.5th Cir.", "L.Ed.2d",
             "F.3d", "F.Cas.", "F.R.D.", "F.Supp.2d", "A.L.R.", "Am.Jur.", "Harv.L.Rev.", "h Cir."]

options = webdriver.ChromeOptions()

options.add_argument('-headless')
driver = webdriver.Chrome(options=options)

count = 0
citationSet = set()
allCases = list()

citationTotals = dict()

def checkThree(tP, i):
    return re.search(r'\d{2}', tP[i:i + 2])


def checkYear(tP, i):
    return re.search(r'\d{4}', tP[i:i + 4])


def previousWord(tP, i):
    while i >= 0 and not tP[i].isalpha():
        i -= 1

    endIndex = i + 1
    while i >= 0 and tP[i] != " ":
        i -= 1

    return tP[i:endIndex].strip()


def simpleCheck(thisParagraph):
    for index in range(len(thisParagraph)):

        if (checkThree(thisParagraph, index)):

            if (previousWord(thisParagraph, index) in months):
                continue

            checkStart = max(index - 4, 0)
            checkEnd = min(index + 4, len(thisParagraph))
            numberCount = sum(c.isdigit() for c in thisParagraph[checkStart:checkEnd])

            if numberCount == 4 and checkYear(thisParagraph, index):
                continue
            if numberCount < 3:
                continue

            consecLetters = 0
            while consecLetters < 4:
                index = max(index - 2, 0)
                if (thisParagraph[index].isalpha()):
                    consecLetters += 1
                if (index == 0):
                    consecLetters = 4

            while index < len(thisParagraph) and not thisParagraph[index].isnumeric():
                index += 1

            startIndex = index

            consecLetters = 0
            while consecLetters < 4:
                index = min(index + 2, len(thisParagraph) - 1)
                if (thisParagraph[index].isalpha()):
                    consecLetters += 1
                if (index == len(thisParagraph) - 1):
                    consecLetters = 4

            while index >= 0 and not thisParagraph[index].isnumeric():
                index -= 1

            index = min(index + 2, len(thisParagraph) - 1)

            toRemove = thisParagraph[startIndex:index]
            thisParagraph = thisParagraph.replace(toRemove, "")

    for cite in citations:
        spaceOn = cite
        thisParagraph = thisParagraph.replace(spaceOn, "")

    thisParagraph = re.sub(r' +', ' ', thisParagraph)
    thisParagraph = thisParagraph.replace(", ,", ", ")
    thisParagraph = thisParagraph.replace(". .", ". ")
    thisParagraph = thisParagraph.replace(", .", ". ")
    thisParagraph = thisParagraph.replace(", ;", "; ")

    thisParagraph = thisParagraph.replace(",,", ", ")
    thisParagraph = thisParagraph.replace(",.", ". ")
    thisParagraph = re.sub(r' +', ' ', thisParagraph)

    return thisParagraph


def getCitations(thisParagraph):
    global count
    global citationSet
    global citationTotals

    theseCitations = set()

    index = 0
    while index >= 0 and index <= len(thisParagraph):
        index = thisParagraph.find("U.S.", index)
        if index == -1:
            break

        count += 1

        original = index

        index -= 2
        while index >= 0 and thisParagraph[index].isnumeric():
            index -= 1

        index += 1
        startIndex = index

        index = original + len(" U.S. ")
        while index < len(thisParagraph) and not thisParagraph[index].isnumeric():
            index += 1

        while index < len(thisParagraph) and thisParagraph[index].isnumeric():
            index += 1

        citationToAdd = thisParagraph[startIndex:index]

        if not citationToAdd in citationTotals:
            citationTotals[citationToAdd] = 1
        else:
            citationTotals[citationToAdd] += 1
        theseCitations.add(citationToAdd)
        citationSet.add(citationToAdd)

    return theseCitations


def caseExists (caseUrl):
    try:
        driver.get(caseUrl)
        driver.find_elements(By.CLASS_NAME, "num")
        return True
    except Exception as e:
        return False


with open('legacy.csv', mode='r') as file:
    csvFile = csv.reader(file)
    next(csvFile)
    for lines in csvFile:
        allCases.append(lines[6] + " " + lines[4])

with open('modern.csv', mode='r') as file:
    csvFile = csv.reader(file)
    next(csvFile)
    for lines in csvFile:
        allCases.append(lines[6] + " " + lines[4])

def atoi(text):
    return int(text) if text.isdigit() else text

def natural_keys(text):
    return [atoi(c) for c in re.split(r'(\d+)', text)]

newAllCases = []
[newAllCases.append(x) for x in allCases if x not in newAllCases]

newAllCases.sort(key=natural_keys)

print(newAllCases[:25])

# driver.get("https://www.law.cornell.edu/supremecourt/text/410/113")
baseUrl = "https://www.law.cornell.edu/supremecourt/text/"
fileName = "-cleanedCourtCase.txt"

numberOfCasesSeen = 0
unfoundCases = 0
filingNumber = 1

f = open(str(filingNumber) + fileName, "w")

volumeOn = 1
pageOn = 1
beenOnVolume = 0

for case in newAllCases:

    try:
        parts = case.split(" ")
        volumeOn = int(parts[0])
        pageOn = int(parts[2])
    except Exception as e:
        print("exception while parsing case citation:", e)
        pass
        continue

    if volumeOn % 30 == 0 and beenOnVolume == 0:
        f.close()
        filingNumber += 1

        f = open(str(filingNumber) + fileName, "a")

        print("number of cases so far:", numberOfCasesSeen)
        print("number of unique citations so far:", len(citationSet))
        print("total number of citations made:", sum(citationTotals.values()))

        beenOnVolume = 1

    elif volumeOn % 30 != 0:
       beenOnVolume = 0

    endpoint = str(volumeOn) + "/" + str(pageOn)
    caseUrl = baseUrl + endpoint

    if caseExists(caseUrl):

        time.sleep(2)

        driver.get(caseUrl)
        theseCitations = set()

        try:
            caseCite = driver.find_elements(By.CLASS_NAME, "case_cite")
            parties = driver.find_element(By.CLASS_NAME, "parties")
            date = case.split(" ")[3]

            f.write(caseCite[0].text)
            f.write("\n")
            f.write(parties.text)
            f.write("\n")
            f.write(date)
            f.write("\n\n")

            paragraphs = driver.find_elements(By.CLASS_NAME, "num")
            for para in paragraphs:
                para = para.text
                theseCitations.update(getCitations(para))
                # para = simpleCheck(para)
                f.write(para + "\n")
            f.write("\n")

            footnotes = driver.find_elements(By.CLASS_NAME, "footnote")
            for footnote in footnotes:
                footnote = footnote.text
                theseCitations.update(getCitations(footnote))
                # footnote = simpleCheck(footnote)
                f.write(footnote + "\n")
                f.write("\n")
            f.write("\n")

            f.write(str(theseCitations))
            f.write("\n")
            f.write("=======================================================\n")
            f.write("\n")

            numberOfCasesSeen += 1

        except Exception as e:
            unfoundCases += 1
            if unfoundCases % 25 == 0:
                print(unfoundCases)


f1 = open("allCitations.txt", "w")
f1.write(str(citationSet))
f1.close()

print()
print("finished")
print()

print(citationSet)
print(len(citationSet))

driver.close()

import mysql.connector

mydb = mysql.connector.connect(
    host = "localhost",
    user = "root",
    password = "status6)Which",
    database = "cases"
)

mycursor = mydb.cursor()

total_case_text_length = 0
cases_submitted_to_db = 0

for caseFileNumber in range(14, 20):
    caseFileOn = str(caseFileNumber) + '-cleanedCourtCase.txt'
    f = open(caseFileOn, "r")

    sectionOn = 0

    report_number = ''
    name = ''
    date_decided = ''
    caseText = ''
    dateSeen = False

    for line in f:

        if "=======================================================" in line:

            total_case_text_length += len(caseText)
            cases_submitted_to_db += 1

            if len(caseText) > 65000:
                # print("long case", name)
                while len(caseText) > 65000:
                    casePortion = caseText[:65000]
                    caseText = caseText[65000:]

                    sql = "INSERT INTO supreme_court_cases (report_number, name, date_decided, case_text) VALUES (%s, %s, %s, %s)"
                    val = (report_number, name, date_decided, casePortion)
                    mycursor.execute(sql, val)
                    mydb.commit()
            else:
                sql = "INSERT INTO supreme_court_cases (report_number, name, date_decided, case_text) VALUES (%s, %s, %s, %s)"
                val = (report_number, name, date_decided, caseText)
                mycursor.execute(sql, val)
                mydb.commit()

            sectionOn = -1
            report_number = ''
            name = ''
            date_decided = ''
            caseText = ''
            dateSeen = False
            continue

        if sectionOn == 0:
            report_number = line.replace('\n', '')
        if 1 <= sectionOn <= 4:
            if "/" in line:
                date_decided = line.replace('\n', '')
                dateSeen = True
            elif line == '\n':
                sectionOn = 4
            else:
              name += line.replace('\n', ' ')

            if sectionOn == 4 and dateSeen == False:
                sectionOn -= 1

        if sectionOn > 4 and len(line.split(' ')) <= 1:
            caseText += '\n'
            continue
        if sectionOn > 4:
            caseText += line

        sectionOn += 1

    print(caseFileOn)
    print("total characters seen in case texts:", total_case_text_length)
    print("number of cases submitted so far:", cases_submitted_to_db)

    f.close()
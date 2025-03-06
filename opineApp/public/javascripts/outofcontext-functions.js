function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function generateQuote(casetext, shouldinclude, numberofcharacters){
    var indices = [];
    var index = casetext.toLowerCase().indexOf(shouldinclude.toLowerCase(), 0);
    while(index != -1){
        indices.push(index);
        index = casetext.toLowerCase().indexOf(shouldinclude.toLowerCase(), index+1);
    }

    var part = getRandomInt(indices.length);
    var wordplace = indices[part];
    var start = wordplace;

    while(start >= 0 && casetext[start] != "." && casetext[start] != "!" && casetext[start] != "?"){
        start -= 1;
    }
    start += 2;

    var end = Math.max(start + parseInt(numberofcharacters), wordplace+1);
    while(end < casetext.length && casetext[end] != "." && casetext[end] != "!" && casetext[end] != "?"){
        end += 1;
    }
    end += 1;

    var casequote = casetext.substring(start, end);
    var beforecase = casetext.substring(Math.max(0, start - getRandomInt(100)-100), start);
    var aftercase = casetext.substring(end, Math.min(casetext.length, end + getRandomInt(100) + 100))
    return [beforecase, casequote, aftercase];
}

function typewriteCase(caseparts, ele) {

    var partone = caseparts[0];
    var parttwo = caseparts[1];
    var partthree = caseparts[2];

    var spansone = '<span class="fadeInDiv"><span class="aroundCaseQuote">' + partone.split('').join('</span><span class="aroundCaseQuote">') + '</span></span>';
    var spanstwo = '<span class="caseQuoteText">' + parttwo.split('').join('</span><span class="caseQuoteText">') + '</span>';
    var spansthree = '<span class="fadeInDiv"><span class="aroundCaseQuote">' + partthree.split('').join('</span><span class="aroundCaseQuote">') + '</span></span>';

    $(spansone).appendTo('#'+ele);
    $(spanstwo).hide().appendTo('#'+ele).each(function (i) {
        $(this).delay(50 * i + 3200).css({
            display: 'inline',
            opacity: 0
        }).animate({
            opacity: 1
        }, 50);
    });
    $(spansthree).appendTo('#'+ele);
}

async function revealCitation(casename, casenameid, datedecided, datedecidedid){
    var namespan = '<span class="fadeInDiv">' + casename + '</span>';
    var datespan = '<span class="fadeInDiv">' + datedecided + '</span>';

    $(namespan).appendTo('#'+casenameid);
    $(datespan).appendTo('#'+datedecidedid);
}

async function getNoContextQuote(){
    try{
        var shouldinclude = document.getElementById('shouldInclude').value;
        var numberofcharacters = document.getElementById('amountOfCharacters').value;

        var url = 'http://localhost:8080/outofcontext/' + shouldinclude;
        const response = await fetch(url);
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        const json = await response.json();

        var randindex = getRandomInt(json.length);
        const casetext = json[randindex].case_text;
        var caseparts = generateQuote(casetext, shouldinclude, numberofcharacters);
        var casename = json[randindex].name;
        var datedecided = json[randindex].date_decided;

        document.getElementById('caseName').innerHTML = null;
        document.getElementById('caseDateDecided').innerHTML = null;
        document.getElementById('toggleDiv').style.display = 'block';
        document.getElementById('caseQuote').innerHTML = null;

        console.log(caseparts);
        typewriteCase(caseparts, 'caseQuote');
        revealCitation(casename, 'caseName', datedecided, 'caseDateDecided');
    } catch (error) {
        console.error(error.message);
    }
}

function addButtonListeners() {
    var caseButtons = document.getElementsByClassName("noContextButton");
    for(let i = 0; i < caseButtons.length; i ++){
        caseButtons[i].addEventListener("click", getNoContextQuote);
    }
}

// window.addEventListener("load", addButtonListeners);
window.onload = function (){
    addButtonListeners();
    const sliderInput = document.getElementById('amountOfCharacters');
    const sliderValue = document.getElementById('rangeSelection');

    sliderInput.addEventListener("input", (event) => {
        const tempSliderValue = event.target.value; 
        sliderValue.textContent = tempSliderValue;
    });
}
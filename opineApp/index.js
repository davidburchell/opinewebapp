const { response } = require('express');
const path = require('path');
const express = require ('express');
const app = express();
const port = 3000;

async function getData(url) {
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error('Network response was not ok');
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error.message);
    }
}
async function getTextFromNumber(reportNumber){
    try{
        var url = 'http://localhost:8080/casetext/' + reportNumber;
        const response = await fetch(url);
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error.message);
    }
}

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {

    const getApiUrl = 'http://localhost:8080/home';
    var newCases = await getData(getApiUrl);

    res.render('index', {inputCases: newCases});
});
app.get('/case/:caseNumber', async (req, res) => {
    var caseNumber = req.params.caseNumber;
    var casesInvolved = await getTextFromNumber(caseNumber);

    var caseText = "";
    for(var i = 0; i < casesInvolved.length; i ++){
        caseText += casesInvolved[i].case_text;
    }

    res.render('casePage', {caseNumber: caseNumber, caseName: casesInvolved[0].name, caseText: caseText});
});
app.get('/outofcontext', async (req, res) => {
    res.render('outofcontextPage');
});

app.listen(port, () => {
    console.log(`Opine app listening on port ${port}`);
});
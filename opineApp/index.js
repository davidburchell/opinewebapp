const { response } = require('express');
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
        // console.log(json);
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

app.listen(port, () => {
    console.log(`Opine app listening on port ${port}`);
});
const axios = require('axios');
const fs = require('fs');
const now = require('performance-now');
const wordObj = require('./wordObj.js');


const WAITTIME = 0; // In milliseconds
const STARTFROMPAGE = 1; // 1 by defualt
const SAVEEVERY = 10 // 10 by default
const LIST_OBJECT_LENGTHS = true;

const allWords = new wordObj();
let tempWordObject = new wordObj();
let pageMax = 0;

if (LIST_OBJECT_LENGTHS) {
    let testObj = new wordObj();
    testObj.concat(JSON.parse(fs.readFileSync('words.json')))    
    for (var key of Object.keys(testObj)) {
        console.log(`${key.match(/SO|Dalin|SAOL|\d\d|\d/g).reduce((a, b) => a + " " + b)} is of length ${testObj[key].length}`)
    }
    console.log(`Total word amount: ${testObj.length()}`)
} else {
    main();
}

async function main() {
    let lastInfo = JSON.parse(fs.readFileSync("lastsession.json"))
    let iframeStr = await getiframe(1);
    pageMax = Number(iframeStr.match(/\(av.+\)/)[0].match(/[0-9]+/)[0]);

    if (lastInfo == undefined) {
        console.log("The amount of pages is " + pageMax);
        console.log("Starting scraping...");

        scrap(STARTFROMPAGE, pageMax);
    } else {
        console.log("Starting scraping...");
        console.log("Found old scraped info, starting from page " + lastInfo.lastTime + ". When " + lastInfo.maxPages + " words where scraped.")
        
        allWords.concat(JSON.parse(fs.readFileSync("words.json")));
        lastInfo.maxPages >= pageMax ? scrap(lastInfo.lastTime, lastInfo.maxPages) : scrap(lastInfo.lastTime, pageMax);
    }
    console.log('Done Scraping!')

}

async function scrap(n) {
    const startFetch = now()
    let currIframe = await getiframe(n);
    const fetchTime = now() - startFetch;
    
    const startConcat = now()
    tempWordObject.concat(getwordsFromIframe(currIframe));
    const concatTime = now() - startConcat;

    console.log(`Time to fetch: ${fetchTime.toFixed(3)}, Time to concat: ${concatTime.toFixed(3)}`)
    // console.log("Words scraped: " + allWords.length() + ". " + n + " pages have been scraped.");
    //console.log("Pages scraped: " + n);

    if (n % SAVEEVERY == 0) {
        allWords.concat(tempWordObject);
        tempWordObject = new wordObj();
        fs.writeFile('words.json', JSON.stringify(allWords), (err) => {
            if (err) throw err;
            console.log('File now contains the latest info from ' + n + " pages.");
        });
        fs.writeFile('lastsession.json', JSON.stringify({lastTime: n, maxPages: pageMax}), (err) => {
            if (err) throw err;
            console.log('Settings saved!');
        });
    }

    if (n <= pageMax) {
        setTimeout(scrap, WAITTIME - fetchTime/100, n + 1);
    }
}


function getwordsFromIframe(iframe) {
    let tempWords = new wordObj(); // Array of objects
    let matcheswords = iframe.match(/o">[\s \S]+?<\/a/g);
    let rawMatches = iframe.match(/l;">.+?<\/td>/g);

    let matchesBooks = []
    for (let i = 0; i < rawMatches.length; i++) {
        const element = rawMatches[i];
        let cutString = element.substring(4, element.length - 5);
        matchesBooks.push(cutString.match(/[^,\ "]+/g));
    }

    for (let i = 0; i < matcheswords.length; i++) {
        const rawWord = matcheswords[i];
        let word = rawWord.match(/>.*?</)[0];
        word = word.substring(1, word.length - 1);
        let books = matchesBooks[i];

        tempWords.addToBooks(books, word);
    }
    return tempWords;
}

function getiframe(p) {
    return new Promise(resolve => {
        let currUrl = getSearchString(p);
        axios.request({
                method: 'GET',
                url: currUrl,
                responseType: 'document',
                responseEncoding: 'binary',
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    })
}

function getSearchString(p) {
    return "https://spraakbanken.gu.se/saolhist/lista_ord_bok.php?p=" + p + "&submitbn=lista_ord_bok.php&fr=a&till=%F6%F6&limit=5000&med=Dalin','SAOL01','SAOL06','SAOL07','SAOL08','SAOL09','SAOL10','SAOL11','SAOL12','SAOL13','SAOL14','SO&inte=tom&finns=Dalin','SAOL01','SAOL06','SAOL07','SAOL08','SAOL09','SAOL10','SAOL11','SAOL12','SAOL13','SAOL14','SO&lemma=%&inte_alla=OFF&endast_olika=OFF&order=0&mode=SAOLprod&urval=0"
}



const fs = require('fs');
let wordObj = require('./wordObj.js');

const mainObj = new wordObj();
console.log("Reading the file")
mainObj.concat(JSON.parse(fs.readFileSync('words.json')))
let allArr = [];

for (const key of Object.keys(mainObj)) {
    const current = mainObj[key].map(n=>n.toLowerCase())
    console.log("Wrting to: " + key)
    const wholeStr = current.reduce((a, b) => a + "\n" + b.replace("|", ""))
    allArr = allArr.concat(current)
    fs.writeFileSync(`../${key}.txt`, wholeStr);
}
console.log(allArr.length)

fs.writeFileSync('../allWords.txt', allArr.sort().map(n => n.replace("|", "")).sort().reduce((a, b, i , arr) => {
    if (i === 0) {
        return a + "\n" + b;
    } else if (b == arr[i - 1]) {
        return a;
    } else {
        return a + "\n" + b;
    }
}));
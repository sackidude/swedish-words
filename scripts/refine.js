const fs = require('fs');

let startTxt = fs.readFileSync("allWords.txt").toString();
fs.writeFileSync("allWords.txt", startTxt.split("\n").filter(n => !n.includes("(")).sort().reduce((a, b, i, arr) => {
    if (i === 0) {
        return a + "\n" + b;
    } else if (b == arr[i - 1]) {
        return a;
    } else {
        return a + "\n" + b;
    }
}));
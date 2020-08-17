const fs = require('fs');

const text = fs.readFileSync("../words.txt").toString();

fs.writeFileSync("../words.json", JSON.stringify({ words: text.split("\n") }));
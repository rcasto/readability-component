const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;

const fsReadFileAsync = promisify(fs.readFile);
const fsWriteFileAsync = promisify(fs.writeFile);

const mobyHyphenationListFilePath = path.resolve(__dirname, './moby-hyphenation-list.txt');
const outputFilePath = path.resolve(__dirname, './syllableCount.json');
const hyphenDelimiterRegex = /¥/g;

fsReadFileAsync(mobyHyphenationListFilePath, {
    encoding: 'utf8'
})
.then(txt => txt.split('\n'))
.then(words => words.map(word => word.replace(hyphenDelimiterRegex, ' ')))
.then(words => words.reduce((wordMap, word) => {
    const wordTokens = word.trim().split(' ');
    const wordKey = wordTokens.join('').toLowerCase();
    const numSyllables = wordTokens.length;
    wordMap[wordKey] = numSyllables;
    return wordMap;
}, {}))
.then(words => fsWriteFileAsync(outputFilePath, JSON.stringify(words), 'utf8'))
.catch(err => console.error(err));
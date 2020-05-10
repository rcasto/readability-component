const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;

const fsReadFileAsync = promisify(fs.readFile);
const fsWriteFileAsync = promisify(fs.writeFile);

const mobyHyphenationListFilePath = path.resolve(__dirname, './moby-hyphenation-list.txt');
const outputFilePath = path.resolve(__dirname, './syllableCount.json');
const hyphenDelimiterRegex = /¥/g;
const syllableCountThreshold = 3;

const vowelRegex = /[aeiouy]+/g;

let numWords = 0;
let numCorrect = 0;

function prettyPrint(obj) {
    return JSON.stringify(obj, null, 2);
}

function getNumSyllables(word) {
    word = word || '';

    const wordLength = word.length;
    let numSyllables = 0;

    // substitute 'a' as the universal vowel
    // replacing consecutive vowels with a single occurrence
    const vowelReplacedWord =
        word.replace(vowelRegex, 'a');
    const vowelReplacedWordLength = vowelReplacedWord.length;

    for (let i = 0; i < vowelReplacedWordLength; i++) {
        if (vowelReplacedWord[i] === 'a') {
            numSyllables++;
        }
    }

    // At this point, numSyllables essentially
    // is equivalent to the number of consolidated vowels

    // remove silent 'e' heuristic
    if (
        numSyllables >= 2 &&
        word[wordLength - 1] === 'e'
    ) {
        return getNumSyllables(word.slice(0, wordLength - 1));
    }
    // remove silent 'ed' heuristic
    else if (
        numSyllables >= 2 &&
        word[wordLength - 2] === 'e' &&
        word[wordLength - 1] === 'd'
    ) {
        return getNumSyllables(word.slice(0, wordLength - 2));
    }

    return numSyllables;
}

fsReadFileAsync(mobyHyphenationListFilePath, {
    encoding: 'utf8'
})
.then(txt => txt.split('\n'))
.then(words => words.map(word => word.replace(hyphenDelimiterRegex, ' ')))
.then(words => words.reduce((wordMap, word) => {
    const wordTokens = word.trim().split(' ');
    const wordKey = wordTokens.join('').toLowerCase();
    const numSyllables = wordTokens.length;
    const numCalculatedSyllabled = getNumSyllables(wordKey);

    // filter out words with hyphens in them
    // don't include them in accuracy check either
    //
    // This is mainly another way to try and trim the data size
    // slightly
    if (wordKey.includes('-')) {
        return wordMap;
    }

    // filter out words that have a syllable count greater
    // than the set threshold
    // These will no be included in accuracy check
    if (numSyllables > syllableCountThreshold) {
        return wordMap;
    }

    // filter out words that the heuristic is correct on
    // but use them for accuracy calculation
    if (numSyllables === numCalculatedSyllabled) {
        numCorrect++;
    } else {
        wordMap[wordKey] = numSyllables;
    }

    numWords++;

    return wordMap;
}, {}))
.then(words => fsWriteFileAsync(outputFilePath, prettyPrint(words), 'utf8'))
.then(() => console.log(numCorrect, numWords - numCorrect, numWords, numCorrect / numWords * 100))
.catch(err => console.error(err));
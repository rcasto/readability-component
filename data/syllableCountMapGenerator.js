const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;

const fsReadFileAsync = promisify(fs.readFile);
const fsWriteFileAsync = promisify(fs.writeFile);

const mobyHyphenationListFilePath = path.resolve(__dirname, './moby-hyphenation-list.txt');
const commonWordsFilePath = path.resolve(__dirname, './common-english-words.txt');
const outputFilePath = path.resolve(__dirname, './syllableCount.json');
const hyphenDelimiter = '¥';
const nonLetterSpaceOrDelimiterRegex = /[^a-z ¥]/g;
const syllableCountThreshold = 6;

const vowelRegex = /[aeiouy]+/g;
const whitespaceRegex = /\s+/g;

let numWords = 0;
let numWordsFilteredOut = 0;
let numCorrect = 0;
let incorrectWordsThatAreCommon = 0;
let incorrectSyllableCountDistance = 0;

function normalizeText(text) {
    return (text || '')
        .toLowerCase()
        .trim()
        .replace(nonLetterSpaceOrDelimiterRegex, '')
        .replace(whitespaceRegex, ' ')
        .trim();
}

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
.then(words => words.map(word => normalizeText(word)))
.then(words => words.reduce((wordMap, word) => {
    const wordTokens = word
        .trim()
        .split(hyphenDelimiter)
        .filter(wordToken => !!wordToken);
    const wordKey = wordTokens.join('');
    const numSyllables = wordTokens.length;
    const numCalculatedSyllables = getNumSyllables(wordKey);

    // filter out words with hyphens in them
    // don't include them in accuracy check either
    //
    // also filter out words that have spaces in them
    //
    // This is mainly another way to try and trim the data size
    // slightly
    if (wordKey.includes('-') ||
        wordKey.includes(' ')) {
        numWordsFilteredOut++;
        return wordMap;
    }

    // filter out words that have a syllable count greater
    // than the set threshold
    // These will no be included in accuracy check
    if (numSyllables > syllableCountThreshold) {
        numWordsFilteredOut++;
        return wordMap;
    }

    // filter out words that the heuristic is correct on
    // but use them for accuracy calculation
    if (numSyllables === numCalculatedSyllables) {
        numCorrect++;
    } else {
        incorrectSyllableCountDistance += Math.abs(numSyllables - numCalculatedSyllables);
        wordMap[wordKey] = numSyllables;
    }

    numWords++;

    return wordMap;
}, {}))
.then(async wordMap => {
    const commonWordsString = await fsReadFileAsync(commonWordsFilePath, {
        encoding: 'utf8'
    });
    const popularWordMap = {};

    commonWordsString
        .split('\n')
        .map(commonWord => normalizeText(commonWord))
        .forEach(commonWord => {
            if (wordMap[commonWord]) {
                popularWordMap[commonWord] = wordMap[commonWord];
                incorrectWordsThatAreCommon++;
            }
        });

    return popularWordMap;
})
.then(wordMap => fsWriteFileAsync(outputFilePath, prettyPrint(wordMap), 'utf8'))
.then(() => {
    const numIncorrect = numWords - numCorrect;
    console.log(`# correct:\t\t\t\t\t${numCorrect}`);
    console.log(`# wrong:\t\t\t\t\t${numIncorrect}`);
    console.log(`# common words wrong:\t\t\t\t${incorrectWordsThatAreCommon}`);
    console.log(`# words used for calculation:\t\t\t${numWords}`);
    console.log(`# words filtered out:\t\t\t\t${numWordsFilteredOut}`);
    console.log(`# total words in corpus:\t\t\t${numWords + numWordsFilteredOut}`);
    console.log(`% correct overall:\t\t\t\t${numCorrect / numWords * 100}`);
    console.log(`average incorrect syllable count difference:\t${incorrectSyllableCountDistance / numIncorrect}`);
})
.catch(err => console.error(err));
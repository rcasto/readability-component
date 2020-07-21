import wordSyllableCountCorpus from '../data/syllableCount.json';

// Normalization Regular Expressions
const whitespaceRegex = /\s+/g;
const apostropheRegex = /\'/g;
const ellipsisRegex = /\.{2,4}/g;
const nonLetterOrTerminalRegex = /[^a-z\.]/g;
const terminalPunctuationRegex = /[\.\?!\n\r]+/g; // https://www.thepunctuationguide.com/

// Syllable Count Regular Expressions
const vowelRegex = /[aeiouy]+/g;

// https://en.wikipedia.org/wiki/Words_per_minute#Reading_and_comprehension
const averageWordsPerMinute = 180;
const readabilityConstantFactor = 206.835;
const readabilityAverageWordsPerSentenceFactor = 1.015;
const readabilityAverageSyllablesPerWordFactor = 84.6;

export function getReadabilityInfo(text) {
    const normalizedText = normalizeText(text);
    const readabilityRatingInfo = getReadability(normalizedText);
    return {
        ...readabilityRatingInfo,
        averageTimeToRead: getAverageTimeToRead(readabilityRatingInfo.numWords)
    };
}

export function normalizeText(text) {
    return (text || '')
        .toLowerCase()
        .trim()
        .replace(apostropheRegex, '')
        .replace(ellipsisRegex, ' ')
        .replace(terminalPunctuationRegex, '.')
        .replace(nonLetterOrTerminalRegex, ' ')
        .replace(whitespaceRegex, ' ')
        .trim();
}

function getAverageTimeToRead(numWords) {
    const averageTime = Math.ceil(numWords / averageWordsPerMinute);
    return `${averageTime} min.`;
}

function getReadability(text) {
    const numWords = getNumWords(text);
    const numSentences = getNumSentences(text);
    const numSyllables = getNumSyllablesFromText(text);

    const readabilityRatingRaw = (
        readabilityConstantFactor -
        readabilityAverageWordsPerSentenceFactor * (numWords / numSentences) -
        readabilityAverageSyllablesPerWordFactor * (numSyllables / numWords)
    );

    return {
        numWords,
        numSentences,
        numSyllables,
        readabilityRating: getReadabilityMapping(readabilityRatingRaw),
        readabilityRatingRaw
    };
}

// https://web.archive.org/web/20160712094308/http://www.mang.canterbury.ac.nz/writing_guide/writing/flesch.shtml
function getReadabilityMapping(readability) {
    if (isNaN(readability)) {
        return 'Nothing to read';
    }

    if (readability >= 90) {
        return 'Very easy to read';
    } else if (readability < 90 && readability >= 80) {
        return 'Easy to read';
    } else if (readability < 80 && readability >= 70) {
        return 'Fairly easy to read';
    } else if (readability < 70 && readability >= 60) {
        return 'Plain English';
    } else if (readability < 60 && readability >= 50) {
        return 'Fairly difficult to read';
    } else if (readability < 50 && readability >= 30) {
        return 'Difficult to read';
    } else if (readability < 30 && readability >= 10) {
        return 'Very difficult to read';
    }
    return 'Extremely difficult to read';
}

function getWords(text) {
    return (text || '')
        .replace('.', ' ')
        .split(whitespaceRegex)
        .filter(word => (word || '').trim());
}

function getSentences(text) {
    return (text || '')
        .split('.')
        .filter(sentence => (sentence || '').trim());
}

function getNumWords(text) {
    return getWords(text).length;
}

function getNumSentences(text) {
    return getSentences(text).length;
}

function getNumSyllablesFromText(text) {
    const words = getWords(text);
    return words.reduce((numSyllables, word) => {
        return numSyllables + getNumSyllables(word);
    }, 0);
}

export function getNumSyllables(word, bypassCorpus = false) {
    word = word || '';

    // Look up word in corpus, if it's there
    // use its recorded syllable count, otherwise
    // procceed onward to use heuristic
    if (!bypassCorpus && wordSyllableCountCorpus[word]) {
        return wordSyllableCountCorpus[word];
    }

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
const vowels = new Set([
    'a',
    'e',
    'i',
    'o',
    'u'
]);
const diphthongs = new Set([
    'ee',
    'ea',
    'oo',
    'ou',
    'ow',
    'ie',
    'ay',
    'oi',
]);
const triphthongs = new Set([
    'eau',
    'iou',
    'our',
    'ire',
    'ier'
]);
const digitRegex = /\d+/g;
const dotRegex = /\.+/g;
const whitespaceRegex = /[ \t]+/g;
// https://www.thepunctuationguide.com/
const terminalPunctuationRegex = /[\.\?!\n]/g;
const nonTerminalPunctuationWhitespaceReplaceRegex = /\/|\.{2,4}/g;
const nonTerminalPunctuationEmptyReplaceRegex = /[\"\',;\:\-_\[\]\(\)\{\}<>]/g;

// https://en.wikipedia.org/wiki/Words_per_minute#Reading_and_comprehension
const averageWordsPerMinute = 180;
const readabilityConstantFactor = 206.835;
const readabilityAverageWordsPerSentenceFactor = 1.015;
const readabilityAverageSyllablesPerWordFactor = 84.6;

export function getReadabilityInfo(text) {
    const normalizedText = normalizeText(text);
    return {
        ...getReadability(normalizedText),
        averageTimeToRead: getAverageTimeToRead(normalizedText)
    };
}

export function normalizeText(text) {
    return (text || '')
        .toLowerCase()
        .trim()
        .replace(digitRegex, '')
        .replace(nonTerminalPunctuationWhitespaceReplaceRegex, ' ')
        .replace(nonTerminalPunctuationEmptyReplaceRegex, '')
        .replace(terminalPunctuationRegex, '.')
        .replace(dotRegex, '.')
        .replace(whitespaceRegex, ' ')
        .trim();
}

function getAverageTimeToRead(text) {
    const averageTime = Math.ceil(getNumWords(text) / averageWordsPerMinute);
    return `${averageTime} min.`;
}

function getReadability(text) {
    const numWords = getNumWords(text);
    const numSentences = getNumSentences(text);
    const numSyllables = getNumSyllablesFromText(text);

    const readability = (
        readabilityConstantFactor -
        readabilityAverageWordsPerSentenceFactor * (numWords / numSentences) -
        readabilityAverageSyllablesPerWordFactor * (numSyllables / numWords)
    );
    return {
        readabilityRating: getReadabilityMapping(readability),
        readabilityRatingRaw: readability
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
    }
    return 'Very difficult to read';
}

function getWords(text) {
    return (text || '')
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

function getNumSyllables(word) {
    const wordLength = (word || '').length;
    let numSyllables = 0;
    let tmpStr;

    for (let i = 0; i < wordLength; i++) {
        if (vowels.has(word[i])) {
            numSyllables++;
        }
        if (i + 1 < wordLength) {
            tmpStr = word.substring(i, i + 2);
            if (diphthongs.has(tmpStr)) {
                numSyllables--;
            }
        }
        if (i + 2 < wordLength) {
            tmpStr = word.substring(i, i + 3);
            if (triphthongs.has(tmpStr)) {
                numSyllables--;
            }
        }
    }

    return numSyllables;
}
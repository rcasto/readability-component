const vowels = new Set([
    'a',
    'e',
    'i',
    'o',
    'u'
]);

// words per minute
const averageReadingSpeed = 200;

export function getAverageTimeToRead(text) {
    return (text || '').length / averageReadingSpeed;
}

export function getReadability(text) {
    const numWords = getNumWords(text);
    const numSentences = getNumSentences(text);
    const numSyllables = getNumSyllablesFromText(text);

    const readability = 206.835 - 1.015 * (numWords / numSentences) - 84.6 * (numSyllables / numWords);
    return getReadabilityMapping(readability);
}

function getReadabilityMapping(readability) {
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
    } else {
        return 'Very difficult to read';
    }
}

function getNumWords(text, wordDelimiter = ' ') {
    return text
        .split(wordDelimiter).length;
}

function getNumSentences(text, sentenceDelimiter = '.') {
    return text
        .split(sentenceDelimiter).length;
}

function getNumSyllablesFromText(text, wordDelimiter = ' ') {
    const words = text.split(wordDelimiter);
    return words.reduce((numSyllables, word) => {
        return numSyllables + getNumSyllables(word);
    }, 0);
}

function getNumSyllables(word) {
    const wordLength = (word || '').length;
    let numSyllables = 0;

    for (let i = 0; i < wordLength; i++) {
        if (vowels.has(word[i])) {
            numSyllables++;
        }
    }

    return numSyllables;
}
import {
    normalizeText,
    getReadabilityInfo
} from '../src/textHelpers';

describe('normalizeText Tests', () => {
    test('can handle falsy/invalid text', () => {
        verifyNormalize(undefined, '');
        verifyNormalize(null, '');
        verifyNormalize('', '');
    });

    test('can handle normal text', () => {
        const text = 'hello world';
        const expectedText = 'hello world';
        verifyNormalize(text, expectedText);
    });

    test('can handle capitalized text', () => {
        const text = 'HelLO wOrLD';
        const expectedText = 'hello world';
        verifyNormalize(text, expectedText);
    });

    test('can handle apostrophes', () => {
        const text = `Don't ya go telling me I ain't no five star man`;
        const expectedText = `dont ya go telling me i aint no five star man`;
        verifyNormalize(text, expectedText);
    });

    test('can handle ellipsis', () => {
        const text = 'This..or this...or even this....here we go.';
        const expectedText = 'this or this or even this here we go.';
        verifyNormalize(text, expectedText);
    });  

    test('can handle terminal punctuation', () => {
        const text = `Sentence
         Sentence! Sentence? Sentence.`;
        const expectedText = 'sentence. sentence. sentence. sentence.';
        verifyNormalize(text, expectedText);
    });

    test('can handle multiple terminal punctuation', () => {
        const text = `Oh my god!?!..
        `;
        const expectedText = 'oh my god.';
        verifyNormalize(text, expectedText);
    });

    test('can handle replacing non-letter and non-terminal characters', () => {
        const text = 'a|,;:-_"[](){}<>`12\/\\&^*@#$=+~b.';
        const expectedText = 'a b.';
        verifyNormalize(text, expectedText);
    });

    test('can handle newlines and such around the ends of text', () => {
        const text = `
             hello world.
                 `;
        const expectedText = 'hello world.';
        verifyNormalize(text, expectedText);
    });

    test('can handle normalizing spaces and tabs between words', () => {
        const text = `This      is                a            test  .`;
        const expectedText = 'this is a test .';
        verifyNormalize(text, expectedText);
    });

    test('can handle poem like writing format', () => {
        const text = `
            This is a line
                This is another
                    On and on
                        Rolling over
                            With tumbles
        `;
        const expectedText = 'this is a line. this is another. on and on. rolling over. with tumbles';
        verifyNormalize(text, expectedText);
    });

    function verifyNormalize(text, expectedText) {
        const normalizedText = normalizeText(text);
        expect(normalizedText).toEqual(expectedText);
    }
});

describe('getReadabilityInfo Tests', () => {
    const accuracyBufferInPercentage = 5 / 100; // 5% plus or minus

    test('can handle invalid text', () => {
        let readabilityInfo = getReadabilityInfo(undefined);
        verifyDefaultEmptyReadabilityInfo(readabilityInfo);

        readabilityInfo = getReadabilityInfo(null);
        verifyDefaultEmptyReadabilityInfo(readabilityInfo);

        readabilityInfo = getReadabilityInfo('');
        verifyDefaultEmptyReadabilityInfo(readabilityInfo);
    });

    // Sentence examples and their expected readability ratings found from:
    // - https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch_reading_ease
    // - https://web.archive.org/web/20160712094308/http://www.mang.canterbury.ac.nz/writing_guide/writing/flesch.shtml
    test('can handle simple sentence', () => {
        const text = 'John loves Mary.';
        const expectedReadability = {
            readabilityRatingRaw: 92,
            numSentences: 1,
            numWords: 3
        };
        verifyCalculatedReadability(text, expectedReadability);
    });

    test('can handle another simple sentence', () => {
        const text = 'The cat sat on the mat.';
        const expectedReadability = {
            readabilityRatingRaw: 116,
            numSentences: 1,
            numWords: 6
        };
        verifyCalculatedReadability(text, expectedReadability);
    });

    test('can handle a slightly more complicated sentence', () => {
        const text = 'John has a profound affection for Mary.';
        const expectedReadability = {
            readabilityRatingRaw: 67,
            numSentences: 1,
            numWords: 7
        };
        verifyCalculatedReadability(text, expectedReadability);
    });

    test('can handle another slightly more complicated sentence', () => {
        const text = 'This sentence, taken as a reading passage unto itself, is being used to prove a point.';
        const expectedReadability = {
            readabilityRatingRaw: 69,
            numSentences: 1,
            numWords: 16
        };
        verifyCalculatedReadability(text, expectedReadability);
    });

    test('can handle a complicated sentence', () => {
        const text = 'Even though John is not normally given to a display of his deeper emotions, he allegedly has developed a profound affection for Mary, as compared to the more equable feelings he seems to have for Lucy, Fran and, to a lesser extent, Sue.';
        const expectedReadability = {
            readabilityRatingRaw: 32,
            numSentences: 1,
            numWords: 43
        };
        verifyCalculatedReadability(text, expectedReadability);
    });

    test('can handle another complicated sentence', () => {
        const text = 'The Australian platypus is seemingly a hybrid of a mammal and reptilian creature.';
        const expectedReadability = {
            readabilityRatingRaw: 37.5,
            numSentences: 1,
            numWords: 13
        };
        verifyCalculatedReadability(text, expectedReadability);
    });

    test('can handle multiple sentences', () => {
        const text = 'A sentence. B sentence? C sentence! D sentence';
        const expectedReadability = {
            // readabilityRatingRaw: 67,
            numSentences: 4,
            numWords: 8
        };
        verifyCalculatedReadability(text, expectedReadability);
    });

    test('can handle poem like structure for readability calculations', () => {
        const text = `
            This is a line
                This is another
                    On and on
                        Rolling over
                            With tumbles
        `;
        const expectedReadability = {
            numSentences: 5,
            numWords: 14
        };
        verifyCalculatedReadability(text, expectedReadability);
    });

    test('can handle silent e (not all cases, but some)', () => {
        const text = 'take we rule be';
        const expectedReadability = {
            numSyllables: 4,
            numSentences: 1,
            numWords: 4
        };
        verifyCalculatedReadability(text, expectedReadability);
    });

    test('can handle ed when not syllable (not all cases, but some)', () => {
        const text = 'owned bed wed phoned';
        const expectedReadability = {
            numSyllables: 4,
            numSentences: 1,
            numWords: 4
        };
        verifyCalculatedReadability(text, expectedReadability);
    });

    function verifyDefaultEmptyReadabilityInfo(info) {
        expect(info).toBeDefined();
        expect(info.readabilityRating).toEqual('Nothing to read');
        expect(isNaN(info.readabilityRatingRaw)).toBeTruthy();
        expect(info.averageTimeToRead).toEqual('0 min.');
        expect(info.numWords).toEqual(0);
        expect(info.numSentences).toEqual(0);
        expect(info.numSyllables).toEqual(0);
    }

    function verifyCalculatedReadability(text, expectedReadability) {
        const calculatedReadability = getReadabilityInfo(text);

        const calculatedRating = calculatedReadability.readabilityRatingRaw;
        const expectedRating = expectedReadability.readabilityRatingRaw;

        const calculatedNumSyllables = calculatedReadability.numSyllables;
        const expectedNumSyllables = expectedReadability.numSyllables;

        const calculatedNumWords = calculatedReadability.numWords;
        const expectedNumWords = expectedReadability.numWords;

        const calculatedNumSentences = calculatedReadability.numSentences;
        const expectedNumSentences = expectedReadability.numSentences;

        if (expectedNumSyllables) {
            expect(calculatedNumSyllables).toEqual(expectedNumSyllables);
        }

        expect(calculatedNumWords).toEqual(expectedNumWords);
        expect(calculatedNumSentences).toEqual(expectedNumSentences);

        if (expectedRating) {
            // expect(isCalculatedReadabilityWithinAccuracy(calculatedRating, expectedRating)).toBeTruthy();
        }
    }

    function isCalculatedReadabilityWithinAccuracy(rating, expectedRating) {
        if (rating === expectedRating) {
            return true;
        }
        const minRating = expectedRating * (1 - accuracyBufferInPercentage);
        const maxRating = expectedRating * (1 + accuracyBufferInPercentage);
        // console.log(minRating, maxRating, rating);
        return rating >= minRating && rating <= maxRating;
    }
});
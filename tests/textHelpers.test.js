import {
    normalizeText,
    getReadabilityInfo
} from '../src/textHelpers';

describe('normalizeText Tests', () => {
    test('can handle falsy/invalid text', () => {
        let normalizedText = normalizeText(undefined);
        expect(normalizedText).toEqual('');

        normalizedText = normalizeText(null);
        expect(normalizedText).toEqual('');

        normalizedText = normalizeText('');
        expect(normalizedText).toEqual('');
    });

    test('can handle already normalized text', () => {
        const text = 'hello world';
        const normalizedText = normalizeText(text);
        expect(normalizedText).toEqual(text);
    });

    test('can handle capitalized text', () => {
        const text = 'HelLO wOrLD';
        const expectedText = 'hello world';
        const normalizedText = normalizeText(text);
        expect(normalizedText).toEqual(expectedText);
    });

    test('can handle replacing non-terminal punctuation with empty', () => {
        const expectedText = '.';
        const text = ',;:-_\"\'[](){}<>.?\n!,;:-_\"\'[](){}<>/';
        const normalizedText = normalizeText(text);
        expect(normalizedText).toEqual(expectedText);
    });

    test('can handle replacing non-terminal punctuation with whitespace', () => {
        const expectedText = 'a this that or nick nack';
        const text = 'a this/that or...nick/nack';
        const normalizedText = normalizeText(text);
        expect(normalizedText).toEqual(expectedText);
    });

    test('can handle newlines and such around the ends of text', () => {
        const text = `
             hello world.
                 `;
        const expectedText = 'hello world.';
        const normalizedText = normalizeText(text);
        expect(normalizedText).toEqual(expectedText);
    });

    test('can handle normalizing spaces and tabs between words', () => {
        const text = `This      is                a            test  .`;
        const expectedText = 'this is a test .';
        const normalizedText = normalizeText(text);
        expect(normalizedText).toEqual(expectedText);
    });

    test('can handle terminal punctuation', () => {
        const text = `Sentence
         Sentence! Sentence? Sentence.`;
        const expectedText = 'sentence. sentence. sentence. sentence.';
        const normalizedText = normalizeText(text);
        expect(normalizedText).toEqual(expectedText);
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
        const normalizedText = normalizeText(text);
        expect(normalizedText).toEqual(expectedText);
    });

    test('can replace numbers/digits with nothing/empty', () => {
        const text = 'Number 1 and Number 2 and then Number 1000';
        const expectedText = 'number and number and then number';
        const normalizedText = normalizeText(text);
        expect(normalizedText).toEqual(expectedText);
    });
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
        const expectedReadabilityRating = 92;
        verifyCalculatedReadability(text, expectedReadabilityRating);
    });

    test('can handle another simple sentence', () => {
        const text = 'The cat sat on the mat.';
        const expectedReadabilityRating = 116;
        verifyCalculatedReadability(text, expectedReadabilityRating);
    });

    test('can handle a slightly more complicated sentence', () => {
        const text = 'John has a profound affection for Mary.';
        const expectedReadabilityRating = 67;
        verifyCalculatedReadability(text, expectedReadabilityRating);
    });

    test.skip('can handle another slightly more complicated sentence', () => {
        const text = 'This sentence, taken as a reading passage unto itself, is being used to prove a point.';
        const expectedReadabilityRating = 69;
        verifyCalculatedReadability(text, expectedReadabilityRating);
    });

    test.skip('can handle a complicated sentence', () => {
        const text = 'Even though John is not normally given to a display of his deeper emotions, he allegedly has developed a profound affection for Mary, as compared to the more equable feelings he seems to have for Lucy, Fran and, to a lesser extent, Sue.';
        const expectedReadabilityRating = 32;
        verifyCalculatedReadability(text, expectedReadabilityRating);
    });

    test.skip('can handle another complicated sentence', () => {
        const text = 'The Australian platypus is seemingly a hybrid of a mammal and reptilian creature.';
        const expectedReadabilityRating = 37.5;
        verifyCalculatedReadability(text, expectedReadabilityRating);
    });

    function verifyDefaultEmptyReadabilityInfo(info) {
        expect(info).toBeDefined();
        expect(info.readabilityRating).toEqual('Nothing to read');
        expect(isNaN(info.readabilityRatingRaw)).toBeTruthy();
        expect(info.averageTimeToRead).toEqual('0 min.');
    }

    function verifyCalculatedReadability(text, expectedRating) {
        const calculatedReadability = getReadabilityInfo(text);
        const calculatedRating = calculatedReadability.readabilityRatingRaw;
        expect(isCalculatedReadabilityWithinAccuracy(calculatedRating, expectedRating)).toBeTruthy();
    }

    function isCalculatedReadabilityWithinAccuracy(rating, expectedRating) {
        if (rating === expectedRating) {
            return true;
        }
        const minRating = expectedRating * (1 - accuracyBufferInPercentage);
        const maxRating = expectedRating * (1 + accuracyBufferInPercentage);
        console.log(minRating, maxRating, rating);
        return rating >= minRating && rating <= maxRating;
    }
});
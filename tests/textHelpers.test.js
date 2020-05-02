import {
    normalizeText
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
        const text = `Sentence 1
         Sentence 2! Sentence 3? Sentence 4.`;
        const expectedText = 'sentence 1. sentence 2. sentence 3. sentence 4.';
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
});
// import { getReadability } from './textHelpers';

const vowels = new Set([
  'a',
  'e',
  'i',
  'o',
  'u'
]);

function getReadability(text) {
  const numWords = getNumWords(text);
  const numSentences = getNumSentences(text);
  const numSyllables = getNumSyllablesFromText(text);

  return 206.835 - 1.015 * (numWords / numSentences) - 84.6 * (numSyllables / numWords);
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

customElements.define('read-ability',
  class extends HTMLElement {
    constructor() {
      super();

      const shadowRoot = this.attachShadow({ 
        mode: 'open'
      });
      const span = document.createElement('span');

      shadowRoot.appendChild(span);

      span.textContent = getReadability(this.textContent);
    }
  }
);
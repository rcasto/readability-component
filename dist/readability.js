(function () {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
  const diphthongs = new Set(['ee', 'ea', 'oo', 'ou', 'ow', 'ie', 'ay', 'oi']);
  const triphthongs = new Set(['eau', 'iou', 'our', 'ire', 'ier']);
  const wordDelimiterRegex = /\s+/;
  const sentenceDelimiterRegex = /[\.\?!\n]\n?/; // words per minute

  const averageReadingSpeed = 180;
  function getAverageTimeToRead(text) {
    const averageTime = Math.ceil((text || '').length / averageReadingSpeed);

    if (averageTime === 1) {
      return `About 1 minute to read`;
    }

    return `About ${averageTime} minutes to read`;
  }
  function getReadability(text) {
    text = normalizeText(text);
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
    }

    return 'Very difficult to read';
  }

  function getWords(text) {
    return text.split(wordDelimiterRegex).filter(word => !!word);
  }

  function getSentences(text) {
    return text.split(sentenceDelimiterRegex).filter(sentence => !!sentence);
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

  function normalizeText(text) {
    return (text || '').trim().toLowerCase();
  }

  const templateContent = `
  <style>
    .readability-container {
      display: flex;
      flex-direction: column;
    }
    .readability-container * {
      margin-left: auto;
    }
  </style>
  <div class="readability-container">
    <div class="readability-level"></div>
    <div class="readability-time"></div>
  </div>
  <slot name="readable-text"></slot>
`;
  const template = document.createElement('template');
  template.innerHTML = templateContent;

  class Readability extends HTMLElement {
    constructor() {
      super();

      _defineProperty(this, "observer", void 0);

      this.observer = new MutationObserver(() => this.setReadability(this.textContent));
    }

    connectedCallback() {
      const shadowRoot = this.attachShadow({
        mode: 'open'
      });
      const templateClone = template.content.cloneNode(true);
      shadowRoot.appendChild(templateClone);
      this.setReadability(this.textContent);
      this.observer.observe(this, {
        subtree: true,
        childList: true
      });
    }

    setReadability(text) {
      const readabilityLevelDiv = this.shadowRoot.querySelector('.readability-level');
      const readabilityAverageReadingTimeDiv = this.shadowRoot.querySelector('.readability-time');
      readabilityLevelDiv.textContent = getReadability(text);
      readabilityAverageReadingTimeDiv.textContent = getAverageTimeToRead(text);
    }

  }

  customElements.define('read-ability', Readability);

}());

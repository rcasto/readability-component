import { getReadability, getAverageTimeToRead } from './textHelpers.mjs';

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
  <slot name="readable-text"></slot>
  <div class="readability-container">
    <div class="readability-level"></div>
    <div class="readability-time"></div>
  </div>
`;

const template = document.createElement('template');
template.innerHTML = templateContent;

class Readability extends HTMLElement {
  observer;

  constructor() {
    super();

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
      childList: true,
    });
  }
  setReadability(text) {
    const readabilityLevelDiv = this.shadowRoot.querySelector('.readability-level');
    const readabilityAverageReadingTimeDiv = this.shadowRoot.querySelector('.readability-time');

    readabilityLevelDiv.textContent = getReadability(text);
    readabilityAverageReadingTimeDiv.textContent = `${getAverageTimeToRead(text)} minutes to read`;
  }
}

customElements.define('read-ability', Readability);
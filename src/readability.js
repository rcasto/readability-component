import { getReadability, getAverageTimeToRead } from './textHelpers.js';

const templateContent = `
  <style>
    .readability-container {
      display: flex;
      margin: var(--readability-margin, 0);
      font-size: var(--readability-font-size, 0.8em);
      font-weight: var(--readability-font-weight, lighter);
      opacity: var(--readability-opacity, 0.8);
      justify-content: var(--readability-justify-content, end);
    }
    .readability-container .readability-spacer {
      margin: var(--readability-spacer-margin, 0 6px);
      border: 1px solid;
    }
  </style>
  <div class="readability-container">
    <div class="readability-level"></div>
    <div class="readability-spacer"></div>
    <div class="readability-time"></div>
  </div>
  <slot name="readable-text"></slot>
`;

const template = document.createElement('template');
template.innerHTML = templateContent;

export default class Readability extends HTMLElement {
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
    readabilityAverageReadingTimeDiv.textContent = getAverageTimeToRead(text);
  }
}
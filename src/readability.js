import { getReadabilityInfo } from './textHelpers.js';

export default class Readability extends HTMLElement {
  static template = `
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
  /**
   * @type {HTMLTemplateElement}
   */
  static templateElem = null;
  static get observedAttributes() {
    return [
      'data-text'
    ];
  }

  constructor() {
    super();

    if (!Readability.templateElem) {
      Readability.templateElem = document.createElement('template');
      Readability.templateElem.innerHTML = Readability.template;
    }

    this.readabilityLevelDiv = null;
    this.readabilityAverageReadingTimeDiv = null;

    this.observer = new MutationObserver(() => this.setReadability());
  }
  connectedCallback() {
    // https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks
    if (!this.isConnected) {
      return;
    }

    const shadowRoot = this.attachShadow({
      mode: 'open'
    });
    const templateClone = template.content.cloneNode(true);

    shadowRoot.appendChild(templateClone);

    this.readabilityLevelDiv = shadowRoot.querySelector('.readability-level');
    this.readabilityAverageReadingTimeDiv = shadowRoot.querySelector('.readability-time');

    this.setReadability();

    this.observer.observe(this, {
      subtree: true,
      childList: true,
    });
  }
  attributeChangedCallback() {
    this.setReadability();
  }
  disconnectedCallback() {
    this.readabilityLevelDiv = null;
    this.readabilityAverageReadingTimeDiv = null;
    this.observer.disconnect();
  }
  getText() {
    const elemText = (this.textContent || '').trim();
    const attrText = (this.getAttribute('data-text') || '').trim();
    return elemText || attrText;
  }
  setReadability() {
    const { readabilityRating, averageTimeToRead } = getReadabilityInfo(this.getText());
    this.readabilityLevelDiv.textContent = readabilityRating;
    this.readabilityAverageReadingTimeDiv.textContent = averageTimeToRead;
  }
}

/*
  Register or associate the web component
  with a <read-ability></read-ability> element
*/
(function () {
  const customElementName = 'read-ability';
  if (customElements.get(customElementName)) {
    console.error(`There is already a custom element registered under the name ${customElementName}`);
  } else {
    customElements.define(customElementName, Readability);
  }
}());
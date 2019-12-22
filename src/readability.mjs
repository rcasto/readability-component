import { getReadability, getAverageTimeToRead } from './textHelpers.mjs';

const templateContent = `
  <style>
    .readability {
      display: flex;
      flex-direction: column;
    }
    .readability * {
      margin-left: auto;
    }
  </style>
  <slot name="readable-text">readable-text slot not filled.</slot>
`;

const template = document.createElement('template');
template.innerHTML = templateContent;

class Readability extends HTMLElement {
  constructor() {
    super();

    const templateContent = template.content;
    const shadowRoot = this.attachShadow({
      mode: 'open'
    });
    const readabilityDiv = document.createElement('div');
    const readabilityLevelDiv = document.createElement('div');
    const readabilityAverageReadingTimeDiv = document.createElement('div');

    readabilityLevelDiv.textContent = getReadability(this.textContent);
    readabilityAverageReadingTimeDiv.textContent = `${getAverageTimeToRead(this.textContent)} minutes to read`;

    readabilityDiv.className = 'readability';
    readabilityDiv.appendChild(readabilityLevelDiv);
    readabilityDiv.appendChild(readabilityAverageReadingTimeDiv);

    shadowRoot.appendChild(templateContent.cloneNode(true));
    shadowRoot.appendChild(readabilityDiv);
  }
}

customElements.define('read-ability', Readability);
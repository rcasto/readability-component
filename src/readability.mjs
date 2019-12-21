import { getReadability } from './textHelpers.mjs';

const templateContent = `
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
    const span = document.createElement('span');

    span.textContent = getReadability(this.textContent.trim());

    shadowRoot.appendChild(templateContent.cloneNode(true));
    shadowRoot.appendChild(span);
  }
}

customElements.define('read-ability', Readability);
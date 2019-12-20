import { getReadability } from './textHelpers.mjs';

class Readability extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ 
      mode: 'open'
    });
    const span = document.createElement('span');

    span.textContent = getReadability(this.textContent);
    shadowRoot.appendChild(span);

    console.log(this.textContent);
  }
}

customElements.define('read-ability', Readability);
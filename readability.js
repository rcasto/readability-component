import { getReadability } from './textHelpers';

customElements.define('read-ability',
  class extends HTMLElement {
    constructor() {
      super();

      const span = document.createElement('span');

      shadowRoot.appendChild(span);

      span.textContent = getReadability(this.textContent);
    }
  }
);

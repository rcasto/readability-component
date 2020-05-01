# Readability Web Component
A web component that can be used to wrap around your text content and determine its readability level, as well as the average time it would take to read.

To determine the readability level the [Flesch Kincaid readability test](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests) is used.

To determine the average time to read the content, an average reading speed of 180 words per minute is used.

**Note:** A heuristic is utilized to determine the number of syllables in a word, so the readability level may not be exactly what it would be if you were to manually calculate it, but it should not be terribly far off.

[Try it out! (codepen)](https://codepen.io/rcasto/pen/gOaxjKM)

## Usage

### Via module bundler
```javascript
import Readability from 'readability-component';

window.addEventListener('load', () => {
    customElements.define('read-ability', Readability);
});
```

### Via script tag
```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Readability Web Component</title>

  <style>
    read-ability {
      /* Allow customization of some of the Web components styling via
      CSS properties */
      --readability-margin: 0 0 16px 0;
      --readability-font-size: 0.8em;
      --readability-font-weight: lighter;
      --readability-opacity: 0.8;
      --readability-item-margin: 0 auto;
    }
  </style>
</head>

<body>
  <read-ability>
    <!-- This can be anything, this is your content -->
    <!-- Make sure to add slot="readable-text" attribute to your content if you also want it to be rendered -->
    <!-- If you neglect to add the slot, then the readability of any text contained by the component is computed, without displaying it -->
    <div id="text-content" slot="readable-text"></div>
  </read-ability>

  <!-- Include script on your page -->
  <script src="https://cdn.jsdelivr.net/npm/readability-component@1.0.4/dist/readability.min.js"></script>
  <script>
    window.addEventListener('load', () => {
      // Add to custom element registry
      // This allows you to define the html tag yourself
      // in this case: <read-ability></read-ability>
      //
      // By default the Readability component is exported
      // as "Readability" on the global window object
      customElements.define('read-ability', Readability);
    });
  </script>
</body>

</html>
```

## Resources
- https://www.howmanysyllables.com/howtocountsyllables
- https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch%E2%80%93Kincaid_grade_level
- https://en.wikipedia.org/wiki/Words_per_minute#Reading_and_comprehension
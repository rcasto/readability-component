# Readability Web Component
A web component that can be used to wrap around your text content and determine its readability level, as well as the average time it would take to read.

To determine the readability level the [Flesch Kincaid readability test](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests) is used.

To determine the average time to read the content, an average reading speed of 180 words per minute is used.

**Note:** A heuristic is utilized to determine the number of syllables in a word, so the readability level may not be exactly what it would be if you were to manually calculate it, but it should not be terribly far off.

## Integration
In order to integrate this web component into your web application you can use one of the below methods.

### Method 1 - Non-module script tag
```html
<script defer src="https://cdn.jsdelivr.net/gh/rcasto/readability-component/dist/readability.min.js"></script>
```

### Method 2 - Module script tag
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/rcasto/readability-component/src/readability.mjs"></script>
```

## Usage
```html
<read-ability>
    <!-- This can be anything, this is your content -->
    <!-- Make sure to add slot="readable-text" attribute to your content if you also want it to be rendered -->
    <!-- If you neglect to add the slot, then the readability of any text contained by the component is computed, without displaying it -->
    <p slot="readable-text">The cat sat on the mat.</p>
</read-ability>
```

## Browser Support
- [Web Components](https://caniuse.com/#search=web%20components)  
    <a href="http://caniuse.com/#feat=custom-elementsv1">
		<picture>
			<source type="image/webp" srcset="https://caniuse.bitsofco.de/image/custom-elementsv1.webp">
			<img src="https://caniuse.bitsofco.de/image/custom-elementsv1.png" alt="Data on support for the custom-elementsv1 feature across the major browsers from caniuse.com">
		</picture>
	</a>
    <a href="http://caniuse.com/#feat=template">
		<picture>
			<source type="image/webp" srcset="https://caniuse.bitsofco.de/image/template.webp">
			<img src="https://caniuse.bitsofco.de/image/template.png" alt="Data on support for the template feature across the major browsers from caniuse.com">
		</picture>
	</a>
    <a href="http://caniuse.com/#feat=shadowdomv1">
		<picture>
			<source type="image/webp" srcset="https://caniuse.bitsofco.de/image/shadowdomv1.webp">
			<img src="https://caniuse.bitsofco.de/image/shadowdomv1.png" alt="Data on support for the shadowdomv1 feature across the major browsers from caniuse.com">
		</picture>
	</a>
- [JavaScript modules via script tag](https://caniuse.com/#feat=es6-module)  
    <a href="http://caniuse.com/#feat=es6-module">
        <picture>
            <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/es6-module.webp">
            <img src="https://caniuse.bitsofco.de/image/es6-module.png" alt="Data on support for the es6-module feature across the major browsers from caniuse.com">
        </picture>
    </a>

## Resources
- https://www.howmanysyllables.com/howtocountsyllables
- https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch%E2%80%93Kincaid_grade_level
- https://en.wikipedia.org/wiki/Words_per_minute#Reading_and_comprehension
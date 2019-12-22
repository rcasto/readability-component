# Readability Web Component
This is a fairly simple web component that can be used to wrap around your content and determine its readability level, as well as the average time it would take to read.

To determine the readability level the [Flesch Kincaid readability test](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests) is used.

To determine the average time to read a passage, an average reading speed of 180 words per minute is used.

**Note:** A heuristic is utilized to determine the number of syllables in a word, so the readability level may not be exactly what it would be if you were to manually calculate it, but it should not be too far off.

## Usage
In order to integrate this web component into your web application you can use one of the below methods.

### Method 1
1. Add a `<script>` tag to your HTML

### Method 2
1. Add 

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
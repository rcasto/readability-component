# Readability Web Component
This is a fairly simple web component that can be used to wrap around your content and determine its readability level, as well as the average time it would take to read.

To determine the readability level the [Flesch Kincaid readability test](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests) is used.

To determine the average time to read a passage, an average reading speed of 200 words per minute is used.

**Note:** A heuristic is utilized to determine the number of syllables in a word, so the readability level may not be exactly what it would be if you were to manually calculate it, but it should not be too far off.

## Usage
In order to integrate this web component into your web application you'll need to do the following:
1. Add a `<script>` tag to your HTML

## Resources
- https://www.howmanysyllables.com/howtocountsyllables
- https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests
- https://en.wikipedia.org/wiki/Words_per_minute#Reading_and_comprehension
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

const config = {
	input: 'src/readability.js',
	plugins: [
		babel({
			babelHelpers: 'bundled'
		}),
		json()
	],
};

export default config;
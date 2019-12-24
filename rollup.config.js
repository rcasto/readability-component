import babel from 'rollup-plugin-babel';

const config = {
	input: 'src/readability.mjs',
	output: [
		{
			file: 'dist/readability.js',
			format: 'iife',
		},
	],
	plugins: [babel()],
};

export default config;
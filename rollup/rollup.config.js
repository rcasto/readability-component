import babel from 'rollup-plugin-babel';

const config = {
	input: 'src/readability.js',
	plugins: [babel()],
};

export default config;
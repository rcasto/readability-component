import babel from 'rollup-plugin-babel';

const config = {
	input: 'src/readability.mjs',
	plugins: [babel()],
};

export default config;
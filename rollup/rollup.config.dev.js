import commonConfig from './rollup.config';

const config = {
    ...commonConfig,
    output: [
		{
			name: 'Readability',
			file: 'dist/readability.js',
			format: 'iife'
		}
	]
};

export default config;
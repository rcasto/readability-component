import commonConfig from './rollup.config';

const config = {
    ...commonConfig,
    output: [
		{
			file: 'dist/readability.js',
			format: 'iife'
		}
	]
};

export default config;
import commonConfig from './rollup.config';
import { terser } from 'rollup-plugin-terser';

const config = {
    ...commonConfig,
    output: [
		{
			name: 'Readability',
			file: 'dist/readability.min.js',
			format: 'iife'
		}
	]
};
config.plugins.push(terser());

export default config;
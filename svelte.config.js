import adapter from '@sveltejs/adapter-vercel';
import {vitePreprocess} from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			'$stores': './src/stores',
			'$uiKit': './src/lib/ui-kit',
		}
	}
};

export default config;

import vercel from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: vercel({
			runtime: 'nodejs18.x'
		})
	}
};

export default config;
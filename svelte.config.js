import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		vite: {
			build: {
				target: 'es2020'
			}
		},
		paths: process.env.USE_BASE_PATH
			? {
					base: '/notes'
			  }
			: {},
		target: '#app',
		ssr: false
	}
};

export default config;

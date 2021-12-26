declare module 'quill/modules/syntax' {
	import type { HLJSApi } from 'highlight.js';

	export default class Syntax {
		static DEFAULTS: {
			hljs: HLJSApi;
			languages: { key: string; label: string }[];
		};
	}
}

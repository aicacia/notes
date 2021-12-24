/// <reference types="@sveltejs/kit" />

import type HLJSApi from 'highlight.js';
import type katex from 'katex';

declare global {
	interface Window {
		katex: katex;
		hljs: HLJSApi;
	}
}

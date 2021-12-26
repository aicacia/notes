<script lang="ts" context="module">
	import { browser } from '$app/env';
	import 'quill/dist/quill.core.css';
	import '$lib/editor/index.css';
	import 'katex/dist/katex.min.css';
	import 'highlight.js/scss/github.scss';
	import hljs from 'highlight.js/es/common';
	import katex from 'katex';

	if (browser) {
		window.hljs = hljs;
		window.katex = katex;
	}
</script>

<script lang="ts">
	import type Op from 'quill-delta/dist/Op';
	import type { renderOps } from '$lib/editor';
	import { onMount } from 'svelte';

	export let content: Op[];

	let prevContent: Op[];
	let element: HTMLDivElement;
	let renderOpsFn: typeof renderOps;

	$: if (element && renderOpsFn && prevContent !== content) {
		prevContent = content;
		renderOpsFn(element, content);
	}

	onMount(() => {
		import('$lib/editor').then(({ renderOps }) => {
			renderOpsFn = renderOps;
			renderOps(element, content);
		});
	});
</script>

<div bind:this={element} />

<script lang="ts" context="module">
	import { browser } from '$app/env';
	import 'quill/dist/quill.core.css';
	import '$lib/editor/index.css';
	import hljs from 'highlight.js';
	import katex from 'katex';

	if (browser) {
		window.hljs = hljs;
		window.katex = katex;
	}
</script>

<script lang="ts">
	import type { Sources } from 'quill';
	import type Quill from 'quill';
	import type Delta from 'quill-delta';
	import { onMount, createEventDispatcher } from 'svelte';
	import type Op from 'quill-delta/dist/Op';

	export let content: Op[] = [];
	export let placeholder: string = undefined;

	let quill: Quill;
	let element: HTMLDivElement;

	const dispatch = createEventDispatcher<{
		change: Op[];
		textchange: [delta: Delta, oldContents: Delta, source: Sources];
		selectionchange: [
			range: { index: number; length: number },
			oldRange: { index: number; length: number },
			source: Sources
		];
	}>();

	function onKeyDown(e: KeyboardEvent) {
		if (e.key !== 'Backspace') {
			return;
		}

		const str = quill?.getText();
		if (str !== '' && str !== '\n') {
			e.stopPropagation();
		}
	}

	function onTextChange() {
		prevContent = quill.getContents().ops;
		content = prevContent;
		dispatch('change', content);
		dispatch(
			'textchange',
			arguments as unknown as [delta: Delta, oldContents: Delta, source: Sources]
		);
	}
	function onSelectionChange() {
		dispatch(
			'selectionchange',
			arguments as unknown as [
				range: { index: number; length: number },
				oldRange: { index: number; length: number },
				source: Sources
			]
		);
	}

	$: orignalContent = content;
	let prevContent: Op[];
	$: if (prevContent !== orignalContent && quill) {
		prevContent = orignalContent;
		quill.setContents({ ops: orignalContent } as Delta, 'silent');
	}

	onMount(() => {
		import('$lib/editor').then(({ createQuill }) => {
			quill = createQuill(element, placeholder);
			quill.on('text-change', onTextChange);
			quill.on('selection-change', onSelectionChange);
		});
	});
</script>

<div class="border">
	<div bind:this={element} on:keydown|capture={onKeyDown} />
</div>

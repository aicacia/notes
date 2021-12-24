<script lang="ts">
	import { remoteStorage } from '$lib/state/remoteStorage';
	import { onMount } from 'svelte';

	export let element: HTMLDivElement = undefined;
	export let widget: any = undefined;

	onMount(() => {
		import('remotestorage-widget').then(({ default: Widget }) => {
			const w = new Widget(remoteStorage);
			w.attach('remote-storage-widget');
			(function onWidgetReady() {
				if (w.rsWidget) {
					widget = w;
					element = w.rsWidget;
				} else {
					setTimeout(onWidgetReady, 1000);
				}
			})();
		});
	});
</script>

<div id="remote-storage-widget" />

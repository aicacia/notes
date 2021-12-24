<script lang="ts" context="module">
	import '../app.postcss';
</script>

<script lang="ts">
	import { base } from '$app/paths';
</script>

<svelte:head>
	<link rel="manifest" href={`${base}/manifest.json`} />
	<link rel="icon" href={`${base}/favicon.png`} />
</svelte:head>

<slot />

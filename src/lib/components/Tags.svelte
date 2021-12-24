<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import MdAdd from 'svelte-icons/md/MdAdd.svelte';
	import MdClose from 'svelte-icons/md/MdClose.svelte';

	export let id: string = undefined;
	export let tags: string[] = [];
	export let loading = false;
	export let disabled = false;

	const dispatch = createEventDispatcher<{ change: string[] }>();

	let input: HTMLInputElement;
	let tag: string;

	$: onAddTag = () => {
		if (loading) {
			return;
		}
		if (!tags) {
			tags = [];
		}
		if (tag && !tags.includes(tag)) {
			tags.push(tag);
			tag = '';
			dispatch('change', tags);
			tags = tags;
			input?.select();
		}
	};
	$: onKeyPress = (e: KeyboardEvent) => {
		if (loading) {
			return;
		}
		if (e.key === 'Enter') {
			onAddTag();
		}
	};
	$: createOnDelete = (tag: string) => {
		return function onDelete() {
			if (loading) {
				return;
			}
			const index = tags.indexOf(tag);
			if (index !== -1) {
				tags.splice(index, 1);
				dispatch('change', tags);
				tags = tags;
				tag = '';
				input?.select();
			}
		};
	};
</script>

<div class="flex flex-wrap">
	{#each tags || [] as tag}
		<button
			type="button"
			{disabled}
			class="btn primary text-xs px-2 py-1 mr-1 mt-1 relative cursor-default"
		>
			{tag}
			{#if !disabled}
				<div
					class="inline-block text-center align-middle p-0 bg-red-500 text-white active:bg-red-600 cursor-pointer"
					on:click={createOnDelete(tag)}
				>
					<div class="w-4 h-4"><MdClose /></div>
				</div>
			{/if}
		</button>
	{/each}
	{#if !disabled}
		<div class="mt-1 flex">
			<input
				{id}
				type="text"
				class="input border-0 focus:outline-0 focus:outline-none shadow-none w-auto"
				placeholder="Enter a tag"
				bind:this={input}
				bind:value={tag}
				on:keypress={onKeyPress}
			/>
			<button type="submit" disabled={!tag || loading} class="btn p-2 primary" on:click={onAddTag}>
				<div class="w-4 h-4"><MdAdd /></div>
			</button>
		</div>
	{/if}
</div>

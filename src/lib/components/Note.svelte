<script lang="ts">
	import MdMenu from 'svelte-icons/md/MdMenu.svelte';
	import { clickOutside } from 'svelte-use-click-outside';
	import type { INote } from '$lib/state/notes';
	import RichViewer from './RichViewer.svelte';

	export let note: INote;
	export let onEdit: (note: INote) => void;
	export let onDelete: (note: INote) => void;

	function onEditInternal() {
		onEdit(note);
	}

	function onDeleteInternal() {
		menu = false;
		onDelete(note);
	}

	let menu = false;
	function onMenu() {
		menu = !menu;
	}
</script>

<div class="bg-white shadow border p-2" on:click={onEditInternal}>
	<div class="flex items-start justify-between">
		<div class="flex-grow">
			<RichViewer content={note.title} />
		</div>
		<div class="relative">
			<button
				class="bg-transparent border-0 text-black outline-none focus:outline-none"
				on:click|capture|stopPropagation={onMenu}
			>
				<div class="w-8 h-8"><MdMenu /></div>
			</button>
			<div
				class="origin-top-right absolute right-0 w-56 shadow-lg border bg-white transition ease-in-out duration-100"
				class:opacity-0={!menu}
				class:opacity-100={menu}
				class:scale-95={!menu}
				class:scale-100={menu}
				class:z-20={menu}
				role="menu"
				aria-orientation="vertical"
				aria-labelledby="menu-button"
				tabindex="-1"
				use:clickOutside={() => (menu = false)}
			>
				<div class="py-1" role="none">
					<button
						class="block w-full text-left px-4 py-2"
						role="menuitem"
						tabindex="-1"
						id="menu-item-1"
						on:click|capture|stopPropagation={onDeleteInternal}>Delete</button
					>
				</div>
			</div>
		</div>
	</div>
	<RichViewer content={note.content} />
	<div class="flex justify-between">
		<p class="text-sm text-gray-500">Created {note.createdAt.toLocaleDateString()}</p>
		<p class="text-sm text-gray-500">
			Updated {note.updatedAt.toLocaleDateString()}
			{note.updatedAt.toLocaleTimeString()}
		</p>
	</div>
</div>

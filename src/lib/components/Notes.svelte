<script lang="ts">
	import { debounce } from '@aicacia/debounce';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import {
		createNote,
		INote,
		updateNote,
		deleteNote,
		notesSearchText,
		notesById,
		notes
	} from '$lib/state/notes';
	import MdAdd from 'svelte-icons/md/MdAdd.svelte';
	import MdThumbUp from 'svelte-icons/md/MdThumbUp.svelte';
	import Modal from './Modal.svelte';
	import RichEditor from './RichEditor.svelte';
	import { isEmpty } from '$lib/editor/isEmpty';
	import Note from './Note.svelte';
	import RichViewer from './RichViewer.svelte';
	import { cleanString } from '$lib/editor/toSearchString';

	let editOpen = false;
	let deleteOpen = false;
	let noteToEdit: INote;
	let noteToDelete: INote;

	function onCreate() {
		onEdit(createNote());
	}
	function onEdit(note: INote) {
		editOpen = true;
		noteToEdit = note;
	}
	function onDelete(note: INote) {
		deleteOpen = true;
		noteToDelete = note;
	}
	function onUpdate() {
		if (noteToEdit) {
			updateNote(noteToEdit.id, noteToEdit);
		}
	}
	const debounceUpdate = debounce(onUpdate, 300);

	function onCloseEdit() {
		if (noteToEdit) {
			if (isEmpty(noteToEdit.title) && isEmpty(noteToEdit.content)) {
				deleteNote(noteToEdit.id);
			}
			noteToEdit = undefined;
		}
	}

	function onCloseDelete() {
		noteToEdit = undefined;
	}

	function onDeleteInternal() {
		deleteNote(noteToDelete.id);
		deleteOpen = false;
		onCloseDelete();
	}

	let search: string;
	let currentSearch: string;
	const debouncedSearch = debounce(() => {
		search = cleanString(currentSearch);
	}, 300);

	$: filteredIds = search
		? $notesSearchText
				.filter(([_id, title, content]) => fuzzyEquals(search, title) || content.includes(search))
				.map(([id]) => id)
		: $notes.map((note) => note.id);
	$: filteredNotes = filteredIds.map((id) => $notesById[id]);
</script>

<Modal bind:open={editOpen} onClose={onCloseEdit}>
	<div slot="title">
		{#if noteToEdit}
			<RichEditor bind:content={noteToEdit.title} placeholder="Title" on:change={debounceUpdate} />
		{/if}
	</div>
	{#if noteToEdit}
		<RichEditor bind:content={noteToEdit.content} placeholder="Notes" on:change={debounceUpdate} />
	{/if}
</Modal>

<Modal bind:open={deleteOpen} onClose={onCloseDelete}>
	<h1 slot="title">Delete Note?</h1>
	{#if noteToDelete}
		<RichViewer content={noteToDelete.title} />
		<div class="flex justify-center">
			<button class="btn danger" on:click={onDeleteInternal}
				><div class="w-8 h-8"><MdThumbUp /></div></button
			>
		</div>
	{/if}
</Modal>

<div class="flex-grow relative mt-2 overflow-auto">
	<div class="w-full fixed top-0 bg-black shadow border-b py-1 z-10">
		<div class="mx-auto container">
			<input
				class="input"
				type="text"
				placeholder="Search..."
				bind:value={currentSearch}
				on:input={debouncedSearch}
			/>
		</div>
	</div>

	<div class="mx-auto container mt-10 mb-24">
		<div class="masonry-1 md:masonry-2 lg:masonry-3 gap-2">
			{#each filteredNotes as note}
				<div class="break-inside py-2">
					<Note {note} {onEdit} {onDelete} />
				</div>
			{/each}
		</div>
	</div>
</div>

<div class="fixed bottom-0 w-full">
	<div class="container mx-auto mb-8 p-4 relative">
		<div class="absolute bottom-8 right-0">
			<button class="btn primary p-2 rounded-full shadow-xl" on:click={onCreate}
				><div class="w-10 h-10"><MdAdd /></div></button
			>
		</div>
	</div>
</div>

import { browser } from '$app/env';
import { toSearchString } from '$lib/editor/toSearchString';
import type Op from 'quill-delta/dist/Op';
import { derived } from 'svelte/store';
import { writable } from 'svelte/store';
import { v4 } from 'uuid';
import { notesRS, remoteStorage } from './remoteStorage';

export interface INote {
	id: string;
	title: Op[];
	content: Op[];
	createdAt: Date;
	updatedAt: Date;
}

export interface INoteJSON {
	id: string;
	title: Op[];
	content: Op[];
	createdAt: string;
	updatedAt: string;
}

export interface INotes {
	[id: string]: INote;
}

const writableNotes = writable<INotes>({});

export const notes = derived(writableNotes, (state) =>
	Object.values(state).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
);
export const notesById = derived(writableNotes, (state) => state);
export const notesSearchText = derived(notes, (state) =>
	state.map(
		(note) =>
			[note.id, toSearchString(note.title), toSearchString(note.content)] as [
				id: string,
				title: string,
				content: string
			]
	)
);

export function createNote() {
	const id = v4();
	const note = {
		id,
		title: [],
		content: [],
		createdAt: new Date(),
		updatedAt: new Date()
	};
	writableNotes.update((state) => {
		state[id] = note;
		return state;
	});
	notesRS.storeObject('note', `${id}.json`, noteToJSON(note));
	return note;
}

export function updateNote(id: string, noteUpdates: Partial<INote>) {
	writableNotes.update((state) => {
		const note = state[id];
		if (note) {
			note.updatedAt = new Date();
			Object.assign(note, noteUpdates);
			notesRS.storeObject('note', `${id}.json`, noteToJSON(note));
		}
		return state;
	});
}

export function deleteNote(id: string) {
	writableNotes.update((state) => {
		if (delete state[id]) {
			notesRS.remove(`${id}.json`);
		}
		return state;
	});
}

export function noteToJSON(note: INote): INoteJSON {
	return {
		id: note.id,
		title: note.title,
		content: note.content,
		createdAt: note.createdAt.toJSON(),
		updatedAt: note.updatedAt.toJSON()
	};
}

export function noteFromJSON(note: INoteJSON): INote {
	return {
		id: note.id,
		title: note.title,
		content: note.content,
		createdAt: new Date(note.createdAt),
		updatedAt: new Date(note.updatedAt)
	};
}

if (browser) {
	remoteStorage
		.scope('/')
		.getAll('/notes/', false)
		.then((notes) => {
			writableNotes.update((state) => {
				Object.values(notes).forEach((note) => {
					state[note.id] = noteFromJSON(note);
				});
				return state;
			});
		});
}

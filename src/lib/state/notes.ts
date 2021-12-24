import { toSearchString } from '$lib/editor/toSearchString';
import type Op from 'quill-delta/dist/Op';
import { derived } from 'svelte/store';
import { writable } from 'svelte/store';
import { v4 } from 'uuid';
import { remoteStorage } from './remoteStorage';

export const notesRS = remoteStorage.scope('/notes/');

remoteStorage.access.claim('notes', 'rw');
remoteStorage.caching.enable('/notes/');

notesRS.declareType('note', {
	type: 'object',
	properties: {
		id: {
			type: 'string'
		},
		title: {
			type: 'array',
			items: {
				type: 'object'
			}
		},
		content: {
			type: 'array',
			items: {
				type: 'object'
			}
		},
		tags: {
			type: 'array',
			items: {
				type: 'string'
			}
		},
		createdAt: {
			type: 'string',
			format: 'date-time'
		},
		updatedAt: {
			type: 'string',
			format: 'date-time'
		}
	},
	required: ['id', 'title', 'content', 'tags', 'createdAt', 'updatedAt']
});

export interface INote {
	id: string;
	title: Op[];
	content: Op[];
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface INoteJSON {
	id: string;
	title: Op[];
	content: Op[];
	tags: string[];
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
export const tags = derived(notes, (state) =>
	state.reduce((tags, note) => {
		note.tags.forEach((tag) => {
			tags.add(tag);
		});
		return tags;
	}, new Set<string>())
);

export function createNote() {
	const id = v4();
	const note = {
		id,
		title: [],
		content: [],
		tags: [],
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
		tags: note.tags,
		createdAt: note.createdAt.toJSON(),
		updatedAt: note.updatedAt.toJSON()
	};
}

export function noteFromJSON(note: INoteJSON): INote {
	return {
		id: note.id,
		title: note.title,
		content: note.content,
		tags: note.tags,
		createdAt: new Date(note.createdAt),
		updatedAt: new Date(note.updatedAt)
	};
}

function onSync() {
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

remoteStorage.on('sync-done', onSync);

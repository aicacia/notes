import { DROPBOX_CLIENT_ID, GOOGLE_DRIVE_CLIENT_ID } from '$lib/constants';
import RemoteStorage from 'remotestoragejs';

export const remoteStorage = new RemoteStorage();

remoteStorage.access.claim('notes', 'rw');
remoteStorage.caching.enable('/notes/');

remoteStorage.setApiKeys({
	dropbox: DROPBOX_CLIENT_ID,
	googledrive: GOOGLE_DRIVE_CLIENT_ID
});

export const notesRS = remoteStorage.scope('/notes/');

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
		createdAt: {
			type: 'string',
			format: 'date-time'
		},
		updatedAt: {
			type: 'string',
			format: 'date-time'
		}
	},
	required: ['id', 'title', 'content', 'createdAt', 'updatedAt']
});

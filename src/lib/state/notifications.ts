import type { Readable } from 'svelte/store';
import { writable } from 'svelte/store';

export enum NotificationType {
	Success = 'success',
	Error = 'error',
	Info = 'info',
	Warning = 'warning'
}

export interface INotification {
	id: number;
	message: string;
	type: NotificationType;
}

const writableNotifications = writable<INotification[]>([]);

export const notifications: Readable<INotification[]> = writableNotifications;

let ID = 0;

export function createNotification(
	message: string,
	type: NotificationType = NotificationType.Error,
	deleteAfterMS = 5000
): number {
	const id = ID++;
	writableNotifications.update((state) => {
		state.push({
			id,
			message,
			type
		});
		return state;
	});
	setTimeout(() => removeNotification(id), deleteAfterMS);
	return id;
}

export function removeNotification(id: number): void {
	writableNotifications.update((state) => {
		const index = state.findIndex((notification) => notification.id === id);

		if (index === -1) {
			return state;
		} else {
			state.splice(index, 1);
			return state;
		}
	});
}

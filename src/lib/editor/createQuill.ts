import Quill from 'quill';

export function createQuill(element: HTMLElement, placeholder?: string) {
	return new Quill(element, { placeholder, theme: 'rich-editor' });
}

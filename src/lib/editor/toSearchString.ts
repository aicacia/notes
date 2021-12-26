import type Op from 'quill-delta/dist/Op';

export function toSearchString(content: Op[]) {
	if (content.length === 0) {
		return '';
	} else {
		return content.map((op) => valueToString(op.insert)).join(' ');
	}
}

function valueToString(obj: string | object) {
	if (typeof obj === 'string') {
		return cleanString(obj);
	} else {
		return Object.entries(obj)
			.map(([key, value]) => `${cleanString(key)} ${valueToString(value)}`)
			.join(' ');
	}
}

export function cleanString(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^a-zA-Z0-9]+/g, ' ')
		.trim();
}

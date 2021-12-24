import type Op from 'quill-delta/dist/Op';

export function toSearchString(content: Op[]) {
	if (content.length === 0) {
		return '';
	} else {
		return content
			.map((op) => {
				if (typeof op.insert === 'string') {
					return cleanString(op.insert);
				} else {
					return Object.entries(op.insert)
						.map(([key, value]) => `${cleanString(key)} ${cleanString(value)}`)
						.join(' ');
				}
			})
			.join(' ');
	}
}

export function cleanString(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^a-zA-Z0-9]+/g, ' ')
		.trim();
}

import type Op from 'quill-delta/dist/Op';
import { toSearchString } from './toSearchString';

export function isEmpty(content: Op[]) {
	return toSearchString(content).trim() === '';
}

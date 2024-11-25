import { writable } from "svelte/store";

export const variants = writable({
	selectedVariantId: '',
	variants: []
});
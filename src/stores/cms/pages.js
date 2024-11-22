import { writable } from "svelte/store";

export const pages = writable({
    selectedPageIndex: 0,
	pages: []
});
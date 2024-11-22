import { writable } from "svelte/store";

export const selectedPage = writable(
	{
		pageId: '',
		pageName: '',
		pageSlug: ''
	}
);
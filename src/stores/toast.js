import { writable } from "svelte/store";

export const toastMessage = writable(
	{
		type: "",
		content: "",
	}
);
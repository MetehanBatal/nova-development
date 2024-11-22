import { writable } from "svelte/store";

export const selectedInstance = writable(
	{
		instanceId: '',
		componentId: '',
		pageId: '',
		nodeName: '',
		class: '',
		styling: {},
		attributes: {},
		content: '',
		breakpoint: 'desktop'
	}
);
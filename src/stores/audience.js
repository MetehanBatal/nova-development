import { writable } from "svelte/store";

export const audience = writable(
	{
		id: Math.floor(Math.random() * (1000000000000 - 100000000000) + 1000000000000),
		name: '',
		description: '',
		usedIn: [],
		conditions: [{
			group: "Traffic Source",
			name: 'campaign',
			condition: 'contains',
			values: [ 'some_keyword' ]
		}]
	}
);
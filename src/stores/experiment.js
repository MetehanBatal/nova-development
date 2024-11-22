import { writable } from "svelte/store";

export const experiment = writable(
	{
		id: '',
		
		name: '',
		thumbnail: '',
		baseURLs: [],

		type: 'ab',
		status: 'draft',

		hypothesis: {
			priority: {
				potential: 1,
				importance: 1,
				ease: 1
			},
			name: '',
			objective: '',
			summary: ''
		},

		completionCriteria: {
			byVisitors: null,
			byDate: null,
			byRevenue: null
		},
		
		logs: [
			{
				action: '',
				timestamp: ''
			}
		],
		
		variants: [
			{
				name: '',
				components: [
					''
				]
			}
		],
		timeToGoLive: null,
		armedBandit: null
	}
);
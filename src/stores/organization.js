import { writable } from "svelte/store";

export const organization = writable(
	{
		slug: 'mve',
		displayName: 'Man vs. Evil',
        thumbnail: '/assets/icons/logo.svg',
        projects: [
            {
                name: 'Man vs. Evil',
                endpoint: 'https://mve.novus.studio',
                logo: '/assets/icons/logo.svg'
            }
        ]
	}
);
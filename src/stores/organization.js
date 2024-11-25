import { writable } from "svelte/store";

export const organization = writable(
	{
		slug: 'miracle',
		displayName: 'Miracle Made',
        thumbnail: '/assets/icons/logo.svg',
        projects: [
            {
                projectId: 'c1943dfa-2a88-gf04-b4g7d564eg53',
                projectName: '[TRY] Miracle Made',
                webclipURL: '/assets/images/projects/miracle/webclip.png',
                faviconURL: '/assets/images/projects/miracle/favicon.png',
                redirects: [
                ],
                domains: [
                    {
                        domainName: 'miracle',
                        hostName: 'nova.io',
                        environment: 'staging',
                        lastPublished: '2024-11-24'
                    }
                ],
                fonts: [
                    {
                        fontType: 'woff2',
                        fontDisplay: 'swap',
                        fontFamily: 'Brandon Bold',
                        weights: [700],
                        italicWeights: [],
                        file: {
                            fontFamily: 'Brandon Bold',
                            mimeType: "application/octet-stream",
                            storedFileName: '7970cad24fef0a8cf3474d9a7bbcca02_brandon_bld.woff2',
                            originalFileName: 'brandon_bld.woff2',
                            url: '',
                            size: 36728
                        }
                    }
                ],
                customCode: {
                    headTag: '',
                    footerTag: ''
                }
            }
        ]
	}
);
<script>
    import { pages } from '../../stores/cms/pages';
    import { dbActions } from '../../stores/cms/functions';
    import { generateRandomString } from '../../stores/functions';
    
    import General from '$lib/cms/pageSettings/General.svelte';
    import SEO from '$lib/cms/pageSettings/SEO.svelte';
    import Tracking from '$lib/cms/pageSettings/Tracking.svelte';
    import CustomCodes from '$lib/cms/pageSettings/CustomCodes.svelte';

    export let revealedSettingsId;

    let newPageId = generateRandomString();
    let emptyPageSchema = {
        pageId: newPageId,
        attributes: {
            prerender: false,
            edge: true
        },
        components: [generateRandomString()],
        customCode: {
            headTag: "",
            footerTag: ""
        },
        folder: "",
        pageName: "Untitled",
        seoSettings: {
            title: "",
            metaDescription: "",
            imageURL: "",
            indexing: false
        },
        slug: '/untitled'
    };

    let selectedPage;

    $: {
        selectedPage = revealedSettingsId === 'new-page' ? emptyPageSchema : $pages.pages.find((page) => page.pageId === revealedSettingsId);
    }

    const settingsComponents = [
        {
            name: 'General',
            component: General
        },
        {
            name: 'SEO Details',
            component: SEO
        },
        {
            name: 'Tracking',
            component: Tracking
        },
        {
            name: 'Custom Code',
            component: CustomCodes
        }
    ];

    async function handleSave() {
        console.log('S: ', selectedPage);

        await dbActions(selectedPage, 'pages', 'upsert');
    }
</script>

<div class="builder">
    <div class="header">
        <p>{selectedPage.pageName} Settings</p>

        <div>
            <div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 1C5.44772 1 5 1.44772 5 2V11C5 11.5523 5.44772 12 6 12H13C13.5523 12 14 11.5523 14 11V5.29289L9.70711 1H6ZM6 2H9.29289L13 5.70711V11H6V2Z" fill="currentColor"></path><path d="M3 3V13C3 13.5523 3.44772 14 4 14H12V13H4V3H3Z" fill="currentColor"></path></svg>

                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 2C6.44772 2 6 2.44772 6 3V4H3V5H4V11.5C4 12.3284 4.67157 13 5.5 13H11.5C12.3284 13 13 12.3284 13 11.5V5H14V4H11V3C11 2.44772 10.5523 2 10 2H7ZM10 4V3H7V4H10ZM5 11.5V5H12V11.5C12 11.7761 11.7761 12 11.5 12H5.5C5.22386 12 5 11.7761 5 11.5Z" fill="currentColor"></path></svg>
            </div>

            <div class="button" on:click={() => {revealedSettingsId = '' }}>Close</div>
            <div class="button" on:click={handleSave}>Save</div>
        </div>
    </div>

    <div class="settings-panel">
        {#each settingsComponents as { name, component }}
        <svelte:component this={component} title={name} selectedPage={selectedPage} />
        {/each}
    </div>
</div>

<style>
    .builder {
        max-width: none;
    }

    .header {
        display: flex;
        align-items: center;
        gap: 1.2rem;

        padding: 0.6rem 1rem;
        
        border-bottom: .1rem solid #2e2e2e;
    }

    .header div {
        display: flex;
        align-items: center;
        gap: .4rem;
    }

    .button {
        border: .1rem solid #1A1F26;
        background-color: #0D121A;
        color: #FFF;

        border-radius: .8rem;

        padding: .4rem .8rem;

        font-size: 1.4rem;

        transition: all .3s ease-in-out;

        cursor: pointer;
    }

    .builder {
        position: absolute;
        left: 20rem;

        height: 100%;
    }

    .settings-panel {
        display: flex;
        flex-direction: column;
    }

    :global(.collapse-group) {
        padding: 1rem;
        
        border-bottom: .1rem solid #2e2e2e;
    }

    :global(.collapse-heading) {
        display: flex;
        justify-content: space-between;
        align-items: center;

        font-size: 1.4rem;

        cursor: pointer;
    }

    :global(.collapse-content) {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;

        padding: 2.4rem 0;
    }

    :global(.collapse-group .input-holder) {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        gap: .6rem;
    }

    :global(.input-holder .label) {
        font-size: 1.2rem;
        color: rgba( 255, 255, 255, .67 );
    }

    :global(.collapse-content input) {
        padding: 1rem .8rem;
    }
</style>
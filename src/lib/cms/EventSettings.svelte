<script>
    import { pages } from '../../stores/cms/pages';
    import { events } from '../../stores/cms/events';
    import { dbActions, generateRandomString } from '../../stores/cms/functions';
    
    import { toastMessage } from '../../stores/toast';

    import ElementClick from '$lib/cms/events/ElementClick.svelte';
    import ElementVisible from '$lib/cms/events/ElementVisible.svelte';
    import TimeSpent from '$lib/cms/events/TimeSpent.svelte';
    import Scroll from '$lib/cms/events/Scroll.svelte';
    import FormSubmit from '$lib/cms/events/FormSubmit.svelte';
    import Switch from '$lib/toolkit/Switch.svelte';

    export let revealedEventsId;

    const triggerOptions = [
        {
            name: 'Element Click',
            value: 'click',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer-click"><path d="M14 4.1 12 6"/><path d="m5.1 8-2.9-.8"/><path d="m6 12-1.9 2"/><path d="M7.2 2.2 8 5.1"/><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"/></svg>`,
            component: ElementClick
        },
        {
            name: 'Element Visible',
            value: 'scrollIntoView',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gallery-vertical-end"><path d="M7 2h10"/><path d="M5 6h14"/><rect width="18" height="12" x="3" y="10" rx="2"/></svg>`,
            component: ElementVisible
        },
        {
            name: 'Time Spent',
            value: 'timeSpent',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock-1"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14.5 8"/></svg>`,
            component: TimeSpent
        },
        {
            name: 'Scroll',
            value: 'scroll',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gallery-vertical"><path d="M3 2h18"/><rect width="18" height="12" x="3" y="6" rx="2"/><path d="M3 22h18"/></svg>`,
            component: Scroll
        },
        {
            name: 'Form Submit',
            value: 'submit',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>`,
            component: FormSubmit
        }
    ];
    let selectedTriggerIndex = 0;

//     {
//     "triggerType": "click",
//     "triggerId": "92269773-5074-0bhg-17h90d301576",
//     "triggerCondition": "",
//     "value": 0,
//     "name": "ATC Click",
//     "eventId": "14271257-1225-a24e-72ab3d90296"
// }

    let newEventId = generateRandomString();
    let emptyPageSchema = {
        eventId: newEventId,
        name: "Untitled",
        amount: 0,
        triggerCondition: "",
        triggerId: "",
        triggerType: "",
        pageSlug: $pages.pages[$pages.selectedPageIndex].slug
    };

    let selectedPage = emptyPageSchema;

    async function handleSave() {
        let eventUpdate = await dbActions(selectedPage, 'cmsEvents', 'upsert');

        if (eventUpdate.status === 200) {
            $pages.pages = [...$pages.pages, selectedPage];
            $events = [...$events, selectedPage];

            $toastMessage = {
                type: 'success',
                content: 'Event created! Publish website to track results.'
            }
        }

        revealedEventsId = '';
    }

    function handleTriggerChange() {
        emptyPageSchema.triggerType = triggerOptions[selectedTriggerIndex].value;
    }

    $: selectedTriggerIndex, handleTriggerChange();
</script>

<div class="builder">
    <div class="header">
        <p>{emptyPageSchema.name} Settings</p>

        <div>
            <div class="button" on:click={() => {revealedEventsId = '' }}>Close</div>
            <div class="button" on:click={handleSave}>Save</div>
        </div>
    </div>

    <div class="events-settings-panel">
        <div>
            <h3>Trigger Type:</h3>

            <Switch options={triggerOptions.map(({icon}) => ({icon}))} bind:selectedIndex={selectedTriggerIndex} gap="0" />
        </div>

        <svelte:component this={triggerOptions[selectedTriggerIndex]?.component} {selectedPage} />
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
        left: 0;

        height: 100%;
    }

    .events-settings-panel {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        padding: 1rem;
    }

    :global(.events-settings-panel > div) {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    :global(.events-settings-panel > div h3) {
        font-size: 1.4rem;
    }

    :global(.events-settings-panel svg) {
        position: static;
        width: 2rem;
        height: 2rem;

        margin: 0;
    }

    :global(.events-settings-panel .switch-option path) {
        fill: none!important;
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

    :global(.collapse-group input) {
        padding: 1rem .8rem;
    }
</style>
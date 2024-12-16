<script>
    import { events } from '../../../stores/cms/events';
    import { instances } from '../../../stores/cms/instances';
    import { pages } from '../../../stores/cms/pages';
    import { changeSelection } from '../../../stores/cms/functions';

    import { onMount } from 'svelte';

    let visibleIds = [];
    let eventCounts = new Map();

    let initialized = false;

    onMount(async() => {
        // Fetch components
        //
        initialized = true;

        fetchEvents();
    });

    async function fetchEvents() {
        if (!initialized) {
            return; }

        try {
            const eventsReq = await fetch(`https://preconvert.novus.studio/staging/cmsEvents/view?limit=100&offset=0&pageSlug=${$pages.pages[$pages.selectedPageIndex].slug}`);
            const eventsRes = await eventsReq.json();
            
            $events = eventsRes.data.docs;
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    async function fetchEventDetails(eventId, eventName) {
        visibleIds = visibleIds.includes(eventId) 
                ? visibleIds.filter(id => id !== eventId) 
                : [...visibleIds, eventId]
            
        if (!eventCounts.get(eventId)) {
            const eventsReq = await fetch(`https://preconvert.novus.studio/staging/cmsEvents/report?eventName=${eventName}`);
            const eventsRes = await eventsReq.json();

            console.log(eventsRes);

            eventCounts.set(eventId, eventsRes.data);
        }
    }

    $: $pages.selectedPageIndex, fetchEvents();
</script>

<ul class="events-holder">
    {#each $events as event (event.eventId)}
    <li>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="header" on:click={() => { fetchEventDetails(event.eventId, event.name) }}>
            <div>
                {#if event.triggerType === 'click'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer-click"><path d="M14 4.1 12 6"/><path d="m5.1 8-2.9-.8"/><path d="m6 12-1.9 2"/><path d="M7.2 2.2 8 5.1"/><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"/></svg>
                {:else if event.triggerType === 'scrollIntoView'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gallery-vertical-end"><path d="M7 2h10"/><path d="M5 6h14"/><rect width="18" height="12" x="3" y="10" rx="2"/></svg>
                {:else if event.triggerType === 'timeSpent'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock-1"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14.5 8"/></svg>
                {:else if event.triggerType === 'scroll'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gallery-vertical"><path d="M3 2h18"/><rect width="18" height="12" x="3" y="6" rx="2"/><path d="M3 22h18"/></svg>
                {:else if event.triggerType === 'submit'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>`,
                {/if}
            </div>
            <p>{event.name}</p>
            
            <svg style={`transform: rotate(${visibleIds.includes(event.eventId) ? '90deg' : '0deg'});`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.29287 8.00004L6.64642 5.35359L7.35353 4.64648L10.7071 8.00004L7.35353 11.3536L6.64642 10.6465L9.29287 8.00004Z" fill="currentColor"></path>
            </svg>
        </div>

        {#if visibleIds.includes(event.eventId)}
        <div class="event-details">
            <p>Live Since: {new Date(event.createdAt).toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })}</p>
            <p>Total Event Count: {eventCounts.get(event.eventId) ? eventCounts.get(event.eventId) : '-'}</p>
            
            <div>
                <p>Trigger: </p>
                
                <div on:click={() => {changeSelection('', event.triggerId)}}>
                    <p>{$instances.find((i) => i.instanceId === event.triggerId).attributes.find((attr) => attr.name === 'class').value.replace('-', ' ')}</p>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.2929 5H6.00004V4H12V10H11V5.70711L5.35359 11.3536L4.64648 10.6464L10.2929 5Z" fill="currentColor"/></svg>
                </div>
            </div>

            <p>See Data in Graphic View</p>
        </div>
        {/if}
    </li>
    {/each}
</ul>

<style>
    li {
        padding: .8rem 2.8rem;

        border-bottom: .1rem solid #212830;
    }

    .header {
        display: flex;
        align-items: center;
        gap: .8rem;

        font-size: 1.4rem;

        cursor: pointer;
    }

    .header svg:last-child {
        margin-left: auto;
    }

    .event-details {
        display: flex;
        flex-direction: column;

        padding: .8rem 0;
    }

    .event-details p {
        font-size: 1.2rem;
        line-height: 2rem;
    }

    .event-details p:last-child {
        margin-top: .8rem;

        text-decoration: underline;
        cursor: pointer;
    }

    .event-details div {
        display: flex;
        align-items: center;
        gap: .4rem;

        cursor: pointer;
    }
</style>
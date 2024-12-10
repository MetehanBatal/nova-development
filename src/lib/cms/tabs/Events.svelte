<script>
    import { events } from '$stores/cms/events';
    import { instances } from '$stores/cms/instances';
    import { pages } from '$stores/cms/pages';
    import { changeSelection } from '$stores/cms/functions';

    import { onMount } from 'svelte';

    let visibleIds = [];

    onMount(async() => {
        // Fetch components
        //
        try {
            const eventsReq = await fetch(`http://localhost:3030/staging/cmsEvents/view?limit=100&offset=0&pageId=${$pages.pages[$pages.selectedPageIndex].pageId}`);
            const eventsRes = await eventsReq.json();
            
            $events = eventsRes.data.docs;

            console.log($events, $pages);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    });
</script>

<ul class="events-holder">
    {#each $events as event (event.eventId)}
    <li>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="header" on:click={() => { 
            visibleIds = visibleIds.includes(event.eventId) 
                ? visibleIds.filter(id => id !== event.eventId) 
                : [...visibleIds, event.eventId] 
        }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.33333 2.7334L8 4.00007" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.40001 5.33338L1.46667 4.80005" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 8L2.73334 9.33333" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.79999 1.46655L5.33332 3.39989" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.02466 6.46002C5.9988 6.39912 5.99174 6.33189 6.00436 6.26695C6.01698 6.202 6.04872 6.14231 6.0955 6.09553C6.14228 6.04875 6.20197 6.01701 6.26692 6.00439C6.33186 5.99177 6.39909 5.99883 6.45999 6.02469L13.7933 9.02469C13.8586 9.05146 13.9137 9.09825 13.9507 9.15833C13.9876 9.2184 14.0046 9.28866 13.9991 9.35899C13.9936 9.42932 13.966 9.4961 13.9201 9.54972C13.8743 9.60333 13.8126 9.64102 13.744 9.65735L10.8447 10.3514C10.725 10.3799 10.6155 10.4411 10.5285 10.5281C10.4414 10.615 10.3801 10.7244 10.3513 10.844L9.65799 13.744C9.64183 13.8129 9.60419 13.8748 9.5505 13.9209C9.49682 13.9669 9.42987 13.9947 9.35936 14.0002C9.28884 14.0057 9.2184 13.9886 9.15823 13.9514C9.09806 13.9142 9.05128 13.8589 9.02466 13.7934L6.02466 6.46002Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
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
            <p>Total Event Count: 2,148</p>
            
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
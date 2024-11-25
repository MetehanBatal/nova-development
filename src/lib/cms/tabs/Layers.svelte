<script>
    import { selectedInstance } from '../../../stores/cms/selectedInstance';
    import { instances } from '../../../stores/cms/instances';
    import { components } from '../../../stores/cms/components';
    import { pages } from '../../../stores/cms/pages';
    import { styleSheet } from '../../../stores/cms/styleSheet';
    import { nodeTags } from '../../../stores/cms/nodeTags';
    import { visibleIds } from '../../../stores/cms/visibleIds';
    import { drawInstances, computeOrders, changeSelection, toggleExpand, postMessage } from '../../../stores/cms/functions';

    // import { flip } from 'svelte/animate';
	// import { dndzone } from 'svelte-dnd-action';

    let pageComponents = [];

    function filterAdditionalVariants(instances, pageComponents, pageId) {
        return instances.filter(instance => {
            // Keep instances that don't have a componentId
            if (!instance.componentId) return true;

            // Find the matching component
            const matchingComponent = pageComponents.find(comp => 
                comp.componentId === instance.componentId
            );

            console.log('M I: ', matchingComponent);

            // If no matching component found, keep the instance
            if (!matchingComponent) return true;

            // Find the occurrence for this page
            const occurrence = matchingComponent.occurrences.find(occ => 
                occ.pageId === pageId
            );

            console.log('OCC I: ', occurrence);

            // If no occurrence found, keep the instance
            if (!occurrence) return true;

            console.log('OCC II: ', occurrence);

            // Keep instance if it's the default variant or doesn't have a variantId
            return !instance.variantId || instance.variantId === occurrence.defaultVariantId;
        });
    }

    async function fetchInstances(from) {
        setTimeout(async () => {
            console.warn('Fetch instances called');

            let selectedPageId = $pages.pages[$pages.selectedPageIndex].pageId
            // Fetch instances
            //
            try {
                const instanceReq = await fetch(`http://localhost:3030/staging/instances/view?pageId=${selectedPageId}`);
                const instanceRes = await instanceReq.json();

                console.log(instanceRes);
                pageComponents = instanceRes.data.components;
                $instances = filterAdditionalVariants(instanceRes.data.instances, pageComponents, selectedPageId);

                console.log('PAge components: ', pageComponents, $instances);

                if (from === 'pageChange') {
                    postMessage('initialization', {page: $pages.pages[$pages.selectedPageIndex], components: pageComponents, instances: $instances, styleSheet: $styleSheet});
                }

                $visibleIds = drawInstances();
                computeOrders();

                console.log('Instances and all is fetched');
                
                return instanceRes.data;
            } catch (error) {
                console.error('Error fetching instances:', error);
            }
        }, 1800)
    }

    // let items = JSON.parse(JSON.stringify($instances));

    // const flipDurationMs = 300;
	// function handleDndConsider(e) {
	// 	items = e.detail.items;

    //     console.log('handleDndConsider: ', items)
	// }
	// function handleDndFinalize(e) {
	// 	items = e.detail.items;

    //     console.log('handleDndFinalize: ', items)
	// }

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    $: $pages.selectedPageIndex, fetchInstances('pageChange');
    $: $visibleIds, console.log('Vis: ', $visibleIds);
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- <ul use:dndzone={{items, flipDurationMs}} on:consider={handleDndConsider} on:finalize={handleDndFinalize}> -->
<ul>
    {#each $instances as instance (instance.instanceId)}
        <li
            style={`order: ${instance.order}; display: ${$visibleIds.includes(instance.componentId ? instance.componentId : instance.instanceId) ? 'flex' : 'none'}`}
            class={`cms-line ${instance.componentId ? 'component-line' : ''}`}
            class:selected={instance.instanceId === $selectedInstance.instanceId}
            on:click={(e) => {changeSelection(e, instance.instanceId)} }
            data-p={instance.instanceId}
        >
        {#each {length: instance.depth - 1} as _, i}
        <span class="depth"></span>
        {/each}

        <button class="cms-line-dropdown" on:click={() => {$visibleIds = toggleExpand(instance.instanceId)}} aria-label={instance.nestedInstanceIds.some(childId => $visibleIds.includes(childId)) ? 'Collapse' : 'Expand'} aria-expanded={instance.nestedInstanceIds.some(childId => $visibleIds.includes(childId)) ? 'true' : 'false'}>
            {#if instance.nestedInstanceIds && instance.nestedInstanceIds.length > 0}
                <svg style={`transform: rotate(${instance.nestedInstanceIds.some(childId => $visibleIds.includes(childId)) ? 0 : -90}deg);`} width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.2268 3.70209L7.20441 0.724487L8 1.52008L4.2268 5.29329L0.453609 1.52008L1.24919 0.724487L4.2268 3.70209Z" fill="white"/></svg>
            {/if}
        </button>

        {#if instance.componentId?.length > 0}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="s-wUJ5ocmend_L"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.47885 1.69144C8.18037 1.52863 7.81963 1.52863 7.52115 1.69144L2.52115 4.41871C2.19989 4.59395 2 4.93066 2 5.29661V10.703C2 11.0689 2.19989 11.4056 2.52115 11.5809L7.52115 14.3081C7.81963 14.471 8.18037 14.471 8.47885 14.3081L8.5 14.2966V13.1575V11.5V8.29661L13 5.84206V8H14V5.29661C14 4.93066 13.8001 4.59395 13.4789 4.41871L8.47885 1.69144ZM3.54416 4.99979L8 2.56934L12.4558 4.99979L8 7.43025L3.54416 4.99979ZM3 5.84206L3 10.703L7.5 13.1575V8.29661L3 5.84206ZM13 9V11H15V12H13V14H12V12H10V11H12V9H13Z" fill="currentColor" class="s-wUJ5ocmend_L"></path></svg>

        <p>{pageComponents.find((comp) => comp.componentId === instance.componentId)?.name}</p>
        {:else}
        {@html nodeTags.find((tag) => tag.name === instance.nodeName)?.icon}
        <p>{instance.attributes.some((attr) => attr.name === 'class') ? instance.attributes.find((attr) => attr.name === 'class').value.split(' ')[0].replace('-', ' ') : instance.nodeName}</p>
        {/if}
    </li>
    {/each}
</ul>

<style>
    .navigator-holder:hover .depth {
        border-left: .1rem solid rgba( 255, 255, 255, .4);
    }

    .cms-line.component-line {
        background-color: rgba(27, 223, 93, .3);
    }

    li[data-drop-position="after"] {
        margin-bottom: .4rem;
        border-bottom: .1rem solid blue;
    }

    li[data-drop-position="after"] {
        margin-top: .4rem;
        border-top: .1rem solid blue;
    }
</style>
<script>
    import { selectedInstance } from '../../../stores/cms/selectedInstance';
    import { instances } from '../../../stores/cms/instances';
    import { nodeTags } from '../../../stores/cms/nodeTags';
    import { visibleIds } from '../../../stores/cms/visibleIds';
    import { drawInstances, computeOrders, changeSelection, toggleExpand } from '../../../stores/cms/functions';

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    $visibleIds = drawInstances();
    computeOrders();

    console.log('INS: ', $instances, $visibleIds);

    $: $visibleIds, console.log('Visible IDs changed: ', $visibleIds, $instances);
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<ul>
    {#each $instances as instance (instance.instanceId)}
        <li
            style={`order: ${instance.order}; display: ${$visibleIds.includes(instance.instanceId) ? 'flex' : 'none'}`}
            class="cms-line"
            class:selected={instance.instanceId === $selectedInstance.instanceId}
            on:click={(e) => {changeSelection(e, instance)} }
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
        
        {@html nodeTags.find((tag) => tag.name === instance.nodeName)?.icon}
        <p>{instance.attributes.some((attr) => attr.name === 'class') ? instance.attributes.find((attr) => attr.name === 'class').value.replace('-', ' ') : instance.nodeName}</p>
    </li>
    {/each}
</ul>

<style>
    .navigator-holder:hover .depth {
        border-left: .1rem solid rgba( 255, 255, 255, .4);
    }
</style>
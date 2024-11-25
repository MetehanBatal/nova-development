<script>
    import { selectedInstance } from '../../../stores/cms/selectedInstance';
    import { components } from '../../../stores/cms/components';
    import { variants } from '../../../stores/cms/variants';
    import { instances } from '../../../stores/cms/instances';
    import { cmsMode } from '../../../stores/cms/cmsMode';
    import { styleSheet } from '../../../stores/cms/styleSheet';
    import { nodeTags } from '../../../stores/cms/nodeTags';
    import { visibleIds } from '../../../stores/cms/visibleIds';
    import { changeSelection, toggleExpand, postMessage, computeOrders, drawInstances } from '../../../stores/cms/functions';
    import { onMount } from 'svelte';

    let selectedComponent = {};
    let layerInitReady = false;

    onMount(async() => {
        // Fetch components
        //
        try {
            const componentsReq = await fetch(`https://preconvert.novus.studio/staging/components/view?limit=100&offset=0`);
            const componentsRes = await componentsReq.json();
            
            $components = componentsRes.data.docs;
        } catch (error) {
            console.error('Error fetching components:', error);
        }
    });

    function initLayers() {
        if (!layerInitReady) {
            return; }

        $visibleIds = drawInstances();
        computeOrders();

        postMessage('initialization', {page: {pageId: 'component'}, components: [selectedComponent], instances: $instances.filter((i) => i.variantId === $variants.selectedVariantId), styleSheet: $styleSheet});
    }

    async function focusOnComponent(component) {
        console.log($cmsMode);

        try {
            const compInstancesReq = await fetch(`http://localhost:3030/staging/instances/view?componentId=${component.componentId}`);
            const compInstancesRes = await compInstancesReq.json();

            const compVariantsReq = await fetch(`http://localhost:3030/staging/variants/view?componentId=${component.componentId}`);
            const compVariantsRes = await compVariantsReq.json();

            console.log(compVariantsRes);
            
            selectedComponent = component;
            $instances = compInstancesRes.data.instances;
            $variants = {
                selectedVariantId: compVariantsRes.data[0].variantId,
                variants: compVariantsRes.data
            }
            $components = [selectedComponent];

            layerInitReady = true;

            initLayers();

            $cmsMode = 'component';
        } catch (error) {
            console.error('Error fetching components:', error);
        }
    }

    $: $variants.selectedVariantId, initLayers()
</script>

{#if $cmsMode !== 'component'}
<ul class="components-holder">
    {#each $components as component (component.componentId)}
    <li class="component" on:click={() => focusOnComponent(component)}>
        <div class="bg-overlay">
            <img src={`/assets/images/components/${component.componentId}.jpg`} alt={component.name} />

            <div></div>
        </div>

        <div class="content">
            <div class="tag">
                <span>{component.occurrences?.length || 1} variants</span>
            </div>

            <p>{component.name}</p>
        </div>
    </li>
    {/each}
</ul>
{:else}
<ul>
    {#each $instances.filter((i) => i.variantId === $variants.selectedVariantId) as instance (instance.instanceId)}
        <!-- svelte-ignore missing-declaration -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li
            style={`order: ${instance.order}; display: ${$visibleIds.includes(instance.instanceId) ? 'flex' : 'none'}`}
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

        {@html nodeTags.find((tag) => tag.name === instance.nodeName)?.icon}
        <p>{instance.attributes.some((attr) => attr.name === 'class') ? instance.attributes.find((attr) => attr.name === 'class').value.split(' ')[0].replace('-', ' ') : instance.nodeName}</p>
    </li>
    {/each}
</ul>
{/if}

<style>
    .components-holder {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: .8rem;

        position: relative;

        padding: 0 1.6rem;
    }

    .component {
        position: relative;

        min-height: 6rem;
        padding: .4rem;

        border-radius: .4rem;

        overflow: hidden;

        cursor: pointer;
    }

    .bg-overlay,
    .bg-overlay div {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .bg-overlay div {
        background: linear-gradient(180deg, #0D121A 0%, #30476A 40%, #547BBB 100%);
        opacity: .72;

        z-index: 2;
    }

    .bg-overlay img {
        height: 100%;
        object-fit: cover;
    }

    .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        position: relative;

        height: 100%;

        z-index: 2;
    }

    .tag {
        width: fit-content;

        padding: .4rem .8rem;

        background-color: rgba( 6, 11, 19, .72 );
        backdrop-filter: blur(.4rem);
        border-radius: 12rem;
    }

    .tag p {
        font-size: 1.2rem;
    }
</style>
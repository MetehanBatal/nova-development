<script>
    import DragDropList from '$lib/cms/DragDropList.svelte';
    import { selectedInstance } from '../../../stores/cms/selectedInstance';
    import { components } from '../../../stores/cms/components';
    import { variants } from '../../../stores/cms/variants';
    import { instances } from '../../../stores/cms/instances';
    import { cmsMode } from '../../../stores/cms/cmsMode';
    import { styleSheet } from '../../../stores/cms/styleSheet';
    import { nodeTags } from '../../../stores/cms/nodeTags';
    import { visibleIds } from '../../../stores/cms/visibleIds';
    import { changeSelection, toggleExpand, postMessage, initLayers, focusOnComponent } from '../../../stores/cms/functions';
    
    import { onMount } from 'svelte';

    onMount(async() => {
        // Fetch components
        //
        try {
            const componentsReq = await fetch(`https://preconvert.novus.studio/staging/components/view?limit=100&offset=0`);
            const componentsRes = await componentsReq.json();
            
            $components = componentsRes.data?.docs || [];
        } catch (error) {
            console.error('Error fetching components:', error);
        }
    });

    $: $variants.selectedVariantId, initLayers()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
{#if $cmsMode !== 'component'}
<div class="components-group">
    <div class="components-header">
        <h3>Custom Components</h3>
    </div>

    {#if $components.filter((c) => c.type === 'custom').length > 0}
    <ul class="components-holder">
        {#each $components.filter((c) => c.type === 'custom') as component (component.componentId)}
        <li class="component" on:click={() => focusOnComponent(component.componentId)}>
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
    <p>No component found</p>
    {/if}
</div>

<div class="components-group">
    <div class="components-header">
        <h3>Preset Components</h3>
    </div>
    
    {#if $components.filter((c) => c.type === 'preset').length > 0}
    <ul class="components-holder">
        {#each $components.filter((c) => c.type === 'preset') as component (component.componentId)}
        <li class="component" on:click={() => focusOnComponent(component.componentId)}>
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
    <p>No component found</p>
    {/if}
</div>

<div class="components-group">
    <div class="components-header">
        <h3>Experiment Components</h3>
    </div>
    
    {#if $components.filter((c) => c.type === 'experiment').length > 0}
    <ul class="components-holder">
        {#each $components.filter((c) => c.type === 'experiment') as component (component.componentId)}
        <li class="component" on:click={() => focusOnComponent(component.componentId)}>
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
    <p>No component found</p>
    {/if}
</div>
{:else}
<DragDropList 
    items={$instances}
    nodeTags={nodeTags}
    on:change={({ detail }) => {
        console.log(detail);
        // $instances = detail.finalItems;
        // updateElements(detail.affectedInstances, detail.movedInstance);
        // $instances = detail.items;
    }}
/>
{/if}

<style>
    .components-group {
        margin-bottom: 3.6rem;
    }

    .components-header {
        border-bottom: .1rem solid #2e2e2e;
        padding-bottom: 1rem;
        margin-bottom: 1.2rem
    }

    .components-group h3 {
        font-size: 1.4rem;
        padding: 0 1.6rem;
    }

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
<script>   
    import { selectedInstance } from "../../../stores/cms/selectedInstance";
    import { styleSheet } from '../../../stores/cms/styleSheet';
    import { alterStylingProperty } from '../../../stores/cms/functions';
    

    import Switch from "$lib/toolkit/Switch.svelte";
    import FlexSelector from "$lib/cms/styling/FlexSelector.svelte";
    import GridSelector from "$lib/cms/styling/GridSelector.svelte";
    import { onMount } from "svelte";
    import { instances } from "../../../stores/cms/instances";

    let dropdownExpanded = true;

    let layoutOptions = [
        {
            name: 'Block',
            value: 'block'
        },
        {
            name: 'Flex',
            value: 'flex',
            component: FlexSelector
        },
        {
            name: 'Grid',
            value: 'grid',
            component: GridSelector
        },
        {
            name: 'None',
            value: 'none'
        }
    ];
    let selectedLayoutIndex = 0;
    
    let selectionChangeInProgress = false;
    let initialized = false;

    onMount(() => {
        initialized = true;
    });

    function getProperties() {
        selectionChangeInProgress = true;
        selectedLayoutIndex = $selectedInstance.styling?.['display'] ? layoutOptions.findIndex((opt) => opt.value === $selectedInstance.styling['display']) : 0;
        
        setTimeout(() =>{
            selectionChangeInProgress = false;
        }, 120);
    }

    function handleDisplayChange() {
        if (initialized && !selectionChangeInProgress) {
            alterStylingProperty('display', layoutOptions[selectedLayoutIndex].value);
        }
    }

    $: $selectedInstance.instanceId, getProperties();
    $: selectedLayoutIndex, handleDisplayChange();
</script>

<div class="styling-group layout-selector">
    <div class="header" on:click={() => { dropdownExpanded = !dropdownExpanded }}>
        <h4>Layout</h4>
        
        <svg style={`transform: rotate(${dropdownExpanded ? '90deg' : '0deg'});`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.29287 8.00004L6.64642 5.35359L7.35353 4.64648L10.7071 8.00004L7.35353 11.3536L6.64642 10.6465L9.29287 8.00004Z" fill="currentColor"></path>
        </svg>
    </div>

    {#if dropdownExpanded}
        <div class="options">
            <p>Display</p>

            <Switch options={layoutOptions} bind:selectedIndex={selectedLayoutIndex} gap="0" />
        </div>

        {#if layoutOptions[selectedLayoutIndex].component}
        <svelte:component this={layoutOptions[selectedLayoutIndex].component} />
        {/if}
    {/if}
</div>

<style>
    .styling-group {
        padding: 1rem;

        border-bottom: .1rem solid #2e2e2e;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        font-size: 1.4rem;
    }

    :global(.options .flex) {
        display: grid;
        grid-auto-flow: column;
        gap: .6rem;
    }
</style>
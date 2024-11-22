<script>
    import { selectedInstance } from "../../../stores/cms/selectedInstance";
    import { alterStylingProperty } from "../../../stores/cms/functions";
    import { onMount } from "svelte";

    let dropdownExpanded = false;
    let initialized = false;
    let selectionChangeInProgress = false;

    onMount(() => {
        initialized = true;
    });

    let backgroundColorValue = '';

    function getProperties() {
        selectionChangeInProgress = true;
        backgroundColorValue = $selectedInstance.styling?.['background-color'] ? $selectedInstance.styling['background-color'] : '';
        
        setTimeout(() =>{
            selectionChangeInProgress = false;
        }, 120);
    }

    $: $selectedInstance.instanceId, getProperties();
</script>

<div class="styling-group">
    <div class="header" on:click={() => { dropdownExpanded = !dropdownExpanded }}>
        <h4>Backgrounds</h4>
        
        <svg style={`transform: rotate(${dropdownExpanded ? '90deg' : '0deg'});`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.29287 8.00004L6.64642 5.35359L7.35353 4.64648L10.7071 8.00004L7.35353 11.3536L6.64642 10.6465L9.29287 8.00004Z" fill="currentColor"></path>
        </svg>
    </div>

    {#if dropdownExpanded}
    <div class="options">
        <p>Color</p>

        <div class="color-selection">
            <input type="color" name="color" bind:value={backgroundColorValue} on:blur={(e) => { alterStylingProperty('background-color', e.target.value)}} />
            <input type="text" bind:value={backgroundColorValue} on:blur={(e) => { alterStylingProperty('background-color', e.target.value)}} />
        </div>
    </div>
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

    .options {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: .5rem;

        margin-top: 2rem;
    }

    .options > div {
        display: flex;
        align-items: center;
        gap: .5rem;
    }

    .options p {
        font-size: 1.2rem;
        color: rgba(255, 255, 255, .66);
        min-width: 4rem;
    }
</style>
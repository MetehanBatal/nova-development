<!--
    // width 
    // height
    // min-width
    // min-height
    // max-width
    // max-height
-->
<script>
    import { selectedInstance } from "../../../stores/cms/selectedInstance";
	import { alterStylingProperty } from '../../../stores/cms/functions';

	import { onMount } from "svelte";

	let initialized = false;
	let selectionChangeInProgress = false;
	let dropdownExpanded = false;

    onMount(() => {
        initialized = true;
    });

    let selectedWidthValue = '';
    let selectedHeightValue = '';
    let selectedMinHeightValue = '';
    let selectedMaxHeightValue = '';
    let selectedMinWidthValue = '';
    let selectedMaxWidthValue = '';

    function getProperties() {
        selectionChangeInProgress = true;
        selectedWidthValue = $selectedInstance.styling?.['width'] ? $selectedInstance.styling['width'] : '';
		selectedHeightValue = $selectedInstance.styling?.['height'] ? $selectedInstance.styling['height'] : '';
		selectedMinHeightValue = $selectedInstance.styling?.['min-height'] ? $selectedInstance.styling['min-height'] : '';
		selectedMaxHeightValue = $selectedInstance.styling?.['max-height'] ? $selectedInstance.styling['max-height'] : '';
		selectedMinWidthValue = $selectedInstance.styling?.['min-width'] ? $selectedInstance.styling['min-width'] : '';
		selectedMaxWidthValue = $selectedInstance.styling?.['max-width'] ? $selectedInstance.styling['max-width'] : '';
        
        setTimeout(() =>{
            selectionChangeInProgress = false;
        }, 120);
    }

	function handleStylingChange(target) {
        alterStylingProperty(target.getAttribute('name'), target.value);
    }

	$: $selectedInstance.instanceId, getProperties();
</script>

<div class="styling-group">
    <div class="header" on:click={() => { dropdownExpanded = !dropdownExpanded }}>
        <h4>Size</h4>
        
        <svg style={`transform: rotate(${dropdownExpanded ? '90deg' : '0deg'});`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.29287 8.00004L6.64642 5.35359L7.35353 4.64648L10.7071 8.00004L7.35353 11.3536L6.64642 10.6465L9.29287 8.00004Z" fill="currentColor"></path>
        </svg>
    </div>

    {#if dropdownExpanded}
        <div class="size-group">
            <div>
                <label for="width">Width</label>
                <input type="text" name="width" bind:value={selectedWidthValue} on:blur={(e) => { handleStylingChange(e.target)}} />
            </div>
            <div>
                <label for="height">Height</label>
                <input type="text" name="height" bind:value={selectedHeightValue} on:blur={(e) => { handleStylingChange(e.target)}} />
            </div>
            <div>
                <label for="min-height">Min H</label>
                <input type="text" name="min-height" bind:value={selectedMinHeightValue} on:blur={(e) => { handleStylingChange(e.target)}} />
            </div>
            <div>
                <label for="max-height">Max H</label>
                <input type="text" name="max-height" bind:value={selectedMaxHeightValue} on:blur={(e) => { handleStylingChange(e.target)}} />
            </div>
            <div>
                <label for="min-width">Min W</label>
                <input type="text" name="min-width" bind:value={selectedMinWidthValue} on:blur={(e) => { handleStylingChange(e.target)}} />
            </div>
            <div>
                <label for="max-width">Max W</label>
                <input type="text" name="max-width" bind:value={selectedMaxWidthValue} on:blur={(e) => { handleStylingChange(e.target)}} />
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

    .size-group {
        width: fit-content;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        width: 100%;
        padding-top: 2rem;
    }

    .size-group label {
        font-size: 1.2rem;
        color: rgba(255, 255, 255, .66);
        min-width: 4rem;
    }
    .size-group div {
        display: flex;
        align-items: center;
        justify-content: stretch;
        
        gap: 1rem;
    }

    .size-group label {
        min-width: 4rem;
        
        white-space: pre;
    }
</style>
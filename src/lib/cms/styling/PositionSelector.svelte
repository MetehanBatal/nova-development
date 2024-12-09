<script>
    import { selectedInstance } from "../../../stores/cms/selectedInstance";
    import { selectedBreakpoint } from '../../../stores/cms/selectedBreakpoint';
    import { alterStylingProperty } from '../../../stores/cms/functions';

    import Dropdown from "$lib/toolkit/Dropdown.svelte";
    import { onMount } from "svelte";

    let initialized = false;
    let selectionChangeInProgress = false;
    let dropdownExpanded = false;

    onMount(() => {
        initialized = true;
    });

    let positionOptions = [
        {
            name: 'Static',
            value: 'static',
            icon: '/assets/icons/cms/position-static.svg',
            index: 0
        },
        {
            name: 'Relative',
            value: 'relative',
            icon: '/assets/icons/cms/position-relative.svg',
            index: 1
        },
        {
            name: 'Absolute',
            value: 'absolute',
            icon: '/assets/icons/cms/position-absolute.svg',
            index: 2
        },
        {
            name: 'Fixed',
            value: 'fixed',
            icon: '/assets/icons/cms/position-fixed.svg',
            index: 3
        },
        {
            name: 'Sticky',
            value: 'sticky',
            icon: '/assets/icons/cms/position-sticky.svg',
            index: 4
        }
    ];
    let selectedPositionIndex = 0;

    let topValue = '';
    let rightValue = '';
    let bottomValue = '';
    let leftValue = '';
    let zIndexValue = '';

    function getProperties() {
        selectionChangeInProgress = true;
        selectedPositionIndex = $selectedInstance.styling?.[$selectedBreakpoint]?.['position'] ? positionOptions.findIndex((opt) => opt.value === $selectedInstance.styling[$selectedBreakpoint]?.['position']) : 0;
        topValue = $selectedInstance.styling?.[$selectedBreakpoint]?.['top'] ? $selectedInstance.styling[$selectedBreakpoint]?.['top'] : '';
		rightValue = $selectedInstance.styling?.[$selectedBreakpoint]?.['right'] ? $selectedInstance.styling[$selectedBreakpoint]?.['right'] : '';
		bottomValue = $selectedInstance.styling?.[$selectedBreakpoint]?.['bottom'] ? $selectedInstance.styling[$selectedBreakpoint]?.['bottom'] : '';
		leftValue = $selectedInstance.styling?.[$selectedBreakpoint]?.['left'] ? $selectedInstance.styling[$selectedBreakpoint]?.['left'] : '';
        zIndexValue = $selectedInstance.styling?.[$selectedBreakpoint]?.['z-index'] ? $selectedInstance.styling[$selectedBreakpoint]?.['z-index'] : '';;
        
        setTimeout(() =>{
            selectionChangeInProgress = false;
        }, 120);
    }

	function handleStylingChange(target) {
        alterStylingProperty(target.getAttribute('name'), target.value);
    }

    function handlePositionChange() {
        if (initialized && !selectionChangeInProgress) {
            $selectedInstance.styling[$selectedBreakpoint]['position'] = positionOptions[selectedPositionIndex];

            alterStylingProperty('position', positionOptions[selectedPositionIndex].value);
        }
    }

    function handleZIndexChange(target) {
        if (initialized && !selectionChangeInProgress) {
            $selectedInstance.styling['z-index'] = target.value;

            alterStylingProperty(target.getAttribute('name'), target.value);
        }
    }

	$: $selectedInstance.instanceId, getProperties();
    $: selectedPositionIndex, handlePositionChange();
</script>

<div class="styling-group">
    <div class="header" on:click={() => { dropdownExpanded = !dropdownExpanded }}>
        <h4>Position</h4>
        
        <svg style={`transform: rotate(${dropdownExpanded ? '90deg' : '0deg'});`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.29287 8.00004L6.64642 5.35359L7.35353 4.64648L10.7071 8.00004L7.35353 11.3536L6.64642 10.6465L9.29287 8.00004Z" fill="currentColor"></path>
        </svg>
    </div>

    {#if dropdownExpanded}
        <div class="options">
            <p>Position</p>

            <Dropdown options={positionOptions} bind:selectedStatusIndex={selectedPositionIndex} />
        </div>

        {#if selectedPositionIndex !== 0}
        <div class="options directions">     
            <p></p>
            
            <div class="spacing-items">
                <div>
                    <label for="top">Top</label>
                    <input type="text" name="top" bind:value={topValue} on:blur={(e) => { handleStylingChange(e.target) }} />
                </div>

                <div>
                    <label for="left">Left</label>
                    <input type="text" name="left" bind:value={leftValue} on:blur={(e) => { handleStylingChange(e.target) }} />
                </div>

                <div>
                    <label for="right">Right</label>
                    <input type="text" name="right" bind:value={rightValue} on:blur={(e) => { handleStylingChange(e.target) }} />
                </div>

                <div>
                    <label for="bottom">Bottom</label>
                    <input type="text" name="bottom" bind:value={bottomValue} on:blur={(e) => { handleStylingChange(e.target) }} />
                </div>
            </div>
        </div>

        <div class="options directions">     
            <p>Z-Index</p>
            
            <input type="text" name="z-index" bind:value={zIndexValue} on:blur={(e) => {handleZIndexChange(e.target)}} />
        </div>
        {/if}
    {/if}
</div>

<style>
    :global(.styling-group .dropdown-box) {
        width: 100%;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        font-size: 1.4rem;
    }
</style>
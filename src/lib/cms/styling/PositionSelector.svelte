<script>
    import { selectedInstance } from "$stores/cms/selectedInstance";
    import { alterStylingProperty } from '$stores/cms/functions';

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
            icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.70714 8.00004L12.3536 4.35359L11.6465 3.64648L8.00004 7.29293L4.35359 3.64648L3.64648 4.35359L7.29293 8.00004L3.64648 11.6465L4.35359 12.3536L8.00004 8.70714L11.6465 12.3536L12.3536 11.6465L8.70714 8.00004Z" fill="currentColor"></path></svg>',
            index: 0
        },
        {
            name: 'Relative',
            value: 'relative',
            icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 2H9V3H11V8H12V3H14V2H11ZM3 9H2V14H3V12H8V11H3V9ZM14 10C14 9.44772 13.5523 9 13 9H10C9.44772 9 9 9.44772 9 10V13C9 13.5523 9.44772 14 10 14H13C13.5523 14 14 13.5523 14 13V10Z" fill="currentColor"></path></svg>',
            index: 1
        },
        {
            name: 'Absolute',
            value: 'absolute',
            icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M8 3V2H3C2.44772 2 2 2.44772 2 3V8H3V3H8Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11 2H9V3H11V8H12V3H14V2H11ZM3 9H2V14H3V12H8V11H3V9ZM14 10C14 9.44772 13.5523 9 13 9H10C9.44772 9 9 9.44772 9 10V13C9 13.5523 9.44772 14 10 14H13C13.5523 14 14 13.5523 14 13V10Z" fill="currentColor"></path></svg>',
            index: 2
        },
        {
            name: 'Fixed',
            value: 'fixed',
            icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 2H9V3H11V8H12V3H14V2H11ZM3 9H2V14H3V12H8V11H3V9ZM14 10C14 9.44772 13.5523 9 13 9H10C9.44772 9 9 9.44772 9 10V13C9 13.5523 9.44772 14 10 14H13C13.5523 14 14 13.5523 14 13V10Z" fill="currentColor"></path><path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M8 3V2H3C2.44772 2 2 2.44772 2 3V8H3V3H8ZM5.5 4.75C5.5 5.16421 5.16421 5.5 4.75 5.5C4.33579 5.5 4 5.16421 4 4.75C4 4.33579 4.33579 4 4.75 4C5.16421 4 5.5 4.33579 5.5 4.75ZM7.25 5.5C7.66421 5.5 8 5.16421 8 4.75C8 4.33579 7.66421 4 7.25 4C6.83579 4 6.5 4.33579 6.5 4.75C6.5 5.16421 6.83579 5.5 7.25 5.5Z" fill="currentColor"></path></svg>',
            index: 3
        },
        {
            name: 'Sticky',
            value: 'sticky',
            icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M8 3H3L3 13H13V8H14V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H8V3ZM8 4.75C8 5.16421 7.66421 5.5 7.25 5.5C6.83579 5.5 6.5 5.16421 6.5 4.75C6.5 4.33579 6.83579 4 7.25 4C7.66421 4 8 4.33579 8 4.75ZM4.75 5.5C5.16421 5.5 5.5 5.16421 5.5 4.75C5.5 4.33579 5.16421 4 4.75 4C4.33579 4 4 4.33579 4 4.75C4 5.16421 4.33579 5.5 4.75 5.5Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.5C13.3807 6.5 14.5 5.38071 14.5 4C14.5 2.61929 13.3807 1.5 12 1.5C10.6193 1.5 9.5 2.61929 9.5 4C9.5 4.50954 9.65244 4.98348 9.9142 5.3787L6.14645 9.14645C5.95118 9.34171 5.95118 9.65829 6.14645 9.85355C6.34171 10.0488 6.65829 10.0488 6.85355 9.85355L10.6213 6.0858C11.0165 6.34756 11.4905 6.5 12 6.5Z" fill="currentColor"></path></svg>',
            index: 4
        }
    ];
    let selectedPositionIndex = 0;

    let topValue = '';
    let rightValue = '';
    let bottomValue = '';
    let leftValue = '';

    function getProperties() {
        selectionChangeInProgress = true;
        selectedPositionIndex = $selectedInstance.styling?.['position'] ? positionOptions.findIndex((opt) => opt.value === $selectedInstance.styling['position']) : 0;
        topValue = $selectedInstance.styling?.['top'] ? $selectedInstance.styling['top'] : '';
		rightValue = $selectedInstance.styling?.['right'] ? $selectedInstance.styling['right'] : '';
		bottomValue = $selectedInstance.styling?.['bottom'] ? $selectedInstance.styling['bottom'] : '';
		leftValue = $selectedInstance.styling?.['left'] ? $selectedInstance.styling['left'] : '';
        
        setTimeout(() =>{
            selectionChangeInProgress = false;
        }, 120);
    }

	function handleStylingChange(target) {
        alterStylingProperty(target.getAttribute('name'), target.value);
    }

    function handlePositionChange() {
        if (initialized && !selectionChangeInProgress) {
            $selectedInstance.styling['position'] = positionOptions[selectedPositionIndex];

            alterStylingProperty('position', positionOptions[selectedPositionIndex].value);
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
        {/if}
    {/if}
</div>

<style>
    .styling-group {
        padding: 1rem;

        border-bottom: .1rem solid #2e2e2e;
    }

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
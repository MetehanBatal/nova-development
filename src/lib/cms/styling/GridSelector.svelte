<script>
    import { selectedInstance } from "$stores/cms/selectedInstance";
    import { alterStylingProperty } from '$stores/cms/functions';

    import { onMount } from "svelte";
    import Switch from "$lib/toolkit/Switch.svelte";

    let initialized = false;
    let selectionChangeInProgress = false;

    onMount(() => {
        initialized = true;
    });

    let gridDirectionOptions = [
        {
            icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.2929 7.00004L9.14645 3.85359L9.85355 3.14648L14.2071 7.50004L9.85355 11.8536L9.14645 11.1465L12.2929 8.00004H3V7.00004H12.2929Z" fill="currentColor"></path></svg>',
            value: 'column'
        },
        {
            icon: '<svg  width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.00001 12.2929L4.85356 9.14645L4.14645 9.85355L8.50001 14.2071L12.8536 9.85355L12.1465 9.14645L9.00001 12.2929L9.00001 3H8.00001L8.00001 12.2929Z" fill="currentColor"></path></svg>',
            value: 'row'
        }
    ];
    let gridDirectionIndex = 0;

    /* ********************** */

    let justifyContentOptions = [
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 14V10H5.5C5.77614 10 6 9.77614 6 9.5V8.5C6 8.22386 5.77614 8 5.5 8H3V7H5.5C5.77614 7 6 6.77614 6 6.5V5.5C6 5.22386 5.77614 5 5.5 5H3V1H2V14H3Z" fill="currentColor"></path><path d="M7 5.5C7 5.22386 7.22386 5 7.5 5H9.5C9.77614 5 10 5.22386 10 5.5V6.5C10 6.77614 9.77614 7 9.5 7H7.5C7.22386 7 7 6.77614 7 6.5V5.5Z" fill="currentColor"></path><path d="M7 8.5C7 8.22386 7.22386 8 7.5 8H9.5C9.77614 8 10 8.22386 10 8.5V9.5C10 9.77614 9.77614 10 9.5 10H7.5C7.22386 10 7 9.77614 7 9.5V8.5Z" fill="currentColor"></path></svg>`,
            value : "start"
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 14V10H4.5C4.22386 10 4 9.77614 4 9.5V8.5C4 8.22386 4.22386 8 4.5 8H7V7H2.5C2.22386 7 2 6.77614 2 6.5V5.5C2 5.22386 2.22386 5 2.5 5H7V1H8V14H7Z" fill="currentColor"></path><path d="M14 5.5C14 5.22386 13.7761 5 13.5 5H9V7H13.5C13.7761 7 14 6.77614 14 6.5V5.5Z" fill="currentColor"></path><path d="M12 8.5C12 8.22386 11.7761 8 11.5 8H9V10H11.5C11.7761 10 12 9.77614 12 9.5V8.5Z" fill="currentColor"></path></svg>`,
            value : "center"
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 14V10H8.5C8.22386 10 8 9.77614 8 9.5V8.5C8 8.22386 8.22386 8 8.5 8H13V7H4.5C4.22386 7 4 6.77614 4 6.5V5.5C4 5.22386 4.22386 5 4.5 5H13V1H14V14H13Z" fill="currentColor"></path></svg>`,
            value : "end"
        }, 
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 14V1H3V5H7.5C7.77614 5 8 5.22386 8 5.5L8 6.5C8 6.77614 7.77614 7 7.5 7H3L3 8H7.5C7.77614 8 8 8.22386 8 8.5L8 9.5C8 9.77614 7.77614 10 7.5 10H3L3 14H2Z" fill="currentColor"></path><path d="M14 14V10H9.5C9.22386 10 9 9.77614 9 9.5V8.5C9 8.22386 9.22386 8 9.5 8H14V7H9.5C9.22386 7 9 6.77614 9 6.5V5.5C9 5.22386 9.22386 5 9.5 5H14V1H15V14H14Z" fill="currentColor"></path></svg>`,
            value : "stretch"
        }, 
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 14V1H3V5H5.5C5.77614 5 6 5.22386 6 5.5L6 6.5C6 6.77614 5.77614 7 5.5 7H3L3 8H5.5C5.77614 8 6 8.22386 6 8.5V9.5C6 9.77614 5.77614 10 5.5 10H3L3 14H2ZM14 14V10H11.5C11.2239 10 11 9.77614 11 9.5V8.5C11 8.22386 11.2239 8 11.5 8H14V7H11.5C11.2239 7 11 6.77614 11 6.5V5.5C11 5.22386 11.2239 5 11.5 5H14V1H15V14H14Z" fill="currentColor"></path></svg>`,
            value : "space-between"
        }, 
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 5.5C4 5.22386 4.22386 5 4.5 5H6.5C6.77614 5 7 5.22386 7 5.5L7 6.5C7 6.77614 6.77614 7 6.5 7H4.5C4.22386 7 4 6.77614 4 6.5L4 5.5ZM4.5 8C4.22386 8 4 8.22386 4 8.5L4 9.5C4 9.77614 4.22386 10 4.5 10H6.5C6.77614 10 7 9.77614 7 9.5V8.5C7 8.22386 6.77614 8 6.5 8H4.5ZM10.5 8C10.2239 8 10 8.22386 10 8.5V9.5C10 9.77614 10.2239 10 10.5 10H12.5C12.7761 10 13 9.77614 13 9.5V8.5C13 8.22386 12.7761 8 12.5 8H10.5ZM10 5.5C10 5.22386 10.2239 5 10.5 5H12.5C12.7761 5 13 5.22386 13 5.5V6.5C13 6.77614 12.7761 7 12.5 7H10.5C10.2239 7 10 6.77614 10 6.5V5.5Z" fill="currentColor"></path></svg>`,
            value : "space-around"
        }, 
    ];
    let selectedJustifyContentIndex = 0;

    /* ********************** */

    let alignContentOptions = [
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 3L11 3V5.5C11 5.77614 10.7761 6 10.5 6H9.5C9.22386 6 9 5.77614 9 5.5V3L8 3L8 5.5C8 5.77614 7.77614 6 7.5 6H6.5C6.22386 6 6 5.77614 6 5.5L6 3L2 3V2H15V3Z" fill="currentColor"></path><path d="M6.5 7C6.22386 7 6 7.22386 6 7.5L6 9.5C6 9.77614 6.22386 10 6.5 10H7.5C7.77614 10 8 9.77614 8 9.5L8 7.5C8 7.22386 7.77614 7 7.5 7H6.5Z" fill="currentColor"></path><path d="M9.5 7C9.22386 7 9 7.22386 9 7.5V9.5C9 9.77614 9.22386 10 9.5 10H10.5C10.7761 10 11 9.77614 11 9.5V7.5C11 7.22386 10.7761 7 10.5 7H9.5Z" fill="currentColor"></path></svg>`,
            value : "start"
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 7V4.5C11 4.22386 10.7761 4 10.5 4H9.5C9.22386 4 9 4.22386 9 4.5V7L8 7V4.5C8 4.22386 7.77614 4 7.5 4H6.5C6.22386 4 6 4.22386 6 4.5V7L2 7V8L15 8V7H11Z" fill="currentColor"></path><path d="M11 9V11.5C11 11.7761 10.7761 12 10.5 12H9.5C9.22386 12 9 11.7761 9 11.5V9H11Z" fill="currentColor"></path><path d="M8 9V11.5C8 11.7761 7.77614 12 7.5 12H6.5C6.22386 12 6 11.7761 6 11.5V9H8Z" fill="currentColor"></path></svg>`,
            value : "center"
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 8C6.22386 8 6 7.77614 6 7.5V5.5C6 5.22386 6.22386 5 6.5 5H7.5C7.77614 5 8 5.22386 8 5.5L8 7.5C8 7.77614 7.77614 8 7.5 8H6.5Z" fill="currentColor"></path><path d="M6.5 9C6.22386 9 6 9.22386 6 9.5V12H2V13L15 13V12L11 12V9.5C11 9.22386 10.7761 9 10.5 9H9.5C9.22386 9 9 9.22386 9 9.5V12H8L8 9.5C8 9.22386 7.77614 9 7.5 9H6.5Z" fill="currentColor"></path><path d="M9.5 8C9.22386 8 9 7.77614 9 7.5V5.5C9 5.22386 9.22386 5 9.5 5H10.5C10.7761 5 11 5.22386 11 5.5V7.5C11 7.77614 10.7761 8 10.5 8H9.5Z" fill="currentColor"></path></svg>`,
            value : "end"
        }, 
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 3L11 3V6.5C11 6.77614 10.7761 7 10.5 7H9.5C9.22386 7 9 6.77614 9 6.5V3L8 3V6.5C8 6.77614 7.77614 7 7.5 7H6.5C6.22386 7 6 6.77614 6 6.5V3L2 3V2H15V3Z" fill="currentColor"></path><path d="M15 13L2 13V12L6 12V8.5C6 8.22386 6.22386 8 6.5 8H7.5C7.77614 8 8 8.22386 8 8.5V12H9V8.5C9 8.22386 9.22386 8 9.5 8H10.5C10.7761 8 11 8.22386 11 8.5V12H15V13Z" fill="currentColor"></path></svg>`,
            value : "stretch"
        }, 
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 2L11 2V4.5C11 4.77614 10.7761 5 10.5 5H9.5C9.22386 5 9 4.77614 9 4.5V2L8 2V4.5C8 4.77614 7.77614 5 7.5 5H6.5C6.22386 5 6 4.77614 6 4.5V2L2 2V1H15V2Z" fill="currentColor"></path><path d="M15 14L2 14V13L6 13V10.5C6 10.2239 6.22386 10 6.5 10H7.5C7.77614 10 8 10.2239 8 10.5V13H9V10.5C9 10.2239 9.22386 10 9.5 10H10.5C10.7761 10 11 10.2239 11 10.5V13H15V14Z" fill="currentColor"></path></svg>`,
            value : "space-between"
        }, 
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 1H15V2L2 2V1Z" fill="currentColor"></path><path d="M2 13L15 13V14L2 14V13Z" fill="currentColor"></path><path d="M8 3.5C8 3.22386 7.77614 3 7.5 3L6.5 3C6.22386 3 6 3.22386 6 3.5L6 5.5C6 5.77614 6.22386 6 6.5 6L7.5 6C7.77614 6 8 5.77614 8 5.5V3.5Z" fill="currentColor"></path><path d="M9 3.5C9 3.22386 9.22386 3 9.5 3L10.5 3C10.7761 3 11 3.22386 11 3.5V5.5C11 5.77614 10.7761 6 10.5 6L9.5 6C9.22386 6 9 5.77614 9 5.5V3.5Z" fill="currentColor"></path><path d="M8 9.5C8 9.22386 7.77614 9 7.5 9L6.5 9C6.22386 9 6 9.22386 6 9.5L6 11.5C6 11.7761 6.22386 12 6.5 12H7.5C7.77614 12 8 11.7761 8 11.5V9.5Z" fill="currentColor"></path><path d="M9 9.5C9 9.22386 9.22386 9 9.5 9L10.5 9C10.7761 9 11 9.22386 11 9.5V11.5C11 11.7761 10.7761 12 10.5 12H9.5C9.22386 12 9 11.7761 9 11.5V9.5Z" fill="currentColor"></path></svg>`,
            value : "space-around"
        }, 
    ];
    let selectedAlignContentIndex = 0;

    /* ********************** */

    let columnCountValue = 2;
    let rowCountValue = 2;

    let gapRowValue = '';
    let gapColumnValue = '';

    function getProperties() {
        selectionChangeInProgress = true;
        gridDirectionIndex = $selectedInstance.styling?.['grid-auto-flow'] ? gridDirectionOptions.findIndex((opt) => opt.value === $selectedInstance.styling['grid-auto-flow']) : 0;
        selectedJustifyContentIndex = $selectedInstance.styling?.['justify-content'] ? justifyContentOptions.findIndex((opt) => opt.value === $selectedInstance.styling['justify-content']) : 0;
        selectedAlignContentIndex = $selectedInstance.styling?.['align-items'] ? alignContentOptions.findIndex((opt) => opt.value === $selectedInstance.styling['align-content']) : 0;
        gapRowValue = $selectedInstance.styling?.['gap-row'] ? $selectedInstance.styling['gap-row'] : '';
        gapColumnValue = $selectedInstance.styling?.['gap-column'] ? $selectedInstance.styling['gap-column'] : '';
        rowCountValue = $selectedInstance.styling?.['grid-template-rows'] ? $selectedInstance.styling['grid-template-rows'].match(/\bauto\b/g)?.length : 2
        columnCountValue = $selectedInstance.styling?.['grid-template-columns'] ? $selectedInstance.styling['grid-template-columns'].match(/\b1fr\b/g)?.length : 2;
        
        setTimeout(() =>{
            selectionChangeInProgress = false;
        }, 120);
    }

    function handleDirectionChange() {
        if (initialized && !selectionChangeInProgress) {
            $selectedInstance.styling['grid-auto-flow'] = gridDirectionOptions[gridDirectionIndex];

            alterStylingProperty('grid-auto-flow', gridDirectionOptions[gridDirectionIndex].value);
        }
    }

    function handleJCChange() {
        if (initialized && !selectionChangeInProgress) {
            $selectedInstance.styling['justify-content'] = justifyContentOptions[selectedJustifyContentIndex];

            alterStylingProperty('justify-content', justifyContentOptions[selectedJustifyContentIndex].value);
        }
    }
    
    function handleACChange() {
        if (initialized && !selectionChangeInProgress) {
            $selectedInstance.styling['align-content'] = alignContentOptions[selectedAlignContentIndex];

            alterStylingProperty('align-content', alignContentOptions[selectedAlignContentIndex].value);
        }
    }

    function handleCountChange(target) {
        const prop = target.getAttribute('name');
        let valueTemplate = prop === 'grid-template-columns' ? '1fr ' : 'auto ';
        let count = parseInt(target.value, 10);
        let value = valueTemplate.repeat(count).trim();

        alterStylingProperty(prop, value);
    }

    function handleGapChange(target) {
        alterStylingProperty(target.getAttribute('name'), target.value);
    }

    $: $selectedInstance.instanceId, getProperties();
    $: gridDirectionIndex, handleDirectionChange();
    $: selectedJustifyContentIndex, handleJCChange();
    $: selectedAlignContentIndex, handleACChange();
</script>

<div class="options">
    <p>Direction</p>

    <Switch options={gridDirectionOptions} bind:selectedIndex={gridDirectionIndex} gap="0" />                    
</div>
<div class="options">
    <p>Columns</p>
    <input type="number" min="0" name="grid-template-columns" bind:value={columnCountValue} on:blur={(e) => {handleCountChange(e.target)}}  />

    <p>Rows</p>
    <input type="number" min="0" name="grid-template-rows" bind:value={rowCountValue} on:blur={(e) => { handleCountChange(e.target) }} />
</div>

<div class="options aligns">
    <p>X - Axis</p>
    <Switch options={justifyContentOptions} bind:selectedIndex={selectedJustifyContentIndex} gap="0" />

    <p>Y - Axis</p>
    <Switch options={alignContentOptions} bind:selectedIndex={selectedAlignContentIndex} gap="0" />
</div>

<div class="options">
    <p>Gap</p>

    <div class="flex">
        <div class="input-holder">
            <input type="text" name="row-gap" bind:value={gapRowValue} on:blur={(e) => {handleGapChange(e.target)}} />

            <!-- <Dropdown options={measurementOptions} bind:selectedStatusIndex={selectedMeasurementIndex} position="right" /> -->
        </div>        
        <input type="text" name="column-gap" bind:value={gapColumnValue} on:blur={(e) => {handleGapChange(e.target)}} />
    </div>
</div>

<style>
    .gap-selector {
        display: grid;
        gap: .4rem;
        grid-template-columns: 1fr 1fr 2.4rem;
        grid-column: auto;
    }

    .range-selector {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 2.4rem;
    }
</style>
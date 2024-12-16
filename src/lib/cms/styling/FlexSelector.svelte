<script>
    import { selectedInstance } from "../../../stores/cms/selectedInstance";
    import { selectedBreakpoint } from '../../../stores/cms/selectedBreakpoint';
    import { alterStylingProperty, getStyleValueFromCascade } from '../../../stores/cms/functions';

    import Switch from "$lib/toolkit/Switch.svelte";
    import { onMount } from "svelte";

    let initialized = false;
    let selectionChangeInProgress = false;

    let flexState = {
        flexDirection: '',
        justifyContent: '',
        alignItems: '',
        gapRow: '',
        gapColumn: ''
    }

    onMount(() => {
        initialized = true;
    });

    // const measurementOptions = [
    //     { id: 'px', name: 'PX' },
    //     { id: '%', name: '%' },
    //     { id: 'em', name: 'EM' },
    //     { id: 'rem', name: 'REM' },
    //     { id: 'ch', name: 'CH' },
	// 	{ id: 'vw', name: 'VW' },
	// 	{ id: 'vh', name: 'VH' },
	// 	{ id: 'svw', name: 'SVW' },
	// 	{ id: 'svh', name: 'SVH' },
	// 	{ id: 'auto', name: 'Auto' }
	// ];
    // let selectedMeasurementIndex = measurementOptions.length - 1;

    /* ********************** */

    let flexDirectionOptions = [
        {
            icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.2929 7.00004L9.14645 3.85359L9.85355 3.14648L14.2071 7.50004L9.85355 11.8536L9.14645 11.1465L12.2929 8.00004H3V7.00004H12.2929Z" fill="currentColor"></path></svg>',
            value: 'row'
        },
        {
            icon: '<svg  width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.00001 12.2929L4.85356 9.14645L4.14645 9.85355L8.50001 14.2071L12.8536 9.85355L12.1465 9.14645L9.00001 12.2929L9.00001 3H8.00001L8.00001 12.2929Z" fill="currentColor"></path></svg>',
            value: 'column'
        }
    ];
    let selectedFlexDirectionIndex = 0;

    /* ********************** */

    let justifyContentOptions = [
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 14V1H3V5H11.5C11.7761 5 12 5.22386 12 5.5V6.5C12 6.77614 11.7761 7 11.5 7H3V8H7.5C7.77614 8 8 8.22386 8 8.5V9.5C8 9.77614 7.77614 10 7.5 10H3V14H2Z" fill="currentColor"></path></svg>`,
            value : "flex-start"
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 14V10H4.5C4.22386 10 4 9.77614 4 9.5V8.5C4 8.22386 4.22386 8 4.5 8H7V7H2.5C2.22386 7 2 6.77614 2 6.5V5.5C2 5.22386 2.22386 5 2.5 5H7V1H8V14H7Z" fill="currentColor"></path><path d="M14 5.5C14 5.22386 13.7761 5 13.5 5H9V7H13.5C13.7761 7 14 6.77614 14 6.5V5.5Z" fill="currentColor"></path><path d="M12 8.5C12 8.22386 11.7761 8 11.5 8H9V10H11.5C11.7761 10 12 9.77614 12 9.5V8.5Z" fill="currentColor"></path></svg>`,
            value : "center"
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 14V10H8.5C8.22386 10 8 9.77614 8 9.5V8.5C8 8.22386 8.22386 8 8.5 8H13V7H4.5C4.22386 7 4 6.77614 4 6.5V5.5C4 5.22386 4.22386 5 4.5 5H13V1H14V14H13Z" fill="currentColor"></path></svg>`,
            value : "flex-end"
        },        
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 4L14 1L15 1L15 14L14 14L14 11L12.5 11C12.2239 11 12 10.7761 12 10.5L12 4.5C12 4.22386 12.2239 4 12.5 4L14 4Z" fill="currentColor"></path><path d="M2 14L2 0.999999L3 0.999999L3 4L4.5 4C4.77614 4 5 4.22386 5 4.5L5 10.5C5 10.7761 4.77614 11 4.5 11L3 11L3 14L2 14Z" fill="currentColor"></path></svg>`,
            value : "space-between"
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 14V1H3V14H2Z" fill="currentColor"></path><path d="M4.5 4C4.22386 4 4 4.22386 4 4.5L4 10.5C4 10.7761 4.22386 11 4.5 11H5.5C5.77614 11 6 10.7761 6 10.5L6 4.5C6 4.22386 5.77614 4 5.5 4L4.5 4Z" fill="currentColor"></path><path d="M11.5 11C11.2239 11 11 10.7761 11 10.5V4.5C11 4.22386 11.2239 4 11.5 4L12.5 4C12.7761 4 13 4.22386 13 4.5V10.5C13 10.7761 12.7761 11 12.5 11H11.5Z" fill="currentColor"></path><path d="M14 14V1H15V14H14Z" fill="currentColor"></path></svg>`,
            value : "space-around"
        },
    ];
    let selectedJustifyContentOptionIndex = 0;

    /* ********************** */

    let alignItemsOptions = [
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2H15V3H11V7.5C11 7.77614 10.7761 8 10.5 8L9.5 8C9.22386 8 9 7.77614 9 7.5V3L8 3L8 11.5C8 11.7761 7.77614 12 7.5 12H6.5C6.22386 12 6 11.7761 6 11.5L6 3L2 3V2Z" fill="currentColor"></path></svg>`,
            value : "flex-start"
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 7V2.5C8 2.22386 7.77614 2 7.5 2H6.5C6.22386 2 6 2.22386 6 2.5V7L2 7V8L15 8V7H11V4.5C11 4.22386 10.7761 4 10.5 4L9.5 4C9.22386 4 9 4.22386 9 4.5V7H8Z" fill="currentColor"></path><path d="M8 9V13.5C8 13.7761 7.77614 14 7.5 14H6.5C6.22386 14 6 13.7761 6 13.5V9H8Z" fill="currentColor"></path><path d="M10.5 12C10.7761 12 11 11.7761 11 11.5V9H9V11.5C9 11.7761 9.22386 12 9.5 12H10.5Z" fill="currentColor"></path></svg>`,
            value : "center"
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 14V10H8.5C8.22386 10 8 9.77614 8 9.5V8.5C8 8.22386 8.22386 8 8.5 8H13V7H4.5C4.22386 7 4 6.77614 4 6.5V5.5C4 5.22386 4.22386 5 4.5 5H13V1H14V14H13Z" fill="currentColor"></path></svg>`,
            value : "flex-end"
        },   
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 3L2 3V2H15V3L11 3V13L15 13V14L2 14V13H6L6 3ZM8 3L9 3L9 13H8L8 3Z" fill="currentColor"></path></svg>`,
            value : "strecth"
        },     
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 7V3.5C8 3.22386 7.77614 3 7.5 3H5.5C5.22386 3 5 3.22386 5 3.5L5 7H2V8H5V13.5C5 13.7761 5.22386 14 5.5 14H7.5C7.77614 14 8 13.7761 8 13.5V8H9V10.5C9 10.7761 9.22386 11 9.5 11H11.5C11.7761 11 12 10.7761 12 10.5V8L15 8V7L12 7V3.5C12 3.22386 11.7761 3 11.5 3H9.5C9.22386 3 9 3.22386 9 3.5V7H8ZM6 4V7H7V4L6 4ZM10 7H11V4L10 4V7Z" fill="currentColor"></path></svg>`,
            value : "baseline"
        },
    ];
    let selectedAlignItemsOptionIndex = 0;

    let gapRowValue = '';
    let gapColumnValue = '';

    function updateState(breakpoint, styling) {
        const getValueWithFallback = (property) => getStyleValueFromCascade(styling, property, breakpoint) || '';

        flexState = {
            flexDirection: getValueWithFallback('flex-direction'),
            justifyContent: getValueWithFallback('justify-content'),
            alignItems: getValueWithFallback('align-items'),
            gapRow: getValueWithFallback('row-gap'),
            gapColumn: getValueWithFallback('column-gap')
        };
        
        // Update all indices based on the new state
        selectedFlexDirectionIndex = flexState.flexDirection ? flexDirectionOptions.findIndex((opt) => opt.value === flexState.flexDirection) : 0;
        selectedJustifyContentOptionIndex = flexState.justifyContent ? justifyContentOptions.findIndex((opt) => opt.value === flexState.justifyContent) : 0;
        selectedAlignItemsOptionIndex = flexState.alignItems ? alignItemsOptions.findIndex((opt) => opt.value === flexState.alignItems) : 0;

        gapRowValue = flexState.gapRow;
        gapColumnValue = flexState.gapColumn;
    }

    function handleInstanceChange() {
        selectionChangeInProgress = true;
        updateState($selectedBreakpoint, $selectedInstance.styling);
        setTimeout(() => {
            selectionChangeInProgress = false;
        }, 120);
    }

    function handleStylingChange(prop, value) {
        if (initialized && !selectionChangeInProgress) {
            alterStylingProperty(prop, value);
        }
    }

    $: $selectedInstance.instanceId, handleInstanceChange();

    $: selectedFlexDirectionIndex, handleStylingChange('flex-direction', flexDirectionOptions[selectedFlexDirectionIndex].value);
    $: selectedJustifyContentOptionIndex, handleStylingChange('justify-content', justifyContentOptions[selectedJustifyContentOptionIndex].value);
    $: selectedAlignItemsOptionIndex, handleStylingChange('align-items', alignItemsOptions[selectedAlignItemsOptionIndex].value);
</script>

<div class="options directions">
    <p>Direction</p>

    <Switch options={flexDirectionOptions} bind:selectedIndex={selectedFlexDirectionIndex} gap="0" />
</div>

<div class="options aligns">
    <p>X - Axis</p>
    <Switch options={justifyContentOptions} bind:selectedIndex={selectedJustifyContentOptionIndex} gap="0" />

    <p>Y - Axis</p> 
    <Switch options={alignItemsOptions} bind:selectedIndex={selectedAlignItemsOptionIndex} gap="0" />
</div>

<div class="options">
    <p>Gap</p>

    <div class="flex">
        <div class="input-holder">
            <input type="text" name="row-gap" bind:value={gapRowValue} on:blur={(e) => {alterStylingProperty(e.target.getAttribute('name'), e.target.value)}} />

            <!-- <Dropdown options={measurementOptions} bind:selectedStatusIndex={selectedMeasurementIndex} position="right" /> -->
        </div>        
        <input type="text" name="column-gap" bind:value={gapColumnValue} on:blur={(e) => {alterStylingProperty(e.target.getAttribute('name'), e.target.value)}} />
    </div>
</div>
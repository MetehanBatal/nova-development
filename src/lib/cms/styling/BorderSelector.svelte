<script>
    import { selectedInstance } from "../../../stores/cms/selectedInstance";
    import { selectedBreakpoint } from '../../../stores/cms/selectedBreakpoint';
    import { alterStylingProperty, getStyleValueFromCascade } from "../../../stores/cms/functions";

    import Switch from "$lib/toolkit/Switch.svelte";
    import { onMount } from "svelte";

    let dropdownExpanded = false;
    let initialized = false;
    let selectionChangeInProgress = false;

    onMount(() => {
        initialized = true;
    });

    let radiusTypeSelection = [
        {
            icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.5C2.5 3.84315 3.84315 2.5 5.5 2.5H10.5C12.1569 2.5 13.5 3.84315 13.5 5.5V10.5C13.5 12.1569 12.1569 13.5 10.5 13.5H5.5C3.84315 13.5 2.5 12.1569 2.5 10.5V5.5Z" stroke="currentColor"></path></svg>',
        },
        {
            icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 2C3.11929 2 2 3.11929 2 4.5V7H3V4.5C3 3.67157 3.67157 3 4.5 3H7V2H4.5Z" fill="currentColor"></path><path d="M9 2V3H11.5C12.3284 3 13 3.67157 13 4.5V7H14V4.5C14 3.11929 12.8807 2 11.5 2H9Z" fill="currentColor"></path><path d="M14 9H13V11.5C13 12.3284 12.3284 13 11.5 13H9V14H11.5C12.8807 14 14 12.8807 14 11.5V9Z" fill="currentColor"></path><path d="M7 14V13H4.5C3.67157 13 3 12.3284 3 11.5V9H2V11.5C2 12.8807 3.11929 14 4.5 14H7Z" fill="currentColor"></path></svg>',
        },
    ];
    let radiusTypeIndex = 0;


    let radiusPositions = [
        {
            icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.4"><path d="M14 14V9H13V13H9V14H14Z" fill="currentColor"></path><path d="M7 14V13H3V9H2V14H7Z" fill="currentColor"></path><path d="M2 7H3V6.5C3 4.567 4.567 3 6.5 3H7V2H6.5C4.01472 2 2 4.01472 2 6.5V7Z" fill="currentColor"></path><path d="M9 2V3H13V7H14V2H9Z" fill="currentColor"></path></g><path d="M2.5 7V6.5C2.5 4.29086 4.29086 2.5 6.5 2.5H7" stroke="currentColor"></path></svg>',
            value: 'border-top-left-radius',
            radiusValue: ''
        },
        {
            icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.4"><path d="M2 14V9H3V13H7V14H2Z" fill="currentColor"></path><path d="M9 14V13H13V9H14V14H9Z" fill="currentColor"></path><path d="M14 7H13V6.5C13 4.567 11.433 3 9.5 3H9V2H9.5C11.9853 2 14 4.01472 14 6.5V7Z" fill="currentColor"></path><path d="M7 2V3H3V7H2V2H7Z" fill="currentColor"></path></g><path d="M13.5 7V6.5C13.5 4.29086 11.7091 2.5 9.5 2.5H9" stroke="currentColor"></path></svg>',
            value: 'border-top-right-radius',
            radiusValue: ''
        },
        {
            icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.4"><path d="M2 2V7H3V3H7V2H2Z" fill="currentColor"></path><path d="M9 2V3H13V7H14V2H9Z" fill="currentColor"></path><path d="M14 9H13V13H9V14H14V9Z" fill="currentColor"></path><path d="M7 14V13H6.5C4.567 13 3 11.433 3 9.5V9H2V9.5C2 11.9853 4.01472 14 6.5 14H7Z" fill="currentColor"></path></g><path d="M2.5 9V9.5C2.5 11.7091 4.29086 13.5 6.5 13.5H7" stroke="currentColor"></path></svg>',
            value: 'border-bottom-left-radius',
            radiusValue: ''
        },
        {
            icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.4"><path d="M2 2V7H3V3H7V2H2Z" fill="currentColor"></path><path d="M9 2V3H13V7H14V2H9Z" fill="currentColor"></path><path d="M14 9H13V11.5C13 12.3284 12.3284 13 11.5 13H9V14H11.5C12.8807 14 14 12.8807 14 11.5V9Z" fill="currentColor"></path><path d="M7 14V13H3V9H2V14H7Z" fill="currentColor"></path></g><path d="M13.5 9V9.5C13.5 11.7091 11.7091 13.5 9.5 13.5H9" stroke="currentColor"></path></svg>',
            value: 'border-bottom-right-radius',
            radiusValue: ''
        },
    ];
    let radiusPositionIndex = 0;


    let borderPositions = [
        {
            icon : `<svg data-wf-icon="BorderTopIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M2 13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V5H13V13H3V5H2V13Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M2 3H14V2H2V3Z" fill="currentColor"></path></svg>`,
            id : 'top',
            widthValue: '',
            colorValue: ''
        },
        {
            icon : `<svg data-wf-icon="BorderLeftIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M13 2C13.5523 2 14 2.44772 14 3L14 13C14 13.5523 13.5523 14 13 14L5 14L5 13L13 13L13 3L5 3L5 2L13 2Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M3 2L3 14L2 14L2 2L3 2Z" fill="currentColor"></path></svg>`,
            id : 'left',
            widthValue: '',
            colorValue: ''
        },
        {
            icon : `<svg data-wf-icon="BorderAllIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V3ZM13 3L3 3V13H13V3Z" fill="currentColor"></path></svg>`,
            id : "border",
            widthValue: '',
            colorValue: ''
        },
        {
            icon : `<svg data-wf-icon="BorderRightIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M3 2C2.44772 2 2 2.44772 2 3L2 13C2 13.5523 2.44772 14 3 14L11 14L11 13L3 13L3 3L11 3L11 2L3 2Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M13 2L13 14L14 14L14 2L13 2Z" fill="currentColor"></path></svg>`,
            id : 'right',
            widthValue: '',
            colorValue: ''
        },
        {
            icon : `<svg data-wf-icon="BorderBottomIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M2 3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3V11H13V3H3V11H2V3Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M2 13H14V14H2V13Z" fill="currentColor"></path></svg>`,
            id : 'bottom',
            widthValue: '',
            colorValue: ''
        },
    ];
    let borderPositionIndex = 2;

    let borderStyleOptions = [
        {
            icon : `<svg data-wf-icon="CloseDefaultIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.70714 8.00004L12.3536 4.35359L11.6465 3.64648L8.00004 7.29293L4.35359 3.64648L3.64648 4.35359L7.29293 8.00004L3.64648 11.6465L4.35359 12.3536L8.00004 8.70714L11.6465 12.3536L12.3536 11.6465L8.70714 8.00004Z" fill="currentColor"></path></svg>`,
            value : 'none'
        },
        {
            icon : `<svg data-wf-icon="BorderStyleSolidIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 7.5H14" stroke="currentColor"></path></svg>`,
            value : 'solid'
        },
        {
            icon : `<svg data-wf-icon="BorderStyleDashedIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 7H2V8H5V7ZM11 8H12H14V7H12H11V8ZM9.5 7H6.5V8H9.5V7Z" fill="currentColor"></path></svg>`,
            value : 'dashed'
        },
        {
            icon : `<svg data-wf-icon="BorderStyleDottedIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 7H3V8H4V7ZM6 7H5V8H6V7ZM7 7H8V8H7V7ZM10 7H9V8H10V7ZM11 7H12V8H11V7ZM14 7H13V8H14V7Z" fill="currentColor"></path></svg>`,
            value : 'dotted'
        },
    ];
    let borderStyleIndex = 0;

    let radiusValue = '';

    // State object for border styling
    let borderState = {
        borderRadius: '',
        borderTopLeftRadius: '',
        borderTopRightRadius: '',
        borderBottomLeftRadius: '',
        borderBottomRightRadius: '',
        borderWidth: '',
        borderTopWidth: '',
        borderRightWidth: '',
        borderBottomWidth: '',
        borderLeftWidth: '',
        borderColor: '',
        borderTopColor: '',
        borderRightColor: '',
        borderBottomColor: '',
        borderLeftColor: '',
        borderStyle: '',
        borderTopStyle: '',
        borderRightStyle: '',
        borderBottomStyle: '',
        borderLeftStyle: ''
    };

    function updateState(breakpoint, styling) {
        const getValueWithFallback = (property) => getStyleValueFromCascade(styling, property, breakpoint) || '';

        borderState = {
            borderRadius: getValueWithFallback('border-radius'),
            borderTopLeftRadius: getValueWithFallback('border-top-left-radius'),
            borderTopRightRadius: getValueWithFallback('border-top-right-radius'),
            borderBottomLeftRadius: getValueWithFallback('border-bottom-left-radius'),
            borderBottomRightRadius: getValueWithFallback('border-bottom-right-radius'),
            borderWidth: getValueWithFallback('border-width'),
            borderTopWidth: getValueWithFallback('border-top-width'),
            borderRightWidth: getValueWithFallback('border-right-width'),
            borderBottomWidth: getValueWithFallback('border-bottom-width'),
            borderLeftWidth: getValueWithFallback('border-left-width'),
            borderColor: getValueWithFallback('border-color'),
            borderTopColor: getValueWithFallback('border-top-color'),
            borderRightColor: getValueWithFallback('border-right-color'),
            borderBottomColor: getValueWithFallback('border-bottom-color'),
            borderLeftColor: getValueWithFallback('border-left-color'),
            borderStyle: getValueWithFallback('border-style'),
            borderTopStyle: getValueWithFallback('border-top-style'),
            borderRightStyle: getValueWithFallback('border-right-style'),
            borderBottomStyle: getValueWithFallback('border-bottom-style'),
            borderLeftStyle: getValueWithFallback('border-left-style')
        };

        // Update radius values
        radiusValue = borderState.borderRadius;
        radiusPositions.forEach(pos => {
            pos.radiusValue = getValueWithFallback(pos.value);
        });

        // Update border values
        borderPositions.forEach(pos => {
            if (pos.id === 'border') {
                pos.widthValue = borderState.borderWidth;
                pos.colorValue = borderState.borderColor;
            } else {
                pos.widthValue = borderState[`border${pos.id.charAt(0).toUpperCase() + pos.id.slice(1)}Width`];
                pos.colorValue = borderState[`border${pos.id.charAt(0).toUpperCase() + pos.id.slice(1)}Color`];
            }
        });

        // Set border style index
        const currentStyle = borderState.borderStyle || 'none';
        borderStyleIndex = borderStyleOptions.findIndex(opt => opt.value === currentStyle);
        if (borderStyleIndex === -1) borderStyleIndex = 0;
    }

    function handleInstanceChange() {
        selectionChangeInProgress = true;
        updateState($selectedBreakpoint, $selectedInstance.styling);
        setTimeout(() => {
            selectionChangeInProgress = false;
        }, 120);
    }

    function handleBorderChange(prop, value) {
        if (initialized && !selectionChangeInProgress) {
            alterStylingProperty(prop, value);
        }
    }

    $: $selectedInstance.instanceId, handleInstanceChange();

    $: borderStyleIndex, handleBorderChange(
        borderPositionIndex !== 2 ? 
            `border-${borderPositions[borderPositionIndex].id}-style` : 
            'border-style',
        borderStyleOptions[borderStyleIndex]?.value
    );
</script>

<div class="styling-group border">
    <div class="header" on:click={() => { dropdownExpanded = !dropdownExpanded }}>
        <h4>Borders</h4>
        
        <svg style={`transform: rotate(${dropdownExpanded ? '90deg' : '0deg'});`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.29287 8.00004L6.64642 5.35359L7.35353 4.64648L10.7071 8.00004L7.35353 11.3536L6.64642 10.6465L9.29287 8.00004Z" fill="currentColor"></path>
        </svg>
    </div>

    {#if dropdownExpanded}
        <div class="options">
            <p>Radius</p>
            
            <div class="flex">
                {#if radiusTypeIndex === 0}
                    <input 
                        type="text" 
                        name="border-radius" 
                        bind:value={radiusValue}
                        on:blur={(e) => handleBorderChange(e.target.name, e.target.value)}
                    />
                {:else}
                    <div class="radius-selection-options">
                        {#each radiusPositions as selectOption}
                            <div class="radius-selection-option">
                                {@html selectOption.icon}
                                
                                <input 
                                    type="text" 
                                    name={selectOption.value} 
                                    bind:value={selectOption.radiusValue}
                                    on:blur={(e) => handleBorderChange(e.target.name, e.target.value)}
                                />
                            </div>
                        {/each}
                    </div>        
                {/if}

                <Switch 
                    options={radiusTypeSelection} 
                    bind:selectedIndex={radiusTypeIndex} 
                    gap="0" 
                />
            </div>
        </div>
        

        <div class="border-options-wrapper">
            <div class="border-options">                       
                <Switch options={borderPositions} bind:selectedIndex={borderPositionIndex} gap="0" />                               
            </div>
    
            <div class="border-style-options-wrapper">
                <div class="border-style-option">
                    <p>Style</p>

                    <Switch options={borderStyleOptions} bind:selectedIndex={borderStyleIndex} gap="0" />
                </div>

                <div class="border-width-option">
                    <p>Width</p>

                    <input
                        type="text"
                        name={borderPositionIndex !== 2 ? `border-${borderPositions[borderPositionIndex].id}-width` : 'border-width'}
                        bind:value={borderPositions[borderPositionIndex].widthValue}
                        on:blur={(e) => { alterStylingProperty(e.target.getAttribute('name'), e.target.value) }}
                    />  
                </div>
                <div class="border-style-option border-color-selection">
                    <p>Color</p>

                    <div class="color-selection">
                        <input
                            type="color"
                            name={borderPositionIndex !== 2 ? `border-${borderPositions[borderPositionIndex].id}-color` : 'border-color'}
                            bind:value={borderPositions[borderPositionIndex].colorValue}
                            on:blur={(e) => { alterStylingProperty(e.target.getAttribute('name'), e.target.value) }}
                        />

                        <input
                            type="text"
                            name={borderPositionIndex !== 2 ? `border-${borderPositions[borderPositionIndex].id}-color` : 'border-color'}
                            bind:value={borderPositions[borderPositionIndex].colorValue}
                            on:blur={(e) => { alterStylingProperty(e.target.getAttribute('name'), e.target.value) }}
                        />
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        font-size: 1.4rem;        
    }

    .options p, .border-options-wrapper p {
        font-size: 1.2rem;
        color: rgba(255, 255, 255, .66);
        min-width: 4rem;
    }

    .border-options-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .border-style-options-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    .border-style-option {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    :global(.flex .switch-box) {
        align-self: flex-start
    }

    .border-width-option {
        width: 100%;
        display: flex;
        align-items: center;
    }
    .border-width-option input {
        width: 100%;

        background-color: transparent;
        border-radius: .4rem;
        color: #FFFFFF;
        

        border: .1rem solid #383C42 !important;
    }

    .radius-selection-options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: .5rem;
        justify-items: flex-end;
    }

    .radius-selection-option {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    :global(.radius-selection-option:nth-child(3) svg),
    :global(.radius-selection-option:nth-child(4) svg) {
        order: 1
    }

    .border-options {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .border-color-selection {
        width: 100%;
    }

    .border-color-selection > div input:first-child {
        width: 2.4rem;
        height: 2.4rem;
        background-color: transparent;
        padding: 0;
        border-radius: .4rem;
    }

    .border-color-selection > div input:last-child {
        width: 100%;
        background-color: transparent;
        padding: 0 0 0 .6rem;
        border: 0;
        color: #FFFFFF;        
    }
    .border-color-selection > div {
        width: 100%;
        display: flex;
        align-items: center;
        border: .1rem solid #383C42;
        border-radius: .4rem;
        overflow: hidden;
    }

    :global(.border-options .switch-box) {
        display: grid !important;
        width: 100%;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        padding: .2rem !important;
    }

    :global(.border-options .switch-box .switch-option:first-child) {
        grid-column: 2/3;
        grid-row-start: 1;
    }
    :global(.border-options .switch-box .switch-option:nth-child(2)) {
        grid-column: 1/2;
        grid-row-start: 2;
    }
    :global(.border-options .switch-box .switch-option:nth-child(3)) {
        grid-column: 2/3;
        grid-row-start: 2;
    }
    :global(.border-options .switch-box .switch-option:nth-child(4)) {
        grid-column: 3/4;
        grid-row-start: 2;
    }
    :global(.border-options .switch-box .switch-option:nth-child(5)) {
        grid-column: 2/3;
        grid-row-start: 3;
    }

    :global(.options .switch-option),
    :global(.border-options .switch-option)  {
        height: 2.2rem !important;
    }

    :global(.border .options .switch-option),
    :global(.border .border-options .switch-option) {
        width: 2.6rem!important;
    }

    :global(.border-style-option .switch-option) {
        width: 2rem !important; 
        height: 2rem !important; 
    }
</style>
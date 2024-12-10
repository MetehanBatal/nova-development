<script>
    import { selectedInstance } from "$stores/cms/selectedInstance";
    import { alterStylingProperty } from "$stores/cms/functions";
    import Dropdown from "$lib/toolkit/Dropdown.svelte";
    import Switch from "$lib/toolkit/Switch.svelte";
    import { onMount } from "svelte";

    let dropdownExpanded = false;
    let initialized = false;
    let selectionChangeInProgress = false;

    onMount(() => {
        initialized = true;
    });

    let fontOptions = [
        {
            name: 'Brandon',
            value: 'Brandon',
            index: 0
        },
        {
            name: 'PT Sans',
            value: 'PT Sans',
            index: 1
        }
    ];
    let fontIndex = 0;

    let weightOptions = [
        {
            name: '300',
            value: 300,
            index: 0
        },
        {
            name: '400',
            value: 400,
            index: 1
        },
        {
            name: '500',
            value: 500,
            index: 2
        },
        {
            name: '600',
            value: 600,
            index: 3
        },
        {
            name: '700',
            value: 700,
            index: 4
        },
        {
            name: '800',
            value: 800,
            index: 5
        },
        {
            name: '900',
            value: 900,
            index: 6
        }
    ];
    let weightIndex = 0;

    let textAlignOptions = [
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 3H15V4H1V3ZM1 7H9V8H1V7ZM11 11H1V12H11V11Z" fill="currentColor"></path></svg>`,
            value: 'left'
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 3H15V4H1V3Z" fill="currentColor"></path><path d="M4 7H12V8H4V7Z" fill="currentColor"></path><path d="M13 11H3V12H13V11Z" fill="currentColor"></path></svg>`,
            value: 'center'
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 3H15V4H1V3Z" fill="currentColor"></path><path d="M7 7H15V8H7V7Z" fill="currentColor"></path><path d="M15 11H5V12H15V11Z" fill="currentColor"></path></svg>`,
            value: 'right'
        },
        {
            icon: `<svg data-wf-icon="TextAlignJustifyIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 3H15V4H1V3Z" fill="currentColor"></path><path d="M1 7H15V8H1V7Z" fill="currentColor"></path><path d="M15 11H1V12H15V11Z" fill="currentColor"></path></svg>`,
            value: 'justify'
        }
    ];
    let textAlignIndex = 0;

    let fontStyleOptions = [
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 4H6.5V3H8.5H10.5V4H9V12H10.5V13H8.5H6.5V12H8V4Z" fill="currentColor"></path></svg>`,
            value: 'none'
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.80629 4H7V3H9.5H12V4H9.86038L7.19371 12H9V13H6.5H4V12H6.13962L8.80629 4Z" fill="currentColor"></path></svg>`,
            value: 'italic'
        },
    ];
    let fontStyleIndex = 0;

    let fontDecorationOptions = [
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.70714 8.00004L12.3536 4.35359L11.6465 3.64648L8.00004 7.29293L4.35359 3.64648L3.64648 4.35359L7.29293 8.00004L3.64648 11.6465L4.35359 12.3536L8.00004 8.70714L11.6465 12.3536L12.3536 11.6465L8.70714 8.00004Z" fill="currentColor"></path></svg>`,
            value: 'none'
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 5H5V4H8.5H12V5H9V7H14V8H9H8H3V7H8V5ZM8 12V9H9V12H8Z" fill="currentColor"></path></svg>`,
            value: 'line-through'
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 4.5H8.5M12 4.5H8.5M8.5 4.5V12" stroke="currentColor"></path><path d="M3 14.5H14" stroke="currentColor"></path></svg>`,
            value: 'underline'
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 1V2H14V1H3ZM5 5H8V12H9V5H12V4H8.5H5V5Z" fill="currentColor"></path></svg>`,
            value: 'overline'
        },
    ];
    let fontDecorationIndex = 0;

    let fontSize = '';
    let lineHeight = '';
    let textColorValue = '';

    function getProperties() {
        selectionChangeInProgress = true;
        fontIndex = $selectedInstance.styling?.['font-family'] ? fontOptions.findIndex((opt) => opt.value === $selectedInstance.styling['font-family']) : 0;
        weightIndex = $selectedInstance.styling?.['font-weight'] ? weightOptions.findIndex((opt) => opt.value === $selectedInstance.styling['font-weight']) : 0;
        textAlignIndex = $selectedInstance.styling?.['text-align'] ? textAlignOptions.findIndex((opt) => opt.value === $selectedInstance.styling['text-align']) : 0;
        fontStyleIndex = $selectedInstance.styling?.['font-style'] ? fontStyleOptions.findIndex((opt) => opt.value === $selectedInstance.styling['font-style']) : 0;
        fontDecorationIndex = $selectedInstance.styling?.['text-decoration'] ? fontDecorationOptions.findIndex((opt) => opt.value === $selectedInstance.styling['text-decoration']) : 0;
        fontSize = $selectedInstance.styling?.['font-size'] ? $selectedInstance.styling['font-size'] : '';
        lineHeight = $selectedInstance.styling?.['line-height'] ? $selectedInstance.styling['line-height'] : '';
        textColorValue = $selectedInstance.styling?.['color'] ? $selectedInstance.styling['color'] : '';
        
        setTimeout(() =>{
            selectionChangeInProgress = false;
        }, 120);
    }

    function handleStylingChange(prop, value) {
        if (initialized && !selectionChangeInProgress) {
            alterStylingProperty(prop, value);
        }
    }

    $: $selectedInstance.instanceId, getProperties();
    $: fontIndex, handleStylingChange('font-family', fontOptions[fontIndex].value);
    $: weightIndex, handleStylingChange('font-weight', weightOptions[weightIndex].value);
    $: textAlignIndex, handleStylingChange('text-align', textAlignOptions[textAlignIndex].value);
    $: fontStyleIndex, handleStylingChange('font-style', fontStyleOptions[fontStyleIndex].value);
    $: fontDecorationIndex, handleStylingChange('text-decoration', fontDecorationOptions[fontDecorationIndex].value);
</script>

<div class="styling-group">
    <div class="header" on:click={() => { dropdownExpanded = !dropdownExpanded }}>
        <h4>Typography</h4>
        
        <svg style={`transform: rotate(${dropdownExpanded ? '90deg' : '0deg'});`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.29287 8.00004L6.64642 5.35359L7.35353 4.64648L10.7071 8.00004L7.35353 11.3536L6.64642 10.6465L9.29287 8.00004Z" fill="currentColor"></path>
        </svg>
    </div>

    {#if dropdownExpanded}
    <div class="options"> 
        <p>Font</p>

        <Dropdown options={fontOptions} bind:selectedStatusIndex={fontIndex} />
    </div>

    <div class="options"> 
        <p>Weight</p>

        <Dropdown options={weightOptions} bind:selectedStatusIndex={weightIndex} />
    </div>

    <div class="options"> 
        <p>Size</p>
        
        <div class="flex">
            <input type="text" name="font-size" bind:value={fontSize} on:blur={(e) => alterStylingProperty(e.target.getAttribute('name'), e.target.value)}/>
            <input type="text" name="line-height" bind:value={lineHeight} on:blur={(e) => alterStylingProperty(e.target.getAttribute('name'), e.target.value)}/>
        </div>
    </div>

    <div class="options">
        <p>Color</p>

        <div class="color-selection">
            <input type="color" name="color" bind:value={textColorValue} on:blur={(e) => { alterStylingProperty('color', e.target.value)}} />
            <input type="text" bind:value={textColorValue} on:blur={(e) => { alterStylingProperty('color', e.target.value)}} />
        </div>
    </div>

    <div class="options"> 
        <p>Align</p>

        <Switch options={textAlignOptions} bind:selectedIndex={textAlignIndex} gap="0" />
    </div>

    <div class="options"> 
        <p>Style</p>
        
        <div class="flex">
            <Switch options={fontStyleOptions} bind:selectedIndex={fontStyleIndex} gap="0" />
            <Switch options={fontDecorationOptions} bind:selectedIndex={fontDecorationIndex} gap="0" />
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

    :global(.options-holder .switch-option) {
        width: 2.6rem !important;
        height: 2.2rem !important;
    }

    :global(.options-holder .switch-box) {
        width: 100%;
        justify-content: space-between;
    }

    :global(input[type="color" i]::-webkit-color-swatch) {
        border: 0;
    }

    :global(input[type="color" i]::-webkit-color-swatch-wrapper) {
        padding: 0;
    }
</style>
<script>
    import { selectedInstance } from "../../../stores/cms/selectedInstance";
    import { alterStylingProperty } from "../../../stores/cms/functions";
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

    let fontDirectionOptions = [
        {
            icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 12L12.3111 12L10.6484 10.3555L11.3516 9.64453L13.8516 12.1172L14.2071 12.4688L13.8555 12.8243L11.3555 15.3516L10.6445 14.6484L12.2751 13L5 13L5 12Z" fill="currentColor"></path><path opacity="0.6" fill-rule="evenodd" clip-rule="evenodd" d="M4.23463 2.15224C4.47728 2.05173 4.73736 2 5 2L5 4L5 6C4.73736 6 4.47728 5.94827 4.23463 5.84776C3.99198 5.74725 3.7715 5.59993 3.58579 5.41421C3.40007 5.2285 3.25275 5.00802 3.15224 4.76537C3.05173 4.52272 3 4.26264 3 4C3 3.73736 3.05173 3.47728 3.15224 3.23463C3.25275 2.99198 3.40007 2.7715 3.58579 2.58579C3.7715 2.40007 3.99198 2.25275 4.23463 2.15224ZM5 6L5 2.5V2H5.5H8.5H11V3H9V10H8V3H6V10H5L5 6Z" fill="currentColor"></path></svg>`,
            value: 'ltr'
        },
        {
            icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.0001 12L3.689 12L5.35169 10.3555L4.64848 9.64453L2.14848 12.1172L1.79297 12.4688L2.14461 12.8243L4.64462 15.3516L5.35556 14.6484L3.72502 13L11.0001 13V12Z" fill="currentColor"></path><path opacity="0.6" fill-rule="evenodd" clip-rule="evenodd" d="M6.23463 2.15224C6.47728 2.05173 6.73736 2 7 2L7 4L7 6C6.73736 6 6.47728 5.94827 6.23463 5.84776C5.99198 5.74725 5.7715 5.59993 5.58579 5.41421C5.40007 5.2285 5.25275 5.00802 5.15224 4.76537C5.05173 4.52272 5 4.26264 5 4C5 3.73736 5.05173 3.47728 5.15224 3.23463C5.25275 2.99198 5.40007 2.7715 5.58579 2.58579C5.7715 2.40007 5.99198 2.25275 6.23463 2.15224ZM7 6L7 2.5V2H7.5H10.5H13V3H11V10H10V3H8V10H7L7 6Z" fill="currentColor"></path></svg>`,
            value: 'rtl'
        }
    ];
    let fontDirectionIndex = 0;

    let fontTransformOptions = [
        {
            icon : `<svg data-wf-icon="CloseDefaultIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.70714 8.00004L12.3536 4.35359L11.6465 3.64648L8.00004 7.29293L4.35359 3.64648L3.64648 4.35359L7.29293 8.00004L3.64648 11.6465L4.35359 12.3536L8.00004 8.70714L11.6465 12.3536L12.3536 11.6465L8.70714 8.00004Z" fill="currentColor"></path></svg>`,
            value: 'none'
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.12583 4H5.87413L8.00003 11.2279L10.1258 4H11.8741L14.2271 12H13.1848L12.5965 9.99994H9.40354L8.8153 12H7.18477L6.5965 9.99994H3.40354L2.8153 12H1.77295L4.12583 4ZM6.30238 8.99994L5.12587 4.9999H4.8741L3.69765 8.99994H6.30238ZM12.3024 8.99994L11.1259 4.9999H10.8741L9.69765 8.99994H12.3024Z" fill="currentColor"></path></svg>`,
            value: 'uppercase'
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.12583 4H5.87413L8.22713 12H7.18477L6.5965 9.99994H3.40354L2.8153 12H1.77295L4.12583 4ZM6.30238 8.99994L5.12587 4.9999H4.8741L3.69765 8.99994H6.30238Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 7H10V6H12.5C13.3284 6 14 6.67157 14 7.5V12H13V11.2909C12.4911 11.7327 11.8268 12 11.1 12H11C9.89543 12 9 11.1046 9 10C9 8.89543 9.89543 8 11 8H13V7.5C13 7.22386 12.7761 7 12.5 7ZM13 9V9.1C13 10.1493 12.1493 11 11.1 11H11C10.4477 11 10 10.5523 10 10C10 9.44772 10.4477 9 11 9H13Z" fill="currentColor"></path></svg>`,
            value: 'capitalize'
        },
        {
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 7H6.5C6.77614 7 7 7.22386 7 7.5V8H5C3.89543 8 3 8.89543 3 10C3 11.1046 3.89543 12 5 12H5.1C5.82677 12 6.49109 11.7327 7 11.2909V12H8V7.5C8 6.67157 7.32843 6 6.5 6H4V7ZM5 9H7V9.1C7 10.1493 6.14934 11 5.1 11H5C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10 7H12.5C12.7761 7 13 7.22386 13 7.5V8H11C9.89543 8 9 8.89543 9 10C9 11.1046 9.89543 12 11 12H11.1C11.8268 12 12.4911 11.7327 13 11.2909V12H14V7.5C14 6.67157 13.3284 6 12.5 6H10V7ZM11 9H13V9.1C13 10.1493 12.1493 11 11.1 11H11C10.4477 11 10 10.5523 10 10C10 9.44772 10.4477 9 11 9Z" fill="currentColor"></path></svg>`,
            value: 'lowercase'
        },
    ];
    let fontTransformIndex = 0;

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
        fontDirectionIndex = $selectedInstance.styling?.['direction'] ? fontDirectionOptions.findIndex((opt) => opt.value === $selectedInstance.styling['direction']) : 0;
        fontTransformIndex = $selectedInstance.styling?.['text-transform'] ? fontTransformOptions.findIndex((opt) => opt.value === $selectedInstance.styling['text-transform']) : 0;
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
    $: fontDirectionIndex, handleStylingChange('direction', fontDirectionOptions[fontDirectionIndex].value);
    $: fontTransformIndex, handleStylingChange('text-transform', fontTransformOptions[fontTransformIndex].value);
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
        
        <div class="flex two-rows">
            <Switch options={fontStyleOptions} bind:selectedIndex={fontStyleIndex} gap="0" />
            <Switch options={fontDirectionOptions} bind:selectedIndex={fontDirectionIndex} gap="0" />
            <Switch options={fontDecorationOptions} bind:selectedIndex={fontDecorationIndex} gap="0" />
            <Switch options={fontTransformOptions} bind:selectedIndex={fontTransformIndex} gap="0" />
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

    .flex.two-rows {
        grid-template-rows: 1fr 1fr;
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
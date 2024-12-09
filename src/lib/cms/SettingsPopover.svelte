<script>
    import { selectedInstance } from "../../stores/cms/selectedInstance";

    import HeadingOptions from '$lib/cms/options/HeadingOptions.svelte';
    import ImageOptions from '$lib/cms/options/ImageOptions.svelte';
    import VideoOptions from '$lib/cms/options/VideoOptions.svelte';
    import LinkOptions from '$lib/cms/options/LinkOptions.svelte';
    import ParagraphOptions from '$lib/cms/options/ParagraphOptions.svelte';

    export let settingsRevealed;
    export let x;
    export let y;
    export let canvasX;

    let dragOffset = { x: 0, y: 0 };
    let settingsPos = {
        left: x + canvasX,
        top: y
    };

    const settingsOptions = [
        {
            tags: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
            component: HeadingOptions
        },
        {
            tags: ['P'],
            component: ParagraphOptions
        },
        {
            tags: ['A'],
            component: LinkOptions
        },
        {
            tags: ['IMG'],
            component: ImageOptions
        },
        {
            tags: ['VIDEO'],
            component: VideoOptions
        }
    ];

    function onDragStart(event) {
        dragOffset.x = event.clientX - settingsPos.left;
        dragOffset.y = event.clientY - settingsPos.top;
        
        event.dataTransfer.setData('text/plain', JSON.stringify(dragOffset));
        event.stopPropagation(); // Prevent iframe from intercepting
    }

    function onDragOver(event) {
        event.preventDefault();
        event.stopPropagation(); // Prevent iframe from intercepting
        return false;
    }

    function onDrop(event) {
        event.preventDefault();
        event.stopPropagation(); // Prevent iframe from intercepting
        
        settingsPos.left = event.clientX - dragOffset.x;
        settingsPos.top = event.clientY - dragOffset.y;

        return false;
    }
</script>

<svelte:document on:dragover={onDragOver} on:drop={(e) => {onDrop(e)}}></svelte:document>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if $selectedInstance.instanceId.length > 0 && settingsOptions.some((o) => o.tags.includes($selectedInstance.nodeName))}
    <div 
        class="settings-block" 
        style={`transform: translate3d(${settingsPos.left}px, ${settingsPos.top}px, 0)`} 
        on:dragstart={onDragStart} 
        draggable="true"
    >
        <div class="block-header">
            <p>{$selectedInstance.nodeName} Settings</p>

            <div on:click={() => settingsRevealed = false}>
                <img width="15px" height="15px" src="/assets/icons/close-icon.svg" alt="close-icon">
            </div>
        </div>

        <div class="settings-block-settings">
            <svelte:component this={settingsOptions.find((o) => o.tags.includes($selectedInstance.nodeName)).component} />
        </div>
    </div> 
{/if}


<style>
    .settings-block {
        position: absolute;
        top: 0;
        left: 0;

        max-width: 25rem;
            width: 100%;

        background-color: #060B13;
        border: .1rem solid #383C42;

        border-radius: .8rem;

        transform: translate3d(0, 0, 0);
        
        will-change: transform;

        z-index: 10000;
    }

    .block-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: .6rem;
        border-bottom:.1rem solid #383C42 ;
    }

    .block-header div {
        cursor: pointer;
    }

    .settings-block-settings {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        padding-block: .6rem;
    }

    :global(.settings-block-settings > div) {
        display: grid;
        grid-template-columns: 6rem 1fr;
        align-items: center;
        justify-content: space-between;
        padding: 0 .6rem;
    }

    :global(.settings-block-settings p) {
        font-size: 1.2rem;
        
        color: rgba(255, 255, 255, .66);
    }

    :global(.settings-block-settings .switch-option.active) {
        background-color: var(--color-dark);
    }

    :global(.settings-block-settings .switch-box) {
        width: 100%;
    
        justify-content: space-between;
    }

    :global(.settings-block-settings .switch-option) {
        width: auto;
        height: auto;

        padding: .2rem;
    }

    :global(.switch-box-link .switch-option path) {
        fill: var(--fontColor-secondary) !important;
        stroke: none !important;
    }

    :global(.switch-box-link .switch-option.active path) {
        fill: var(--fontColor-primary) !important;
        stroke: none !important;
    }
</style>
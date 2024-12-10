<script>
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';

    import { selectedInstance } from '$stores/cms/selectedInstance';
    import { pages } from '$stores/cms/pages';
    import { instances } from '$stores/cms/instances';
    import { styleSheet } from '$stores/cms/styleSheet';
    import { selectedBreakpoint } from '$stores/cms/selectedBreakpoint';
    import { cmsMode } from '$stores/cms/cmsMode';

    import { nodeTags } from '$stores/cms/nodeTags';
    import { handleElementAppend, handleKeyDown, postMessage, dbActions } from '$stores/cms/functions';

    import NavbarModule from '$lib/cms/Navbar.svelte';
    import Navigator from '$lib/cms/Navigator.svelte';
    import ElementsManager from '$lib/cms/ElementsManager.svelte';
    import StylingManager from '$lib/cms/StylingManager.svelte';
    import SettingsPopover from '$lib/cms/SettingsPopover.svelte';

    export let data;
    
    let initialized = false;
    let elementsTabRevealed = false;
    let settingsRevealed = false;
    const settingsAvailableTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'A', 'BUTTON', 'FORM', 'IMG', 'VIDEO']

    $pages.pages = data.pagesRes.data.docs || [];
    let components = data.componentsRes.data.docs || [];
    $styleSheet = data.stylesRes.data.docs || [];

    let innerWidth;
    let innerHeight;
    let navigatorFixed;
    let canvas;
    let canvasWidth;
    let canvasHeight = null;

    console.log('STYLESHEET: ', $styleSheet);

    let baseFrameURL = dev ? 'http://localhost:5174' : 'https://preview-preconvert.vercel.app';

    $pages.selectedPageIndex = 0;

    let selectedElementDetails = {};
    let hoveredElementDetails = {};

    onMount(async() => {
        // let pInstances = fetchInstances();

        // Create a ResizeObserver to watch the canvas size
        //
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                canvasWidth = entry.contentRect.width; // Update the width
            }
        });

        if (canvas) {
            resizeObserver.observe(canvas);
        }

        window.addEventListener('message', async (message) => {
            if (message.origin !== 'https://preconvert.vercel.app' && message.origin !== 'http://localhost:5174') {
                return; }

            if (!message.data) {
                return; }

            if (message.data.action === 'elementHovered') {
                hoveredElementDetails.id = message.data.data.target;
                hoveredElementDetails.width = message.data.data.width;
                hoveredElementDetails.height = message.data.data.height;
                hoveredElementDetails.offsetTop = message.data.data.offsetTop;
                hoveredElementDetails.offsetLeft = message.data.data.offsetLeft;
            }

            if (message.data.action === 'elementHoverOut') {
                hoveredElementDetails = {};
            }

            if (message.data.action === 'elementClicked') {
                selectedElementDetails.id = message.data.data.target;
                selectedElementDetails.width = message.data.data.width;
                selectedElementDetails.height = message.data.data.height;
                selectedElementDetails.offsetTop = message.data.data.offsetTop;
                selectedElementDetails.offsetLeft = message.data.data.offsetLeft;

                hoveredElementDetails = {};

                if (!message.data.data.mirroring) {
                    let instance = $instances.find((i) => i.instanceId === message.data.data.target);
                    $selectedInstance.instanceId = instance.instanceId;
                    $selectedInstance.nodeName = instance.nodeName;
                    $selectedInstance.attributes = instance.attributes;
                    $selectedInstance.componentId = instance.componentId;
                    $selectedInstance.pageId = instance.pageId;
                    $selectedInstance.class = instance.attributes.find((attr) => attr.name === 'class')?.value || '';
                    $selectedInstance.styling = $styleSheet.find((attr) => attr.name === $selectedInstance.class && attr.breakpoint === $selectedBreakpoint)?.attributes || {};
                    $selectedInstance.content = instance.content;
                }
            }

            if (message.data.action === 'contentChanged') {
                let currentInstance = $instances.find((i) => i.instanceId === message.data.data.target);
                currentInstance.content = message.data.data.content;

                await dbActions(currentInstance, 'instances', 'upsert');
            }

            if (message.data.action === 'heightChanged') {
                canvasHeight = message.data.data.height;
            }
        });

        window.addEventListener('keydown', handleKeyDown);

        // until finding a 
        // **working** way of listening iframe load
        // setTimeout(() => {
        //     iframeLoaded();
        // }, 1800);

        // Cleanup observer on component unmount
        return () => {
            if (canvas) {
                resizeObserver.unobserve(canvas);
            }

            window.removeEventListener('keydown', handleKeyDown);
        };
    })

    function iframeLoaded() {
        initialized = true;

        postMessage('initialization', {page: $pages.pages[$pages.selectedPageIndex], components, instances: $instances, styleSheet: $styleSheet});
    }

    function checkInstanceDetails() {
        if (initialized && $selectedInstance.instanceId.length < 1) {
            selectedElementDetails = {};
        }
    }

    $: $selectedInstance, checkInstanceDetails();
    $: $cmsMode, console.log('CMS M: ', $cmsMode);
</script>

<svelte:window bind:innerWidth={innerWidth} bind:innerHeight={innerHeight}></svelte:window>

<NavbarModule />

<div class="content-modeling-outer-box">
    {#if elementsTabRevealed}
    <ElementsManager on:elementAppended={handleElementAppend} bind:elementsTabRevealed={elementsTabRevealed} />
    {/if}

    <!-- {#if $instances.length > 0} -->
    <Navigator bind:elementsTabRevealed={elementsTabRevealed} bind:navigatorFixed={navigatorFixed} on:selectionChanged={postMessage('selectionChanged', $selectedInstance.instanceId)} />
    <!-- {/if} -->

    <div class="iframe-holder" style={`height: ${$cmsMode === 'component' ? `${innerHeight - 64}px` : ''};`}>
        <iframe
            bind:this={canvas}
            style={`height: ${$cmsMode === 'component' ? canvasHeight ? `${canvasHeight}px` : 'auto' : `${innerHeight - 64}px`}; width: ${$selectedBreakpoint === 'tablet' ? '768px' : $selectedBreakpoint === 'mobile' ? '468px' : '100%'}`}
            src={`${baseFrameURL}/preview?editMode=true`}
            frameborder="0"
            title="Main frame"
        ></iframe>
    </div>

    <div class="iframe-controller" style={`height: ${$cmsMode === 'component' ? 'auto' : `${innerHeight - 64}px`}; left: ${canvas?.offsetLeft}px; width: ${canvasWidth}px; top: ${canvas?.offsetTop}px;`}>
        {#if selectedElementDetails.id}
        <div class="element-outliner" style={`width: ${selectedElementDetails.width}px; height: ${selectedElementDetails.height}px; transform: translate3d(${selectedElementDetails.offsetLeft}px, ${selectedElementDetails.offsetTop}px, 0); z-index: 2;`}>
            <div class="breadcrumb active" style={`transform: translateY(${selectedElementDetails.offsetTop < 26 ? '0%' : '-100%'})`}>
                {@html nodeTags.find((tag) => tag.name === $instances.find((i) => i.instanceId === selectedElementDetails.id)?.nodeName)?.icon}

                <p>{$instances.find((i) => i.instanceId === selectedElementDetails.id)?.attributes.some((attr) => attr.name === 'class') ? $instances.find((i) => i.instanceId === selectedElementDetails.id)?.attributes.find((attr) => attr.name === 'class').value.replace('-', ' ') : $instances.find((i) => i.instanceId === selectedElementDetails.id)?.nodeName}</p>

                {#if settingsAvailableTags.includes($instances.find((i) => i.instanceId === selectedElementDetails.id)?.nodeName)}
                <span class="settings-icon-holder" on:click={() => settingsRevealed = !settingsRevealed}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.30394 4.13401L5.95027 4.44964L7.00014 2H9.00011L10.05 4.44964L12.6962 4.13404L13.6962 5.86607L12.0997 8.00003L13.6962 10.134L12.6962 11.866L10.0499 11.5504L9.00014 14H7.00014L5.95031 11.5504L3.30397 11.8661L2.30397 10.134L3.90045 8.00004L2.30396 5.86604L3.30394 4.13401ZM6.86941 4.84356L7.65953 3H8.34071L9.13081 4.84356C9.30553 5.25125 9.72794 5.49513 10.1684 5.4426L12.1599 5.20509L12.5005 5.79501L11.299 7.40098C11.0333 7.75615 11.0333 8.24391 11.299 8.59907L12.5005 10.205L12.1599 10.795L10.1683 10.5575C9.72791 10.5049 9.3055 10.7488 9.13078 11.1565L8.34074 13H7.65953L6.86945 11.1565C6.69472 10.7488 6.27231 10.505 5.83188 10.5575L3.8403 10.795L3.49969 10.2051L4.70117 8.59907C4.96687 8.24391 4.96687 7.75616 4.70117 7.401L3.49968 5.79499L3.84027 5.20507L5.83184 5.4426C6.27228 5.49513 6.69468 5.25125 6.86941 4.84356ZM8.00003 9C8.55232 9 9.00003 8.55228 9.00003 8C9.00003 7.44772 8.55232 7 8.00003 7C7.44775 7 7.00003 7.44772 7.00003 8C7.00003 8.55228 7.44775 9 8.00003 9Z" fill="currentColor"></path></svg>
                </span>
                {/if}
            </div>
        </div>
        {/if}

        {#if hoveredElementDetails.id}
        <div class="element-outliner" style={`width: ${hoveredElementDetails.width}px; height: ${hoveredElementDetails.height}px; transform: translate3d(${hoveredElementDetails.offsetLeft}px, ${hoveredElementDetails.offsetTop}px, 0)`}>
            <div class="breadcrumb">
                {@html nodeTags.find((tag) => tag.name === $instances.find((i) => i.instanceId === hoveredElementDetails.id).nodeName)?.icon}

                <p>{$instances.find((i) => i.instanceId === hoveredElementDetails.id).attributes.some((attr) => attr.name === 'class') ? $instances.find((i) => i.instanceId === hoveredElementDetails.id).attributes.find((attr) => attr.name === 'class').value.replace('-', ' ') : $instances.find((i) => i.instanceId === hoveredElementDetails.id).nodeName}</p>
            </div>
        </div>
        {/if}
    </div>

    {#if settingsRevealed}
    <SettingsPopover x={selectedElementDetails.offsetLeft} y={selectedElementDetails.offsetTop} canvasX={canvas?.offsetLeft || 0} bind:settingsRevealed={settingsRevealed} />
    {/if}

    <StylingManager />
</div>

<style>
    .content-modeling-outer-box {
        display: flex;
        max-height: calc(100vh - 6.4rem);

        position: relative;
    }

    iframe {
        width: 100%;
        height: 100%;

        background-color: #fff;
    }

    :global(main) {
        padding-bottom: 0;
    }

    :global(.content-modeling-outer-box .option-content p) {
        font-size: 1.2rem !important;
    }

    :global(.content-modeling-outer-box .dropdown-selection) {
        width: 100% !important;
        justify-content: space-between !important;
        padding: .2rem !important;
        border-radius: .4rem !important;
    }

    :global(.content-modeling-outer-box .dropdown-option) {
        padding: .4rem 1rem !important;
    }
    :global(.content-modeling-outer-box .dropdown-box) {
        width: 100% !important;
    }

    .iframe-holder {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        
        width: 100%;

        background-image: url(/assets/icons/cms-bg.png);
        background-repeat: repeat;
    }

    .iframe-controller {
        position: absolute;

        pointer-events: none;
    }

    .iframe-controller .breadcrumb {
        display: flex;
        align-items: center;
        gap: .6rem;

        width: fit-content;

        padding: .4rem;

        color: #947AF0;

        transform: translate3d(-0.1rem, -100%, 0);

        pointer-events: auto;
    }

    .iframe-controller .breadcrumb.active {
        background-color: #947AF0;
        color: #FFF;
        border-top-left-radius: .4rem;
    }

    .breadcrumb p {
        white-space: nowrap;
    }

    .iframe-controller .element-outliner {
        position: absolute;
        top: 0;
        left: 0;

        border: .1rem solid #947AF0;
    }

    .settings-icon-holder {
        display: flex;
        justify-content: center;
        align-items: center;

        padding-left: .4rem;

        border-left: .1rem solid rgba(255, 255, 255, .3);

        cursor: pointer;
    }
</style>
<script>
    import { alterAttribute } from '../../../stores/cms/functions';
    import { selectedInstance } from "../../../stores/cms/selectedInstance";
    import { selectedCMSTabIndex } from '../../../stores/cms/selectedCMSTabIndex';

    let selectionChangeInProgress = false;

    let widthAttr = '';
    let heightAttr = '';
    let autoplay = true;
    let playsinline = true;
    let muted = true;
    let loop = true;
    let poster = '';
    let assetMetadata;

    async function getProperties() {
        selectionChangeInProgress = true;
        let srcAttr = $selectedInstance.attributes.find((attr) => attr.name === 'src')?.value;
        widthAttr = $selectedInstance.attributes.find((attr) => attr.name === 'width')?.value || '';
        heightAttr = $selectedInstance.attributes.find((attr) => attr.name === 'height')?.value || '';
        autoplay = $selectedInstance.attributes.find((attr) => attr.name === 'autoplay')?.value || '';
        playsinline = $selectedInstance.attributes.find((attr) => attr.name === 'playsinline')?.value || '';
        muted = $selectedInstance.attributes.find((attr) => attr.name === 'muted')?.value || '';
        loop = $selectedInstance.attributes.find((attr) => attr.name === 'loop')?.value || '';
        muted = $selectedInstance.attributes.find((attr) => attr.name === 'muted')?.value || '';
        poster = $selectedInstance.attributes.find((attr) => attr.name === 'poster')?.value || '';

        if (srcAttr) {
            try {
                const assetsReq = await fetch(`https://preconvert.novus.studio/staging/assets/view?url=${srcAttr}`);
                const assetsRes = await assetsReq.json();
                
                assetMetadata = assetsRes.data[0];
            } catch (error) {
                console.error('Error fetching instances:', error);
            }
        }
        // selectedLoadingTypeIndex = $selectedInstance.attributes.findIndex((attr) => attr.name === 'loading') || 2;
        
        setTimeout(() =>{
            selectionChangeInProgress = false;
        }, 120);
    }

    $: $selectedInstance.instanceId, getProperties();
</script>

<div class="img-settings">
    <p>Video</p>

    <div class="img-item-selection">
        <div class="img-item-selection-inner">
            <div class="img-wrapper">
                <img src={assetMetadata?.url} alt={assetMetadata?.altText}>
            </div>
            <div>
                <p class="img-path">{assetMetadata?.originalFilename || ''}</p>
                <p>{assetMetadata?.width}px * {assetMetadata?.height}px</p>
                <p>{assetMetadata?.size > 1000000 
                        ? (assetMetadata?.size / 1000000).toFixed(1) + ' MB' 
                        : assetMetadata?.size > 1000 
                            ? (assetMetadata?.size / 1000).toFixed(1) + ' kB' 
                        : assetMetadata?.size + ' B'
                    }
                </p>
            </div>
        </div>

        <div class="replace" on:click={(e) => {$selectedCMSTabIndex = 3}}>
            Replace Video...
        </div>
    </div>                        
</div>

<div class="img-settings">
    <p>Poster</p>

    <div class="img-item-selection">
        <div class="img-item-selection-inner">
            <div class="img-wrapper">
                <img src={assetMetadata?.url} alt={assetMetadata?.altText}>
            </div>
            <div>
                <p class="img-path">{assetMetadata?.originalFilename || ''}</p>
                <p>{assetMetadata?.width}px * {assetMetadata?.height}px</p>
                <p>{assetMetadata?.size > 1000000 
                        ? (assetMetadata?.size / 1000000).toFixed(1) + ' MB' 
                        : assetMetadata?.size > 1000 
                            ? (assetMetadata?.size / 1000).toFixed(1) + ' kB' 
                        : assetMetadata?.size + ' B'
                    }
                </p>
            </div>
        </div>

        <div class="replace" on:click={(e) => {$selectedCMSTabIndex = 3}}>
            Replace Image...
        </div>
    </div>                        
</div>

<div>
    <p>Width</p>

    <input type="text" name="width" bind:value={widthAttr} on:blur={(e) => { alterAttribute(e.target.getAttribute('name'), e.target.value) }} />
</div>

<div>
    <p>Height</p>

    <input type="text" name="height" bind:value={heightAttr} on:blur={(e) => { alterAttribute(e.target.getAttribute('name'), e.target.value) }}  />
</div>
<video class="lozad" playsinline autoplay muted loop data-poster="/assets/videos/01.jpg">
    <source data-src="/assets/videos/01.mp4" type="video/mp4">
</video>
<div>
    <p>Autoplay</p>
    
    <div class="checkbox-outer-box" class:active={autoplay} on:click={() => { alterAttribute('autoplay', autoplay) }}>
        <label class="checkbox-item">
            <span class="purple-checkmark"></span>
            <input type="checkbox" checked={autoplay}>
        </label>
    </div>
</div>

<div>
    <p>Muted</p>
    
    <div class="checkbox-outer-box" class:active={muted} on:click={() => { alterAttribute('muted', muted) }}>
        <label class="checkbox-item">
            <span class="purple-checkmark"></span>
            <input type="checkbox" checked={muted}>
        </label>
    </div>
</div>

<div>
    <p>Loop</p>
    
    <div class="checkbox-outer-box" class:active={loop} on:click={() => { alterAttribute('loop', loop) }}>
        <label class="checkbox-item">
            <span class="purple-checkmark"></span>
            <input type="checkbox" checked={loop}>
        </label>
    </div>
</div>

<div>
    <p>Playsinline</p>
    
    <div class="checkbox-outer-box" class:active={playsinline} on:click={() => { alterAttribute('playsinline', playsinline) }}>
        <label class="checkbox-item">
            <span class="purple-checkmark"></span>
            <input type="checkbox" checked={playsinline}>
        </label>
    </div>
</div>

<style>
    .img-settings {
        align-items: flex-start !important;
    }
    .replace  {
        padding-block: .4rem !important;
        justify-content: center;

        cursor: pointer;

        border: .1rem solid #383C42;
    }

    .img-item-selection {
        width: 100%;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        gap: .6rem;

        padding: .2rem;

        border: .1rem solid #383C42;
    }


    .img-item-selection > div {
        display: flex;
        align-items: center;
        gap: .6rem;

        width: 100%;

        border-radius: .4rem;
    }

    .img-item-selection p {
        font-size: 1.1rem;
    }

    .img-item-selection .img-path {
        color: #FFFFFF;
    }

    .img-wrapper {
        padding: 0 !important;
        min-width: 4.8rem !important;
        width: 4.8rem !important;
        height: 4.8rem;
        border: .1rem solid #383C42;
        border-radius: .4rem;
    }
</style>
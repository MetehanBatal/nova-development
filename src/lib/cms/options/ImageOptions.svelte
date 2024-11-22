<script>
    import { alterAttribute } from '../../../stores/cms/functions';
    import { selectedInstance } from "../../../stores/cms/selectedInstance";
    import { selectedCMSTabIndex } from '../../../stores/cms/selectedCMSTabIndex';

    import Dropdown from "$lib/toolkit/Dropdown.svelte";

    let selectionChangeInProgress = false;

    const loadingTypes = [
        {
            name : "Lazy",
            value : "lazy",
            index : 0
        },
        {
            name : "Eager",
            value: "eager",
            index : 1
        },
        {
            name : "Auto",
            value : "auto",
            index : 2
        }
    ];
    let selectedLoadingTypeIndex = 2;

    console.log('Image selected: ', $selectedInstance);
    let widthAttr = '';
    let heightAttr = '';
    let altAttr = '';
    let assetMetadata;

    async function getProperties() {
        selectionChangeInProgress = true;
        let srcAttr = $selectedInstance.attributes.find((attr) => attr.name === 'src')?.value;
        widthAttr = $selectedInstance.attributes.find((attr) => attr.name === 'width')?.value || '';
        heightAttr = $selectedInstance.attributes.find((attr) => attr.name === 'height')?.value || '';
        altAttr = $selectedInstance.attributes.find((attr) => attr.name === 'alt')?.value || '';
        console.log('Img props: ', $selectedInstance);

        if (srcAttr) {
            try {
                const assetsReq = await fetch(`https://preconvert.novus.studio/staging/assets/view?url=${srcAttr}`);
                const assetsRes = await assetsReq.json();
                
                assetMetadata = assetsRes.data[0];

                console.log('Asset metadata: ', assetMetadata);
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
    <p>Image</p>

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

        <div class="replace" on:click={(e) => {$selectedCMSTabIndex = 2}}>
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

<div>
    <p>Alt Text</p>

    <input type="text" name="alt" bind:value={altAttr} on:blur={(e) => { alterAttribute(e.target.getAttribute('name'), e.target.value) }} >
</div>

<div>
    <p>Type</p>

    <Dropdown options={loadingTypes} bind:selectedStatusIndex={selectedLoadingTypeIndex} />
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
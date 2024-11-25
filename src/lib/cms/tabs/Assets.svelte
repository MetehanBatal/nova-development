<script>
    import { alterAttribute } from '../../../stores/cms/functions';
    import { selectedInstance } from '../../../stores/cms/selectedInstance';
    import { assets } from '../../../stores/cms/assets';
    import { toastMessage } from '../../../stores/toast';

    import { onMount } from 'svelte';

    let archivedAssets = [];
    let popoverPos = {};

    let assetSettingsOpened = '';
    let altText = '';

    onMount(async() => {
        // Fetch instances
        //
        try {
            const assetsReq = await fetch(`https://preconvert.novus.studio/staging/assets/view?limit=100&offset=0`);
            const assetsRes = await assetsReq.json();
            
            $assets = assetsRes.data.docs;
            archivedAssets = assetsRes.data.docs;

            alterImgContent();
        } catch (error) {
            console.error('Error fetching instances:', error);
        }
    });

    function alterImgContent() {
        if ($selectedInstance.nodeName === 'IMG') {
            $assets = $assets.filter((asset) => asset.mimetype.includes('image'));
        } else if ($selectedInstance.nodeName === 'VIDEO') {
            $assets = $assets.filter((asset) => asset.mimetype.includes('video'));
        } else {
            $assets = JSON.parse(JSON.stringify(archivedAssets));
        }
    }

    function handleAssetSelection(asset, e) {
        if (e.target.closest('.settings-opener')) {
            return; }

        if ($selectedInstance.nodeName === 'IMG' && asset.mimetype.includes('image')) {
            alterAttribute('src', asset.url);
        }
    }

    function getPopoverPos() {
        if (JSON.stringify(assetSettingsOpened).length < 5) {
            popoverPos = {};
        } else {
            setTimeout(() => {
                let selectedAssetEl = document.querySelector('.asset.selected').getBoundingClientRect();
                const offsetTop = selectedAssetEl.top - 32;
                const offsetLeft = selectedAssetEl.left;
                const width = selectedAssetEl.width;

                popoverPos = {
                    top: offsetTop,
                    left: offsetLeft + (width / 2)
                }

                popoverPos = popoverPos;
            }, 200);
        }
    }

    function handleAttrChange(prop, value, assetId) {
        const apiHeaders = new Headers();
              apiHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "assetId": assetId,
            [prop]: value
        });

        const requestOptions = {
            method: "POST",
            headers: apiHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("https://preconvert.novus.studio/staging/assets/upsert", requestOptions)
            .then((response) => response.json())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }

    async function deleteAsset(assetId) {
        const apiHeaders = new Headers();
        apiHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "DELETE",
            headers: apiHeaders,
            redirect: "follow"
        };

        try {
            const response = await fetch(`https://preconvert.novus.studio/prod/upload?id=${assetId}`, requestOptions);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to delete asset ${assetId}`);
            }

            const data = await response.json();
            
            $toastMessage = {
                type: "success",
                content: 'Successfully deleted file.'
            };

            assets.update(currentAssets => 
                currentAssets.filter(asset => asset.assetId !== assetId)
            );

            assetSettingsOpened = '';

            return data;

        } catch (error) {
            console.error('Error deleting file:', error);
            
            $toastMessage = {
                type: "error",
                content: 'Failed to delete file.'
            };

            throw error;
        }
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(assetSettingsOpened.url)
            .then(() => {
                console.log('URL copied to clipboard!');

                // open toast message
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }

    $: $selectedInstance, alterImgContent();
    $: assetSettingsOpened.assetId, getPopoverPos();
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<ul class="assets-holder">
    {#each $assets as asset (asset.assetId)}
    <li class="asset" class:selected={assetSettingsOpened?.assetId === asset.assetId} on:click={(e) => handleAssetSelection(asset, e)}>
        <div class="settings-opener" on:click={() => { assetSettingsOpened = asset }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.11 1H5.89C5.62478 1 5.37043 1.10536 5.18289 1.29289C4.99536 1.48043 4.89 1.73478 4.89 2V2.09C4.88982 2.26536 4.84353 2.43759 4.75577 2.58942C4.66801 2.74124 4.54187 2.86732 4.39 2.955L4.175 3.08C4.02298 3.16777 3.85054 3.21397 3.675 3.21397C3.49946 3.21397 3.32702 3.16777 3.175 3.08L3.1 3.04C2.87053 2.90763 2.59792 2.87172 2.342 2.94015C2.08608 3.00859 1.86778 3.17577 1.735 3.405L1.625 3.595C1.49263 3.82447 1.45672 4.09708 1.52515 4.353C1.59359 4.60892 1.76077 4.82722 1.99 4.96L2.065 5.01C2.21614 5.09726 2.34181 5.22254 2.42953 5.37342C2.51724 5.52429 2.56395 5.69549 2.565 5.87V6.125C2.5657 6.30121 2.51983 6.47448 2.43202 6.62725C2.34422 6.78003 2.21761 6.9069 2.065 6.995L1.99 7.04C1.76077 7.17278 1.59359 7.39108 1.52515 7.647C1.45672 7.90292 1.49263 8.17553 1.625 8.405L1.735 8.595C1.86778 8.82423 2.08608 8.99141 2.342 9.05985C2.59792 9.12828 2.87053 9.09237 3.1 8.96L3.175 8.92C3.32702 8.83223 3.49946 8.78603 3.675 8.78603C3.85054 8.78603 4.02298 8.83223 4.175 8.92L4.39 9.045C4.54187 9.13268 4.66801 9.25876 4.75577 9.41058C4.84353 9.56241 4.88982 9.73464 4.89 9.91V10C4.89 10.2652 4.99536 10.5196 5.18289 10.7071C5.37043 10.8946 5.62478 11 5.89 11H6.11C6.37522 11 6.62957 10.8946 6.81711 10.7071C7.00464 10.5196 7.11 10.2652 7.11 10V9.91C7.11018 9.73464 7.15647 9.56241 7.24423 9.41058C7.33199 9.25876 7.45813 9.13268 7.61 9.045L7.825 8.92C7.97702 8.83223 8.14946 8.78603 8.325 8.78603C8.50054 8.78603 8.67298 8.83223 8.825 8.92L8.9 8.96C9.12947 9.09237 9.40208 9.12828 9.658 9.05985C9.91392 8.99141 10.1322 8.82423 10.265 8.595L10.375 8.4C10.5074 8.17053 10.5433 7.89792 10.4748 7.642C10.4064 7.38608 10.2392 7.16778 10.01 7.035L9.935 6.995C9.7824 6.9069 9.65578 6.78003 9.56798 6.62725C9.48018 6.47448 9.4343 6.30121 9.435 6.125V5.875C9.4343 5.69879 9.48018 5.52552 9.56798 5.37275C9.65578 5.21997 9.7824 5.0931 9.935 5.005L10.01 4.96C10.2392 4.82722 10.4064 4.60892 10.4748 4.353C10.5433 4.09708 10.5074 3.82447 10.375 3.595L10.265 3.405C10.1322 3.17577 9.91392 3.00859 9.658 2.94015C9.40208 2.87172 9.12947 2.90763 8.9 3.04L8.825 3.08C8.67298 3.16777 8.50054 3.21397 8.325 3.21397C8.14946 3.21397 7.97702 3.16777 7.825 3.08L7.61 2.955C7.45813 2.86732 7.33199 2.74124 7.24423 2.58942C7.15647 2.43759 7.11018 2.26536 7.11 2.09V2C7.11 1.73478 7.00464 1.48043 6.81711 1.29289C6.62957 1.10536 6.37522 1 6.11 1Z" stroke="white" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 7.5C6.82843 7.5 7.5 6.82843 7.5 6C7.5 5.17157 6.82843 4.5 6 4.5C5.17157 4.5 4.5 5.17157 4.5 6C4.5 6.82843 5.17157 7.5 6 7.5Z" stroke="white" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>

        <img src={asset.mimetype.includes('image') ? asset.url : asset.thumbnailUrl || 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg'} alt={asset.altText} />

        <p>{asset.storedFileName.length > 14 ? `${asset.storedFileName.slice(0, 4)}...${asset.storedFileName.slice(-5)}` : asset.storedFileName}</p>
    </li>
    {/each}

    {#if JSON.stringify(assetSettingsOpened).length > 5}
    <div class="asset-popover" style={`top: ${popoverPos.top || 0}px; opacity: ${popoverPos.top ? 1 : 0}`}>
        <div class="triangle" style={`left: ${popoverPos.left || 0}px`}></div>

        <div class="popover-content">
            <div class="popover-heading">
                <h4>Asset Details</h4>

                <button on:click={() => {assetSettingsOpened = ''}}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.70714 8.00004L12.3536 4.35359L11.6465 3.64648L8.00004 7.29293L4.35359 3.64648L3.64648 4.35359L7.29293 8.00004L3.64648 11.6465L4.35359 12.3536L8.00004 8.70714L11.6465 12.3536L12.3536 11.6465L8.70714 8.00004Z" fill="currentColor"></path></svg>
                </button>
            </div>

            <div class="popover-title">
                <p>{assetSettingsOpened.originalFilename}</p>

                <div class="flex">
                    <button on:click={() => window.open(assetSettingsOpened.url, '_blank')}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.2929 5L6.00004 5V4H12L12 10L11 10V5.70711L5.35359 11.3536L4.64648 10.6464L10.2929 5Z" fill="currentColor"></path>
                        </svg>
                    </button>

                    <button on:click={copyToClipboard}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.14643 4.14667C9.17012 3.12298 10.8298 3.12298 11.8535 4.14667C12.8772 5.17036 12.8772 6.83009 11.8535 7.85378L10.8535 8.85378L10.1464 8.14667L11.1464 7.14667C11.7796 6.51351 11.7796 5.48695 11.1464 4.85378C10.5133 4.22062 9.4867 4.22061 8.85354 4.85378L7.85354 5.85378L7.14643 5.14667L8.14643 4.14667Z" fill="currentColor"></path><path d="M5.85354 7.85378L4.85354 8.85378C4.22037 9.48695 4.22037 10.5135 4.85354 11.1467C5.4867 11.7798 6.51326 11.7798 7.14643 11.1467L8.14643 10.1467L8.85354 10.8538L7.85353 11.8538C6.82984 12.8775 5.17012 12.8775 4.14643 11.8538C3.12274 10.8301 3.12274 9.17036 4.14643 8.14667L5.14643 7.14667L5.85354 7.85378Z" fill="currentColor"></path><path d="M6.85354 9.85378L9.85354 6.85378L9.14643 6.14667L6.14643 9.14667L6.85354 9.85378Z" fill="currentColor"></path></svg>
                    </button>
                </div>
            </div>

            <div>
                <div class="flex">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 3H13V8H12V4.70711L4.70711 12H8V13H3V8H4V11.2929L11.2929 4H8V3Z" fill="currentColor"></path></svg>

                    <p>{assetSettingsOpened.width}px x {assetSettingsOpened.height}px</p>
                </div>

                <div class="flex">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.05451 5.00098C4.36814 3.71845 6.1473 3 8 3C9.69666 3 11.3316 3.60252 12.6039 4.68901L13.1464 4.14645L13.8536 4.85355L8.35355 10.3536C8.15829 10.5488 7.84171 10.5488 7.64645 10.3536C7.45118 10.1583 7.45118 9.84171 7.64645 9.64645L11.8942 5.39868C10.8133 4.50009 9.434 4 8 4C6.40489 4 4.87745 4.61877 3.7531 5.71651C2.62916 6.81385 2 8.29957 2 9.84615V11H1V9.84615C1 8.02652 1.74048 6.28391 3.05451 5.00098Z" fill="currentColor"></path><path d="M13.303 7.11126L14.0357 6.37852C14.6614 7.42028 15 8.6156 15 9.84615V11H14V9.84615C14 8.88478 13.7569 7.94693 13.303 7.11126Z" fill="currentColor"></path></svg>

                    <p>{assetSettingsOpened.size > 1000000 
                            ? (assetSettingsOpened.size / 1000000).toFixed(1) + ' MB' 
                            : assetSettingsOpened.size > 1000 
                                ? (assetSettingsOpened.size / 1000).toFixed(1) + ' kB' 
                            : assetSettingsOpened.size + ' B'
                        }
                    </p>
                </div>
            </div>

            <div>
                <p>Alt Text</p>

                <input type="text" name="altText" bind:value={assetSettingsOpened.altText} on:blur={(e) => handleAttrChange('altText', e.target.value, assetSettingsOpened.assetId)} >
            </div>

            <div>
                <button on:click={() => deleteAsset(assetSettingsOpened.assetId)}><p>Delete</p></button>
            </div>
        </div>
    </div>
    {/if}
</ul>

<style>
    .assets-holder {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: .8rem;

        position: relative;

        padding: 0 1.6rem;
    }

    .asset {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: .2rem;

        position: relative;

        padding: .4rem;
        border-radius: .4rem;

        cursor: pointer;
    }

    .asset:hover,
    .asset.selected {
        background-color: #202830;
    }

    .asset img {
        aspect-ratio: 1;

        object-fit: cover;
        border-radius: .4rem;
    }

    .asset-popover {
        position: absolute;
        left: 1.2rem;
        right: 1.2rem;

        min-height: 4rem;

        background-color: #202830;
        border-radius: .8rem;
    }

    .popover-content > div {
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 1rem;
    }

    .popover-content > div:last-child {
        justify-content: flex-end;
    }

    .popover-content > div:last-child button {
        width: auto;

        color: #F37261;
    }

    .assets-holder p {
        font-size: 1.2rem;

        white-space: nowrap;
    }

    .popover-heading {
        border-bottom: .1rem solid #2e2e2e;

        color: #fff;
    }

    button {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 2.4rem;
        height: 2.4rem;

        border-radius: .4rem;

        cursor: pointer;

        transition: background-color .24s ease-in-out;
    }

    button:hover {
        background-color: rgba(13, 18, 26, .4);
    }

    button svg {
        color: rgba(255, 255, 255, 0.67);
    }

    .popover-heading h4 {
        font-size: 1.6rem;
    }

    .triangle {
        position: absolute;
        top: 0;

        width: 0;
        height: 0;

        border-left: .8rem solid transparent;
        border-right: .8rem solid transparent;
        border-bottom: 1.2rem solid #202830;

        transform: translate3d(-50%, -100%, 0);
    }

    .settings-opener {
        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        top: .8rem;
        right: .8rem;

        width: 1.8rem;
        height: 1.8rem;
        
        background-color: #202830;
        border-radius: .4rem;

        opacity: 0;
    }

    .asset:hover .settings-opener {
        opacity: 1;
    }

    .settings-opener:hover,
    .settings-opener.active {
        background-color: rgba(0, 0, 0, .82);
    }

    .flex {
        display: flex;
        gap: .4rem;
        align-items: center;
    }
</style>
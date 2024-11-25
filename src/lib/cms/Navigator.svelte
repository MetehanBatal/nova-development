<script>
    import { toastMessage } from '../../stores/toast';
    import { selectedCMSTabIndex } from '../../stores/cms/selectedCMSTabIndex';
    import { assets } from '../../stores/cms/assets';
    import { pages } from '../../stores/cms/pages';
    import { cmsMode } from '../../stores/cms/cmsMode';
    import { components } from '../../stores/cms/components';

    import Pages from "$lib/cms/tabs/Pages.svelte";
    import Layers from "$lib/cms/tabs/Layers.svelte";
    import Components from "$lib/cms/tabs/Components.svelte";
    import Assets from "$lib/cms/tabs/Assets.svelte";
    import Events from "$lib/cms/tabs/Events.svelte";
    import PageSettingsTab from "$lib/cms/PageSettings.svelte";
    import ContextMenu from "$lib/toolkit/ContextMenu.svelte";
    
    export let elementsTabRevealed;

    export let navigatorFixed;

    let appendActive = false;

    let initialCMSMode = JSON.stringify($cmsMode);

    let revealedSettingsId = '';
    let contextPosX = 0;
    let contextPosY = 0;

    let dropdownOptions = [];

    const tabs = [
        {
            name: 'Layers',
            icon: 
                `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.08793 2.04413C8.90337 1.95995 8.70287 1.91638 8.50002 1.91638C8.29716 1.91638 8.09666 1.95995 7.9121 2.04413L1.84168 4.80663C1.71599 4.86206 1.60912 4.95283 1.5341 5.06791C1.45907 5.18298 1.41913 5.31739 1.41913 5.45476C1.41913 5.59213 1.45907 5.72654 1.5341 5.84161C1.60912 5.95669 1.71599 6.04746 1.84168 6.10288L7.91918 8.87247C8.10375 8.95665 8.30424 9.00022 8.5071 9.00022C8.70996 9.00022 8.91045 8.95665 9.09502 8.87247L15.1725 6.10997C15.2982 6.05454 15.4051 5.96377 15.4801 5.84869C15.5551 5.73362 15.5951 5.59921 15.5951 5.46184C15.5951 5.32447 15.5551 5.19007 15.4801 5.07499C15.4051 4.95992 15.2982 4.86914 15.1725 4.81372L9.08793 2.04413Z" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.5833 13.0021L9.08791 15.9487C8.90334 16.0329 8.70285 16.0765 8.49999 16.0765C8.29713 16.0765 8.09664 16.0329 7.91207 15.9487L1.41666 13.0021" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.5833 9.46045L9.08791 12.4071C8.90334 12.4913 8.70285 12.5349 8.49999 12.5349C8.29713 12.5349 8.09664 12.4913 7.91207 12.4071L1.41666 9.46045" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
            component: Layers
        },
        {
            name: 'Pages',
            icon: 
                `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 2.5V17.5" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
            component: Pages
        },
        {
            name: 'Components',
            icon: 
                `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.9467 9.41086C12.7905 9.56713 12.7027 9.77905 12.7027 10C12.7027 10.221 12.7905 10.4329 12.9467 10.5892L14.9267 12.57C15.083 12.7262 15.2949 12.814 15.5159 12.814C15.7368 12.814 15.9487 12.7262 16.105 12.57L18.0859 10.5892C18.2421 10.4329 18.3298 10.221 18.3298 10C18.3298 9.77905 18.2421 9.56713 18.0859 9.41086L16.105 7.43002C15.9487 7.2738 15.7368 7.18604 15.5159 7.18604C15.2949 7.18604 15.083 7.2738 14.9267 7.43002L12.9467 9.41086Z" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M1.91415 9.41086C1.75793 9.56713 1.67017 9.77905 1.67017 10C1.67017 10.221 1.75793 10.4329 1.91415 10.5892L3.89499 12.57C4.05126 12.7262 4.26318 12.814 4.48415 12.814C4.70512 12.814 4.91705 12.7262 5.07332 12.57L7.05415 10.5892C7.21038 10.4329 7.29814 10.221 7.29814 10C7.29814 9.77905 7.21038 9.56713 7.05415 9.41086L5.07332 7.43002C4.91705 7.2738 4.70512 7.18604 4.48415 7.18604C4.26318 7.18604 4.05126 7.2738 3.89499 7.43002L1.91415 9.41086Z" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7.43001 14.9266C7.35253 15.004 7.29107 15.0959 7.24913 15.1971C7.20719 15.2983 7.18561 15.4067 7.18561 15.5162C7.18561 15.6257 7.20719 15.7342 7.24913 15.8353C7.29107 15.9365 7.35253 16.0284 7.43001 16.1058L9.41085 18.0858C9.56712 18.242 9.77904 18.3298 10 18.3298C10.221 18.3298 10.4329 18.242 10.5892 18.0858L12.57 16.1058C12.6475 16.0284 12.709 15.9365 12.7509 15.8353C12.7928 15.7342 12.8144 15.6257 12.8144 15.5162C12.8144 15.4067 12.7928 15.2983 12.7509 15.1971C12.709 15.0959 12.6475 15.004 12.57 14.9266L10.5892 12.9466C10.4329 12.7904 10.221 12.7026 10 12.7026C9.77904 12.7026 9.56712 12.7904 9.41085 12.9466L7.43001 14.9266Z" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7.43002 3.89499C7.2738 4.05126 7.18604 4.26318 7.18604 4.48415C7.18604 4.70512 7.2738 4.91705 7.43002 5.07332L9.41086 7.05332C9.56713 7.20955 9.77905 7.29731 10 7.29731C10.221 7.29731 10.4329 7.20955 10.5892 7.05332L12.57 5.07332C12.7262 4.91705 12.814 4.70512 12.814 4.48415C12.814 4.26318 12.7262 4.05126 12.57 3.89499L10.5892 1.91415C10.4329 1.75793 10.221 1.67017 10 1.67017C9.77905 1.67017 9.56713 1.75793 9.41086 1.91415L7.43002 3.89499Z" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
            component: Components
        },
        {
            name: 'Assets',
            icon: 
                `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.6667 3.33337H3.33335C2.41288 3.33337 1.66669 4.07957 1.66669 5.00004V15C1.66669 15.9205 2.41288 16.6667 3.33335 16.6667H16.6667C17.5872 16.6667 18.3334 15.9205 18.3334 15V5.00004C18.3334 4.07957 17.5872 3.33337 16.6667 3.33337Z" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.66667 9.99996C7.58714 9.99996 8.33333 9.25377 8.33333 8.33329C8.33333 7.41282 7.58714 6.66663 6.66667 6.66663C5.74619 6.66663 5 7.41282 5 8.33329C5 9.25377 5.74619 9.99996 6.66667 9.99996Z" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.66669 10H13.3334" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13.3334 9.99996C14.2538 9.99996 15 9.25377 15 8.33329C15 7.41282 14.2538 6.66663 13.3334 6.66663C12.4129 6.66663 11.6667 7.41282 11.6667 8.33329C11.6667 9.25377 12.4129 9.99996 13.3334 9.99996Z" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M5 16.6666L5.58333 14.2499C5.64126 13.9855 5.78933 13.7495 6.00218 13.5823C6.21502 13.415 6.47939 13.327 6.75 13.3333H13.25C13.5095 13.3225 13.7651 13.3986 13.9764 13.5496C14.1878 13.7005 14.3427 13.9177 14.4167 14.1666L15 16.6666" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
            component: Assets
        },
        {
            name: 'Events',
            icon: 
                `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.02551 9.5107C8.99847 9.44287 8.99191 9.3686 9.00664 9.29708C9.02136 9.22556 9.05673 9.15993 9.10836 9.1083C9.15999 9.05666 9.22563 9.0213 9.29714 9.00657C9.36866 8.99185 9.44293 8.99841 9.51076 9.02545L16.2608 11.6504C16.3331 11.6787 16.3949 11.7288 16.4376 11.7937C16.4803 11.8586 16.5018 11.9352 16.499 12.0128C16.4963 12.0905 16.4696 12.1654 16.4224 12.2272C16.3753 12.2889 16.3102 12.3345 16.236 12.3577L13.653 13.1587C13.5365 13.1947 13.4305 13.2586 13.3442 13.3449C13.258 13.4312 13.194 13.5372 13.158 13.6537L12.3578 16.2359C12.3346 16.3101 12.289 16.3753 12.2272 16.4224C12.1654 16.4695 12.0906 16.4963 12.0129 16.499C11.9353 16.5017 11.8587 16.4802 11.7938 16.4376C11.7288 16.3949 11.6788 16.3331 11.6505 16.2607L9.02551 9.5107Z" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.75 8.25V3.75C15.75 3.35218 15.592 2.97064 15.3107 2.68934C15.0294 2.40804 14.6478 2.25 14.25 2.25H3.75C3.35218 2.25 2.97064 2.40804 2.68934 2.68934C2.40804 2.97064 2.25 3.35218 2.25 3.75V14.25C2.25 14.6478 2.40804 15.0294 2.68934 15.3107C2.97064 15.592 3.35218 15.75 3.75 15.75H8.25" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
            component: Events
        }
    ];

    function handleAppendAction(event) {
        if (!appendActive) {
            if ($selectedCMSTabIndex === 0) {
                elementsTabRevealed = !elementsTabRevealed;
            } else if ($selectedCMSTabIndex === 3) {
                fileInput.click();
            } else if ($selectedCMSTabIndex === 2) {
                $components = [...$components, {
                    "componentId": "c622b95g-9082-74hc-h4ag7ca77711",
                    "name": "Untitled",
                    "path": "/src/lib/components/c622b95g-9082-74hc-h4ag7ca77711.svelte",
                    "occurrences": [{}],
                    "attributes": []
                }];

            } else if ($selectedCMSTabIndex === 1){
                dropdownOptions = [
                    {
                        name: 'Add a New Page',
                        icon:
                            `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2C3.44772 2 3 2.44772 3 3V13C3 13.5523 3.44772 14 4 14H7V13H4V3H8.29289L12 6.70711V8H13V6.29289L8.70711 2H4Z" fill="currentColor"></path><path d="M11 14H10V12H8V11H10V9H11V11H13V12H11V14Z" fill="currentColor"></path></svg>`,
                        action: () => {
                            handleNewPageCreation();

                            handleAppendAction();
                        }
                    },
                    {
                        name: 'Add a New Folder',
                        icon: 
                        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 4C2 3.44772 2.44772 3 3 3H6.70711L8.70711 5H13C13.5523 5 14 5.44772 14 6V7.5H13V6H8.29289L6.29289 4H3V12H8.5V13H3C2.44771 13 2 12.5523 2 12V4Z" fill="currentColor"></path><path d="M13 11V9H12V11H10V12H12V14H13V12H15V11H13Z" fill="currentColor"></path></svg>`,
                        action: () => {
                            console.log('Create new page folder');

                            handleAppendAction();
                        }
                    }
                ];

                const buttonRect = event.target.closest('button').getBoundingClientRect();

                const { top, left, width, height } = buttonRect;

                contextPosX = left;
                contextPosY = (top - 64) + height; // Note: removed the height of the navbar (64px)
            }
        } else {
            dropdownOptions = [];
        }

        appendActive = appendActive ? false : true;
    }

    // Reference to the hidden file input
    let fileInput;

    // Function to handle file selection and upload
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Optional: Validate file type and size here
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
        if (!allowedTypes.includes(file.type)) {
            // trigger toast error message
            $toastMessage.type = "error";
			$toastMessage.content = 'Unsupported file type. Please select an image or video.'
            
            return;
        }

        const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSizeInBytes) {
            // trigger toast error message
            $toastMessage.type = "error";
			$toastMessage.content = 'File size exceeds 50MB limit.'

            return;
        }

        // Prepare FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('altText', ''); // You can collect this from user input if needed

        try {
            const response = await fetch('http://localhost:3030/prod/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                
                throw new Error(errorData.error || 'Upload failed.');
            }

            const data = await response.json();
            // trigger toast success message
            $toastMessage.type = "success";
			$toastMessage.content = 'Uploaded file.'

            // update $assets 
            assets.update(currentAssets => [...currentAssets, data.data]);
        } catch (error) {
            console.error('Error uploading file:', error);
            // trigger toast error message

            $toastMessage.type = "error";
			$toastMessage.content = 'File upload failed.'
        }
    };

    function handleTabChange(index) {
        $selectedCMSTabIndex = index;
        $cmsMode = initialCMSMode;

        revealedSettingsId = '';
    }

    function handleNewPageCreation() {
        revealedSettingsId = 'new-page'
    }
</script>

<div class="builder" class:fixed={navigatorFixed}>
    <div class="builder-nav">
        <div class="tab-toggler">
        {#each tabs as tab, _index}
            <div class:active={_index === $selectedCMSTabIndex} on:click={() => {handleTabChange(_index)}}>
                {@html tab.icon}
            </div>
        {/each}
        </div>

        <button class:active={appendActive} on:click={(e) => { handleAppendAction(e) }}>
            <svg data-wf-icon="AddPanel24Icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.875 10.875V3.5H13.125V10.875H20.5V12.125H13.125V19.5H11.875V12.125H4.5V10.875H11.875Z" fill="currentColor"></path></svg>
        </button>

        {#if $selectedCMSTabIndex === 3}
            <input
                type="file"
                accept="image/*,video/*"
                bind:this={fileInput}
                on:change={handleFileChange}
                style="display: none;"
            />
        {/if}

        {#if dropdownOptions.length > 0}
            <ContextMenu options={dropdownOptions} posX={contextPosX} posY={contextPosY} />
        {/if}
    </div>

    <div class="navigator-component-holder">
        <svelte:component this={tabs[$selectedCMSTabIndex].component} on:settingsIdChanged={(e) => revealedSettingsId = e.detail.id} />
    </div>
</div>

{#if revealedSettingsId.length > 0}
    <PageSettingsTab bind:revealedSettingsId={revealedSettingsId} />
{/if}

<style>
    :global(.builder) {
        display: flex;
        flex-direction: column;
        /* position: absolute; */
        position: static;
        top: 0;
        left: 0;

        min-width: 24rem;
        max-width: 24rem;
        overflow: auto;
        
        background-color: var(--color-black, #060B13);

        border-right: .1rem solid #2e2e2e;
        
        z-index: 4;
    }

    .builder.fixed {
        position: static;

        /* width: 18rem; */
    }

    .builder-nav {
        display: flex;
        align-items: center;
        gap: 1.2rem;

        padding: .8rem 1.6rem;

        border-bottom: .1rem solid #212830;
    }

    .builder-nav button {
        display: flex;
        justify-content: center;
        align-items: center;
        
        width: 3.4rem;
        height: 3.4rem;

        color: #fff;

        border-radius: .8rem;

        transition: background-color .24s ease-in-out;
    }

    .builder-nav button.active,
    .builder-nav button:hover {
        background-color: #1A1F26;
    }

    .navigator-component-holder {
        height: 100%;
        padding: .8rem 0;
        
        overflow-y: auto; /* Add scroll if content overflows */
    }

    :global(.navigator-component-holder ul:hover .depth::after) {
        opacity: 1;
    }

    .heading {
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 0.6rem 1rem;

        border-bottom: .1rem solid #2e2e2e;
    }

    .heading button {
        background-color: transparent;
        color: rgba( 255, 255, 255, .67 );

        border: 0;
        outline: none;
    }

    /* Styling for the dropdown button */
    .dropdown-button {
        width: 1.6rem; /* Fixed width for consistency */
        height: 1.6rem;

        padding: 0;

        background: none;
        border: none;
        color: inherit;
        
        cursor: pointer;
    }

    .dropdown-button:focus {
        outline: none;
    }

    /* Placeholder to align items without dropdown */
    .dropdown-placeholder {
        display: inline-block;
        width: 1.2rem; /* Same width as dropdown-button */
        margin-right: 0.5rem;
    }

    :global(.cms-line) {
        display: flex;
        gap: .4rem;

        position: relative;

        padding: .4rem 2.4rem;

        cursor: pointer;

        transition: background-color .2s ease-in-out;
    }

    :global(.cms-line:hover) {
        background-color: rgba(148, 122, 240, 0.2);
    }

    :global(.cms-line.selected) {
        background-color: #947AF0;
    }

    :global(.cms-line button) {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 1.6rem;
        height: 1.6rem;

        padding: 0;
    }

    :global(.cms-line p) {
        font-size: 1.2rem;
        line-height: 1.8rem;
        text-transform: capitalize;
        transform: translateY(.05rem);
    }

    :global(.depth) {
        position: relative;

        width: 2rem;
    }

    :global(.depth::after) {
        position: absolute;
        top: -.4rem;
        bottom: 0;
        left: 35%;

        display: block;
        
        content: '';
        opacity: 0;

        width: .1rem;
        height: calc(100% + .8rem);
        
        background: rgba( 230, 230, 230, .2 );
    }

    .tab-toggler {
		display: flex;
		gap: .6rem;

        width: 100%;

		padding: .4rem;
        margin: .4rem auto;

		border-radius: .8rem;
		border: .1rem solid #212830;
	}

	.tab-toggler div {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;

        aspect-ratio: 1;

		font-size: 1.2rem;

		color: #6d6d6d;

		border: .1rem solid transparent;
		border-radius: .4rem;
		background-color: transparent;

		transition: all .24s ease-in-out;

		cursor: pointer;
	}

	.tab-toggler div.active {
		color: #fff;
		border-color: #383C42;
		background-color: #212830;
	}

    :global(.tab-toggler div path) {
        stroke: #88888A;
    }

    :global(.tab-toggler div.active path) {
        stroke: #fff;
    }
</style>

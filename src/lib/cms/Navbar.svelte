<script>
    import { pages } from '$stores/cms/pages';
    import { instances } from '$stores/cms/instances';
    import { components } from '$stores/cms/components';
    import { variants } from '$stores/cms/variants';
    import { styleSheet } from '$stores/cms/styleSheet';
    import { selectedBreakpoint } from '$stores/cms/selectedBreakpoint';
    import { cmsMode } from '$stores/cms/cmsMode';
    import { generateRandomString, generateRandomNumber, dbActions } from '$stores/cms/functions';

    import Dropdown from '$lib/toolkit/Dropdown.svelte';
    import Switch from '$lib/toolkit/Switch.svelte';
    import SwitchBox from "$lib/toolkit/SwitchBox.svelte";
    import SelectBox from '$lib/toolkit/SelectBox.svelte';
    import SplitButton from '$lib/toolkit/SplitButton.svelte';

    import { onMount } from 'svelte';
  import { toastMessage } from '$stores/toast';

    let visible = false;
    let navbarShrunk = false;
    let designMode = true;
    let selectedVariantIndex = 0;

    const breakpoints = [
		{
			icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.668 2.5H3.33464C2.41416 2.5 1.66797 3.24619 1.66797 4.16667V12.5C1.66797 13.4205 2.41416 14.1667 3.33464 14.1667H16.668C17.5884 14.1667 18.3346 13.4205 18.3346 12.5V4.16667C18.3346 3.24619 17.5884 2.5 16.668 2.5Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.66797 17.5H13.3346" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 14.1665V17.4998" stroke-linecap="round" stroke-linejoin="round"/></svg>',
			breakpoint: 1920,
            breakpointName: 'xxl'
		},
		{
			icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.6669 13.3332V5.83317C16.6669 5.39114 16.4913 4.96722 16.1787 4.65466C15.8662 4.3421 15.4422 4.1665 15.0002 4.1665H5.00022C4.55819 4.1665 4.13427 4.3421 3.82171 4.65466C3.50915 4.96722 3.33355 5.39114 3.33355 5.83317V13.3332M16.6669 13.3332H3.33355M16.6669 13.3332L17.7336 15.4582C17.7978 15.5857 17.8282 15.7275 17.8219 15.8701C17.8156 16.0128 17.7727 16.1514 17.6974 16.2727C17.6221 16.394 17.5169 16.4939 17.3919 16.5628C17.2669 16.6318 17.1263 16.6675 16.9836 16.6665H3.01689C2.87413 16.6675 2.73351 16.6318 2.60851 16.5628C2.48351 16.4939 2.37832 16.394 2.30303 16.2727C2.22775 16.1514 2.18488 16.0128 2.17855 15.8701C2.17222 15.7275 2.20264 15.5857 2.26689 15.4582L3.33355 13.3332" stroke-linecap="round" stroke-linejoin="round"/></svg>',
			breakpoint: 1240,
            breakpointName: 'desktop'
		},
		{
			icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.9987 1.66699H4.9987C4.07822 1.66699 3.33203 2.41318 3.33203 3.33366V16.667C3.33203 17.5875 4.07822 18.3337 4.9987 18.3337H14.9987C15.9192 18.3337 16.6654 17.5875 16.6654 16.667V3.33366C16.6654 2.41318 15.9192 1.66699 14.9987 1.66699Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 15H10.0088" stroke-linecap="round" stroke-linejoin="round"/></svg>',
			breakpoint: 768,
            breakpointName: 'tablet'
		},
		{
			icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.168 1.66699H5.83464C4.91416 1.66699 4.16797 2.41318 4.16797 3.33366V16.667C4.16797 17.5875 4.91416 18.3337 5.83464 18.3337H14.168C15.0884 18.3337 15.8346 17.5875 15.8346 16.667V3.33366C15.8346 2.41318 15.0884 1.66699 14.168 1.66699Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 15H10.0088" stroke-linecap="round" stroke-linejoin="round"/></svg>',
			breakpoint: 468,
            breakpointName: 'mobile'
		},
	];
    let selectedBreakpointIndex = 1;

    const publishOptions = [
        {
            title: 'Publish on Staging',
            action: async () => {
                let publishRes = await triggerPublish('staging');

                console.log('Req: ', publishRes);
            }
        },
        {
            title: 'Publish on Production',
            action: () => {
                triggerPublish('production')
            }
        }
    ];

    async function triggerPublish(environment) {
        try {
            const publishReq = await fetch(`http://localhost:3030/${environment}/publish`);
            const publishRes = await publishReq.json();

            if (publishRes.success) {
                $toastMessage = {
                    type: 'success',
                    content: 'Publish initiated. Website should be live in a few minutes.'
                }
            }
            
            return publishRes;
        } catch (error) {
            console.error('Error fetching instances:', error);
        }
        console.log('Publish trigger for: ', environment, $instances, $styleSheet);
    }

    onMount(() => {
        setTimeout(() => {
            visible = true;

            handleNavbarWidth();
        }, 400)
    });

    function handleNavbarWidth() {
        navbarShrunk = !navbarShrunk;
        if (navbarShrunk) {
            document.querySelector('.sidebar').classList.add('shrunk');
            document.querySelector('.user-navbar-wrapper').classList.add('largen');
        } else {
            document.querySelector('.sidebar').classList.remove('shrunk');
            document.querySelector('.user-navbar-wrapper').classList.remove('largen');
        }
    }

    function alterBreakpoint() {
        $selectedBreakpoint = breakpoints[selectedBreakpointIndex].breakpointName
    }

    async function handleNewVariantCreation(event) {
        let newInstanceId = generateRandomString();
        let newVariantId = `v-${generateRandomString()}`;

        console.log('Instances before variant creation: ', JSON.parse(JSON.stringify($instances)));

        let newInstances = $instances.map(inst => {
            const { instanceId, variantId, id, ...rest } = inst;

            return {
                ...rest,
                instanceId: newInstanceId,
                id: newInstanceId,
                variantId: newVariantId
            }
        });

        let newVariantSchema = {
            componentId: $instances[0].componentId,
            name: `New Variant ${generateRandomNumber(4)}`,
            nestedInstanceIds: newInstances.map(instance => instance.instanceId),
            variantId: newVariantId
        }

        $instances = [...$instances, ...newInstances];

        console.log('Instances after variant creation: ', JSON.parse(JSON.stringify(instances)));

        let updatedInstances = await dbActions(newInstances, 'instances', 'upsert');
        let updatedVariant = await dbActions(newVariantSchema, 'variants', 'upsert');

        $variants.variants = [...$variants.variants, newVariantSchema];
    }

    function handleVariantSwitch() {
        if (!visible) {
            return; }

        $variants.selectedVariantId = $variants.variants[selectedVariantIndex].variantId;

    }

    function handleNameChange(event) {
        $variants.variants[selectedVariantIndex].name = event.detail[0];
    }

    $: selectedBreakpointIndex, alterBreakpoint();
    $: designMode, $cmsMode = designMode ? 'design' : 'edit';
    $: $components, console.log('Comps: ', $components);
    $: $instances, console.log('Ins: ', $instances);
    $: $variants, console.log('Vars: ', $variants);
    $: selectedVariantIndex, handleVariantSwitch();
</script>


<div class={`component-navbar ${visible ? 'visible' : ''} ${navbarShrunk ? 'largen' : ''}`}>
    <div>
        <button class:active={navbarShrunk} on:click={() => {handleNavbarWidth()}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-xl-heavy"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.85719 3H15.1428C16.2266 2.99999 17.1007 2.99998 17.8086 3.05782C18.5375 3.11737 19.1777 3.24318 19.77 3.54497C20.7108 4.02433 21.4757 4.78924 21.955 5.73005C22.2568 6.32234 22.3826 6.96253 22.4422 7.69138C22.5 8.39925 22.5 9.27339 22.5 10.3572V13.6428C22.5 14.7266 22.5 15.6008 22.4422 16.3086C22.3826 17.0375 22.2568 17.6777 21.955 18.27C21.4757 19.2108 20.7108 19.9757 19.77 20.455C19.1777 20.7568 18.5375 20.8826 17.8086 20.9422C17.1008 21 16.2266 21 15.1428 21H8.85717C7.77339 21 6.89925 21 6.19138 20.9422C5.46253 20.8826 4.82234 20.7568 4.23005 20.455C3.28924 19.9757 2.52433 19.2108 2.04497 18.27C1.74318 17.6777 1.61737 17.0375 1.55782 16.3086C1.49998 15.6007 1.49999 14.7266 1.5 13.6428V10.3572C1.49999 9.27341 1.49998 8.39926 1.55782 7.69138C1.61737 6.96253 1.74318 6.32234 2.04497 5.73005C2.52433 4.78924 3.28924 4.02433 4.23005 3.54497C4.82234 3.24318 5.46253 3.11737 6.19138 3.05782C6.89926 2.99998 7.77341 2.99999 8.85719 3ZM6.35424 5.05118C5.74907 5.10062 5.40138 5.19279 5.13803 5.32698C4.57354 5.6146 4.1146 6.07354 3.82698 6.63803C3.69279 6.90138 3.60062 7.24907 3.55118 7.85424C3.50078 8.47108 3.5 9.26339 3.5 10.4V13.6C3.5 14.7366 3.50078 15.5289 3.55118 16.1458C3.60062 16.7509 3.69279 17.0986 3.82698 17.362C4.1146 17.9265 4.57354 18.3854 5.13803 18.673C5.40138 18.8072 5.74907 18.8994 6.35424 18.9488C6.97108 18.9992 7.76339 19 8.9 19H9.5V5H8.9C7.76339 5 6.97108 5.00078 6.35424 5.05118ZM11.5 5V19H15.1C16.2366 19 17.0289 18.9992 17.6458 18.9488C18.2509 18.8994 18.5986 18.8072 18.862 18.673C19.4265 18.3854 19.8854 17.9265 20.173 17.362C20.3072 17.0986 20.3994 16.7509 20.4488 16.1458C20.4992 15.5289 20.5 14.7366 20.5 13.6V10.4C20.5 9.26339 20.4992 8.47108 20.4488 7.85424C20.3994 7.24907 20.3072 6.90138 20.173 6.63803C19.8854 6.07354 19.4265 5.6146 18.862 5.32698C18.5986 5.19279 18.2509 5.10062 17.6458 5.05118C17.0289 5.00078 16.2366 5 15.1 5H11.5ZM5 8.5C5 7.94772 5.44772 7.5 6 7.5H7C7.55229 7.5 8 7.94772 8 8.5C8 9.05229 7.55229 9.5 7 9.5H6C5.44772 9.5 5 9.05229 5 8.5ZM5 12C5 11.4477 5.44772 11 6 11H7C7.55229 11 8 11.4477 8 12C8 12.5523 7.55229 13 7 13H6C5.44772 13 5 12.5523 5 12Z" fill="currentColor"></path></svg>
        </button>

        <Dropdown options={$pages.pages.map(({pageName}, index) => ({name: pageName, index}))} bind:selectedStatusIndex={$pages.selectedPageIndex} position="left" />

        {#if $cmsMode === 'component' && $variants.variants?.length > 0}
        <SelectBox
            options={$variants.variants.map(({ name }) => name)}
            bind:selectedIndex={selectedVariantIndex}
            nameEditable="true"
            variantCreatable="true"
            on:nameChanged={handleNameChange}
            on:variantCreated={handleNewVariantCreation}
        />
        {/if}
    </div>

    <Switch options={breakpoints.map(({icon}) => ({icon}))} bind:selectedIndex={selectedBreakpointIndex} />
        
    <div>
        <SwitchBox title="Design" titlePos='reversed' bind:status={designMode}/>

        <SplitButton options={publishOptions} on:mainActionTriggered={() => { triggerPublish('staging') }}>
            Publish
        </SplitButton>
    </div>
</div>

<style scoped>
    .component-navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;

        position: fixed;
        top: 0;
        left: 9.4rem;
        right: 0;

        height: 6.4rem;

        padding: 1.2rem 2.4rem;

        background-color: #060B13;
        border-bottom: .1rem solid #212830;

        transform: translateY(-200%);
        transition: all .24s ease-in-out;

        z-index: 99;
    }

    .component-navbar.visible {
        transform: translateY(0);
    }

    .component-navbar.largen {
        width: 100%;
        left: 0;
    }

    .component-navbar div {
        display: flex;
        align-items: center;
        gap: .8rem;
    }

    :global(.component-navbar .switch-option) {
        width: 3.2rem!important;
    }

    button {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 4rem;
        height: 4rem;

        border-radius: .8rem;

        cursor: pointer;

        transition: background-color .24s ease-in-out;
    }

    button.active {
        background-color: #1A1F26;
    }

    button path {
        fill: #fff;
    }

    :global(.component-navbar .switch-option path) {
        stroke: var(--fontColor-secondary)!important;
        fill: none!important;
    }

    :global(.component-navbar .switch-option.active path) {
        stroke: var(--fontColor-primary)!important;
    }
</style>
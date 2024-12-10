<script>
    import { selectedInstance } from '$stores/cms/selectedInstance';
    import { nodeTags } from '$stores/cms/nodeTags';
    import { cmsMode } from '$stores/cms/cmsMode';

    import LayoutSelector from '$lib/cms/styling/LayoutSelector.svelte';
    import ClassSelector from '$lib/cms/styling/ClassSelector.svelte';
    import SpacingSelector from '$lib/cms/styling/SpacingSelector.svelte';
    import SizeSelector from '$lib/cms/styling/SizeSelector.svelte';
    import PositionSelector from '$lib/cms/styling/PositionSelector.svelte';
    import TypographySelector from '$lib/cms/styling/TypographySelector.svelte';
    import BackgroundSelector from '$lib/cms/styling/BackgroundSelector.svelte';
    import BorderSelector from '$lib/cms/styling/BorderSelector.svelte';
    import ComponentCreator from '$lib/cms/components/ComponentCreator.svelte';
</script>

<div class="styling-manager-outer-box" class:hidden={$cmsMode === 'edit'}>
    <div class="selector-info-wrapper">
        <div>
            {@html nodeTags.find((tag) => tag.name === ($selectedInstance.instanceId !== '' ? $selectedInstance.nodeName : 'DIV')).icon}

            <p>{$selectedInstance.instanceId !== '' ? $selectedInstance.class.length > 0 ? $selectedInstance.class.split(' ')[0].replace('-', ' ') : $selectedInstance.nodeName : 'None Selected'}</p>
        </div>

        {#if $selectedInstance.instanceId !== ''}
        <ComponentCreator />
        {/if}
    </div>
    
    {#if $selectedInstance.instanceId !== ''}
        <ClassSelector />
        
        <LayoutSelector />

        <SpacingSelector />

        <SizeSelector />
        
        <PositionSelector />

        <TypographySelector />
        
        <BackgroundSelector />

        <BorderSelector />
    {:else}
        <div class="empty-selection-box">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M26.1115 2.73608L24.9824 9.84224L25.9701 9.99818L27.0993 2.89203L26.1115 2.73608ZM13.1682 18.3989L6.03852 17.2733L5.88159 18.2609L13.0113 19.3865L13.1682 18.3989ZM32.25 13.8326L38.0894 9.6038L38.6781 10.4115L32.8388 14.6404L32.25 13.8326ZM8.88953 30.7503L14.7288 26.5215L15.3175 27.3292L9.47826 31.558L8.88953 30.7503ZM17.828 11.557L13.5843 5.73501L12.774 6.32184L17.0176 12.1438L17.828 11.557Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M23.1827 18.7043C22.4775 18.2913 21.6192 18.8982 21.7657 19.6894L28.2063 54.4649C28.3636 55.314 29.4966 55.5262 29.9517 54.7822L35.8288 45.1736C36.1979 44.5702 37.0663 44.5416 37.4733 45.1206L45.4009 56.3977C45.7009 56.8245 46.2937 56.9293 46.7245 56.6288L49.4965 54.6955C49.9263 54.3957 50.0297 53.8079 49.7304 53.3822L41.8029 42.1051C41.3938 41.5232 41.722 40.7181 42.4155 40.5795L53.4904 38.3648C54.3478 38.1934 54.5347 37.0643 53.7872 36.6266L23.1827 18.7043ZM20.7822 19.8717C20.4781 18.2296 22.2521 17.0004 23.6885 17.8416L54.293 35.7639C55.8391 36.6693 55.4391 38.9947 53.6863 39.3452L42.6384 41.5544L50.5489 52.8073C51.1675 53.6873 50.9512 54.8999 50.0687 55.5153L47.2967 57.4487C46.4154 58.0634 45.2003 57.8516 44.5824 56.9727L36.6693 45.716L30.805 55.3035C29.8748 56.8242 27.5482 56.4041 27.2228 54.6472L20.7822 19.8717Z" fill="currentColor"></path></svg>

            <p>Make a selection</p>

            <p>Select an element on the canvas to activate the panel.</p>
        </div>

    {/if}

</div>

<style>
    .styling-manager-outer-box {
        min-width: 24rem;
            width: 24rem;
        max-height: 100dvh;

        overflow-y: auto;

        transition: all .24s ease-in-out;
    }

    .styling-manager-outer-box.hidden {
        min-width: 0;
        width: 0;
        transform: translate3d(100%, 0, 0);
    }

    .selector-info-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .selector-info-wrapper > div {
        display: flex;
        align-items: center;
        gap: .6rem;

        padding: 1rem;
    }

    .selector-info-wrapper p {
        text-transform: capitalize;
    }

    .empty-selection-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: .6rem;

        background-color: var(--color-dark);
        border-radius: .4rem;

        margin: 1rem;
        padding: 1rem;

        text-align: center;
    }

    /* styling manager components */
    :global(.options) {
        display: grid;
        align-items: center;
        grid-template-columns: 4.8rem 1fr;
        gap: .4rem;
        
        padding: .8rem 0;
    }

    :global(.options > p) {
        font-size: 1.2rem;
        color: rgba(255, 255, 255, .66);
    }

    :global(.switch-option path) {
        fill: var(--fontColor-secondary);
    }

    :global(.switch-option.active path) {
        fill: var(--fontColor-primary);
    }

    :global(input) {
        width: 100%;

        border: .1rem solid #212830;
        background-color: #0D121A;
        border-radius: .6rem;

        padding: .4rem;

        color: #fff;
    }

    :global(.spacing-items) {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: auto auto auto;
    }

    :global(.spacing-items > div) {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: .4rem;
    }

    :global(.spacing-items > div:first-child) {
      grid-column: 2;
      grid-row: 1;
    }

    :global(.spacing-items > div:nth-child(2)) {
      grid-column: 1;
      grid-row: 2;
    }

    :global(.spacing-items > div:nth-child(3)) {
      grid-column: 3;
      grid-row: 2;
    }

    :global(.spacing-items > div:last-child) {
      grid-column: 2;
      grid-row: 3;
    }

    :global(.spacing-items label) {
        font-size: 1.2rem;
        color: rgba(255, 255, 255, .66);
    }

    :global(.color-selection input:first-child) {
        min-width: 2.4rem;
            width: 2.4rem;
        height: 2.4rem;

        background-color: transparent;
        border: 0;
        border-radius: 0;
        border-top-left-radius: .3rem;
        border-bottom-left-radius: .3rem;
        
        padding: 0;
    }

    :global(.color-selection input:last-child) {
        border: 0;
        border-radius: 0;
    }

    :global(.color-selection) {
        display: flex;
        align-items: center;
        
        border: .1rem solid #212830;
        border-radius: .4rem;
        background-color: #0D121A;

        overflow: hidden;
    }


</style>
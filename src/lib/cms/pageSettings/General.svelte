<script>
    import { pages } from '../../../stores/cms/pages';

    export let title;
    export let selectedPage;
    
    let dropdownOpened = true;

    // let selectedPage = $pages.pages.find((page) => page.pageId === pageId);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="collapse-group">
    <div class="collapse-heading" on:click={() => { dropdownOpened = !dropdownOpened }}>
        <h4>{title}</h4>

        <svg style={`transform: rotate(${dropdownOpened ? 90 : 0}deg);`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.29287 8.00004L6.64642 5.35359L7.35353 4.64648L10.7071 8.00004L7.35353 11.3536L6.64642 10.6465L9.29287 8.00004Z" fill="currentColor"></path></svg>
    </div>

    {#if dropdownOpened}
    <div class="collapse-content">
        <div class="input-holder">
            <p class="label">Page Name</p>

            <input type="text" bind:value={selectedPage.pageName}>
        </div>

        <div class="input-holder">
            <p class="label">Page Slug</p>

            <input type="text" bind:value={selectedPage.slug}>
        </div>

        <div class="input-holder">
            <p class="label">Folder</p>

            <input type="text" bind:value={selectedPage.folder}>
        </div>
    </div>
    {/if}
</div>


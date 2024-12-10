<script>
    import { pages } from '$stores/cms/pages';

    import { createEventDispatcher } from 'svelte';
    import { writable } from 'svelte/store';

    const dispatch = createEventDispatcher();

    export let revealedSettingsId;

    // Reactive store to track expanded folders
    const expandedFolders = writable(new Set());

    // Function to group pages by folder
    const groupPagesByFolder = (pagesArray) => {
        const grouped = [];
        const folderMap = new Map();

        pagesArray.forEach(page => {
            const folder = page.folder || null; // Use null for pages without a folder
            if (folder) {
                if (!folderMap.has(folder)) {
                    folderMap.set(folder, { folder, pages: [] });
                    grouped.push(folderMap.get(folder));
                }
                folderMap.get(folder).pages.push(page);
            } else {
                grouped.push({ folder: null, pages: [page] });
            }
        });

        return grouped;
    };

    // Reactive variable for sorted and grouped pages
    let groupedPages = [];

    // Reactive statement to update groupedPages whenever $pages changes
    $: {
        // Step 1: Determine the order of folders based on their first occurrence
        const folderOrderMap = new Map();
        let currentOrder = 0;

        $pages.pages.forEach(item => {
            if (!folderOrderMap.has(item.folder)) {
                folderOrderMap.set(item.folder, currentOrder++);
            }
        });

        // Step 2: Sort the pages based on folder order
        const sortedPages = [...$pages.pages].sort((a, b) => {
            return folderOrderMap.get(a.folder) - folderOrderMap.get(b.folder);
        });

        // Step 3: Group the sorted pages by folder
        groupedPages = groupPagesByFolder(sortedPages);
    }

    // Function to toggle folder expansion
    const toggleFolder = (folderName) => {
        expandedFolders.update(folders => {
            const newFolders = new Set(folders);
            if (newFolders.has(folderName)) {
                newFolders.delete(folderName);
            } else {
                newFolders.add(folderName);
            }
            return newFolders;
        });
    };

    function selectPage(id) {
        $pages.selectedPageIndex = $pages.pages.findIndex((p) => p.pageId === id);

        console.log('page index changed: ', $pages);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<ul>
    {#each groupedPages as group (group.folder || group.pages[0].pageId)}
        {#if group.folder}
            <li class="cms-line" on:click={() => toggleFolder(group.folder)}>
                {#if $expandedFolders.has(group.folder)}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 3C1.44772 3 1 3.44772 1 4V7H2V4H5.29289L7.29289 6H12V5H7.70711L5.70711 3H2Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M3.83852 7C3.42961 7 3.0619 7.24895 2.91004 7.62861L1.31004 11.6286C1.04729 12.2855 1.53105 13 2.23852 13H12.1615C12.5704 13 12.9381 12.751 13.09 12.3714L14.69 8.37139C14.9527 7.71453 14.4689 7 13.7615 7H3.83852ZM3.83852 8L13.7615 8L12.1615 12H2.23852L3.83852 8Z" fill="currentColor"></path></svg>
                {:else}  
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 3C2.44772 3 2 3.44772 2 4V8V12C2 12.5523 2.44771 13 3 13H13C13.5523 13 14 12.5523 14 12V8V6C14 5.44772 13.5523 5 13 5H8.70711L6.70711 3H3ZM13 7V6H8.29289L6.29289 4H3V7H13ZM3 8V12H13V8H3Z" fill="currentColor"></path></svg>
                {/if}
                
                <p>{group.folder}</p>
            </li>
            
            {#if $expandedFolders.has(group.folder)}
            {#each group.pages as page (page.pageId)}
                <li on:click={() => {selectPage(page.pageId)}} class="cms-line" class:selected={$pages.pages[$pages.selectedPageIndex].pageId === page.pageId}>
                    <div class="depth"></div>

                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 3C3 2.44772 3.44772 2 4 2H8.70711L13 6.29289V13C13 13.5523 12.5523 14 12 14H4C3.44772 14 3 13.5523 3 13V3ZM8.29289 3H4V13H12V6.70711L8.29289 3Z" fill="currentColor"></path></svg>

                    <p>{page.pageName}</p>

                    <button on:click={() => dispatch('settingsIdChanged', {id: page.pageId})}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.30394 4.13401L5.95027 4.44964L7.00014 2H9.00011L10.05 4.44964L12.6962 4.13404L13.6962 5.86607L12.0997 8.00003L13.6962 10.134L12.6962 11.866L10.0499 11.5504L9.00014 14H7.00014L5.95031 11.5504L3.30397 11.8661L2.30397 10.134L3.90045 8.00004L2.30396 5.86604L3.30394 4.13401ZM6.86941 4.84356L7.65953 3H8.34071L9.13081 4.84356C9.30553 5.25125 9.72794 5.49513 10.1684 5.4426L12.1599 5.20509L12.5005 5.79501L11.299 7.40098C11.0333 7.75615 11.0333 8.24391 11.299 8.59907L12.5005 10.205L12.1599 10.795L10.1683 10.5575C9.72791 10.5049 9.3055 10.7488 9.13078 11.1565L8.34074 13H7.65953L6.86945 11.1565C6.69472 10.7488 6.27231 10.505 5.83188 10.5575L3.8403 10.795L3.49969 10.2051L4.70117 8.59907C4.96687 8.24391 4.96687 7.75616 4.70117 7.401L3.49968 5.79499L3.84027 5.20507L5.83184 5.4426C6.27228 5.49513 6.69468 5.25125 6.86941 4.84356ZM8.00003 9C8.55232 9 9.00003 8.55228 9.00003 8C9.00003 7.44772 8.55232 7 8.00003 7C7.44775 7 7.00003 7.44772 7.00003 8C7.00003 8.55228 7.44775 9 8.00003 9Z" fill="currentColor"></path></svg>
                    </button>
                </li>
            {/each}
            {/if}
        {:else}
            {#each group.pages as page (page.pageId)}
                <li on:click={() => {selectPage(page.pageId)}} class="cms-line" class:selected={$pages.pages[$pages.selectedPageIndex].pageId === page.pageId}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 3C3 2.44772 3.44772 2 4 2H8.70711L13 6.29289V13C13 13.5523 12.5523 14 12 14H4C3.44772 14 3 13.5523 3 13V3ZM8.29289 3H4V13H12V6.70711L8.29289 3Z" fill="currentColor"></path></svg>

                    <p>{page.pageName}</p>

                    <button on:click={() => dispatch('settingsIdChanged', {id: page.pageId})}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.30394 4.13401L5.95027 4.44964L7.00014 2H9.00011L10.05 4.44964L12.6962 4.13404L13.6962 5.86607L12.0997 8.00003L13.6962 10.134L12.6962 11.866L10.0499 11.5504L9.00014 14H7.00014L5.95031 11.5504L3.30397 11.8661L2.30397 10.134L3.90045 8.00004L2.30396 5.86604L3.30394 4.13401ZM6.86941 4.84356L7.65953 3H8.34071L9.13081 4.84356C9.30553 5.25125 9.72794 5.49513 10.1684 5.4426L12.1599 5.20509L12.5005 5.79501L11.299 7.40098C11.0333 7.75615 11.0333 8.24391 11.299 8.59907L12.5005 10.205L12.1599 10.795L10.1683 10.5575C9.72791 10.5049 9.3055 10.7488 9.13078 11.1565L8.34074 13H7.65953L6.86945 11.1565C6.69472 10.7488 6.27231 10.505 5.83188 10.5575L3.8403 10.795L3.49969 10.2051L4.70117 8.59907C4.96687 8.24391 4.96687 7.75616 4.70117 7.401L3.49968 5.79499L3.84027 5.20507L5.83184 5.4426C6.27228 5.49513 6.69468 5.25125 6.86941 4.84356ZM8.00003 9C8.55232 9 9.00003 8.55228 9.00003 8C9.00003 7.44772 8.55232 7 8.00003 7C7.44775 7 7.00003 7.44772 7.00003 8C7.00003 8.55228 7.44775 9 8.00003 9Z" fill="currentColor"></path></svg>
                    </button>
                </li>
            {/each}
        {/if}
    {/each}
</ul>

<style>
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .cms-line button {
        position: absolute;
        right: .8rem;

        color: #fff;

        opacity: 0;
    }

    .cms-line.selected button,
    .cms-line:hover button {
        opacity: 1;
    }
</style>

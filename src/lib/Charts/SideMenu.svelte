<script>
    export let showMenu
    export let sideMenu
    export let handleSideMenuAction
    export let handleMenuClick
    export let style


    let showChildren = false
    let childrenArray = []

    const handleSideMenuClick = (item) => {
        if(item.children){
            showChildren = true
            childrenArray = Object.values(item.children)
            return
        }
        showChildren = false
        handleSideMenuAction(item)
    }

    // const showChildren
</script>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
{#if showMenu}
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" on:click={() => handleMenuClick() }>
        <path d="M13.3322 2.66681L2.66553 13.3335" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13.3322 2.66681L2.66553 13.3335" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2.66553 2.66681L13.3322 13.3335" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2.66553 2.66681L13.3322 13.3335" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <div class="side-menu" {style}>
        {#if showChildren}
            <div class="side-menu-items return" on:click={() => showChildren = false}>
                <svg  width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.25 7.5L4.75 4L1.25 0.5" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span> Return </span>
            </div>
            {#each childrenArray as item}
                <div class="side-menu-items" on:click={() => handleSideMenuClick(item)}>
                    {@html item.icon}
                    <span>{item.text}</span>
                </div>
            {/each}
        {:else}
            {#each sideMenu as item}
                <div class="side-menu-items" on:click={() => handleSideMenuClick(item)}>
                    {@html item.icon}
                    <span>{item.text}</span>
                    {#if item.children}
                        <svg class="children-icon" width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.25 7.5L4.75 4L1.25 0.5" stroke="#6D6D6E" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    {/if}
                </div>
            {/each}
        {/if}
    </div>                        
{:else}
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" on:click={() => handleMenuClick()}>
        <path d="M8.0026 8.66683C8.37079 8.66683 8.66927 8.36835 8.66927 8.00016C8.66927 7.63197 8.37079 7.3335 8.0026 7.3335C7.63441 7.3335 7.33594 7.63197 7.33594 8.00016C7.33594 8.36835 7.63441 8.66683 8.0026 8.66683Z" stroke="#88888A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.0026 8.66683C8.37079 8.66683 8.66927 8.36835 8.66927 8.00016C8.66927 7.63197 8.37079 7.3335 8.0026 7.3335C7.63441 7.3335 7.33594 7.63197 7.33594 8.00016C7.33594 8.36835 7.63441 8.66683 8.0026 8.66683Z" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.0026 3.99984C8.37079 3.99984 8.66927 3.70136 8.66927 3.33317C8.66927 2.96498 8.37079 2.6665 8.0026 2.6665C7.63441 2.6665 7.33594 2.96498 7.33594 3.33317C7.33594 3.70136 7.63441 3.99984 8.0026 3.99984Z" stroke="#88888A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.0026 3.99984C8.37079 3.99984 8.66927 3.70136 8.66927 3.33317C8.66927 2.96498 8.37079 2.6665 8.0026 2.6665C7.63441 2.6665 7.33594 2.96498 7.33594 3.33317C7.33594 3.70136 7.63441 3.99984 8.0026 3.99984Z" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.0026 13.3333C8.37079 13.3333 8.66927 13.0349 8.66927 12.6667C8.66927 12.2985 8.37079 12 8.0026 12C7.63441 12 7.33594 12.2985 7.33594 12.6667C7.33594 13.0349 7.63441 13.3333 8.0026 13.3333Z" stroke="#88888A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.0026 13.3333C8.37079 13.3333 8.66927 13.0349 8.66927 12.6667C8.66927 12.2985 8.37079 12 8.0026 12C7.63441 12 7.33594 12.2985 7.33594 12.6667C7.33594 13.0349 7.63441 13.3333 8.0026 13.3333Z" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
{/if}

<style>
    .return {
        color: #6D6D6E;
        font-weight: 600 !important;
    }
    .return svg{
        transform: rotate(180deg);
    }
    .children-icon{
        margin-left: 1.5rem;
    }
    .side-menu{
        position: absolute;
        width: 138px;
        height: 300px;
        right: 0rem;
        top: 22px;
        z-index: 7;
        border: 1px solid #212830;
        height: auto;
        max-width: 200px;
        width: auto;
        border-radius: 0.5rem;

    }
    .side-menu-items:first-child{
        padding-top: 12px;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
    }
    .side-menu-items:last-child{
        padding-bottom: 12px;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
    }
    .side-menu-items {
        display: flex;
        gap: 8px;
        font-size: 12px;
        background: #060B13;
        align-items: center;
        padding: 12px 8px;
        font-weight: 100;
        transition: all 0.5s ease;
    }
    .side-menu-items span{
        text-transform: capitalize;
    }
    .side-menu-items:hover{
        background: #1a1f26;
        transition: all 0.5s ease;
    } 
</style>
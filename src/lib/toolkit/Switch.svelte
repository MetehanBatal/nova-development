<script>
    export let options;
    export let selectedIndex;
    export let gap;

    gap = gap || 1.2;

    // let wIcon = options.some((option) => option.icon && option.icon.length > 0);
    // let wTitle = options.some((option) => option.name && option.name.length > 0);
</script>

<div class="switch-box" style={`gap: ${gap}rem`}>
    {#each options as option, _index}
        <div class={`switch-option ${option.name?.length > 0 ? '' : 'wIcon'}`} class:active={_index === selectedIndex} on:click={() => {selectedIndex = _index}}>
            {#if option.icon && option.icon.length > 0}
            {@html option.icon}
            {/if}

            {#if option.name && option.name.length > 0}
            <p>{option.name}</p>
            {/if}
        </div>
    {/each}
</div>

<style>
    .switch-box {
        display: grid;
        grid-auto-flow: column;
        
        padding: .6rem;
        
        border: .1rem solid var(--color-dark);
        border-radius: .8rem;
    }

    .switch-option {
        display: flex;
        justify-content: center;
        align-items: center;
        
        border-radius: .4rem;
        background-color: transparent;
        
        transition: background-color .24s ease-in-out;
        
        cursor: pointer;
    }

    .switch-option.wIcon {
        width: 100%;
        height: 3.2rem;
    }

    .switch-option p {
        font-size: 1.2rem;
        padding: .2rem .4rem;
    }

    .switch-option.active {
        background-color: var(--color-dark);
    }
</style>
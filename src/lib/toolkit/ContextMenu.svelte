<script>
    export let options;
    export let posX;
    export let posY;
</script>

<div class="context-menu" style={`transform: translate3d(calc(${posX}px - 100% + 34px), ${posY + 8}px, 0)`}>
    {#each options as option, _index}
    <div class="context-menu-item" on:click={() => option.action()}>
        {#if option.icon}
        {@html option.icon}
        {/if}

        <p>{option.name}</p>
    </div>
    {/each}
</div>

<style>
    .context-menu {
        position: absolute;
        top: 0;
        left: 0;

        padding: .8rem 0;

        background-color: #060B13;
        border: .1rem solid #212830;
        border-radius: .4rem;

        z-index: 9;
    }

    .context-menu-item {
        display: flex;
        gap: .8rem;
        align-items: center;

        padding: .8rem 1.2rem;

        cursor: pointer;
    }

    :global(.context-menu-item svg){
        color: #6D6D6E;
    }

    :global(.context-menu-item:hover svg) {
        color: #fff;
    }

    .context-menu-item:hover {
        background-color: #212830;
    }


</style>
<script>
    import { selectedInstance } from "../../../stores/cms/selectedInstance";
    import { alterAttribute, deleteAttribute } from "../../../stores/cms/functions";

    let dropdownExpanded = false;
    let selectionChangeInProgress = false;
    let popoverDetails = {
        y: null
    }

    let attributes = [];

    function getProperties() {
        selectionChangeInProgress = true;
        
        setTimeout(() => {
            attributes = $selectedInstance.attributes.filter((attr) => attr.name !== 'id' && attr.name !== 'class' && attr.name !== 'src');
            selectionChangeInProgress = false;
        }, 120);
    }

    function triggerMenu(event, name, value) {
        if (event.target.closest('.attr-deleter')) {
            return; }

        popoverDetails = {
            y: event.target.offsetHeight + event.target.offsetTop,
            name,
            value
        };
    }

    $: $selectedInstance.instanceId, getProperties();
    $: $selectedInstance.attributes, getProperties();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="styling-group">
    <div class="header" on:click={() => { dropdownExpanded = !dropdownExpanded }}>
        <h4>Custom Attributes</h4>
        
        <button on:click={(e) => triggerMenu(e, '', '')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.53125 7.53125V2H8.46875V7.53125H14V8.46875H8.46875V14H7.53125V8.46875H2V7.53125H7.53125Z" />
            </svg>
        </button>
    </div>

    <ul class="attributes-list">
        {#each attributes as {name, value}}
        <li on:click={(e) => triggerMenu(e, name, value)}>
            <p>{name}="{value}"</p>

            <button class="attr-deleter" on:click={() => deleteAttribute(name)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 2C6.44772 2 6 2.44772 6 3V4H3V5H4V11.5C4 12.3284 4.67157 13 5.5 13H11.5C12.3284 13 13 12.3284 13 11.5V5H14V4H11V3C11 2.44772 10.5523 2 10 2H7ZM10 4V3H7V4H10ZM5 11.5V5H12V11.5C12 11.7761 11.7761 12 11.5 12H5.5C5.22386 12 5 11.7761 5 11.5Z" fill="currentColor"></path></svg>
            </button>
        </li>
        {/each}
    </ul>

    {#if popoverDetails.y !== null}
        <div class="popover" style={`transform: translate3d(0, ${popoverDetails.y}px, 0);`}>
            <div class="popover-block">
                <p>Name</p>

                <div>
                    <input type="text" bind:value={popoverDetails.name}>
                </div>
            </div>

            <div class="popover-block">
                <p>Value</p>

                <div>
                    <input type="text" bind:value={popoverDetails.value}>
                </div>
            </div>

            <button class="secondary-button" on:click={() => {alterAttribute(popoverDetails.name, popoverDetails.value); popoverDetails.y = null}}>
                <p>Save</p>
            </button>
        </div>
    {/if}
</div>

<style>
    .styling-group {
        position: relative;
    }

    .header button,
    li button {
        display: flex;
        justify-content: center;
        align-items: center;
        
        width: 3.2rem;
        height: 3.2rem;
        
        border-radius: .4rem;
        color: #e3e3e3;
        
        cursor: pointer;
    }

    .attributes-list {
        display: flex;
        flex-direction: column;
        gap: .8rem;
    }

    .attributes-list li {
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: .8rem;
        border: .1rem solid #2e2e2e;
        border-radius: .4rem;
    }

    li p {
        font-size: 1.2rem;
    }

    li button {
        height: auto;

        opacity: 0;
        visibility: hidden;

        transition: all .32s ease-in-out;
    }

    li:hover button {
        opacity: 1;
        visibility: visible;
    }

    .popover {
        display: flex;
        flex-direction: column;
        gap: .6rem;

        position: absolute;
        top: 0;
        right: 0;
        
        background: #060b13;
        border: .1rem solid #2e2e2e;
        border-radius: .8rem;

        padding: 1.2rem;
        
        z-index: 9;
    }

    .popover-block {
        display: grid;
        align-items: center;
        grid-template-columns: 4.8rem 1fr;
        
        gap: .4rem;
        
        padding: .8rem 0;
    }

    .secondary-button {
        margin-left: auto;

        padding: .8rem 1.2rem;

        color: #fff;

        border: .1rem solid #2e2e2e;
        border-radius: .6rem;
    }
</style>
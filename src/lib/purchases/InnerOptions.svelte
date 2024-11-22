<script>
    export let selectedCategory; 
    export let selectedOptions;

    export let searchCategoryTerm;
</script>


{#each selectedOptions as option}
    {#if option.label.toLowerCase().includes(searchCategoryTerm.toLowerCase())}
        <div class="checkbox-dropdown-content">
            <label class="input-holder checkbox-holder" class:active={option.isChecked}>
                <div class="svg-wrapper">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="s-5wv8s2X7ovDs"><path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-linecap="round" stroke-linejoin="round" class="s-5wv8s2X7ovDs"></path></svg>
                </div>
                {option.label}
                <input name="checkbox" type="checkbox" bind:checked={option.isChecked}>            
            </label>
        </div>
    {/if}
{/each}


<style>
    .checkbox-dropdown-content svg {
        position: static;
        margin-right: 0;
    }

    .checkbox-dropdown-content .svg-wrapper {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 1.1rem;
        left: 1.1rem;
        border: .1rem solid  rgba(56, 60, 66, 1);
        border-radius: .4rem;

    }

    :global(.checkbox-holder.active .svg-wrapper) {
        background-color: rgba(56, 60, 66, 1);
    }

    :global(.checkbox-holder.active) {
        background-color: #1A1F26;
    }

    label {
        display: flex;
        align-items: center;
    }
</style>
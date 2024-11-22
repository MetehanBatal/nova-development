<script>
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    export let options;

    console.log('Options: ', options);
</script>

<div class="split-button-holder">
    <button on:click={() => dispatch('mainActionTriggered')}>
        <slot />
    </button>

    <!-- Dropdown icon -->
    <div>
        <svg height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" style="color: currentcolor;">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z" fill="currentColor"></path>
        </svg>
    </div>
</div>

<style>
    .split-button-holder {
        display: flex;

        border: .1rem solid #2e2e2e;
        border-radius: .6rem;

        overflow: hidden;
    }

    .split-button-holder button {
        background-color: transparent;
        color: #ededed;

        font-size: 1.4rem;
        letter-spacing: .04rem;

        padding: 1rem 2rem;

        border: 0;
        border-right: .1rem solid #2e2e2e;
        outline: none;

        cursor: pointer;
        transition: background-color .24s ease-in-out;
    }

    .split-button-holder div {
        display: flex;
        justify-content: center;
        align-items: center;

        padding: .6rem 1rem;

        cursor: pointer;
        transition: background-color .24s ease-in-out;
    }

    .split-button-holder button:hover,
    .split-button-holder div:hover {
        background-color: var(--color-dark);
    }
</style>
<script>
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    export let options;

    let dropdownOpened = false;
    let advancedOptionsRevealed = false;
    
    console.log('Options: ', options);
</script>

<div class="split-button-holder">
    <button on:click={() => dispatch('mainActionTriggered')}>
        <slot />
    </button>

    <!-- Dropdown icon -->
    <div class="split-dropdown-icon" class:active={dropdownOpened} on:click={() => { dropdownOpened = !dropdownOpened; }}>
        <svg height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" style="color: currentcolor;">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z" fill="currentColor"></path>
        </svg>
    </div>

    {#if dropdownOpened}
    <div class="publish-context-menu">
        <div class="heading">
            Choose publish destination
        </div>

        <div class="environment-box">
            <p class="environment-title">Staging</p>

            <div class="domain-item">
                <input type="checkbox" checked>

                <div class="domain-details">
                    <div>
                        <p>miracle.nova.io</p>

                        <a href="https://miracle-rebuild.vercel.app/">
                            <svg data-wf-icon="TabNewIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.2929 5L6.00004 5V4H12L12 10L11 10V5.70711L5.35359 11.3536L4.64648 10.6464L10.2929 5Z" fill="currentColor"></path></svg>
                        </a>
                    </div>

                    <p class="last-publish-time">Published 1 hour ago.</p>
                </div>
            </div>
        </div>

        <div class="environment-box">
            <p class="environment-title">Production</p>

            <div class="domain-item">
                <p>No production domain found.</p>
            </div>
        </div>

        <div class="advanced-options-opener" on:click={() => {advancedOptionsRevealed = !advancedOptionsRevealed}}>
            <p>Advanced Options</p>

            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.00002 9.29293L10.6465 6.64648L11.3536 7.35359L8.00002 10.7071L4.64647 7.35359L5.35358 6.64648L8.00002 9.29293Z" fill="currentColor"></path></svg>
        </div>

        {#if advancedOptionsRevealed}
        <div class="advanced-options">
            <div>
                <input type="checkbox" checked>
                <p>Enable SSL</p>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 4C6.67157 4 6 4.67157 6 5.5V6H7V5.5C7 5.22386 7.22386 5 7.5 5H9.32578C9.75296 5 9.98341 5.50106 9.70541 5.8254L8.36111 7.39374C8.12809 7.6656 8 8.01186 8 8.36992V9H9V8.36992C9 8.25057 9.0427 8.13515 9.12037 8.04453L10.4647 6.47619C11.2987 5.50318 10.6073 4 9.32578 4H7.5Z" fill="currentColor"></path><path d="M8.5 11.25C8.91421 11.25 9.25 10.9142 9.25 10.5C9.25 10.0858 8.91421 9.75 8.5 9.75C8.08579 9.75 7.75 10.0858 7.75 10.5C7.75 10.9142 8.08579 11.25 8.5 11.25Z" fill="currentColor"></path><path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M8.5 2C5.46243 2 3 4.46243 3 7.5C3 10.5376 5.46243 13 8.5 13C11.5376 13 14 10.5376 14 7.5C14 4.46243 11.5376 2 8.5 2ZM2 7.5C2 3.91015 4.91015 1 8.5 1C12.0899 1 15 3.91015 15 7.5C15 11.0899 12.0899 14 8.5 14C4.91015 14 2 11.0899 2 7.5Z" fill="currentColor"></path></svg>
            </div>

            <div>
                <input type="checkbox" checked>
                <p>Minify HTML</p>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 4C6.67157 4 6 4.67157 6 5.5V6H7V5.5C7 5.22386 7.22386 5 7.5 5H9.32578C9.75296 5 9.98341 5.50106 9.70541 5.8254L8.36111 7.39374C8.12809 7.6656 8 8.01186 8 8.36992V9H9V8.36992C9 8.25057 9.0427 8.13515 9.12037 8.04453L10.4647 6.47619C11.2987 5.50318 10.6073 4 9.32578 4H7.5Z" fill="currentColor"></path><path d="M8.5 11.25C8.91421 11.25 9.25 10.9142 9.25 10.5C9.25 10.0858 8.91421 9.75 8.5 9.75C8.08579 9.75 7.75 10.0858 7.75 10.5C7.75 10.9142 8.08579 11.25 8.5 11.25Z" fill="currentColor"></path><path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M8.5 2C5.46243 2 3 4.46243 3 7.5C3 10.5376 5.46243 13 8.5 13C11.5376 13 14 10.5376 14 7.5C14 4.46243 11.5376 2 8.5 2ZM2 7.5C2 3.91015 4.91015 1 8.5 1C12.0899 1 15 3.91015 15 7.5C15 11.0899 12.0899 14 8.5 14C4.91015 14 2 11.0899 2 7.5Z" fill="currentColor"></path></svg>
            </div>

            <div>
                <input type="checkbox" checked>
                <p>Minify CSS</p>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 4C6.67157 4 6 4.67157 6 5.5V6H7V5.5C7 5.22386 7.22386 5 7.5 5H9.32578C9.75296 5 9.98341 5.50106 9.70541 5.8254L8.36111 7.39374C8.12809 7.6656 8 8.01186 8 8.36992V9H9V8.36992C9 8.25057 9.0427 8.13515 9.12037 8.04453L10.4647 6.47619C11.2987 5.50318 10.6073 4 9.32578 4H7.5Z" fill="currentColor"></path><path d="M8.5 11.25C8.91421 11.25 9.25 10.9142 9.25 10.5C9.25 10.0858 8.91421 9.75 8.5 9.75C8.08579 9.75 7.75 10.0858 7.75 10.5C7.75 10.9142 8.08579 11.25 8.5 11.25Z" fill="currentColor"></path><path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M8.5 2C5.46243 2 3 4.46243 3 7.5C3 10.5376 5.46243 13 8.5 13C11.5376 13 14 10.5376 14 7.5C14 4.46243 11.5376 2 8.5 2ZM2 7.5C2 3.91015 4.91015 1 8.5 1C12.0899 1 15 3.91015 15 7.5C15 11.0899 12.0899 14 8.5 14C4.91015 14 2 11.0899 2 7.5Z" fill="currentColor"></path></svg>
            </div>

            <div>
                <input type="checkbox" checked>
                <p>Minify JS</p>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 4C6.67157 4 6 4.67157 6 5.5V6H7V5.5C7 5.22386 7.22386 5 7.5 5H9.32578C9.75296 5 9.98341 5.50106 9.70541 5.8254L8.36111 7.39374C8.12809 7.6656 8 8.01186 8 8.36992V9H9V8.36992C9 8.25057 9.0427 8.13515 9.12037 8.04453L10.4647 6.47619C11.2987 5.50318 10.6073 4 9.32578 4H7.5Z" fill="currentColor"></path><path d="M8.5 11.25C8.91421 11.25 9.25 10.9142 9.25 10.5C9.25 10.0858 8.91421 9.75 8.5 9.75C8.08579 9.75 7.75 10.0858 7.75 10.5C7.75 10.9142 8.08579 11.25 8.5 11.25Z" fill="currentColor"></path><path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M8.5 2C5.46243 2 3 4.46243 3 7.5C3 10.5376 5.46243 13 8.5 13C11.5376 13 14 10.5376 14 7.5C14 4.46243 11.5376 2 8.5 2ZM2 7.5C2 3.91015 4.91015 1 8.5 1C12.0899 1 15 3.91015 15 7.5C15 11.0899 12.0899 14 8.5 14C4.91015 14 2 11.0899 2 7.5Z" fill="currentColor"></path></svg>
            </div>

            <div>
                <input type="checkbox" checked>
                <p>Use Secure Frame Headers</p>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 4C6.67157 4 6 4.67157 6 5.5V6H7V5.5C7 5.22386 7.22386 5 7.5 5H9.32578C9.75296 5 9.98341 5.50106 9.70541 5.8254L8.36111 7.39374C8.12809 7.6656 8 8.01186 8 8.36992V9H9V8.36992C9 8.25057 9.0427 8.13515 9.12037 8.04453L10.4647 6.47619C11.2987 5.50318 10.6073 4 9.32578 4H7.5Z" fill="currentColor"></path><path d="M8.5 11.25C8.91421 11.25 9.25 10.9142 9.25 10.5C9.25 10.0858 8.91421 9.75 8.5 9.75C8.08579 9.75 7.75 10.0858 7.75 10.5C7.75 10.9142 8.08579 11.25 8.5 11.25Z" fill="currentColor"></path><path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M8.5 2C5.46243 2 3 4.46243 3 7.5C3 10.5376 5.46243 13 8.5 13C11.5376 13 14 10.5376 14 7.5C14 4.46243 11.5376 2 8.5 2ZM2 7.5C2 3.91015 4.91015 1 8.5 1C12.0899 1 15 3.91015 15 7.5C15 11.0899 12.0899 14 8.5 14C4.91015 14 2 11.0899 2 7.5Z" fill="currentColor"></path></svg>
            </div>
        </div>
        {/if}
    </div>
    {/if}
</div>

<style>
    .publish-context-menu {
        position: absolute;
        top: 4.2rem;
        right: 0;
        
        min-width: 32rem;
        padding: .8rem 0;
        
        background-color: #060B13!important;
        border: .1rem solid #212830;
        border-radius: .4rem;
        
        z-index: 9;
    }

    .environment-box {
        display: flex;
        flex-direction: column;

        padding: .8rem 1rem;
        
        border-bottom: .1rem solid #2e2e2e;
    }

    .domain-item {
        display: flex;
        align-items: flex-start;
        gap: .8rem;
    }

    .domain-details {
        display: flex;
        flex-direction: column;
        gap: .6rem;
    }
    
    .domain-details div {
        display: flex;
        gap: .4rem;
    }

    .last-publish-time {
        font-size: 1.2rem;
        color: #79e09c;
    }

    .environment-title {
        font-size: 1.4rem;

        margin-bottom: .8rem;
    }

    input[type="checkbox"] {
        width: 1.4rem;
        
        margin-top: .1rem;
    }

    .heading {
        padding: 0 1rem .8rem 1rem;
        font-size: 1.4rem;
        border-bottom: .1rem solid #2e2e2e;
    }

    .advanced-options-opener {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: .6rem;

        padding: .8rem;

        border-bottom: .1rem solid #2e2e2e;

        cursor: pointer;
    }

    .advanced-options {
        display: flex;
        flex-direction: column;
        gap: .6rem;

        padding: 1rem;
    }

    .advanced-options div {
        display: flex;
        align-items: center;
        gap: .6rem;
    }



    .split-button-holder {
        display: flex;

        position: relative;

        border: .1rem solid #2e2e2e;
        border-radius: .6rem;
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

    .split-button-holder .split-dropdown-icon {
        display: flex;
        justify-content: center;
        align-items: center;

        padding: .6rem 1rem;

        cursor: pointer;
        transition: background-color .24s ease-in-out;
    }

    .split-button-holder button:hover,
    .split-button-holder .split-dropdown-icon:hover,
    .split-button-holder .split-dropdown-icon.active {
        background-color: var(--color-dark);
    }
</style>
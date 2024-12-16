<script>
    import { selectedInstance } from "../../../stores/cms/selectedInstance";

    import HeadingOptions from '$lib/cms/options/HeadingOptions.svelte';
    import ImageOptions from '$lib/cms/options/ImageOptions.svelte';
    import LinkOptions from '$lib/cms/options/LinkOptions.svelte';
    import ParagraphOptions from '$lib/cms/options/ParagraphOptions.svelte';

    let dropdownOpened = false;

    const settingsOptions = [
        {
            tags: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
            component: HeadingOptions
        },
        {
            tags: ['P', 'SPAN', 'LABEL'],
            component: ParagraphOptions
        },
        {
            tags: ['A'],
            component: LinkOptions
        },
        {
            tags: ['IMG', 'VIDEO'],
            component: ImageOptions
        }
    ];
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if $selectedInstance.instanceId.length > 0 && settingsOptions.some((o) => o.tags.includes($selectedInstance.nodeName))}
    <div class="styling-group">
        <div class="header">
            <p>{$selectedInstance.nodeName} Settings</p>

            <button on:click={() => dropdownOpened = !dropdownOpened}>
                <svg style={`transform: rotate(${dropdownOpened ? 0 : -90}deg)`} height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z" fill="currentColor"></path></svg>
            </button>
        </div>

        {#if dropdownOpened}
        <div class="settings-block-settings">
            <svelte:component this={settingsOptions.find((o) => o.tags.includes($selectedInstance.nodeName)).component} />
        </div>
        {/if}
    </div> 
{/if}

<style>
    button {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 3.2rem;
        height: 3.2rem;

        margin-left: auto;

        border-radius: .4rem;

        color: #e3e3e3;

        cursor: pointer;
    }
</style>
<script>
    import { selectedInstance } from "$stores/cms/selectedInstance";
    import Switch from "$lib/toolkit/Switch.svelte";

    let tagTypes =  [
        {            
            value : "url",
            index : 0,
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.14643 4.14667C9.17012 3.12298 10.8298 3.12298 11.8535 4.14667C12.8772 5.17036 12.8772 6.83009 11.8535 7.85378L10.8535 8.85378L10.1464 8.14667L11.1464 7.14667C11.7796 6.51351 11.7796 5.48695 11.1464 4.85378C10.5133 4.22062 9.4867 4.22061 8.85354 4.85378L7.85354 5.85378L7.14643 5.14667L8.14643 4.14667Z" fill="currentColor"></path><path d="M5.85354 7.85378L4.85354 8.85378C4.22037 9.48695 4.22037 10.5135 4.85354 11.1467C5.4867 11.7798 6.51326 11.7798 7.14643 11.1467L8.14643 10.1467L8.85354 10.8538L7.85353 11.8538C6.82984 12.8775 5.17012 12.8775 4.14643 11.8538C3.12274 10.8301 3.12274 9.17036 4.14643 8.14667L5.14643 7.14667L5.85354 7.85378Z" fill="currentColor"></path><path d="M6.85354 9.85378L9.85354 6.85378L9.14643 6.14667L6.14643 9.14667L6.85354 9.85378Z" fill="currentColor"></path></svg>`
        },
        {            
            value : "page",
            index : 1,
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 3C3 2.44772 3.44772 2 4 2H8.70711L13 6.29289V13C13 13.5523 12.5523 14 12 14H4C3.44772 14 3 13.5523 3 13V3ZM8.29289 3H4V13H12V6.70711L8.29289 3Z" fill="currentColor"></path></svg>`
        },
        {            
            value : "section",
            index : 2,
            icon : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3C3 2.44772 3.44772 2 4 2H8.70711L13 6.29289V13C13 13.5523 12.5523 14 12 14H4C3.44772 14 3 13.5523 3 13V11H4V13H12V6.70711L8.29289 3H4V6H3V3Z" fill="currentColor"></path><path d="M6.64645 6.35355L8.29289 8H3V9H8.29289L6.64645 10.6464L7.35355 11.3536L10.2071 8.5L7.35355 5.64645L6.64645 6.35355Z" fill="currentColor"></path></svg>`
        },
        {            
            value : "email",
            index : 3,
            icon : `<svg data-wf-icon="EmailIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 3C2.44772 3 2 3.44772 2 4V12C2 12.5523 2.44771 13 3 13H13C13.5523 13 14 12.5523 14 12V4C14 3.44772 13.5523 3 13 3H3ZM12.2929 4H3.70711L8 8.29289L12.2929 4ZM3 4.70711V12H13V4.70711L8.70711 9C8.31658 9.39052 7.68342 9.39052 7.29289 9L3 4.70711Z" fill="currentColor"></path></svg>`
        },
        {            
            value : "phone",
            index : 4,
            icon : `<svg data-wf-icon="PhoneIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.85349 3.14645C4.65823 2.95118 4.34165 2.95118 4.14639 3.14645L3.5606 3.73223C2.58429 4.70854 2.58429 6.29146 3.5606 7.26777L8.73218 12.4393C9.70849 13.4157 11.2914 13.4156 12.2677 12.4393L12.8535 11.8536C13.0488 11.6583 13.0488 11.3417 12.8535 11.1464L10.8535 9.14645C10.6582 8.95118 10.3417 8.95118 10.1464 9.14645L8.49994 10.7929L5.20705 7.5L6.8535 5.85355C7.04876 5.65829 7.04876 5.34171 6.8535 5.14645L4.85349 3.14645Z" fill="currentColor"></path></svg>`
        }
    ];

    let selectedTagTypeIndex = 0;
</script>

<div class="switch-box-link">
    <Switch options={tagTypes} bind:selectedIndex={selectedTagTypeIndex} gap="0" />
</div>
{#if selectedTagTypeIndex === 0}
    <div>
        <p>URL</p>
        <input type="text" name="text" bind:value={$selectedInstance.attributes["href"]} />
    </div>
{/if}
{#if selectedTagTypeIndex === 1}
    <div>
        <p>Page</p>
        <input type="text" name="text" bind:value={$selectedInstance.attributes["href"]} />
    </div>
{/if}
{#if selectedTagTypeIndex === 2}
    <div>
        <p>Section</p>
        <input type="text" name="text" placeholder="#" bind:value={$selectedInstance.attributes["href"]} />
    </div>
{/if}
{#if selectedTagTypeIndex === 3}
    <div>
        <p>Email</p>
        <input type="text" name="text" placeholder="e.g something@gmail.com" bind:value={$selectedInstance.attributes["href"]} />
    </div>
{/if}
{#if selectedTagTypeIndex === 4}
    <div>
        <p>Phone</p>
        <input type="text" name="text" placeholder="e.g +1414290000" bind:value={$selectedInstance.attributes["href"]} />
    </div>
{/if}
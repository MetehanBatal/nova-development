<script>
    import { alterTagName, alterContent } from '../../../stores/cms/functions';
    import { selectedInstance } from "../../../stores/cms/selectedInstance";

    import { onMount } from "svelte";
    import Switch from "$lib/toolkit/Switch.svelte";

    let selectionChangeInProgress = false;
    let initialized = false;

    onMount(() => {
        initialized = true;
    });
    
    let tagOptions = [
        {
            name : 'H1',
            value: 'H1'
        },
        {
            name : 'H2',
            value: 'H2'
        },
        {
            name : 'H3',
            value: 'H3'
        },
        {
            name : 'H4',
            value: 'H4'
        },
        {
            name : 'H5',
            value: 'H5'
        },
        {
            name : 'H6',
            value: 'H6'
        }
    ];
    let selectedTagIndex = 0;
    let content = '';

    function getProperties() {
        selectionChangeInProgress = true;
        
        setTimeout(() =>{
            selectedTagIndex = tagOptions.findIndex((opt) => opt.value === $selectedInstance.nodeName);
            content = $selectedInstance.content || '';
            
            selectionChangeInProgress = false;
        }, 120);
    }

    function handleTagChange() {
        if (initialized && !selectionChangeInProgress) {
            alterTagName($selectedInstance.instanceId, tagOptions[selectedTagIndex].value);
        }
    }

    $: $selectedInstance.instanceId, getProperties();
    $: selectedTagIndex, handleTagChange();
</script>

<div>
    <p>Tag</p>
    
    <Switch options={tagOptions} bind:selectedIndex={selectedTagIndex} gap="0" />
</div>

<div>
    <p>Text</p>

    <input type="text" name="text" bind:value={content} on:blur={(e) => { alterContent(e.target.value) }} />
</div>
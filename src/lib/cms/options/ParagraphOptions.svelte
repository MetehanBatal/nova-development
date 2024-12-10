<script>
    import { alterContent } from "$stores/cms/functions";
    import { selectedInstance } from "$stores/cms/selectedInstance";
    
    let selectionChangeInProgress = false;
    let content = '';

    function getProperties() {
        selectionChangeInProgress = true;
        content = $selectedInstance.content || '';
        
        setTimeout(() =>{
            selectionChangeInProgress = false;
        }, 120);
    }

    $: $selectedInstance.instanceId, getProperties();
</script>

<div>
    <p>Text</p>
    
    <input type="text" name="text" bind:value={content} on:blur={(e) => { alterContent(e.target.value) }} />
</div>
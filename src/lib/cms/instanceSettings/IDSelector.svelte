<script>
    import { selectedInstance } from "../../../stores/cms/selectedInstance";
    import { alterAttribute } from "../../../stores/cms/functions";

    console.log($selectedInstance);

    let initialized = false;
    let selectionChangeInProgress = false;

    let idValue = '';

    function getProperties() {
        selectionChangeInProgress = true;
        
        setTimeout(() => {
            idValue = $selectedInstance.attributes.some((attr) => attr.name === 'id') ? $selectedInstance.attributes.find((attr) => attr.name === 'id').value : '';
            selectionChangeInProgress = false;
        }, 120);
    }

    $: $selectedInstance.instanceId, getProperties();
</script>

<div class="styling-group">
    <div class="options">
        <p>ID</p>
        
        <div class="switch-box">
            <input type="text" placeholder="For in-page linking" bind:value={idValue} on:blur={(e) => { alterAttribute('id', e.target.value) }}>
        </div>
    </div>
</div>
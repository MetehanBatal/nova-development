<script>
    import ElementSelector from '$lib/toolkit/ElementSelector.svelte';
    export let selectedPage;
</script>

<div class="collapse-group">
    <div class="input-holder">
        <p class="label">Event Name</p>
        
        <input type="text" bind:value={selectedPage.name}>
    </div>

    <div class="input-holder">
        <p class="label">Amount</p>
        
        <input type="number" bind:value={selectedPage.amount}>
    </div>

    <div class="input-holder">
        <p class="label">Trigger Element</p>
        
        <ElementSelector {selectedPage} />
    </div>
</div>
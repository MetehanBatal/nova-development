<script>
    export let selectedPage;

    console.log('S: ',selectedPage);
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
        <p class="label">Time Spent (in seconds)</p>

        <input type="number" bind:value={selectedPage.triggerCondition}>
    </div>
</div>
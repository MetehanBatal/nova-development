<script>

    export let innerWidth
    export let yScale
    let stroke = "#171d25"

    let ticks = [0, 25, 50, 75, 100]
    let x = -35
    let dy = "0.32em" // default

</script>
    <g>
        {#each ticks as tick}
            {#if tick != 100}
                <g class = "y-axis" transform = {`translate(0, ${yScale(tick)})`}>
                    <line x2 = {innerWidth} {stroke} />
                    <text {x} {dy} >{tick + "%"}</text>
                </g>
            {/if}
        {/each}
    </g>

<style>
    text {
        font-size: 10.5px;
        font-weight: 600;
        fill: #6d6f73
    }
</style>
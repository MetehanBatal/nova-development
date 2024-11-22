<script>

    export let innerHeight
    export let xScale
    export let xGroupVerbose

    let y = 35;
    let dy = "0.71em" // default

</script>
    <g>
        {#each xScale.domain() as tick, i}
            <g class = "x-axis" transform = {`translate(${xScale(tick)}, ${innerHeight})`}>
                <text {y} {dy} text-anchor="middle"  x = {xScale.bandwidth()/ 2}>{
                     xGroupVerbose
                       ? `${i + 1}. ${tick} view`.toUpperCase()
                        : tick == "upsell"
                        ? "PURCHASE"
                        : tick.toUpperCase()
                }</text>
            </g>
        {/each}
    </g>

<style>
    text {
        font-size: 10.5px;
        font-weight: 500;
        fill: #6d6f73
    }
</style>
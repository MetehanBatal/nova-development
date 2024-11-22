<script>
    import {timeFormat} from 'd3';

    export let innerHeight;
    export let xScale;

    let dateFormat = timeFormat("%b %d - %I %p");
    let stroke = "#3b3d42";
    let numberOfTicks = 30;
    let y2 = 10;
    let y = 20;
    let dy = "0.71em"; // default

</script>
    <g>
        {#each xScale.ticks(numberOfTicks) as tick,  i(i)}
            <g class = "x-axis" transform = {`translate(${xScale(tick)}, ${innerHeight})`}>
                <line {y2}  {stroke} />
                {#if i == 1 || i == 15 || i == numberOfTicks - 2 }
                    <text {y} {dy} text-anchor="middle" >{dateFormat(tick)}</text>
                {/if}
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
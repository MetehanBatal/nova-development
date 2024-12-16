<script>

    export let innerHeight;
    export let xScale;
    export let xGroupVerbose
    export let type
    export let hoveredIndex
    export let hoveredIndexPrev
    export let isTimeScale
    export let mainSubXscale
    export let hoveredBreakdown

    import {dateFormat} from "../../utlis"

    let stroke = "#3b3d42";
    let numberOfTicks = 30;
    let y2 = 10;
    let y = type == "multiline" ? 20 : 35
    let dy = "0.71em"; // default

    const handleTicks = (tick, i) => {
        tick = tick.length > 10
            ? (tick + "").toUpperCase().slice(0, 10) + "..."
            : (tick + "").toUpperCase() 

        if(xGroupVerbose){
            return `${i + 1}. ${tick} VIEW`
        }
        return tick
    }
</script>
    {#if type == "multiline"}
        {#if isTimeScale}
        <g>
            {#each xScale.ticks() as tick,  i(i)}
                <g class = "x-axis" transform = {`translate(${xScale(tick)}, ${innerHeight})`}>
                    <line {y2}  {stroke} />
                    {#if i == 1 || i == Math.round(((xScale.ticks().length) / 2)) - 1 || i == xScale.ticks().length - 2 }
                        <text {y} {dy} text-anchor="middle" >{dateFormat(tick)}</text>
                    {/if}
                </g>
            {/each}
        </g>
        {:else}
            {#each xScale.domain() as tick,  i(i)}
                <g class = "x-axis" transform = {`translate(${i * xScale.step()}, ${innerHeight})`}>
                    <line {y2}  {stroke} />
                    <!-- {#if i == 1 || i == ((xScale.domain().length)/2).toFixed(0) || i == xScale.domain().length - 2 } -->
                        <text {y} {dy} text-anchor="middle" >
                            {tick.length > 2 ? tick.slice(0, 2) + "..." : tick}
                        </text>
                    <!-- {/if} -->
                </g>
            {/each}
        {/if}
    {:else}
    <g>
            <g transform = {`translate(0, ${innerHeight})`}>
                {#each xScale.domain() as tick, i}
                <!-- svelte-ignore missing-declaration -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                <g
                    class = "x-axis"
                    transform = {`translate(${xScale(tick)}, ${0})`}
                    on:mouseover = {(e) => {
                        e.preventDefault()
                        hoveredIndex = i;
                        hoveredIndexPrev = -1
                        hoveredBreakdown = 1
                    }}

                    on:mouseleave = {(e) => {
                        e.preventDefault()
                        hoveredIndexPrev = hoveredIndex;
                    }}
                >
                    <text {y} {dy} text-anchor="middle"  x = {xScale.bandwidth()/ 2}>{handleTicks(tick, i)}</text>
                </g>
                {/each}

            </g>
    </g>
    {/if}
    

<style>
    text {
        font-size: 10.5px;
        font-weight: 500;
        fill: #6d6f73;
        cursor: pointer;
    }

</style>


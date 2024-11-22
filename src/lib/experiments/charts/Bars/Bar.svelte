<script>
    import {kiloConverter} from '../utlis'
    export let xScale
    export let dataFunnel
    export let yScale
    export let xGroupDepth
    export let subXScale
    export let colorScale
    export let innerHeight

    let insetHeight = 7
    let indictorFill = "#060b13"
    let indictorHeight = 35

    let bars = [
        {
            y : "pastPercentageI",
            x : 0,
            fill: 2,
            masked: "",
            class: "rect-bar-past"
        },
        {
            y : "pastPercentageI",
            x : 0,
            fill: 0,
            masked: "url(#mask)",
            class: "rect-bar-past-hashed"
        },
        {
            y : "presentPercentageI",
            x : 1,
            fill: 2,
            masked: "",
            class: "rect-bar-present"
        },
        {
            y : "pastPercentageII",
            x : 0,
            fill: 1,
            masked: "",
            class: "rect-bar-past-2"
        },
        {
            y : "pastPercentageII",
            x : 0,
            fill: 0,
            masked: "url(#mask)",
            class: "rect-bar-past-hashed-2"
        },
        {
            y : "presentPercentageII",
            x : 1,
            fill: 1,
            masked: "",
            class: "rect-bar-present-2"
        },
    ]

</script>

{#each dataFunnel as d}
    <g class="bar-group" transform={`translate(${xScale(d.name)}, 0)`}>
        {#each bars as b}
            <rect 
                class={`bar-rect ${b.class}`} 
                y= {yScale(d[b.y])} 
                x = {subXScale(xGroupDepth[b.x])}
                height={innerHeight - yScale(d[b.y]) + insetHeight} 
                rx={insetHeight}
                width={subXScale.bandwidth()} 
                fill={colorScale[b.fill]}
                mask={b.masked}
                clip-path="url(#clip)" 
            ></rect>
       {/each}

       {#each [0, 1] as i}
            <g transform = {`translate(${subXScale(xGroupDepth[i])}, ${yScale(`${i == 0 ? d.pastPercentageII : d.presentPercentageII}`) - indictorHeight/2})`}>
                <rect 
                    rx={insetHeight} 
                    height={indictorHeight}
                    width={subXScale.bandwidth() - 25 }
                    fill={indictorFill}
                    stroke = {colorScale[0]}
                    x = {25/2}
                ></rect>
                <text 
                    dy="15" 
                    x={subXScale.bandwidth()/2} 
                    text-anchor="middle"
                >
                    {
                        i == 0 
                            ? d.pastRatio + "%"
                            : d.presentRatio + "%"
                    }
                </text>
                <text 
                    class="text-small" 
                    dy="29" 
                    x={subXScale.bandwidth()/2} 
                    text-anchor="middle">
                    {
                        i == 0 
                            ? kiloConverter(d.pastValue)
                            : kiloConverter(d.presentValue)
                    }
                </text>
            </g>
       {/each}
    </g>
{/each}
<style>
    .bar-rect {
        cursor: pointer;
        clip-path: inset(0px 0px 7px 0px);
    } 

    text {
        font-size: 10.5px;
        font-weight: 400;
        fill: #eaeaea;
        font-family: 'Poppins', sans-serif !important;
    }

    .text-small{
        font-size: 10px;
        font-weight: 500;
        fill: #555;
    }
</style>

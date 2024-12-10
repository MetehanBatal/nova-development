
<script>
    export let chartsData
    export let width
    export let selectedPages
    export let experimentVariantsObjectFormat

    import ChartHeader from "./ChartHeader.svelte"
    import { pointer, rgb, scaleBand, scaleLinear } from 'd3'
    import {processDataFunc} from '$stores/functions.js'
    import Xaxis from "$lib/experiments/charts/Bars/Xaxis.svelte";
    import Yaxis from "$lib/experiments/charts/Bars/Yaxis.svelte";
    import { colors } from "$stores/colors.js";
    
    let productData = {}
    let xGroupDepth = []
    let tooltipData = {};
    let bars = [];
    let keys = [];
    let gx = [];
    let keysId = [];
    const height = 480;

    const margin = {
        top: 30,
        right: 5,
        bottom: 55,
        left: 45,
    };
    const insetHeight = 5;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const transform = `translate(${margin.left}, ${margin.top})`;
    let yMax = 100;
    let showTooltip = false;
    let x;
    let y;



    $: chartsData,  chartsData = chartsData.map((chart) => ({
				...chart,
				data: chart.data.filter((_, index) =>
					selectedPages.includes(index),
				),
			}));
    $: chartsData, chartsData.map((d, i) => {
        if(i == 0){
            gx = [];
            keysId = [];
            productData = {};
        }
        d.data.map(({pageType, value}) => {
            (/*value !=0 && */ !gx.includes(pageType)) && gx.push(pageType)
        })
        productData[d.variantId] = d.data
        keysId.push(d.variantId)
    })
    
    $: chartsData, keysId.map((id, i) => {
        if(i == 0) {
            xGroupDepth = []
            bars = []
            keys = [];
        }
        let k = id
        bars.push(
            {
                y : k + "PercentageI",
                x : i,
                fill: colors[experimentVariantsObjectFormat[k].id], //colors[id],
                masked: "",
                class: "rect-bar-" + k,
                name: k
            },
            {
                y : k + "PercentageI",
                x : i,
                fill: "rgba(0,0,0,0.4)",
                masked: "",
                class: "rect-bar-" + k,
                name: k
            },
            {
                y : k + "PercentageI",
                x : i,
                fill: "#111",
                masked: "url(#mask)",
                class: "rect-bar-" + k + "-hashed",
                name: k
            },
            {
                y : k + "PercentageII",
                x : i,
                fill: colors[experimentVariantsObjectFormat[k].id], //colors[id],
                masked: "",
                class: "rect-bar-" + k + "-2",
                name: k
            },
        )
        
        keys.push(k)
        xGroupDepth.push(id +"Percentage")
    })

    $: [xGroup, processedData] = processDataFunc(productData, keys, "value", gx);
    $: xGroup, console.log(xGroup, processedData);
    
    $: xScale = scaleBand(
        xGroup,
        [0, innerWidth]
    ).padding([0.1])
    
    $: subXScale = scaleBand(
        xGroupDepth,
        [0, xScale.bandwidth()]
    ).padding([0.1])
    
    $: yScale = scaleLinear(
        [yMax, 0],
        [0, innerHeight]
    ).nice()
    
    const handleMouseMove = (e, b, d) => {
        x = e.offsetX - 50
        y = e.offsetY
        tooltipData = {
            name: b.name.replace("-", " "),
            value: d[b.name + "Value"],
            percentage: d[b.name + "Ratio"]
        }
        showTooltip = true
    }

</script>

<div id = "experiment-dropOff">
    {#if showTooltip}
        <div class="tooltip" style= {`left: ${x}px; top:${y}px`}>
            <p>{tooltipData.name}</p>
            <p>views: {tooltipData.value} ({tooltipData.percentage}%)</p>
        </div>
    {/if}
    <ChartHeader keys = {keysId} {innerWidth}/>
    <svg {width}  {height}>
        <g {transform}>
            <Yaxis {innerWidth}  {yScale} />
            <Xaxis {xScale} {innerHeight} xGroupVerbose = {true} />
            <g>
                {#each processedData as d, i}
                    <g class="bar-group" transform={`translate(${xScale(d.name)}, 0)`}>
                        {#each bars as b}
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                        <rect 
                            class={`bar-rect ${b.class}`} 
                            y= {yScale(d[b.y])} 
                            x = {subXScale(xGroupDepth[b.x])}
                            height={innerHeight - yScale(d[b.y]) + insetHeight} 
                            rx={3}
                            width={subXScale.bandwidth()} 
                            fill={b.fill}
                            mask={b.masked}
                            clip-path="url(#clip)" 
                            on:mousemove={(e) => handleMouseMove(e, b, d)}
                            on:mouseout={() => showTooltip = false}
                        ></rect>
                        {/each}
                    </g>
                {/each}
            </g>
        </g>
      
        <defs>
            <pattern id="hashed-line" width="0.3%" height="0.3%" patternTransform="rotate(45)">
                <rect width="1" height="200" fill="white"></rect>
            </pattern>
            <mask id="mask">
                <rect width="100%" height="100%" fill="url(#hashed-line)"></rect>
            </mask>
        </defs>
    </svg>
</div>

<style>
    .bar-rect {
        cursor: pointer;
        clip-path: inset(0px 0px 5px 0px);
    }
    .tooltip{
        position: absolute;
        padding: 5px;
        background-color: #333;
        color: #fff;
        border-radius: 3px;
    }
    .tooltip p{
        font-size: 11px;
        text-align: center;
    }
</style>
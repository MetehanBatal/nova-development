<script>

    import Yaxis from '$lib/experiments/charts/Bars/Yaxis.svelte'
	import Xaxis from '$lib/experiments/charts/Bars/Xaxis.svelte'
    import Bar from '$lib/experiments/charts/Bars/Bar.svelte'
	import { scaleBand, scaleLinear } from 'd3'

	export let allDataFunnel
    export let xGroup
    export let width
    export let height
    export let barMargin
    export let colorScale
	
	let innerWidth = width - barMargin.left - barMargin.right
	let innerHeight = height - barMargin.top - barMargin.bottom
	let transform = `translate(${barMargin.left}, ${barMargin.top})`    
    let yMax = 100
    let xGroupDepth = ["pastPercentage", "presentPercentage"]

    let dataFunnel  = allDataFunnel
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

</script>
<div class="chart" id = "chart-1">
    <svg {width} {height}>
        <g {transform}>
            <Yaxis {innerWidth}  {yScale} />
            <Xaxis {xScale} {innerHeight} />
            <Bar 
                {dataFunnel}
                {xScale}
                {yScale}
                {xGroupDepth}
                {subXScale}
                {colorScale}
                {innerHeight}
            />
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
    svg, .chart {
		display: block;
		margin: 0px auto;
		background-color: #060b13;
		position: relative;
	}
</style>
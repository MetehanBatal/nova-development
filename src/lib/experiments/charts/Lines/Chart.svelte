<script>

    import Yaxis from './Yaxis.svelte'
	import Xaxis from './Xaxis.svelte'
	import Path from './Path.svelte'
	import Trends from './Trends.svelte'
	import Overlay from './Overlay.svelte'
	import Tooltip from './Tooltip.svelte'

	import { scaleTime, scaleLinear, extent, pointer, bisectLeft, bisectCenter, bisect, bisectRight, select } from 'd3'

    export let dateArray
    export let dateArrayPast
    export let currentProduct
    export let data
    export let width
    export let height
    export let margin
    export let strokeColor1
    export let strokeColor2
    export let dataProperty
    export let tooltipTitle
    export let isTooltip2
    export let dataProperty2
    export let tooltipTitle2
    export let accuracy
    
	let innerWidth = width - margin.left - margin.right
	let innerHeight = height - margin.top - margin.bottom
	let transform = `translate(${margin.left}, ${margin.top})`

	$: selected = 0
	$: isShowTrends = false

	
	// past and present data
	$: past =  Object.values(data.past[currentProduct][dataProperty]);
    $: present =  Object.values(data.present[currentProduct][dataProperty]);
    $: pastPurchases = Object.values(data.past[currentProduct]["purchases"]);
    $: presentPurchases = Object.values(data.present[currentProduct]["purchases"]);

    $: past2 =  dataProperty2 != "" && Object.values(data.past[currentProduct][dataProperty2]);
    $: present2 =  dataProperty2 != ""  && Object.values(data.present[currentProduct][dataProperty2]);
	// scales
	$: xScale = scaleTime(
			extent(dateArray),
			[0, innerWidth]
		)
		//.nice();
    
	$: yScale = scaleLinear(
            extent([
                ...past,
                ...present,
            ]),
            [innerHeight, 0]
        )
        .nice();

	function handleMousemove (event) {
		isShowTrends = true
		const [x, y] = pointer(event);
        //let offset = accuracy == "hour" ? 0 : 5
		let b = bisectCenter(dateArray, xScale.invert(x - 0));
		selected = b > dateArray.length - 1
			? dateArray.length - 1
			: b;
	}


	function handleMouseLeave (event) {
		isShowTrends = false
        console.log(select(`.trends-${dataProperty}`));
        select(`.trends-${dataProperty}`).attr('opacity', 0)
        select(`.c1-${dataProperty}`).attr('opacity', 0)
        select(`.c2-${dataProperty}`).attr('opacity', 0)
	}

</script>
<div class="chart" id = "chart-1">
    <svg {width} {height}>
        <g class= {`g-${dataProperty}`} {transform}>
            <Yaxis {innerWidth}  {yScale} {dataProperty} />
            <Xaxis {xScale} {innerHeight} />
            <Path {yScale} {xScale} {past} {present} {dateArray} {innerHeight} />
            {#if isShowTrends}
            <g class = {`g-trends-${dataProperty}`}>
                <Trends 
                    {selected}
                    {dataProperty}
                    {innerHeight} 
                    {past}
                    {width}
                    {present} 
                    {dateArray} 
                    {xScale} 
                    {yScale}
                    {strokeColor1}
                    {strokeColor2}
                />
                </g>
            {/if}
            <Overlay {innerHeight} {innerWidth}  {handleMousemove} {handleMouseLeave} />
        </g>
    </svg>
    {#if isShowTrends}
        <Tooltip 
            {tooltipTitle} 
            {strokeColor1} 
            {strokeColor2}
            {past}
            {width}
            {margin}
            {present}
            {presentPurchases}
            {pastPurchases}
            {dateArray}
            {dateArrayPast}
            {selected}
            {xScale} 
            {yScale}
            bottom = {margin.bottom}
            {isTooltip2}
            {tooltipTitle2}
            {past2}
            {present2}
        />
    {/if}
</div>
<style>
    svg, .chart {
		display: block;
		margin: 0px auto;
		background-color: #060b13;
		position: relative;
	}

	svg {
		padding-right: 2rem;
	}
</style>
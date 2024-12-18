<script>

    import Yaxis from '$lib/Charts/BarLine/components/Yaxis.svelte'
	import Xaxis from '$lib/Charts/BarLine/components/Xaxis.svelte'
	import Path from '$lib/Charts/BarLine/components/Path.svelte'
	import Trends from '$lib/Charts/BarLine/components/Trends.svelte'
	import Overlay from '$lib/Charts/BarLine/components/Overlay.svelte'
	import Tooltip from '$lib/Charts/BarLine/components/Tooltip.svelte'
    import Bars from '$lib/Charts/BarLine/components/Bars.svelte'
	import { scaleTime, scalePoint, scaleLinear, extent, pointer, bisector, scaleBand, select } from 'd3'

    export let data
    export let strokeColor1
    export let strokeColor2
    export let dataProperty
    export let headline
    export let margin
    export let hasComparison
    export let type
    export let relatedBar
    export let width
    export let height
    export let chartType
    export let isTimeScale

	let innerWidth
    let innerHeight
    let xScale
    let yScale
    let subXScale
    let hoveredIndex = -1;
    let hoveredIndexPrev = -1
    let chartDOM = {}
    let space

    let diagonalLine = 0.1

	let selected = 0
	let isShowTrends = false

    const handleXScale = () => {
        innerWidth = width - margin.left - margin.right

        let tempX
        if(type == "multiline"){
            if(isTimeScale){
                tempX = scaleTime(
                    extent(data.current, (d) => {
                        return  d.key
                    } ),
                    [0, innerWidth]
		        )
            } else {
                tempX = scalePoint(
                    data.current.map((d) => d.key),
                    [0, innerWidth]
		        )
            }
        }  else {
            tempX =  scaleBand(
                data.current.map((d, i) => {
                    if(chartType == "funnel"){
                        return `${i}. ${d.key}`
                    }
                    return d.key
                }),
                [0, innerWidth]
            ).padding([0.1])
        }
        return tempX
    }

    const handleSubXScale = () => {
        let tempX
        tempX = scaleBand(
            Object.keys(data).reverse(),
            [0, xScale.bandwidth()]
        ).padding([0.1])

        return tempX
    }
     const handleYscale = () => {
        innerHeight = height - margin.top - margin.bottom
        if(type == "multiline"){
            return hasComparison 
            ?    scaleLinear(
                    extent([
                        ...extent(data["comparison"], d => +d.value),
                        ...extent(data["current"], d => +d.value),
                    ]),
                    [innerHeight, 0]
                )
                .nice()
            :   scaleLinear(
                    extent([
                        ...extent(data["current"], d => +d.value),
                    ]),
                    [innerHeight, 0]
                )
                .nice()
        }

        return scaleLinear(
                extent([0, 100]),
                [innerHeight, 0]
            )
            .nice()
    }

    const handleMoveBarIndicator = (e, k , l) => {
        console.log({e, k, l});
    }

    const handleSpace = () => {
        if(xScale && xScale()?.step) {
            space = xScale().step - xScale().bandwidth
        }
    }

    $:data, width, xScale = handleXScale()
    $:width, subXScale = type == "dropOff" && handleSubXScale()
    $:data, width, yScale = handleYscale()
    $:handleSpace()

	function handleMousemove (event) {
        isShowTrends = true
        if(isTimeScale){
            const [x, y] = pointer(event);
            const b = bisector((d) => d.key).center(data.current, xScale.invert(x))
            selected = b > data.length - 1
                ? data.length - 1
                : b;
        } else {
            if(xScale?.step()){
                const [x, y] = pointer(event);
                selected = Math.round(x/xScale.step())
            }
        }
	}

	function handleMouseLeave (event) {
		isShowTrends = false;
        select(`.trends-${dataProperty}`).attr('opacity', 0)
        select(`.c1-${dataProperty}`).attr('opacity', 0)
        select(`.c2-${dataProperty}`).attr('opacity', 0)
	}

</script>
<div 
    class="chart cus" 
    id = "chart-1" 
    bind:this={chartDOM}
>
    <svg  {width} {height}>
        <g class= {`g-${dataProperty}`} transform = {`translate(${margin.left}, ${margin.top})`}>
            {#if (type == "multiline" && data.current.length > 1) || type == "dropOff"}
                <Yaxis {innerWidth}  {yScale} {dataProperty} {type} />
                <Xaxis {xScale} {innerHeight} xGroupVerbose = {false} {type} bind:hoveredIndex bind:hoveredIndexPrev {isTimeScale}/>
            {/if}

            {#if type == "multiline"}
                {#if data.current.length < 2}
                    <text fill = "#fff" dx = {width/2} dy = {height/2} text-anchor = "middle">Insufficient data to plot line chart</text>
                {:else}
                <Path {yScale} {xScale} {data} {innerHeight} {hasComparison} />
                    {#if isShowTrends}
                        <g class = {`g-trends-${dataProperty}`}>
                            <Trends
                                {selected}
                                {dataProperty}
                                {innerHeight}
                                {data}
                                {width}
                                {xScale}
                                {yScale}
                                {strokeColor1}
                                {strokeColor2}
                                {hasComparison}
                                {isTimeScale}
                            />
                        </g>
                    {/if}
                {/if}
                <Overlay {innerHeight} {innerWidth}  {handleMousemove} {handleMouseLeave} />
            {:else}
            <Bars
                {data}
                {xScale}
                {yScale}
                {subXScale}
                {innerHeight}
                {hasComparison}
                {type}
                {chartType}
                {relatedBar}
                {handleMoveBarIndicator}
            />
            <defs>
                <pattern id="hashed-line" width={diagonalLine + "%"} height={diagonalLine + "%"} patternTransform="rotate(45)">
                    <rect width="1" height="200" fill="white"></rect>
                </pattern>
                <mask id="mask">
                    <rect width="200%" height="200%" fill="url(#hashed-line)"></rect>
                </mask>
            </defs>

            {/if}
        </g>
    </svg>
    {#if isShowTrends && type == "multiline" && data.current.length > 1}
        <Tooltip 
            tooltipTitle = {headline}
            {strokeColor1} 
            {strokeColor2}
            {data}
            {width}
            {margin}
            {selected}
            {xScale} 
            {yScale}
            {hasComparison}
            bottom = {margin.bottom}
            {isTimeScale}
        />
    {/if}

    {#if type == "dropOff"}
        <!-- x-axis tooltip -->
        <div id="x-axis-tooltip" 
            style={`
                min-width: ${xScale.bandwidth() - (xScale.step() - xScale.bandwidth())}px;
                opacity: ${(hoveredIndex - hoveredIndexPrev) != 0  ? 1 : 0};
                transform: translate3d(${xScale(xScale.domain()[hoveredIndex]) + (2 * (xScale.step() - xScale.bandwidth()))}px, 0, 0);
                transition: all 0.5s ease;
                top: ${height}px
            `}
        >
            {(xScale.domain()[hoveredIndex] + "").toUpperCase()}
        </div>
    {/if}

</div>
<style>
    svg, .chart {
		margin: 0px auto;
		background-color: #060b13;
		position: relative;
        overflow-x: auto;
        overflow-y: hidden;
        height: max-content;
	}

    .chart::-webkit-scrollbar {
		height: .5rem;
		width: .5rem;
	}
	.chart::-webkit-scrollbar-track {
		width: 100%;
		border-radius: 3rem;

	}

	.chart::-webkit-scrollbar-thumb {
		background: #383c42;
		border-radius: 3rem;
	}

	svg {
		padding-right: 2rem;
        margin-bottom: 5rem;
	}
    #x-axis-tooltip{
        position: absolute;
        padding: .6rem .8rem;
        background: #212830;
        border-radius: .6rem;
        border: .1rem solid #383C42;
        opacity: 0;
        font-size: 1rem;
        text-align: center;
        color: #fff;
        pointer-events: none;
    }
</style>
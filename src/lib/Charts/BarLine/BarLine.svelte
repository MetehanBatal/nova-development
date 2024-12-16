<script>

    import Yaxis from '$lib/Charts/BarLine/components/Yaxis.svelte'
	import Xaxis from '$lib/Charts/BarLine/components/Xaxis.svelte'
	import Path from '$lib/Charts/BarLine/components/Path.svelte'
	import Trends from '$lib/Charts/BarLine/components/Trends.svelte'
	import Overlay from '$lib/Charts/BarLine/components/Overlay.svelte'
	import Tooltip from '$lib/Charts/BarLine/components/Tooltip.svelte'
    import Bars from '$lib/Charts/BarLine/components/Bars.svelte'
	import { scaleTime, scalePoint, scaleLinear, extent, pointer, bisector, scaleBand, select } from 'd3'
  import { colors } from '../../../stores/colors'

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
    export let extentFlat
    export let firstCurrent
    //export let firstComparison
    export let numberChecked
    export let rowHovered
    export let checked
    export let body

	let innerWidth
    let innerHeight
    let xScale
    let yScale
    let mainSubXscale
    let subXScale
    let hoveredIndex = -1;
    let hoveredIndexPrev = -1
    let hoveredBreakdown = ""
    let chartDOM = {}
    let space
    let diagonalLine = innerWidth / (10 * innerWidth)
	let selected = 0
	let isShowTrends = false


    const comparisonParentKeys = [... new Set(Object.keys(data.comparison).map((k) => k.split("_").slice(0, -1).join("_")))]
    const currentParentKeys = [... new Set(Object.keys(data.current).map((k) => k.split("_")[0]))]
    const currentParentKeys2 = [... new Set(Object.keys(data.current).map((k) => k.split("_").slice(0, -1).join("_")))]

    console.log(data, extentFlat);

    const handleXScale = () => {
        if(type == "multiline"){
            if(isTimeScale){
                xScale = scaleTime(
                    extent(data.current[firstCurrent], (d) => {
                        return  d.key
                    }),
                    [0, innerWidth]
		        )
            } else {
                xScale = scalePoint(
                    data.current[firstCurrent].map((d) => d.key),
                    [0, innerWidth]
		        )
            }

        }  else {
                let t = [];
                chartType != "funnel" ? checked.map((k) => t.push(k.name)) : t = Object.keys(data.current)

                xScale =  scaleBand(
                    data.current[firstCurrent].map((d, i) => {
                        if(chartType == "funnel"){
                            return `${i + 1}. ${d.key}`
                        }
                        return d.key
                    }),
                    [0, innerWidth]
                ).paddingInner([0.1]).align(0)

                mainSubXscale = scaleBand(
                    t,
                    [0, xScale.bandwidth()]
                ).paddingInner([0.07])

                subXScale = scaleBand(
                    ["current", "comparison"],
                    [0, mainSubXscale.bandwidth()]
                ).paddingInner([0.02])

        }
    }
     const handleYscale = () => {
        innerHeight = height - margin.top - margin.bottom
        if(type == "multiline"){
            if(numberChecked == 0){
                return scaleLinear(
                    [0, 1],
                    [innerHeight, 0]
                )
            }
            return hasComparison 
            ?    scaleLinear(
                    [0, max([
                        max(Object.values(extentFlat["comparison"]), d => (Object.keys(extentFlat["current"]).includes(d.name) && extentFlat["current"][d.name].checked) && d.max),
                        max(checked, d => d.max),
                    ])],
                    [innerHeight, 0]
                )
                .nice()
            :   scaleLinear(
                    [0, max(checked, d => d.max)],
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
    }

    const handleSpace = () => {
        if(xScale && xScale()?.step) {
            space = xScale().step - xScale().bandwidth
        }
    }

    $:width, innerWidth = width - margin.left - margin.right
    $:data, extentFlat, innerWidth, handleXScale()
    $:data, innerWidth, extentFlat, yScale = handleYscale()
    $:handleSpace()


	function handleMousemove (event) {
        
        isShowTrends = true
        if(isTimeScale){
            const [x, y] = pointer(event);
            const b = bisector((d) => d.key).center(data.current[firstCurrent], xScale.invert(x))

            selected = b
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
        checked.map((d) => {
            select(`.c1${dataProperty}${d.name.replaceAll(".", "").replaceAll(":", "")}`.replaceAll("-", "")).attr('opacity', 0)
            select(`.c2${dataProperty}${d.name.replaceAll(".", "").replaceAll(":", "")}`.replaceAll("-", "")).attr('opacity', 0)
        })
	}

</script>
<div 
    class={`chart cus ${type}`}
    id = "chart-1" 
    bind:this={chartDOM}
>
    <svg  {width} {height}>
        <g class= {`g-${dataProperty}`} transform = {`translate(${margin.left}, ${margin.top})`}>
            <!-- {#if (type == "multiline" && data.current.length > 1) || type == "dropOff"} -->
                <Yaxis {innerWidth}  {yScale} {dataProperty} {type} {margin}/>
                <Xaxis
                    {xScale}
                    {innerHeight}
                    xGroupVerbose = {false}
                    {type}
                    bind:hoveredIndex
                    bind:hoveredIndexPrev
                    {isTimeScale}
                    {mainSubXscale}
                    bind:hoveredBreakdown
                />
            <!-- {/if} -->

            {#if type == "multiline"}
                <!-- {#if data.current.length < 2}
                    <text fill = "#fff" dx = {width/2} dy = {height/2} text-anchor = "middle">Insufficient data to plot line chart</text>
                {:else} -->
                <Path
                    {yScale}
                    {xScale}
                    {data}
                    {innerHeight}
                    {hasComparison}
                    {firstCurrent}
                    {extentFlat}
                    {currentParentKeys}
                    {comparisonParentKeys}
                    {rowHovered}
                />
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
                                {firstCurrent}
                                {extentFlat}
                                {checked}
                            />
                        </g>
                    <!-- {/if} -->
                {/if}
                <Overlay {innerHeight} {innerWidth}  {handleMousemove} {handleMouseLeave} />
            {:else}
            <Bars
                {data}
                {xScale}
                {yScale}
                {subXScale}
                {mainSubXscale}
                {innerHeight}
                {hasComparison}
                {type}
                {chartType}
                {relatedBar}
                {comparisonParentKeys}
                {currentParentKeys}
                {handleMoveBarIndicator}
                {firstCurrent}
                {currentParentKeys2}
                {extentFlat}
                {rowHovered}
            />
            <defs>
                <pattern
                    id="hashed-line"
                    width={+((108 * 0.04) / mainSubXscale.bandwidth()).toFixed(3)}
                    height={+((108 * 0.04) / mainSubXscale.bandwidth()).toFixed(3)}
                    patternTransform="rotate(45)"
                >
                    <rect width="1" height="200" fill="white"></rect>
                </pattern>
                <mask id="mask">
                    <rect width={mainSubXscale.bandwidth()} height={innerHeight} fill="url(#hashed-line)"></rect>
                </mask>
            </defs>

            {/if}
        </g>
    </svg>
    {#if isShowTrends && type == "multiline"}
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
            {extentFlat}
            breakdown = {body.breakdown}
            {checked}
        />
    {/if}

    {#if type == "dropOff"}
        <!-- x-axis tooltip -->
        <div id="x-axis-tooltip" 
            style={`
                min-width: ${mainSubXscale.bandwidth() - (mainSubXscale.step() - mainSubXscale.bandwidth())}px;
                opacity: ${(hoveredIndex - hoveredIndexPrev) != 0  ? 1 : 0};
                transform: translate3d(${xScale(hoveredBreakdown) + mainSubXscale(mainSubXscale.domain()[hoveredIndex]) + (2 * (mainSubXscale.step() - mainSubXscale.bandwidth()))}px, 0, 0);
                transition: all 0.5s ease;
                top: ${height}px
            `}
        >
            {(`${hoveredBreakdown} : ${mainSubXscale.domain()[hoveredIndex]}`).toUpperCase()}
        </div>
    {/if}

</div>
<style>
    svg, .chart {
		display: block;
		background-color: #060b13;
		position: relative;
        overflow-x: auto;
        overflow-y: hidden;
        height: 100%;
        margin: 0px auto;
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

	.dropOff svg {
		/* padding-right: 2rem; */
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
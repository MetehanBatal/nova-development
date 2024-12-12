<script>
	import Insights from "$lib/dashboard/Insights.svelte";
	import Overview from "$lib/dashboard/Overview.svelte";

	import Experiments from "$lib/dashboard/Experiments.svelte";
	import PodcastStats from "$lib/dashboard/PodcastStats.svelte";
	import ChartGenerator from "$lib/Charts/ChartGenerator.svelte";
	import Chart from "$lib/Charts/Chart.svelte"

	let isModalOpened = false
	let currentData
    let dom

    sessionStorage.setItem("customCharts", JSON.stringify([]));
	const handlePlotCustomChart = () => {
		if(isModalOpened) return
		currentData  = JSON.parse(sessionStorage.getItem("customCharts"));
		dom && console.log(dom);
		setTimeout(() => {
			dom && dom.scroll({
			top: dom.scrollHeight,
			behavior: "smooth",
		});
		}, 100)
	}

	$:isModalOpened, handlePlotCustomChart()

</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div bind:this = {dom} class = {`${isModalOpened ? "card-main" : "card-show"}`}>
	<div class="charts-section">
		<div class="charts">
			<div class="chart-holder page-view">
				<!-- PAGE VIEW -->
				<!-- <Chart
					dataBody = {'{"event":"PageView","dateRange":{"from":1726708974285,"to":1727313774285},"comparisonStartTimestamp":1726104174285,"displayOptions":{"chartType":"line"},"sort":[{"field":"key","direction":"asc"}],"breakdown":[{"value":"timestamp"}],"accuracy":{"unit":"day"},"measurement":{"type":"unique"}}'}
					otherParams = {{
						"accuracy": "day",
						"daySelection": 7,
						"selectedDayIndexes": 2,
						"hasDataSync": true,
						"hasComparison": true,
						"hasRangeSelector": true,
						"showLegend": true,
						"headline": "Page View",
						"isTimeScale": true
					}}
				/> -->
			</div>
			<div class="chart-holder conversions">
				<!-- <Chart
					dataBody = {`{"event":"Purchase","dateRange":{"from":1726708974290,"to":1727313774290},"comparisonStartTimestamp":1726104174290,"valueCalculation":"(traits['Purchases'] / traits['Total Views'] * 100).toFixed(2)","traitCalculations":[{"title":"Purchases","expression":"value"}],"traits":[{"value":"sessionId","operator":"count","event":"PageView","titleOverwrite":"Total Views"},{"value":"amount","operator":"sum","event":"Purchase","titleOverwrite":"Revenue"}],"displayOptions":{"chartType":"line","dataSyncronization":true},"sort":[{"field":"key","direction":"asc"}],"breakdown":[{"value":"timestamp"}],"accuracy":{"unit":"day"},"measurement":{"type":"unique"}}`}
					otherParams = {{
						"accuracy": "day",
						"daySelection": 7,
						"selectedDayIndexes": 2,
						"hasDataSync": true,
						"hasComparison": true,
						"hasRangeSelector": true,
						"showLegend": true,
						"headline": "Purchase",
						"isTimeScale": true
					}}
				/> -->
			</div>

		</div>


		<div class="overview-holder">
			<svg xmlns="http://www.w3.org/2000/svg" width="239" height="321" viewBox="0 0 239 321" fill="none">
				<g filter="url(#filter0_f_1605_6083)">
					<ellipse cx="258" cy="122.5" rx="116" ry="56.5" fill="#AA96F3"/>
				</g>
				<defs>
					<filter id="filter0_f_1605_6083" x="0" y="-76" width="516" height="397" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
						<feFlood flood-opacity="0" result="BackgroundImageFix"/>
						<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
						<feGaussianBlur stdDeviation="71" result="effect1_foregroundBlur_1605_6083"/>
					</filter>
				</defs>
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg" width="156" height="452" viewBox="0 0 156 452" fill="none">
				<g filter="url(#filter0_f_1605_6084)">
					<ellipse cx="224.5" cy="226" rx="82.5" ry="84" fill="white" fill-opacity="0.5"/>
				</g>
				<defs>
					<filter id="filter0_f_1605_6084" x="0" y="0" width="449" height="452" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
						<feFlood flood-opacity="0" result="BackgroundImageFix"/>
						<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
						<feGaussianBlur stdDeviation="71" result="effect1_foregroundBlur_1605_6084"/>
					</filter>
				</defs>
			</svg>
			<Overview />
			
			<Insights />
		</div>

		<!-- CUSTOM CHARTS -->
		 <!-- {#each currentData as d, i}
		  	<div class="chart-holder custom-chart" style={`grid-area: ${6 + i}/1/${6 + i}/${6 + i}`}>
				<Chart
					dataBody = {d.dataBody}
					otherParams = {d.otherParams}
					width = {dom.clientWidth - 160}
				/>
			</div>
		 {/each} -->
	</div>
	<div class="chart-holder advertorial chart-holder-bottom">
		<!-- <Chart
			dataBody = {'{"event":"placeholderEventName","dateRange":{"from":1726708974294,"to":1727313774294},"comparisonStartTimestamp":1726104174294,"displayOptions":{"chartType":"funnel","dataSyncronization":true,"sort":[{"field":"conversionRate","direction":"desc"}],"steps":[{"index":0,"event":"PageView","filters":[{"filterOperator":"equals","value":"pageType","filterValue":["advertorial"],"filterType":"string"}]},{"index":1,"event":"PageView","filters":[{"filterOperator":"equals","value":"pageType","filterValue":["lander"],"filterType":"string"}]},{"index":2,"event":"PageView","filters":[{"filterOperator":"equals","value":"pageType","filterValue":["checkout"],"filterType":"string"}]},{"index":3,"event":"Purchase","filters":[]},{"index":4,"event":"PageView","filters":[{"filterOperator":"equals","value":"pageSlug","filterValue":["/up/1a"],"filterType":"string"}]},{"index":6,"event":"PageView","filters":[{"filterOperator":"equals","value":"pageSlug","filterValue":["/up/2a"],"filterType":"string"}]},{"index":7,"event":"PageView","filters":[{"filterOperator":"equals","value":"pageSlug","filterValue":["/receipt"],"filterType":"string"}]}]},"accuracy":{"unit":"day"},"measurement":{"type":"unique"}}'}
			otherParams = {{
				"accuracy": "day",
				"daySelection": 7,
				"selectedDayIndexes": 2,
				"hasDataSync": true,
				"hasComparison": true,
				"hasRangeSelector": true,
				"showLegend": false,
				"headline": "Drop Off",
				"isTimeScale": false
			}}
		/> -->
	</div>
	<!-- take rate -->
	<div class="chart-holder take-rate chart-holder-bottom">
		<!-- <Chart
			dataBody = {`{"event":"AddToCart","dateRange":{"from":1726709442090,"to":1727314242090},"comparisonStartTimestamp":1726104642090,"filters":[{"filterOperator":"equals","filterType":"string","value":"pageSlug","filterValue":["/checkout/secure"]}],"valueCalculation":"(traits['Total Purchases'] / traits['Total ATC'] * 100).toFixed(2)","traitCalculations":[{"title":"Total ATC","expression":"value"}],"traits":[{"value":"sessionId","operator":"count","event":"Purchase","titleOverwrite":"Total Purchases"},{"value":"amount","operator":"sum","event":"AddToCart","titleOverwrite":"Revenue"}],"displayOptions":{"chartType":"bar","dataSyncronization":true},"sort":[{"field":"value","direction":"desc"}],"breakdown":[{"value":"productId"}],"accuracy":{"unit":"month"},"measurement":{"type":"unique"}}`}
			otherParams = {{
				"accuracy": "day",
				"daySelection": 7,
				"selectedDayIndexes": 2,
				"hasDataSync": true,
				"hasComparison": true,
				"hasRangeSelector": true,
				"showLegend": false,
				"headline": "Take Rate",
				"isTimeScale": false
			}}
		/> -->
	</div>
	<Experiments />
	<div class="line"></div>
	<PodcastStats />

	<div class="btn-wrapper primary" on:click={ () =>  isModalOpened = true}>
		<button class="btn primary">Add a Board</button>
	</div>

	{#if isModalOpened}
		<ChartGenerator handleModalClose = {() =>  isModalOpened = false}/>
	{/if}
	
</div>


<style>
	.card-show{
		height: auto;
	}
	.custom-chart {
		padding: 3.2rem;
		border-bottom: .1rem solid #212830;
		min-height: 700px;
	}
	.btn-wrapper {
		position: relative;
		border-radius: 2rem;
		height: 200px;
		width: 300px;
		pointer-events: none;
		z-index: 0;
		display: block;
		margin: 0 auto;
	}
	
	.btn {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 2rem 0;
		font-size: 2rem;
		display: inline-flex;
		flex-direction: row;
		justify-content: center;
		background-color: #060b13;
		color: white;
		border: none;
		overflow: hidden;
		pointer-events: all;
		align-items: center;
		justify-content: center;
		z-index: 1;
		cursor: pointer;
	}
	
	.btn-wrapper::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: calc(100% + 2px);
		height: calc(100% + 2px);
		border-radius: 2rem;
		z-index: -1;
		background: linear-gradient(
			-17deg,
			rgba(255, 255, 255, 0.8) 10%,
			transparent 20%,
			transparent 30%,
			transparent 70%,
			white 100%
		);
	}
	
	.btn.primary::before {
		content: '';
		position: absolute;
		top: 45%;
		left: calc((100% - 150px) / 2);
		transform: translate(0%, 50%);
		background-color: white;
		width: 150px;
		height: 12px;
		filter: blur(30px);
		border-radius: 50%;
		z-index: 0;
	}
		.card-main{
			height: calc(10vh - 100px);
			width: 100vw;
			overflow: hidden;
		}
		.line {
			margin-block: 3.2rem;
		}
		
		.charts-section {
			/* display: grid; */
			/* grid-template-columns: 1fr 34rem;
			grid-template-rows: auto 1fr 1fr; */
			display: flex;
			width: calc(100% - 18px);
			margin-bottom: 2rem;
		}

		.charts{
			width: calc(100% - 300px);
		}
	
		.chart-holder {
			position: relative;
			padding: 3.2rem;
			border-bottom: .1rem solid #212830;
		}

		.chart-holder-bottom{
			width: calc(100% - 3.2rem + 18px);
			padding-bottom:  0px;
		}
	
		/* .chart-holder.page-view {
			grid-area: 2/1/2/2;
		}
	
		.chart-holder.conversions {
			grid-area: 3/1/3/3;
		}
	
		.chart-holder.advertorial {
			grid-area: 4/1/4/4;
		}
	
		.chart-holder.take-rate {
			grid-area: 5/1/5/5;
		}
	 */
	
		.overview-holder {
			display: none;
			flex-direction: column;
			gap: 1.6rem;
			/* grid-area: 1/2/4/2; */
			position: relative;
			width: 300px;
			padding: 4rem 2rem;
			margin-left: auto;
			background-color: #060B13;
			backdrop-filter: blur(.2rem);
			border: .1rem solid #212830;
		}
	
		.overview-holder > svg:nth-child(1) {
			position: absolute;
			content: "";
			top: 0;
			right: 0;
			fill: #AA96F3;
			filter: blur(7.1rem);
		}
	
		.overview-holder > svg:nth-child(2) {
			position: absolute;
			content: "";
			top: 14.6rem;
			right: 0;
			fill: rgba(255, 255, 255, 0.50);
			filter: blur(7.1rem);
		}
	
	
		:global(.lds-spinner.get-center) {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate3d( -50%, -50%, 0);
		}
	
	
		@media screen and (min-width: 1100px) {
			.overview-holder {
				display: flex;
			}
	
		}
	
		@media screen and (max-width: 768px) {
			.chart-holder {
				display: none;
			}
		}
	</style>
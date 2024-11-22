<script>
	import Insights from "$lib/dashboard/Insights.svelte";
	// import Overview from "$lib/dashboard/Overview.svelte";

	import Experiments from "$lib/dashboard/Experiments.svelte";
	import PodcastStats from "$lib/dashboard/PodcastStats.svelte";
	import ChartGenerator from "$lib/Charts/ChartGenerator.svelte";
	import Chart from "$lib/Charts/Chart.svelte"
</script>

<div class="charts-section">
	<div class="chart-holder page-view">
		<!-- PAGE VIEW -->
		<Chart
			headline="Page View"
			showLegend = {true}
			hasRangeSelector = {true}
			hasComparison = {true}
			dataOptions = {{
				displayOptions: {
					"chartType": "line",
				},
				event : "PageView",
				measurementType : "unique",
				accuracyUnit: "day",
				breakdownValue: [{value: "timestamp"}],
				sort: [
					{
						"field": "key",
						"direction": "asc"
					}
				]
			}}
		/>
	</div>

	<div class="chart-holder conversions">
		<Chart
			headline="Purchase"
			showLegend = {true}
			hasRangeSelector = {true}
			hasComparison = {true}
			dataOptions = {{
				displayOptions: {
					"chartType": "line",
					dataSyncronization: true,
				},
				event : "Purchase",
				measurementType : "unique",
				accuracyUnit: "day",
				breakdownValue: [{value: "timestamp"}],
				sort: [
					{
						"field": "key",
						"direction": "asc"
					}
				],
				valueCalculation: "(traits['Purchases'] / traits['Total Views'] * 100).toFixed(2)",
				traitCalculations: [
					{
						"title": "Purchases",
						"expression": "value"
					}
				],
				"traits": [
					{
						"value": "sessionId",
						"operator": "count",
						"event": "PageView",
						"titleOverwrite": "Total Views"
					},
					{
						"value": "amount",
						"operator": "sum",
						"event": "Purchase",
						"titleOverwrite": "Revenue"
					}
				],

			}}
		/>
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

		<!-- <Overview /> -->
		
		<Insights />
	</div>

	<div class="chart-holder advertorial">
		<Chart
			headline="Drop Off"
			hasRangeSelector = {true}
			hasComparison = {true}
			dataOptions = {{
				displayOptions: {
					"chartType": "funnel",
					dataSyncronization: true,
					sort: [{
						field: "conversionRate",
						direction: "desc"
					}],
					steps: [
					{
						"index": 0,
						"event": "PageView",
						"filters": [
							{
								"filterOperator": "equals",
								"value": "pageType",
								"filterValue": ["advertorial"],
								"filterType": "string"
							}
						]
					},
					{
						"index": 1,
						"event": "PageView",
						"filters": [
							{
								"filterOperator": "equals",
								"value": "pageType",
								"filterValue": ["lander"],
								"filterType": "string"
							}
						]
					},
					{
						"index": 2,
						"event": "PageView",
						"filters": [
							{
								"filterOperator": "equals",
								"value": "pageType",
								"filterValue": ["checkout"],
								"filterType": "string"
							}
						]
					},
					{
						"index": 3,
						"event": "Purchase",
						"filters": [
						]
					},
					{
						"index": 4,
						"event": "PageView",
						"filters": [
							{
								"filterOperator": "equals",
								"value": "pageSlug",
								"filterValue": ["/up/1a"],
								"filterType": "string"
							}
						]
					},
					{
						"index": 6,
						"event": "PageView",
						"filters": [
							{
								"filterOperator": "equals",
								"value": "pageSlug",
								"filterValue": ["/up/2a"],
								"filterType": "string"
							}
						]
					},
					{
						"index": 7,
						"event": "PageView",
						"filters": [
							{
								"filterOperator": "equals",
								"value": "pageSlug",
								"filterValue": ["/receipt"],
								"filterType": "string"
							}
						]
					}
				]
				},
				event : "placeholderEventName",
				measurementType : "unique",
				accuracyUnit: "day",
			}}
		/>
	</div>

	<!-- take rate -->
	<div class="chart-holder take-rate">

		<Chart
			headline="Take Rate"
			hasRangeSelector = {true}
			hasComparison = {true}
			dataOptions = {{
				displayOptions: {
					"chartType": "bar",
					dataSyncronization: true,
				},
				event : "AddToCart",
				measurementType : "unique",
				accuracyUnit: "month",
				breakdownValue: [{value: "productId"}],
				sort: [{
					field: "value",
					direction: "desc"
				}],
				filters: [{
					"filterOperator": "equals",
					"filterType": "string",
					"value": "pageSlug",
					"filterValue": ["/checkout/secure"]}],
				valueCalculation: "(traits['Total Purchases'] / traits['Total ATC'] * 100).toFixed(2)",
				traitCalculations: [
					{
						"title": "Total ATC",
						"expression": "value"
					}
				],
				traits: [
					{
						"value": "sessionId",
						"operator": "count",
						"event": "Purchase",
						"titleOverwrite": "Total Purchases"
					},
					{
						"value": "amount",
						"operator": "sum",
						"event": "AddToCart",
						"titleOverwrite": "Revenue"
					}],
			}}
		/>
	</div>
</div>

<Experiments />
	
<div class="line"></div>
	
<PodcastStats />


<div class="add-board"></div>

<ChartGenerator />


<style>
	.line {
		margin-block: 3.2rem;
	}
	
	.charts-section {
		display: grid;
		grid-template-columns: 1fr 34rem;
		grid-template-rows: auto 1fr 1fr;
		width: calc(100% - 6.4rem);
		margin-bottom: 2rem;
	}

	.chart-holder {
		position: relative;
		padding: 3.2rem;
		border-bottom: .1rem solid #212830;
	}

	.chart-holder.page-view {
		grid-area: 2/1/3/2;
	}

	.chart-holder.conversions {
		grid-area: 3/1/3/2;
	}

	.chart-holder.advertorial {
		grid-area: 4/1/4/4;
	}

	.chart-holder.take-rate {
		grid-area: 5/1/5/4;
	}


	.overview-holder {
		display: none;
		flex-direction: column;
		gap: 1.6rem;
		grid-area: 1/2/4/2;
		position: relative;
		width: fit-content;
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
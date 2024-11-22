<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let url;
	export let currentView;

	let chartLoaded = false;

	let experimentData = $page.data?.experimentRes?.data[0];

	let metric = currentView === 'all' ? 'ConversionRate' : 'AverageRevenue';
	let confidenceKey = currentView === 'all' ? 'ConfidenceOnConversion' : 'ConfidenceOnRevenue';
	let compositeKey = currentView === 'all' ? 'CompositeConversionScore' : 'CompositeRevenueScore';

	const spinner = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

	let stats = [];

	let yRange = [];
	let xRange = [];

	let chartWidth;
	let chartHeight;

	let mouseX = 200;
	let mouseY = 200;

	let hoveredPlotIndex = null;

	// Function to generate conversion rate points
	const findYRange = data => {
		const rates = data.map(d => d[metric]);
		const min = Math.floor(Math.min(...rates) * 100) / 100;
		const max = Math.ceil(Math.max(...rates) * 100) / 100;

		const points = [];
		const step = (max - min) / 6; // 6 steps to create 7 points including min and max

		for (let i = 0; i <= 6; i++) {
			points.push(parseFloat((min + i * step).toFixed(2)));
		}

		return points;
	}

	const getLinePos = value => {
		if (value < yRange[yRange.length - 1]) return 0;
		if (value > yRange[0]) return 100;

		return ((value - yRange[yRange.length - 1]) / (yRange[0] - yRange[yRange.length - 1])) * 100;
	};

	const renderChart = () => {
		metric = currentView === 'all' ? 'ConversionRate' : 'AverageRevenue';
		confidenceKey = currentView === 'all' ? 'ConfidenceOnConversion' : 'ConfidenceOnRevenue';
		compositeKey = currentView === 'all' ? 'CompositeConversionScore' : 'CompositeRevenueScore';

		stats.sort((a, b) => b[metric] - a[metric]);
		
		yRange = findYRange(stats);
		xRange = stats.map(d => d.VariantId);
	};

	onMount(async () => {
		try {
			const statReq = await fetch(url);
			const statRes = await statReq.json();

			chartLoaded = true;
			if (statRes.length > 0) {
				stats = statRes;
				
				renderChart();
			}
			
		} catch (error) {
			console.error('Error loading charts:', error);
		}
	});

	$: currentView, renderChart();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="chart-container" bind:clientWidth={chartWidth} bind:clientHeight={chartHeight} on:mousemove={(e) => {mouseX = e.clientX - e.currentTarget.getBoundingClientRect().x; mouseY = e.clientY - e.currentTarget.getBoundingClientRect().y; }}>
	<div class="chart-info">
		<p class="invisible">Report generated at: {new Date().toLocaleString()}</p>

		<h3>{metric === 'ConversionRate' ? 'Conversion Rate' : 'Average Revenue'} Statistical Analysis</h3>
		
		<p>Report generated at: {new Date().toLocaleString()}</p>
	</div>

	{#if chartLoaded}
	<!-- <img src={url} alt="Conversion Chart" /> -->
	<div class="chart" data-w={chartWidth} data-h={chartHeight}>
		<div class="y-axis" style={`left: ${(chartWidth / 32) * 2}px; width: ${(chartWidth / 32) * 2}px`}>
			{#each yRange.reverse() as yItem, _index}
			<p class="y-range-item" id={`y-range-item_${_index}`}>{currentView === 'all' ? yItem.toFixed(2) : (yItem / 100).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
			{/each}
		</div>

		<div class="x-axis" style={`left: ${(chartWidth / 32) * 4}px;`}>
			{#each xRange as xItem, _index}
			<p class="x-range-item" style={`min-width: ${(chartWidth / 32) * 2}px`} id={`x-range-item_${_index}`}>{experimentData.variants.find(v => v.id === parseInt(xItem)).name}</p>
			{/each}
		</div>

		<div class="chart-plots" style={`left: ${(chartWidth / 32) * 4}px;`}>
			{#each stats as item, _index}
			<div class="plot-box" style={`min-width: ${((chartWidth / 32) * 2)}px; ${hoveredPlotIndex !== null && hoveredPlotIndex === _index ? 'opacity: 1;' : hoveredPlotIndex !== null && hoveredPlotIndex !== _index ? 'opacity: 0.72;' : 'opacity: 1;'}`} on:mouseenter={(e) => {hoveredPlotIndex = _index}} on:mouseleave={(e) => {hoveredPlotIndex = null}}>
				{#if hoveredPlotIndex === _index}
				<div class="tooltip-box" style={`top: ${(1 - item[confidenceKey]) * 100}%;`}>
					<div class="tooltip">
						<div class="tooltip-memo">
							<p>
								<span>{metric === 'ConversionRate' ? 'Conversion Rate' : 'Average Revenue'}: </span>
								<span>{metric === 'ConversionRate' ? `${(item[metric] * 100).toFixed(2)}%` : (item[metric] / 100).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</span>
							</p>
							<p>
								<span>Confidence Score: </span>
								<span>{metric === 'ConversionRate' ? item['ConfidenceOnConversion'].toFixed(4) : item['ConfidenceOnRevenue'].toFixed(4)}</span>
							</p>
							<p>
								<span>Composite Score: </span>
								<span>{metric === 'ConversionRate' ? item['CompositeConversionScore'].toFixed(4) : item['CompositeRevenueScore'].toFixed(4)}</span>
							</p>
						</div>
					</div>

					<div class="tooltip-arrow"><div></div></div>
				</div>
				{/if}

				<div class="line" style={`
					width: ${((chartWidth / 32) * 1.5 )}px;
					bottom: ${getLinePos(item[metric])}%
				`}></div>

				<div class="chart-plot" style={`
					--composite-score: ${parseInt(item[compositeKey] * 100)};
					background: linear-gradient(180deg, hsl(var(--composite-score) 72% 59%) 0%, hsl(var(--composite-score) 30% 55%) 40%, hsl(var(--composite-score) 30% 55% / 0) 100%);
					height: ${item[confidenceKey] * 100}%;`}>
				</div>
			</div>
			{/each}
		</div>
	</div>
	{:else}
	{@html spinner}
	{/if}

  

	<div class="light"></div>

	<div class="chart-bg-box">
		<div class="chart-bg">
			<div class="noise"></div>
			
			<div class="grid-cells">
				{#each { length: 576 } as _, index}
				<div class="grid-cell"></div>
				{/each}
			</div>
		</div>

		<div class="chart-light" style={`transform: translate3d(${mouseX}px, ${mouseY}px, 0)`}></div>
	</div>
</div>

<style>
	.chart-container {
		position: relative;

		width: 100%;
		aspect-ratio: 16 / 9;

		padding: 14rem 0 4.8rem 0;
		margin-top: 2.4rem;

		border-radius: 2.4rem;
		border: .1rem solid rgba(255, 255, 255, 0.04);
		background-color: #0D121A;

		overflow: hidden;
	}

	.light {
		position: absolute;
		bottom: 0;
		left: 0;

		width: 12rem;
		height: 12rem;

		background-color: #F96F64;
		border-radius: 100%;
		filter: blur(20rem);

		transition: translate3d(calc(-100% + 2.4rem), calc(100% - 2.4rem), 0);

		z-index: 2;
	}

	.chart-light {
		/* light */
		position: absolute;
		top: 0;
		left: 0;
		
		width: 14rem;
		height: 14rem;

		background: rgba(255, 255, 255, 0.8);
		filter: blur(18rem);

		will-change: transform;
	}

	.chart-bg {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;

		z-index: 1;
	}

	.noise {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;

		width: 100%;
		height: 100%;

		background: url('/assets/images/noise.png');
		mix-blend-mode: soft-light;
		opacity: 0.16;
	}
	
	.chart {
		position: relative;

		width: 100%;
		height: 100%;

		overflow: auto;

		z-index: 3;
	}

	.y-axis {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;

		position: absolute;
		top: 0;
		left: 0;
		bottom: 3rem;
	}

	.x-axis {
		display: flex;
		/* justify-content: space-between; */
		align-items: center;

		position: absolute;
		bottom: 0;
		right: 0;
		left: 4rem;
	}

	.x-range-item {
		/* transform: rotate(-90deg); */
	}

	.x-range-item,
	.y-range-item {
		font-family: 'Inter';
		font-style: normal;
		font-weight: 500;
		font-size: 16px;
		line-height: 20px;
		/* identical to box height, or 125% */
		text-align: center;

		background: linear-gradient(90deg, rgba(255, 255, 255, 0) -42.23%, #FFFFFF 126.21%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-fill-color: transparent;
	}

	.grid-cells {
		display: grid;
		grid-template-columns: repeat(32, 1fr);
		grid-template-rows: repeat(18, 1fr);
		grid-gap: .05rem;

		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.grid-cell {
		background-color: #0D121A;
	}

	.chart-plots {
		display: flex;
		align-items: flex-end;

		position: absolute;
		top: 0;
		right: 0;
		padding-bottom: 3.2rem;

		height: 100%;
	}

	.plot-box {
		display: flex;
		align-items: flex-end;

		position: relative;

		height: 100%;

		padding: 0 .8rem;
	}

	.chart-plot {
		width: 100%;

		border-radius: 1.2rem;
	}

	.line {
		position: absolute;
		left: 50%;

		height: .2rem;

		border-radius: .2rem;

		background-color: #fff;
		/* filter: blur(.2rem); */

		transform: translate3d(-50%, .2rem, 0);
	}

	:global(.chart-container .lds-spinner) {
		top: 50%;
		left: 50%;
	
		transform: translate3d(-50%, -50%, 0);

		z-index: 99;
	}

	.tooltip-box {
		position: absolute;
		top: 0;
		left: 50%;

		width: 20rem;

		/* width: 100%; */

		padding: 1.2rem;

		border-radius: .8rem;
		border: .1rem solid rgba(255, 255, 255, 0.08);
		background-color: #060b13;

		transform: translate3d(-50%, calc(-100% - 2.4rem), 0);

		z-index: 999;
	}

	.tooltip-arrow {
		position: absolute;
		left: 50%;
		bottom: -0.8rem;

		width: 1.2rem;
		height: .8rem;

		overflow: hidden;

		transform: translate3d(-50%, 0, 0);
	}

	.tooltip-arrow div {
		width: .8rem;
		height: .8rem;
		
		background: #060b13;
		outline: .1rem solid rgba(255, 255, 255, 0.08);

		transform: translateX(.2rem) translateY(-.4rem) rotate(45deg);
	}

	.tooltip-box p {
		color: #fff;
	}

	.chart-info {
		display: flex;
		justify-content: space-between;
		align-items: center;

		position: absolute;
		top: 4.8rem;
		left: 0;
		right: 0;

		padding: 0 4.8rem;

		z-index: 9;
	}

	h3 {
		flex: 1;
		
		font-size: 2.4rem;
		text-align: center;
		
		background: linear-gradient(90deg, rgba(255, 255, 255, 0) -42%, #FFFFFF 66.21%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-fill-color: transparent;
	}

	.invisible {
		opacity: 0;
		visibility: hidden;
	}
</style>

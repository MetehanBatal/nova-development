<script>
	import { page } from '$app/stores';

	import Dropdown from '$lib/toolkit/Dropdown.svelte';

	let experimentData = $page.data.experimentsRes.data?.docs;
	let eventsData = {
		data: {},
		dropOff: {}
	};

	let c = 0;
	let selectedExperimentIndex = 0;

	let variantOptions = [];
	let selectedVariantIndexes = [0, 1];

	let fetchInProgress = true;

	let spinner = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

	console.time('fetchStart'); 
	async function fetchNewSet() {
		if (!experimentData) {
			return; }

		fetchInProgress = true;

		console.time('fetchStartI');
		const eventsReq = await fetch(`https://mve.novus.studio/prod/experiments/analytics?experimentId=${experimentData[selectedExperimentIndex].id}&route=dashboard`)
		let eventsRes = await eventsReq.json();
		eventsData = eventsRes.analytics;
		console.timeEnd('fetchStartI');

		fetchExperimentData('fetchset');
	}

	function fetchExperimentData(from) {
		// Extract keys sorted by conversion rate
		const sortedKeys = Object.keys(eventsData.data).sort((a, b) => eventsData.data[b].conversionRate - eventsData.data[a].conversionRate);

		// Sort data and dropOff based on sorted keys
		const sortedData = {};
		const sortedDropOff = {};
		sortedKeys.forEach(key => {
			sortedData[key] = eventsData.data[key];
			sortedDropOff[key] = eventsData.dropOff[key];
		});

		// Create new sorted object
		eventsData = {
			data: sortedData,
			dropOff: sortedDropOff
		};

		variantOptions = Object.keys(eventsData.data).map(id => {
			const variant = experimentData[selectedExperimentIndex].variants.find(variant => variant.id === parseInt(id));
			return variant ? { name: variant.name } : null;
		}).filter(item => item !== null);

		selectedVariantIndexes = sortedKeys.slice(0, 2);

		fetchInProgress = false;
	}

	let icons = ["/assets/icons/banner-icon-split.svg","/assets/icons/hero-icon.svg", "/assets/icons/kit-pricing.svg"]

	let options = experimentData?.map( (experiment,index) => ({ icon: icons[index], name: experiment.name, index: index }) );

	$: selectedExperimentIndex, fetchNewSet();
</script>

<div class="table-inner homepage-table">
	<div class="table-navbar">
		<div class="experiment-table">
			<div class="experiment-header">
				<p>Experiments</p>							
				{#if experimentData}
				<Dropdown options={options} bind:selectedStatusIndex={selectedExperimentIndex} position="left" />

				<a class="cta-sm" href={`/experiments/${experimentData[selectedExperimentIndex].id}`}>
					Full Statistics
				</a>
				{/if}
			</div>
		</div>
	</div>

	<div class="tables-wrapper">
		<div class="experiment-table-wrapper">	   
			<div class="table-row">
				<div class="label">
					<p>Overview</p>
				</div>
				
				<div class="variants-list">
					{#each selectedVariantIndexes as key, _index}
					<div>
						{#if !fetchInProgress}
							{#if _index === 0}
							<div class="tooltip-wrapper">
								<div class="tooltip-content">
									Best Converting Variant
								</div>
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"fill="none" class=""><path    d="M8.99609 16.5005C13.1382 16.5005 16.4961 13.1426 16.4961 9.00049C16.4961 4.85835 13.1382 1.50049 8.99609 1.50049C4.85396 1.50049 1.49609 4.85835 1.49609 9.00049C1.49609 13.1426 4.85396 16.5005 8.99609 16.5005Z"    stroke="white" stroke-opacity="0.24" stroke-linecap="round" stroke-linejoin="round"class=""></path><path d="M9 12V9" stroke="white" stroke-opacity="0.24" stroke-linecap="round" stroke-linejoin="round"class=""></path><path d="M9 6.00024H9.0075" stroke="white" stroke-opacity="0.24" stroke-linecap="round"stroke-linejoin="round" class=""></path></svg>
							</div>
							
							<span>{experimentData[selectedExperimentIndex].variants.find(variant => variant.id === parseInt(key)).name}</span>
							{:else}
							<Dropdown options={variantOptions} bind:selectedStatusIndex={selectedVariantIndexes[_index]} position="right" type="plain" from="dashboard" />
							<!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg> -->
							{/if}
						{:else}
						{@html spinner}
						{/if}
					</div>
					{/each}
				</div>
			</div>

			<div class="experiment">
				<!-- Conversion Rate -->
				<div class="table-row">
					<div class="label">
						<img src="/assets/icons/cvr.svg" alt="Conversion Rate">

						<p>Conversion Rate (%)</p>
					</div>

					<div class="variants-list">
						{#each selectedVariantIndexes as key, _index}
						<div>
							{#if !fetchInProgress}
							<span class:uptick={_index === 0}>
								{(eventsData.data[key].conversionRate * 100).toFixed(2)}%
							</span>

							<p>{eventsData.data[key].totalOrders}</p>
							{:else}
							{@html spinner}
							{/if}
						</div>
						{/each}
					</div>
				</div>

				<!-- Avg. Revenue -->
				<div class="table-row">
					<div class="label">
						<img src="/assets/icons/revenue.svg" alt="Conversion Rate">

						<p>Average Revenue</p>
					</div>

					<div class="variants-list">
						{#each selectedVariantIndexes as key, _index}
						<div>
							{#if !fetchInProgress}
							<p>{eventsData.data[key]?.averageRevenue?.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
							{:else}
							{@html spinner}
							{/if}
						</div>
						{/each}
					</div>
				</div>

				<!-- Total Revenue -->
				<div class="table-row">
					<div class="label">
						<img src="/assets/icons/total-revenue.svg" alt="Total Revenue">

						<p>Total Revenue</p>
					</div>

					<div class="variants-list">
						{#each selectedVariantIndexes as key, _index}
						<div>
							{#if !fetchInProgress}
							<p>{(eventsData.data[key].totalRevenue).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
							{:else}
							{@html spinner}
							{/if}
						</div>
						{/each}
					</div>
				</div>

				<!-- Refunds -->
				<div class="table-row">
					<div class="label">
						<img src="/assets/icons/refunds.svg" alt="Refunds">

						<p>Refunds (%)</p>
					</div>

					<div class="variants-list">
						{#each selectedVariantIndexes as key, _index}
						<div>
							{#if !fetchInProgress}
							<p>0</p>
							{:else}
							{@html spinner}
							{/if}
						</div>
						{/each}
					</div>
				</div>			
			</div>
		</div>
		<div class="experiment-table-wrapper pageviews">
			<div class="table-row">
				<div class="label">
					<p></p>
				</div>
				
				<div class="variants-list">
					{#each selectedVariantIndexes as key, _index}
					<div>
						{#if !fetchInProgress}
							{#if _index === 0}
							<div class="tooltip-wrapper">
								<div class="tooltip-content">
									Best Converting Variant
								</div>
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"fill="none" class=""><path    d="M8.99609 16.5005C13.1382 16.5005 16.4961 13.1426 16.4961 9.00049C16.4961 4.85835 13.1382 1.50049 8.99609 1.50049C4.85396 1.50049 1.49609 4.85835 1.49609 9.00049C1.49609 13.1426 4.85396 16.5005 8.99609 16.5005Z"    stroke="white" stroke-opacity="0.24" stroke-linecap="round" stroke-linejoin="round"class=""></path><path d="M9 12V9" stroke="white" stroke-opacity="0.24" stroke-linecap="round" stroke-linejoin="round"class=""></path><path d="M9 6.00024H9.0075" stroke="white" stroke-opacity="0.24" stroke-linecap="round"stroke-linejoin="round" class=""></path></svg>
							</div>
							
							<span>{experimentData[selectedExperimentIndex].variants.find(variant => variant.id === parseInt(key)).name}</span>
							{:else}
							<Dropdown options={variantOptions} bind:selectedStatusIndex={selectedVariantIndexes[_index]} position="right" type="plain" from="dashboard" />
							<!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg> -->
							{/if}
						{:else}
						{@html spinner}
						{/if}
					</div>
					{/each}
				</div>
			</div>

			<div class="experiment">
				<!-- Advertorial View -->
				<div class="table-row">
					<div class="label">
						<img src="/assets/icons/advertorial.svg" alt="Advertorial View">

						<p>Advertorial View</p>
					</div>

					<div class="variants-list">
						{#each selectedVariantIndexes as key, _index}
						<div>
							{#if !fetchInProgress}
							<p>{eventsData.dropOff[key].advertorial}</p>
							{:else}
							{@html spinner}
							{/if}
						</div>
						{/each}
					</div>
				</div>

				<!-- Lander View -->
				<div class="table-row">
					<div class="label">
						<img src="/assets/icons/lander.svg" alt="Lander View">

						<p>Lander View</p>
					</div>

					<div class="variants-list">
						{#each selectedVariantIndexes as key, _index}
						<div>
							{#if !fetchInProgress}
							<span class:uptick={ (eventsData.dropOff[key].lander / eventsData.dropOff[key].advertorial) > (eventsData.dropOff[Object.keys(eventsData.dropOff)[selectedVariantIndexes[_index === 0 ? 1 : 0]]].lander / eventsData.dropOff[Object.keys(eventsData.dropOff)[selectedVariantIndexes[_index === 0 ? 1 : 0]]].advertorial) }>
								{eventsData.dropOff[key].advertorial > 0 ? parseFloat((eventsData.dropOff[key].lander / eventsData.dropOff[key].advertorial) * 100).toFixed(2) + '%' : ''}
							</span>
							<p>{eventsData.dropOff[key].lander}</p>
							{:else}
							{@html spinner}
							{/if}
						</div>
						{/each}
					</div>
				</div>

				<!-- Checkout View -->
				<div class="table-row">
					<div class="label">
						<img src="/assets/icons/checkout.svg" alt="Checkout View">

						<p>Checkout View</p>
					</div>

					<div class="variants-list">
						{#each selectedVariantIndexes as key, _index}
						<div>
							{#if !fetchInProgress}
							{#if eventsData.dropOff[key].lander > 0}
							<span class:uptick={ (eventsData.dropOff[key].checkout / eventsData.dropOff[key].lander) > (eventsData.dropOff[Object.keys(eventsData.dropOff)[selectedVariantIndexes[_index === 0 ? 1 : 0]]].checkout / eventsData.dropOff[Object.keys(eventsData.dropOff)[selectedVariantIndexes[_index === 0 ? 1 : 0]]].lander) }>
								{parseFloat((eventsData.dropOff[key].checkout / eventsData.dropOff[key].lander) * 100).toFixed(2)}%
							</span>
							{/if}

							<p>{eventsData.dropOff[key].checkout}</p>
							{:else}
							{@html spinner}
							{/if}
						</div>
						{/each}
					</div>
				</div>

				<!-- Upsell View -->
				<div class="table-row">
					<div class="label">
						<img src="/assets/icons/upsell.svg" alt="Upsell View">

						<p>Upsell View</p>
					</div>

					<div class="variants-list">
						{#each selectedVariantIndexes as key, _index}
						<div>
							{#if !fetchInProgress}
							<span class:uptick={ (eventsData.dropOff[key].upsell / eventsData.dropOff[key].checkout) > (eventsData.dropOff[Object.keys(eventsData.dropOff)[selectedVariantIndexes[_index === 0 ? 1 : 0]]].upsell / eventsData.dropOff[Object.keys(eventsData.dropOff)[selectedVariantIndexes[_index === 0 ? 1 : 0]]].checkout) }>
								{parseFloat((eventsData.dropOff[key].upsell / eventsData.dropOff[key].checkout) * 100).toFixed(2)}%
							</span>

							<p>{eventsData.dropOff[key].upsell}</p>
							{:else}
							{@html spinner}
							{/if}
						</div>
						{/each}
					</div>
				</div>

				<!-- Receipt View -->
				<div class="table-row">
					<div class="label">
						<img src="/assets/icons/receipt.svg" alt="Receipt View">

						<p>Receipt View</p>
					</div>

					<div class="variants-list">
						{#each selectedVariantIndexes as key, _index}
						<div>
							{#if !fetchInProgress}
							{#if eventsData.dropOff[key].upsell > 0}
							<span class:uptick={ (eventsData.dropOff[key].receipt / eventsData.dropOff[key].upsell) > (eventsData.dropOff[Object.keys(eventsData.dropOff)[selectedVariantIndexes[_index === 0 ? 1 : 0]]].receipt / eventsData.dropOff[Object.keys(eventsData.dropOff)[selectedVariantIndexes[_index === 0 ? 1 : 0]]].upsell) }>
								{parseFloat((eventsData.dropOff[key].receipt / eventsData.dropOff[key].upsell) * 100).toFixed(2)}%
							</span>
							{/if}

							<p>{eventsData.dropOff[key].receipt}</p>
							{:else}
							{@html spinner}
							{/if}
						</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.table-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1.2rem;

		width: 100%;
		min-height: 5.4rem;

		padding: 1.6rem 3.2rem;

		border-bottom: .1rem solid #212830;
	}

	.experiment .table-row {
		padding: 3.2rem;
	}

	.variants-list {
		display: flex;
	}

	.table-row .label {
		display: flex;
		align-items: center;
		gap: 1.2rem;
		flex: 1;

		min-width: 10rem
	}

	.variants-list div {
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;

		gap: 1rem;

		min-width: 20rem;
	}

	.variants-list img,
	.label img {
		width: 1.6rem;
	}

	.variants-list span {
		font-size: 1.2rem;
		color: #88888A;
	}

	span.uptick {
		color: #0CB47F;
	}

	.variants-list p {
		font-weight: 500;
		font-size: 1.6rem;
	}


	.cta-sm {
		display: flex;
		justify-content: center;
		align-items: center;

		padding: 1.1rem 2.4rem;

		font-size: 1.4rem;
		background-color: #0D121A;
		border: .1rem solid #212830;
		border-radius: .8rem;

		margin-left: auto;
	}

	.experiment-header svg {
		margin-right: 1.6rem;
	}

	/* END @mete*/

	.table-inner {
		padding-inline: 3.2rem;
		width: 100%;
	}

	.homepage-table .experiment-table-wrapper {
		background-color: #0d121a;
		border: 0.1rem solid #1a1f26;
	}

	.homepage-table .experiment-table-wrapper .top-row > th {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.6rem 3.3rem;

		display: grid;
		grid-template-columns: 1fr 2fr;
	}

	.homepage-table .experiment-table-wrapper {
		margin-top: 2.5rem;
	}

	.experiment-table {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.experiment-table .dropdown {
		min-width: 17rem;
		margin-left: 2.4rem;
		white-space: pre;
	}

	.experiment-table .experiment-header {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.8rem;

		width: 100%;
	}

	.experiment-table .experiment-header p {
		font-size: 1.8rem;
	}

	.experiment {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.top-row {
		background-color: #0d121a;
		font-size: 1.4rem;
		text-align: left;
	}
	.pages {
		background-color: #0d121a;
		color: #88888A;
		font-size: 1.2rem;
		text-align: left;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 2rem;        
	}

	.pages > div {
		display: flex;
		align-items: center;
		gap: 0.8rem;
	}

	.experiment td {
		width: 100%;
		border-bottom: 0.1rem solid #1a1f26;
		padding-inline: 3.3rem;
	}

	.experiment td:first-child {
		border-top: 0.1rem solid #1a1f26;
	}

	.experiment td > div {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 1.2rem;
		padding-block: 3.3rem;
	}

	.experiment .items {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 3rem;
		display: grid;
		grid-template-columns: 3fr 2fr;
	}

	.experimental-item {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.6rem;

		font-size: 1.4rem;
	}
	.experimental-item span {
		font-size: 1.2rem;
	}

	.experiment td > div p {
		font-size: 1.4rem;
		line-height: 1.8rem;
	}

	.empty-block {
		border-bottom: none;
		min-height: 8.7rem;
	}

	.homepage-table .tables-wrapper {
		display: flex;
		flex-direction: column;
	}

	.items .experimental-item:last-child {
		width: fit-content;
		margin-left: auto;
	}
	.items .experimental-item:first-child {
		width: 100%;
		margin-left: 12%;
	}

	.homepage-table .tables-wrapper .experiment-table-wrapper:first-child {
		flex: 1;
	}
	.homepage-table .tables-wrapper .experiment-table-wrapper:first-child {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border-right: none;
	}

	.homepage-table .tables-wrapper .experiment-table-wrapper:last-child {
		flex: 1;
	}
	.homepage-table .tables-wrapper .experiment-table-wrapper:last-child {
		margin-top: 0;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.homepage-table .tables-wrapper .experiment-table-wrapper:last-child > .table-row {
		display: none;
	}

	.homepage-table .tables-wrapper .experiment-table-wrapper:last-child td:nth-child(odd) {
		background-color: #0D121A;
	}
	.homepage-table .tables-wrapper .experiment-table-wrapper:last-child td:nth-child(even) {
		background-color: #141921;
	}

	.experiment td:last-child {
		border-bottom: none;
	}

	@media screen and (min-width: 1100px) {

		.table-inner {
			width: auto;
			max-width: none;
		}

		.homepage-table .tables-wrapper {
			display: flex;
			flex-direction: row;
		}

		.experiment-table-wrapper.pageviews .experiment .table-row:nth-child(even) {
			background-color: #141921;
		}

		.homepage-table .tables-wrapper .experiment-table-wrapper:first-child {
			border-top-left-radius: 1.2rem;
			border-bottom-left-radius: 1.2rem;
		}

		.homepage-table .tables-wrapper .experiment-table-wrapper:last-child {
			margin-top: 2.5rem;
			border-top-right-radius: 1.2rem;
			border-bottom-right-radius: 1.2rem;
		}

		.homepage-table .tables-wrapper .experiment-table-wrapper:last-child > .table-row {
			display: flex;
		}
	}

	.table-row .label p {
		white-space: pre;
	}

	@media screen and (max-width: 768px) {

		:global(main) {
			width: 100%;
		}

		.experiment-table-wrapper {
			overflow-x: scroll;
		}

		.table-inner {
			padding-inline: 1.6rem;
			width: 100%;
		}

		.experiment-table .experiment-header {
			flex-wrap: wrap;			
		}

		.experiment-header .cta-sm {
			margin-left: 0;
		}

	}

	.variants-list .tooltip-wrapper,.variants-list .tooltip-content {
		width: auto;
		min-width: auto;
		white-space: pre;
	}

	@media screen and (min-width: 2100px) {

		.items .experimental-item:first-child {
			width: 100%;
			margin-left: 25%;
		}
	}
	@media screen and (min-width: 2500px) {

		.items .experimental-item:first-child {
			width: 100%;
			margin-left: 27%;
		}
	}


</style>

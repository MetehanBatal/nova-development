<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import Summary from '$lib/experiments/results/Summary.svelte';
	import Report from '$lib/experiments/results/Report.svelte';
	import Logs from '$lib/experiments/results/Logs.svelte';

	import ResolutionWarning from '$lib/toolkit/ResolutionWarning.svelte';
	import {spinner} from '$stores/functions';

	let windowWidth;
	let isLoaded = false
	let isInitalized = false
	let fetchInProgress = true
	let showResetButton = false

	let dateRangeReport = undefined
	const experimentTypes = [
		{
			component: Summary,
			title: 'Summary',
			icon: `
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
			<path d="M6.00065 13.3334H2.66732C2.3137 13.3334 1.97456 13.1929 1.72451 12.9429C1.47446 12.6928 1.33398 12.3537 1.33398 12.0001V3.3334C1.33398 2.97978 1.47446 2.64064 1.72451 2.39059C1.97456 2.14054 2.3137 2.00006 2.66732 2.00006H5.26732C5.49031 1.99788 5.71029 2.05166 5.90712 2.15648C6.10395 2.2613 6.27134 2.41381 6.39398 2.60006L6.93398 3.40006C7.05539 3.58442 7.22067 3.73574 7.41498 3.84047C7.6093 3.94519 7.82658 4.00003 8.04732 4.00006H13.334C13.6876 4.00006 14.0267 4.14054 14.2768 4.39059C14.5268 4.64064 14.6673 4.97978 14.6673 5.3334V8.66673" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M6.00065 13.3334H2.66732C2.3137 13.3334 1.97456 13.1929 1.72451 12.9429C1.47446 12.6928 1.33398 12.3537 1.33398 12.0001V3.3334C1.33398 2.97978 1.47446 2.64064 1.72451 2.39059C1.97456 2.14054 2.3137 2.00006 2.66732 2.00006H5.26732C5.49031 1.99788 5.71029 2.05166 5.90712 2.15648C6.10395 2.2613 6.27134 2.41381 6.39398 2.60006L6.93398 3.40006C7.05539 3.58442 7.22067 3.73574 7.41498 3.84047C7.6093 3.94519 7.82658 4.00003 8.04732 4.00006H13.334C13.6876 4.00006 14.0267 4.14054 14.2768 4.39059C14.5268 4.64064 14.6673 4.97978 14.6673 5.3334V8.66673" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M8.66732 9.33341C9.4037 9.33341 10.0007 8.73646 10.0007 8.00008C10.0007 7.2637 9.4037 6.66675 8.66732 6.66675C7.93094 6.66675 7.33398 7.2637 7.33398 8.00008C7.33398 8.73646 7.93094 9.33341 8.66732 9.33341Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M8.66732 9.33341C9.4037 9.33341 10.0007 8.73646 10.0007 8.00008C10.0007 7.2637 9.4037 6.66675 8.66732 6.66675C7.93094 6.66675 7.33398 7.2637 7.33398 8.00008C7.33398 8.73646 7.93094 9.33341 8.66732 9.33341Z" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M11.9993 12.6666C10.1327 12.6666 8.66602 11.1999 8.66602 9.33325V14.6666" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M11.9993 12.6666C10.1327 12.6666 8.66602 11.1999 8.66602 9.33325V14.6666" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M13.3333 13.9999C14.0697 13.9999 14.6667 13.403 14.6667 12.6666C14.6667 11.9302 14.0697 11.3333 13.3333 11.3333C12.597 11.3333 12 11.9302 12 12.6666C12 13.403 12.597 13.9999 13.3333 13.9999Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M13.3333 13.9999C14.0697 13.9999 14.6667 13.403 14.6667 12.6666C14.6667 11.9302 14.0697 11.3333 13.3333 11.3333C12.597 11.3333 12 11.9302 12 12.6666C12 13.403 12.597 13.9999 13.3333 13.9999Z" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>	
			`,
		},
		{
			component: Report,
			title: 'Report',
			icon: `
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path d="M2 2V14H14" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M2 2V14H14" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M12.666 6L9.33268 9.33333L6.66602 6.66667L4.66602 8.66667" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M12.666 6L9.33268 9.33333L6.66602 6.66667L4.66602 8.66667" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>	
			`,
		},
		{
			component: Logs,
			title: 'Logs',
			icon: `
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M4 14V6C4 7.5913 4.63214 9.11742 5.75736 10.2426C6.88258 11.3679 8.4087 12 10 12" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>	
			`,
		},
	];

	let activeStep = 0;

	let eventsResults = [];

	const processData = (data) => {

		eventsResults = data
		const emptySchema = {
			totalVisitors: 0,
			totalOrders: 0,
			conversionRate: 0.0,
			totalRevenue: 0,
			averageRevenue: 0.0
		};

		// Iterate through baseVariants to check for missing variant IDs in the response
		$page.data.experimentRes.data[0].variants.forEach(variant => {
			const variantId = variant.id.toString();
			if (!eventsResults.hasOwnProperty(variantId)) {
				eventsResults[variantId] = { ...emptySchema };
			}

			if (eventsResults[variantId].averageRevenue === null || eventsResults[variantId].averageRevenue === undefined) {
				eventsResults[variantId].averageRevenue = 0.0;
			}
			eventsResults[variantId].id = +variantId

		});

		console.log(eventsResults);
	}

	const resetData = async (fromMount = false) => {
		if(fromMount || (!isInitalized && isLoaded) ){
			const eventsReq = await fetch(`http://localhost:3030/prod/experiments/analytics?experimentId=${$page.params.slug}`);
			const eventsRes = await eventsReq.json();
			processData(eventsRes.analytics?.data)
			fetchInProgress = false
			showResetButton = false
		}

	}

	onMount(async () => {
		const currentTime = new Date().getTime();
		//console.time('fetchStart');

		// Fetching both requests concurrently using Promise.all
		// const [eventsReq, reportsReq] = await Promise.all([
		// 	fetch(`https://mve.novus.studio/prod/experiments/analytics?experimentId=${$page.params.slug}`),
		// 	fetch(`https://mve.novus.studio/prod/experiments/reporting?experimentId=${$page.params.slug}&type=insights&event=PageView&breakdown=VariantId&startDate=${currentTime - (1000 * 60 * 60 * 24 * 60)}&endDate=${currentTime}&accuracy=hour`)
		// ]);


		//console.timeEnd('fetchStart');

		// Parsing JSON from both responses
		//console.time('parseStart');
		// const [eventsRes, reportsRes] = await Promise.all([eventsReq.json(), reportsReq.json()]);
		
		resetData(true)
		//console.timeEnd('parseStart');
		isLoaded = true
	});

	const filterWithDateRange = async () => {
		if(activeStep != 1) return
		if(!isInitalized) return
		fetchInProgress = true
		const eventsReq = await fetch(`http://localhost:3030/prod/experiments/analytics?experimentId=${$page.params.slug}&startDate=${dateRangeReport.start}&endDate=${dateRangeReport.end}`);
		const eventsRes = await eventsReq.json();

		processData(eventsRes.analytics?.data)
		fetchInProgress = false
		showResetButton = true
	}
	$: dateRangeReport, filterWithDateRange();
	$: isInitalized, resetData()
</script>

{#if isLoaded}
<div class="section-wrapper">
	<a href="/experiments" class="experiment-title">
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" >
			<path d="M8.75 3.5L5.25 7L8.75 10.5" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
		<p class="heading">Go back to experiments</p>
	</a>

	<div class="experiment-wrapper">
		<div class="experiment-header">
			<div class="experiment-type-item">
				{#each experimentTypes as type, _index}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div class="experiment-type" class:selected={activeStep === _index} on:click={() => activeStep = _index}>
						{@html type.icon}
						<p>{type.title}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="experiment-type-wrapper">
		{#each experimentTypes as step, _index}
			{#if activeStep === _index}
				{#if _index == 1}
					<svelte:component 
						this={step.component}
						eventsData={eventsResults}
						bind:dateRangeReport
						bind:fetchInProgress
						bind:isInitalized
						{showResetButton}
					/>
				{:else}
					<svelte:component this={step.component} eventsData={eventsResults}/>
				{/if}
			{/if}
		{/each}
	</div>
</div>
{:else}
	<div class="loader-box">
		{@html spinner}
	</div>
{/if}


{#if windowWidth < 1200 && activeStep === 0}
  <ResolutionWarning/>
{/if}


<style>
	.section-wrapper {
		width: 100vw;
		padding: 4rem 3.2rem;
	}

	.experiment-type-item {
		display: flex;
		align-items: center;
	}

	.experiment-type {
		display: flex;
		align-items: center;
		gap: .8rem;
		position: relative;

		padding: 2.4rem;
		
		color: #88888A;
		
		cursor: pointer;
		transition: all .3s ease-in-out;
	}

	.experiment-type p {
		font-size: 1.6rem;
		line-height: 2rem;
		transition: all .3s ease-in-out;
	}

	:global(.experiment-type:hover p) {
		color: #FFF;
		transition: all .3s ease-in-out;
	}

	:global(.experiment-type:hover > svg path) {
		stroke: #FFF;
		transition: all .3s ease-in-out;
	}


	.experiment-type.selected p {
		color: #FFF;
	}

	.experiment-type-wrapper {
		border: .1rem solid #212830;
		border-top: 0;
		border-radius: 0 0 1.6rem 1.6rem;

		overflow: hidden;
	}

	:global(.experiment-type.selected > svg path) {
		stroke: #FFF;
		transition: all .3s ease-in-out;
	}

	:global(.experiment-type.selected::after) {
		position: absolute;
		bottom: 0;
		left: 0;

		content: "";

		background-color: #88888A;
		
		height: 0.1rem;
		width: 100%;
		
		transform: translateY(1.6rem);
	}

	@media screen and (min-width: 991px) {
		.section-wrapper {
			width: calc(100vw - 9.4rem);
		}
	}
</style>
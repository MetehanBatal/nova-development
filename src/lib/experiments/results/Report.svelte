<script>
	import { onMount } from 'svelte';

	import ReportsChart from '$lib/experiments/reporting/Chart.svelte';
	import StatsCharts from '$lib/experiments/charts/statisticalAnalysis/Chart.svelte';

	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { user } from '$stores/user';
	import { experiment } from '$stores/experiment';
	import DatePicker from '$lib/toolkit/DatePicker.svelte';

	import { toastMessage } from '$stores/toast.js';

	let experimentData = $page.data?.experimentRes?.data[0];
	export let eventsData;
	export let dateRangeReport
	export let fetchInProgress
	export let isInitalized
	export let showResetButton

	console.log("eventsData", dateRangeReport);

	// Object.keys(eventsData).forEach(key => {
	// 	eventsData[key].id = parseInt(key);
	// });
	console.log('Eeeeee:', eventsData, experimentData);

	const initialData = eventsData;

	// let indices = generateVariantIndices(experimentData);

	let allocationChanged = false;
	let distributeAllocationDifference = false;
	
	let sortedStructuredData = {};
	let sorted = false;
	let currentView = 'all';
	let currentGraphTypeIndex = 0;
	let sortedByAscending = true;
	let isSorted = "";

	let datePickerElement
	let rangeButton = "Select Range"

	const spinner = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

	let top3HighestConversionWithKeys = [];

	const selectedRangeText = () => {
		if(!isInitalized || !dateRangeReport) return
		fetchInProgress = true
		sortData("")
		rangeButton = `${new Date(dateRangeReport.start).toDateString().split(" ").slice(1, 3).join(" ")} - ${new Date(dateRangeReport.end).toDateString().split(" ").slice(1, 3).join(" ")}`
	}

	function drawReports() {
		if (!eventsData || eventsData.length < 1) {
			return; }

		//fetchInProgress = false;
		top3HighestConversionWithKeys = Object.entries(eventsData)
			.sort(([, a], [, b]) => b.conversionRate - a.conversionRate)
			.slice(0, 3)
			.map(([key, value]) => ({ key, ...value }));
	}

	let selectedComponents = {};
	let dropdownOpened = false;
	let variantDropdownRef;

	let allocationsOpened = [];

	onMount(() => {
		if (browser) {
			document.addEventListener("click", (event) => {
				if (variantDropdownRef && !variantDropdownRef.contains(event.target)) {
					dropdownOpened = false;
				}
			});
		}

		getStatsData(`https://mve-statistical-analysis-03586b4a1554.herokuapp.com/confidence-scores/${experimentData.id}`);
	})

	function handleCheckboxChange(group, component, target) {
		selectedComponents[group] = selectedComponents[group] || [];
		const existingKey = selectedComponents[group].findIndex(item => item === component);
		// selectedComponents[group] = existingKey > 0 ? selectedComponents[group].filter(item => item !== component) : [...selectedComponents[group], component];
		if (existingKey === -1) {
			selectedComponents[group].push(component);

			target.parentNode.classList.add('active');
		} else {
			selectedComponents[group] = selectedComponents[group].filter(item => item !== component);

			if (selectedComponents[group].length === 0) {
				delete selectedComponents[group];
			}

			target.parentNode.classList.remove('active');
		}

		selectedComponents = selectedComponents;
	}

	function switchView(view) {
		sorted = false;

		currentView = view;
		if (view === 'sorted') {
			console.time('timeToGroup');
			const sortedVariantStructure = Object.values(experimentData.variants.reduce((acc, {arms}) => {
				arms.forEach(({name, component}) => {
					acc[name] = acc[name] || { name, components: [] };
					if (!acc[name].components.includes(component)) {
						acc[name].components.push(component);
					}
				});
				return acc;
			}, {}));

			sortedVariantStructure.forEach((variant, index) => {
				variant.components.forEach((componentName, _index) => {
					// const variantIndexes = indices
					// 	.filter(obj => obj[variant.name] === componentName)
					// const variantIndexes = indices
					// 	.map((obj, index) => obj[variant.name] === componentName ? index : undefined)
					// 	.filter(index => index !== undefined);

					const indices = experimentData.variants.filter((expVariant) => expVariant.arms.some(arm => arm.name === variant.name && arm.component === componentName) ).map(expVariant => expVariant.id)

					generateSortedSchema(indices, variant.name, componentName);
				});

			});
			console.timeEnd('timeToGroup');
		}
	}

	function switchType(index) {
		currentGraphTypeIndex = index;

		if (currentGraphTypeIndex === 1) {
			console.log('Fetch stat graphs');
		}
	}

	function generateSortedSchema(variantIndexes, variantName, componentName) {
		let schema = {
			totalVisitors: 0,
			totalOrders: 0,
			conversionRate: 0,
			averageRevenue: 0,
			totalRevenue: 0,
			revenuePerUser: 0,
			nextPageClickThroughCount: 0,
			addToCartCount: 0,
			checkoutCompleteRate: 0,
			allocation: 0
			// refunds: 19
		};

		console.log(componentName, variantIndexes);
		console.log(variantIndexes, experimentData.variants);

		variantIndexes.forEach((variantIndex) => {
			schema.totalVisitors = schema.totalVisitors + eventsData[variantIndex].totalVisitors;
			schema.totalOrders = schema.totalOrders + eventsData[variantIndex].totalOrders;
			schema.conversionRate = schema.conversionRate + (eventsData[variantIndex].conversionRate * 100);
			schema.nextPageClickThroughCount = schema.nextPageClickThroughCount + (eventsData[variantIndex].totalVisitors * (eventsData[variantIndex].nextPageClickThroughRate ? eventsData[variantIndex].nextPageClickThroughRate : 0));
			schema.addToCartCount = schema.addToCartCount + (eventsData[variantIndex].totalVisitors * (eventsData[variantIndex].addToCartRate ? eventsData[variantIndex].addToCartRate : 0));
			schema.totalRevenue = schema.totalRevenue + eventsData[variantIndex].totalRevenue;
			schema.allocation = schema.allocation + experimentData.variants.filter((variant) => variant.id === variantIndex)[0].allocation;
			console.log(experimentData.variants.filter((variant) => variant.id === variantIndex)[0].allocation, parseInt(variantIndex));
		});

		console.log('Events Data: ', eventsData);

		schema.conversionRate = (schema.totalOrders / schema.totalVisitors) * 100;
		schema.checkoutCompleteRate = (schema.checkoutCompleteRate / variantIndexes.length);
		schema.revenuePerUser = schema.totalRevenue / schema.totalVisitors;
		schema.averageRevenue = schema.totalRevenue / schema.totalOrders;

		sortedStructuredData[variantName] = sortedStructuredData[variantName] || {};
		sortedStructuredData[variantName][componentName] = schema;

		console.log(componentName, sortedStructuredData[variantName][componentName]);
	}

	function sortData(by) {
		/* 
		UI/SVG Addition 
		if (direction === "asc" && by === "conversionRate") {
			uiConversionDirection = "desc"
		}else {
			uiConversionDirection = "asc"
		}

		if (direction === "asc" && by === "totalRevenue") {
			uiTotalRevenueDirection = "desc"
		}else {
			uiTotalRevenueDirection = "asc"
		}

		*/
		sortedByAscending = sortedByAscending === true ? false : true;

		console.log(sortedByAscending);

		isSorted = by;

		// Get an array of the keys sorted by given parameter
		const sortedKeys = Object.keys(eventsData).sort((a, b) => eventsData[sortedByAscending ? a : b][by] - eventsData[sortedByAscending ? b : a][by]);

		let newData = {};
		// Create a new object with sorted data and add a "name" property to each object
		sortedKeys.forEach((key, index) => {
			newData[index] = { ...eventsData[key], name: key };
		});

		eventsData = newData;
		console.log("Events Data : ", eventsData)
	}

	function handleAllocationChange(input) {
		// remove everything except . and numbers
		//
		// let allocationValue = input.allocation.replace(/[^.\d]/g, '');

		// this needs to be
		// -close enough- to 100%
		//
		const allocationTotals = experimentData.variants.reduce((acc, variant) => acc + parseFloat(variant.allocation), 0);
		const difference = (Math.round(allocationTotals * 10000) / 10000) - 100;

		if (distributeAllocationDifference) {
			if (Math.abs(difference / experimentData.variants.length) > 0.001) {
				experimentData.variants.forEach((variant, index, variants) => {
					if (variant.id === input.id) { 
						return; }

					variant.allocation = parseFloat( ( variant.allocation - (difference / (variants.length - 1)).toFixed(4) ).toFixed(4) );
				});

				experimentData.variants = experimentData.variants;
			}
		}

		allocationChanged = true;
	};

	function updateAllocationChange() {
		// this needs to be
		// -close enough- to 100%
		//
		const allocationTotals = experimentData.variants.reduce((acc, variant) => acc + parseFloat(variant.allocation), 0);
		const difference = (Math.round(allocationTotals * 10000) / 10000) - 100;

		if (Math.round(difference) > 0) {
			$toastMessage.type = 'warning';
			$toastMessage.content = `Allocation total needs to be 100%. You have +${difference.toFixed(4)} plus.`;
		} else if (Math.round(difference) < 0) {
			$toastMessage.type = 'warning';
			$toastMessage.content = `Allocation total needs to be 100%. You are falling behind by -${difference.toFixed(4)}.`;
		} else if (Math.round(difference) === 0) {
			const apiHeaders = new Headers();
			apiHeaders.append("Content-Type", "application/json");

			experimentData.initiator = $user.emailAddress;

			const raw = JSON.stringify(experimentData);

			const requestOptions = {
				method: "PUT",
				headers: apiHeaders,
				body: raw,
				redirect: "follow"
			};
			
			fetch("http://localhost:3030/prod/experiments/update", requestOptions)
				.then((response) => response.json())
				.then((result) => {
					if (result.err && result.err.length > 0) {
						$toastMessage.type = "error";
						$toastMessage.content = "Something went wrong while updating the allocations.";
					} else {
						$toastMessage.type = 'success';
						$toastMessage.content = 'Allocations are updated.';
					}
				})
				.catch((error) => console.error(error));
		} else {
			$toastMessage.type = 'error';
			$toastMessage.content = 'Something went wrong while updating the allocations.';
		};
	}

	let statData = [];
	async function getStatsData(url) {
		try {
			const statReq = await fetch(url);
			const statRes = await statReq.json();
			if (statReq.ok) {
				statData = statRes;
			}
		} catch (error) {
			console.error('Error loading statsData:', error);
		}
	}


	$: eventsData, drawReports();
	$: dateRangeReport, selectedRangeText()
	//$: dateRange, selectedRangeEvent()
	</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div>
	<ReportsChart />
	
	{#if Object.keys(eventsData).length > 0}
	<div class="variants-info-box">
		<div class="title-box">
			<h3>Reports</h3>

			<div class="tab-toggler">
				<div class:active={currentGraphTypeIndex === 0} on:click={() => switchType(0)}>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rows-4"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M21 7.5H3"/><path d="M21 12H3"/><path d="M21 16.5H3"/></svg>
				</div>

				<div class:active={currentGraphTypeIndex === 1} on:click={() => switchType(1)}>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scatter-chart"><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="18.5" cy="5.5" r=".5" fill="currentColor"/><circle cx="11.5" cy="11.5" r=".5" fill="currentColor"/><circle cx="7.5" cy="16.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="14.5" r=".5" fill="currentColor"/><path d="M3 3v18h18"/></svg>
				</div>
			</div>

			<div class="tab-toggler">
				<div class:active={currentView === 'all'} on:click={() => switchView('all')}>
					
					{currentGraphTypeIndex === 0 ? 'All Variants' : 'Conversion Rate'}
				</div>

				<div class:active={currentView === 'sorted'} on:click={() => switchView('sorted')}>
					{currentGraphTypeIndex === 0 ? 'Sorted' : 'Revenue'}
				</div>
			</div>
			<div class="left-group">
				<div class="left-group-1">
				{#if showResetButton}
				<div
					class="select-range-button-reset cta-button secondary"
					on:click={(e) => {
						fetchInProgress = true;
						isInitalized = false;
						rangeButton = "Select Range";
						sortData("")
					}}
				>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" class="s-EvZdnE7xYsG-">
					<path d="M2 8C2 9.18669 2.35189 10.3467 3.01118 11.3334C3.67047 12.3201 4.60754 13.0892 5.7039 13.5433C6.80026 13.9974 8.00666 14.1162 9.17054 13.8847C10.3344 13.6532 11.4035 13.0818 12.2426 12.2426C13.0818 11.4035 13.6532 10.3344 13.8847 9.17054C14.1162 8.00666 13.9974 6.80026 13.5433 5.7039C13.0892 4.60754 12.3201 3.67047 11.3334 3.01118C10.3467 2.35189 9.18669 2 8 2C6.32263 2.00631 4.71265 2.66082 3.50667 3.82667L2 5.33333" stroke="white" stroke-linecap="round" stroke-linejoin="round" class="s-EvZdnE7xYsG-"></path>
					<path d="M2 2V5.33333H5.33333" stroke="white" stroke-linecap="round" stroke-linejoin="round" class="s-EvZdnE7xYsG-"></path>
				</svg>
			</div>
				{/if}
			<div class="relative">
				<div class = "date-picker" bind:this = {datePickerElement}>
					<DatePicker selectedOption = {2} bind:dateRange={dateRangeReport} />
				</div>
				<div
					class="cta-button select-range-button secondary"
					on:click={() => {
						let temp = datePickerElement.childNodes[0].childNodes[1]
						temp.style.maxWidth = "4.2rem"
						isInitalized = true
						temp.click()
					}}
				>
				{rangeButton}
			</div>
			</div>
				</div>
			{#if currentView === 'all'}
			<div class="filtration-button">
				<div class="dropdown" class:active={dropdownOpened} on:click={() => dropdownOpened = true} bind:this={variantDropdownRef}>
					<div class="dropdown-title">
						<div class="item-name">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path d="M13.3359 2.66699H2.66927C1.93289 2.66699 1.33594 3.26395 1.33594 4.00033V12.0003C1.33594 12.7367 1.93289 13.3337 2.66927 13.3337H13.3359C14.0723 13.3337 14.6693 12.7367 14.6693 12.0003V4.00033C14.6693 3.26395 14.0723 2.66699 13.3359 2.66699Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M6.66406 2.66699V5.33366" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M1.33594 5.33301H14.6693" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M4 2.66684V5.33351" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
							</svg> 
							
							<div>Filtration</div>
						</div>

						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
							<path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="white" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</div>
					<div class="dropdown-content checkbox-dropdown">
						<div class="list">
							<div class="search-experiment">
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6.41667 11.0833C8.994 11.0833 11.0833 8.994 11.0833 6.41667C11.0833 3.83934 8.994 1.75 6.41667 1.75C3.83934 1.75 1.75 3.83934 1.75 6.41667C1.75 8.994 3.83934 11.0833 6.41667 11.0833Z" stroke="#88888A" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.41667 11.0833C8.994 11.0833 11.0833 8.994 11.0833 6.41667C11.0833 3.83934 8.994 1.75 6.41667 1.75C3.83934 1.75 1.75 3.83934 1.75 6.41667C1.75 8.994 3.83934 11.0833 6.41667 11.0833Z" stroke="black" stroke-opacity="0.2" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.2505 12.25L9.74219 9.7417" stroke="#88888A" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.2505 12.25L9.74219 9.7417" stroke="black" stroke-opacity="0.2" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
								<input type="text" placeholder="Search">
							</div>

							{#each experimentData['variants'] as variationsBlock, _index}
							<div class="experiment-list">
								<span class="low-text">{variationsBlock.name}</span>
								{#each variationsBlock['arms'] as arm, __index}
								<label>
									<input type="checkbox" class="checkmark" on:change={(event) => {handleCheckboxChange(variationsBlock.name, arm.name, event.target)}} />

									<span>{arm.name}</span>
								</label>
								{/each}
							</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			{#if allocationChanged}
				<div class="cta-button secondary" on:click={() => updateAllocationChange()}>
					Save
				</div>
			{/if}
			{/if}
			</div>
		</div>

		{#if currentGraphTypeIndex === 0}
			{#if currentView === 'all'}
			<div class="variants-table">
				<div class="variants-header">
					<div class="header-cell first-cell">
						<div class="header-title">
							All Variants
						</div>

						<span>{experimentData.variants.length} variants</span>
					</div>

					<div class="header-cell">
						<span>Confidence Scores
							<!-- <em>(CR - Avg. Rev)</em> -->
						</span>

						<!-- Turn this into tooltip -->
						<!-- <span>{Object.values(eventsData).reduce((acc, obj) => acc + obj.totalVisitors, 0)} visitors</span> -->
					</div>

					<div class="header-cell sm">
						<span class:active={isSorted === "totalVisitors" } on:click={(e) => sortData("totalVisitors")}>Total Visitors</span>
						<!-- Turn this into tooltip -->
						<!-- <span>{Object.values(eventsData).reduce((acc, obj) => acc + obj.totalVisitors, 0)} visitors</span> -->
					</div>

					<div class="header-cell">
						<span class:active={isSorted === "conversionRate" } on:click={(e) => sortData("conversionRate")}>Conversion Rate</span>
					</div>

					<div class="header-cell">					
						<span class:active={isSorted === "nextPageClickThroughRate" } on:click={(e) => sortData("nextPageClickThroughRate")}>Next Page Visit</span>
					</div>

					<div class="header-cell">						
						<span class:active={isSorted === "addToCartRate" } on:click={(e) => sortData("addToCartRate")}>Checkout Start</span>
					</div>

					<div class="header-cell">
						<span class:active={isSorted === "completeCheckoutRate" } on:click={(e) => sortData("completeCheckoutRate")}>Checkout Complete</span>
					</div>

					<div class="header-cell">
						<span class:active={isSorted === "averageRevenue" } on:click={(e) => sortData("averageRevenue")}>Average Revenue</span>
					</div>

					<div class="header-cell">
						<span class:active={isSorted === "totalRevenue" } on:click={(e) => sortData("totalRevenue")}>Total Revenue</span>						
						<!-- 
						<div class="buttons sort-buttons">
							{#if uiTotalRevenueDirection === "asc"}
								<div class="increment" on:click={(e) => {sortData('totalRevenue', 'asc')}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#575758" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-narrow-wide"><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/><path d="M11 12h4"/><path d="M11 16h7"/><path d="M11 20h10"/></svg>
								</div>
							{:else}
								<div class="increment" on:click={(e) => {sortData('totalRevenue', 'desc')}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#575758" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-down-wide-narrow"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M11 4h10"/><path d="M11 8h7"/><path d="M11 12h4"/></svg>
								</div>
							{/if}
						</div>
						-->
					</div>

					<div class="header-cell sm">
						<span class:active={isSorted === "revenuePerUser"} on:click={(e) => sortData("revenuePerUser")}>RPU</span>
					</div>

					<div class="header-cell">
						<span>Allocation</span>

						<svg class="allocation-icon" on:click={(e) => { distributeAllocationDifference = !distributeAllocationDifference; }} width="558" height="800" viewBox="0 0 558 800" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M36.5755 800H521.424C541.506 800 557.788 783.719 557.788 763.636V351.515C557.788 331.433 541.506 315.152 521.424 315.152H485.06V206.061C485.06 92.4388 392.622 0 279 0C165.378 0 72.9392 92.4388 72.9392 206.061V315.152H36.5755C16.4931 315.152 0.211914 331.433 0.211914 351.515V763.636C0.211914 783.719 16.4931 800 36.5755 800ZM315.363 569.663V618.182C315.363 638.264 299.082 654.545 279 654.545C258.917 654.545 242.636 638.264 242.636 618.182V569.663C227.926 558.596 218.394 540.999 218.394 521.212C218.394 487.794 245.582 460.606 279 460.606C312.418 460.606 339.606 487.794 339.606 521.212C339.606 540.999 330.074 558.596 315.363 569.663ZM145.666 206.061C145.666 132.541 205.48 72.7273 279 72.7273C352.52 72.7273 412.333 132.541 412.333 206.061V315.152H145.666V206.061Z" fill={distributeAllocationDifference ? '#ffffff' : '#6d6d6e'}/>

							{#if distributeAllocationDifference}
							<rect x="73" y="215" width="73" height="100" fill="#0D121A"/>
							{/if}
						</svg>
					</div>

					<!-- <div class="header-cell">
						<span>Refunds</span>
					</div> -->
				</div>

				<!-- All variants -->
				<div class="variants-list">
					{#each experimentData.variants as variant, _index}
					{#if eventsData[variant.id]}
						 <!-- content here -->
					<div class="table-row" >

					<!-- <div class="table-row"> -->

						<!-- Name -->
						<div class="table-cell first-cell">
							<div class="tooltip-box">
								<div class="tooltip-content">
									{#each experimentData.variants?.find((v) => v.id === eventsData?.[variant.id]?.id)?.arms || [] as arm, __index}
									<p>
										<span>{arm.name}: </span>
										{#if sorted}
										<span>{arm.component}</span>
										{:else}
										<span>{arm.component}</span>
										{/if}
									</p>
									{/each}
								</div>

								<img src="/assets/icons/info.svg" alt="Variant Info Tooltip">
							</div>

							<p>{experimentData.variants?.find((v) => v.id === eventsData?.[variant.id]?.id)?.name}</p>
							
						</div>

						<!-- Confidence Score -->
						<div class="table-cell">
							{#if !fetchInProgress}
							<p class="confidence-score-holder">
								<span class="color-indicator" style={`
									--composite-color-cv: ${parseInt(statData.find(s => parseInt(s['Key']) === variant.id)?.["Conversion Confidence Score"] * 100)};
									background-color: hsl(var(--composite-color-cv) 72% 59%);
								`}></span>
								{`${statData.find(s => parseInt(s['Key']) === variant.id)?.["Conversion Confidence Score"].toFixed(2) || '-'}`}</p>

							<div class="divider vertical"></div>

							<p class="confidence-score-holder">
								<span class="color-indicator" style={`
									--composite-color-rv: ${parseInt(statData.find(s => parseInt(s['Key']) === variant.id)?.["Revenue Confidence Score"] * 100)};
									background-color: hsl(var(--composite-color-rv) 72% 59%);
								`}></span>
								{`${statData.find(s => parseInt(s['Key']) === variant.id)?.["Revenue Confidence Score"].toFixed(2) || '-'}`}</p>
							{:else}
							{@html spinner}
							{/if}
						</div>

						<!-- Total Visitors -->
						<div class="table-cell sm">
							{#if !fetchInProgress}
							<p>{eventsData[variant.id].totalVisitors}</p>
							{:else}
							{@html spinner}
							{/if}
						</div>

						<!-- Total Orders -->
						<div class="table-cell">
							{#if !fetchInProgress}
							<span class="conversion-rate" class:uptick={top3HighestConversionWithKeys.some(obj => parseInt(obj.key) === variant.id)}>{(eventsData[variant.id].conversionRate * 100).toFixed(2)}%</span>
							
							<p>{eventsData[variant.id].totalOrders}</p>
							{:else}
							{@html spinner}
							{/if}
						</div>

						<!-- Next Page Visits -->
						<div class="table-cell">
							{#if !fetchInProgress}
							<span class="conversion-rate">{(eventsData[variant.id].nextPageClickThroughRate * 100).toFixed(2)}%</span>
							
							<p>{Math.round(eventsData[variant.id].totalVisitors * eventsData[variant.id].nextPageClickThroughRate)}</p>
							{:else}
							{@html spinner}
							{/if}
						</div>

						<!-- Checkout Start -->
						<div class="table-cell">
							{#if !fetchInProgress}
							<span class="conversion-rate">{(eventsData[variant.id].addToCartRate * 100).toFixed(2)}%</span>
							
							<p>{Math.round(eventsData[variant.id].totalVisitors * eventsData[variant.id].addToCartRate)}</p>
							{:else}
							{@html spinner}
							{/if}
						</div>

						<!-- Checkout Complete -->
						<div class="table-cell">
							{#if !fetchInProgress}
							<span class="conversion-rate">{(eventsData[variant.id].completeCheckoutRate * 100).toFixed(2)}%</span>

							<p>{eventsData[variant.id].totalOrders}</p>
							{:else}
							{@html spinner}
							{/if}
						</div>

						<!-- Average Revenue -->
						<div class="table-cell">
							{#if !fetchInProgress}
							<p>{eventsData[variant.id].averageRevenue.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
							{:else}
							{@html spinner}
							{/if}
						</div>

						<!-- Total Revenue -->
						<div class="table-cell">
							{#if !fetchInProgress}
							<p>{eventsData[variant.id].totalRevenue.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
							{:else}
							{@html spinner}
							{/if}
						</div>

						<!-- RPU -->
						<div class="table-cell sm">
							{#if !fetchInProgress}
							<p>{eventsData[variant.id].revenuePerUser?.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
							{:else}
							{@html spinner}
							{/if}
						</div>

						<!-- Allocation -->
						<div class="table-cell">
							{#if !fetchInProgress}
							<div class="allocation-input-box">
								<!-- <p>{variant.id}</p> -->
								<input  type="number"
										style={`color: ${allocationsOpened.includes(variant.id) ? '#ffffff' : '#6d6d6e'}`}
										readonly={!allocationsOpened.includes(variant.id)}
										bind:value={experimentData.variants[eventsData[variant.id].id].allocation}
										on:change={(e) => handleAllocationChange(variant)}
									>

								<div class="buttons">
									<div class="increment">
										<svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M1 3.78613L4 0.786133L7 3.78613" stroke="#575758" stroke-width="0.857143" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									</div>

									<div class="decrement">
										<svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M1 1.35645L4 4.35645L7 1.35645" stroke="white" stroke-width="0.857143" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									</div>
								</div>
							</div>

							<svg class="allocation-icon" on:click={(e) => { allocationsOpened.includes(variant.id) ? allocationsOpened = allocationsOpened.filter((a) => a !== variant.id) : allocationsOpened.push(variant.id); allocationsOpened = allocationsOpened;}} width="558" height="800" viewBox="0 0 558 800" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M36.5755 800H521.424C541.506 800 557.788 783.719 557.788 763.636V351.515C557.788 331.433 541.506 315.152 521.424 315.152H485.06V206.061C485.06 92.4388 392.622 0 279 0C165.378 0 72.9392 92.4388 72.9392 206.061V315.152H36.5755C16.4931 315.152 0.211914 331.433 0.211914 351.515V763.636C0.211914 783.719 16.4931 800 36.5755 800ZM315.363 569.663V618.182C315.363 638.264 299.082 654.545 279 654.545C258.917 654.545 242.636 638.264 242.636 618.182V569.663C227.926 558.596 218.394 540.999 218.394 521.212C218.394 487.794 245.582 460.606 279 460.606C312.418 460.606 339.606 487.794 339.606 521.212C339.606 540.999 330.074 558.596 315.363 569.663ZM145.666 206.061C145.666 132.541 205.48 72.7273 279 72.7273C352.52 72.7273 412.333 132.541 412.333 206.061V315.152H145.666V206.061Z" fill={allocationsOpened.includes(variant.id) ? '#ffffff' : '#6d6d6e'}/>

								{#if allocationsOpened.includes(variant.id)}
								<rect x="73" y="215" width="73" height="100" fill="#0D121A"/>
								{/if}
							</svg>


							{:else}
							{@html spinner}
							{/if}
						</div>

						<!-- Refunds -->
						<!-- <div class="table-cell">
							{#if !fetchInProgress}
							<p>19</p>
							{:else}
							{@html spinner}
							{/if}
						</div> -->

						<!-- Remove static banner experiment ID -->
						<div class="table-cell xsm">
							<a class="redirect-link" target="_blank" href={`${experimentData.baseURLs[0]}?forceVariant=${eventsData[_index].id}`} >
								<img width="14" height="14" src="/assets/icons/preview.svg" alt="Open Variant in New Tab">
							</a>
						</div>
					</div>
					{/if}
					{/each}
				</div>
			</div>
			{:else}
			{#each Object.keys(sortedStructuredData) as sortedData, _index}
			<div class="variants-table">
				<div class="variants-header">
					<div class="header-cell first-cell-sorted">
						<div class="header-title">
							{sortedData}						
						</div>
						<span>{Object.keys(sortedStructuredData[sortedData]).length} variants</span>
					</div>

					<div class="header-cell sm">
						<span>Total Visitors</span>
					</div>

					<div class="header-cell">
						<span>Conversion Rate</span>
					</div>

					<div class="header-cell">					
						<span>Next Page Visit</span>
					</div>

					<div class="header-cell">						
						<span>Checkout Start</span>
					</div>

					<div class="header-cell">
						<span>Checkout Complete</span>
					</div>

					<div class="header-cell">
						<span>Average Revenue</span>
					</div>

					<div class="header-cell">
						<span>Total Revenue</span>
					</div>

					<div class="header-cell sm">
						<span>RPU</span>
					</div>

					<div class="header-cell sm">
						<span>Allocation</span>
					</div>
					
					<!-- <div class="header-cell">
						<span>Refunds</span>
					</div>			 -->
				</div>

				<div class="variants-list">
					{#each Object.keys(sortedStructuredData[sortedData]) as variant, _index}
					<div class="table-row">

						<!-- Name -->
						<div class="table-cell first-cell-sorted">
							<div class="tooltip-box">
								<div class="tooltip-content">
									<p>
										Shows the analytics for all variants visited alongside with {sortedData} - Variant {variant}.
									</p>
								</div>

								<img src="/assets/icons/info.svg" alt="Variant Info Tooltip">
							</div>


							<p>{variant}</p>
						</div>

						<!-- Total Visitors --> 
						<div class="table-cell sm">
							<p>{sortedStructuredData[sortedData][variant].totalVisitors}</p>
						</div>

						<!-- Total Orders -->
						<div class="table-cell">
							<span class="conversion-rate" class:uptick={Object.values(sortedStructuredData[sortedData]).sort((a, b) => b.conversionRate - a.conversionRate)[0].conversionRate ===  sortedStructuredData[sortedData][variant].conversionRate}>{sortedStructuredData[sortedData][variant].conversionRate.toFixed(2)}%</span>
							
							<p>{sortedStructuredData[sortedData][variant].totalOrders}</p>
						</div>

						<!-- Next Page Visit -->
						<div class="table-cell">
							<span class="conversion-rate">{((sortedStructuredData[sortedData][variant].nextPageClickThroughCount / sortedStructuredData[sortedData][variant].totalVisitors) * 100).toFixed(2)}%</span>

							<p>{sortedStructuredData[sortedData][variant].nextPageClickThroughCount}</p>
						</div>

						<!-- Checkout Start -->
						<div class="table-cell">
							<span class="conversion-rate">{((sortedStructuredData[sortedData][variant].addToCartCount / sortedStructuredData[sortedData][variant].totalVisitors) * 100).toFixed(2)}%</span>

							<p>{sortedStructuredData[sortedData][variant].addToCartCount}</p>
						</div>

						<!-- Checkout Completed -->
						<div class="table-cell">
							<span class="conversion-rate">{((sortedStructuredData[sortedData][variant].totalOrders / sortedStructuredData[sortedData][variant].addToCartCount) * 100).toFixed(2)}%</span>

							<p>{sortedStructuredData[sortedData][variant].totalOrders}</p>
						</div>

						<!-- Average Revenue -->
						<div class="table-cell">
							<p>{(sortedStructuredData[sortedData][variant].averageRevenue).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
						</div>

						<!-- Total Revenue -->
						<div class="table-cell">
							<p>{(sortedStructuredData[sortedData][variant].totalRevenue).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
						</div>

						<!-- RPU -->
						<div class="table-cell sm">
							<p>{(sortedStructuredData[sortedData][variant].revenuePerUser).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
						</div>

						<!-- Allocation -->
						<div class="table-cell sm">
							<p>{parseInt((sortedStructuredData[sortedData][variant].allocation))}%</p>
						</div>

						<!-- Refunds -->
						<!-- <div class="table-cell">
							<p>{sortedStructuredData[sortedData][variant].refunds}</p>
						</div> -->

						<!-- Remove static banner experiment ID -->
						<div class="table-cell xsm">
							<a target="_blank" href={`${experimentData.baseURLs[0]}?forceVariant=${_index}`} >
								<img width="14" height="14" src="/assets/icons/preview.svg" alt="Open Variant in New Tab">
							</a>
						</div>
					</div>
					{/each}
				</div>
			</div>
			{/each}
			{/if}
		{:else}
			<StatsCharts url={`https://mve-statistical-analysis-03586b4a1554.herokuapp.com/statistical-analysis/${experimentData.id}`} {currentView} />
		{/if}
	</div>
	{/if}
</div>


<style>
	.left-group-1{
		display: flex;
		gap: 1rem
	}
	.left-group{
		display: flex;
		gap: 3rem;
		margin-left: auto;
	}
	.date-picker{
		max-width: 10px;
		height: 10px;
		padding: 0;
		overflow: hidden;
		position: relative;
		margin-left: auto;
		position: absolute;
		left: 40%;
		bottom: 0px;
		opacity: 0;
	}
	.relative {
		position: relative;
	}
	.select-range-button{
		display: flex;
		align-items: center;
		height: 100%;
		gap: 2rem;
	}

	.select-range-button-reset{
		display: flex;
		align-items: center;
		padding: 0.3rem;
		justify-content: center;
		padding: 1rem 2rem;
	}

	.allocation-input-box {
		display: flex;
		align-items: center;
		gap: 1.2rem;

		padding: .4rem .6rem;

		border-radius: .4rem;

		background-color: rgba(33, 40, 48, 1);
		border: .1rem solid rgba(56, 60, 66, 1);

		transform: translateY(0.4rem);
	}

	.allocation-input-box input {
		width: 6rem;

		padding: 0;
		border: 0;
		outline: 0;
		background-color: transparent;
		color: #fff;
	}

	.allocation-icon {
		width: auto;
		height: 1.6rem;

		cursor: pointer;
	}

	.table-row.hidden {
		display: none!important;
	}

	.dropdown-content {
		right: 0;
	}

	.experiment-list {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.experiment-list > span {
		font-size: 1.2rem;
		color: #88888a;
		width: 100%;
		display: block;
		padding: 1.2rem 0 0.6rem 1rem;
		border-bottom: 0.1rem solid #212830;
	}

	.experiment-list label {
		display: flex;
		justify-content: space-between;
		position: relative;
		padding: 1.2rem 1rem 1.2rem 3.6rem;
		cursor: pointer;
	}

	:global(.experiment-list label.active) {
		transition: all 0.3s ease-in-out;
		background-color: #212830;
	}

	.experiment-list label:hover {
		transition: all 0.3s ease-in-out;
		background-color: #212830;
	}

	.list {
		transform: translateY(0);
	}

	.experiment-list label .checkmark {
		opacity: 1;
		position: absolute;
		top: auto;
		bottom: auto;
		background-color: #0D121A;
		border: .1rem solid #383C42;        
	}

	.experiment-list label .checkmark:after {
		opacity: 1;
		top: 0;
		left: 0;
		width: 1.4rem;
		height: 1.4rem;
		border: .1rem solid #383C42;
		border-radius: .6rem;

		background-repeat: no-repeat;
		background-position: center;
	}

	.checkmark:checked:after {
		background-image: url("/assets/icons/ic-check.svg");
	}

	.buttons {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: .2rem;

		height: 100%;
	}

	.buttons div {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.info-redirect {
		position: relative;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: .8rem;
		opacity: 0;

		transition: all .3s ease-in-out;
	}

	.info-redirect .redirect-wrapper {
		position: relative;
		z-index: 20;
	}

	.experiment-list label:hover .info-redirect,
	.experiment-list label.active .info-redirect {
		opacity: 1;
	}
	

	.search-experiment {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding-left:1rem;
		border-bottom: 0.1rem solid #383C42;
	}

	.search-experiment input {
		cursor: pointer;
		width: 100%;
		background-color: transparent;
		padding: 1.1rem 0 1.1rem .6rem;
		border-bottom: none;
		color: #FFF;

		font-size: 1.2rem;
	}
	.variants-header,
	.table-row {
		display: flex;
		align-items: center;
	}

	.header-cell:not(.first-cell),
	.header-cell:not(.first-cell-sorted),
	.table-cell:not(.first-cell),
	.table-cell:not(.first-cell-sorted) {
		display: flex;
		gap: 1.2rem;
		justify-content: flex-start;
		align-items: center;

		min-width: 16rem;
	}

	.table-cell.sm,
	.header-cell.sm {
		min-width: 10rem;
			width: 10rem;
	}

	.table-cell.xsm {
		min-width: auto;
			width: auto;
	}

	.header-cell .allocation-icon {
		height: 1.2rem;
	}

	.table-cell {
		height: 5rem;
		background-color: #0D121A;

		border-top: .1rem solid #212830;
	}

	.variants-list .table-row:last-child .table-cell {
		border-bottom: .1rem solid #212830;
	}

	.variants-list .table-row {
		border-inline: .1rem solid #212830;
	}
	.variants-list .table-row .table-cell:last-child {
		border-right: .1rem solid #212830;

	}
	.variants-list .table-row:first-child .table-cell:last-child {
		border-top-right-radius: .8rem;
	}
	.variants-list .table-row:last-child .table-cell:last-child {
		border-bottom-right-radius: .8rem; 
	}
	.variants-list .table-row:last-child {
		border-bottom-left-radius: .8rem;
	}
	.variants-list .table-row:last-child .table-cell:first-child {
		border-bottom-left-radius: .8rem;
	}


	.table-cell p {
		text-transform: capitalize;
	}

	.table-row {
		position: relative;
		background-color: #0D121A;
	}

	.table-row .table-cell:first-child .tooltip-box {
		padding-left: 3.2rem;
	}

	.tooltip-box {
		position: relative;
	}

	.tooltip-box:hover .tooltip-content {
		opacity: 1;
		visibility: visible;
	}

	.tooltip-content {
		display: flex;
		flex-direction: column;
		gap: .6rem;

		top: 50%;
		left: 100%;

		transform: translate3d(1.2rem, -50%, 0);

		z-index: 99;
	}

	.tooltip-content:after {
		top: 50%;
		left: 0;
		bottom: auto;

		border-right: 0.5rem solid #1A1F26;
		border-bottom: 0.5rem solid transparent;
		border-top: 0.5rem solid transparent;
		border-left: 0;

		transform: translate3d(0, -50%, 0);
	}

	.tooltip-content p {
		display: flex;
		gap: .4rem;
	}

	.tooltip-content span {
		white-space: nowrap;
	}

	.tooltip-content p span:last-child {
		color: var(--fontColor-secondary);
	}

	.table-cell {
		align-items: flex-end;
		padding: 1.6rem 0;
	}

	.table-cell:last-child {
		position: static;
	}

	.header-title {
		background-color: #0CB47F;
		border-top-left-radius: .4rem;
		border-top-right-radius: .4rem;

		padding: .6rem 1.2rem;

		font-weight: 500;
		font-size: 1.2rem;
	}

	.variants-table:nth-child(3) .header-title {
		background-color: #947AF0;
	}

	.variants-table:nth-child(4) .header-title {
		background-color: #F37361;
	}

	.variants-table:nth-child(5) .header-title {
		background-color: #026DD1;
	}

	.variants-table:nth-child(6) .header-title {
		background-color: #BFD7FF;
	}

	.header-cell span {
		cursor: pointer;
		font-size: 1.2rem;
		color: #6d6d6d;
	}

	.variants-list {
		border-radius: .8rem;
		border-top-left-radius: 0;
	}

	.blurred {
		filter: blur(.8rem);
	}

	.conversion-rate {
		font-weight: 500;
		font-size: 1.2rem;

		color: #88888A;
	}

	.conversion-rate.uptick {
		color: #0CB47F;
	}

	h3 {
		font-size: 1.6rem;
	}

	.title-box {
		display: flex;
		align-items: center;
		gap: 2.4rem;
	}

	.variants-table {
		margin-top: 2.4rem;
		
		overflow-x: scroll;
		overflow-y: hidden;
	}

	.variants-info-box {
		padding: 3.2rem;

		border-top: .1rem solid #212830;
	}

	.tab-toggler {
		display: flex;
		gap: .4rem;

		padding: .4rem;

		border-radius: .8rem;
		border: .1rem solid #212830;
	}

	.tab-toggler div {
		padding: .4rem .8rem;
		font-size: 1.2rem;

		color: #6d6d6d;

		border: .1rem solid transparent;
		border-radius: .4rem;
		background-color: transparent;

		transition: all .24s ease-in-out;

		cursor: pointer;
	}

	.tab-toggler div.active {
		color: #fff;
		border-color: #383C42;
		background-color: #212830;
	}

	.filtration-button {
		margin-left: 0px;
	}

	.confidence-score-holder {
		display: flex;
		align-items: center;
		gap: .6rem;
	}

	.color-indicator {
		display: block;

		width: .8rem;
		height: .8rem;

		border-radius: 100%;
	}

	.divider.vertical {
		width: .1rem;
		height: 80%;

		background-color: #fff;
	}

	.buttons.sort-buttons {
		flex-direction: row;
		gap: .3rem;

		cursor: pointer;
	}

	.buttons.sort-buttons svg path {
		transition: all .3s ease-in-out;

		cursor: pointer;
	}
	.buttons.sort-buttons svg:hover path {
		stroke: #FFFFFF;
	}

	.first-cell-sorted {
		min-width: 27rem !important;
		max-width: 27rem !important;
	}
	.first-cell {
		min-width: 20rem !important;
		max-width: 20rem !important;
	}


	@media screen and (min-width: 1100px) {

		.variants-list {
			border-radius: 0rem .8rem .8rem .8rem;

			border: .1rem solid #212830;
		}

		.table-cell {
			border-top: none;
			border-bottom: .1rem solid #212830;
		}

		.variants-list .table-row:first-child .table-cell {
			/* border-top: .1rem solid #212830; */
		} 

		.variants-list .table-row:last-child .table-cell {
			border-bottom: none
		}

		.variants-list .table-row {
			border-inline: none;
		}
		.variants-list .table-row .table-cell:last-child {
			border-right: none;

		}
		.variants-list .table-row:first-child .table-cell:last-child {
			border-top-right-radius: .8rem;
		}
		.variants-list .table-row:last-child .table-cell:last-child {
			border-bottom-right-radius: .8rem;
		}
		.variants-list .table-row:last-child {
			border-bottom-left-radius: .8rem;
		}
		.variants-list .table-row:last-child .table-cell:first-child {
			border-bottom-left-radius: .8rem;
		}

	}

	.header-cell span.active {
		color: #FFFFFF;
	}

	
</style>





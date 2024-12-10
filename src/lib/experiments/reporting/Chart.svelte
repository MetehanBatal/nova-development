<script>
	/****
		@description: Extensive reporting section with Insights and funnel dropoff charts
		@notes: --
		@author: MB
		@updatedBy: MB
		@createdAt: 27.04.2024
		@updatedAt: 27.04.2024
	****/

	import Metrics from "$lib/experiments/reporting/Metrics.svelte";
	import Steps from "$lib/experiments/reporting/Steps.svelte";
	import Filters from "$lib/experiments/reporting/Filters.svelte";
	import Breakdown from "$lib/experiments/reporting/Breakdown.svelte";
	import ChartInsight from "$lib/experiments/reporting/ChartInsight.svelte";
	import ChartFunnelDropOff from "$lib/experiments/reporting/ChartFunnelDropOff.svelte";
	import DatePicker from '$lib/toolkit/DatePicker.svelte';
	import {selectableDays, spinner} from '$stores/functions';

	import { colors } from "$stores/colors";
	import { filters, breakdowns } from "$stores/filters--dev";

	import { page } from "$app/stores";
	import { onMount } from "svelte";
    import { tree } from "d3";
	
	let reportsData = {};
	let reportsDataBD = []
	let chartsData = {};
	let chartDataBackUp = {};
	let variantStatusBreakdown = {}
	let variantStatusBreakdownElement = {}
	let datePickerElement
	let variantStatusFilter = {}
	let variantStatusFunnel = {}
	let keys = [];
	let initialized = false;
	let isMounted = false
	let isFirstLoaded = false
	let experimentVariants = $page.data.experimentRes.data[0].variants;

	let experimentVariantsObjectFormat = {}
	experimentVariants.map((d) => {
		experimentVariantsObjectFormat[d.name] = d
	})
	const now = new Date().getTime();

	let secondaryBreakdown = [];

	let loader;
	let loading = true;
	let width;
	let filterTo12 = true

	const metrics = [
		{
			index: 0,
			id: "PageView",
			name: "Page View",
		},
		{
			index: 1,
			id: "ConversionRate",
			name: "Conversion Rate",
		},
		{
			index: 2,
			id: "TotalRevenue",
			name: "Total Revenue",
		},
		{
			index: 3,
			id: "Refund",
			name: "Refunds",
		},
	];
	let selectedMetricIndex = 0;

	let selectedFilterIndexes = [{ id: 0, innerId: 2 }];

	// filters[0].innerOptions[2].value = {start: dateRange.start, end: dateRange.end}

	// const breakdowns = [
	// 	{
	// 		id: "VariantId",
	// 		name: "Variant ID",
	// 	},
	// 	{
	// 		id: "Date",
	// 		name: "Date",
	// 	}
	// ];

	// let selectedBreakdownIndex = 0;
	let selectedBreakdownIndexes = [{ id: 0, innerId: 2 }];

	const accuracies = [
		{
			index: 0,
			id: "hour",
			name: "H",
		},
		{
			index: 1,
			id: "day",
			name: "D",
		},
		{
			index: 2,
			id: "month",
			name: "M",
		},
	];
	let selectedAccuracyIndex = 1;
	let selectedDayIndexes = 2;
	let selectedDayIndexesActive = 2;
	let dateRange2
	let dateRange = {
		start: now - 7 * 24 * 60 * 60 * 1000,
		end: now,
	};

	$: selectedDayIndexesActive, dateRange2 = {
		start: now - selectableDays[selectedDayIndexesActive].value * 24 * 60 * 60 * 1000,
		end: now,
	}
	//let daySelection = 1;

	const components = [
		{
			id: "insights",
			name: "Insights",
			icon: `
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M12.666 6C13.7706 6 14.666 5.10457 14.666 4C14.666 2.89543 13.7706 2 12.666 2C11.5614 2 10.666 2.89543 10.666 4C10.666 5.10457 11.5614 6 12.666 6Z" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M14.6673 8V10C14.6673 10.3536 14.5268 10.6928 14.2768 10.9428C14.0267 11.1929 13.6876 11.3333 13.334 11.3333H2.66732C2.3137 11.3333 1.97456 11.1929 1.72451 10.9428C1.47446 10.6928 1.33398 10.3536 1.33398 10V3.33333C1.33398 2.97971 1.47446 2.64057 1.72451 2.39052C1.97456 2.14048 2.3137 2 2.66732 2H8.66732" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M8 11.3333V13.9999" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M5.33398 14H10.6673" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>`,
		},
		{
			id: "funnel",
			name: "Funnel Drop-off",
			icon: `
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M13.3359 2.66699H2.66927C1.93289 2.66699 1.33594 3.26395 1.33594 4.00033V12.0003C1.33594 12.7367 1.93289 13.3337 2.66927 13.3337H13.3359C14.0723 13.3337 14.6693 12.7367 14.6693 12.0003V4.00033C14.6693 3.26395 14.0723 2.66699 13.3359 2.66699Z" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M13.3359 2.66699H2.66927C1.93289 2.66699 1.33594 3.26395 1.33594 4.00033V12.0003C1.33594 12.7367 1.93289 13.3337 2.66927 13.3337H13.3359C14.0723 13.3337 14.6693 12.7367 14.6693 12.0003V4.00033C14.6693 3.26395 14.0723 2.66699 13.3359 2.66699Z" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M6.66406 2.66699V5.33366" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M6.66406 2.66699V5.33366" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M1.33594 5.33301H14.6693" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M1.33594 5.33301H14.6693" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M4 2.66699V5.33366" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M4 2.66699V5.33366" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>`,
		},
	];
	let selectedComponentIndex = 0;

	const pages = [
		{
			id: "advertorial",
			name: "Advertorial",
		},
		{
			id: "lander",
			name: "Lander",
		},
		{
			id: "checkout",
			name: "Checkout",
		},
		{
			id: "upsell",
			name: "Upsell",
		},
		{
			id: "receipt",
			name: "Receipt",
		},
	];
	let selectedPages = [0, 1, 2, 3, 4];
	let formatText = (text) => text.replaceAll(" ", "_")

	const chartVariantSum = (data) => {
		let keys = Object.keys(data)
		let dataObj = {}
		if(keys.length == 1){
			return data[keys[0]]
		} else {
			Object.keys(data[keys[0]]).map((di, i) => {
				let tempData = []
				data[keys[0]][di].map((e, j) => {
					let value = 0
						keys.map((f, ii) =>{
							value+= data[keys[ii]][di][j].value
					})
					tempData.push({
						"_id": e._id,
						value
					})
				})

				dataObj[di] = tempData
			})
			return JSON.parse(JSON.stringify(dataObj))
		}
	}

	const stringFormatter = (text) => {
		let loc = text.indexOf("_") + 1
		let text1 = text.substr(0, loc)
		let text2 = text.substr(loc)
		return text1 + text2.substr(text2.indexOf("_") + 1)
	}
	const chartDataToggleFunc =  (id, isFilter = false) => {
		let temp = id.split("_")
		if(
			variantStatusBreakdown[id]
			|| (isFilter && variantStatusFilter[id])
			|| (!isFilter && components[selectedComponentIndex].id === "funnel" && variantStatusFunnel[id])){
			// if(reportsDataBD.length == 1 || isFilter){
			// 	return
			// }
			if(components[selectedComponentIndex].id === "funnel"){
				// to funnel chartdata is an array
				// chartsData[temp[0]] = chartDataBackUp[temp[0]]
				let indexToPush = chartDataBackUp.findIndex((d) => d.variantId == temp[0])
				chartsData.push(chartDataBackUp[indexToPush])
				chartsData = chartsData
				variantStatusFunnel[id] = true
				return
			}

			if(isFilter){
				isFilter && reportsDataBD.map((d)=>{
					variantStatusBreakdown[`${d}_${id}`] = true
				});
				chartsData[temp[0]] = chartDataBackUp[temp[0]]
				variantStatusFunnel[id] = true
				chartsData = chartsData
				return
			}

			if(!chartsData[temp[1]]){
				chartsData[temp[1]] = reportsData[temp[0]][temp[1]]
				chartsData = chartsData
				return
			}

			reportsData[temp[0]][temp[1]].map((d, i) => {
				chartsData[temp[1]][i].value += d.value
			})

			chartsData = chartsData
			
		} else {
			if(reportsDataBD.length == 1 || isFilter || components[selectedComponentIndex].id === "funnel"){
				if(components[selectedComponentIndex].id === "funnel"){
					isFilter && reportsDataBD.map((d)=>{
						variantStatusBreakdown[`${d}_${id}`]  = false
					})
					let indexToDelete = chartsData.findIndex((d) => d.variantId == temp[0])
					chartsData.splice(indexToDelete, 1)
					variantStatusFunnel[id] = false
					chartsData = chartsData
					return
				}

				if(isFilter){
					isFilter && reportsDataBD.map((d)=>{
						variantStatusBreakdown[`${d}_${id}`]  = false
					})
					delete chartsData[temp[0]]

					variantStatusFunnel[id] = false
					chartsData = chartsData
					return
				}


				delete chartsData[temp[1]]
				chartsData = chartsData
				return
			}

			let temp2 = 0
			reportsDataBD.map((d, i) => {
				temp2 += variantStatusBreakdown[stringFormatter(`${d}_${id}`)]
			})
			if(temp2){
				reportsData[temp[0]][temp[1]].map((d, i) => {
				chartsData[temp[1]][i].value -= d.value
			})

			} else {
				delete chartsData[temp[1]]
				//variantStatusBreakdown[id] = false
			}
			chartsData = chartsData
		}
	}

	async function fetchData(breakdownSelected = "") {
		if (!initialized) {
			return;
		}

		loading = true;

		reportsData = {};
		chartsData = {};
		reportsDataBD = []
		let tempDateRange

		selectedDayIndexesActive != 5
			? tempDateRange = dateRange2
			: tempDateRange = dateRange

		try {
			console.time("reportingFetch");
			const reportsReq = await fetch(
				`https://mve.novus.studio/prod/experiments/reporting_n?type=${components[selectedComponentIndex].id}&experimentId=${$page.params.slug}&event=${selectedComponentIndex === 1 ? "PageView" : metrics[selectedMetricIndex].id}&breakdown=${ breakdownSelected != "" ? breakdownSelected : breakdowns[selectedBreakdownIndexes[0].id].id}&startDate=${tempDateRange.start}&endDate=${tempDateRange.end}&accuracy=${accuracies[selectedAccuracyIndex].id}`,
			);
			const reportsRes = await reportsReq.json();
			reportsData = JSON.parse(JSON.stringify(reportsRes.reporting));

			let tempChartData
			if(components[selectedComponentIndex].id === "funnel"){
				tempChartData = []
				reportsData.map((dd, i) => {
					tempChartData.push({
						...dd,
						variantId : experimentVariants[i].name

					})
					//tempChartData[experimentVariants[i].name] = dd.data
			})
			} else {
				tempChartData = {}
				Object.keys(reportsData).map((dd) => {
				tempChartData[dd] = {}
				experimentVariants.map((d, i) => {
					tempChartData[dd][d.name] = reportsData[dd][d.id]
				})
			})
			}

			reportsData = tempChartData

			//if(chartsData = components[selectedComponentIndex].id === "funnel"){
			if(components[selectedComponentIndex].id === "funnel"){
				chartsData = reportsData
				reportsDataBD = ["null"]
			} else{
				chartsData = chartVariantSum(JSON.parse(JSON.stringify(reportsData)));
				chartDataBackUp = JSON.parse(JSON.stringify(chartsData));
				reportsDataBD = Object.keys(reportsData)
			}

			if(isMounted || breakdownSelected != ""){
				let temp2 = {}
				variantStatusBreakdown = {}
				variantStatusBreakdownElement = {}
				Object.keys(chartsData).map((d, i) => {
					if(isMounted) temp2[d] = true
					reportsDataBD.map((bd) => {
						if(i == 0) variantStatusBreakdown[bd] = true
						variantStatusBreakdown[ bd + "_" + d] = true
					})

				})
				if(isMounted) {
					variantStatusFilter = temp2
					variantStatusFunnel = JSON.parse(JSON.stringify(temp2))
				}
				setTimeout(() => {
					filterVariants()
				}, 100)
				isMounted = false
			}
			console.timeEnd("reportingFetch");
			if (components[selectedComponentIndex].id === "funnel") {

				secondaryBreakdown = [
					...new Set(
						reportsData.flatMap((variant) =>
							variant.data.map((item) => item.pageType),
						),
					),
				];

			// this section is to match funnel report data format with that of the insight.
			// this is required for the reporting table

			if(components[selectedComponentIndex].id === "funnel"){
				let temp = {null: {}}
				reportsData.map((g ,i) => {
					temp['null'][experimentVariants[i].name] = g
				})

				reportsData = temp
			}

				//chartsData = chartsData.slice(0, 8);
				chartDataBackUp = JSON.parse(JSON.stringify(chartsData));

			} else {
				secondaryBreakdown = generateDatesInBetween(
					tempDateRange.start,
					tempDateRange.end,
				);
			}
			keys = Object.keys(chartsData);
			// if (loading) {
			// 	//document.querySelector(".loader-box").classList.add("loaded");
			// }

			setTimeout(() => {
				loading = false;
				filterVariants()
			    filterSelection()
			}, 200);
			isFirstLoaded = true
			return reportsRes;
		} catch (error) {
			console.error(
				"Something went wrong while fetching the experiments: ",
				error,
			);
		}
	}

	function generateDatesInBetween(startTimestamp, endTimestamp) {
		// Initialize empty array to store dates
		let dateArray = [];

		// Iterate through each date between start and end date
		let startT = startTimestamp;

		while (startT <= endTimestamp) {
			let currentDate = new Date(startT);
			// Format the date as 'Month Day' and append to array
			// and, move to next accuracy point
			switch (accuracies[selectedAccuracyIndex].id) {
				case "hour":
					dateArray.push(
						`${currentDate.toLocaleString("en-us", { month: "short", day: "numeric" })} ${currentDate.getHours()}:00`,
					);
					startT += 1 * 60 * 60 * 1000;
					break;
				case "month":
					dateArray.push(
						currentDate.toLocaleString("en-us", {
							month: "long",
							year: "numeric",
						}),
					);
					startT += 30 * 24 * 60 * 60 * 1000;
					break;
				default: // 'day'
					dateArray.push(
						currentDate.toLocaleString("en-us", {
							month: "short",
							day: "numeric",
						}),
					);
					startT += 24 * 60 * 60 * 1000;
			}
		}

		// whilst MongoDB BE starts counting from new Date(dateRange.start) + 1;
		// couldn't find a better option at this late then removing the first option in the array
		dateArray.shift();

		return dateArray;
	}

	const filterVariants = (reset = false) => {

		if(!isMounted || reset){
			Object.keys(variantStatusBreakdown).map((d, i) => {
				if(i > ( 12 * reportsDataBD.length)){
					!reportsDataBD.includes(d) && notShowVariants(null, d.substr(d.indexOf("_")+1))
				} else {
					// this mainly for reset
					// removing the breakdown prefix
					// filter payload should not include the breakdown_prefix
					(!variantStatusBreakdown[d]) && showVariants(null, d.substr(d.indexOf("_")+1))
				}
			})
			setTimeout(() => {
				filterTo12 = false
			}, 500);
			return
		}
		Object.keys(variantStatusBreakdown).map((d) => {
			if(variantStatusBreakdown[d]){
				showVariants(null, d)
			} else {
				notShowVariants(null, d)
			}
		})
	}

	const showVariants = (id, name) => {
		toggleChartsData(
			"variant",
			name,
			true,
			"is",
		);

	}

	const notShowVariants = (id, name) => {
		toggleChartsData(
			"variant",
			name,
			true,
			"not",
		);
   }

	const filterSelection = () => {
		if(selectedFilterIndexes.length == 0) filterVariants(true)
		selectedFilterIndexes.map(({ id, innerId, selectedValues }) => {
			// ARM
			if (id == 0 && selectedValues && selectedValues.length > 0) {
				let temp = [];
				let tempFilters = filters[id].innerValues;
				selectedValues.map((d) => {
					temp.push(tempFilters[d].name);
				});
				experimentVariants.map((d) => {
					if (innerId == 2 || innerId == 3) {
						let status = 0
						d.arms.map(({ component }) => {
							status += temp.includes(component)
						})
								if (innerId == 2 && status) {
									// CONTAIN
									showVariants(d.id, d.name)
								}
								else if (innerId == 3 && !status) {
									// NOT CONTAIN
									showVariants(d.id, d.name)
								} else {
									notShowVariants(d.id, d.name)
								}
					} else if (innerId == 1 || innerId == 0) {
						let temp2 = [];
						d.arms.map(({ component }) => temp2.push(component));

						if (temp.join("") == temp2.join("") && innerId == 0) {
							// IS
							showVariants(d.id, d.name)
						} else if (
							temp.join("") != temp2.join("") &&
							innerId == 1
						) {
							// IS NOT
							showVariants(d.id, d.name)
						} else {
							notShowVariants(d.id, d.name)
						}
					}
				});
			}
		});
		//$: selectedFilterIndexes, console.log('Filters changed: ', selectedFilterIndexes, filters);
	};

	function toggleChartsData(type, id, isFilter = false, filterType = "") {
		if (!initialized || loading) {
			//if (!initialized) {
			return;
		}

		if (type === "variant") {
			if (isFilter) {
				if (filterType == "is") {
					if (!variantStatusFilter[id]) {
						variantStatusFilter[id] = true
						//variantStatusFunnel[id] = true
						// chartsData[id] = reportsData[id];
						// chartDataBackUp[id] = reportsData[id];
					}
				} else if (filterType == "not") {
					if(variantStatusFilter[id]){
					//if (Object.keys(chartsData).includes(id.toString())) {
						variantStatusFilter[id] = false
						//variantStatusFunnel[id] = false
						//delete chartsData[id];
						//delete chartDataBackUp[id];
					}
				}
				chartDataToggleFunc(id, true)
				//Object.keys(chartDataBackUp).includes(id.toString()) ? delete chartDataBackUp[id] : chartDataBackUp[id] = reportsData[id];
			} else {
				//if(Object.keys(chartsData).includes(id.toString())){
				if(components[selectedComponentIndex].id === "funnel" ){
					if(variantStatusFunnel[id]){
					variantStatusFunnel[id] = false
					} else {
						variantStatusFunnel[id] = true
					}
				} else {
				if(variantStatusBreakdown[id]){
					variantStatusBreakdown[id] = false

				} else {
					variantStatusBreakdown[id] = true
				}
				}
				chartDataToggleFunc(id)

				// Object.keys(chartDataBackUp).includes(id.toString())
				// 	? delete chartDataBackUp[id]
				// 	: (chartDataBackUp[id] = reportsData[id]);
			}
		}
		// else {
		// 	// Filter the data arrays within each object in chartsData based on selectedPages
		// 	chartsData = chartDataBackUp.map((chart) => ({
		// 		...chart,
		// 		data: chart.data.filter((_, index) =>
		// 			selectedPages.includes(index),
		// 		),
		// 	}));
		// }
		keys = Object.keys(chartsData);
		chartsData = chartsData;
	}

	const fetchDataWithBreakDown  = (isFromSelectedComponentIndex = false) => {
		if(isFromSelectedComponentIndex && components[selectedComponentIndex].id === "insights" && selectedBreakdownIndexes.length == 2 )return
		if(components[selectedComponentIndex].id === "insights"){
			if(selectedBreakdownIndexes.length == 2 ){
				selectedBreakdownIndexes[1].id != null && fetchData(breakdowns[selectedBreakdownIndexes[1].id].id)
				return
			}
		}
		//console.log(selectedBreakdownIndexes);;
		fetchData(breakdowns[selectedBreakdownIndexes[0].id].id)
	}

	onMount(() => {
		initialized = true;
		isMounted = true
		secondaryBreakdown = generateDatesInBetween(
			dateRange.start,
			dateRange.end,
		);
		width = ((window.innerWidth - 270) / 4) * 3;

		fetchData();
	});

	$: dateRange, fetchData();
	$: selectedComponentIndex, fetchDataWithBreakDown();
	$: selectedMetricIndex, fetchDataWithBreakDown();
	$: selectedBreakdownIndexes.length, fetchDataWithBreakDown();
	$: selectedAccuracyIndex,
		(secondaryBreakdown = generateDatesInBetween(
			dateRange.start,
			dateRange.end,
		));
	$: selectedAccuracyIndex, fetchDataWithBreakDown();
	$: selectedDayIndexes, fetchDataWithBreakDown()
	$: selectedPages, toggleChartsData();

	$: selectedFilterIndexes,
		filterSelection(),
		console.log(
			"Filters changed: ",
			selectedFilterIndexes,
			filters,
			experimentVariants,
		);


	$: chartsData, console.log("Charts Data to Paint: ", chartsData);

	let sortedDesc = true;
	let eventsData = experimentVariants;

	function sortData(direction) {
		if (direction === "desc") {
			sortedDesc = false;
		}

		if (direction === "asc") {
			sortedDesc = true;
		}

		/*
		
		let eventsData = experimentVariants;

		// Get an array of the keys sorted by given parameter
		const sortedKeys = Object.keys(eventsData).sort((a,b) => eventsData[direction === "desc" ? b : a] - eventsData[direction === "desc" ? b : a]);

		let newData = {};

		sortedKeys.forEach((key,index) => {
			newData[index] = {...eventsData[key], name : eventsData[index].name} 
		})

		eventsData = newData;

		console.log(eventsData)

		*/
	}
</script>

<div class="reporting-section">
	<div class="query-selection">
		<div class="tabs">
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			{#each components as chartType, _index}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="tab"
					class:active={selectedComponentIndex === _index}
					on:click={() => (selectedComponentIndex = _index)}
				>
					{@html chartType.icon}

					<p>{chartType.name}</p>
				</div>
			{/each}
		</div>

		<div class="reporting-list">
			<div>
				{#if components[selectedComponentIndex].id === "insights"}
					<Metrics options={metrics} bind:selectedMetricIndex />
				{:else}
					<Steps options={pages} bind:selectedSteps={selectedPages} />
				{/if}
			</div>

			<div>
				<Filters
					{filters}
					bind:selectedFilters={selectedFilterIndexes}
				/>
			</div>

			{#if components[selectedComponentIndex].id === "insights"}
				<div>
					<Breakdown
						options={breakdowns}
						bind:selectedBreakdowns={selectedBreakdownIndexes}
					/>
				</div>
			{/if}
		</div>
	</div>

	<div class="reporting">
		{#if loading}
			<div class="loader-box" bind:this={loader}>
				{@html spinner}
			</div>
		{/if}
		<div class="chart-selection-wrapper">
			<div class="tab-toggler">
				{#each selectableDays as selectItem, _index}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<!-- svelte-ignore missing-declaration -->
					 {#if selectItem.name == "Custom"}
						 <!-- content here -->
						 <div class:active={selectedDayIndexesActive === _index}
							on:click={() => {
								//daySelection = selectItem.value;
								selectedDayIndexesActive = _index
								let temp = datePickerElement.childNodes[0].childNodes[1]
								temp.style.maxWidth = "4.2rem"
								temp.click()
							}}>
							{selectItem.name}
							{#if selectedFilterIndexes.length > 0}
								<div id="date-picker" bind:this = {datePickerElement}>
									<DatePicker selectedOption={selectedFilterIndexes[0].innerId} bind:dateRange={dateRange} />
								</div>
							{/if}
						</div>
					 {:else}
						<div
							class:active={selectedDayIndexesActive === _index}
							on:click={() => {
								// daySelection = selectItem.value;
								selectedDayIndexes= _index; selectedDayIndexesActive = _index}}>
								{selectItem.name}
						</div>
					 {/if}
				{/each}
			</div>
			{#if components[selectedComponentIndex].id === "insights"}
			<div class="tab-toggler">
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				{#each accuracies as selectItem, _index}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class:active={selectedAccuracyIndex === _index}
						on:click={() => { selectedAccuracyIndex = _index}}>
							{selectItem.name}
					</div>
				{/each}
			</div>
			{/if}
		</div>
		<div class="chart">
			{#if Object.keys(chartsData).length > 0 && !filterTo12}
				{#if components[selectedComponentIndex].id == "funnel"}
					<ChartFunnelDropOff
						{width}
						{selectedPages}
						{experimentVariantsObjectFormat}
						chartsData={[...chartsData].filter(
							(d) => d != undefined,
						)}
					/>
				{:else}
					<ChartInsight
						{width}
						{chartsData}
						{keys}
						{experimentVariantsObjectFormat}
						accuracy={accuracies[selectedAccuracyIndex].id}
						metricsSelected={metrics[selectedMetricIndex].id}
						{metrics}
					/>
				{/if}
			{/if}
		</div>

		<div class="reporting-table">
			<div
				class="row  row-border-bottom header"
				style={`width: ${Object.keys(reportsData).length > 0 ? (secondaryBreakdown.length + 1) * 11 + 20 : 372}rem`}
			>
					{#if selectedBreakdownIndexes.length == 2 && selectedBreakdownIndexes[1].id != null && components[selectedComponentIndex].id != "funnel"}
						<div class="fixed fixed-bd" style="--fixed-column-widths: 18rem">
							<div class="cell">
								<p>{breakdowns[selectedBreakdownIndexes[1].id].name}</p>
							</div>
						</div>
					{/if}
					
				
			
				<div class="fixed" style="--fixed-column-widths: 15rem 15rem">
					<div class="cell">
						<p>{breakdowns[selectedBreakdownIndexes[0].id].name}</p>
					</div>
					<div class="cell">
						<p>Average</p>

						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M2 5.33341L4.66667 2.66675L7.33333 5.33341"
								stroke="#88888A"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M2 5.33341L4.66667 2.66675L7.33333 5.33341"
								stroke="#88888A"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M4.66602 2.66675V13.3334"
								stroke="#88888A"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M4.66602 2.66675V13.3334"
								stroke="#88888A"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M7.33398 8H10.0007"
								stroke="#88888A"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M7.33398 8H10.0007"
								stroke="#88888A"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M7.33398 10.6667H12.0007"
								stroke="#88888A"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M7.33398 10.6667H12.0007"
								stroke="#88888A"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M7.33398 13.3333H14.0007"
								stroke="#88888A"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M7.33398 13.3333H14.0007"
								stroke="#88888A"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				</div>

				<!-- {#if Object.keys(reportsData).length > 0} -->
				<div
					class="scrollable"
					style={`--scrollable-column-widths: repeat(${secondaryBreakdown.length}, 11rem);`}
				>
					{#each secondaryBreakdown as breakdown, _index}
						<div
							class="cell"
							class:optout={selectedComponentIndex === 1 &&
								!selectedPages.includes(_index)}
						>
							<!-- <p>{new Date(secondaryBreakdown._id).toLocaleString('en-us', { month: 'short', day: 'numeric' })}</p> -->
							<p class="capitalized">{breakdown}</p>
						</div>
					{/each}
				</div>
				<!-- {/if} -->
			</div>
			{#each reportsDataBD as bd, i}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="row row-parent row-border-bottom"
				class:optout={components[selectedComponentIndex].id != "funnel" ? !variantStatusBreakdown[bd] : false}
				style={`width: ${Object.keys(reportsData).length > 0 ? (secondaryBreakdown.length + 1) * 11 + 20 : 372}rem`}
				id={"row_" + formatText(bd)}
				
			>
			{#if selectedBreakdownIndexes.length == 2 && selectedBreakdownIndexes[1].id != null && components[selectedComponentIndex].id != "funnel"}
			<div
			class="fixed fixed-bd"
			style="--fixed-column-widths: 18rem"
	>

		<div class="cell"
			on:click={() => {
					variantStatusBreakdown[bd] = !variantStatusBreakdown[bd]

					Object.keys(reportsData[bd]).map((k, i) => {
						if(variantStatusBreakdown[bd] && !variantStatusBreakdown[`${bd}_${k}`]){
						  variantStatusBreakdownElement[`${bd}_${k}`].click()
						}
						if(!variantStatusBreakdown[bd] && variantStatusBreakdown[`${bd}_${k}`]){
							variantStatusBreakdownElement[`${bd}_${k}`].click()
						}
					})
					//toggleChartsData("variant", bd);
				}}
		>
			<div class="report-checkbox-wrapper">
				<div
						class="report-checkbox"
						id={"id_" +
						formatText(bd)}
					class:active={variantStatusBreakdown[bd]}
					style={`--checkbox-color: ${colors[i]}`}
					></div>
					<p class="report-checkbox-text">{bd}</p>
				
			</div>
		
		</div>
	</div>
			{/if}
			
			<div class="row-column">
			{#each experimentVariants as variant, _index}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="row row-child"
				class:optout={
				components[selectedComponentIndex].id === "insights" 
					? !variantStatusBreakdown[bd + "_" + variant.name]
					: !variantStatusFunnel[variant.name]
				}
				id={"row_" + bd + "_" + variant.name}
				style={`width: ${Object.keys(reportsData).length > 0 ? (secondaryBreakdown.length + 1) * 11 + 20 : 372}rem`}
				on:click={(e) => {
					components[selectedComponentIndex].id === "funnel" 
						? toggleChartsData("variant", variant.name)
						: toggleChartsData("variant", bd + "_" + variant.name)
				}}
			>
			<div
			class="fixed"
			style="--fixed-column-widths: 15rem 15rem"
	>
				
					<div class="cell">
						<div class="report-checkbox-wrapper">
							<div
								id={"id_" + bd + "_" + variant.name}
								class:active={components[selectedComponentIndex].id === "insights"
									? variantStatusBreakdown[bd + "_" + variant.name]
									: variantStatusFunnel[variant.name]
								}
								class="report-checkbox"
								bind:this = {variantStatusBreakdownElement[bd + "_" + variant.name]}
								style={`--checkbox-color: ${colors[_index]}`}
							></div>

							<p class="report-checkbox-text">
								{variant.name}
							</p>
						</div>
					</div>
					<div class="cell">
		
							{#if components[selectedComponentIndex].id === "insights"}
								{#if metrics[selectedMetricIndex].id === "ConversionRate"}
									<p>
										{(
											reportsData[bd][variant.name].reduce(
												(acc, data) =>
													acc + data.value * 100,
												0,
											) /
											reportsData[bd][variant.name].length
										).toFixed(2)}
									</p>
								{:else if metrics[selectedMetricIndex].id === "TotalRevenue"}
									<p>
										{(
											reportsData[bd][variant.name].reduce(
												(acc, data) =>
													acc + data.value,
												0,
											) /
											reportsData[bd][variant.name].length
										).toLocaleString("en-US", {
											style: "currency",
											currency: "USD",
										})}
									</p>
								{:else}
									<p>
										{(
											reportsData[bd][variant.name].reduce(
												(acc, data) =>
													acc + data.value,
												0,
											) /
											reportsData[bd][variant.name].length
										).toFixed(2)}
									</p>
								{/if}
							{:else}
								<p>
									{Object.values(
										reportsData[bd][variant.name].data,
									).reduce(
										(acc, data) => acc + data.value,
										0,
									) / selectedPages.length}
								</p>
							{/if}
					</div>
			</div>

			<div
			class="scrollable"
			style={`--scrollable-column-widths: repeat(${secondaryBreakdown.length}, 11rem);`}
		>

			{#if components[selectedComponentIndex].id === "insights"}
				{#each reportsData[bd][variant.name] as report, __index}
					<div class="cell">
						<p>
							{metrics[selectedMetricIndex].id ===
							"ConversionRate"
								? (report.value * 100).toFixed(
										2,
									) + "%"
								: metrics[selectedMetricIndex]
											.id ===
									  "TotalRevenue"
									? report.value.toLocaleString(
											"en-US",
											{
												style: "currency",
												currency: "USD",
											},
										)
									: report.value}
						</p>
					</div>
				{/each}
			{:else}
				{#each Object.values(reportsData[bd][variant.name].data) as page, _index}
					<div
						class="cell"
						class:optout={!selectedPages.includes(
							_index,
						)}
					>
						<p>{page.value}</p>
					</div>
				{/each}
			{/if}
		</div>
		</div>
	
		{/each}
	</div>


			</div>
			{/each}

		</div>
	</div>
</div>

<style>
	.reporting-content{ 
		display: flex;
		align-items: center;
	}
	.reporting-section {
		display: grid;
		grid-template-columns: 3fr 7fr;

		overflow: hidden;
	}

	.query-selection {
		padding-top: 3.2rem;

		border-right: 0.1rem solid #212830;
	}

	.tabs {
		display: flex;
		align-items: center;
		gap: 2.4rem;

		padding: 0 2.4rem;

		border-bottom: 0.1rem solid #212830;
	}

	.tab {
		display: flex;
		gap: 0.8rem;

		padding: 1.2rem 0.8rem;

		cursor: pointer;
	}

	.tab p {
		color: #6d6d6d;
	}

	.tab.active p {
		color: #fff;
	}

	:global(.tab path) {
		stroke: #6d6d6d;
	}

	:global(.tab.active path) {
		stroke: #fff;
	}

	.reporting-list {
		display: flex;
		flex-direction: column;
		gap: 3.2rem;

		padding: 2.4rem 2.4rem 2.4rem 3.2rem;
	}

	.reporting {
		position: relative;
	}

	.reporting-table {
		/*		max-width: 100%;*/
		max-width: calc((100vw - 27rem) / 4 * 3);
		max-height: 42rem;
		overflow-y: auto;
		overflow-x: auto;
	}

	.reporting-table::-webkit-scrollbar {
		height: 0.5rem;
		width: 0.5rem;
	}
	.reporting-table::-webkit-scrollbar-track {
		width: 100%;

		border-left: 0.1rem solid #212830;
		border-top: 0.1rem solid #212830;
		background: #0d121a;
	}

	.reporting-table::-webkit-scrollbar-thumb {
		background: #383c42;
		border-radius: 3rem;
	}

	::-webkit-scrollbar-corner {
		background: #0d121a;
		border-top: 0.1rem solid #212830;
		border-right: 0.1rem solid #212830;
	}

	.row {
		display: flex;
		align-items: center;
		width: 368rem;
		cursor: pointer;
		min-width: 100%;
	}

	.row-border-bottom {
		border-bottom: 1px solid #555;
	}

	.row-column{
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.row-child:hover, .row-child:hover .fixed {
		background-color: rgb(50, 56, 61);
	}

	.row.header {
		position: sticky;
		top: 0;
		background-color: #080b13;
		padding-top: 1.6rem;
		min-width: 100%;
		z-index: 99;
	}

	.cell {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		white-space: nowrap;
		padding: 1.2rem 0.8rem;
		border-bottom: 0.1rem solid #212830;
	}

	.fixed {
		display: grid;
		grid-template-columns: var(--fixed-column-widths);
		border-left: 1px solid #555;

		position: sticky;
		left: 0;

		border-right: 0.1rem solid #212830;
		background-color: #080b13;

		padding-left: 0;
	}

	.fixed-bd,  .fixed-bd .cell{
		border: 0;
	}

	.scrollable {
		display: flex;
		width: 100%;
		/* grid-template-columns: var(--scrollable-column-widths); */
	}

	.scrollable .cell{
		min-width: 11rem;
		width: 100%;
	}

	.blurred {
		filter: blur(0.6rem);
	}

	.report-checkbox-wrapper {
		display: flex;
		align-items: flex-start;
		justify-content: flex-end;
		gap: 0.6rem;

		margin-left: 0.3rem;
	}

	.report-checkbox {
		position: relative;

		min-width: 1.6rem;
		height: 1.6rem;

		background-color: transparent;

		border: 0.1rem solid #383c42;

		border-radius: 0.4rem;
		cursor: pointer;
	}

	.report-checkbox.active {
		background-color: var(--checkbox-color);
		border-color: var(--checkbox-color);
	}

	.report-checkbox.active::after {
		position: absolute;
		content: "";
		top: 50%;
		left: 50%;
		transform: translate3d(-50%, -50%, 0);

		background-image: url("/assets/icons/check-icon.svg");
		background-repeat: no-repeat;
		background-size: cover;

		width: 0.8rem;
		height: 0.55rem;
	}

	.report-checkbox input {
		position: absolute;
		visibility: hidden;
		opacity: 0;
	}

	.report-checkbox-text, .reporting-table p {
		font-size: 1.2rem;
		line-height: 1.6rem;
	}

	.optout {
		color: #6d6d6d;
	}

	.chart {
		width: 100%;
		height: auto;
	}

	::-webkit-scrollbar-corner {
		background: #0d121a;
		border-top: .1rem solid #212830;
		border-right: .1rem solid #212830;
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

	.chart-selection-wrapper {
		display: flex;
		align-items: center;
		margin-inline: auto 2rem;
		gap: 1.6rem;
		justify-content: end;
		margin: 15px;
	}
	#date-picker{
		max-width: 0px;
		height: 0px;
		padding: 0;
		overflow: hidden;
		position: absolute;
	}

</style>

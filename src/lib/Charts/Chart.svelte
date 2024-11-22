<script>
    import DatePicker from '$lib/toolkit/DatePicker.svelte';
    import BarLine  from "./BarLine/BarLine.svelte"
    import Radial from './Radial/Radial.svelte';
    import Legend from './components/Legend.svelte';
    import {parsePeriod, selectableDays} from '../../stores/functions';
    import { colors } from "../../stores/colors";
    import {sum, descending} from 'd3'

    export let headline
    export let hasComparison
    export let hasRangeSelector
    export let showLegend
    export let dataOptions
    export let width
    export let height
    export let isPreview
    export let previewAccuracy
    export let previewDaySelection
    export let previewSelectedDayIndexes

    const now = new Date().getTime() - (30 * 24 * 60 * 60 * 1000)
    let relatedBar
	const spinner = `<div class="lds-spinner get-center"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
    const spinnerPreview = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

    let type = ""
    let chartType = dataOptions?.displayOptions?.chartType || ""

    let minBarWidth = 150


    // let isMounted = false
    let data = {}
    let selectedDayIndexes
	let selectedComparisonIndexes
    let comparisonDays = [
		{
			name : "H",			
			value : "hour"
		},
		{
			name : "D",			
			value : "day"
		},
		{
			name : "M",
			value : "month"			
		},
	];

    let daySelection = isPreview ? previewDaySelection : 7;
    let defaultRange


    let accuracy = "day";
    // let sessions_accuracy = "unique"

    let tabTogglerSection = "all";
    let dateElement = {}
    let dateRange = {}
    let windowWidth;

    let margin = isPreview
        ?  {
            top: 30,
            right: 45,
            bottom: 55,
            left: 45,
        }
        : {
            top: 50,
            right: 45,
            bottom: 55,
            left: 45,
        }

    let strokeColor1 = "#645b94"
	let strokeColor2 = "#ffffff"
    let legendData

    let ENDPOINT = `https://mve.novus.studio/prod/analytics/test`

    const handleRangeSelection = () => {
        if(daySelection != "custom"){
            if(isPreview)  previewDaySelection = daySelection
            defaultRange = {
                start: now - daySelection * 24 * 60 * 60 * 1000,
                end: now,
                comparison: now - (2 * daySelection * 24 * 60 * 60 * 1000)
	        }
           dateRange = defaultRange
        }
    }

    selectedDayIndexes =  isPreview ?  previewSelectedDayIndexes : 2
    selectedComparisonIndexes = comparisonDays.findIndex((d) => d.value == dataOptions.accuracyUnit)
    accuracy =  comparisonDays[selectedComparisonIndexes].value
    if(previewAccuracy) previewAccuracy = accuracy

    const handleCustomDateRange = () => {
        daySelection = (dateRange.end - dateRange.start) / (24 * 60 * 60 * 1000);
        if(isPreview) previewDaySelection = daySelection
    }

    const handleCustomData = (_index) => {
        tabTogglerSection = event
        selectedDayIndexes = _index
        previewSelectedDayIndexes = _index
        let dom = dateElement.childNodes[0].childNodes[1]
        dom.style.maxWidth = "4.2rem"
        dom.click()
    }

    const fetchData =  () => {
        handleRangeSelection()
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const dateRangeObject = {
            "from": dateRange.start,
            "to": dateRange.end
        }

        const dateRangeComparison = dateRange.comparison
        const body = {}
        if (dataOptions.event) body["event"] = dataOptions.event
        if (hasRangeSelector) body["dateRange"] = dateRangeObject
        if (hasComparison) body["comparisonStartTimestamp"] = dateRangeComparison
        if (dataOptions.filters) body["filters"] = dataOptions.filters
        if (dataOptions.valueCalculation) body["valueCalculation"] = dataOptions.valueCalculation
        if (dataOptions.traitCalculations) body["traitCalculations"] = dataOptions.traitCalculations
        if (dataOptions.traits) body["traits"] = dataOptions.traits
        if (dataOptions.displayOptions) body["displayOptions"] = dataOptions.displayOptions
        if (dataOptions.sort) body["sort"] = dataOptions.sort
        if (dataOptions.steps) body["displayOptions"]["steps"] = dataOptions.steps
        if (dataOptions.breakdownValue)  body["breakdown"] = dataOptions.breakdownValue
        if (dataOptions.accuracyUnit) {
            body["accuracy"] = {}
            body["accuracy"]["unit"] = accuracy
        }
        if (dataOptions.measurementType) {
            body["measurement"] = {}
            body["measurement"]["type"] = dataOptions.measurementType
        }

        const raw = JSON.stringify(body);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        return requestOptions
    }

    const processData = async () => {
        // FETCH DATA
        data = {}
        chartType = dataOptions?.displayOptions?.chartType || ""

        if(chartType == "doughnut" || chartType == "pie"){
            type = "radial"
        } else if (chartType == "line") {
            type = "multiline"
        } else if (chartType == "bar" || chartType == "funnel") {
            type = "dropOff"
        }

        if(!isPreview){
            width = type == "multiline"
                ?  windowWidth - 500
                :  type == "radial"
                ?  200
                :  windowWidth - 160
        }

        if(!isPreview){
            height =  type == "multiline"
                ?  580
                :  type == "radial"
                ?  200
                :  470
        }

        try {
            const req = await fetch(ENDPOINT, fetchData())
            const res = await req.json()
            if(type == "multiline"){
                    let tempParse = parsePeriod[accuracy]
                    let temp = res.result.current
                    temp.map((d) => d.key =  tempParse(d.key))
                    data.current = temp

                    legendData = data?.current?.[0]?.traits
                        ?   [
                                "Rate Compared To Previous Value",
                                "Value",
                                ...Object.keys(data.current[0].traits)
                            ]
                        :   [
                                "Rate Compared To Previous Value",
                                "Value",
                            ]

                    if(hasComparison){
                        let tempPast = res.result.comparison
                        tempPast = tempPast.slice(0, temp.length)
                        tempPast.map((d) => d.key =  tempParse(d.key))
                        data.comparison = tempPast
                    }
            }

            if(type == "dropOff"){
                data = res.result
                width =  windowWidth - 500 // to reset on range selection
                let multiplier = hasComparison ? 2 : 1
                let temp = minBarWidth * multiplier * data.current.length
                width = width > temp ? width : temp
            }

            if (type == "radial") {
                    let tempData = res.result.current
                    const total = sum(tempData, d => +d.value)
                    tempData.map((k, i) => {
                        tempData[i] = {
                            percentage: ((+k.value / total) * 100).toFixed(2) + "%",
                            ...tempData[i]
                        }
                    })

                    data["current"] = tempData.sort((a, b) => descending(a.value, b.value))
                    legendData = data.current
            }

        } catch (error) {
            console.warn(error);
        }
    }

    $: dateRange, (dateRange?.start && dateRange?.end) && handleCustomDateRange()
    $: daySelection, dataOptions, selectedComparisonIndexes, processData()

</script>

<svelte:window bind:innerWidth={windowWidth}></svelte:window>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->

        <div class = "chart-header">
            {#if isPreview}
                <input class="headline-input" placeholder="chart title" type="text" bind:value={headline}>
            {:else if headline != ""}
                <h3>{headline}</h3>
            {/if}

            {#if hasRangeSelector}
                <div class="chart-selection-wrapper">
                    <div class="tab-toggler">
                        {#each selectableDays as selectItem, _index}
                            {#if selectItem.name == "Custom"}
                                <div
                                    class:active={selectedDayIndexes === _index}
                                    on:click={() => handleCustomData(_index)}
                                >
                                    {selectItem.name}
                                    <div class="date-picker-dash" id = "date-picker-page-view" bind:this = {dateElement}>
                                        <DatePicker selectedOption={2} bind:dateRange={dateRange} />
                                    </div>
                                </div>
                            {:else}
                                <div
                                    class:active={selectedDayIndexes === _index}
                                    on:click={() => {
                                        tabTogglerSection = event;
                                            daySelection = selectItem.value;
                                            selectedDayIndexes = _index;
                                            previewSelectedDayIndexes = _index;
                                        }
                                    }>
                                        {selectItem.name}
                                </div>
                            {/if}
                        {/each}
                    </div>

                    <div class="tab-toggler">
                        {#each comparisonDays as selectItem, _index}
                            <div
                                class:active={selectedComparisonIndexes === _index}
                                on:click={() => {
                                    tabTogglerSection = event; 
                                    selectedComparisonIndexes = _index;
                                    accuracy = selectItem.value
                                    if(previewAccuracy) previewAccuracy = selectItem.value
                                }}>
                                    {selectItem.name}							
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>

    {#if data && Object.keys(data).length > 0 }
        {#if showLegend}
            <Legend
                data = {legendData}
                {colors}
                {width}
                {type}
                {margin}
                displayType = {type != "radial" ? "keyOnly" : "keyValue"}
                {hasComparison}
            />
        {/if}
        {#if type.includes("line") || type.includes("drop")}
            <BarLine
                {data}
                {type}
                {width}
                {height}
                {strokeColor1}
                {strokeColor2}
                dataProperty = {Date.now()}
                {headline}
                {margin}
                {hasComparison}
                {relatedBar}
            />
        {:else if  type.includes("radial")}
            <Radial
                {data}
                {type}
                {width}
                {height}
                {colors}
            />
        {:else}
            <!-- else content here -->
        {/if}

    {:else}
        {#if isPreview}
            <div class="loader">
                {@html spinnerPreview} Select Right Options
            </div>
        {:else}
            {@html spinner}
        {/if}
    {/if}

<style>
    .headline-input{
        padding: 1rem;
        font-family: "Nunito";
        border: .1rem solid #212830;
        border-radius: .8rem;
        font-size: 1.1rem;
        background-color: #0D121A;
        color: #FFF;
    }
	.chart-header {
		display: flex;
		align-items: center;
        margin-bottom: 40px;
	}

	.chart-header h3 {
		margin-right: 15px;
        font-size: 1.8rem;
	}

	:global(.lds-spinner.get-center) {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate3d( -50%, -50%, 0);
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
		margin-inline: auto 0px;
		gap: 1.6rem;
	}
	.date-picker-dash{
		max-width: 0px;
		height: 0px;
		padding: 0px !important;
		overflow: hidden;
		position: absolute;
	}

    .loader{
        width: 100%;
        height: calc(100vh - 29rem);
        background-color: #383C42;
        display: flex;
        align-items: center;
        gap: 2rem;
        justify-content: center;
        border-radius: 1rem;
    }

</style>
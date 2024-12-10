<script>
    import DatePicker from '$lib/toolkit/DatePicker.svelte';
    import BarLine  from "./BarLine/BarLine.svelte"
    import Radial from './Radial/Radial.svelte';
    import Legend from './components/Legend.svelte';
    import {parsePeriod, selectableDays} from '$stores/functions';
    import { colors } from "$stores/colors";
    import {sum, descending} from 'd3'

    export let otherParams
    export let dataBody
    export let width
    let dataOptions = JSON.parse(dataBody)

    const now = new Date().getTime() - (60 * 24 * 60 * 60 * 1000)
	const spinner = `<div class="lds-spinner get-center"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

    let relatedBar
    let type = ""
    let chartType = dataOptions?.displayOptions?.chartType || ""
    let minBarWidth = 150
    let height

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

    let daySelection = otherParams.daySelection;
    let defaultRange
    let accuracy = otherParams.accuracy;
    let tabTogglerSection = "all";
    let dateElement = {}
    let dateRange = {}
    let windowWidth = window.innerWidth
    let hasRangeSelector = otherParams.hasRangeSelector
    let headline = otherParams.headline
    let showLegend = otherParams.showLegend
    let isTimeScale = otherParams.isTimeScale
    let hasComparison = otherParams.hasComparison

    let margin =  {
            top: 50,
            right: 5,
            bottom: 55,
            left: 45,
        }

    let strokeColor1 = "#645b94"
	let strokeColor2 = "#ffffff"
    let legendData

    let ENDPOINT = `https://mve.novus.studio/prod/analytics/test`

    const handleRangeSelection = () => {
        if(daySelection != "custom"){
            defaultRange = {
                start: now - daySelection * 24 * 60 * 60 * 1000,
                end: now,
                comparison: now - (2 * daySelection * 24 * 60 * 60 * 1000)
	        }
           dateRange = defaultRange
        }
    }

    selectedDayIndexes = otherParams.selectedDayIndexes
    selectedComparisonIndexes = comparisonDays.findIndex((d) => d.value == otherParams.accuracy)
    accuracy =  comparisonDays[selectedComparisonIndexes].value

    const handleCustomDateRange = () => {
        daySelection = (dateRange.end - dateRange.start) / (24 * 60 * 60 * 1000);
    }

    const handleCustomData = (_index) => {
        tabTogglerSection = event
        selectedDayIndexes = _index
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
        dataOptions.dateRange = dateRangeObject
        if(otherParams.hasComparison) dataOptions.comparisonStartTimestamp = dateRangeComparison
        dataOptions["accuracy"]["unit"] = accuracy

        // if (dataOptions.event) body["event"] = dataOptions.event
        // if (hasRangeSelector) body["dateRange"] = dateRangeObject
        // if (hasComparison) body["comparisonStartTimestamp"] = dateRangeComparison
        // if (dataOptions.filters) body["filters"] = dataOptions.filters
        // if (dataOptions.valueCalculation) body["valueCalculation"] = dataOptions.valueCalculation
        // if (dataOptions.traitCalculations) body["traitCalculations"] = dataOptions.traitCalculations
        // if (dataOptions.traits) body["traits"] = dataOptions.traits
        // if (dataOptions.displayOptions) body["displayOptions"] = dataOptions.displayOptions
        // if (dataOptions.sort) body["sort"] = dataOptions.sort
        // if (dataOptions.steps) body["displayOptions"]["steps"] = dataOptions.steps
        // if (dataOptions.breakdownValue)  body["breakdown"] = dataOptions.breakdownValue
        // if (dataOptions.accuracyUnit) {
        //     body["accuracy"] = {}
        //     body["accuracy"]["unit"] = accuracy
        // }
        // if (dataOptions.measurementType) {
        //     body["measurement"] = {}
        //     body["measurement"]["type"] = dataOptions.measurementType
        // }

        const raw = JSON.stringify(dataOptions);

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
        if(!width){
            width = type == "multiline" || type == "dropOff"
                ?  windowWidth - 500
                :  type == "radial"
                ?  200
                :  windowWidth - 160
        }
        height =  type == "multiline"
            ?  580
            :  type == "radial"
            ?  200
            :  470

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
                // to reset on range selection
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
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
        {#if hasRangeSelector}
        <div class = "chart-header">
            <h3>{headline}</h3>
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
                            }}>
                                {selectItem.name}
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
        {/if}

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
                {isTimeScale}
                {chartType}
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
        {@html spinner}
    {/if}

<style>
	.chart-header {
		display: flex;
		align-items: center;
        margin: 2rem 0px 3rem;
        padding-inline: 1.5rem;
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


</style>
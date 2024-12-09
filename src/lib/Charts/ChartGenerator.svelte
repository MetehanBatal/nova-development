<script>
    import Layer from "$lib/Charts/Layer.svelte"
    import {
        measurementType,
        events,
        operatorType,
        collectionValue,
        traitOperator,
        chartTypeObj,
        sideMenuObj
    } from "../../stores/chartData--dev.js";
    import DatePicker from '$lib/toolkit/DatePicker.svelte';
    import BarLine  from "$lib/Charts/BarLine/BarLine.svelte";
    import Radial from '$lib/Charts/Radial/Radial.svelte';
    import Legend from '$lib/Charts/components/Legend.svelte';
    import {parsePeriod, selectableDays} from '../../stores/functions';
    import { colors } from "../../stores/colors";
    import {sum, descending} from 'd3'
    import DropdownType2 from "$lib/Charts/DropdownType2.svelte"
    import { onMount } from "svelte";
    import { toastMessage } from '../../stores/toast';

    export let handleModalClose
    const spinner = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

    const ENDPOINT = `https://preconvert.novus.studio/prod/mAnalytics/test`
    const now = new Date().getTime() - (60 * 24 * 60 * 60 * 1000)

    const {
        showChildren,
        showChildrenTraits,
        addFilter,
        renameEvent,
        duplicate,
        remove,
        formula
    } = sideMenuObj

    let otherParams = {
        accuracy : "day",
        daySelection : 7,
        selectedDayIndexes : 2
    }

    let otherParamsFunnels = {
        accuracy : "day",
        daySelection : 7,
        selectedDayIndexes : 2
    }

    let isMounted = false
    let tabSelected = "insights"
    let prevTabSelected = "insights"
    let prevBody
    let prevBodyFunnel
    let prevSelectedChart =  tabSelected == "insights" ? "line" : "funnel"
    let chartType = ""
    let accuracy = "day"
    let daySelection = 7
    let selectedDayIndexes = 2
    let hasComparison = true
    let hasDataSync = true
    let showLegend = true
    let hasRangeSelector = true
    let type = ""
    let minBarWidth = 150
    let data = {}
    let dataFunnel = {}
    let dateElement = {}
    let dateRange = {}
    let clientHeight
    let strokeColor1 = "#645b94"
	let strokeColor2 = "#ffffff"
    let relatedBar
    let selectedComparisonIndexes
    let controller
    let width
    let height
    let clientWidth
    let margin
    let legendData
    let defaultRange
    let req
    let res
    let reqFunnel
    let resFunnel
    let reqInsight
    let resInsight
    let selectedSideMenuLayerClose = []
    let selectedSideMenuLayer = []
    let allowFetch
    let isTimeScale = true

    let dataBody = {
        filters: [],
        breakdown: [],
        traits:[],
        eventName: null,
        measurementType: 0,
        displayOptions: {
            chartType: 0,
        }
    }

    let dataBodyFunnel = {
        filters: [],
        steps: [],
        displayOptions: {
            chartType: 3,
        },
        eventName: " "
    }

    let dataBodyTracker = {
        filters: [],
        breakdown: [],
        traits:[],
        eventName: null,
        valueCalculation: [{
            isMenuOpen : false
        }]
    }

    let dataBodyTrackerFunnel = {
        steps: [],
        filters: [],
    }

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

    onMount(() => {
        isMounted = true
    })

    const handleCloseSideMenu = (d = selectedSideMenuLayerClose) => {
        if(d && d.length > 0){
               if(tabSelected != "funnels"){
                    if(dataBodyTracker?.[d[0]]?.[d[3]]){
                        dataBodyTracker[d[0]][d[3]] = false
                    } else if(dataBodyTracker?.[d[0]]?.[d[1]]?.[d[3]]) {
                        dataBodyTracker[d[0]][d[1]][d[3]] = false
                    }
               } else {
                    if(dataBodyTrackerFunnel?.[d[0]]?.[d[1]]?.[d[3]]){
                        dataBodyTrackerFunnel[d[0]][d[1]][d[3]] = false
                    }
               }
        }

        let dom = document.getElementsByClassName("dropdown-bind")
        for (let i = 0; i < dom.length; i++) {
            if(dom[i].getElementsByClassName("dropdown-content").length){
                dom[i].getElementsByClassName("dropdown-title")[0].click()
            }
        }

        let domBox = document.getElementsByClassName("dropdown-box-bind")
        for (let i = 0; i < domBox.length; i++) {
            if(domBox[i].getElementsByClassName("dropdown").length){
                domBox[i].getElementsByClassName("dropdown-selection")[0].click()
            }
        }     
    }

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

    selectedComparisonIndexes = comparisonDays.findIndex((d) => d.value == accuracy)
    accuracy =  comparisonDays[selectedComparisonIndexes].value

    const handleCustomDateRange = () => {
        daySelection = (dateRange.end - dateRange.start) / (24 * 60 * 60 * 1000);
    }

    const handleCustomData = (_index) => {
        selectedDayIndexes = _index
        let dom = dateElement.childNodes[0].childNodes[1]
        dom.style.maxWidth = "4.2rem"
        dom.click()
    }

    const handleSetLegend = (value) => {
        if(["line","doughnut"].includes(value)){
            showLegend = true
        } else {
            showLegend = false
        }
    }

    const handleSetChartType = (propData) => {
        // This is intentional set to temp,
        //let chartType
        if(tabSelected == "funnels"){
            chartType = chartTypeObj[dataBodyFunnel.displayOptions.chartType].id
        } else{
            chartType = chartTypeObj[dataBody.displayOptions.chartType].id
        }
        handleSetLegend(chartType)
        height = clientHeight  <= 600 ? clientHeight : 600
        if(chartType == "doughnut" || chartType == "pie"){
            type = "radial"
            margin =  {top: 0, right: 45, bottom: 0, left: 45}
        } else if (chartType == "line") {
            type = "multiline"
            margin =  { top: 20, right: 45, bottom: 55, left: 45}
            height = height - 20 - 55 - 35
        } else if (chartType == "bar" || chartType == "funnel") {
            type = "dropOff"
            margin =  { top: 60, right: 45, bottom: 55, left: 45}
            height = height - 55 
        }
        width = clientWidth
        if(type == "radial"){
            width = 200
            height = 300
        } else if(type == "dropOff"){
            let multiplier = hasComparison ? 2 : 1
            let temp = width
            if(propData){
                temp = minBarWidth * multiplier * propData.length 
            }else if(tabSelected == "insights" && data?.current){
                temp = minBarWidth * multiplier * data.current.length
            } else if (tabSelected == "funnels" && dataFunnel?.current) {
                temp = minBarWidth * multiplier * dataFunnel.current.length
            }
            width = width > temp ? width : temp
        }
    }

    const handleChartType = (propData) => {
        if(tabSelected == "funnels"){
            daySelection = otherParamsFunnels["daySelection"]
            accuracy = otherParamsFunnels["accuracy"]
        } else{
            daySelection = otherParams["daySelection"]
            accuracy = otherParams["accuracy"]
        }
        handleSetChartType(propData)
        prevSelectedChart = chartType
    }

    const fetchData =  () => {
        allowFetch = true
        const body = {}
        let tempBody = tabSelected == "funnels"
            ? JSON.parse(JSON.stringify(dataBodyFunnel))
            : JSON.parse(JSON.stringify(dataBody))

        handleRangeSelection()
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const dateRangeObject = {
            "from": dateRange.start,
            "to": dateRange.end
        }

        handleSetLegend(chartTypeObj[tempBody.displayOptions.chartType].id)

        const dateRangeComparison = dateRange.comparison

        if (tabSelected == "insights" && tempBody.eventName != null) {
            body["event"] = events[tempBody.eventName].name
        } else if (tabSelected == "funnels") {
            body["event"] = " "
        } else {
            allowFetch = false
        }

        if (hasRangeSelector) body["dateRange"] = dateRangeObject
        if (hasComparison) body["comparisonStartTimestamp"] = dateRangeComparison

        if (tempBody?.filters && tempBody.filters.length > 0){
            let temp = []
            tempBody.filters.map(({operator, type, value, valueArray}) => {
                if(value && valueArray.length > 0){
                    let filterValue
                    if(type == "number"){
                        filterValue = valueArray[0]
                    } else {
                        filterValue = valueArray.map((d) => collectionValue[value][d].name).join("|").split("|")
                    }
                    temp.push({
                        "filterOperator": operatorType[type][operator].name,
                        "filterType": type,
                        filterValue,
                        value
                    })
                }
            })
           if(temp.length > 0) {
                body.filters = temp
            }
            // else {
            //     allowFetch = false
            // }
        }

        if (tempBody?.traits && tempBody.traits.length > 0){
            let tempCalculations = []
            let tempTraits = []

            tempBody.traits.map(({title, formula, value, operator, type}, i) => {
                if(type == "formula" && formula.length > 0){
                    tempCalculations.push({
                        title : `${title || "UNTITLED-" + i}`,
                        expression: `(${formula.map((d) => {
                            if(d.formulaType == "property"){
                                if( body["event"] == d.value){
                                    return `value`
                                } else {
                                   let i = tempBody.traits.findIndex((e) => e.value == d.value)
                                    return tempBody.traits[i].title ? `traits["${tempBody.traits[i].title}"]` :  `traits["UNTITLED-${i}"]`
                                }
                            }
                                return d.value
                            }).join("")}).toFixed(2)`
                    })
                    if(tempCalculations.length > 0){
                        body["traitCalculations"] = tempCalculations
                    }
                }

                //if(type == "string"){
                    if(value){
                        let [event, value_session] = value.replace("]","").split("[")
                        tempTraits.push({
                            titleOverwrite : `${title || "UNTITLED-" + i}`,
                            operator : traitOperator[operator].id,
                            event,
                            value: `${value_session ? value_session.toLowerCase() : ""}`
                        })
                    }
                    if(tempTraits.length > 0){
                        body["traits"] = tempTraits
                    }
                    // else {
                    //     allowFetch = false
                    // }
                //}
            })
        }

        if (tempBody?.valueCalculation?.formula && tempBody.valueCalculation.formula.length > 0){
            body["valueCalculation"] = `(${tempBody.valueCalculation.formula.map((d) => {
                if(d.formulaType == "property"){
                    if( body["event"] == d.value){
                        return `value`
                    } else {
                        let i = tempBody.traits.findIndex((e) => e.value == d.value)
                        return tempBody.traits[i].title ? `traits["${tempBody.traits[i].title}"]` :  `traits["UNTITLED-${i}"]`
                    }
                }
                return d.value
            }).join("")}).toFixed(2)`
        }


        body["displayOptions"] = tempBody.displayOptions
        if(hasComparison && hasDataSync && isTimeScale) body["displayOptions"]["dataSyncronization"] = hasDataSync
        if(tempBody?.steps){
            let temp = []
            tempBody.steps.map(({index, value, title, filters}, i) => {
                if(value){
                    temp.push({
                        index : i,
                        titleOverwrite: title,
                        event: value,
                        filters: []
                    })
                    if(filters && filters?.[0]?.value && filters?.[0]?.valueArray && filters?.[0]?.valueArray.length > 0){
                        let filterValue
                        if(filters[0].type == "number"){
                            filterValue = filters[0].valueArray[0]
                        } else {
                            filterValue = filters[0].valueArray.map((d) => collectionValue[filters[0].value][d].name.toLowerCase()).join("|").split("|")
                        }
                        temp[i].filters = [{
                            "filterOperator": operatorType[filters[0].type][filters[0].operator].name,
                            "filterType": filters[0].type,
                            filterValue,
                            value: filters[0].value
                        }]

                    }
                }
            })
            if(temp.length > 1){
                body["displayOptions"]["steps"] = temp
            }
            // else {
            //     allowFetch = false
            // }

        }
        if(tempBody?.breakdown){
            let temp = []
            tempBody.breakdown.map(({value, type}) => {
                if(value != ""){
                    temp.push({value})
                }
            })
            if(temp.length > 0){
                body["breakdown"] = temp
            } else {
                body["breakdown"] = [{ "value" : "timestamp"}]
            }
        }

        if(chartTypeObj[tempBody.displayOptions.chartType].id != "funnels"){
            body["sort"] = [{
                     "field": "key",
                     "direction": "asc"
                }]
            //["line","doughnut"].includes(chartTypeObj[tempBody.displayOptions.chartType].id)
            // ?   [{
            //         "field": "key",
            //         "direction": "asc"
            //     }]
            // :   [{
            //         "field": "value",
            //         "direction": "desc"
            //     }]
        }

        body["accuracy"] = {
            "unit": accuracy
        }
        if(tabSelected == "insights"){
            body["measurement"] = {}
            body["measurement"]["type"] = measurementType[tempBody.measurementType].id
        } else {
            body["measurement"] = {}
            body["measurement"]["type"] = "unique"
        }
        tempBody.displayOptions.chartType = chartTypeObj[tempBody.displayOptions.chartType].id


        if(tabSelected == "insights"){
            otherParams["daySelection"] = daySelection
            otherParams["hasDataSync"] = hasDataSync
            otherParams["hasComparison"] = hasComparison
            otherParams["hasRangeSelector"] = hasRangeSelector
            otherParams["showLegend"] = showLegend
            otherParams["selectedDayIndexes"] = selectedDayIndexes
            otherParams["headline"] = "New Chart"
            otherParams["accuracy"] = accuracy
            otherParams["isTimeScale"] = isTimeScale
            otherParams = otherParams

        } else {
            otherParamsFunnels["daySelection"] = daySelection
            otherParamsFunnels["hasDataSync"] = hasDataSync
            otherParamsFunnels["hasComparison"] = hasComparison
            otherParamsFunnels["hasRangeSelector"] = hasRangeSelector
            otherParamsFunnels["showLegend"] = showLegend
            otherParamsFunnels["selectedDayIndexes"] = selectedDayIndexes
            otherParamsFunnels["headline"] = "New Chart"
            otherParamsFunnels["accuracy"] = accuracy
            otherParamsFunnels = otherParamsFunnels
        }

        const raw = JSON.stringify(body);

        if((tabSelected == "insights" && prevBody == raw) || (tabSelected == "funnels" && prevBodyFunnel == raw) ){
            allowFetch = false
        }
        if(allowFetch){
            tabSelected == "insights" ? prevBody = raw : prevBodyFunnel = raw
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            return requestOptions
        }

        return false // no changes
    }

    const processData = async () => {
        // FETCH DATA
        handleSetChartType()

        if(prevTabSelected != tabSelected){
            prevTabSelected = tabSelected
            return
        }
        let allowRefetch = true // allowRefetch prevents data refetch on charttype change
        let postBody
        if((tabSelected == "insights" && prevSelectedChart != chartTypeObj[dataBody.displayOptions.chartType].id && resInsight)){
            allowRefetch = false
        }
        if(allowRefetch){
            postBody = fetchData()
            if(postBody){
                if(tabSelected == "funnels"){
                    dataFunnel = {}
                } else{
                    data = {}
                }
            }
        }

        // if(controller){
        //     //if((tabSelected == "insights" && resInsight) || (tabSelected == "funnels" && resFunnel)) controller.abort()
        // }

        if(allowRefetch && (!postBody || (tabSelected == "insights" && dataBody.eventName == null))) return
        let tempMainData = {}

        // controller = new AbortController()
        // const signal = controller.signal
        try {
            if(allowRefetch){
               //req = await fetch(ENDPOINT, {signal, ...postBody})
                req = await fetch(ENDPOINT, postBody)
                res = await req.json()

                if(tabSelected == "funnels"){
                    reqFunnel = JSON.parse(JSON.stringify(req))
                    resFunnel = JSON.parse(JSON.stringify(res))
                } else {
                    reqInsight = JSON.parse(JSON.stringify(req))
                    resInsight = JSON.parse(JSON.stringify(res))
                }
            } else {
                if(tabSelected == "funnels"){
                    req = reqFunnel
                    res = resFunnel
                } else {
                    req = reqInsight
                    res = resInsight
                }
            }
            handleChartType(res.result.current)
            if(type == "multiline"){
                    let tempParse = parsePeriod[accuracy]
                    let temp = JSON.parse(JSON.stringify(res.result.current))
                    if(tempParse(temp[0].key) == null){
                        isTimeScale = false
                    } else {
                        temp.map((d) => d.key =  tempParse(d.key))
                        isTimeScale = true
                    }
                    tempMainData.current = temp

                    legendData = tempMainData?.current?.[0]?.traits
                        ?   [
                                "Rate Compared To Previous Value",
                                "Value",
                                ...Object.keys(tempMainData.current[0].traits)
                            ]
                        :   [
                                "Rate Compared To Previous Value",
                                "Value",
                            ]

                    if(hasComparison){
                        let tempPast = JSON.parse(JSON.stringify(res.result.comparison))
                        tempPast = tempPast.slice(0, temp.length)
                        isTimeScale && tempPast.map((d) => d.key =  tempParse(d.key))
                        tempMainData.comparison = tempPast
                    }
            }

            if(type == "dropOff"){
                tempMainData = JSON.parse(JSON.stringify(res.result))
            }

            if (type == "radial") {
                    let tempData = JSON.parse(JSON.stringify(res.result.current))
                    const total = sum(tempData, d => +d.value)
                    tempData.map((k, i) => {
                        tempData[i] = {
                            percentage: ((+k.value / total) * 100).toFixed(2) + "%",
                            ...tempData[i]
                        }
                    })

                    tempMainData["current"] = tempData.sort((a, b) => descending(a.value, b.value))
                    legendData = tempMainData.current
            }

            if(tabSelected == "funnels"){
                dataFunnel = {...tempMainData}
            } else{
                data = {...tempMainData}
            }

        } catch (error) {
            console.warn(error);
        }
    }

    const handleSave = () => {
        let currentData  = JSON.parse(sessionStorage.getItem("customCharts"));
        if(tabSelected == "funnels"){
            if(prevBodyFunnel){
                currentData.push({
                    dataBody : prevBodyFunnel,
                    otherParams: otherParamsFunnels
                })
                $toastMessage.type = "success";
				$toastMessage.content = `Chart saved!`;
            } else {
                $toastMessage.type = "error";
				$toastMessage.content = 'Chart parameters insufficent'
            }
        } else {
            if(prevBody){
                currentData.push({
                    dataBody : prevBody,
                    otherParams
                })
                $toastMessage.type = "success";
				$toastMessage.content = `Chart saved!`;
            } else {
                $toastMessage.type = "error";
				$toastMessage.content = 'Chart parameters insufficent'
            }
        }

        sessionStorage.setItem("customCharts", JSON.stringify(currentData));
    }

    $: tabSelected, handleChartType()
    $: dateRange, (dateRange?.start && dateRange?.end) && handleCustomDateRange()
    $: dataBody, dataBodyFunnel,  selectedDayIndexes, selectedComparisonIndexes, processData()


</script>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->

    <div class="main" on:click={() => handleCloseSideMenu()}>
        <div class="container">
            <!-- left -->
            <div class = "container-left">
                <div class="header">
                    <div class={`tab insights-tab ${tabSelected == "insights" && "active-tab"}`} on:click={() => tabSelected = "insights"}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.2493 6.75C15.4919 6.75 16.4993 5.74264 16.4993 4.5C16.4993 3.25736 15.4919 2.25 14.2493 2.25C13.0066 2.25 11.9993 3.25736 11.9993 4.5C11.9993 5.74264 13.0066 6.75 14.2493 6.75Z" stroke={`${tabSelected == "insights" ? "white" : "#88888A"}`} stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16.5007 9V11.25C16.5007 11.6478 16.3427 12.0294 16.0614 12.3107C15.7801 12.592 15.3986 12.75 15.0007 12.75H3.00073C2.60291 12.75 2.22138 12.592 1.94007 12.3107C1.65877 12.0294 1.50073 11.6478 1.50073 11.25V3.75C1.50073 3.35218 1.65877 2.97064 1.94007 2.68934C2.22138 2.40804 2.60291 2.25 3.00073 2.25H9.75073" stroke={`${tabSelected == "insights" ? "white" : "#88888A" }`} stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9 12.75V15.75" stroke={`${tabSelected == "insights" ? "white" : "#88888A"}`} stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6.00073 15.75H12.0007" stroke={`${tabSelected == "insights" ? "white" : "#88888A"}`} stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Insights</span>
                            
                    </div>
                    <div class={`tab funnels-tab ${tabSelected == "funnels" && "active-tab"}`} on:click={() => tabSelected = "funnels"}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.0029 3.00037H3.00293C2.1745 3.00037 1.50293 3.67194 1.50293 4.50037V13.5004C1.50293 14.3288 2.1745 15.0004 3.00293 15.0004H15.0029C15.8314 15.0004 16.5029 14.3288 16.5029 13.5004V4.50037C16.5029 3.67194 15.8314 3.00037 15.0029 3.00037Z" stroke={`${tabSelected == "funnels" ? "white" : "#88888A"}`} stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15.0029 3.00037H3.00293C2.1745 3.00037 1.50293 3.67194 1.50293 4.50037V13.5004C1.50293 14.3288 2.1745 15.0004 3.00293 15.0004H15.0029C15.8314 15.0004 16.5029 14.3288 16.5029 13.5004V4.50037C16.5029 3.67194 15.8314 3.00037 15.0029 3.00037Z" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M7.49707 3.00037V6.00037" stroke={`${tabSelected == "funnels" ? "white" : "#88888A"}`} stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M7.49707 3.00037V6.00037" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M1.50293 5.99963H16.5029" stroke={`${tabSelected == "funnels" ? "white" : "#88888A"}`} stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M1.50293 5.99963H16.5029" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4.5 3.00024V6.00024" stroke={`${tabSelected == "funnels" ? "white" : "#88888A"}`} stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4.5 3.00024V6.00024" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Funnels</span>
                    </div>
                </div>
                <div class="content custom-bar">
                    {#if tabSelected == "insights"}
                        <div class="layer-tab">
                            <Layer
                                bind:dataBody = {dataBody}
                                bind:selectedSideMenuLayerClose
                                bind:selectedSideMenuLayer
                                {handleCloseSideMenu}
                                {dataBodyTracker},
                                main = {{
                                    text: "Select Event",
                                    name: "valueCalculation",
                                    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.6667 3.41669L10 5.00002" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M4.25004 6.66667L1.83337 6" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M4.99996 10L3.41663 11.6667" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M6 1.83331L6.66667 4.24998" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M7.5308 8.07502C7.49848 7.9989 7.48965 7.91486 7.50543 7.83368C7.52121 7.7525 7.56088 7.67789 7.61935 7.61941C7.67783 7.56094 7.75244 7.52127 7.83362 7.50549C7.9148 7.48971 7.99884 7.49854 8.07496 7.53086L17.2416 11.2809C17.3232 11.3143 17.3921 11.3728 17.4383 11.4479C17.4845 11.523 17.5057 11.6108 17.4989 11.6987C17.492 11.7867 17.4575 11.8701 17.4002 11.9371C17.3428 12.0042 17.2657 12.0513 17.18 12.0717L13.5558 12.9392C13.4062 12.9749 13.2694 13.0514 13.1605 13.1601C13.0517 13.2688 12.9751 13.4055 12.9391 13.555L12.0725 17.18C12.0523 17.2661 12.0052 17.3435 11.9381 17.4011C11.871 17.4587 11.7873 17.4934 11.6992 17.5002C11.611 17.5071 11.523 17.4858 11.4478 17.4393C11.3726 17.3928 11.3141 17.3236 11.2808 17.2417L7.5308 8.07502Z" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>`,
                                        data: events
                                    }}
                                    isMultple = {false}
                                    bind:dataOptionSelectedIndex = {dataBody.measurementType}
                                    dropDowns = {[
                                        {
                                            name: "measurementType",
                                            data: measurementType
                                        }
                                    ]}
                                    sideMenu = {
                                        [
                                            formula
                                        ]
                                    }
                            />
                        </div>

                        <div class="layer-tab">
                            <Layer
                                bind:dataBody = {dataBody}
                                bind:selectedSideMenuLayerClose
                                bind:selectedSideMenuLayer
                                {dataBodyTracker}
                                {handleCloseSideMenu}
                                main = {{
                                    name: "filters",
                                    text: "Filters",
                                    icon: ` <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.3333 1.5H0.666626L7.33329 9.38333V14.8333L10.6666 16.5V9.38333L17.3333 1.5Z" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>`
                                    }}
                                    isMultple = {true}
                                    sideMenu = {
                                        [
                                            showChildren,
                                            duplicate,
                                            remove
                                        ]
                                    }
                            />
                        </div>

                        <div class="layer-tab">
                            <Layer
                                bind:dataBody = {dataBody}
                                {dataBodyTracker}
                                bind:selectedSideMenuLayerClose
                                bind:selectedSideMenuLayer
                                {handleCloseSideMenu}
                                main = {{
                                    text: "Breakdown",
                                    name: "breakdown",
                                    icon: ` <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_721_11208)">
                                            <path d="M11.6666 11.6667V13.3334" stroke="#947AF0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M11.6666 16.6667V18.3334" stroke="#947AF0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M11.6666 1.66669V3.33335" stroke="#947AF0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M11.6666 6.66669V8.33335" stroke="#947AF0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M1.66663 12.5H8.33329" stroke="#947AF0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M1.66663 2.5H6.66663C7.10865 2.5 7.53258 2.67559 7.84514 2.98816C8.1577 3.30072 8.33329 3.72464 8.33329 4.16667V15.8333C8.33329 16.2754 8.1577 16.6993 7.84514 17.0118C7.53258 17.3244 7.10865 17.5 6.66663 17.5H1.66663" stroke="#947AF0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M1.66663 7.5H8.33329" stroke="#947AF0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M18.3333 12.5H15" stroke="#947AF0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M18.3333 2.5H16.6667C16.2246 2.5 15.8007 2.67559 15.4882 2.98816C15.1756 3.30072 15 3.72464 15 4.16667V15.8333C15 16.2754 15.1756 16.6993 15.4882 17.0118C15.8007 17.3244 16.2246 17.5 16.6667 17.5H18.3333" stroke="#947AF0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M18.3333 7.5H15" stroke="#947AF0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M4.16663 2.5V17.5" stroke="#947AF0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_721_11208">
                                            <rect width="20" height="20" fill="white"/>
                                            </clipPath>
                                            </defs>
                                            </svg>`    
                                        }}
                                    isMultple = {true}
                                    sideMenu = {
                                        [
                                            showChildren,
                                            duplicate,
                                            remove
                                        ]
                                    }
                            />
                        </div>

                        <div class="layer-tab">
                            <Layer
                                bind:dataBody = {dataBody}
                                {dataBodyTracker}
                                bind:selectedSideMenuLayerClose
                                bind:selectedSideMenuLayer
                                {handleCloseSideMenu}
                                main = {{
                                    text: "Traits",
                                    name: "traits",
                                    icon: ` <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.8333 5.83329L7.24996 2.24996C6.8736 1.87542 6.36425 1.66516 5.83329 1.66516C5.30233 1.66516 4.79298 1.87542 4.41662 2.24996L2.24996 4.41662C1.87542 4.79298 1.66516 5.30233 1.66516 5.83329C1.66516 6.36425 1.87542 6.8736 2.24996 7.24996L5.83329 10.8333" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M6.66663 5.00004L8.33329 3.33337" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M15 13.3333L16.6667 11.6666" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M14.1666 9.16663L17.75 12.75C18.5333 13.5333 18.5333 14.8 17.75 15.5833L15.5833 17.75C14.8 18.5333 13.5333 18.5333 12.75 17.75L9.16663 14.1666" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M17.645 5.6767C18.0856 5.23622 18.3332 4.63876 18.3333 4.01574C18.3333 3.39273 18.0859 2.79521 17.6454 2.35462C17.205 1.91403 16.6075 1.66646 15.9845 1.66638C15.3615 1.6663 14.764 1.91372 14.3234 2.3542L3.20169 13.4784C3.00821 13.6713 2.86512 13.9088 2.78503 14.17L1.68419 17.7967C1.66266 17.8688 1.66103 17.9453 1.67949 18.0182C1.69794 18.0912 1.73579 18.1577 1.78902 18.2109C1.84225 18.264 1.90888 18.3018 1.98183 18.3201C2.05477 18.3384 2.13133 18.3367 2.20336 18.315L5.83086 17.215C6.09183 17.1357 6.32934 16.9934 6.52253 16.8009L17.645 5.6767Z" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12.5 4.16663L15.8333 7.49996" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>`
                                    }}
                                    isMultple = {true}
                                    sideMenu = {
                                        [
                                            showChildrenTraits,
                                            duplicate,
                                            remove
                                        ]
                                    }
                            />
                        </div>
                    {:else}
                        <div class="layer-tab">
                            <Layer
                                bind:dataBody = {dataBodyFunnel}
                                dataBodyTracker = {dataBodyTrackerFunnel}
                                bind:selectedSideMenuLayerClose
                                bind:selectedSideMenuLayer
                                {handleCloseSideMenu}
                                main = {{
                                    name: "steps",
                                    text: "Steps",
                                    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.99984 5.83335C11.1504 5.83335 12.0832 4.90061 12.0832 3.75002C12.0832 2.59943 11.1504 1.66669 9.99984 1.66669C8.84924 1.66669 7.9165 2.59943 7.9165 3.75002C7.9165 4.90061 8.84924 5.83335 9.99984 5.83335Z" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M8.5 5.25L5.25 8.5" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M3.74984 12.0834C4.90043 12.0834 5.83317 11.1506 5.83317 10C5.83317 8.84943 4.90043 7.91669 3.74984 7.91669C2.59924 7.91669 1.6665 8.84943 1.6665 10C1.6665 11.1506 2.59924 12.0834 3.74984 12.0834Z" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M5.8335 10H14.1668" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M16.2498 12.0834C17.4004 12.0834 18.3332 11.1506 18.3332 10C18.3332 8.84943 17.4004 7.91669 16.2498 7.91669C15.0992 7.91669 14.1665 8.84943 14.1665 10C14.1665 11.1506 15.0992 12.0834 16.2498 12.0834Z" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M11.5 14.75L14.75 11.5" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M9.99984 18.3334C11.1504 18.3334 12.0832 17.4006 12.0832 16.25C12.0832 15.0994 11.1504 14.1667 9.99984 14.1667C8.84924 14.1667 7.9165 15.0994 7.9165 16.25C7.9165 17.4006 8.84924 18.3334 9.99984 18.3334Z" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>`
                                    }}
                                    isMultple = {true}
                                    sideMenu = {
                                        [
                                            addFilter,
                                            renameEvent,
                                            duplicate,
                                            remove
                                        ]
                                    }

                                    subSideMenu = {
                                        [
                                            remove
                                        ]
                                    }
                            />
                        </div>

                        <div class="layer-tab">
                            <Layer
                                bind:dataBody = {dataBodyFunnel}
                                dataBodyTracker = {dataBodyTrackerFunnel}
                                bind:selectedSideMenuLayerClose
                                bind:selectedSideMenuLayer
                                {handleCloseSideMenu}
                                main = {{
                                    name: "filters",
                                    text: "Filters",
                                    icon: ` <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.3333 1.5H0.666626L7.33329 9.38333V14.8333L10.6666 16.5V9.38333L17.3333 1.5Z" stroke="#947AF0" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>`
                                    }}
                                    isMultple = {true}
                                    sideMenu = {
                                        [
                                            showChildren,
                                            duplicate,
                                            remove
                                        ]
                                    }
                            />
                        </div>
                    {/if}
                </div>
            </div>
            <!-- right -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class = "container-right">
                <div class="header">
                    <div class="left">
                        <div class = "chart-header">
                            {#if hasRangeSelector}
                                <div class="chart-selection-wrapper">
                                    <div class="tab-toggler">
                                        {#each selectableDays as selectItem, _index}
                                            {#if selectItem.name == "Custom"}
                                                <div
                                                    class:active={
                                                        tabSelected == "funnels"
                                                            ? otherParamsFunnels.selectedDayIndexes === _index
                                                            : otherParams.selectedDayIndexes === _index
                                                    }
                                                    on:click={() => handleCustomData(_index)}
                                                >
                                                    {selectItem.name}
                                                    <div class="date-picker-dash" id = "date-picker-page-view" bind:this = {dateElement}>
                                                        <DatePicker selectedOption={2} bind:dateRange={dateRange} />
                                                    </div>
                                                </div>
                                            {:else}
                                                <div
                                                class:active={
                                                    tabSelected == "funnels"
                                                        ? otherParamsFunnels.selectedDayIndexes === _index
                                                        : otherParams.selectedDayIndexes === _index
                                                }
                                                    on:click={() => {
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
                                                class:active={
                                                    tabSelected == "funnels"
                                                        ? comparisonDays.findIndex((d) => d.value == otherParamsFunnels.accuracy) === _index
                                                        : comparisonDays.findIndex((d) => d.value == otherParams.accuracy) === _index
                                                }
                                                on:click={() => {
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
                        {#if tabSelected == "insights"}
                            <DropdownType2
                                title={chartTypeObj[dataBody.displayOptions.chartType].id}
                                icon={chartTypeObj[dataBody.displayOptions.chartType].icon}
                                actions={chartTypeObj.filter((d) => d.id != "funnel")}
                                bind:selectedIndex={dataBody.displayOptions.chartType}
                            />
                        {/if}
                    </div>
                    <div class="right flex">
                        <div class="cta-button secondary" on:click={() => handleModalClose()}>Close</div>
                        <div class="cta-button primary" on:click={() =>  handleSave()}>Save</div>
                    </div>
                </div>

                <!-- CONTENT -->
                <div class="content" bind:clientWidth={clientWidth} bind:clientHeight = {clientHeight}>
                    {#if tabSelected == "insights"}
                        {#if data && Object.keys(data).length > 0 }
                            {#if data.current.length < 1}
                                <div class="spinner">
                                    <p>Insufficient Data</p>
                                </div>
                            {:else}
                            {#if  (type == "multiline" && data.current.length > 1 && showLegend)|| (type == "radial" && showLegend)}
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
                                {isTimeScale}
                                dataProperty = {Date.now()}
                                headline = ""
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
                        {/if}
                            {/if}
                        {:else if  resInsight}
                            <div class="spinner">
                                {@html spinner}
                            </div>
                        {:else}
                            <div class="center">
                                <svg width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M200.997 154.878V172.709C200.997 173.107 200.839 173.488 200.558 173.77C200.276 174.051 199.895 174.209 199.497 174.209C199.099 174.209 198.718 174.051 198.436 173.77C198.155 173.488 197.997 173.107 197.997 172.709V154.878H200.997ZM199.497 115.915C199.895 115.915 200.276 116.073 200.558 116.354C200.839 116.636 200.997 117.017 200.997 117.415V124.762H215.492L215.434 124.619C215.355 124.436 215.313 124.239 215.311 124.04C215.309 123.84 215.347 123.642 215.422 123.458C215.498 123.273 215.609 123.105 215.75 122.964C215.891 122.823 216.058 122.712 216.243 122.636C216.428 122.561 216.625 122.523 216.825 122.524C217.024 122.526 217.221 122.568 217.404 122.647C217.587 122.725 217.753 122.84 217.891 122.984C218.03 123.127 218.138 123.297 218.21 123.483L218.734 124.762H223.066C223.464 124.762 223.845 124.92 224.127 125.201C224.408 125.483 224.566 125.864 224.566 126.262C224.566 126.66 224.408 127.041 224.127 127.323C223.845 127.604 223.464 127.762 223.066 127.762H219.961L227.986 147.378H251.176L238.142 131.26C238.017 131.107 237.924 130.931 237.868 130.741C237.811 130.552 237.793 130.354 237.813 130.157C237.834 129.961 237.893 129.771 237.987 129.597C238.081 129.424 238.209 129.27 238.362 129.146C238.516 129.022 238.692 128.93 238.882 128.874C239.071 128.818 239.27 128.8 239.466 128.821C239.662 128.843 239.852 128.902 240.025 128.997C240.199 129.092 240.351 129.22 240.475 129.374L255.034 147.378H276.933L253.831 128.152L253.362 127.762H242.536C242.138 127.762 241.757 127.604 241.475 127.323C241.194 127.041 241.036 126.66 241.036 126.262C241.036 125.864 241.194 125.483 241.475 125.201C241.757 124.92 242.138 124.762 242.536 124.762H249.758L246.965 122.438C246.812 122.312 246.685 122.158 246.592 121.983C246.499 121.808 246.441 121.617 246.423 121.42C246.404 121.223 246.424 121.024 246.483 120.835C246.541 120.646 246.637 120.47 246.763 120.318C246.89 120.166 247.046 120.04 247.221 119.948C247.396 119.857 247.588 119.801 247.786 119.783C247.983 119.766 248.182 119.788 248.37 119.848C248.559 119.908 248.734 120.005 248.885 120.133L254.447 124.762H266.795L263.259 122.559C262.932 122.343 262.703 122.009 262.62 121.627C262.536 121.244 262.605 120.845 262.812 120.513C263.019 120.18 263.347 119.942 263.727 119.849C264.107 119.755 264.509 119.814 264.846 120.012L272.468 124.762H277.646C278.044 124.762 278.425 124.92 278.707 125.201C278.988 125.483 279.146 125.864 279.146 126.262C279.146 126.66 278.988 127.041 278.707 127.323C278.425 127.604 278.044 127.762 277.646 127.762H277.283L308.763 147.378H328.248L292.83 129.818C292.474 129.641 292.202 129.33 292.075 128.953C291.948 128.576 291.976 128.164 292.152 127.807C292.329 127.451 292.64 127.179 293.017 127.052C293.394 126.925 293.807 126.953 294.163 127.13L381.896 170.628C382.25 170.806 382.518 171.117 382.644 171.493C382.769 171.869 382.741 172.279 382.565 172.633C382.389 172.988 382.08 173.259 381.705 173.387C381.33 173.515 380.92 173.489 380.564 173.316L333.883 150.172C333.653 150.307 333.391 150.379 333.124 150.378H313.577L347.372 171.436C347.703 171.65 347.936 171.984 348.022 172.368C348.108 172.753 348.039 173.155 347.831 173.489C347.623 173.823 347.292 174.062 346.909 174.154C346.527 174.246 346.123 174.184 345.786 173.982L307.905 150.378H285.228L310.676 171.556C310.966 171.815 311.143 172.177 311.172 172.564C311.2 172.952 311.077 173.336 310.828 173.634C310.58 173.933 310.225 174.124 309.839 174.166C309.452 174.209 309.065 174.1 308.757 173.862L280.538 150.378H257.46L274.757 171.766C275.007 172.075 275.124 172.471 275.082 172.867C275.041 173.263 274.843 173.626 274.534 173.876C274.225 174.126 273.828 174.243 273.433 174.201C273.037 174.16 272.674 173.962 272.424 173.653L253.602 150.378H229.213L238.116 172.142C238.196 172.325 238.239 172.523 238.242 172.723C238.245 172.923 238.208 173.122 238.132 173.307C238.057 173.493 237.946 173.661 237.805 173.803C237.663 173.945 237.495 174.057 237.31 174.133C237.125 174.208 236.926 174.246 236.726 174.244C236.526 174.242 236.328 174.2 236.145 174.12C235.961 174.04 235.795 173.925 235.657 173.78C235.519 173.635 235.411 173.464 235.34 173.277L225.972 150.378H205.124V147.378H224.744L216.72 127.762H200.997V142.878H197.997V127.762H182.591L174.429 147.378H193.124V150.378H173.181L163.65 173.286C163.574 173.468 163.464 173.633 163.324 173.772C163.184 173.911 163.019 174.021 162.837 174.096C162.655 174.172 162.459 174.21 162.262 174.21C162.065 174.209 161.87 174.17 161.688 174.094C161.507 174.019 161.341 173.908 161.202 173.768C161.063 173.629 160.953 173.463 160.878 173.281C160.803 173.099 160.764 172.904 160.765 172.707C160.765 172.51 160.804 172.315 160.88 172.133L169.932 150.378H154.124C153.726 150.378 153.345 150.22 153.063 149.939C152.782 149.657 152.624 149.276 152.624 148.878C152.624 148.48 152.782 148.099 153.063 147.817C153.345 147.536 153.726 147.378 154.124 147.378H171.18L179.341 127.762H172.218C171.82 127.762 171.439 127.604 171.157 127.323C170.876 127.041 170.718 126.66 170.718 126.262C170.718 125.864 170.876 125.483 171.157 125.201C171.439 124.92 171.82 124.762 172.218 124.762H180.589L181.892 121.631C181.968 121.449 182.078 121.284 182.218 121.145C182.358 121.006 182.523 120.896 182.705 120.82C182.887 120.745 183.083 120.707 183.28 120.707C183.477 120.708 183.672 120.747 183.853 120.822C184.035 120.898 184.201 121.009 184.34 121.149C184.479 121.288 184.589 121.454 184.664 121.636C184.739 121.818 184.778 122.013 184.777 122.21C184.777 122.407 184.738 122.602 184.662 122.784L183.839 124.762H197.997V117.415C197.997 117.017 198.155 116.636 198.436 116.354C198.718 116.073 199.099 115.915 199.497 115.915ZM281.623 147.378H303.09L272.429 128.272L271.61 127.762H258.052L281.623 147.378ZM140.312 154.405C140.62 154.656 140.816 155.02 140.856 155.415C140.897 155.811 140.778 156.207 140.527 156.515L135.873 162.229L126.565 173.657C126.314 173.965 125.95 174.161 125.554 174.202C125.159 174.242 124.763 174.124 124.454 173.872C124.146 173.621 123.95 173.258 123.91 172.862C123.869 172.466 123.988 172.07 124.239 171.762L133.547 160.335L138.201 154.621C138.325 154.468 138.479 154.341 138.652 154.248C138.826 154.154 139.016 154.096 139.212 154.076C139.408 154.056 139.606 154.074 139.795 154.131C139.983 154.187 140.159 154.28 140.312 154.405ZM111.764 154.609C112.018 154.915 112.141 155.309 112.105 155.705C112.069 156.101 111.877 156.466 111.571 156.721L104.705 162.435L90.974 173.862C90.8226 173.988 90.6478 174.083 90.4597 174.142C90.2716 174.2 90.0737 174.221 89.8775 174.203C89.6813 174.185 89.4905 174.129 89.3161 174.037C89.1417 173.945 88.9871 173.82 88.861 173.669C88.7349 173.518 88.6399 173.343 88.5814 173.155C88.5229 172.967 88.502 172.769 88.5199 172.573C88.5378 172.376 88.5942 172.186 88.6858 172.011C88.7775 171.837 88.9026 171.682 89.054 171.556L102.786 160.129L109.652 154.415C109.958 154.161 110.352 154.038 110.748 154.075C111.144 154.111 111.51 154.303 111.764 154.609ZM79.86 156.065C80.0703 156.403 80.1378 156.81 80.0478 157.197C79.9578 157.585 79.7176 157.921 79.38 158.131L72.284 162.555L53.944 173.982C53.7768 174.09 53.5897 174.164 53.3938 174.199C53.1978 174.234 52.9968 174.229 52.8025 174.186C52.6082 174.143 52.4245 174.061 52.2621 173.946C52.0998 173.831 51.9619 173.684 51.8566 173.515C51.7514 173.346 51.6808 173.158 51.649 172.962C51.6173 172.765 51.6249 172.564 51.6716 172.371C51.7183 172.177 51.803 171.995 51.9208 171.834C52.0387 171.674 52.1873 171.538 52.358 171.436L70.698 160.009L77.793 155.585C77.9602 155.481 78.1463 155.41 78.3407 155.378C78.5351 155.346 78.734 155.352 78.9259 155.397C79.1179 155.441 79.2992 155.523 79.4595 155.638C79.6197 155.753 79.7558 155.898 79.86 156.065Z" fill="#947AF0" fill-opacity="0.15"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M199.114 25.434L199.865 25L200.616 25.434L224.208 39.074L224.957 39.506V68.516L224.208 68.949L203.032 81.191L288.528 123.762L354.063 45.102C353.279 43.8701 352.971 42.3946 353.197 40.952C353.423 39.5095 354.168 38.1988 355.291 37.2657C356.414 36.3326 357.839 35.8411 359.298 35.8832C360.758 35.9254 362.152 36.4984 363.219 37.4948C364.287 38.4912 364.954 39.8427 365.096 41.2959C365.239 42.7491 364.846 44.2044 363.992 45.3889C363.139 46.5735 361.882 47.4061 360.459 47.7306C359.035 48.0552 357.542 47.8495 356.259 47.152L289.857 126.854C289.661 127.089 289.397 127.259 289.102 127.34C288.806 127.421 288.493 127.41 288.204 127.308L247.606 112.937L237.574 126.774C237.388 127.03 237.126 127.221 236.826 127.319C236.525 127.418 236.201 127.419 235.9 127.322L215.257 120.687C215.163 120.656 215.072 120.616 214.985 120.568L200.135 112.28H199.313L186.15 117.921C185.993 118.027 185.817 118.103 185.632 118.144L164.665 127.129L145.728 150.072C145.587 150.243 145.411 150.38 145.21 150.474C145.01 150.568 144.792 150.617 144.571 150.617H91.404L91.176 150.759C90.876 150.946 90.536 151.014 90.21 150.976L18.95 173.403C18.872 173.428 18.792 173.446 18.711 173.458C18.358 173.509 17.9985 173.432 17.697 173.242C17.3954 173.051 17.1715 172.76 17.0654 172.419C16.9594 172.079 16.9781 171.712 17.1182 171.384C17.2583 171.056 17.5107 170.789 17.83 170.63L64.124 147.483V147.378H64.334L104.746 127.172C104.457 125.866 104.612 124.501 105.187 123.294C105.763 122.087 106.725 121.106 107.921 120.508C109.117 119.91 110.479 119.729 111.79 119.993C113.101 120.257 114.286 120.952 115.157 121.967L196.703 81.194L175.522 68.949L174.773 68.516V39.506L175.522 39.073L199.114 25.434ZM107.966 127.239C108.001 127.31 108.03 127.381 108.053 127.454C108.446 128.095 109.065 128.565 109.788 128.771C110.511 128.977 111.284 128.904 111.956 128.567C112.628 128.229 113.149 127.652 113.415 126.95C113.682 126.247 113.675 125.47 113.396 124.772C113.307 124.643 113.238 124.502 113.191 124.353C112.808 123.695 112.188 123.208 111.459 122.99C110.73 122.772 109.945 122.839 109.263 123.178C108.581 123.517 108.054 124.103 107.788 124.816C107.522 125.53 107.538 126.317 107.831 127.02C107.881 127.088 107.926 127.161 107.966 127.239ZM71.043 147.378L106.106 129.846C106.805 130.637 107.7 131.23 108.701 131.565C109.702 131.9 110.774 131.966 111.808 131.754C112.843 131.543 113.803 131.062 114.592 130.362C115.382 129.661 115.973 128.764 116.305 127.762H122.421L90.93 147.378H71.043ZM127.238 124.762H116.503L116.482 124.658L141.238 112.28H147.276L127.238 124.762ZM36.038 164.88L82.118 150.378H65.043L36.038 164.88ZM103.124 147.617H117.489L141.445 127.762H128.096L96.604 147.378H103.124V147.617ZM122.19 147.617H143.864L160.253 127.762H146.146L122.19 147.617ZM168.121 122.384L184.171 115.506L185.497 112.28H176.403L168.121 122.384ZM188.109 113.818L191.697 112.28H188.741L188.109 113.818ZM206.291 112.28L211.432 115.15L210.252 112.28H206.291ZM215.642 117.5L216.317 117.876L231.815 122.858L223 112.28H213.496L215.642 117.5ZM236.248 123.491L240.71 117.338L234.686 112.28H226.906L236.248 123.491ZM242.475 114.903L244.376 112.28H239.351L242.475 114.903ZM254.741 112.28L268.571 117.176L258.739 112.28H254.741ZM247.621 109.28L227.365 96.659L252.714 109.28H247.621ZM171.842 96.978L147.238 109.28H152.092L171.842 96.978ZM228.287 102.992L217.65 94.14L241.949 109.28H235.778L228.292 102.996L228.287 102.992ZM181.823 94.295L157.767 109.28H163.744L181.823 94.295ZM152.95 112.28L132.912 124.762H145.064L160.124 112.28H152.95ZM224.406 109.28L209.136 90.957L226.363 105.294L226.368 105.298L231.112 109.28H224.406ZM188.836 92.38L168.445 109.28H174.983L188.836 92.38ZM164.825 112.28L149.766 124.762H162.293L172.524 112.28H164.825ZM212.262 109.28L204.233 89.76L220.5 109.28H212.262ZM194.656 90.01L178.862 109.28H186.731L194.656 90.01ZM200.996 109.28V89.777L209.018 109.28H200.996ZM197.996 89.777L189.975 109.28H197.996V89.777ZM206.124 52.544L221.957 43.024V65.102L206.124 56.315V52.544ZM206.124 49.044L220.504 40.397L201.365 29.333V48.878H206.124V49.044ZM198.365 48.878H194.124V49.355L179.226 40.397L198.365 29.333V48.878ZM194.124 52.855L177.773 43.024V65.138L194.124 56.326V52.855ZM194.124 59.734L179.349 67.696L198.365 78.69V60.878H194.124V59.734ZM201.365 60.878V78.69L220.414 67.677L206.124 59.746V60.878H201.365ZM197.124 51.878H203.124V57.878H197.124V51.878ZM360.313 51.062C360.507 51.0261 360.706 51.0288 360.898 51.0698C361.091 51.1108 361.274 51.1893 361.436 51.301C361.598 51.4126 361.737 51.5551 361.844 51.7203C361.952 51.8856 362.025 52.0703 362.061 52.264L362.071 52.313C362.144 52.7042 362.058 53.1082 361.832 53.4361C361.607 53.764 361.261 53.989 360.87 54.0615C360.478 54.134 360.074 54.0482 359.746 53.8229C359.418 53.5976 359.194 53.2512 359.121 52.86L359.112 52.81C359.04 52.419 359.125 52.0151 359.351 51.6873C359.576 51.3596 359.922 51.1346 360.313 51.062ZM361.779 58.965C362.17 58.8926 362.574 58.9784 362.902 59.2036C363.229 59.4288 363.454 59.775 363.527 60.166L363.545 60.265C363.618 60.6562 363.532 61.0602 363.306 61.3881C363.081 61.716 362.735 61.941 362.344 62.0135C361.952 62.086 361.548 62.0002 361.22 61.7749C360.892 61.5495 360.668 61.2032 360.595 60.812L360.577 60.713C360.541 60.5193 360.544 60.3204 360.585 60.1278C360.626 59.9351 360.704 59.7524 360.816 59.59C360.928 59.4277 361.07 59.289 361.235 59.1817C361.401 59.0745 361.585 59.0008 361.779 58.965ZM363.253 66.917C363.644 66.8446 364.048 66.9304 364.376 67.1556C364.703 67.3808 364.928 67.727 365.001 68.118L365.02 68.216C365.093 68.6072 365.007 69.0112 364.781 69.3391C364.556 69.667 364.21 69.892 363.819 69.9645C363.427 70.037 363.023 69.9512 362.695 69.7259C362.367 69.5005 362.143 69.1542 362.07 68.763L362.052 68.665C361.98 68.2739 362.065 67.8701 362.291 67.5423C362.516 67.2146 362.862 66.9896 363.253 66.917ZM364.728 74.869C365.119 74.7966 365.523 74.8824 365.851 75.1076C366.178 75.3328 366.403 75.679 366.476 76.07L366.494 76.168C366.567 76.5592 366.481 76.9632 366.255 77.2911C366.03 77.619 365.684 77.844 365.293 77.9165C364.901 77.989 364.497 77.9032 364.169 77.6779C363.841 77.4526 363.617 77.1062 363.544 76.715L363.526 76.617C363.49 76.4233 363.493 76.2244 363.534 76.0318C363.575 75.8391 363.653 75.6564 363.765 75.494C363.877 75.3317 364.019 75.193 364.184 75.0857C364.35 74.9785 364.534 74.9048 364.728 74.869ZM366.202 82.82C366.396 82.7841 366.595 82.7868 366.787 82.8278C366.98 82.8688 367.163 82.9473 367.325 83.059C367.487 83.1706 367.626 83.3131 367.733 83.4783C367.841 83.6435 367.914 83.8283 367.95 84.022L367.969 84.12C368.042 84.5112 367.956 84.9152 367.73 85.2431C367.505 85.571 367.159 85.796 366.767 85.8685C366.376 85.941 365.972 85.8552 365.644 85.6299C365.316 85.4045 365.092 85.0582 365.019 84.667L365.001 84.569C364.965 84.3753 364.967 84.1764 365.008 83.9837C365.049 83.7909 365.128 83.6081 365.239 83.4457C365.351 83.2833 365.493 83.1444 365.658 83.0371C365.824 82.9297 366.008 82.856 366.202 82.82ZM367.677 90.772C367.871 90.7361 368.07 90.7388 368.262 90.7798C368.455 90.8208 368.638 90.8993 368.8 91.011C368.962 91.1226 369.101 91.2651 369.208 91.4303C369.315 91.5956 369.389 91.7803 369.425 91.974L369.443 92.072C369.479 92.2657 369.476 92.4646 369.435 92.6573C369.394 92.85 369.316 93.0327 369.204 93.1951C369.093 93.3575 368.95 93.4963 368.785 93.6036C368.62 93.7109 368.435 93.7846 368.241 93.8205C368.048 93.8564 367.849 93.8538 367.656 93.8129C367.464 93.7719 367.281 93.6935 367.118 93.5819C366.956 93.4703 366.817 93.3278 366.71 93.1626C366.603 92.9974 366.529 92.8127 366.493 92.619L366.475 92.521C366.439 92.3272 366.442 92.1283 366.482 91.9355C366.523 91.7427 366.602 91.5598 366.714 91.3974C366.825 91.235 366.968 91.0961 367.133 90.9888C367.298 90.8815 367.483 90.8078 367.677 90.772ZM369.151 98.724C369.542 98.6516 369.946 98.7374 370.274 98.9626C370.601 99.1878 370.826 99.534 370.899 99.925L370.918 100.024C370.991 100.415 370.905 100.819 370.679 101.147C370.454 101.475 370.108 101.7 369.716 101.772C369.325 101.845 368.921 101.759 368.593 101.534C368.266 101.309 368.041 100.962 367.968 100.571L367.95 100.472C367.878 100.081 367.963 99.6771 368.189 99.3493C368.414 99.0216 368.76 98.7966 369.151 98.724ZM370.626 106.676C371.017 106.604 371.421 106.689 371.749 106.915C372.076 107.14 372.301 107.486 372.374 107.877L372.392 107.975C372.465 108.366 372.379 108.77 372.153 109.098C371.928 109.426 371.582 109.651 371.19 109.724C370.799 109.796 370.395 109.71 370.067 109.485C369.74 109.26 369.515 108.913 369.442 108.522L369.424 108.424C369.388 108.23 369.391 108.031 369.432 107.839C369.473 107.646 369.551 107.463 369.663 107.301C369.775 107.139 369.917 107 370.082 106.893C370.248 106.785 370.432 106.712 370.626 106.676ZM372.1 114.628C372.491 114.556 372.895 114.641 373.223 114.867C373.55 115.092 373.775 115.438 373.848 115.829L373.867 115.927C373.903 116.121 373.9 116.32 373.859 116.512C373.818 116.705 373.74 116.888 373.628 117.05C373.517 117.212 373.374 117.351 373.209 117.459C373.044 117.566 372.859 117.64 372.665 117.675C372.472 117.711 372.273 117.709 372.08 117.668C371.888 117.627 371.705 117.548 371.542 117.437C371.38 117.325 371.241 117.183 371.134 117.018C371.027 116.852 370.953 116.668 370.917 116.474L370.899 116.376C370.827 115.985 370.912 115.581 371.138 115.253C371.363 114.926 371.709 114.701 372.1 114.628ZM373.575 122.58C373.769 122.544 373.967 122.547 374.16 122.587C374.353 122.628 374.536 122.707 374.698 122.818C374.86 122.93 374.999 123.072 375.106 123.237C375.214 123.403 375.287 123.587 375.323 123.781L375.341 123.879C375.414 124.27 375.328 124.674 375.102 125.002C374.877 125.33 374.531 125.555 374.139 125.628C373.748 125.7 373.344 125.614 373.016 125.389C372.689 125.164 372.464 124.817 372.391 124.426L372.373 124.328C372.337 124.134 372.34 123.935 372.381 123.743C372.422 123.55 372.5 123.367 372.612 123.205C372.724 123.043 372.866 122.904 373.031 122.797C373.197 122.689 373.381 122.616 373.575 122.58ZM375.049 130.531C375.243 130.495 375.442 130.498 375.634 130.539C375.827 130.58 376.01 130.658 376.172 130.77C376.334 130.882 376.473 131.024 376.58 131.189C376.688 131.355 376.761 131.539 376.797 131.733L376.816 131.831C376.889 132.222 376.803 132.626 376.577 132.954C376.352 133.282 376.006 133.507 375.615 133.579C375.223 133.652 374.819 133.566 374.491 133.341C374.164 133.116 373.939 132.769 373.866 132.378L373.848 132.28C373.812 132.086 373.814 131.887 373.855 131.695C373.896 131.502 373.975 131.319 374.086 131.157C374.198 130.994 374.34 130.855 374.505 130.748C374.671 130.641 374.855 130.567 375.049 130.531ZM376.524 138.483C376.718 138.447 376.917 138.45 377.109 138.491C377.302 138.532 377.485 138.61 377.647 138.722C377.809 138.834 377.948 138.976 378.055 139.141C378.163 139.307 378.236 139.491 378.272 139.685L378.29 139.783C378.363 140.174 378.277 140.578 378.051 140.906C377.826 141.234 377.48 141.459 377.089 141.531C376.697 141.604 376.293 141.518 375.965 141.293C375.638 141.068 375.413 140.721 375.34 140.33L375.322 140.232C375.286 140.038 375.289 139.839 375.329 139.646C375.37 139.454 375.449 139.271 375.561 139.108C375.672 138.946 375.815 138.807 375.98 138.7C376.145 138.593 376.33 138.519 376.524 138.483ZM377.998 146.435C378.389 146.363 378.793 146.448 379.121 146.674C379.448 146.899 379.673 147.245 379.746 147.636L379.765 147.735C379.838 148.126 379.752 148.53 379.526 148.858C379.301 149.186 378.955 149.411 378.564 149.484C378.172 149.556 377.768 149.47 377.44 149.245C377.112 149.02 376.888 148.673 376.815 148.282L376.797 148.183C376.725 147.792 376.81 147.388 377.036 147.06C377.261 146.733 377.607 146.508 377.998 146.435ZM379.473 154.387C379.864 154.315 380.268 154.4 380.596 154.626C380.923 154.851 381.148 155.197 381.221 155.588L381.239 155.686C381.275 155.88 381.272 156.079 381.231 156.271C381.19 156.464 381.112 156.647 381 156.809C380.889 156.971 380.746 157.11 380.581 157.218C380.416 157.325 380.231 157.399 380.038 157.434C379.844 157.47 379.645 157.468 379.452 157.427C379.26 157.386 379.077 157.307 378.914 157.196C378.752 157.084 378.613 156.942 378.506 156.777C378.399 156.611 378.325 156.427 378.289 156.233L378.271 156.135C378.235 155.941 378.238 155.742 378.279 155.55C378.32 155.357 378.398 155.174 378.51 155.012C378.622 154.85 378.764 154.711 378.929 154.604C379.095 154.497 379.279 154.423 379.473 154.387ZM380.947 162.339C381.141 162.303 381.34 162.306 381.532 162.346C381.725 162.387 381.908 162.466 382.07 162.577C382.232 162.689 382.371 162.831 382.478 162.996C382.586 163.162 382.659 163.346 382.695 163.54L382.705 163.589C382.778 163.98 382.692 164.384 382.466 164.712C382.241 165.04 381.895 165.265 381.504 165.337C381.112 165.41 380.708 165.324 380.38 165.099C380.052 164.874 379.828 164.527 379.755 164.136L379.746 164.087C379.674 163.696 379.759 163.292 379.985 162.964C380.21 162.637 380.556 162.412 380.947 162.339ZM359.124 44.878C358.328 44.878 357.565 44.5619 357.003 43.9993C356.44 43.4367 356.124 42.6736 356.124 41.878C356.124 41.0823 356.44 40.3193 357.003 39.7567C357.565 39.1941 358.328 38.878 359.124 38.878C359.92 38.878 360.683 39.1941 361.245 39.7567C361.808 40.3193 362.124 41.0823 362.124 41.878C362.124 42.6736 361.808 43.4367 361.245 43.9993C360.683 44.5619 359.92 44.878 359.124 44.878Z" fill="#947AF0" fill-opacity="0.3"/>
                                    <path d="M194.624 144.378H203.624V153.378H194.624V144.378Z" stroke="#947AF0" stroke-opacity="0.3" stroke-width="3"/>
                                </svg>
                                <span>Select an event to get started</span>
                            </div>
                        {/if}
                    {/if}

                    {#if tabSelected == "funnels"}
                        {#if dataFunnel && Object.keys(dataFunnel).length > 0 }
                                <BarLine
                                    data = {dataFunnel}
                                    {type}
                                    {chartType}
                                    {width}
                                    {height}
                                    {strokeColor1}
                                    {strokeColor2}
                                    dataProperty = {Date.now()}
                                    headline = ""
                                    {margin}
                                    {hasComparison}
                                    {relatedBar}
                                />
                                {:else if  resFunnel && allowFetch}
                            <div class="spinner">
                                {@html spinner}
                            </div>
                        {:else}
                            <div class="center">
                                <svg width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M76.5 70C76.5 70.663 76.2366 71.2989 75.7678 71.7678C75.2989 72.2366 74.663 72.5 74 72.5C73.337 72.5 72.7011 72.2366 72.2322 71.7678C71.7634 71.2989 71.5 70.663 71.5 70C71.5 69.337 71.7634 68.7011 72.2322 68.2322C72.7011 67.7634 73.337 67.5 74 67.5C74.663 67.5 75.2989 67.7634 75.7678 68.2322C76.2366 68.7011 76.5 69.337 76.5 70ZM159 72.5C159.663 72.5 160.299 72.2366 160.768 71.7678C161.237 71.2989 161.5 70.663 161.5 70C161.5 69.337 161.237 68.7011 160.768 68.2322C160.299 67.7634 159.663 67.5 159 67.5C158.337 67.5 157.701 67.7634 157.232 68.2322C156.763 68.7011 156.5 69.337 156.5 70C156.5 70.663 156.763 71.2989 157.232 71.7678C157.701 72.2366 158.337 72.5 159 72.5ZM191 89.5C191.663 89.5 192.299 89.2366 192.768 88.7678C193.237 88.2989 193.5 87.663 193.5 87C193.5 86.337 193.237 85.7011 192.768 85.2322C192.299 84.7634 191.663 84.5 191 84.5C190.337 84.5 189.701 84.7634 189.232 85.2322C188.763 85.7011 188.5 86.337 188.5 87C188.5 87.663 188.763 88.2989 189.232 88.7678C189.701 89.2366 190.337 89.5 191 89.5ZM234 89.5C234.663 89.5 235.299 89.2366 235.768 88.7678C236.237 88.2989 236.5 87.663 236.5 87C236.5 86.337 236.237 85.7011 235.768 85.2322C235.299 84.7634 234.663 84.5 234 84.5C233.337 84.5 232.701 84.7634 232.232 85.2322C231.763 85.7011 231.5 86.337 231.5 87C231.5 87.663 231.763 88.2989 232.232 88.7678C232.701 89.2366 233.337 89.5 234 89.5ZM276.5 87C276.5 87.663 276.237 88.2989 275.768 88.7678C275.299 89.2366 274.663 89.5 274 89.5C273.337 89.5 272.701 89.2366 272.232 88.7678C271.763 88.2989 271.5 87.663 271.5 87C271.5 86.337 271.763 85.7011 272.232 85.2322C272.701 84.7634 273.337 84.5 274 84.5C274.663 84.5 275.299 84.7634 275.768 85.2322C276.237 85.7011 276.5 86.337 276.5 87ZM204.5 70C204.5 70.663 204.237 71.2989 203.768 71.7678C203.299 72.2366 202.663 72.5 202 72.5C201.337 72.5 200.701 72.2366 200.232 71.7678C199.763 71.2989 199.5 70.663 199.5 70C199.5 69.337 199.763 68.7011 200.232 68.2322C200.701 67.7634 201.337 67.5 202 67.5C202.663 67.5 203.299 67.7634 203.768 68.2322C204.237 68.7011 204.5 69.337 204.5 70ZM244 72.5C244.663 72.5 245.299 72.2366 245.768 71.7678C246.237 71.2989 246.5 70.663 246.5 70C246.5 69.337 246.237 68.7011 245.768 68.2322C245.299 67.7634 244.663 67.5 244 67.5C243.337 67.5 242.701 67.7634 242.232 68.2322C241.763 68.7011 241.5 69.337 241.5 70C241.5 70.663 241.763 71.2989 242.232 71.7678C242.701 72.2366 243.337 72.5 244 72.5ZM287.5 70C287.5 70.663 287.237 71.2989 286.768 71.7678C286.299 72.2366 285.663 72.5 285 72.5C284.337 72.5 283.701 72.2366 283.232 71.7678C282.763 71.2989 282.5 70.663 282.5 70C282.5 69.337 282.763 68.7011 283.232 68.2322C283.701 67.7634 284.337 67.5 285 67.5C285.663 67.5 286.299 67.7634 286.768 68.2322C287.237 68.7011 287.5 69.337 287.5 70ZM180 72.5C180.663 72.5 181.299 72.2366 181.768 71.7678C182.237 71.2989 182.5 70.663 182.5 70C182.5 69.337 182.237 68.7011 181.768 68.2322C181.299 67.7634 180.663 67.5 180 67.5C179.337 67.5 178.701 67.7634 178.232 68.2322C177.763 68.7011 177.5 69.337 177.5 70C177.5 70.663 177.763 71.2989 178.232 71.7678C178.701 72.2366 179.337 72.5 180 72.5ZM225.5 70C225.5 70.663 225.237 71.2989 224.768 71.7678C224.299 72.2366 223.663 72.5 223 72.5C222.337 72.5 221.701 72.2366 221.232 71.7678C220.763 71.2989 220.5 70.663 220.5 70C220.5 69.337 220.763 68.7011 221.232 68.2322C221.701 67.7634 222.337 67.5 223 67.5C223.663 67.5 224.299 67.7634 224.768 68.2322C225.237 68.7011 225.5 69.337 225.5 70ZM264 72.5C264.663 72.5 265.299 72.2366 265.768 71.7678C266.237 71.2989 266.5 70.663 266.5 70C266.5 69.337 266.237 68.7011 265.768 68.2322C265.299 67.7634 264.663 67.5 264 67.5C263.337 67.5 262.701 67.7634 262.232 68.2322C261.763 68.7011 261.5 69.337 261.5 70C261.5 70.663 261.763 71.2989 262.232 71.7678C262.701 72.2366 263.337 72.5 264 72.5ZM256.5 87C256.5 87.663 256.237 88.2989 255.768 88.7678C255.299 89.2366 254.663 89.5 254 89.5C253.337 89.5 252.701 89.2366 252.232 88.7678C251.763 88.2989 251.5 87.663 251.5 87C251.5 86.337 251.763 85.7011 252.232 85.2322C252.701 84.7634 253.337 84.5 254 84.5C254.663 84.5 255.299 84.7634 255.768 85.2322C256.237 85.7011 256.5 86.337 256.5 87ZM169 89.5C169.663 89.5 170.299 89.2366 170.768 88.7678C171.237 88.2989 171.5 87.663 171.5 87C171.5 86.337 171.237 85.7011 170.768 85.2322C170.299 84.7634 169.663 84.5 169 84.5C168.337 84.5 167.701 84.7634 167.232 85.2322C166.763 85.7011 166.5 86.337 166.5 87C166.5 87.663 166.763 88.2989 167.232 88.7678C167.701 89.2366 168.337 89.5 169 89.5ZM214.5 87C214.5 87.663 214.237 88.2989 213.768 88.7678C213.299 89.2366 212.663 89.5 212 89.5C211.337 89.5 210.701 89.2366 210.232 88.7678C209.763 88.2989 209.5 87.663 209.5 87C209.5 86.337 209.763 85.7011 210.232 85.2322C210.701 84.7634 211.337 84.5 212 84.5C212.663 84.5 213.299 84.7634 213.768 85.2322C214.237 85.7011 214.5 86.337 214.5 87ZM298.5 87C298.5 87.663 298.237 88.2989 297.768 88.7678C297.299 89.2366 296.663 89.5 296 89.5C295.337 89.5 294.701 89.2366 294.232 88.7678C293.763 88.2989 293.5 87.663 293.5 87C293.5 86.337 293.763 85.7011 294.232 85.2322C294.701 84.7634 295.337 84.5 296 84.5C296.663 84.5 297.299 84.7634 297.768 85.2322C298.237 85.7011 298.5 86.337 298.5 87ZM105 89.5C105.663 89.5 106.299 89.2366 106.768 88.7678C107.237 88.2989 107.5 87.663 107.5 87C107.5 86.337 107.237 85.7011 106.768 85.2322C106.299 84.7634 105.663 84.5 105 84.5C104.337 84.5 103.701 84.7634 103.232 85.2322C102.763 85.7011 102.5 86.337 102.5 87C102.5 87.663 102.763 88.2989 103.232 88.7678C103.701 89.2366 104.337 89.5 105 89.5ZM95 72.5C95.663 72.5 96.2989 72.2366 96.7678 71.7678C97.2366 71.2989 97.5 70.663 97.5 70C97.5 69.337 97.2366 68.7011 96.7678 68.2322C96.2989 67.7634 95.663 67.5 95 67.5C94.337 67.5 93.7011 67.7634 93.2322 68.2322C92.7634 68.7011 92.5 69.337 92.5 70C92.5 70.663 92.7634 71.2989 93.2322 71.7678C93.7011 72.2366 94.337 72.5 95 72.5ZM86.5 87C86.5 87.663 86.2366 88.2989 85.7678 88.7678C85.2989 89.2366 84.663 89.5 84 89.5C83.337 89.5 82.7011 89.2366 82.2322 88.7678C81.7634 88.2989 81.5 87.663 81.5 87C81.5 86.337 81.7634 85.7011 82.2322 85.2322C82.7011 84.7634 83.337 84.5 84 84.5C84.663 84.5 85.2989 84.7634 85.7678 85.2322C86.2366 85.7011 86.5 86.337 86.5 87ZM191 177.5C191.663 177.5 192.299 177.237 192.768 176.768C193.237 176.299 193.5 175.663 193.5 175C193.5 174.337 193.237 173.701 192.768 173.232C192.299 172.763 191.663 172.5 191 172.5C190.337 172.5 189.701 172.763 189.232 173.232C188.763 173.701 188.5 174.337 188.5 175C188.5 175.663 188.763 176.299 189.232 176.768C189.701 177.237 190.337 177.5 191 177.5ZM236.5 175C236.5 175.663 236.237 176.299 235.768 176.768C235.299 177.237 234.663 177.5 234 177.5C233.337 177.5 232.701 177.237 232.232 176.768C231.763 176.299 231.5 175.663 231.5 175C231.5 174.337 231.763 173.701 232.232 173.232C232.701 172.763 233.337 172.5 234 172.5C234.663 172.5 235.299 172.763 235.768 173.232C236.237 173.701 236.5 174.337 236.5 175ZM274 177.5C274.663 177.5 275.299 177.237 275.768 176.768C276.237 176.299 276.5 175.663 276.5 175C276.5 174.337 276.237 173.701 275.768 173.232C275.299 172.763 274.663 172.5 274 172.5C273.337 172.5 272.701 172.763 272.232 173.232C271.763 173.701 271.5 174.337 271.5 175C271.5 175.663 271.763 176.299 272.232 176.768C272.701 177.237 273.337 177.5 274 177.5ZM161.5 158C161.5 158.663 161.237 159.299 160.768 159.768C160.299 160.237 159.663 160.5 159 160.5C158.337 160.5 157.701 160.237 157.232 159.768C156.763 159.299 156.5 158.663 156.5 158C156.5 157.337 156.763 156.701 157.232 156.232C157.701 155.763 158.337 155.5 159 155.5C159.663 155.5 160.299 155.763 160.768 156.232C161.237 156.701 161.5 157.337 161.5 158ZM202 160.5C202.663 160.5 203.299 160.237 203.768 159.768C204.237 159.299 204.5 158.663 204.5 158C204.5 157.337 204.237 156.701 203.768 156.232C203.299 155.763 202.663 155.5 202 155.5C201.337 155.5 200.701 155.763 200.232 156.232C199.763 156.701 199.5 157.337 199.5 158C199.5 158.663 199.763 159.299 200.232 159.768C200.701 160.237 201.337 160.5 202 160.5ZM246.5 158C246.5 158.663 246.237 159.299 245.768 159.768C245.299 160.237 244.663 160.5 244 160.5C243.337 160.5 242.701 160.237 242.232 159.768C241.763 159.299 241.5 158.663 241.5 158C241.5 157.337 241.763 156.701 242.232 156.232C242.701 155.763 243.337 155.5 244 155.5C244.663 155.5 245.299 155.763 245.768 156.232C246.237 156.701 246.5 157.337 246.5 158ZM285 160.5C285.663 160.5 286.299 160.237 286.768 159.768C287.237 159.299 287.5 158.663 287.5 158C287.5 157.337 287.237 156.701 286.768 156.232C286.299 155.763 285.663 155.5 285 155.5C284.337 155.5 283.701 155.763 283.232 156.232C282.763 156.701 282.5 157.337 282.5 158C282.5 158.663 282.763 159.299 283.232 159.768C283.701 160.237 284.337 160.5 285 160.5ZM182.5 158C182.5 158.663 182.237 159.299 181.768 159.768C181.299 160.237 180.663 160.5 180 160.5C179.337 160.5 178.701 160.237 178.232 159.768C177.763 159.299 177.5 158.663 177.5 158C177.5 157.337 177.763 156.701 178.232 156.232C178.701 155.763 179.337 155.5 180 155.5C180.663 155.5 181.299 155.763 181.768 156.232C182.237 156.701 182.5 157.337 182.5 158ZM223 160.5C223.663 160.5 224.299 160.237 224.768 159.768C225.237 159.299 225.5 158.663 225.5 158C225.5 157.337 225.237 156.701 224.768 156.232C224.299 155.763 223.663 155.5 223 155.5C222.337 155.5 221.701 155.763 221.232 156.232C220.763 156.701 220.5 157.337 220.5 158C220.5 158.663 220.763 159.299 221.232 159.768C221.701 160.237 222.337 160.5 223 160.5ZM266.5 158C266.5 158.663 266.237 159.299 265.768 159.768C265.299 160.237 264.663 160.5 264 160.5C263.337 160.5 262.701 160.237 262.232 159.768C261.763 159.299 261.5 158.663 261.5 158C261.5 157.337 261.763 156.701 262.232 156.232C262.701 155.763 263.337 155.5 264 155.5C264.663 155.5 265.299 155.763 265.768 156.232C266.237 156.701 266.5 157.337 266.5 158ZM254 177.5C254.663 177.5 255.299 177.237 255.768 176.768C256.237 176.299 256.5 175.663 256.5 175C256.5 174.337 256.237 173.701 255.768 173.232C255.299 172.763 254.663 172.5 254 172.5C253.337 172.5 252.701 172.763 252.232 173.232C251.763 173.701 251.5 174.337 251.5 175C251.5 175.663 251.763 176.299 252.232 176.768C252.701 177.237 253.337 177.5 254 177.5ZM171.5 175C171.5 175.663 171.237 176.299 170.768 176.768C170.299 177.237 169.663 177.5 169 177.5C168.337 177.5 167.701 177.237 167.232 176.768C166.763 176.299 166.5 175.663 166.5 175C166.5 174.337 166.763 173.701 167.232 173.232C167.701 172.763 168.337 172.5 169 172.5C169.663 172.5 170.299 172.763 170.768 173.232C171.237 173.701 171.5 174.337 171.5 175ZM212 177.5C212.663 177.5 213.299 177.237 213.768 176.768C214.237 176.299 214.5 175.663 214.5 175C214.5 174.337 214.237 173.701 213.768 173.232C213.299 172.763 212.663 172.5 212 172.5C211.337 172.5 210.701 172.763 210.232 173.232C209.763 173.701 209.5 174.337 209.5 175C209.5 175.663 209.763 176.299 210.232 176.768C210.701 177.237 211.337 177.5 212 177.5ZM296 177.5C296.663 177.5 297.299 177.237 297.768 176.768C298.237 176.299 298.5 175.663 298.5 175C298.5 174.337 298.237 173.701 297.768 173.232C297.299 172.763 296.663 172.5 296 172.5C295.337 172.5 294.701 172.763 294.232 173.232C293.763 173.701 293.5 174.337 293.5 175C293.5 175.663 293.763 176.299 294.232 176.768C294.701 177.237 295.337 177.5 296 177.5ZM107.5 175C107.5 175.663 107.237 176.299 106.768 176.768C106.299 177.237 105.663 177.5 105 177.5C104.337 177.5 103.701 177.237 103.232 176.768C102.763 176.299 102.5 175.663 102.5 175C102.5 174.337 102.763 173.701 103.232 173.232C103.701 172.763 104.337 172.5 105 172.5C105.663 172.5 106.299 172.763 106.768 173.232C107.237 173.701 107.5 174.337 107.5 175ZM74 160.5C74.663 160.5 75.2989 160.237 75.7678 159.768C76.2366 159.299 76.5 158.663 76.5 158C76.5 157.337 76.2366 156.701 75.7678 156.232C75.2989 155.763 74.663 155.5 74 155.5C73.337 155.5 72.7011 155.763 72.2322 156.232C71.7634 156.701 71.5 157.337 71.5 158C71.5 158.663 71.7634 159.299 72.2322 159.768C72.7011 160.237 73.337 160.5 74 160.5ZM97.5 158C97.5 158.663 97.2366 159.299 96.7678 159.768C96.2989 160.237 95.663 160.5 95 160.5C94.337 160.5 93.7011 160.237 93.2322 159.768C92.7634 159.299 92.5 158.663 92.5 158C92.5 157.337 92.7634 156.701 93.2322 156.232C93.7011 155.763 94.337 155.5 95 155.5C95.663 155.5 96.2989 155.763 96.7678 156.232C97.2366 156.701 97.5 157.337 97.5 158ZM84 177.5C84.663 177.5 85.2989 177.237 85.7678 176.768C86.2366 176.299 86.5 175.663 86.5 175C86.5 174.337 86.2366 173.701 85.7678 173.232C85.2989 172.763 84.663 172.5 84 172.5C83.337 172.5 82.7011 172.763 82.2322 173.232C81.7634 173.701 81.5 174.337 81.5 175C81.5 175.663 81.7634 176.299 82.2322 176.768C82.7011 177.237 83.337 177.5 84 177.5Z" fill="#947AF0" fill-opacity="0.15"/>
                                    <mask id="mask0_721_18800" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="71" y="67" width="228" height="111">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M76.5 70C76.5 70.663 76.2366 71.2989 75.7678 71.7678C75.2989 72.2366 74.663 72.5 74 72.5C73.337 72.5 72.7011 72.2366 72.2322 71.7678C71.7634 71.2989 71.5 70.663 71.5 70C71.5 69.337 71.7634 68.7011 72.2322 68.2322C72.7011 67.7634 73.337 67.5 74 67.5C74.663 67.5 75.2989 67.7634 75.7678 68.2322C76.2366 68.7011 76.5 69.337 76.5 70ZM159 72.5C159.663 72.5 160.299 72.2366 160.768 71.7678C161.237 71.2989 161.5 70.663 161.5 70C161.5 69.337 161.237 68.7011 160.768 68.2322C160.299 67.7634 159.663 67.5 159 67.5C158.337 67.5 157.701 67.7634 157.232 68.2322C156.763 68.7011 156.5 69.337 156.5 70C156.5 70.663 156.763 71.2989 157.232 71.7678C157.701 72.2366 158.337 72.5 159 72.5ZM191 89.5C191.663 89.5 192.299 89.2366 192.768 88.7678C193.237 88.2989 193.5 87.663 193.5 87C193.5 86.337 193.237 85.7011 192.768 85.2322C192.299 84.7634 191.663 84.5 191 84.5C190.337 84.5 189.701 84.7634 189.232 85.2322C188.763 85.7011 188.5 86.337 188.5 87C188.5 87.663 188.763 88.2989 189.232 88.7678C189.701 89.2366 190.337 89.5 191 89.5ZM234 89.5C234.663 89.5 235.299 89.2366 235.768 88.7678C236.237 88.2989 236.5 87.663 236.5 87C236.5 86.337 236.237 85.7011 235.768 85.2322C235.299 84.7634 234.663 84.5 234 84.5C233.337 84.5 232.701 84.7634 232.232 85.2322C231.763 85.7011 231.5 86.337 231.5 87C231.5 87.663 231.763 88.2989 232.232 88.7678C232.701 89.2366 233.337 89.5 234 89.5ZM276.5 87C276.5 87.663 276.237 88.2989 275.768 88.7678C275.299 89.2366 274.663 89.5 274 89.5C273.337 89.5 272.701 89.2366 272.232 88.7678C271.763 88.2989 271.5 87.663 271.5 87C271.5 86.337 271.763 85.7011 272.232 85.2322C272.701 84.7634 273.337 84.5 274 84.5C274.663 84.5 275.299 84.7634 275.768 85.2322C276.237 85.7011 276.5 86.337 276.5 87ZM204.5 70C204.5 70.663 204.237 71.2989 203.768 71.7678C203.299 72.2366 202.663 72.5 202 72.5C201.337 72.5 200.701 72.2366 200.232 71.7678C199.763 71.2989 199.5 70.663 199.5 70C199.5 69.337 199.763 68.7011 200.232 68.2322C200.701 67.7634 201.337 67.5 202 67.5C202.663 67.5 203.299 67.7634 203.768 68.2322C204.237 68.7011 204.5 69.337 204.5 70ZM244 72.5C244.663 72.5 245.299 72.2366 245.768 71.7678C246.237 71.2989 246.5 70.663 246.5 70C246.5 69.337 246.237 68.7011 245.768 68.2322C245.299 67.7634 244.663 67.5 244 67.5C243.337 67.5 242.701 67.7634 242.232 68.2322C241.763 68.7011 241.5 69.337 241.5 70C241.5 70.663 241.763 71.2989 242.232 71.7678C242.701 72.2366 243.337 72.5 244 72.5ZM287.5 70C287.5 70.663 287.237 71.2989 286.768 71.7678C286.299 72.2366 285.663 72.5 285 72.5C284.337 72.5 283.701 72.2366 283.232 71.7678C282.763 71.2989 282.5 70.663 282.5 70C282.5 69.337 282.763 68.7011 283.232 68.2322C283.701 67.7634 284.337 67.5 285 67.5C285.663 67.5 286.299 67.7634 286.768 68.2322C287.237 68.7011 287.5 69.337 287.5 70ZM180 72.5C180.663 72.5 181.299 72.2366 181.768 71.7678C182.237 71.2989 182.5 70.663 182.5 70C182.5 69.337 182.237 68.7011 181.768 68.2322C181.299 67.7634 180.663 67.5 180 67.5C179.337 67.5 178.701 67.7634 178.232 68.2322C177.763 68.7011 177.5 69.337 177.5 70C177.5 70.663 177.763 71.2989 178.232 71.7678C178.701 72.2366 179.337 72.5 180 72.5ZM225.5 70C225.5 70.663 225.237 71.2989 224.768 71.7678C224.299 72.2366 223.663 72.5 223 72.5C222.337 72.5 221.701 72.2366 221.232 71.7678C220.763 71.2989 220.5 70.663 220.5 70C220.5 69.337 220.763 68.7011 221.232 68.2322C221.701 67.7634 222.337 67.5 223 67.5C223.663 67.5 224.299 67.7634 224.768 68.2322C225.237 68.7011 225.5 69.337 225.5 70ZM264 72.5C264.663 72.5 265.299 72.2366 265.768 71.7678C266.237 71.2989 266.5 70.663 266.5 70C266.5 69.337 266.237 68.7011 265.768 68.2322C265.299 67.7634 264.663 67.5 264 67.5C263.337 67.5 262.701 67.7634 262.232 68.2322C261.763 68.7011 261.5 69.337 261.5 70C261.5 70.663 261.763 71.2989 262.232 71.7678C262.701 72.2366 263.337 72.5 264 72.5ZM256.5 87C256.5 87.663 256.237 88.2989 255.768 88.7678C255.299 89.2366 254.663 89.5 254 89.5C253.337 89.5 252.701 89.2366 252.232 88.7678C251.763 88.2989 251.5 87.663 251.5 87C251.5 86.337 251.763 85.7011 252.232 85.2322C252.701 84.7634 253.337 84.5 254 84.5C254.663 84.5 255.299 84.7634 255.768 85.2322C256.237 85.7011 256.5 86.337 256.5 87ZM169 89.5C169.663 89.5 170.299 89.2366 170.768 88.7678C171.237 88.2989 171.5 87.663 171.5 87C171.5 86.337 171.237 85.7011 170.768 85.2322C170.299 84.7634 169.663 84.5 169 84.5C168.337 84.5 167.701 84.7634 167.232 85.2322C166.763 85.7011 166.5 86.337 166.5 87C166.5 87.663 166.763 88.2989 167.232 88.7678C167.701 89.2366 168.337 89.5 169 89.5ZM214.5 87C214.5 87.663 214.237 88.2989 213.768 88.7678C213.299 89.2366 212.663 89.5 212 89.5C211.337 89.5 210.701 89.2366 210.232 88.7678C209.763 88.2989 209.5 87.663 209.5 87C209.5 86.337 209.763 85.7011 210.232 85.2322C210.701 84.7634 211.337 84.5 212 84.5C212.663 84.5 213.299 84.7634 213.768 85.2322C214.237 85.7011 214.5 86.337 214.5 87ZM298.5 87C298.5 87.663 298.237 88.2989 297.768 88.7678C297.299 89.2366 296.663 89.5 296 89.5C295.337 89.5 294.701 89.2366 294.232 88.7678C293.763 88.2989 293.5 87.663 293.5 87C293.5 86.337 293.763 85.7011 294.232 85.2322C294.701 84.7634 295.337 84.5 296 84.5C296.663 84.5 297.299 84.7634 297.768 85.2322C298.237 85.7011 298.5 86.337 298.5 87ZM105 89.5C105.663 89.5 106.299 89.2366 106.768 88.7678C107.237 88.2989 107.5 87.663 107.5 87C107.5 86.337 107.237 85.7011 106.768 85.2322C106.299 84.7634 105.663 84.5 105 84.5C104.337 84.5 103.701 84.7634 103.232 85.2322C102.763 85.7011 102.5 86.337 102.5 87C102.5 87.663 102.763 88.2989 103.232 88.7678C103.701 89.2366 104.337 89.5 105 89.5ZM95 72.5C95.663 72.5 96.2989 72.2366 96.7678 71.7678C97.2366 71.2989 97.5 70.663 97.5 70C97.5 69.337 97.2366 68.7011 96.7678 68.2322C96.2989 67.7634 95.663 67.5 95 67.5C94.337 67.5 93.7011 67.7634 93.2322 68.2322C92.7634 68.7011 92.5 69.337 92.5 70C92.5 70.663 92.7634 71.2989 93.2322 71.7678C93.7011 72.2366 94.337 72.5 95 72.5ZM86.5 87C86.5 87.663 86.2366 88.2989 85.7678 88.7678C85.2989 89.2366 84.663 89.5 84 89.5C83.337 89.5 82.7011 89.2366 82.2322 88.7678C81.7634 88.2989 81.5 87.663 81.5 87C81.5 86.337 81.7634 85.7011 82.2322 85.2322C82.7011 84.7634 83.337 84.5 84 84.5C84.663 84.5 85.2989 84.7634 85.7678 85.2322C86.2366 85.7011 86.5 86.337 86.5 87ZM191 177.5C191.663 177.5 192.299 177.237 192.768 176.768C193.237 176.299 193.5 175.663 193.5 175C193.5 174.337 193.237 173.701 192.768 173.232C192.299 172.763 191.663 172.5 191 172.5C190.337 172.5 189.701 172.763 189.232 173.232C188.763 173.701 188.5 174.337 188.5 175C188.5 175.663 188.763 176.299 189.232 176.768C189.701 177.237 190.337 177.5 191 177.5ZM236.5 175C236.5 175.663 236.237 176.299 235.768 176.768C235.299 177.237 234.663 177.5 234 177.5C233.337 177.5 232.701 177.237 232.232 176.768C231.763 176.299 231.5 175.663 231.5 175C231.5 174.337 231.763 173.701 232.232 173.232C232.701 172.763 233.337 172.5 234 172.5C234.663 172.5 235.299 172.763 235.768 173.232C236.237 173.701 236.5 174.337 236.5 175ZM274 177.5C274.663 177.5 275.299 177.237 275.768 176.768C276.237 176.299 276.5 175.663 276.5 175C276.5 174.337 276.237 173.701 275.768 173.232C275.299 172.763 274.663 172.5 274 172.5C273.337 172.5 272.701 172.763 272.232 173.232C271.763 173.701 271.5 174.337 271.5 175C271.5 175.663 271.763 176.299 272.232 176.768C272.701 177.237 273.337 177.5 274 177.5ZM161.5 158C161.5 158.663 161.237 159.299 160.768 159.768C160.299 160.237 159.663 160.5 159 160.5C158.337 160.5 157.701 160.237 157.232 159.768C156.763 159.299 156.5 158.663 156.5 158C156.5 157.337 156.763 156.701 157.232 156.232C157.701 155.763 158.337 155.5 159 155.5C159.663 155.5 160.299 155.763 160.768 156.232C161.237 156.701 161.5 157.337 161.5 158ZM202 160.5C202.663 160.5 203.299 160.237 203.768 159.768C204.237 159.299 204.5 158.663 204.5 158C204.5 157.337 204.237 156.701 203.768 156.232C203.299 155.763 202.663 155.5 202 155.5C201.337 155.5 200.701 155.763 200.232 156.232C199.763 156.701 199.5 157.337 199.5 158C199.5 158.663 199.763 159.299 200.232 159.768C200.701 160.237 201.337 160.5 202 160.5ZM246.5 158C246.5 158.663 246.237 159.299 245.768 159.768C245.299 160.237 244.663 160.5 244 160.5C243.337 160.5 242.701 160.237 242.232 159.768C241.763 159.299 241.5 158.663 241.5 158C241.5 157.337 241.763 156.701 242.232 156.232C242.701 155.763 243.337 155.5 244 155.5C244.663 155.5 245.299 155.763 245.768 156.232C246.237 156.701 246.5 157.337 246.5 158ZM285 160.5C285.663 160.5 286.299 160.237 286.768 159.768C287.237 159.299 287.5 158.663 287.5 158C287.5 157.337 287.237 156.701 286.768 156.232C286.299 155.763 285.663 155.5 285 155.5C284.337 155.5 283.701 155.763 283.232 156.232C282.763 156.701 282.5 157.337 282.5 158C282.5 158.663 282.763 159.299 283.232 159.768C283.701 160.237 284.337 160.5 285 160.5ZM182.5 158C182.5 158.663 182.237 159.299 181.768 159.768C181.299 160.237 180.663 160.5 180 160.5C179.337 160.5 178.701 160.237 178.232 159.768C177.763 159.299 177.5 158.663 177.5 158C177.5 157.337 177.763 156.701 178.232 156.232C178.701 155.763 179.337 155.5 180 155.5C180.663 155.5 181.299 155.763 181.768 156.232C182.237 156.701 182.5 157.337 182.5 158ZM223 160.5C223.663 160.5 224.299 160.237 224.768 159.768C225.237 159.299 225.5 158.663 225.5 158C225.5 157.337 225.237 156.701 224.768 156.232C224.299 155.763 223.663 155.5 223 155.5C222.337 155.5 221.701 155.763 221.232 156.232C220.763 156.701 220.5 157.337 220.5 158C220.5 158.663 220.763 159.299 221.232 159.768C221.701 160.237 222.337 160.5 223 160.5ZM266.5 158C266.5 158.663 266.237 159.299 265.768 159.768C265.299 160.237 264.663 160.5 264 160.5C263.337 160.5 262.701 160.237 262.232 159.768C261.763 159.299 261.5 158.663 261.5 158C261.5 157.337 261.763 156.701 262.232 156.232C262.701 155.763 263.337 155.5 264 155.5C264.663 155.5 265.299 155.763 265.768 156.232C266.237 156.701 266.5 157.337 266.5 158ZM254 177.5C254.663 177.5 255.299 177.237 255.768 176.768C256.237 176.299 256.5 175.663 256.5 175C256.5 174.337 256.237 173.701 255.768 173.232C255.299 172.763 254.663 172.5 254 172.5C253.337 172.5 252.701 172.763 252.232 173.232C251.763 173.701 251.5 174.337 251.5 175C251.5 175.663 251.763 176.299 252.232 176.768C252.701 177.237 253.337 177.5 254 177.5ZM171.5 175C171.5 175.663 171.237 176.299 170.768 176.768C170.299 177.237 169.663 177.5 169 177.5C168.337 177.5 167.701 177.237 167.232 176.768C166.763 176.299 166.5 175.663 166.5 175C166.5 174.337 166.763 173.701 167.232 173.232C167.701 172.763 168.337 172.5 169 172.5C169.663 172.5 170.299 172.763 170.768 173.232C171.237 173.701 171.5 174.337 171.5 175ZM212 177.5C212.663 177.5 213.299 177.237 213.768 176.768C214.237 176.299 214.5 175.663 214.5 175C214.5 174.337 214.237 173.701 213.768 173.232C213.299 172.763 212.663 172.5 212 172.5C211.337 172.5 210.701 172.763 210.232 173.232C209.763 173.701 209.5 174.337 209.5 175C209.5 175.663 209.763 176.299 210.232 176.768C210.701 177.237 211.337 177.5 212 177.5ZM296 177.5C296.663 177.5 297.299 177.237 297.768 176.768C298.237 176.299 298.5 175.663 298.5 175C298.5 174.337 298.237 173.701 297.768 173.232C297.299 172.763 296.663 172.5 296 172.5C295.337 172.5 294.701 172.763 294.232 173.232C293.763 173.701 293.5 174.337 293.5 175C293.5 175.663 293.763 176.299 294.232 176.768C294.701 177.237 295.337 177.5 296 177.5ZM107.5 175C107.5 175.663 107.237 176.299 106.768 176.768C106.299 177.237 105.663 177.5 105 177.5C104.337 177.5 103.701 177.237 103.232 176.768C102.763 176.299 102.5 175.663 102.5 175C102.5 174.337 102.763 173.701 103.232 173.232C103.701 172.763 104.337 172.5 105 172.5C105.663 172.5 106.299 172.763 106.768 173.232C107.237 173.701 107.5 174.337 107.5 175ZM74 160.5C74.663 160.5 75.2989 160.237 75.7678 159.768C76.2366 159.299 76.5 158.663 76.5 158C76.5 157.337 76.2366 156.701 75.7678 156.232C75.2989 155.763 74.663 155.5 74 155.5C73.337 155.5 72.7011 155.763 72.2322 156.232C71.7634 156.701 71.5 157.337 71.5 158C71.5 158.663 71.7634 159.299 72.2322 159.768C72.7011 160.237 73.337 160.5 74 160.5ZM97.5 158C97.5 158.663 97.2366 159.299 96.7678 159.768C96.2989 160.237 95.663 160.5 95 160.5C94.337 160.5 93.7011 160.237 93.2322 159.768C92.7634 159.299 92.5 158.663 92.5 158C92.5 157.337 92.7634 156.701 93.2322 156.232C93.7011 155.763 94.337 155.5 95 155.5C95.663 155.5 96.2989 155.763 96.7678 156.232C97.2366 156.701 97.5 157.337 97.5 158ZM84 177.5C84.663 177.5 85.2989 177.237 85.7678 176.768C86.2366 176.299 86.5 175.663 86.5 175C86.5 174.337 86.2366 173.701 85.7678 173.232C85.2989 172.763 84.663 172.5 84 172.5C83.337 172.5 82.7011 172.763 82.2322 173.232C81.7634 173.701 81.5 174.337 81.5 175C81.5 175.663 81.7634 176.299 82.2322 176.768C82.7011 177.237 83.337 177.5 84 177.5Z" fill="white"/>
                                    </mask>
                                    <g mask="url(#mask0_721_18800)">
                                        <path d="M74 75.5C75.4587 75.5 76.8576 74.9205 77.8891 73.8891C78.9205 72.8576 79.5 71.4587 79.5 70H73.5C73.5 69.8674 73.5527 69.7402 73.6464 69.6464C73.7402 69.5527 73.8674 69.5 74 69.5V75.5ZM68.5 70C68.5 71.4587 69.0795 72.8576 70.1109 73.8891C71.1424 74.9205 72.5413 75.5 74 75.5V69.5C74.1326 69.5 74.2598 69.5527 74.3536 69.6464C74.4473 69.7402 74.5 69.8674 74.5 70H68.5ZM74 64.5C72.5413 64.5 71.1424 65.0795 70.1109 66.1109C69.0795 67.1424 68.5 68.5413 68.5 70H74.5C74.5 70.1326 74.4473 70.2598 74.3536 70.3536C74.2598 70.4473 74.1326 70.5 74 70.5V64.5ZM79.5 70C79.5 68.5413 78.9205 67.1424 77.8891 66.1109C76.8576 65.0795 75.4587 64.5 74 64.5V70.5C73.8674 70.5 73.7402 70.4473 73.6464 70.3536C73.5527 70.2598 73.5 70.1326 73.5 70H79.5ZM158.5 70C158.5 69.8674 158.553 69.7402 158.646 69.6464C158.74 69.5527 158.867 69.5 159 69.5V75.5C160.459 75.5 161.858 74.9205 162.889 73.8891C163.921 72.8576 164.5 71.4587 164.5 70H158.5ZM159 70.5C158.867 70.5 158.74 70.4473 158.646 70.3536C158.553 70.2598 158.5 70.1326 158.5 70H164.5C164.5 68.5413 163.921 67.1424 162.889 66.1109C161.858 65.0795 160.459 64.5 159 64.5V70.5ZM159.5 70C159.5 70.1326 159.447 70.2598 159.354 70.3536C159.26 70.4473 159.133 70.5 159 70.5V64.5C157.541 64.5 156.142 65.0795 155.111 66.1109C154.079 67.1424 153.5 68.5413 153.5 70H159.5ZM159 69.5C159.133 69.5 159.26 69.5527 159.354 69.6464C159.447 69.7402 159.5 69.8674 159.5 70H153.5C153.5 71.4587 154.079 72.8576 155.111 73.8891C156.142 74.9205 157.541 75.5 159 75.5V69.5ZM190.5 87C190.5 86.8674 190.553 86.7402 190.646 86.6464C190.74 86.5527 190.867 86.5 191 86.5V92.5C191.722 92.5 192.437 92.3577 193.105 92.0813C193.772 91.8049 194.378 91.3998 194.889 90.8891C195.4 90.3784 195.805 89.7721 196.081 89.1048C196.358 88.4375 196.5 87.7223 196.5 87H190.5ZM191 87.5C190.867 87.5 190.74 87.4473 190.646 87.3536C190.553 87.2598 190.5 87.1326 190.5 87H196.5C196.5 85.5413 195.921 84.1424 194.889 83.1109C193.858 82.0795 192.459 81.5 191 81.5V87.5ZM191.5 87C191.5 87.1326 191.447 87.2598 191.354 87.3536C191.26 87.4473 191.133 87.5 191 87.5V81.5C189.541 81.5 188.142 82.0795 187.111 83.1109C186.079 84.1424 185.5 85.5413 185.5 87H191.5ZM191 86.5C191.133 86.5 191.26 86.5527 191.354 86.6464C191.447 86.7402 191.5 86.8674 191.5 87H185.5C185.5 87.7223 185.642 88.4375 185.919 89.1048C186.195 89.7721 186.6 90.3784 187.111 90.8891C187.622 91.3998 188.228 91.8049 188.895 92.0813C189.563 92.3577 190.278 92.5 191 92.5V86.5ZM233.5 87C233.5 86.8674 233.553 86.7402 233.646 86.6464C233.74 86.5527 233.867 86.5 234 86.5V92.5C234.722 92.5 235.437 92.3577 236.105 92.0813C236.772 91.8049 237.378 91.3998 237.889 90.8891C238.4 90.3784 238.805 89.7721 239.081 89.1048C239.358 88.4375 239.5 87.7223 239.5 87H233.5ZM234 87.5C233.867 87.5 233.74 87.4473 233.646 87.3536C233.553 87.2598 233.5 87.1326 233.5 87H239.5C239.5 85.5413 238.921 84.1424 237.889 83.1109C236.858 82.0795 235.459 81.5 234 81.5V87.5ZM234.5 87C234.5 87.1326 234.447 87.2598 234.354 87.3536C234.26 87.4473 234.133 87.5 234 87.5V81.5C232.541 81.5 231.142 82.0795 230.111 83.1109C229.079 84.1424 228.5 85.5413 228.5 87H234.5ZM234 86.5C234.133 86.5 234.26 86.5527 234.354 86.6464C234.447 86.7402 234.5 86.8674 234.5 87H228.5C228.5 87.7223 228.642 88.4375 228.919 89.1048C229.195 89.7721 229.6 90.3784 230.111 90.8891C230.622 91.3998 231.228 91.8049 231.895 92.0813C232.563 92.3577 233.278 92.5 234 92.5V86.5ZM274 92.5C274.722 92.5 275.437 92.3577 276.105 92.0813C276.772 91.8049 277.378 91.3998 277.889 90.8891C278.4 90.3784 278.805 89.7721 279.081 89.1048C279.358 88.4375 279.5 87.7223 279.5 87H273.5C273.5 86.8674 273.553 86.7402 273.646 86.6464C273.74 86.5527 273.867 86.5 274 86.5V92.5ZM268.5 87C268.5 87.7223 268.642 88.4375 268.919 89.1048C269.195 89.7721 269.6 90.3784 270.111 90.8891C270.622 91.3998 271.228 91.8049 271.895 92.0813C272.563 92.3577 273.278 92.5 274 92.5V86.5C274.133 86.5 274.26 86.5527 274.354 86.6464C274.447 86.7402 274.5 86.8674 274.5 87H268.5ZM274 81.5C272.541 81.5 271.142 82.0795 270.111 83.1109C269.079 84.1424 268.5 85.5413 268.5 87H274.5C274.5 87.1326 274.447 87.2598 274.354 87.3536C274.26 87.4473 274.133 87.5 274 87.5V81.5ZM279.5 87C279.5 85.5413 278.921 84.1424 277.889 83.1109C276.858 82.0795 275.459 81.5 274 81.5V87.5C273.867 87.5 273.74 87.4473 273.646 87.3536C273.553 87.2598 273.5 87.1326 273.5 87H279.5ZM202 75.5C203.459 75.5 204.858 74.9205 205.889 73.8891C206.921 72.8576 207.5 71.4587 207.5 70H201.5C201.5 69.8674 201.553 69.7402 201.646 69.6464C201.74 69.5527 201.867 69.5 202 69.5V75.5ZM196.5 70C196.5 71.4587 197.079 72.8576 198.111 73.8891C199.142 74.9205 200.541 75.5 202 75.5V69.5C202.133 69.5 202.26 69.5527 202.354 69.6464C202.447 69.7402 202.5 69.8674 202.5 70H196.5ZM202 64.5C200.541 64.5 199.142 65.0795 198.111 66.1109C197.079 67.1424 196.5 68.5413 196.5 70H202.5C202.5 70.1326 202.447 70.2598 202.354 70.3536C202.26 70.4473 202.133 70.5 202 70.5V64.5ZM207.5 70C207.5 68.5413 206.921 67.1424 205.889 66.1109C204.858 65.0795 203.459 64.5 202 64.5V70.5C201.867 70.5 201.74 70.4473 201.646 70.3536C201.553 70.2598 201.5 70.1326 201.5 70H207.5ZM243.5 70C243.5 69.8674 243.553 69.7402 243.646 69.6464C243.74 69.5527 243.867 69.5 244 69.5V75.5C245.459 75.5 246.858 74.9205 247.889 73.8891C248.921 72.8576 249.5 71.4587 249.5 70H243.5ZM244 70.5C243.867 70.5 243.74 70.4473 243.646 70.3536C243.553 70.2598 243.5 70.1326 243.5 70H249.5C249.5 68.5413 248.921 67.1424 247.889 66.1109C246.858 65.0795 245.459 64.5 244 64.5V70.5ZM244.5 70C244.5 70.1326 244.447 70.2598 244.354 70.3536C244.26 70.4473 244.133 70.5 244 70.5V64.5C242.541 64.5 241.142 65.0795 240.111 66.1109C239.079 67.1424 238.5 68.5413 238.5 70H244.5ZM244 69.5C244.133 69.5 244.26 69.5527 244.354 69.6464C244.447 69.7402 244.5 69.8674 244.5 70H238.5C238.5 71.4587 239.079 72.8576 240.111 73.8891C241.142 74.9205 242.541 75.5 244 75.5V69.5ZM285 75.5C286.459 75.5 287.858 74.9205 288.889 73.8891C289.921 72.8576 290.5 71.4587 290.5 70H284.5C284.5 69.8674 284.553 69.7402 284.646 69.6464C284.74 69.5527 284.867 69.5 285 69.5V75.5ZM279.5 70C279.5 71.4587 280.079 72.8576 281.111 73.8891C282.142 74.9205 283.541 75.5 285 75.5V69.5C285.133 69.5 285.26 69.5527 285.354 69.6464C285.447 69.7402 285.5 69.8674 285.5 70H279.5ZM285 64.5C283.541 64.5 282.142 65.0795 281.111 66.1109C280.079 67.1424 279.5 68.5413 279.5 70H285.5C285.5 70.1326 285.447 70.2598 285.354 70.3536C285.26 70.4473 285.133 70.5 285 70.5V64.5ZM290.5 70C290.5 68.5413 289.921 67.1424 288.889 66.1109C287.858 65.0795 286.459 64.5 285 64.5V70.5C284.867 70.5 284.74 70.4473 284.646 70.3536C284.553 70.2598 284.5 70.1326 284.5 70H290.5ZM179.5 70C179.5 69.8674 179.553 69.7402 179.646 69.6464C179.74 69.5527 179.867 69.5 180 69.5V75.5C181.459 75.5 182.858 74.9205 183.889 73.8891C184.921 72.8576 185.5 71.4587 185.5 70H179.5ZM180 70.5C179.867 70.5 179.74 70.4473 179.646 70.3536C179.553 70.2598 179.5 70.1326 179.5 70H185.5C185.5 68.5413 184.921 67.1424 183.889 66.1109C182.858 65.0795 181.459 64.5 180 64.5V70.5ZM180.5 70C180.5 70.1326 180.447 70.2598 180.354 70.3536C180.26 70.4473 180.133 70.5 180 70.5V64.5C178.541 64.5 177.142 65.0795 176.111 66.1109C175.079 67.1424 174.5 68.5413 174.5 70H180.5ZM180 69.5C180.133 69.5 180.26 69.5527 180.354 69.6464C180.447 69.7402 180.5 69.8674 180.5 70H174.5C174.5 71.4587 175.079 72.8576 176.111 73.8891C177.142 74.9205 178.541 75.5 180 75.5V69.5ZM223 75.5C224.459 75.5 225.858 74.9205 226.889 73.8891C227.921 72.8576 228.5 71.4587 228.5 70H222.5C222.5 69.8674 222.553 69.7402 222.646 69.6464C222.74 69.5527 222.867 69.5 223 69.5V75.5ZM217.5 70C217.5 71.4587 218.079 72.8576 219.111 73.8891C220.142 74.9205 221.541 75.5 223 75.5V69.5C223.133 69.5 223.26 69.5527 223.354 69.6464C223.447 69.7402 223.5 69.8674 223.5 70H217.5ZM223 64.5C221.541 64.5 220.142 65.0795 219.111 66.1109C218.079 67.1424 217.5 68.5413 217.5 70H223.5C223.5 70.1326 223.447 70.2598 223.354 70.3536C223.26 70.4473 223.133 70.5 223 70.5V64.5ZM228.5 70C228.5 68.5413 227.921 67.1424 226.889 66.1109C225.858 65.0795 224.459 64.5 223 64.5V70.5C222.867 70.5 222.74 70.4473 222.646 70.3536C222.553 70.2598 222.5 70.1326 222.5 70H228.5ZM263.5 70C263.5 69.8674 263.553 69.7402 263.646 69.6464C263.74 69.5527 263.867 69.5 264 69.5V75.5C265.459 75.5 266.858 74.9205 267.889 73.8891C268.921 72.8576 269.5 71.4587 269.5 70H263.5ZM264 70.5C263.867 70.5 263.74 70.4473 263.646 70.3536C263.553 70.2598 263.5 70.1326 263.5 70H269.5C269.5 68.5413 268.921 67.1424 267.889 66.1109C266.858 65.0795 265.459 64.5 264 64.5V70.5ZM264.5 70C264.5 70.1326 264.447 70.2598 264.354 70.3536C264.26 70.4473 264.133 70.5 264 70.5V64.5C262.541 64.5 261.142 65.0795 260.111 66.1109C259.079 67.1424 258.5 68.5413 258.5 70H264.5ZM264 69.5C264.133 69.5 264.26 69.5527 264.354 69.6464C264.447 69.7402 264.5 69.8674 264.5 70H258.5C258.5 71.4587 259.079 72.8576 260.111 73.8891C261.142 74.9205 262.541 75.5 264 75.5V69.5ZM254 92.5C254.722 92.5 255.437 92.3577 256.105 92.0813C256.772 91.8049 257.378 91.3998 257.889 90.8891C258.4 90.3784 258.805 89.7721 259.081 89.1048C259.358 88.4375 259.5 87.7223 259.5 87H253.5C253.5 86.8674 253.553 86.7402 253.646 86.6464C253.74 86.5527 253.867 86.5 254 86.5V92.5ZM248.5 87C248.5 87.7223 248.642 88.4375 248.919 89.1048C249.195 89.7721 249.6 90.3784 250.111 90.8891C250.622 91.3998 251.228 91.8049 251.895 92.0813C252.563 92.3577 253.278 92.5 254 92.5V86.5C254.133 86.5 254.26 86.5527 254.354 86.6464C254.447 86.7402 254.5 86.8674 254.5 87H248.5ZM254 81.5C252.541 81.5 251.142 82.0795 250.111 83.1109C249.079 84.1424 248.5 85.5413 248.5 87H254.5C254.5 87.1326 254.447 87.2598 254.354 87.3536C254.26 87.4473 254.133 87.5 254 87.5V81.5ZM259.5 87C259.5 85.5413 258.921 84.1424 257.889 83.1109C256.858 82.0795 255.459 81.5 254 81.5V87.5C253.867 87.5 253.74 87.4473 253.646 87.3536C253.553 87.2598 253.5 87.1326 253.5 87H259.5ZM168.5 87C168.5 86.8674 168.553 86.7402 168.646 86.6464C168.74 86.5527 168.867 86.5 169 86.5V92.5C169.722 92.5 170.437 92.3577 171.105 92.0813C171.772 91.8049 172.378 91.3998 172.889 90.8891C173.4 90.3784 173.805 89.7721 174.081 89.1048C174.358 88.4375 174.5 87.7223 174.5 87H168.5ZM169 87.5C168.867 87.5 168.74 87.4473 168.646 87.3536C168.553 87.2598 168.5 87.1326 168.5 87H174.5C174.5 85.5413 173.921 84.1424 172.889 83.1109C171.858 82.0795 170.459 81.5 169 81.5V87.5ZM169.5 87C169.5 87.1326 169.447 87.2598 169.354 87.3536C169.26 87.4473 169.133 87.5 169 87.5V81.5C167.541 81.5 166.142 82.0795 165.111 83.1109C164.079 84.1424 163.5 85.5413 163.5 87H169.5ZM169 86.5C169.133 86.5 169.26 86.5527 169.354 86.6464C169.447 86.7402 169.5 86.8674 169.5 87H163.5C163.5 87.7223 163.642 88.4375 163.919 89.1048C164.195 89.7721 164.6 90.3784 165.111 90.8891C165.622 91.3998 166.228 91.8049 166.895 92.0813C167.563 92.3577 168.278 92.5 169 92.5V86.5ZM212 92.5C212.722 92.5 213.437 92.3577 214.105 92.0813C214.772 91.8049 215.378 91.3998 215.889 90.8891C216.4 90.3784 216.805 89.7721 217.081 89.1048C217.358 88.4375 217.5 87.7223 217.5 87H211.5C211.5 86.8674 211.553 86.7402 211.646 86.6464C211.74 86.5527 211.867 86.5 212 86.5V92.5ZM206.5 87C206.5 87.7223 206.642 88.4375 206.919 89.1048C207.195 89.7721 207.6 90.3784 208.111 90.8891C208.622 91.3998 209.228 91.8049 209.895 92.0813C210.563 92.3577 211.278 92.5 212 92.5V86.5C212.133 86.5 212.26 86.5527 212.354 86.6464C212.447 86.7402 212.5 86.8674 212.5 87H206.5ZM212 81.5C210.541 81.5 209.142 82.0795 208.111 83.1109C207.079 84.1424 206.5 85.5413 206.5 87H212.5C212.5 87.1326 212.447 87.2598 212.354 87.3536C212.26 87.4473 212.133 87.5 212 87.5V81.5ZM217.5 87C217.5 85.5413 216.921 84.1424 215.889 83.1109C214.858 82.0795 213.459 81.5 212 81.5V87.5C211.867 87.5 211.74 87.4473 211.646 87.3536C211.553 87.2598 211.5 87.1326 211.5 87H217.5ZM296 92.5C296.722 92.5 297.437 92.3577 298.105 92.0813C298.772 91.8049 299.378 91.3998 299.889 90.8891C300.4 90.3784 300.805 89.7721 301.081 89.1048C301.358 88.4375 301.5 87.7223 301.5 87H295.5C295.5 86.8674 295.553 86.7402 295.646 86.6464C295.74 86.5527 295.867 86.5 296 86.5V92.5ZM290.5 87C290.5 87.7223 290.642 88.4375 290.919 89.1048C291.195 89.7721 291.6 90.3784 292.111 90.8891C292.622 91.3998 293.228 91.8049 293.895 92.0813C294.563 92.3577 295.278 92.5 296 92.5V86.5C296.133 86.5 296.26 86.5527 296.354 86.6464C296.447 86.7402 296.5 86.8674 296.5 87H290.5ZM296 81.5C294.541 81.5 293.142 82.0795 292.111 83.1109C291.079 84.1424 290.5 85.5413 290.5 87H296.5C296.5 87.1326 296.447 87.2598 296.354 87.3536C296.26 87.4473 296.133 87.5 296 87.5V81.5ZM301.5 87C301.5 85.5413 300.921 84.1424 299.889 83.1109C298.858 82.0795 297.459 81.5 296 81.5V87.5C295.867 87.5 295.74 87.4473 295.646 87.3536C295.553 87.2598 295.5 87.1326 295.5 87H301.5ZM104.5 87C104.5 86.8674 104.553 86.7402 104.646 86.6464C104.74 86.5527 104.867 86.5 105 86.5V92.5C105.722 92.5 106.437 92.3577 107.105 92.0813C107.772 91.8049 108.378 91.3998 108.889 90.8891C109.4 90.3784 109.805 89.7721 110.081 89.1048C110.358 88.4375 110.5 87.7223 110.5 87H104.5ZM105 87.5C104.867 87.5 104.74 87.4473 104.646 87.3536C104.553 87.2598 104.5 87.1326 104.5 87H110.5C110.5 85.5413 109.921 84.1424 108.889 83.1109C107.858 82.0795 106.459 81.5 105 81.5V87.5ZM105.5 87C105.5 87.1326 105.447 87.2598 105.354 87.3536C105.26 87.4473 105.133 87.5 105 87.5V81.5C103.541 81.5 102.142 82.0795 101.111 83.1109C100.079 84.1424 99.5 85.5413 99.5 87H105.5ZM105 86.5C105.133 86.5 105.26 86.5527 105.354 86.6464C105.447 86.7402 105.5 86.8674 105.5 87H99.5C99.5 87.7223 99.6423 88.4375 99.9187 89.1048C100.195 89.7721 100.6 90.3784 101.111 90.8891C101.622 91.3998 102.228 91.8049 102.895 92.0813C103.563 92.3577 104.278 92.5 105 92.5V86.5ZM94.5 70C94.5 69.8674 94.5527 69.7402 94.6464 69.6464C94.7402 69.5527 94.8674 69.5 95 69.5V75.5C96.4587 75.5 97.8576 74.9205 98.8891 73.8891C99.9205 72.8576 100.5 71.4587 100.5 70H94.5ZM95 70.5C94.8674 70.5 94.7402 70.4473 94.6464 70.3536C94.5527 70.2598 94.5 70.1326 94.5 70H100.5C100.5 68.5413 99.9205 67.1424 98.8891 66.1109C97.8576 65.0795 96.4587 64.5 95 64.5V70.5ZM95.5 70C95.5 70.1326 95.4473 70.2598 95.3536 70.3536C95.2598 70.4473 95.1326 70.5 95 70.5V64.5C93.5413 64.5 92.1424 65.0795 91.1109 66.1109C90.0795 67.1424 89.5 68.5413 89.5 70H95.5ZM95 69.5C95.1326 69.5 95.2598 69.5527 95.3536 69.6464C95.4473 69.7402 95.5 69.8674 95.5 70H89.5C89.5 71.4587 90.0795 72.8576 91.1109 73.8891C92.1424 74.9205 93.5413 75.5 95 75.5V69.5ZM84 92.5C84.7223 92.5 85.4375 92.3577 86.1048 92.0813C86.7721 91.8049 87.3784 91.3998 87.8891 90.8891C88.3998 90.3784 88.8049 89.7721 89.0813 89.1048C89.3577 88.4375 89.5 87.7223 89.5 87H83.5C83.5 86.8674 83.5527 86.7402 83.6464 86.6464C83.7402 86.5527 83.8674 86.5 84 86.5V92.5ZM78.5 87C78.5 87.7223 78.6423 88.4375 78.9187 89.1048C79.1951 89.7721 79.6002 90.3784 80.1109 90.8891C80.6216 91.3998 81.228 91.8049 81.8952 92.0813C82.5625 92.3577 83.2777 92.5 84 92.5V86.5C84.1326 86.5 84.2598 86.5527 84.3536 86.6464C84.4473 86.7402 84.5 86.8674 84.5 87H78.5ZM84 81.5C82.5413 81.5 81.1424 82.0795 80.1109 83.1109C79.0795 84.1424 78.5 85.5413 78.5 87H84.5C84.5 87.1326 84.4473 87.2598 84.3536 87.3536C84.2598 87.4473 84.1326 87.5 84 87.5V81.5ZM89.5 87C89.5 85.5413 88.9205 84.1424 87.8891 83.1109C86.8576 82.0795 85.4587 81.5 84 81.5V87.5C83.8674 87.5 83.7402 87.4473 83.6464 87.3536C83.5527 87.2598 83.5 87.1326 83.5 87H89.5ZM190.5 175C190.5 174.867 190.553 174.74 190.646 174.646C190.74 174.553 190.867 174.5 191 174.5V180.5C192.459 180.5 193.858 179.921 194.889 178.889C195.921 177.858 196.5 176.459 196.5 175H190.5ZM191 175.5C190.867 175.5 190.74 175.447 190.646 175.354C190.553 175.26 190.5 175.133 190.5 175H196.5C196.5 173.541 195.921 172.142 194.889 171.111C193.858 170.079 192.459 169.5 191 169.5V175.5ZM191.5 175C191.5 175.133 191.447 175.26 191.354 175.354C191.26 175.447 191.133 175.5 191 175.5V169.5C189.541 169.5 188.142 170.079 187.111 171.111C186.079 172.142 185.5 173.541 185.5 175H191.5ZM191 174.5C191.133 174.5 191.26 174.553 191.354 174.646C191.447 174.74 191.5 174.867 191.5 175H185.5C185.5 176.459 186.079 177.858 187.111 178.889C188.142 179.921 189.541 180.5 191 180.5V174.5ZM234 180.5C235.459 180.5 236.858 179.921 237.889 178.889C238.921 177.858 239.5 176.459 239.5 175H233.5C233.5 174.867 233.553 174.74 233.646 174.646C233.74 174.553 233.867 174.5 234 174.5V180.5ZM228.5 175C228.5 176.459 229.079 177.858 230.111 178.889C231.142 179.921 232.541 180.5 234 180.5V174.5C234.133 174.5 234.26 174.553 234.354 174.646C234.447 174.74 234.5 174.867 234.5 175H228.5ZM234 169.5C232.541 169.5 231.142 170.079 230.111 171.111C229.079 172.142 228.5 173.541 228.5 175H234.5C234.5 175.133 234.447 175.26 234.354 175.354C234.26 175.447 234.133 175.5 234 175.5V169.5ZM239.5 175C239.5 173.541 238.921 172.142 237.889 171.111C236.858 170.079 235.459 169.5 234 169.5V175.5C233.867 175.5 233.74 175.447 233.646 175.354C233.553 175.26 233.5 175.133 233.5 175H239.5ZM273.5 175C273.5 174.867 273.553 174.74 273.646 174.646C273.74 174.553 273.867 174.5 274 174.5V180.5C275.459 180.5 276.858 179.921 277.889 178.889C278.921 177.858 279.5 176.459 279.5 175H273.5ZM274 175.5C273.867 175.5 273.74 175.447 273.646 175.354C273.553 175.26 273.5 175.133 273.5 175H279.5C279.5 173.541 278.921 172.142 277.889 171.111C276.858 170.079 275.459 169.5 274 169.5V175.5ZM274.5 175C274.5 175.133 274.447 175.26 274.354 175.354C274.26 175.447 274.133 175.5 274 175.5V169.5C272.541 169.5 271.142 170.079 270.111 171.111C269.079 172.142 268.5 173.541 268.5 175H274.5ZM274 174.5C274.133 174.5 274.26 174.553 274.354 174.646C274.447 174.74 274.5 174.867 274.5 175H268.5C268.5 176.459 269.079 177.858 270.111 178.889C271.142 179.921 272.541 180.5 274 180.5V174.5ZM159 163.5C160.459 163.5 161.858 162.921 162.889 161.889C163.921 160.858 164.5 159.459 164.5 158H158.5C158.5 157.867 158.553 157.74 158.646 157.646C158.74 157.553 158.867 157.5 159 157.5V163.5ZM153.5 158C153.5 159.459 154.079 160.858 155.111 161.889C156.142 162.921 157.541 163.5 159 163.5V157.5C159.133 157.5 159.26 157.553 159.354 157.646C159.447 157.74 159.5 157.867 159.5 158H153.5ZM159 152.5C157.541 152.5 156.142 153.079 155.111 154.111C154.079 155.142 153.5 156.541 153.5 158H159.5C159.5 158.133 159.447 158.26 159.354 158.354C159.26 158.447 159.133 158.5 159 158.5V152.5ZM164.5 158C164.5 156.541 163.921 155.142 162.889 154.111C161.858 153.079 160.459 152.5 159 152.5V158.5C158.867 158.5 158.74 158.447 158.646 158.354C158.553 158.26 158.5 158.133 158.5 158H164.5ZM201.5 158C201.5 157.867 201.553 157.74 201.646 157.646C201.74 157.553 201.867 157.5 202 157.5V163.5C203.459 163.5 204.858 162.921 205.889 161.889C206.921 160.858 207.5 159.459 207.5 158H201.5ZM202 158.5C201.867 158.5 201.74 158.447 201.646 158.354C201.553 158.26 201.5 158.133 201.5 158H207.5C207.5 156.541 206.921 155.142 205.889 154.111C204.858 153.079 203.459 152.5 202 152.5V158.5ZM202.5 158C202.5 158.133 202.447 158.26 202.354 158.354C202.26 158.447 202.133 158.5 202 158.5V152.5C200.541 152.5 199.142 153.079 198.111 154.111C197.079 155.142 196.5 156.541 196.5 158H202.5ZM202 157.5C202.133 157.5 202.26 157.553 202.354 157.646C202.447 157.74 202.5 157.867 202.5 158H196.5C196.5 159.459 197.079 160.858 198.111 161.889C199.142 162.921 200.541 163.5 202 163.5V157.5ZM244 163.5C245.459 163.5 246.858 162.921 247.889 161.889C248.921 160.858 249.5 159.459 249.5 158H243.5C243.5 157.867 243.553 157.74 243.646 157.646C243.74 157.553 243.867 157.5 244 157.5V163.5ZM238.5 158C238.5 159.459 239.079 160.858 240.111 161.889C241.142 162.921 242.541 163.5 244 163.5V157.5C244.133 157.5 244.26 157.553 244.354 157.646C244.447 157.74 244.5 157.867 244.5 158H238.5ZM244 152.5C242.541 152.5 241.142 153.079 240.111 154.111C239.079 155.142 238.5 156.541 238.5 158H244.5C244.5 158.133 244.447 158.26 244.354 158.354C244.26 158.447 244.133 158.5 244 158.5V152.5ZM249.5 158C249.5 156.541 248.921 155.142 247.889 154.111C246.858 153.079 245.459 152.5 244 152.5V158.5C243.867 158.5 243.74 158.447 243.646 158.354C243.553 158.26 243.5 158.133 243.5 158H249.5ZM284.5 158C284.5 157.867 284.553 157.74 284.646 157.646C284.74 157.553 284.867 157.5 285 157.5V163.5C286.459 163.5 287.858 162.921 288.889 161.889C289.921 160.858 290.5 159.459 290.5 158H284.5ZM285 158.5C284.867 158.5 284.74 158.447 284.646 158.354C284.553 158.26 284.5 158.133 284.5 158H290.5C290.5 156.541 289.921 155.142 288.889 154.111C287.858 153.079 286.459 152.5 285 152.5V158.5ZM285.5 158C285.5 158.133 285.447 158.26 285.354 158.354C285.26 158.447 285.133 158.5 285 158.5V152.5C283.541 152.5 282.142 153.079 281.111 154.111C280.079 155.142 279.5 156.541 279.5 158H285.5ZM285 157.5C285.133 157.5 285.26 157.553 285.354 157.646C285.447 157.74 285.5 157.867 285.5 158H279.5C279.5 159.459 280.079 160.858 281.111 161.889C282.142 162.921 283.541 163.5 285 163.5V157.5ZM180 163.5C181.459 163.5 182.858 162.921 183.889 161.889C184.921 160.858 185.5 159.459 185.5 158H179.5C179.5 157.867 179.553 157.74 179.646 157.646C179.74 157.553 179.867 157.5 180 157.5V163.5ZM174.5 158C174.5 159.459 175.079 160.858 176.111 161.889C177.142 162.921 178.541 163.5 180 163.5V157.5C180.133 157.5 180.26 157.553 180.354 157.646C180.447 157.74 180.5 157.867 180.5 158H174.5ZM180 152.5C178.541 152.5 177.142 153.079 176.111 154.111C175.079 155.142 174.5 156.541 174.5 158H180.5C180.5 158.133 180.447 158.26 180.354 158.354C180.26 158.447 180.133 158.5 180 158.5V152.5ZM185.5 158C185.5 156.541 184.921 155.142 183.889 154.111C182.858 153.079 181.459 152.5 180 152.5V158.5C179.867 158.5 179.74 158.447 179.646 158.354C179.553 158.26 179.5 158.133 179.5 158H185.5ZM222.5 158C222.5 157.867 222.553 157.74 222.646 157.646C222.74 157.553 222.867 157.5 223 157.5V163.5C224.459 163.5 225.858 162.921 226.889 161.889C227.921 160.858 228.5 159.459 228.5 158H222.5ZM223 158.5C222.867 158.5 222.74 158.447 222.646 158.354C222.553 158.26 222.5 158.133 222.5 158H228.5C228.5 156.541 227.921 155.142 226.889 154.111C225.858 153.079 224.459 152.5 223 152.5V158.5ZM223.5 158C223.5 158.133 223.447 158.26 223.354 158.354C223.26 158.447 223.133 158.5 223 158.5V152.5C221.541 152.5 220.142 153.079 219.111 154.111C218.079 155.142 217.5 156.541 217.5 158H223.5ZM223 157.5C223.133 157.5 223.26 157.553 223.354 157.646C223.447 157.74 223.5 157.867 223.5 158H217.5C217.5 159.459 218.079 160.858 219.111 161.889C220.142 162.921 221.541 163.5 223 163.5V157.5ZM264 163.5C265.459 163.5 266.858 162.921 267.889 161.889C268.921 160.858 269.5 159.459 269.5 158H263.5C263.5 157.867 263.553 157.74 263.646 157.646C263.74 157.553 263.867 157.5 264 157.5V163.5ZM258.5 158C258.5 159.459 259.079 160.858 260.111 161.889C261.142 162.921 262.541 163.5 264 163.5V157.5C264.133 157.5 264.26 157.553 264.354 157.646C264.447 157.74 264.5 157.867 264.5 158H258.5ZM264 152.5C262.541 152.5 261.142 153.079 260.111 154.111C259.079 155.142 258.5 156.541 258.5 158H264.5C264.5 158.133 264.447 158.26 264.354 158.354C264.26 158.447 264.133 158.5 264 158.5V152.5ZM269.5 158C269.5 156.541 268.921 155.142 267.889 154.111C266.858 153.079 265.459 152.5 264 152.5V158.5C263.867 158.5 263.74 158.447 263.646 158.354C263.553 158.26 263.5 158.133 263.5 158H269.5ZM253.5 175C253.5 174.867 253.553 174.74 253.646 174.646C253.74 174.553 253.867 174.5 254 174.5V180.5C255.459 180.5 256.858 179.921 257.889 178.889C258.921 177.858 259.5 176.459 259.5 175H253.5ZM254 175.5C253.867 175.5 253.74 175.447 253.646 175.354C253.553 175.26 253.5 175.133 253.5 175H259.5C259.5 173.541 258.921 172.142 257.889 171.111C256.858 170.079 255.459 169.5 254 169.5V175.5ZM254.5 175C254.5 175.133 254.447 175.26 254.354 175.354C254.26 175.447 254.133 175.5 254 175.5V169.5C252.541 169.5 251.142 170.079 250.111 171.111C249.079 172.142 248.5 173.541 248.5 175H254.5ZM254 174.5C254.133 174.5 254.26 174.553 254.354 174.646C254.447 174.74 254.5 174.867 254.5 175H248.5C248.5 176.459 249.079 177.858 250.111 178.889C251.142 179.921 252.541 180.5 254 180.5V174.5ZM169 180.5C170.459 180.5 171.858 179.921 172.889 178.889C173.921 177.858 174.5 176.459 174.5 175H168.5C168.5 174.867 168.553 174.74 168.646 174.646C168.74 174.553 168.867 174.5 169 174.5V180.5ZM163.5 175C163.5 176.459 164.079 177.858 165.111 178.889C166.142 179.921 167.541 180.5 169 180.5V174.5C169.133 174.5 169.26 174.553 169.354 174.646C169.447 174.74 169.5 174.867 169.5 175H163.5ZM169 169.5C167.541 169.5 166.142 170.079 165.111 171.111C164.079 172.142 163.5 173.541 163.5 175H169.5C169.5 175.133 169.447 175.26 169.354 175.354C169.26 175.447 169.133 175.5 169 175.5V169.5ZM174.5 175C174.5 173.541 173.921 172.142 172.889 171.111C171.858 170.079 170.459 169.5 169 169.5V175.5C168.867 175.5 168.74 175.447 168.646 175.354C168.553 175.26 168.5 175.133 168.5 175H174.5ZM211.5 175C211.5 174.867 211.553 174.74 211.646 174.646C211.74 174.553 211.867 174.5 212 174.5V180.5C213.459 180.5 214.858 179.921 215.889 178.889C216.921 177.858 217.5 176.459 217.5 175H211.5ZM212 175.5C211.867 175.5 211.74 175.447 211.646 175.354C211.553 175.26 211.5 175.133 211.5 175H217.5C217.5 173.541 216.921 172.142 215.889 171.111C214.858 170.079 213.459 169.5 212 169.5V175.5ZM212.5 175C212.5 175.133 212.447 175.26 212.354 175.354C212.26 175.447 212.133 175.5 212 175.5V169.5C210.541 169.5 209.142 170.079 208.111 171.111C207.079 172.142 206.5 173.541 206.5 175H212.5ZM212 174.5C212.133 174.5 212.26 174.553 212.354 174.646C212.447 174.74 212.5 174.867 212.5 175H206.5C206.5 176.459 207.079 177.858 208.111 178.889C209.142 179.921 210.541 180.5 212 180.5V174.5ZM295.5 175C295.5 174.867 295.553 174.74 295.646 174.646C295.74 174.553 295.867 174.5 296 174.5V180.5C297.459 180.5 298.858 179.921 299.889 178.889C300.921 177.858 301.5 176.459 301.5 175H295.5ZM296 175.5C295.867 175.5 295.74 175.447 295.646 175.354C295.553 175.26 295.5 175.133 295.5 175H301.5C301.5 173.541 300.921 172.142 299.889 171.111C298.858 170.079 297.459 169.5 296 169.5V175.5ZM296.5 175C296.5 175.133 296.447 175.26 296.354 175.354C296.26 175.447 296.133 175.5 296 175.5V169.5C294.541 169.5 293.142 170.079 292.111 171.111C291.079 172.142 290.5 173.541 290.5 175H296.5ZM296 174.5C296.133 174.5 296.26 174.553 296.354 174.646C296.447 174.74 296.5 174.867 296.5 175H290.5C290.5 176.459 291.079 177.858 292.111 178.889C293.142 179.921 294.541 180.5 296 180.5V174.5ZM105 180.5C106.459 180.5 107.858 179.921 108.889 178.889C109.921 177.858 110.5 176.459 110.5 175H104.5C104.5 174.867 104.553 174.74 104.646 174.646C104.74 174.553 104.867 174.5 105 174.5V180.5ZM99.5 175C99.5 176.459 100.079 177.858 101.111 178.889C102.142 179.921 103.541 180.5 105 180.5V174.5C105.133 174.5 105.26 174.553 105.354 174.646C105.447 174.74 105.5 174.867 105.5 175H99.5ZM105 169.5C103.541 169.5 102.142 170.079 101.111 171.111C100.079 172.142 99.5 173.541 99.5 175H105.5C105.5 175.133 105.447 175.26 105.354 175.354C105.26 175.447 105.133 175.5 105 175.5V169.5ZM110.5 175C110.5 173.541 109.921 172.142 108.889 171.111C107.858 170.079 106.459 169.5 105 169.5V175.5C104.867 175.5 104.74 175.447 104.646 175.354C104.553 175.26 104.5 175.133 104.5 175H110.5ZM73.5 158C73.5 157.867 73.5527 157.74 73.6464 157.646C73.7402 157.553 73.8674 157.5 74 157.5V163.5C75.4587 163.5 76.8576 162.921 77.8891 161.889C78.9205 160.858 79.5 159.459 79.5 158H73.5ZM74 158.5C73.8674 158.5 73.7402 158.447 73.6464 158.354C73.5527 158.26 73.5 158.133 73.5 158H79.5C79.5 156.541 78.9205 155.142 77.8891 154.111C76.8576 153.079 75.4587 152.5 74 152.5V158.5ZM74.5 158C74.5 158.133 74.4473 158.26 74.3536 158.354C74.2598 158.447 74.1326 158.5 74 158.5V152.5C72.5413 152.5 71.1424 153.079 70.1109 154.111C69.0795 155.142 68.5 156.541 68.5 158H74.5ZM74 157.5C74.1326 157.5 74.2598 157.553 74.3536 157.646C74.4473 157.74 74.5 157.867 74.5 158H68.5C68.5 159.459 69.0795 160.858 70.1109 161.889C71.1424 162.921 72.5413 163.5 74 163.5V157.5ZM95 163.5C96.4587 163.5 97.8576 162.921 98.8891 161.889C99.9205 160.858 100.5 159.459 100.5 158H94.5C94.5 157.867 94.5527 157.74 94.6464 157.646C94.7402 157.553 94.8674 157.5 95 157.5V163.5ZM89.5 158C89.5 159.459 90.0795 160.858 91.1109 161.889C92.1424 162.921 93.5413 163.5 95 163.5V157.5C95.1326 157.5 95.2598 157.553 95.3536 157.646C95.4473 157.74 95.5 157.867 95.5 158H89.5ZM95 152.5C93.5413 152.5 92.1424 153.079 91.1109 154.111C90.0795 155.142 89.5 156.541 89.5 158H95.5C95.5 158.133 95.4473 158.26 95.3536 158.354C95.2598 158.447 95.1326 158.5 95 158.5V152.5ZM100.5 158C100.5 156.541 99.9205 155.142 98.8891 154.111C97.8576 153.079 96.4587 152.5 95 152.5V158.5C94.8674 158.5 94.7402 158.447 94.6464 158.354C94.5527 158.26 94.5 158.133 94.5 158H100.5ZM83.5 175C83.5 174.867 83.5527 174.74 83.6464 174.646C83.7402 174.553 83.8674 174.5 84 174.5V180.5C85.4587 180.5 86.8576 179.921 87.8891 178.889C88.9205 177.858 89.5 176.459 89.5 175H83.5ZM84 175.5C83.8674 175.5 83.7402 175.447 83.6464 175.354C83.5527 175.26 83.5 175.133 83.5 175H89.5C89.5 173.541 88.9205 172.142 87.8891 171.111C86.8576 170.079 85.4587 169.5 84 169.5V175.5ZM84.5 175C84.5 175.133 84.4473 175.26 84.3536 175.354C84.2598 175.447 84.1326 175.5 84 175.5V169.5C82.5413 169.5 81.1424 170.079 80.1109 171.111C79.0795 172.142 78.5 173.541 78.5 175H84.5ZM84 174.5C84.1326 174.5 84.2598 174.553 84.3536 174.646C84.4473 174.74 84.5 174.867 84.5 175H78.5C78.5 176.459 79.0795 177.858 80.1109 178.889C81.1424 179.921 82.5413 180.5 84 180.5V174.5Z" fill="#947AF0" fill-opacity="0.15"/>
                                    </g>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M130.227 55.207L143.733 33.517L131.489 14.277L104.772 55.509L131.489 97.679L143.583 78.242L130.227 56.793C130.079 56.5552 130 56.2804 130 56C130 55.7196 130.079 55.4448 130.227 55.207ZM132.768 10.699L145.492 30.693L157.937 10.707C158.211 10.267 158.693 10 159.211 10H325.715C325.97 9.99995 326.22 10.0647 326.443 10.1882C326.666 10.3118 326.854 10.4899 326.988 10.706L340.88 32.956L354.772 55.206C354.921 55.4442 355 55.7195 355 56.0005C355 56.2815 354.921 56.5568 354.772 56.795L327.796 100L340.88 120.956L354.772 143.206C354.921 143.444 355 143.72 355 144.001C355 144.281 354.921 144.557 354.772 144.795L326.988 189.295C326.853 189.511 326.666 189.689 326.443 189.812C326.22 189.936 325.97 190 325.715 190H159.211C158.956 190 158.706 189.935 158.483 189.812C158.26 189.688 158.072 189.509 157.937 189.293L145.35 169.08L132.776 189.289C132.642 189.506 132.454 189.686 132.231 189.81C132.007 189.935 131.756 190 131.5 190H75.0103C74.7573 190 74.5084 189.936 74.2867 189.815C74.065 189.693 73.8777 189.517 73.7423 189.303L45.2363 144.308C45.0809 144.065 44.9989 143.783 45.0003 143.495C45.0014 143.206 45.0861 142.922 45.2443 142.68L72.9073 99.985L45.2363 56.308C45.0871 56.0747 45.0054 55.8046 45.0003 55.5276C44.9951 55.2507 45.0668 54.9777 45.2073 54.739L45.2223 54.715L45.2453 54.679L73.7503 10.684C73.8863 10.4742 74.0727 10.3017 74.2924 10.1822C74.5121 10.0627 74.7582 10.0001 75.0083 10H131.474C131.721 9.99671 131.964 10.0538 132.183 10.1662C132.402 10.2786 132.59 10.443 132.731 10.645L132.767 10.699H132.768ZM325.603 185.848L351.732 144L338.335 122.545L325.603 102.153L312.77 122.549L299.272 144L325.603 185.848ZM322.155 102H159.421L134.512 142H296.986L310.23 120.951L322.155 102ZM296.357 145L322.784 187H160.044L133.89 145H296.357ZM143.583 166.242L130.227 144.793C130.034 144.482 129.96 144.112 130.021 143.751C129.965 143.421 130.022 143.081 130.181 142.786C130.34 142.492 130.594 142.259 130.901 142.125L143.733 121.518L131.489 102.276L104.772 143.509L131.489 185.679L143.583 166.242ZM145.492 118.693L157.132 100L145.35 81.08L133.587 99.986L145.492 118.693ZM322.354 98H159.421L134.201 57.5H296.675L322.354 98ZM102.165 145H49.2263L75.8353 187H128.774L102.165 145ZM102.175 142L128.093 102H75.1773L49.2593 142H102.175ZM75.8253 13L49.2593 54H102.175L128.741 13H75.8253ZM75.2003 98L49.2263 57H102.165L128.14 98H75.2003ZM84.3823 21C83.2782 21.0001 82.1923 21.2815 81.227 21.8176C80.2618 22.3536 79.449 23.1268 78.8653 24.064L66.6303 43.707C66.4889 43.9341 66.4107 44.1949 66.404 44.4623C66.3973 44.7298 66.4622 44.9942 66.5921 45.2281C66.7219 45.462 66.912 45.6569 67.1426 45.7926C67.3731 45.9284 67.6358 46 67.9033 46H92.6173C93.7213 46 94.8072 45.7188 95.7724 45.1829C96.7377 44.647 97.5505 43.8741 98.1343 42.937L110.37 23.293C110.992 22.294 110.274 21 109.097 21H84.3823ZM76.3183 22.477C77.1716 21.1072 78.3599 19.9773 79.771 19.194C81.182 18.4107 82.7694 17.9998 84.3833 18H109.097C112.628 18 114.784 21.882 112.917 24.88L100.681 44.523C99.8281 45.8927 98.64 47.0225 97.2291 47.8058C95.8182 48.5891 94.231 49.0001 92.6173 49H67.9033C64.3723 49 62.2163 45.118 64.0833 42.121L76.3203 22.477H76.3183ZM78.8653 112.064C79.449 111.127 80.2619 110.353 81.2274 109.817C82.1928 109.281 83.279 109 84.3833 109H109.097C109.365 109 109.627 109.072 109.858 109.207C110.089 109.343 110.279 109.538 110.409 109.772C110.538 110.006 110.603 110.27 110.597 110.538C110.59 110.805 110.512 111.066 110.37 111.293L98.1343 130.937C97.5505 131.874 96.7377 132.647 95.7724 133.183C94.8072 133.719 93.7213 134 92.6173 134H67.9033C67.6358 134 67.3731 133.928 67.1426 133.793C66.912 133.657 66.7219 133.462 66.5921 133.228C66.4622 132.994 66.3973 132.73 66.404 132.462C66.4107 132.195 66.4889 131.934 66.6303 131.707L78.8653 112.064ZM84.3833 106C82.7696 106 81.1825 106.411 79.7716 107.194C78.3607 107.978 77.1726 109.107 76.3193 110.477L64.0833 130.121C62.2163 133.118 64.3723 137 67.9033 137H92.6173C94.231 137 95.8182 136.589 97.2291 135.806C98.64 135.023 99.8281 133.893 100.681 132.523L112.917 112.879C114.784 109.882 112.628 106 109.097 106H84.3833ZM160.044 13L134.201 54.5H296.675L322.988 13H160.044ZM325.706 14.317L299.276 56L325.706 97.684L351.732 56L338.335 34.545L325.706 14.317ZM175.591 37.142C173.16 38.27 170.272 39 166.5 39C166.102 39 165.721 38.842 165.44 38.5607C165.158 38.2794 165 37.8978 165 37.5C165 37.1022 165.158 36.7207 165.44 36.4394C165.721 36.158 166.102 36 166.5 36C169.853 36 172.309 35.357 174.331 34.42C176.382 33.47 178.038 32.199 179.833 30.813L179.881 30.776C181.635 29.422 183.529 27.96 185.909 26.858C188.34 25.732 191.228 25 195 25C198.772 25 201.66 25.732 204.091 26.858C206.471 27.96 208.365 29.422 210.119 30.776L210.167 30.813C211.962 32.199 213.618 33.47 215.669 34.42C217.691 35.357 220.147 36 223.5 36C226.853 36 229.309 35.357 231.331 34.42C233.382 33.47 235.038 32.199 236.833 30.813L236.881 30.776C238.635 29.422 240.529 27.96 242.909 26.858C245.34 25.732 248.228 25 252 25C255.772 25 258.66 25.732 261.091 26.858C263.471 27.96 265.365 29.422 267.119 30.776L267.167 30.813C268.962 32.199 270.618 33.47 272.669 34.42C274.691 35.357 277.147 36 280.5 36C280.898 36 281.28 36.158 281.561 36.4394C281.842 36.7207 282 37.1022 282 37.5C282 37.8978 281.842 38.2794 281.561 38.5607C281.28 38.842 280.898 39 280.5 39C276.728 39 273.84 38.269 271.409 37.142C269.029 36.04 267.135 34.578 265.381 33.224L265.333 33.188C263.538 31.802 261.882 30.53 259.831 29.58C257.809 28.644 255.353 28 252 28C248.647 28 246.191 28.644 244.169 29.58C242.118 30.53 240.462 31.802 238.667 33.188L238.619 33.224C236.865 34.578 234.971 36.04 232.591 37.143C230.16 38.268 227.272 39 223.5 39C219.728 39 216.84 38.269 214.409 37.142C212.029 36.04 210.135 34.578 208.381 33.225L208.333 33.188C206.538 31.802 204.882 30.53 202.831 29.58C200.809 28.644 198.353 28 195 28C191.647 28 189.191 28.644 187.169 29.58C185.118 30.53 183.462 31.802 181.667 33.188L181.619 33.224C179.865 34.578 177.971 36.04 175.591 37.143V37.142ZM166.5 127C170.272 127 173.16 126.269 175.591 125.143C177.971 124.04 179.865 122.578 181.619 121.225L181.667 121.188C183.462 119.802 185.118 118.53 187.169 117.58C189.191 116.644 191.647 116 195 116C198.353 116 200.809 116.644 202.831 117.58C204.882 118.53 206.538 119.802 208.333 121.188L208.381 121.224C210.135 122.577 212.029 124.04 214.409 125.143C216.84 126.269 219.728 127 223.5 127C227.272 127 230.16 126.269 232.591 125.143C234.971 124.04 236.865 122.578 238.619 121.225L238.667 121.188C240.462 119.802 242.118 118.53 244.169 117.58C246.191 116.644 248.647 116 252 116C255.353 116 257.809 116.644 259.831 117.58C261.882 118.53 263.538 119.802 265.333 121.188L265.381 121.224C267.135 122.578 269.029 124.04 271.409 125.143C273.84 126.269 276.728 127 280.5 127C280.898 127 281.28 126.842 281.561 126.561C281.842 126.279 282 125.898 282 125.5C282 125.102 281.842 124.721 281.561 124.439C281.28 124.158 280.898 124 280.5 124C277.147 124 274.691 123.357 272.669 122.42C270.618 121.47 268.962 120.199 267.167 118.813L267.119 118.776C265.365 117.422 263.471 115.96 261.091 114.858C258.66 113.732 255.772 113 252 113C248.228 113 245.34 113.732 242.909 114.858C240.529 115.96 238.635 117.422 236.881 118.776L236.833 118.813C235.038 120.199 233.382 121.47 231.331 122.42C229.309 123.357 226.853 124 223.5 124C220.147 124 217.691 123.357 215.669 122.42C213.618 121.47 211.962 120.199 210.167 118.813L210.119 118.776C208.365 117.422 206.471 115.96 204.091 114.858C201.66 113.732 198.772 113 195 113C191.228 113 188.34 113.732 185.909 114.858C183.529 115.96 181.635 117.422 179.881 118.776L179.833 118.813C178.038 120.199 176.382 121.47 174.331 122.42C172.309 123.357 169.853 124 166.5 124C166.102 124 165.721 124.158 165.44 124.439C165.158 124.721 165 125.102 165 125.5C165 125.898 165.158 126.279 165.44 126.561C165.721 126.842 166.102 127 166.5 127ZM85.5983 30.168C85.8229 30.0033 86.0889 29.9043 86.3666 29.8823C86.6442 29.8602 86.9225 29.9158 87.1703 30.043L96.8523 35.017C97.1229 35.156 97.3449 35.3741 97.4887 35.6422C97.6325 35.9103 97.6914 36.2158 97.6576 36.5181C97.6237 36.8205 97.4987 37.1054 97.2992 37.3351C97.0996 37.5647 96.835 37.7283 96.5403 37.804L92.0443 38.962L89.5873 42.901C89.4264 43.1593 89.1907 43.3626 88.9115 43.4838C88.6323 43.605 88.3229 43.6384 88.0243 43.5796C87.7257 43.5208 87.452 43.3726 87.2396 43.1545C87.0273 42.9365 86.8863 42.6591 86.8353 42.359L85.0063 31.629C84.9597 31.3545 84.9904 31.0725 85.0949 30.8145C85.1995 30.5564 85.3738 30.3326 85.5983 30.168ZM88.4683 34.083L89.1303 37.966L89.8163 36.865C90.0202 36.538 90.3421 36.302 90.7153 36.206L91.9713 35.883L88.4683 34.083ZM87.1703 118.043C86.9225 117.916 86.6444 117.861 86.3669 117.883C86.0894 117.905 85.8236 118.004 85.5991 118.168C85.3745 118.333 85.2002 118.557 85.0955 118.815C84.9909 119.073 84.96 119.355 85.0063 119.629L86.8363 130.359C86.8882 130.658 87.0295 130.935 87.2418 131.152C87.454 131.369 87.7271 131.517 88.025 131.575C88.3229 131.634 88.6316 131.601 88.9104 131.481C89.1891 131.36 89.4248 131.158 89.5863 130.901L92.0443 126.962L96.5403 125.804C96.835 125.728 97.0996 125.565 97.2992 125.335C97.4987 125.105 97.6237 124.82 97.6576 124.518C97.6914 124.216 97.6325 123.91 97.4887 123.642C97.3449 123.374 97.1229 123.156 96.8523 123.017L87.1703 118.043ZM89.1303 125.966L88.4683 122.083L91.9713 123.883L90.7153 124.206C90.3421 124.302 90.0202 124.538 89.8163 124.865L89.1303 125.966ZM89.0093 26.5C87.1093 26.305 85.3203 26.694 84.4563 27.235C81.1883 29.281 80.2613 33.073 81.8413 35.597C82.0524 35.9342 82.1209 36.3415 82.0317 36.7292C81.9426 37.117 81.703 37.4534 81.3658 37.6645C81.0286 37.8756 80.6213 37.9441 80.2336 37.855C79.8458 37.7658 79.5094 37.5262 79.2983 37.189C76.6583 32.972 78.4983 27.425 82.8643 24.692C84.4713 23.686 86.9943 23.278 89.3143 23.516C91.6343 23.754 94.2543 24.694 95.6643 26.945C95.7722 27.112 95.8457 27.2988 95.8808 27.4945C95.9158 27.6902 95.9116 27.8909 95.8684 28.0849C95.8252 28.279 95.7438 28.4625 95.6291 28.6248C95.5143 28.7871 95.3684 28.925 95.1998 29.0305C95.0313 29.1359 94.8435 29.2068 94.6473 29.239C94.4512 29.2712 94.2505 29.2641 94.0571 29.2181C93.8637 29.1721 93.6814 29.0881 93.5207 28.971C93.3601 28.8539 93.2243 28.7061 93.1213 28.536C92.4193 27.416 90.9093 26.695 89.0093 26.5ZM84.4563 115.235C85.3203 114.694 87.1093 114.305 89.0093 114.5C90.9093 114.695 92.4193 115.416 93.1213 116.536C93.2243 116.706 93.3601 116.854 93.5207 116.971C93.6814 117.088 93.8637 117.172 94.0571 117.218C94.2505 117.264 94.4512 117.271 94.6473 117.239C94.8435 117.207 95.0313 117.136 95.1998 117.03C95.3684 116.925 95.5143 116.787 95.6291 116.625C95.7438 116.462 95.8252 116.279 95.8684 116.085C95.9116 115.891 95.9158 115.69 95.8808 115.494C95.8457 115.299 95.7722 115.112 95.6643 114.945C94.2543 112.694 91.6343 111.754 89.3143 111.516C86.9943 111.278 84.4713 111.686 82.8643 112.692C78.4983 115.425 76.6583 120.972 79.2983 125.189C79.4013 125.359 79.5371 125.507 79.6977 125.624C79.8584 125.741 80.0407 125.825 80.2341 125.871C80.4275 125.917 80.6282 125.924 80.8243 125.892C81.0205 125.86 81.2083 125.789 81.3769 125.683C81.5454 125.578 81.6913 125.44 81.806 125.278C81.9208 125.115 82.0022 124.932 82.0454 124.738C82.0886 124.544 82.0928 124.343 82.0578 124.147C82.0228 123.952 81.9492 123.765 81.8413 123.598C80.2613 121.073 81.1883 117.281 84.4563 115.235Z" fill="#947AF0" fill-opacity="0.3"/>
                                </svg>
                                <span>Select at least two steps to get started</span>
                            </div>
                        {/if}
                    {/if}

                </div>
            </div>
        </div>
    </div>

<style>
    .spinner{
        height: 100%;
        width: 100%;
        background: rgba(6, 11, 19, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .center span{
        font-size: 1.35rem;
    }
    .center {
        display: flex;
        width: 100%;
        height: 80%;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
        justify-content: center;
    }
    .cta-button{
        font-size: 1.2rem;
        font-weight: 500;
        padding: 1rem 2.2rem;
    }
    .flex{
        display: flex;
        gap: 1rem;
    }
    .main{
        position: fixed;
        top: 0px;
        left: 0px;
        overflow: hidden;
        width: 100%;
        height: 100%;
        z-index: 6;
    }

    .container{
        max-width: 100% !important;
        height: 100%;
        position: relative;
        padding: 0px;
        background-color: #060B13;
        border-radius: 12px;
        display: flex;
    }

    .container-left{
        border-right: 1px solid #212830;
        width: 364px;
        height: 100%;
        position: relative;
    }

    .container-right{
        width: calc(100% - 364px);
        height: 100%;
        position: relative;
    }

    .container .header{
        display: flex;
        gap: 24px;
        align-items: center;
        width: 100%;
        padding: 25px 32px;
        border-bottom: 1px solid #212830;
    }
 
    .header .tab {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #88888A;
        cursor: pointer;
        transition: color 0.5s ease;
    }

    .header .tab span{
        font-size: 16px;
        padding: 3.5px 0px;
    }

    .header .active-tab{
        color: #fff;
    }

    .header .tab:hover {
        color: #fff;
        transition: color 0.5s ease;
    }
    .header .left {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .container .content{
        height: calc(100% - 80px);
    }
    .container-left .content{
        overflow: auto;
        height: calc(100% - 80px);
    }

    .custom-bar::-webkit-scrollbar-track {
        background: #212830;
        height: 0.5rem;
        width: 0.5rem;
    }

    .custom-bar::-webkit-scrollbar {
        border-radius: 0rem;
    }

    .layer-tab{
        padding: 32px;
        border-top: 1px solid #212830;
    }

    .layer-tab:first-child{
        border-top: 0px;
        padding: 32px;
    }

    .container-right{
        justify-content: space-between;
    }

    .container-right .header{
        justify-content: space-between;
        display: flex;
        padding: 20px;
    }

    .header :global(.dropdown .dropdown-title){
        border: 1px solid #212830 !important;
        padding: 0.5rem;
        margin: 0px;
    }

    .header :global(.dropdown .dropdown-content){
        left: 0;
        top: -10px !important;
    }
    .content :global(#x-axis-tooltip){
        top: calc(100% - 90px);
    }

    /* FOR CHART */
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
		font-size: 1.1rem;
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
		gap: 8px;
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
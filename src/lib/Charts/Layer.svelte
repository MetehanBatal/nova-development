<script>
    import Dropdown from '$lib/toolkit/Dropdown.svelte';
    import DropdownType2 from './DropdownType2.svelte';
    import Formula from "./Formula.svelte";
    import SideMenu from "./SideMenu.svelte";
    import FancyDropDown from "./FancyDropDown.svelte";
    import {
        events,
        dataType,
        operatorType,
        collectionValue,
        fValue,
        session,
        events_session,
        traitOperator,
    } from "./customChartText"

    export let main
    export let isMultple
    export let dataOptionSelectedIndex
    export let dropDowns
    export let sideMenu
    export let dataBody
    export let dataBodyTracker
    export let subSideMenu
    export let selectedSideMenuLayerClose
    export let selectedSideMenuLayer
    export let handleCloseSideMenu

    //let showMenu = false
    let traitsData = []
    let dom
    let domInputFilter
    let domTop = {}
    let domStep = {}
    let domStepFilter = {}

    const handleSideMenuOver = () => {
        selectedSideMenuLayerClose = []
    }

    const handleSideMenuOut = () => {
        selectedSideMenuLayerClose = JSON.parse(JSON.stringify(selectedSideMenuLayer))
    }

    const handleMenuClick = (e, key, i, subValue, value) => {
        if(JSON.stringify(selectedSideMenuLayer) != JSON.stringify([key, i, subValue, value])){
            handleCloseSideMenu(selectedSideMenuLayer)
        }
        selectedSideMenuLayer = [key, i, subValue, value]
        if(i == null){
            dataBodyTracker[key][value] = !dataBodyTracker[key][value]
            return
        }
        dataBodyTracker[key][i][value] = !dataBodyTracker[key][i][value]
    }

    const handleTraitsData = () => {
        if(main.name == "valueCalculation" || main.name == "traits"){
            let temp = []
            let tempArray = []
            if(dataBody.eventName != null){
                tempArray.push(events[dataBody.eventName].id)
                temp.push({
                    index: 0,
                    name: events[dataBody.eventName].id,
                    id: events[dataBody.eventName].id
                })
            }

            if(dataBody.traits.length > 0){
                dataBody.traits.map((d, i) => {
                    if(!tempArray.includes(d.value)){
                        tempArray.push(d.value)
                        temp.push({
                            index: i + 1,
                            name: d.value,
                            id: d.value
                        })
                    }
                })
            }
            traitsData = temp

       }
    }

    const handleKeyup = (key, i = null) => {
        
        const [value, index, subIndex] = key.split("-")
        if(value == "filters"){
            dataBodyTracker[main.name][index].data = fValue.filter((f) => f.name.toLowerCase().includes(domTop[i].value.toLowerCase()))
            return
        }
        if(value == "breakdown"){
            dataBodyTracker[main.name][index].data = session.filter((f) => f.name.toLowerCase().includes(domTop[i].value.toLowerCase()))
            return
        }
        if(value == "traits"){
            dataBodyTracker[main.name][index].data = events_session.filter((f) => f.name.toLowerCase().includes(domTop[i].value.toLowerCase()))
        }

        if(value == "steps"){
            if(!subIndex){
                dataBodyTracker[main.name][index].dataEvent = events.filter((f) => f.name.toLowerCase().includes(domStep[i].value.toLowerCase()))

            } else {
                dataBodyTracker[main.name][index].data = fValue.filter((f) => f.name.toLowerCase().includes(domStepFilter[i].value.toLowerCase()))
            }
        }
        
    }

    const handleSideMenuAction = (item) => {
        const action = item.action

        if(action != "changeType"){
            selectedSideMenuLayerClose = []
        }
        if(action == "formula"){
            if(dataBody[main.name]?.formula){
                dataBodyTracker[main.name].showFormula = true
                dataBodyTracker[selectedSideMenuLayer[0]].isMenuOpen = false
                return
            }
            dataBody[main.name] = {
                formula: [],
            }

            dataBodyTracker[main.name] = {
                allowFocusOut: true,
                showFormula : true,
                isMenuOpen : false
            }
            return
        }

        if(action == "addFilter"){
            dataBodyTracker[selectedSideMenuLayer[0]][selectedSideMenuLayer[1]].isMenuOpenEvent = false
            dataBodyTracker[selectedSideMenuLayer[0]][selectedSideMenuLayer[1]].isMenuOpen = false
            if(dataBody[selectedSideMenuLayer[0]][selectedSideMenuLayer[1]]?.["filters"]) return
            dataBody[selectedSideMenuLayer[0]][selectedSideMenuLayer[1]]["filters"] = [
                {
                    operator: 0,
                    value: "",
                    valueArray: [],
                    type: "string",
                }
            ]
            return
        }

        if(action == "renameEvent"){
            dataBodyTracker[selectedSideMenuLayer[0]][selectedSideMenuLayer[1]].showTitle = true
            dataBodyTracker[selectedSideMenuLayer[0]][selectedSideMenuLayer[1]].isMenuOpen = false
            dataBodyTracker[selectedSideMenuLayer[0]][selectedSideMenuLayer[1]].isMenuOpenEvent = false
        }


        if(action == "changeType"){
            if(selectedSideMenuLayer[0] == "filters"){
                dataBody[selectedSideMenuLayer[0]][selectedSideMenuLayer[1]].valueArray = []
            }
            dataBody[selectedSideMenuLayer[0]][selectedSideMenuLayer[1]].type = item.text
            dataBodyTracker[selectedSideMenuLayer[0]][selectedSideMenuLayer[1]].isMenuOpen = false
            dataBodyTracker[selectedSideMenuLayer[0]][selectedSideMenuLayer[1]].isMenuOpenEvent = false
            return
        }

        if(action == "remove"){
            if(selectedSideMenuLayer[2] == null){
                dataBody[selectedSideMenuLayer[0]].splice(selectedSideMenuLayer[1], 1)
                dataBodyTracker[selectedSideMenuLayer[0]].splice(selectedSideMenuLayer[1], 1)
            } else {
                delete dataBody[selectedSideMenuLayer[0]][selectedSideMenuLayer[1]][selectedSideMenuLayer[2]]
            }
            dataBody = dataBody
            dataBodyTracker = dataBodyTracker
            return
        }

        if(action == "duplicate"){
            let temp = JSON.parse(JSON.stringify(dataBody[selectedSideMenuLayer[0]][selectedSideMenuLayer[1]]))
            dataBodyTracker[selectedSideMenuLayer[0]][selectedSideMenuLayer[1]].isMenuOpen = false
            dataBodyTracker[selectedSideMenuLayer[0]][selectedSideMenuLayer[1]].isMenuOpenEvent = false

            let tempTracker = JSON.parse(JSON.stringify(dataBodyTracker[selectedSideMenuLayer[0]][selectedSideMenuLayer[1]]))
            dataBody[main.name].push(temp)
            dataBodyTracker[main.name].push(tempTracker)

            dataBody = dataBody
            dataBodyTracker = dataBodyTracker
            return
        }
    }

    const handleMultiple = () => {
        if(main.name == "steps"){
            dataBody[main.name].push(
                {
                    index: dataBody[main.name].length,
                    value: "",
                    title: "",
                }
            )
            dataBodyTracker[main.name].push({
                dataEvent : [],
                data:[],
                isMenuOpen: false,
                isMenuOpenEvent: false,
                allowFocusOut: false,
                allowFocusOutEvent: false,
                showTitle: false
            })

        }

        if(main.name == "filters"){
            dataBody[main.name].push({
                operator: 0,
                type: "string",
                value: "",
                valueArray: [],
            })

            dataBodyTracker[main.name].push({
                data : [],
                isMenuOpen: false,
                allowFocusOut: false
            })
        }

        if(main.name == "breakdown"){
            dataBody[main.name].push({
                type: "string",
                value: "",
            })

            dataBodyTracker[main.name].push({
                data : [],
                isMenuOpen: false,
                allowFocusOut: false
            })
        }

        if(main.name == "traits"){
            dataBody[main.name].push({
                type: "string",
                value: "",
                formula: [],
                title: "",
                operator: 0
            })

            dataBodyTracker[main.name].push({
                data : [],
                isMenuOpen: false,
                allowFocusOut: false,
                allowFocusOutFormula: false,
            })
        }

        dataBody = dataBody
    }
    $: dataBody["valueCalculation"], dataBody["traits"],  handleTraitsData()
</script>
    <!-- svelte-ignore missing-declaration -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->

    <div class="card">
        <div class="top"  on:click={() => handleMultiple()}>
            <div class="left">
                {@html main.icon}
                {#if !isMultple}
                    <Dropdown
                        placeholder = {"Select Event"}
                        options={events}
                        bind:selectedStatusIndex={dataBody.eventName}
                        position="right"
                        type="plain"
                        class = "custom-dropdown"
                    />
                {:else}
                    <span>{main.text}</span>
                {/if}
            </div>
            <div class="right">
                {#if isMultple}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.66199 8H12.7537" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8.20715 3.33331V12.6666" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                {:else}
                    <SideMenu
                        bind:showMenu = {dataBodyTracker[main.name].isMenuOpen}
                        {sideMenu}
                        handleMenuClick =  {(e) => handleMenuClick(e, main.name, null, null, "isMenuOpen")}
                        {handleSideMenuAction}
                        {handleSideMenuOver}
                        {handleSideMenuOut}
                    />
                {/if}
            </div>
        </div>
        {#if dropDowns}
            <div class="options">
                {#each dropDowns as item}
                    <DropdownType2
                        title={item.data[dataOptionSelectedIndex].name}
                        actions={item.data}
                        bind:selectedIndex={dataOptionSelectedIndex}
                    />
                {/each}
            </div>
        {/if}
        {#if dataBodyTracker[main.name]?.showFormula}
            <Formula 
                data = {traitsData}
                bind:dataObj = {dataBody[main.name]}
                bind:dataObjTracker = {dataBodyTracker[main.name]}
            />
        {/if}

        {#if isMultple}
            {#if main.name == "steps"}
                {#each dataBody[main.name] as item, i}
                <div class="layer-card-container">
                    <div class={`layer-card  ${main.name == "steps" && "card-step"}`}>
                        <div class={`${item?.filters && "step-top-1"} side-padding-2`}>
                            <div class="top">
                                <div class="small-gap align-center w-100">
                                    <div class="count-indicator">
                                        {i + 1}
                                    </div>
                                    <div class="relative count-indicator-input">
                                        <input
                                            bind:this={domStep[i]}
                                            type="text"
                                            value={dataBody[main.name][i].value}
                                            on:keyup={() =>  handleKeyup(`${main.name}-${i}`, i)}
                                            on:focus = {() => handleKeyup(`${main.name}-${i}`, i)}
                                            on:focusout = {() => {
                                                dataBody[main.name][i].value = domStep[i].value
                                                if(dataBodyTracker[main.name][i].allowFocusOutEvent) dataBodyTracker[main.name][i].dataEvent = []
                                            }}
                                        />
                                        {#if dataBodyTracker[main.name][i].dataEvent.length}
                                            <FancyDropDown
                                                bind:data = {dataBodyTracker[main.name][i].dataEvent}
                                                type = {"property"}
                                                bind:selectedOption = {dataBody[main.name][i].value}
                                                bind:allowFocusOut = {dataBodyTracker[main.name][i].allowFocusOutEvent}
                                                style = {"top: 3.3rem"}
                                                key = {`${main.name}-${i}`}
                                            />
                                        {/if}
                                    </div>
                                    
                                </div>
                                <SideMenu
                                    bind:showMenu = {dataBodyTracker[main.name][i].isMenuOpenEvent}
                                    {sideMenu}
                                    {handleSideMenuAction}
                                    handleMenuClick =  {(e) => handleMenuClick(e, main.name, i, null, "isMenuOpenEvent")}
                                    style = {"top: 2.2rem"}
                                    {handleSideMenuOver}
                                    {handleSideMenuOut}
                                />
                            </div>
                            {#if dataBodyTracker[main.name][i].showTitle}
                                <div class="small-gap align-center w-step bg-090e16">
                                    <input
                                        type="text"
                                        bind:value={dataBody[main.name][i].title}
                                        placeholder="type to overwrite title"
                                        class="step-title"
                                    />
                                    <div class="icon" on:click={() => {
                                        dataBody[main.name][i].title = ""
                                        dataBodyTracker[main.name][i].showTitle = false
                                    }}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="s-Vl6T4XXLbTe-"><g clip-path="url(#clip0_721_12026)" class="s-Vl6T4XXLbTe-"><path d="M8.00065 14.6666C11.6825 14.6666 14.6673 11.6819 14.6673 7.99998C14.6673 4.31808 11.6825 1.33331 8.00065 1.33331C4.31875 1.33331 1.33398 4.31808 1.33398 7.99998C1.33398 11.6819 4.31875 14.6666 8.00065 14.6666Z" stroke="#e78f8f" stroke-linecap="round" stroke-linejoin="round" class="s-Vl6T4XXLbTe-"></path><path d="M10 6L6 10" stroke="#e78f8f" stroke-linecap="round" stroke-linejoin="round" class="s-Vl6T4XXLbTe-"></path><path d="M6 6L10 10" stroke="#e78f8f" stroke-linecap="round" stroke-linejoin="round" class="s-Vl6T4XXLbTe-"></path></g><defs class="s-Vl6T4XXLbTe-"><clipPath id="clip0_721_12026" class="s-Vl6T4XXLbTe-"><rect width="16" height="16" fill="white" class="s-Vl6T4XXLbTe-"></rect></clipPath></defs></svg>
                                    </div>
                                </div>
                            {/if}
                        </div>
                        {#if item?.filters}
                            <div class="top step-top-2 side-padding-2">
                                <div class="small-gap align-center w-100">
                                    <div>
                                        {@html dataType[dataBody[main.name][i].filters[0].type].icon.replaceAll("#6D6D6E","#26AB74")}
                                    </div>
                                    <div class="relative w-100 small-gap align-center bg-090e16 border-radius">
                                        <input
                                            bind:this={domStepFilter[i]}
                                            type="text"
                                            value={dataBody[main.name][i].filters[0].value}
                                            on:keyup={() =>  handleKeyup(`${main.name}-${i}-2`, i)}
                                            on:focus = {() => handleKeyup(`${main.name}-${i}-2`, i)}
                                            on:focusout = {() => {
                                                dataBody[main.name][i].filters[0].value = domStepFilter[i].value
                                                if(dataBodyTracker[main.name][i].allowFocusOut) dataBodyTracker[main.name][i].data = []
                                            }}
                                        />
                                        {#if dataBodyTracker[main.name][i].data.length}
                                            <FancyDropDown
                                                bind:data = {dataBodyTracker[main.name][i].data}
                                                bind:selectedOption = {dataBody[main.name][i].filters[0].value}
                                                bind:allowFocusOut = {dataBodyTracker[main.name][i].allowFocusOut}
                                                type = {"property"}
                                                style = {"top: 3.3rem"}
                                                key = {`${main.name}-${i}-2`}
                                            />
                                        {/if}
                                    </div>
                                </div>

                                <SideMenu
                                    bind:showMenu = {dataBodyTracker[main.name][i].isMenuOpen}
                                    sideMenu = {subSideMenu}
                                    {handleSideMenuAction}
                                    {handleSideMenuOver}
                                    {handleSideMenuOut}
                                    handleMenuClick =  {(e) => handleMenuClick(e, main.name, i, "filters", "isMenuOpen")}
                                    style = {"top: 2.8rem; right: 1.5rem;"}
                                />
                            </div>
                            {#if item?.filters[0]?.value}
                                <div class="bottom step-bottom side-padding-2">
                                    <Dropdown
                                        placeholder = {"Select Event"}
                                        options={operatorType[item.filters[0].type]}
                                        bind:selectedStatusIndex={dataBody[main.name][i].filters[0].operator}
                                        position="right"
                                        type="plain"
                                        class = "custom-dropdown"
                                    />
                                    {#if collectionValue?.[item.filters[0].value]}
                                        <div class="multiple">
                                            <Dropdown
                                                placeholder = {"Select a value..."}
                                                options={collectionValue?.[item.filters[0].value]}
                                                bind:selectedStatusIndex={dataBody[main.name][i].filters[0].valueArray}
                                                position="right"
                                                type="plain"
                                                selection = "single"
                                                class = {`custom-dropdown ${dataBody[main.name][i].filters[0].valueArray.length > 0 ? "white" : ""}`}
                                            />
                                        </div>
                                    {/if}
                                </div>
                            {/if}
                        {/if}
                    </div>
                </div>
                {/each}
            {:else}
                {#each dataBody[main.name] as item, i}
                    <div class="layer-card-container">
                        <div class={`layer-card  ${main.name == "steps" && "card-step"}`}>
                            <div class="top">
                                <div class="small-gap align-center w-100">
                                    <div>
                                        {@html dataType[dataBody[main.name][i].type].icon.replaceAll("#6D6D6E","#26AB74")}
                                    </div>
                                    <div class="relative w-100">
                                        <input
                                            bind:this = {domTop[i]}
                                            type="text"
                                            value={dataBody[main.name][i].value}
                                            on:keyup={() =>  handleKeyup(`${main.name}-${i}`, i)}
                                            on:focus = {() => handleKeyup(`${main.name}-${i}`, i)}
                                            on:focusout = {() => {
                                                dataBody[main.name][i].value = domTop[i].value
                                                if(dataBodyTracker[main.name][i].allowFocusOut) dataBodyTracker[main.name][i].data = []
                                            }}
                                            on:change = {() => dataBody[main.name][i].valueArray = []}
                                        />
                                        {#if dataBodyTracker[main.name][i].data.length}
                                            <FancyDropDown
                                                bind:data = {dataBodyTracker[main.name][i].data}
                                                type = {"property"}
                                                bind:selectedOption = {dataBody[main.name][i].value}
                                                bind:allowFocusOut = {dataBodyTracker[main.name][i].allowFocusOut}
                                                style = {"top: 3.3rem"}
                                                key = {`${main.name}-${i}`}
                                            />
                                        {/if}
                                    </div>
                                </div>

                                <SideMenu
                                    bind:showMenu = {dataBodyTracker[main.name][i].isMenuOpen}
                                    {sideMenu}
                                    {handleSideMenuAction}
                                    {handleSideMenuOver}
                                    {handleSideMenuOut}
                                    handleMenuClick =  {(e) => handleMenuClick(e, main.name, i, null, "isMenuOpen")}
                                    style = {"top: 2.2rem"}
                                />
                            </div>
                            {#if item?.value && main.name == "filters"}
                                <div class="bottom">
                                    <Dropdown
                                        placeholder = {"Select Event"}
                                        options={operatorType[item.type]}
                                        bind:selectedStatusIndex={dataBody[main.name][i].operator}
                                        position="right"
                                        type="plain"
                                        class = "custom-dropdown"
                                    />
                                    {#if item.type == "number"}
                                        <input
                                            bind:this={domInputFilter}
                                            placeholder="type a number"
                                            type="text"
                                            value = {dataBody[main.name][i].valueArray[0] || ""}
                                            on:focusout = {() => dataBody[main.name][i].valueArray[0] = domInputFilter.value}
                                        >
                                    {:else}
                                        {#if collectionValue?.[item.value]}
                                            <div class="multiple">
                                                <Dropdown
                                                    placeholder = {"Select a value..."}
                                                    options={collectionValue?.[item.value]}
                                                    bind:selectedStatusIndex={dataBody[main.name][i].valueArray}
                                                    position="right"
                                                    type="plain"
                                                    selection = "multiple"
                                                    class = {`custom-dropdown ${dataBody[main.name][i].valueArray.length > 0 ? "white" : ""}`}
                                                />
                                            </div>
                                        {/if}
                                    {/if}
                                </div>
                            {/if}

                            {#if main.name == "traits"}
                                <div class="bottom">
                                    <DropdownType2
                                        title={traitOperator[item.operator].name}
                                        actions={traitOperator}
                                        bind:selectedIndex={dataBody[main.name][i].operator}
                                    />

                                    <input
                                        type="text"
                                        value={dataBody[main.name][i].title}
                                        placeholder="type to overwrite title"
                                        bind:this={dom}
                                        on:focusout = {() => dataBody[main.name][i].title = dom.value}
                                    />
                                </div>
                                <div class="bottom">
                                    {#if dataBody[main.name][i].type == "formula"}
                                        <Formula
                                            data = {traitsData}
                                            bind:dataObj = {dataBody[main.name][i]}
                                            bind:dataObjTracker = {dataBodyTracker[main.name][i]}
                                        />
                                    {/if}
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            {/if}
        {/if}
    </div>
<style>

    .icon{
        padding-right: 1rem;
        cursor: pointer;
    }
    .border-radius{
        border-radius: 0.5rem
    }
    .step-title{
        position: relative;
        display: block;
        padding: 2px 0px;
    }
    .w-step{
        width: calc(100% - 1.6rem) !important;
        margin-top: 0.8rem;
        border-radius: 0.5rem;
        margin-left: calc(16px + 1rem);
    }
    :global(.bottom .formula-card){
        margin-top: 0rem !important;
        margin-left: 0rem !important;
        width: 100%;
    }
    .bottom input::placeholder{
        font-style: italic;
        font-size: 1.1rem;
    }
    .bottom{
        margin-top: 1rem;
        display: flex;
        gap: 4px;
        align-items: center;
    }
    .left :global(.custom-dropdown .dropdown), .bottom :global(.custom-dropdown .dropdown) {
        padding: .8rem;
        transform: translateY(1rem);
        left: -1.6rem !important;
        border: 0px;
        border: 1px solid #383C42;
        padding: 0;
        background-color: #060b13;
        border-radius: 0.5rem;
	}
    .bottom :global(.custom-dropdown .dropdown){
        left: 0rem !important;
        transform: translateY(0.5rem);
    }
    .left :global(.custom-dropdown .dropdown .dropdown-option), .bottom :global(.custom-dropdown .dropdown .dropdown-option) {
        color: #fff;
        font-weight: 400;
        padding: 1.35rem;
    }

    .left :global(.custom-dropdown .dropdown-selection .option-content p){
        font-size: 14px !important;
        color: #fff;
        font-style: normal;
    }

    .left :global(.custom-dropdown .dropdown .dropdown-option p), .bottom :global(.custom-dropdown .dropdown .dropdown-option p) {
        font-size: 1.15rem;
    }

    .bottom :global(.custom-dropdown .dropdown-selection .option-content p){
        font-size: 12px !important;
        line-height: 1.2;
        background-color: #212830;
        padding: 6px 8px;
        border: 1px solid #383C42;
        border-radius: 0.5rem;
    }

    .multiple :global(.custom-dropdown .dropdown-selection .option-content p){
        color: #6D6D6E;
        width: 100%;
        font-style: italic;
    }

    .multiple :global(.white .dropdown-selection .option-content p){
        color: #FFF;
        font-style: normal;
    }

    .w-100 {
        width: 100%;
    }
    .small-gap{
        display: flex;
        gap: 8px;
    }

    .small-gap-col{
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .align-center{
        align-items: center;
    }
    .layer-card input{
        width: 100%;
        border: none;
        color: #fff;
        background-color: transparent;
        padding: 2px 8px;
        border-radius: 0.5rem;
        font-weight: 400;
        font-size: 12px;
        font-family: 'Inter', sans-serif;
    }
    .layer-card .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        gap: 2rem;
    }
    .layer-card-container{
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 19px;
    }
    .layer-card {
        width: 100%;
        padding: 12px 8px 12px 16px;
        border: 1px solid #212830;
        border-radius: 1rem;
        position: relative;
    }
    :global(.dropdown){
        font-size: 1.15rem !important;
        color: #88888A !important;
        align-items: start;
    }
    :global(.dropdown .dropdown-title){
        font-size: 12px !important;
        background-color: #10141c38;
        color: #6D6D6E!important;
        border: none !important;
        width: max-content;
        font-weight: 500;
        margin-left: 1.2rem;
        margin-top: 3px;
        cursor: pointer;
        padding-top: 0px;
        padding-bottom: 0px;

    }

    .bottom :global(.dropdown .dropdown-title){
        margin-left: 0rem;
        padding: 0;
    }

    .bottom :global(.dropdown .dropdown-content){
        left: 0rem;
        padding: 0;
    }

    :global(.dropdown .dropdown-content){
        background-color: #060b13 !important;
        font-size: 12px !important;
        left: 2.1rem;
        top: -20px !important;
    }
    .top {
        display:  flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        position: relative;
    }

    .top .left {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
    }

    .options{
        margin-top: 7px;
        padding: 2px 6px;
        font-size: 34px;
    }

    .count-indicator-input{
        width: calc(100% - 16px - 1rem) !important;
    }
    .count-indicator{
        height: 16px;
        width: 16px;
        font-size: 1.1rem;
        background-color: #F37361;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .side-padding-2 {
        padding: 0 12px;
    }

    .step-top-1{
        border-bottom: 1px solid #212830;
        padding-bottom: 8px
    }

    .step-top-2{
        padding-top: 0.8rem;
    }

    .card-step{
        border: 1px solid #212830;
        border-radius: 8px;
        padding: 12px 0px
    }
    
</style>
<script>
    import Table from '$lib/toolkit/Table.svelte';
    import {sum, ascending, descending, sort} from 'd3'

	export let dataRes;
    export let dataResBackUp;

    let numberOfProductPerPage = 20
    let pageTab = Math.ceil(dataRes.length / numberOfProductPerPage)
    let currentTab = 0
    let activeTableTab = "all"
    let nextTab
    let prevTab
    let sortType = "asc"
    pageTab = pageTab > 0 ? pageTab : 1

    let tableHeaders = [
        {name: "", width: "4.5%"},
        {name: "", width: "4.5%"},
        {name: "Product", width: "20%"},
        {name: "Status", width: "10%"},
        {name: "Inventory", width: "17%"},
        {name: "Variant Count", width: "9%"},
        {name: "Engagement Score", width: "12%"},
        {name: "Type", width: "10%"},
        {name: "Vendor", width: "13%"}
    ]

    let tableDefination =  [
        {type: "checkbox", property: ""},
        {type: "image", property: d => d.featuredImage.url , alt: d => d.title},
        {type: "text", property: d => d.title},
        {type: "status", property: d => d.status},
        {type: "inventory-text", property: [d => d.totalInventory, d => d.variantsCount.count ] },
        {type: "text", property: d => d.variantsCount.count},
        {type: "text", static : "true", property : "A"},
        {type: "text", default : "No Type", property : d => d.productType},
        {type: "text", text : "", property : d => d.vendor}
    ]

    const sortData = (value, d = dataRes) => {
        sortType = value
        return dataRes = sortType == "asc" 
            ? sort(d, (a, b) => ascending(a.handle, b.handle))
            : sort(d, (a, b) => descending(a.handle, b.handle))
    }

    const tableTabFunc = (value) => {
        activeTableTab = value
        if (value == "all") {
            dataRes = sortData(sortType, dataResBackUp)
            return
        }

        let temp = dataResBackUp.filter((d) => d.status.toLowerCase() == value)
        if(temp.length == 0){
            dataRes = temp
            return
        }

        dataRes = sortData(sortType, temp)
        return
    }

</script>

<div class="table-card custom-bar">
    <div class = "table">
        <div class="table-tabs">
            <div class="left">
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="tab" on:click={() => tableTabFunc("all")} class:active = {activeTableTab == "all"}>All</div>
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="tab" on:click={() => tableTabFunc("active")} class:active = {activeTableTab == "active"}>Active</div>
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="tab" on:click={() => tableTabFunc("draft")} class:active = {activeTableTab == "draft"}>Draft</div>
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="tab" on:click={() => tableTabFunc("archive")} class:active = {activeTableTab == "archive"}>Archive</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17.5003 17.5003L13.917 13.917" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>           
        </div>
        <Table
            {tableDefination}
            {tableHeaders}
            {dataRes}
            {sortData}
            {sortType}
            sortIndex = {2}
            url = "/products/viewProducts?id="
        />
    
    </div>
</div>


<div class="pagination-row">
    <div class="pagination">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <div 
            class="prev-next page-tab"
            on:mouseover={() => {
                prevTab.childNodes[0].style.stroke = "#fff"
                prevTab.childNodes[1].style.stroke = "#fff"
            }}
            on:mouseleave={() => {
                prevTab.childNodes[0].style.stroke = "#88888A"
                prevTab.childNodes[1].style.stroke = "#88888A"
            }}
        >
            <svg bind:this = {prevTab} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.668 8H3.33464" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 3.33334L3.33333 8.00001L8 12.6667" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span> Previous </span>
        </div>

        {#each {length: pageTab} as _ , i}
            <div class="page-number page-tab" class:page-tab-active = {i == currentTab}>
                {i + 1}
            </div>
        {/each}

        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <div 
            class="prev-next page-tab"
            on:mouseover={() => {
                nextTab.childNodes[0].style.stroke = "#fff"
                nextTab.childNodes[1].style.stroke = "#fff"
            }}
            on:mouseleave={() => {
                nextTab.childNodes[0].style.stroke = "#88888A"
                nextTab.childNodes[1].style.stroke = "#88888A"
            }}
        >
            <span> Next </span>
            <svg bind:this = {nextTab} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.33203 8H12.6654" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 3.33334L12.6667 8.00001L8 12.6667" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    </div>
</div>

<style>
    .table {
        /* height: calc(100vh - 25rem - 75px); */
        position: relative;
        min-width: 1000px;
       
    }

    .table-card{
        margin: 0px 3.2rem;
        background-color: #0d121a;
        overflow-x: auto;
        margin-top: 5.3rem;
        width: calc(100% - 6.4rem);
        border-radius: 20px;
        border: 0.1rem solid #1a1f26;
    }

    .table-tabs {
        padding: 1rem 3rem;
        border-bottom: 0.1rem solid #1a1f26;
        border-radius: 20px 20px 0px 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .left .tab {
        color: #efefef;
        cursor: pointer;
        border-radius: 5px;
        font-size: 1.25rem;
        padding: 0.8rem 1rem;
        background-color: transparent;
        transition: background-color 0.3s ease;
    }

    .tab.active, .tab:hover {
        background-color: #212830;
        transition: background-color 0.3s ease;
    }

    .left{
        display: flex;
        gap: 3rem;
    }
    .right{
        text-align: right;
    }

    .pagination-row{
        display: flex;
        justify-content: end;
        margin-top: 3rem;
    }

    .pagination{
        position: relative;
        display: flex;
        right: 0px;
        border-radius: 1rem;
        background-color: #0d121a;
        width: fit-content;
        margin: 0px 3.2rem;
    }

    .prev-next, .page-number{
        display: flex;
        padding: 1rem 1.2rem;
        font-size: 1.2rem;
        gap: 1.5rem;
    }
    .page-number{
        padding: 1rem 1.5rem;
        border: .1rem solid #383C42;
    }

    .prev-next:first-child{
        border: .1rem solid #383C42;
        border-radius: 1rem 0rem 0rem 1rem;
        border-right: 0rem;
    }
    .prev-next:last-child{
        border: .1rem solid #383C42;
        border-left: 0rem;
        border-radius: 0rem 1rem 1rem 0rem;
    }


    .page-tab{
        cursor: pointer;
        background-color: transparent;
        color: #88888A;
        transition: all 0.5s ease;
    }

    .page-tab:hover, .page-tab-active{
        background-color: #555;
        color: #FFFFFF;
        transition: all 0.5s ease;
    }  
</style>

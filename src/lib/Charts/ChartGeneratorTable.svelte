<script>
    import {dateFormat} from "./utlis"
    import {parsePeriod, selectableDays} from '../../stores/functions';
    import {mean} from 'd3'
    import {toastMessage} from "../../stores/toast"

    export let data
    export let isTimeScale
    export let body
    export let accuracy
    export let extentFlat
    export let numberChecked
    export let maxNumberOfitemToCheck
    export let rowHovered
    export let chartType

    let depth = 0
    let fixedDom = 0
    let dynamicTableContent = {}
    let breakdown = body?.breakdown ? body.breakdown.slice(0, body.breakdown.length - 1) : []
    let tempParse = parsePeriod[accuracy]

    let t = `<div>`
    let bClass = ""
    const handleTableString = (tempData = data.current) => {
        if(breakdown.length == 0){            
            //dynamicTableContent.push(tempData)
            dynamicTableContent["0"] = tempData
            // t = `${t}<div class = "row main-border">
            //             <div class = "cell checked-cell ${"0"}">
            //                 <div class="report-checkbox active" style="--checkbox-color: gray"></div>
            //             </div>
            //             <div class = "cell border no-bg">
            //                 <div>${mean(tempData, k => k.value).toFixed(2)}</div>
            //             </div>
            //         </div>
            //     `
            return
        }

        Object.keys(tempData).map((d, i) => {            
            t = `${t} <div class = "row">
                <div class = "cell ">${handleValue(d,  tempParse(d) ? true : false)}</div>`
                bClass = d
            handleTableString2(tempData[d], d)
            if(breakdown.length == 1){t = `${t} </div>`}
        })

        if(breakdown.length > 1) {t = `${t} </div>`}
        
    }
    const handleTableString2 = (tempData = data.current, prefix) => {
        if(breakdown.length > 1) {
            t = `${t} <div>`
        } else {
            dynamicTableContent[bClass] = tempData
            
            bClass = prefix
            return 
        }
        for (let i = 0; i < Object.keys(tempData).length; i++) {
            let d = Object.keys(tempData)[i]
            if(breakdown.length > 1){
                t = `${t} <div class = "row"><div class = "cell" >${handleValue(d,  tempParse(d) ? true : false)}</div>`
            }
            if(typeof tempData === 'object' && !Array.isArray(tempData)){
                if(Array.isArray(tempData[d])){
                    bClass = `${bClass}_${d}`
                    t = `${t} </div>`
                    dynamicTableContent[bClass] = tempData[d]
                } else {
                    bClass = `${bClass}_${d}`
                    handleTableString2(tempData[d], bClass)
                }
            }
            bClass = prefix 
        }

        if(breakdown.length > 1){
            t = `${t} </div></div>`
        }
    }
    const handleChecked = (r) => {
        if(!extentFlat.current[r].checked && numberChecked == maxNumberOfitemToCheck){
            $toastMessage.type = 'error';
			$toastMessage.content = `Only ${maxNumberOfitemToCheck} items can be checked at once`;
        } else {
            extentFlat.current[r].checked = !extentFlat.current[r].checked
            extentFlat.current[r].checked ? numberChecked += 1 : numberChecked -= 1
            extentFlat = extentFlat
        }
    }
    const handleValue = (key, useTimeScale) => {
        console.log(key, useTimeScale);
        
        if(useTimeScale) key = dateFormat(tempParse(key))
        if(key.length > 15){
            return `${key.replaceAll("/>", "").replaceAll("<", " ").slice(0, 15)}...`
        }
        return key
    }

    $:body.breakdown, handleTableString()
    
</script>
    
    <div class = "table custom-bar">
            <div class="table-fixed" bind:clientWidth={fixedDom}>
                    <div class="row header">
                        {#if breakdown.length > 0}
                            {#each breakdown as item}
                                <div class="cell">{item.value}</div>
                            {/each}
                        {/if}
                    </div>
                    <div class = "body">
                        <div class = "row main-border cg-table ">
                            {@html `${t}`}
                        </div>
                       
                    </div>
            </div>
        <div class="table-dynamic" style={`margin-left: ${0}px`}>
            <div class="row header">
                <div class="body-fix" style={`left : ${breakdown.length * 121}px`}>
                    {#if chartType != "doughnut" && chartType != "funnel"}
                        <div class="cell w40-content">
                            <div class="report-checkbox" class:active={true} style={`--checkbox-color: gray`}></div>
                        </div>
                    {/if}
                  
                    <div class="cell">Average</div>
                </div>
                {#each Object.values(dynamicTableContent)[0] as r,i}
                    <div class="cell">{`${chartType == "funnel" ? i + 1 + ". " : ""}${handleValue(r.key,  isTimeScale ? true : false)}`}</div>
                {/each}
            </div>
            <div class = "body">
                {#each Object.keys(dynamicTableContent) as d}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                <div class="row" on:mouseover={() => rowHovered = d} on:mouseout = {() => rowHovered = ""}>
                    <div class="body-fix" style={`left : ${breakdown.length * 121}px`}>
                        {#if chartType != "doughnut" && chartType != "funnel"}
                            <div class = "w40-content">
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    <!-- svelte-ignore missing-declaration -->
                                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                                    <div class = "cell checked-cell" on:click={() => handleChecked(d)}>
                                        <div 
                                            class={`report-checkbox ${extentFlat?.current?.[d]?.checked && "active"}`} 
                                            style={`--checkbox-color: ${extentFlat?.current?.[d]?.color}`}
                                        ></div>
                                    </div>
                            </div>
                        {/if}
                        <div class = "cell">
                            <div>{mean(dynamicTableContent[d], k => k.value).toFixed(2)}</div>
                        </div>
                    </div>
                    {#each dynamicTableContent[d] as {value}}
                        <div class="cell">{value.toFixed(2)}</div>
                    {/each}
                </div>

                {/each}
            </div>
        </div>
    </div>
<style>
    .body-fix{
        border-right: 1px solid #383c42;
        position: sticky;
        display: flex;
        background: inherit;
    }
    .header .body-fix{
        top: 0px;
    }
    :global(.table){
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        max-width: 100%;
        overflow-y: auto;
        width: max-content;
        /* gap: 1px; */
        max-height: 100%;
        
    }

    .table-fixed{
        border-right: 1px solid #212830;
        background-color: #060b13;
        position: sticky;
        left: 0px;
        height: 100%;
        z-index: 7;
    }
    .table-dynamic{
        height: 100%;
        /* border-bottom: 1px solid #212830; */
    }

    .row{
        display: flex;
        width: max-content;
        flex-wrap: nowrap;
        gap: 1px;
        /* border-bottom: 1px solid #212830; */
    }

    .table-fixed .row {
        gap: 1px
    }

    :global(.table .cg-table .row){
        display: flex;
        gap: 1px;
        background-color: #060b13 !important;
    }
    :global(.table .cg-table .main-border){
        /* border-bottom: 0px solid #212830; */
        height: max-content
    }
    .table .header{
        font-weight: 500;
        text-transform: capitalize;
        font-size: 1.2rem;
        border-bottom: 1px solid #212830;
        z-index: 5;
      
    }
    .table .row{
        background-color: #0d121a;
        transition: all 0.5s ease;
    }

    .table .body .row:hover {
        background-color: #222325 !important;
        transition: all 0.5s ease;
    }

    .table .table-fixed .header, .table-dynamic .header{
        position: sticky;
        top: 0;
        left: 0;
    }
    .cell, :global(.table .cg-table .cell){
        width: 120px;
        display: flex;
        justify-content: start;
        padding: 1px;
        font-size: 1.1rem;
        border-radius: 0rem;
        padding-left: 0.8rem;
        border-bottom: 1px solid #060b13;
        cursor: pointer;
        min-height: 20px;
        align-items: center;
    }

    :global(.table .cg-table .cell){
        background-color: #0d121a;
        align-items: start;
    }
   
    
    
    .custom-bar::-webkit-scrollbar {
        height: 0.4rem;
        width: 0.4rem;
    }
    .custom-bar::-webkit-scrollbar-track {
        width: 100%;
        background: #0d121a;
    }

    .custom-bar::-webkit-scrollbar-thumb {
        background: #383c42;
        border-radius: 0rem;
    }

    .custom-bar::-webkit-scrollbar-corner {
        background: #0d121a;
    }

	:global(.report-checkbox) {
		position: relative;
		min-width: 1.3rem;
		height: 1.2rem;
		background-color: transparent;
		border: 0.5px solid #383c42;
		border-radius: 0.2rem;
        cursor: pointer;
	}

	:global(.report-checkbox.active) {
		background-color: var(--checkbox-color);
		border-color: var(--checkbox-color);
	}

	:global(.report-checkbox.active::after) {
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
    .w40-content{
        width: 40px;
    }
    .cell.w40-content, .w40-content .cell {
        display: flex;
        justify-content: center;
        width: 40px;
        padding-inline: 0;
        padding-top: 2.5px;
    }
</style>
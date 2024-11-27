<script>
    import { events, operator } from "./customChartText.js"
    import { onMount } from "svelte";
    import FancyDropDown from "./FancyDropDown.svelte";
    
    export let data
    export let dataObj
    export let dataObjTracker
    
    
    let mathObj = []
    let allowFocusOut = dataObjTracker.allowFocusOut

    const variablesDetector = /^[a-zA-Z]/
    const numberDetector = /^[\d()}]+$/
    const operatorDetector =/[*+\-\/]/

    let listForFormula = []
    let formulaText = {}
    let formulaType = ""
    let focused = "vc-c-text"
    let isMounted = false
    let selectedOption
    let formulaDomHeight
    let updated = false

    const handleCompare = () => {
        JSON.stringify(mathObj) == JSON.stringify(dataObj.formula)
            ? updated = true
            : updated = false
    }
    const handSaveFormula = () => {
        if(!updated) {
            dataObj.formula = JSON.parse(JSON.stringify(mathObj))
            updated = true
        }
    }
    const handleRemoveFormula = () => {
        dataObj.formula = []
        mathObj = []
        

        if(!dataObj?.type){
            dataObjTracker.showFormula = false
        } else {
            dataObj.type = "string"   
        }

    }

    const handleFormulaKeyDown = () => {

        if(!isMounted || !formulaText?.[focused]) {
            listForFormula = []
            selectedOption = ""
            return
        }

        if(formulaText?.[focused] == "/"){
            formulaType = "property"
            listForFormula = events
            formulaText[focused] = ""
            return
        }
        if(numberDetector.test(formulaText[focused])){
            formulaType = "number"
            listForFormula = [{index: 0, name: formulaText[focused]}]
            return
        }

        if(operatorDetector.test(formulaText[focused])){
            formulaType = "operator"
            listForFormula = operator
            return
        }

        formulaType = "property"
        listForFormula = data.filter((f) => f.name.toLowerCase().includes(formulaText[focused].toLowerCase()))
    }

    const updateFormula = () => {
       let temp = {}
       mathObj.map((d, i)=> {
            temp["vc-c-"+ i] = ""
            temp["vc-v-"+ i] = d.value
        })
        temp["vc-c-"+ "last"] = ""
        formulaText = temp
        listForFormula = []
        focused = "vc-c-error"

    }

    const handleMath = () => {
        if(!selectedOption) return
        let value = selectedOption
        let focusedArray = focused.split("-")
        let index = focusedArray[2]

        allowFocusOut = true
        if(focusedArray[2] == "text" || focusedArray[2] == "last"){
            mathObj.push({
                value,
                formulaType
        })} else if (focusedArray[1] == "c"){
            let temp = [
                ...mathObj.slice(0, index),
                {
                    value,
                    formulaType
                },
                ...mathObj.slice(index)
            ]
            mathObj = [...temp]
        } else if (focusedArray[1] == "v"){
            mathObj[index] = {
                value,
                formulaType
            }
        }

        mathObj = mathObj
        updateFormula()

    }

    const handleFocused = (value) => {
        focused = value
    }

    const handleFocusedOut = () => {
      allowFocusOut && updateFormula()
    }

    const handleKeyDown = (e, v) => {
        if(e.key == "Enter"){
            e.preventDefault()
            return
        }
        if(e.key == "Delete"){
            e.preventDefault()
            let index = +v.split("-")[2] 
            mathObj.splice(index, 1)
            mathObj = mathObj
            updateFormula()
        }

        mathObj = mathObj
    }

    onMount(() => isMounted = true)

    $:selectedOption, handleMath()
    $:formulaText, focused, handleFormulaKeyDown()

    $:mathObj, handleCompare()

</script>
    <!-- svelte-ignore missing-declaration -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->


<div class="formula-card">
    <div class="formula-content" bind:clientHeight={formulaDomHeight}>
        
        {#if mathObj && mathObj.length > 0}
            <div class="math">
                {#each mathObj as item, i}
                    <span 
                        bind:innerHTML={formulaText["vc-c-" + i]}  
                        class ="small-input" 
                        contenteditable="true" 
                        on:focus={() => {handleFocused("vc-c-" + i)}}
                        on:focusout = {(e) => handleFocusedOut()}
                    ></span>
                    <span 
                        class={`formula-item ${item.formulaType}`} 
                        on:focus={() => handleFocused("vc-v-" + i)}
                        on:focusout = {(e) => handleFocusedOut()}
                        on:keydown = {(e) => handleKeyDown(e, "vc-v-" + i)}
                        contenteditable 
                        bind:innerHTML={formulaText["vc-v-" + i]}>{@html item.value}</span>
                        
                    {#if mathObj.length - 1 == i}
                        <span 
                            class ="small-input  small-input-last"
                            contenteditable="true"
                            on:focus={() => handleFocused("vc-c-last")}
                            on:focusout = {(e) => handleFocusedOut()}
                            bind:innerHTML={formulaText["vc-c-last"]}
                        ></span>
                    {/if}
                {/each}
            </div>
            
        {/if}
        {#if !mathObj || mathObj.length == 0}
        <div class="relative w-100">
            <input 
                class="formula-input"
                type="text" placeholder="type / for variables; * for operators"
                on:click={() => handleFocused("vc-c-text")}
                bind:value = {formulaText["vc-c-text"]}
            />
        </div>

        {/if}
    </div>
        {#if listForFormula.length > 0}
            <FancyDropDown 
                bind:data = {listForFormula}
                type = {formulaType} 
                handleOptionClick = {handleMath}
                bind:selectedOption = {selectedOption}
                bind:allowFocusOut = {allowFocusOut}
                style = {`top :35px`}
            />
        {/if}

    
    <div class="small-gap">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" on:click={()=> handleRemoveFormula()}>
            <g clip-path="url(#clip0_721_12026)">
                <path d="M8.00065 14.6666C11.6825 14.6666 14.6673 11.6819 14.6673 7.99998C14.6673 4.31808 11.6825 1.33331 8.00065 1.33331C4.31875 1.33331 1.33398 4.31808 1.33398 7.99998C1.33398 11.6819 4.31875 14.6666 8.00065 14.6666Z" stroke="#e78f8f" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 6L6 10" stroke="#e78f8f" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 6L10 10" stroke="#e78f8f" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
                <clipPath id="clip0_721_12026">
                    <rect width="16" height="16" fill="white"/>
                </clipPath>
            </defs>
        </svg>
        <svg on:click={() => handSaveFormula()} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.00065 14.6666C11.6827 14.6666 14.6673 11.682 14.6673 7.99998C14.6673 4.31798 11.6827 1.33331 8.00065 1.33331C4.31865 1.33331 1.33398 4.31798 1.33398 7.99998C1.33398 11.682 4.31865 14.6666 8.00065 14.6666Z" fill={`${updated ? "#383C42" : "#0CB47F"}`}/>
            <path d="M6 8.00002L7.33333 9.33335L10 6.66669" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
</div>

<style>

    .w-100 { 
        width: 100%;
    }
    .small-input{
        max-width: 200px;
        width: max-content;
        background-color: transparent;
        border: none;
        color: #fff;
        padding: 3px 4px 3px 0px;
        border-radius: 0.2rem;
        display: flex;
        align-items: center;
    }
    .small-input-last{
        padding: 3px 0px 3px 4px
    }
    .math {
        display: flex;
        flex-wrap: wrap;
 
    }
    .formula-content{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .formula-content input{
        width: 100%;
    }
    .formula-dropdown{
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }
    .formula-item{
        width: max-content;
        border-radius: 5rem;
        padding:3px 5px;
        cursor: pointer;
        font-size: 11px;
        border: 1px solid #212830;
        color: #fff;
        transition: all 0.5s ease;
        font-weight: 500;
    }
    .property{
        background-color: #947AF0;
    }

    .number {
        background-color: #383C42;
    }

    .operator {
        background-color: #0CB47F;
    }

    .formula-dropdown{
        overflow: auto;
        max-height: 200px;
        height: auto;
        position: absolute;
        width: 100%;
        background-color: #212830;
        border: 1px solid #383C42;
        border-radius: 0.8rem;
        margin-top: 1rem;
        z-index: 3;
        padding: 1.2rem;
    }
    .mt-1 {
        margin-top: 1rem;
    }
    .small-gap{
        display: flex;
        gap: 4px;
    }
    .formula-card{
        background-color: #212830;
        min-width: calc(100% - 4rem);
        border: 1px solid #383C42;
        border-radius: 0.5rem;
        margin-top: 12px;
        margin-left: 2.8rem;
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0.5rem 0.5rem 0.25rem ;
        cursor: pointer;
        gap: 1rem;
        position: relative;
        align-items: center;
        
    }
    .formula-input{
        padding: 2px 8px;
        border-radius: 0.5rem 0 0 0.5rem;
        border: 0px;
        background: none;
        color: #eee;
        font-size: 11px;
        width: 85%;
        display: flex;
        flex-wrap: wrap;
    }
</style>
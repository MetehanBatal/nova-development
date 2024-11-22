<script>
    export let data
    export let type
    export let allowFocusOut
    export let style
    export let key
    export let selectedOption

    key = key ? key : "valueCalculation"
</script>
<div class="formula-dropdown custom-bar" {style}>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    {#each data as item, i}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
         <!--  handleOptionClick(item)-->
        <div 
            class={`formula-item ${type}`} 
            on:click={() => {
                selectedOption = item?.icon ? item.icon : item.name
                data = []
                allowFocusOut = true
            }}
            on:mouseover = {() => allowFocusOut = false}
            on:mouseleave = {() => allowFocusOut = true}
        >
            <div class="small-gap">
                {#if item?.icon}
                    <div>{item.icon}</div>
                {/if}
                {item.name}
            </div>
        </div>
    {/each}
</div>
<style>
    .small-input{
        max-width: 200px;
        width: max-content;
        background-color: transparent;
        border: none;
        color: #fff;
        padding: 3px 4px;
        border-radius: 0.2rem;
    }
    .small-input-last{
        padding: 3px 4px;
        background-color:#383C42;
    }
    .math {
        padding: 3px 4px;
        display: flex;
        flex-wrap: wrap;
 
    }
    .formula-content{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .formula-dropdown{
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    .formula-item{
        /* width: max-content; */
        border-radius: 5rem;
        padding: 4px 8px;
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
        border-radius: 0.5rem;
        z-index: 3;
        left: 0px;
        padding:6px 8px;
    }
    .mt-1 {
        margin-top: 1rem;
    }
    .small-gap{
        display: flex;
        gap: 1rem;
    }
    .formula-card{
        background-color: #212830;
        min-width: calc(100% - 4rem);
        border: 1px solid #383C42;
        border-radius: 0.5rem;
        margin-top: 1rem;
        margin-left: 3.5rem;
        display: flex;
        justify-content: space-between;
        padding-right: 1rem;
        cursor: pointer;
        gap: 1rem;
        position: relative  ;
        
    }
    .formula-input{
        padding: 1.2rem 1.8rem;
        border-radius: 0.8rem 0 0 0.8rem;
        border: 0px;
        background: none;
        color: #eee;
        font-size: 8px;
        width: 85%;
        display: flex;
        flex-wrap: wrap;
    }
</style>
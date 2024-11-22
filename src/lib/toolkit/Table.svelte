<script>
    import { goto } from '$app/navigation';

    export let tableHeaders
    export let dataRes
    export let tableDefination
    export let url
    export let sortData
    export let sortType
    export let sortIndex
    export let selectProductVariant

</script> 

<div class="table-header">
    {#each tableHeaders as item, i}
        <div class="item-tab" style={`width: ${item.width}`}>
            <div class:header-title = {i == sortIndex}>
                {#if item.type == "checkbox"}
                    <input 
                        type="checkbox" 
                        class="checkmark"
                    />
                {/if}
                {#if item.icon}
                    {@html item.icon}
                {/if}
                {item.name}
                {#if i == sortIndex}
                    <div class="sort-icon">
                        <!-- svelte-ignore missing-declaration -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <svg on:click={() => sortData("dsc")} class ="sort-up" width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path class:stroke-color = {sortType == "dsc"} d="M1 3.78574L4 0.785736L7 3.78574" stroke="#88888A" stroke-width="0.857143" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                            <!-- svelte-ignore missing-declaration -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <svg on:click={() => sortData("asc")} class ="sort-down"  width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path class:stroke-color = {sortType == "asc"} d="M1 1.35684L4 4.35684L7 1.35684" stroke="#88888A" stroke-width="0.857143" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                            
                    </div>
                {/if}
                
            </div>
        </div>
    {/each}
</div>
{#each dataRes as d, i}
    <!-- <a class="table-a" href={`/products/viewProducts?id=${d.id}`}> -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div 
            class="table-row"
                on:click={(e) => url ? goto(`${url}${d.id}`) : selectProductVariant = i}
        >
            {#each tableHeaders as item, i}
            <div class="item-tab" style={`width: ${item.width}`}>
                <!-- checkbox -->
                {#if tableDefination[i].type == "checkbox"}
                    <input 
                        type="checkbox" 
                        class="checkmark"
                        on:click={(e) => e.stopPropagation() }
                    />
                <!-- text input -->
                {:else if  tableDefination[i].type == "input"}
                    <div class= "input-text-group">
                        {#if tableDefination[i].prefix}
                            <p>{tableDefination[i].prefix}</p>
                        {/if}
                        <input class:input-text-price = {tableDefination[i].prefix}  type="text" class="input-text" value={tableDefination[i].property(d)}>
                    </div>
                <!-- image -->
                {:else if  tableDefination[i].type == "image"}
                    <img src={tableDefination[i].property(d)} alt={tableDefination[i].alt(d)}>
                <!-- text  -->
                {:else if tableDefination[i].type == "text"}
                    {#if tableDefination[i].static}
                         {tableDefination[i].property}
                    {:else if  tableDefination[i].default}
                        { tableDefination[i].property(d) == "" 
                            ? tableDefination[i].default
                            : tableDefination[i].property(d)
                        }
                    {:else}
                         {tableDefination[i].property(d)}
                    {/if}
                <!-- status -->
                {:else if tableDefination[i].type == "status"}
                    <span class="text-transform status-active"class:active-green = {tableDefination[i].property(d).toLowerCase() == "active"}>
                        {tableDefination[i].property(d).toLowerCase()}
                    </span>
                <!-- text with 2 variables -->
                {:else if tableDefination[i].type == "inventory-text"}
                    {`${tableDefination[i].property[0](d)} in stock for ${tableDefination[i].property[1](d)} variant${tableDefination[i].property[1](d) > 1 ? "s" : ""}`}
                {:else}
                    "No Table Defination"
                {/if}
            </div>
        {/each}
        </div>
    <!-- </a> -->
{/each}

<style>
    .item-tab{
        padding: 1.5rem 1.2rem;
        font-size: 1.3rem;
        font-weight: 500;
        display: flex;
        position: relative;
        align-items: center;
        justify-content: start;
        color: #ddd;
    }

    .table-row .item-tab{
        padding: 1rem 1.2rem;
        color: #eee;
        position: relative;
    }

    .item-tab img{
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 7px;
        border: 0.1rem solid #1a1f26;
    }
    
    .table-header, .table-row{
        display: flex;
        align-items: center;
        /* border-top: 0.1rem solid #1a1f26; */
    }
    
    .table-header{
        font-weight: 600 !important;
    }

    .table-row{
        cursor: pointer;
    }
    .table-row:nth-child(odd){
        background-color: #212830;
    }

    .checkmark {
		min-width: auto;
		max-width: auto;
        width: 0;
        height: 0;
		opacity: 1;
		background-color: #0D121A;
		border: .2rem solid #383C42;   
		cursor: pointer;
	}

	.checkmark:after {
		position: absolute;
		top: 0;
		left: 0;
		opacity: 1;
		width: 1.8rem;
		height: 1.8rem;
		border: .2rem solid #383C42;
		border-radius: .4rem;
		background-repeat: no-repeat;
		background-position: center;
        transform: translateY(-50%);
	}

	.checkmark:checked:after {
		background-image: url('/assets/icons/ic-check.svg');
	}

    .stroke-color {
        stroke: #fff !important;
    }

    .header-title{
        display: flex;
        gap:1.1rem;
        align-items: center;
    }

    .sort-icon{
        display: flex;
        flex-direction: column;
        gap:0.4rem;
        cursor: pointer;
    }
    .input-text-group{
        display: flex;
        align-items: center;
        width: 80%;

    }
    .input-text-group p{
        width: 15%;
        height: 3rem;
        position: relative;
        display: flex;
        justify-content: end;
        align-items: center;
        color: #777;
        border-radius: 0.5rem  0rem 0rem 0.5rem;
        background-color: #0D121A;
    }
    .input-text{
        width: 90%;
        border: 0rem solid #1a1f26;
        background-color: #0D121A;
        color: #fff;
        padding: 0 1.2rem;
        height: 3rem;
        border-radius: 0.5rem;
    }

    .input-text-price{
        border-radius: 0rem  0.5rem 0.5rem 0rem;
        width: 75%;
    }

    .status-active {
        padding: 0.2rem 1rem;
        border-radius: 1rem;
        background-color: #555;
        color: black;
        font-size: 1.3rem;
        font-weight: 500;
        align-self:center
    }

    .active-green{
        background-color: #0cb47f;
    }

    .text-transform{
        text-transform: capitalize
    }


</style>
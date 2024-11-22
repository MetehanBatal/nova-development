<script>
    import { onMount } from 'svelte';
    import DropdownNoCheckBox from '$lib/toolkit/DropdownNoCheckBox.svelte';
    import BackToTab from '$lib/toolkit/backToTab.svelte';
    import ProductStatus from '$lib/toolkit/ProductStatus.svelte';
    import UpdateProduct from '$lib/products/UpdateProduct.svelte';
    import UpdateProductVariant from '$lib/products/UpdateProductVariant.svelte';
    
    export let data;
    let productData = {}
    let isActiveAction = false
    let isActiveShare = false
    let selectProductVariant = -1
    let isAddNewProduct = false

    let activeSection = [1, 0]

    const actions = [
        { name: "Export", index: 0 },
        { name: "Import", index: 1 },
        { name: "Share", index: 2 },
    ];

    const share = [
        { name: "Share", index: 0 },
    ];
    
    onMount(() => {
        isAddNewProduct = data.productRes ? false : true
        productData = isAddNewProduct ? {} : data.productRes.product
    })

    const setActiveSection = () => {
        if(selectProductVariant > -1){
            activeSection = [0, 1]
        } else if (selectProductVariant < 0){
            activeSection = [1, 0]
        }
    }

    $: selectProductVariant, setActiveSection()
    
</script>
    {#if Object.keys(productData).length > 0 || isAddNewProduct}
    <div class="product-container custom-bar">
        <div class="product-view-header">
            <div class="left align-start">
                {#if activeSection[1]}
                    <BackToTab clickFunc = {() => selectProductVariant = -1} title = {"Back to - " + productData.title} class = "back-to-tab"/>
                {:else}
                     {#if isAddNewProduct}
                        <BackToTab url = "/products" title = "Back to products" class = "back-to-tab"/>
                     {:else}
                        <BackToTab url = "/products" title = {productData.title} class = "back-to-tab"/>
                        <ProductStatus text = {productData.status}/>
                     {/if}   
                    
                {/if}
            </div>
            {#if activeSection[0] && !isAddNewProduct}
                <div class="right">
                    <div class="cta-button button-small secondary">Duplicate</div>
                    <div class="cta-button button-small secondary">Preview</div>
                    <DropdownNoCheckBox title = "More Actions" {actions} isActive = {isActiveAction}/>
                    <DropdownNoCheckBox title = "Share" actions = {share} isActive = {isActiveShare}/>
                    <div class="cta-button button-small secondary">
                        <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.75 0.5L1.25 4L4.75 7.5" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>    
                        <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.25 7.5L4.75 4L1.25 0.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            {/if}
        </div>
        <!-- main activeSection[0]-->
         {#if activeSection[0]}
            {#if isAddNewProduct}
                <UpdateProduct productData = {{}} bind:selectProductVariant = {selectProductVariant}/>
            {:else}
                <UpdateProduct {productData} bind:selectProductVariant = {selectProductVariant}/>
            {/if}
         {:else}
            <UpdateProductVariant data = {productData.variants.nodes[selectProductVariant]} />
         {/if}
        
    

    </div>
    {/if}
    

<style>
    .product-view-header{
        display: flex;
        padding: 3rem 3.2rem;
        justify-content: space-between;
        align-items: center;
    }

    .right{
        display: flex;
        justify-content: end;
        gap: 1rem;
    }

    .align-start {
        display: flex;
        justify-content: flex-start;
    }

    .left {
        align-items: center;
        gap: 2rem

    }

    .product-view-header :global(.back-to-tab) {
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 1rem
	}
    


</style>
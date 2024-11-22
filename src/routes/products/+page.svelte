<script>
    import Header from '$lib/products/Header.svelte';
    import TableSection from '$lib/products/TableSection.svelte';
    import { onMount } from 'svelte';

	export let data;
    let dataRes = [];
    let dataResBackUp = []

    onMount(() => {
        console.log(data);
        dataRes = data.productRes.products;
        dataResBackUp = JSON.parse(JSON.stringify(dataRes));
    })
    
</script>

<Header/>

{#if dataRes.length > 0}
    <TableSection {dataRes} {dataResBackUp}/>
{/if}    
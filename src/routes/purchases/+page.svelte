<script>
	import TableGrid from '$lib/purchases/TableGrid.svelte';
	import Navbar from "$lib/purchases/Navbar.svelte";

	export let data;
	let purchaseData = data.purchaseRes.docs;
    let totalPurchases = data.purchaseRes.totalDocs;
</script>

<Navbar />

<TableGrid {totalPurchases} orders={purchaseData} totalPages={data.purchaseRes.availablePages} />
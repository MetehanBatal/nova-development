<script>
	import AdditionalDetails from "$lib/purchases/AdditionalDetails.svelte";
	import OrderSummary from "$lib/purchases/OrderSummary.svelte";
	import Timeline from "$lib/purchases/Timeline.svelte";

	export let data;

	console.log('Data: ', data);

	let purchaseData = data.orderRes.purchaseData;
	let analyticsData = data.analyticsRes.data[0];

	let fullName = purchaseData.billingAddress.first_name + ' ' + purchaseData.billingAddress.last_name;
	let shippingAddress = purchaseData.shippingAddress.address1 + ' ' + purchaseData.shippingAddress.address2 + ' ' + purchaseData.shippingAddress.city;
	let email = purchaseData.email;
	let phone = purchaseData.billingAddress.phone;
</script> 



<div class="purchase-container">
	<div class="orders-informations">
		<OrderSummary filteredOrder={purchaseData}/>

		<Timeline sessionId={analyticsData?.sessionId} name={fullName} />
	</div>

	<AdditionalDetails fullName={fullName} shippingAddress={shippingAddress} email={email} phone={phone} analytics={analyticsData} />
</div>


<style>
	.purchase-container {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		
		gap: 3.2rem;

		padding-left: 3.2rem;
	}

	.orders-informations {
		display: flex;
		flex-direction: column;
		flex: 1;

		padding-top: 3.2rem;
	}
</style>
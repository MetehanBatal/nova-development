export async function load({ fetch, params }) {
	const purchaseReq = await fetch("https://preconvert.novus.studio/prod/mPurchases/view?limit=40&offset=0");
	const purchaseRes = await purchaseReq.json();
	// const analyticsReq = await fetch("https://preconvert.novus.studio/prod/mAnalytics/view?limit=100&offset=0");
	// const analyticsRes = await analyticsReq.json();

	return { purchaseRes };	
}
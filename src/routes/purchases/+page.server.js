export async function load({ fetch, params }) {
	const purchaseReq = await fetch(
		'https://miracle.novus.studio/prod/purchases/view?limit=40&offset=0'
	);
	const purchaseRes = await purchaseReq.json();
	// const analyticsReq = await fetch("https://mve.novus.studio/prod/analytics/view?limit=100&offset=0");
	// const analyticsRes = await analyticsReq.json();

	return { purchaseRes };
}

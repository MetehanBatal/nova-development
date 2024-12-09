export async function load({ fetch, params }) {
	const orderReq = await fetch(`https://preconvert.novus.studio/prod/purchases/view?purchaseId=${params.slug}`);
	const orderRes = await orderReq.json();
	const analyticsReq = await fetch(`https://preconvert.novus.studio/prod/mSessions/view?purchaseId=${params.slug}`);
	const analyticsRes = await analyticsReq.json();

	return { orderRes, analyticsRes };
}
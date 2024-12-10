export async function load({ fetch, url }) {
	let id = url.searchParams.get('id');
	if (id == 'add-new') {
		return {};
	}
	const productReq = await fetch(
		`https://mve.novus.studio/prod/products/viewProducts?id=${id}`
	);
	const productRes = await productReq.json();
	return { productRes };
}

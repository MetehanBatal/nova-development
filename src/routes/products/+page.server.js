export async function load({ fetch, params }) {
	const productsReq = await fetch("https://preconvert.novus.studio/prod/products/viewProducts");
	const productRes = await productsReq.json();
	return { productRes }
}
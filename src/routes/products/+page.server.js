export async function load({ fetch, params }) {
	const productsReq = await fetch("https://mve.novus.studio/prod/products/viewProducts");
	const productRes = await productsReq.json();
	return { productRes }
}
export async function load({ fetch, params }) {
	const experimentsReq = await fetch("https://mve.novus.studio/prod/experiments/view?limit=100&offset=0&status=in-progress");
	const experimentsRes = await experimentsReq.json();

	return { experimentsRes };	
}
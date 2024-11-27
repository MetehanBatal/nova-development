export async function load({ fetch, params }) {
	const experimentsReq = await fetch("http://localhost:3030/prod/experiments/view?limit=100");
	const experimentsRes = await experimentsReq.json();
	// const analyticsReq = await fetch("http://localhost:3030/prod/sessions/view?limit=100&offset=0");
	// const analyticsRes = await analyticsReq.json();

	return { experimentsRes };	
}
export async function load({ fetch, params }) {
	const experimentsReq = await fetch("https://preconvert.novus.studio/prod/mExperiments/view?limit=100&offset=0&status=in-progress");
	const experimentsRes = await experimentsReq.json();

	return { experimentsRes };	
}
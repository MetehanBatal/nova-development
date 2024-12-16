export async function load({ fetch, params }) {
	const experimentsReq = await fetch("https://preconvert.novus.studio/prod/mExperiments/view?limit=100");
	const experimentsRes = await experimentsReq.json();
	// const analyticsReq = await fetch("https://preconvert.novus.studio/prod/mSessions/view?limit=100&offset=0");
	// const analyticsRes = await analyticsReq.json();

	return { experimentsRes };	
}
export async function load({ fetch, params }) {
	const experimentReq = await fetch(`https://preconvert.novus.studio/prod/mExperiments/view?id=${params.slug}`);
	const experimentRes = await experimentReq.json();

	return { experimentRes };
}
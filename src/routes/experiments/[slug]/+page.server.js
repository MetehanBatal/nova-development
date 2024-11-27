export async function load({ fetch, params }) {
	const experimentReq = await fetch(`http://localhost:3030/prod/experiments/view?id=${params.slug}`);
	const experimentRes = await experimentReq.json();

	return { experimentRes };
}
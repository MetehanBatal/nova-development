export async function load({ fetch, params }) {
	const experimentReq = await fetch(
		`https://mve.novus.studio/prod/experiments/view?id=${params.slug}`
	);
	const experimentRes = await experimentReq.json();

	return { experimentRes };
}

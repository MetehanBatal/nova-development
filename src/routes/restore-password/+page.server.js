export async function load(event) {
	const email = event.url.searchParams.get('email') || 'validationfailed';

	return { email };
};
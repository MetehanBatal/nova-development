export async function load(event) {
	let signUpStatus = false;
	let token = '';

	if (event.url.searchParams.get('signup') && event.url.searchParams.get('signup') === 'true') {
		signUpStatus = event.url.searchParams.get('email') || 'validationfailed';
		token = event.url.searchParams.get('token');
	};

	return { signUpStatus, token };
};
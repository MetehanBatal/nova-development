export async function load(event) {
	const userDetails = event.locals.userDetails;
	const locals = event.locals;

	// return { bannerData, experimentData, assignedVariantId, city, country, ipAddress, route }
	return { userDetails, locals };
};
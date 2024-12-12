export async function load(event) {
  const userDetails = event.locals.userDetails;
  const locals = event.locals;
  const keys = Object.keys(event);

  // return { bannerData, experimentData, assignedVariantId, city, country, ipAddress, route }
  return { userDetails, locals, keys };
}

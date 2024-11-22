export async function load({ fetch, params }) {
	const membersReq = await fetch("https://mve.novus.studio/prod/users/view");
	const membersRes = await membersReq.json();

	return { membersRes };	
}
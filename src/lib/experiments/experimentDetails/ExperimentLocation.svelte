<script>
	// import { routes } from '../../../stores/routes--dev';

	export let slug;

	let routes = [];
	async function fetchPages() {
		try {
			const response = await fetch('http://localhost:3030/staging/pages/view?limit=100&offset=0');
			
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			let routeData = await response.json(); // Parse the JSON response
			routes = routeData.data.docs;
			console.log(routes, slug, routes.filter((location) => location.slug === slug));
		} catch (error) {
			console.error('Error:', error); // Log any errors
		}
	}

	fetchPages();

	let currentLocation = '';
	
	$: routes, currentLocation = routes.filter((location) => location.slug === slug)[0];
</script>

<div class="config-outer-box">
	<span class="muted">Locations</span>

	<div class="config-box">
		<p>{currentLocation?.pageName}</p>
	</div>
</div>

<style>
	.config-outer-box {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
	}

	.config-box {
		display: flex;
		justify-content: space-between;
		align-items: center;

		min-width: 26rem;

		background-color: #0D121A;
		border: .1rem solid #212830;
		border-radius: .8rem;

		padding: 1.2rem 1.4rem;
	}
</style>
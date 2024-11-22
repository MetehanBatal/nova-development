<script>
	import { routes } from '../../../stores/routes--dev';

	export let slug;
	
	let currentLocation = routes.filter((location) => location.path === slug)[0];
</script>

<div class="config-outer-box">
	<span class="muted">Locations</span>

	<div class="config-box">
		<p>{currentLocation.name}</p>
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
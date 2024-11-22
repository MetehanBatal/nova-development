<script>
	import Dropdown from '$lib/toolkit/Dropdown.svelte';

	export let options;
	export let selectedMetricIndex;

	const labelOptions = [
		{
			id: 'TotalEvents',
			name: 'Total Events'
		},
		{
			id: 'UniqueEvents',
			name: 'Unique Events'
		}
	];
	let selectedLabelIndex = 0;
</script>

<div class="query-outer-box">
	<div class="query-bar">
		<p>
			Metrics
		</p>
	</div>

	<div class="query-box">
		<div class="query">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<Dropdown options={options} bind:selectedStatusIndex={selectedMetricIndex} position="left" type="plain" />

			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M8.0026 8.66683C8.37079 8.66683 8.66927 8.36835 8.66927 8.00016C8.66927 7.63197 8.37079 7.3335 8.0026 7.3335C7.63441 7.3335 7.33594 7.63197 7.33594 8.00016C7.33594 8.36835 7.63441 8.66683 8.0026 8.66683Z" stroke="#88888A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M8.0026 8.66683C8.37079 8.66683 8.66927 8.36835 8.66927 8.00016C8.66927 7.63197 8.37079 7.3335 8.0026 7.3335C7.63441 7.3335 7.33594 7.63197 7.33594 8.00016C7.33594 8.36835 7.63441 8.66683 8.0026 8.66683Z" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M8.0026 3.99984C8.37079 3.99984 8.66927 3.70136 8.66927 3.33317C8.66927 2.96498 8.37079 2.6665 8.0026 2.6665C7.63441 2.6665 7.33594 2.96498 7.33594 3.33317C7.33594 3.70136 7.63441 3.99984 8.0026 3.99984Z" stroke="#88888A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M8.0026 3.99984C8.37079 3.99984 8.66927 3.70136 8.66927 3.33317C8.66927 2.96498 8.37079 2.6665 8.0026 2.6665C7.63441 2.6665 7.33594 2.96498 7.33594 3.33317C7.33594 3.70136 7.63441 3.99984 8.0026 3.99984Z" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M8.0026 13.3333C8.37079 13.3333 8.66927 13.0349 8.66927 12.6667C8.66927 12.2985 8.37079 12 8.0026 12C7.63441 12 7.33594 12.2985 7.33594 12.6667C7.33594 13.0349 7.63441 13.3333 8.0026 13.3333Z" stroke="#88888A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M8.0026 13.3333C8.37079 13.3333 8.66927 13.0349 8.66927 12.6667C8.66927 12.2985 8.37079 12 8.0026 12C7.63441 12 7.33594 12.2985 7.33594 12.6667C7.33594 13.0349 7.63441 13.3333 8.0026 13.3333Z" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</div>

		<Dropdown options={labelOptions} bind:selectedStatusIndex={selectedLabelIndex} position="left" type="eventLabel" />
	</div>
</div>

<style>
	.query-outer-box {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.query-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;

		width: 100%;
	}

	.query-box {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;

		width: 100%;

		padding: 1.2rem .8rem 1.2rem 1.6rem;

		border: .1rem solid rgba(33, 40, 48, 1);
		border-radius: .8rem;
	}

	.query {
		display: flex;
		justify-content: space-between;
		align-items: center;

		width: 100%;
	}
</style>
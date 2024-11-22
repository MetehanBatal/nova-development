<script>
	import Dropdown from '$lib/toolkit/Dropdown.svelte';
  import { slide } from 'svelte/transition';
	export let options;
	export let selectedBreakdowns;

	
	function addNewBreakdown() {
		if (selectedBreakdowns.length > 1) return
		selectedBreakdowns.push({id: null, innerId: 2, selectedValues: null});
		selectedBreakdowns = selectedBreakdowns;
		console.log('Selected breakdown should be changed now');
	};

//$: console.log(options[breakdownIndex.id].innerValues);

$: console.log(selectedBreakdowns);

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="query-outer-box">
	<div class="query-bar" on:click={() => {addNewBreakdown()}}>
		<p>
			Breakdown
		</p>
		{#if selectedBreakdowns.length < 2}
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M3.33398 8H12.6673" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M8 3.33325V12.6666" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		{/if}
	</div>

	
	<!-- <div class="query-box">
		<div class="query">
			<Dropdown options={options} bind:selectedStatusIndex={selectedBreakdowns} position="left" type="plain" />

			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M8.0026 8.66683C8.37079 8.66683 8.66927 8.36835 8.66927 8.00016C8.66927 7.63197 8.37079 7.3335 8.0026 7.3335C7.63441 7.3335 7.33594 7.63197 7.33594 8.00016C7.33594 8.36835 7.63441 8.66683 8.0026 8.66683Z" stroke="#88888A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M8.0026 8.66683C8.37079 8.66683 8.66927 8.36835 8.66927 8.00016C8.66927 7.63197 8.37079 7.3335 8.0026 7.3335C7.63441 7.3335 7.33594 7.63197 7.33594 8.00016C7.33594 8.36835 7.63441 8.66683 8.0026 8.66683Z" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M8.0026 3.99984C8.37079 3.99984 8.66927 3.70136 8.66927 3.33317C8.66927 2.96498 8.37079 2.6665 8.0026 2.6665C7.63441 2.6665 7.33594 2.96498 7.33594 3.33317C7.33594 3.70136 7.63441 3.99984 8.0026 3.99984Z" stroke="#88888A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M8.0026 3.99984C8.37079 3.99984 8.66927 3.70136 8.66927 3.33317C8.66927 2.96498 8.37079 2.6665 8.0026 2.6665C7.63441 2.6665 7.33594 2.96498 7.33594 3.33317C7.33594 3.70136 7.63441 3.99984 8.0026 3.99984Z" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M8.0026 13.3333C8.37079 13.3333 8.66927 13.0349 8.66927 12.6667C8.66927 12.2985 8.37079 12 8.0026 12C7.63441 12 7.33594 12.2985 7.33594 12.6667C7.33594 13.0349 7.63441 13.3333 8.0026 13.3333Z" stroke="#88888A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M8.0026 13.3333C8.37079 13.3333 8.66927 13.0349 8.66927 12.6667C8.66927 12.2985 8.37079 12 8.0026 12C7.63441 12 7.33594 12.2985 7.33594 12.6667C7.33594 13.0349 7.63441 13.3333 8.0026 13.3333Z" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</div>

	</div> -->
	{#if selectedBreakdowns.length > 0}
	{#each selectedBreakdowns as breakdownIndex, _index}
	{#if _index >= 0}
	<div class="query-box">
		<div class="query">
			<Dropdown from = {_index == 0 ? "" : "breakdown"} placeholder = "Select Breakdown" options={_index == 0 ? options.slice(0,1) : options.slice(1)} bind:selectedStatusIndex={breakdownIndex.id} position="left" type="plain" />
			{#if _index > 0}
			<svg on:click={(e) => {selectedBreakdowns = selectedBreakdowns.filter(f => f.id !== breakdownIndex.id);}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#88888A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>

			{/if}
		</div>

		<!-- {#if breakdownIndex.innerId !== null && breakdownIndex.id !== null && options[breakdownIndex.id].innerValues.length > 0}
		<div class="query-labels">
			<Dropdown placeholder = "Select Breakdown" options={options[breakdownIndex.id].innerOptions} bind:selectedStatusIndex={breakdownIndex.innerId} position="left" type="eventLabel" />

			{#if options[breakdownIndex.id].type === 'dropdown'}
				<Dropdown placeholder = "Select Breakdown"  options={options[breakdownIndex.id].innerValues} bind:selectedStatusIndex={selectedBreakdowns[_index].selectedValues} position="left" type="eventLabel" selection="multiple" />
			{/if}
		</div>
		{/if} -->
	</div>
	{/if}
	{/each}
	{/if}
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
		padding-right: .8rem;
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
	.query-label-box {
		width: fit-content;
		padding: .4rem .8rem;
		background-color: #212830;
		border: .1rem solid #383C42;
		border-radius: .6rem;
	}
	.query-label-box p {
		font-size: 1.2rem;
	}
</style>
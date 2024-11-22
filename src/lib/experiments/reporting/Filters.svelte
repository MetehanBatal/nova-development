<script>
	import { page } from '$app/stores';
	import Dropdown from '$lib/toolkit/Dropdown.svelte';
	import { componentStructureFunc } from '../../../stores/functions.js'


	export let filters;
	export let selectedFilters;
	export let dateRange;

	let experimentData = $page.data?.experimentRes?.data;
	experimentData = experimentData[0];
	let variants = experimentData['variants']
	let components  = componentStructureFunc(variants)

	function addNewFilter() {
		selectedFilters.push({id: null, innerId: 2, selectedValues: null});
		selectedFilters = selectedFilters;
		console.log('Selected filters should be changed now');
	};

	$: selectedFilters, filters.filter(f => f.type === 'dropdown').forEach((f) => {
		//if (f.innerValues.length < 1) {
			if (f.id === 'VariantId') {
				f.innerValues = []
				f.innerValues = $page.data.experimentRes.data[0].variants.map((v, index) => ({
					id: v.id,
					name: v.name,
					index: index
				}));
			}
			if (f.id === 'Arm') {
				f.innerValues = []
				let ii = 0
				let tempValues = []
				$page.data.experimentRes.data[0].variants[0].arms.map((a, index) => {
					components[index].components.map((v, i) => {
						tempValues.push ({
							name: v,
							header: i == 0 ? a.name : "",
							id: v.toLowerCase().replaceAll(' ', ''),
							index: ii++
						})
					})
				})
				f.innerValues = [...tempValues]
				return
			}
		//}
	});
	filters = filters
	$: selectedFilters, console.log('Slec f changed: ', selectedFilters, filters)

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="query-outer-box">
	<div class="query-bar" on:click={() => {addNewFilter()}}>
		<p>
			Filters
		</p>

		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M3.33398 8H12.6673" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M8 3.33325V12.6666" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
	</div>


	{#if selectedFilters.length > 1}
	{#each selectedFilters as filterIndex, _index}
	{#if _index > 0}
	<div class="query-box">
		<div class="query">
			<Dropdown placeholder = "Select Filter" options={filters} bind:selectedStatusIndex={filterIndex.id} position="left" type="plain" />

			<svg on:click={(e) => {selectedFilters = selectedFilters.filter(f => f.id !== filterIndex.id); console.log(selectedFilters)}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#88888A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
		</div>

		{#if filterIndex.innerId !== null && filterIndex.id !== null}
		<div class="query-labels">
			<Dropdown placeholder = "Select Filter" options={filters[filterIndex.id].innerOptions} bind:selectedStatusIndex={filterIndex.innerId} position="left" type="eventLabel" />

			{#if filters[filterIndex.id].type === 'dropdown'}
				<Dropdown placeholder = "Select Filter" options={filters[filterIndex.id].innerValues} bind:selectedStatusIndex={selectedFilters[_index].selectedValues} position="left" type="eventLabel" selection="multiple" />
			{/if}
		</div>
		{/if}
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

		padding: .6rem .8rem;

		border-radius: .6rem;
	}

	.query-bar:hover {
		background-color: #0d121a;
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

	.query svg {
		cursor: pointer;
	}

	.query-labels {
		display: flex;
		gap: .4rem;
	}

	.query-label-box {
		width: fit-content;

		padding: .4rem .8rem;

		background-color: #212830;
		border: .1rem solid #383C42;
		border-radius: .6rem;
	}

	.query .muted {
		font-style: italic;
		font-size: 1.4rem;
	} 

	.query-label-box p {
		font-size: 1.2rem;
	}
</style>
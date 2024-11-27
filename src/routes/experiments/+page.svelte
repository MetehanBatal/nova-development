<script>
	import ExperimentCards from "$lib/experiments/ExperimentCards.svelte";
	import CreateNewExperiment from "$lib/experiments/CreateNewExperiment.svelte";
	import TabSection from "$lib/experiments/TabSection.svelte";

	import Audiences from '$lib/audiences/Audiences.svelte';

	export let data;

	const excludedIds = [390375802347, 773819988178];

	let experiments = data.experimentsRes.data?.docs?.filter(
		(experiment) => !excludedIds.includes(experiment.id)
	);

	const tabs = [
		{ title: 'Experiments', id: 'in-progress' },
		{ title: 'Drafts', id: 'draft' },
		{ title: 'Archive', id: ['successful', 'failed'] }
	];
	let activeTabIndex = 0;

	experiments = experiments.filter((experiment) => experiment.status === tabs[activeTabIndex].id);

	let isFormActive = false;
	let isAudiences = false;

	$: activeTabIndex, experiments = experiments.filter((experiment) => typeof(tabs[activeTabIndex].id) === 'object' ? tabs[activeTabIndex].id.includes(experiment.status) : experiment.status === tabs[activeTabIndex].id );

	let filteredExperiments = [];
</script>

{#if !isFormActive}
	<TabSection bind:filteredExperiments={filteredExperiments} {experiments} {tabs} bind:activeTabIndex={activeTabIndex} bind:isAudiences={isAudiences}/>
{/if}

<div class="section-wrapper">
	<ExperimentCards bind:filteredExperiments={filteredExperiments} {experiments} bind:isFormActive={isFormActive} />
	
	{#if isFormActive}
	<CreateNewExperiment bind:isFormActive={isFormActive} />
	{/if}
</div>

{#if isAudiences}
	<Audiences on:audiencesClosed={() => isAudiences = false} bind:isAudiences={isAudiences} />
{/if}

<style scoped>
	.section-wrapper {
		padding: 3.2rem;
	}
</style>
<script>
	import { page } from '$app/stores';

	export let isFormActive = false; 
	export let experiments;
	export let filteredExperiments;
	// let experiments = $page.data.experimentsRes.data.docs;
</script>

{#if !isFormActive}
	<div class="cards-wrapper">
		<div class="experiment-card" on:click={() => isFormActive = true}>
			<p class="heading">Create a New Experiment</p>
			<p class="low-text">See the results of the experiment with graphs and useful resources</p>
			<div class="cta-button primary">
				New Experiment
			</div>
		</div>

		{#if experiments && experiments.length > 0}
			{#if filteredExperiments.length > 0}
				{#each filteredExperiments as experiment}
					<a href={`/experiments/${experiment.id}`} class="experiment-card">
						<div class="experiment-bg-image">
							<!-- <img src={`/assets/images/${experiment.id}.png`} alt="Experiment Thumbnail"> -->
							{#if experiment.thumbnail}
								<img src={`${experiment.thumbnail}.webp`} alt="Experiment Thumbnail">
								{:else}
								<img class="fit-contain" src="/assets/icons/logo.svg" alt="Experiment Thumbnail">
							{/if}
						</div>

						<div class="experiment-badge bg-purple">
							{experiment.type === 'ab' ? 'A/B Testing' : 'Multi-variate'}
						</div>

						<p>
							{experiment.name}
						</p>
					</a>
				{/each}				
			{/if}
		{/if}
		
		{#each Array(6) as _, index}
		<div class="experiment-card empty-bg"></div>
		{/each}
	</div>
{/if}


<style>
	.cards-wrapper {
		display: flex;
		flex-wrap: wrap;
		gap: 2.4rem;

		width: 100%;
		
		margin-top: 2.4rem;
	}

	.experiment-bg-image {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		height: 100%;
		width: 100%;
		z-index: -1;
		border-radius: 1.6rem;
		overflow: hidden;
	}

	.experiment-bg-image img {
		height: 100%;
		object-fit: cover;
	}

	a.experiment-card p {
		text-align: left;
	}

	.fit-contain {
		width: calc(100% - 4.8rem);
	}
</style>
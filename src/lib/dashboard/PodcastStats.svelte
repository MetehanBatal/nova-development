<script>
	import { onMount } from 'svelte';
	import { colors } from '$stores/colors';

	let trafficSources = [];

	onMount(async () => {
		const requestOptions = {
		  method: "GET",
		  redirect: "follow"
		};

		fetch("https://mve.novus.studio/prod/analytics/trafficSource", requestOptions)
			.then((response) => response.json())
			.then((result) => {
				// Create a new array by filtering and modifying the existing array
				trafficSources = result.analytics.reduce((acc, cur) => {
					if (cur._id === null || cur._id === "") {
					    // Find if there's already a direct_traffic object
					    const existing = acc.find(item => item._id === "direct_traffic");
					    if (existing) {
					    	existing.views += cur.views;
					    	existing.orders += cur.orders;
					    } else {
					    	// Create new direct_traffic entry if not already created
					    	acc.push({ _id: "direct_traffic", views: cur.views, orders: cur.orders });
					    }
					} else {
					    // Push non-null and non-empty _id entries as they are
					    acc.push(cur);
					}
					
					return acc;
				}, []);
		  	})
		  	.catch((error) => console.error(error));
	})
</script>


<div class="section-wrapper">
	<h2>Conversions by Traffic Source</h2>

	<div class="line"></div>

	<div class="stats-type">
		<div class="formula">
			Formula
		</div>

		<div class="flex-6">
			<div class="podcast-name">
				Name
			</div>
			
			<div class="podcast-value">
				Value
			</div> 
		</div>
	</div>

	<div class="stats">
		<div class="stat-item">
			<div class="stat-type">
				<div class="stat-name">
					Page View
				</div>

				<div class="stat-overall">
					Overall {trafficSources.reduce((acc, source) => acc + source.views, 0)}
				</div>
			</div>

			<div class="stats-names">
				{#each trafficSources as source, _index}
				<div class="stat-inner-item">
					<p class="capitalized">{source._id.replaceAll('_', ' ')}</p>

					<div class="stat-graph-wrapper">
						<div class="graph" style={`background-color: ${colors[_index]}; width: calc(${(source.views / trafficSources[0].views) * 100 }%)`}></div>
						<p class="graph-value">{source.views}</p>
					</div>
				</div>
				{/each}
			</div>
		</div>
		<div class="stat-item">
			<div class="stat-type">
				<div class="stat-name">
					Conversion Rates (%)
				</div>

				<div class="stat-overall">
					Overall {trafficSources.reduce((acc, source) => acc + source.orders, 0)}
				</div>
			</div>
			
			<div class="stats-names">
				{#each trafficSources as source, _index}
				<div class="stat-inner-item">
					<p class="capitalized">{source._id.replaceAll('_', ' ')}</p>

					<div class="stat-graph-wrapper">
						<div class="graph" style={`background-color: ${colors[_index]}; width: calc(${(source.orders / trafficSources[0].orders) * 100 }%)`}></div>

						<p class="graph-value non-ellipsis">
							{source.orders}

							<span>{`${((source.orders / source.views) * 100).toFixed(2)}%`}</span>
						</p>
					</div>
				</div>
				{/each}
			</div>
		</div>
	</div>
</div>





<style>
	.flex-6 {
		display: flex;
		flex: 6;
		gap: 7rem;
	}

	.graph-value span {
		font-size: 1.2rem;

		margin-left: 1rem;
	}
	.line {
		margin-block: 2.4rem 1.7rem;
	}

	.section-wrapper {
		padding-inline: 1.2rem;
	}

	h2 {
		font-size: 1.8rem;
		margin-block: 2.4rem;
	}

	.stats-type {
		display: flex;
		align-items: center;
		justify-content: flex-start;

		padding-block: 1.7rem;
		color: #88888A;
		font-size: 1.4rem;
	}

	.formula {
		width: 11rem;
	}

	.podcast-name {
		margin-left: 1rem;
	}

	.podcast-value {
		flex: 2;
	}

	.stats {
		display: flex;
		flex-direction: column;
		gap: .8rem;

		padding-bottom: 6rem;
	}

	.stat-item {
		display: flex;
		align-items: flex-start;

		padding: 1.6rem 0rem 1.7rem 0rem;

		background-color: #0D121A;
		border-radius: 1.6rem;
	}

	.stat-type {
		padding: .8rem 0rem 0rem 1.2rem;

		display: flex;
		flex-direction: column;
		gap: .8rem;
		min-width: 11rem;
		max-width: 11rem;
	}

	
	
	.stat-name {
		font-size: 1.6rem;
	}
	.stat-overall {
		font-size: 1.4rem;
		color: #88888A;
	}

	.stats-names {
		display: flex;
		flex: 3;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: 1.2rem;
	}

	.stat-inner-item {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 2.4rem;

		width: 100%;

		padding-left: 1rem;

		font-size: 1.2rem;
		color: #88888A;
		
	}

	.stat-inner-item p {
		width: 9rem;
		white-space: pre;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.stat-graph-wrapper {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: flex-start;
		gap: .8rem;
	}

	.graph-value {
		white-space: pre;
	}

	.graph {
		max-width: 60rem;
		height: 2rem;

		background-color: #947AF0;

		border-radius: .4rem;
	}

	.non-ellipsis {
		width: 12rem !important;
		text-overflow: unset !important;
	}

	@media screen and (min-width: 768px) {
		.section-wrapper {
			padding-inline: 3.2rem;
		}

		.podcast-name {
			margin-left: 1rem
		}

		.stat-type {
			padding: .8rem 0rem 0rem 2.7rem;
			min-width: 25rem;
		}

		.formula {
			width: 25rem;
		}
	}

	@media screen and (min-width: 1100px) {
		.podcast-name {
			margin-left: 1rem
		}
	}

</style>
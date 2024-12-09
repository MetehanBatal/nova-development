<script>
	import { page } from '$app/stores';
	import { onMount, createEventDispatcher } from 'svelte';

	import { user } from '../../stores/user';
	
	const dispatch = createEventDispatcher();

	export let isNew;
	export let from;

	let audiences = [];

	let selectedAudienceIndex = null;
	// let audiences = [];

	onMount(async () => {
		const audiencesReq = await fetch("https://preconvert.novus.studio/prod/audiences/view?limit=20&offset=0");
		const audiencesRes = await audiencesReq.json();
		audiences = audiencesRes.docs;
	});

	function handleAudienceSelection(index) {
		let experimentData = $page.data?.experimentRes?.data[0];

		let audienceName = audiences[index].conditions[0].name;
		let audienceCondition = audiences[index].conditions[0].condition;
		let audienceValues = audiences[index].conditions[0].values;

		const apiHeaders = new Headers();
		apiHeaders.append("Content-Type", "application/json");

		experimentData.initiator = $user.emailAddress;

		const raw = JSON.stringify({
			"id": $page.data.experimentRes.data[0].id,
			"audiences": [
                {
                    "name": audienceName,
                    "values": audienceValues,
                    "condition": audienceCondition
                }
            ]
		});

		const requestOptions = {
			method: "PUT",
			headers: apiHeaders,
			body: raw,
			redirect: "follow"
		};

		fetch("https://preconvert.novus.studio/prod/mExperiments/update", requestOptions)
			.then((response) => response.json())
			.then((result) => {
				location.reload();
			})
			.catch((error) => console.error(error));

		// $page.data.experimentRes.data[0].audiences[0].name = audienceName;
		// $page.data.experimentRes.data[0].audiences[0].condition = ;
		// $page.data.experimentRes.data[0].audiences[0].values = ;
	};

	function openAudiencesInner(audience) {
		if (audience.name.length < 1) { return }

		dispatch('audienceChange', audience);
	}
</script>

<div class="audiences-content">
	<p>Target a specific audiences, adding multiple will behave like an -or-expression in the experience</p>
	
	<div class="audiences-list">
		<div class="top-row">
			<div class="row">
				<img width="14" height="14" src="/assets/icons/id.svg" alt="Audience ID">

				<span>ID</span>
			</div>
			<div class="row">
				<img width="14" height="14" src="/assets/icons/id.svg" alt="Audience Name">

				<span>Name</span>
			</div>
			<div class="row">
				<img width="14" height="14" src="/assets/icons/category.svg" alt="Audience Category">

				<span>Filter Category</span>
			</div>
		</div>

		{#each audiences as audience, _index}
		<div class="audience-item"class:active={selectedAudienceIndex === _index}>
			<div class="order">
				<div on:click={(e) => {openAudiencesInner(audience)}}><p>{audience.id}</p></div>
				<div on:click={(e) => {openAudiencesInner(audience)}}><p>{audience.name}</p></div>
				<div>
					<p>{audience.conditions[0].group}</p>

					{#if from === 'experiments'}
					<div class="cta-button primary" on:click={(e) => handleAudienceSelection(_index)}>
						Select Audience
					</div>
					{/if}
				</div>
			</div>
			
			<!-- <div class="edit-icon-wrapper">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8.0026 8.66683C8.37079 8.66683 8.66927 8.36835 8.66927 8.00016C8.66927 7.63197 8.37079 7.3335 8.0026 7.3335C7.63441 7.3335 7.33594 7.63197 7.33594 8.00016C7.33594 8.36835 7.63441 8.66683 8.0026 8.66683Z" stroke="#88888A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.0026 8.66683C8.37079 8.66683 8.66927 8.36835 8.66927 8.00016C8.66927 7.63197 8.37079 7.3335 8.0026 7.3335C7.63441 7.3335 7.33594 7.63197 7.33594 8.00016C7.33594 8.36835 7.63441 8.66683 8.0026 8.66683Z" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.0026 3.99984C8.37079 3.99984 8.66927 3.70136 8.66927 3.33317C8.66927 2.96498 8.37079 2.6665 8.0026 2.6665C7.63441 2.6665 7.33594 2.96498 7.33594 3.33317C7.33594 3.70136 7.63441 3.99984 8.0026 3.99984Z" stroke="#88888A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.0026 3.99984C8.37079 3.99984 8.66927 3.70136 8.66927 3.33317C8.66927 2.96498 8.37079 2.6665 8.0026 2.6665C7.63441 2.6665 7.33594 2.96498 7.33594 3.33317C7.33594 3.70136 7.63441 3.99984 8.0026 3.99984Z" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.0026 13.3333C8.37079 13.3333 8.66927 13.0349 8.66927 12.6667C8.66927 12.2985 8.37079 12 8.0026 12C7.63441 12 7.33594 12.2985 7.33594 12.6667C7.33594 13.0349 7.63441 13.3333 8.0026 13.3333Z" stroke="#88888A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.0026 13.3333C8.37079 13.3333 8.66927 13.0349 8.66927 12.6667C8.66927 12.2985 8.37079 12 8.0026 12C7.63441 12 7.33594 12.2985 7.33594 12.6667C7.33594 13.0349 7.63441 13.3333 8.0026 13.3333Z" stroke="black" stroke-opacity="0.2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div> -->
		</div>
		{/each}
	</div>
</div> 

<style>
	.audiences-content {
		padding: 2.4rem 3.2rem;
	}

	p {
		white-space: pre;
	}

	.audiences-content > p {
		margin-bottom: 1.8rem;
	}

	.audiences-list {
		width: 100%;
		min-height: 30rem;

		border-radius: 1.6rem;
	}

	.top-row {
		display: flex;
		align-items: center;
		justify-content: flex-start;

		border-top: .1rem solid #1a1f26;
		border-bottom: .1rem solid #1a1f26;
		border-radius: 1.6rem 1.6rem 0 0;
	}

	.row {
		display: flex;
		/*align-items: center;*/
		justify-content: flex-start;
		gap: .6rem;
		
		max-height: 4rem;
		
		padding: 1.4rem 1.6rem 1.4rem 2.4rem;
		background-color: #0d121a;
		border-right: 0.1rem solid #1a1f26;
		
		font-size: 1.4rem;
	}

	.row:first-child {
		border-left: 0.1rem solid #1a1f26;
		padding-left: 5.4rem;
	}

	.row,
	.order > div {
		width: calc(100% / 3);
	}

	.row img {
		width: 1.4rem;
	}

	.order {
		align-items: initial;

		position: relative;

		background-color: transparent;
		transition: all .3s ease-in-out;
	}

	.order > div {
		display: flex;
		align-items: center;

		border-bottom: .1rem solid #1a1f26;
		border-right: .1rem solid #1a1f26;

		padding: 1.6rem 2.4rem;
	}

	.order > div:last-child {
		justify-content: space-between;

		border-right: .1rem solid #1a1f26;
	}

	.cta-button {
		padding: .8rem 1.2rem;

		font-size: 1.2rem;
	}

	.order div:first-child {
		border-left: .1rem solid #1a1f26;
		padding-left: 5.4rem;
	}

	.audience-item {
		position: relative;
	}

	input {
		position: absolute;
		top: 35%;
		left: 2rem;

		width: 1.4rem;
		height: 1.4rem;

		opacity: 1;
		
		border: 0.1rem solid #383C42;
		border-radius: 0.6rem;
		background: transparent;

		z-index: 10;
	}

	.audience-item:hover .order,
	.audience-item.active .order {
		background-color: #141921;
	}

	.audience-item:hover input::after,
	.audience-item.active input::after {
		background-image: url('/assets/icons/ic-check.svg');
		background-repeat: no-repeat;
		background-position: center;
		background-color: #383C42;
	}

	input::after {
		position: absolute;
		top: -.2rem;
		left: -.2rem;
		
		opacity: 1;

		width: 1.6rem;
		height: 1.6rem;

		background-color: #0d121a;
		
		border: 0.1rem solid #383C42;
		border-radius: 0.6rem;

		transition: opacity .3s ease-in-out;
		
		content: '';

		cursor: pointer;
	}
</style>
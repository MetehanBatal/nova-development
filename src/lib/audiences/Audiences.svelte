<script>
	import { audience } from '$stores/audience';
    import { toastMessage } from '$stores/toast';

	import NewAudience from '$lib/audiences/NewAudience.svelte';
	import AudienceGrid from '$lib/audiences/AudiencesGrid.svelte';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let from;
	export let audiencesVisible;
	export let isAudiences;

	let inProgress = false;

	const spinner = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

	let isNew = false;

	function closePopup() {
		audiencesVisible = false; 
			
		dispatch('audiencesClosed');
	}

	function audienceChangeRequested(event) {
		isNew = true;

		$audience = event.detail
	}

	function handleBack() {
		isNew = false;

		$audience = {id: Math.floor(Math.random() * (1000000000000 - 100000000000) + 1000000000000),name: '',description: '',usedIn: [],conditions: [{group: "Traffic Source",name: 'campaign',condition: 'contains',values: [ 'some_keyword' ]}]}
	};
	
	function handleAudienceCreation() {
		const apiHeaders = new Headers();
		apiHeaders.append("Content-Type", "application/json");

		if ($audience.name.length < 1) {
			$toastMessage.type = 'error';
			$toastMessage.content = 'Name is required';
		}

		if ($audience.name.length < 1) {
			$toastMessage.type = 'error';
			$toastMessage.content = 'Name is required';
		}

		inProgress = true;

		const requestOptions = {
			method: "POST",
			headers: apiHeaders,
			body: JSON.stringify($audience),
			redirect: "follow"
		};

		fetch("https://mve.novus.studio/prod/audiences/create", requestOptions)
			.then((response) => response.text())
			.then((result) => {
				inProgress = false;
				if (result.err && result.err.length > 0) {
					$toastMessage.type = "error";
					$toastMessage.content = "Something went wrong while creating audience.";				
				} else {
					$toastMessage.type = "success";
					$toastMessage.content = "Audience created successfully.";				
				}
			})
			.catch((error) => console.error(error));
	}
</script>


<div class="audiences-outer-wrapper purchases-table">
	<div class="audiences-wrapper">
		<div class="close-icon" on:click={(e) => { closePopup() }}>
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M10 2L2 10" stroke="#6E6D81" stroke-linecap="round" stroke-linejoin="round"></path>
				<path d="M2 2L10 10" stroke="#6E6D81" stroke-linecap="round" stroke-linejoin="round"></path>
			</svg>
		</div>

		<div class="audiences-header">
			<p>
				{#if isNew}
					<span class="go-back" on:click={() => {handleBack()}}>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
							<path d="M8.75 3.5L5.25 7L8.75 10.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						{#if $audience.name.length > 1}
						{$audience.name}
						{:else}
						New Audience
						{/if}
					</span>
				{:else}
					Experience Audiences
				{/if}
			</p>
			<div class="button-wrapper">
				{#if isNew}
					<!-- <div class="cta-button secondary">Save As Draft</div> -->
					<div class="cta-button primary" on:click={handleAudienceCreation}>
						{#if inProgress}
						{@html spinner}
						{:else}
						Add Audience
						{/if}
					</div>
				{:else}
					<div class="cta-button primary" on:click={() => isNew = !isNew }>New Audience</div>
				{/if}            
			</div>
			
		</div>
	   
		{#if isNew}
		<NewAudience />
		{:else}
		<AudienceGrid on:audienceChange={audienceChangeRequested} from={from} />
		{/if}
	</div>
</div>

<style>
	.audiences-outer-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;

		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		
		background-color: rgba(6, 11, 19, .7);

		z-index: 1000;
	}

	.audiences-wrapper {
		position: relative;

		max-width: 120rem;
			width: 100%;
		max-height: 80vh;
		
		background-color: rgba(13, 18, 26, 1);
		border: .1rem solid rgba(33, 40, 48, 1);
		border-radius: 1.6rem;
	}


	.trash-icon-holder {
		cursor: pointer;
	}

	.close-icon {
		display: flex;
		align-items: center;
		justify-content: center;

		position: absolute;
		top: -10%;
		right: 0;

		padding: 1rem;
		margin: auto;

		background-color: #1a1f26;
		color: #FFF;
		border-radius: 50%;

		font-size: 1.6rem;

		cursor: pointer;
		transition: all .3s ease-in-out;
	}

	.close-icon svg {
		width: 1.8rem;
		height: 1.8rem;
	}

	.audiences-header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		height: 9rem;

		padding: 2.5rem 3.1rem;

		border-bottom: .1rem solid rgba(33, 40, 48, 1);
	}

	.button-wrapper {
		display: flex;
		align-items: flex-end;
		gap: 1.6rem;
	}

	.audiences-header p {
		font-size: 1.8rem;
	}

	.go-back {
		cursor: pointer;
	}


</style>
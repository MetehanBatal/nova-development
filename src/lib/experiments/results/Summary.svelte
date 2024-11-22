<script>
	import Audiences from '$lib/audiences/Audiences.svelte';
	import Dropdown from '$lib/toolkit/Dropdown.svelte';
	import Dialog from '$lib/toolkit/Dialog.svelte';
	import ExperimentLocation from '$lib/experiments/experimentDetails/ExperimentLocation.svelte';
	import ExperimentAudiences from '$lib/experiments/experimentDetails/ExperimentAudiences.svelte';
	import ExperimentVariants from '$lib/experiments/experimentDetails/ExperimentVariants.svelte';

	import { toastMessage } from '../../../stores/toast';
	import { user } from '../../../stores/user';

	import { page } from '$app/stores';

	let experimentData = $page.data?.experimentRes?.data;
	experimentData = experimentData[0];

	console.log('Exp: ', experimentData);
	const statusOptions = [
		{
			index: 0,
			id: 'draft',
			name: 'Draft',
			icon: '/assets/icons/status_draft.svg'
		},
		{
			index: 1,
			id: 'in-progress',
			name: 'In-progress',
			icon: '/assets/icons/status_in-progress.svg'
		},
		{
			index: 2,
			id: 'successful',
			name: 'Successful',
			icon: '/assets/icons/status_successful.svg'
		},
		{
			index: 3,
			id: 'failed',
			name: 'Failed',
			icon: '/assets/icons/status_failed.svg'
		},
	];

	let selectedStatusIndex = statusOptions.findIndex((option) => option.id === experimentData.status);

	let audiencesVisible = false;
	let dialogData = '';
	let dialogResponse = '';
	let dialogModal = false;

	function handleStatusChange() {
		if (!selectedStatusIndex) {
			return; }

		if (statusOptions[selectedStatusIndex].id === experimentData.status) {
			return; }

		let dialogInfo = [
			{
				title : "start",
				description : `This will start dividing traffic on <a href='${experimentData.baseURLs[0]}' target="_blank">${experimentData.baseURLs[0]}</a>`,
				confirmText: 'Yes, Start Experiment.',
				declineText: 'No'
			},
			{
				title : "end",
				description : `This will finish your experiment with status: <span class="experiment-status-highlighted">Successful</span> , and stop sending traffic to the variants.`,
				confirmText: 'Yes, End Experiment.',
				declineText: 'Cancel'
			},
			{
				title : "end",
				description : `This will finish your experiment with status:<span class="experiment-status-highlighted">Failed</span> , and stop sending traffic to the variants.`,
				confirmText: 'Yes, End Experiment.',
				declineText: 'Cancel'
			},
		];

		dialogData = {
			icon: '/assets/icons/dialog-icon.svg',
			title: `Are you sure you want to ${dialogInfo[selectedStatusIndex - 1].title} the experiment?`,
			content: `${dialogInfo[selectedStatusIndex - 1].description}`,
			confirmText: `${dialogInfo[selectedStatusIndex - 1].confirmText}`,
			declineText: `${dialogInfo[selectedStatusIndex - 1].declineText}`
		}

		dialogModal = true;
	};

	function handleDialogResponse() {
		if (dialogResponse.length < 1) {
			return; }

		dialogData = '';
		
		if (dialogResponse === 'confirmed') {
			dialogModal = false;
			const apiHeaders = new Headers();
			apiHeaders.append("Content-Type", "application/json");

			experimentData.status = statusOptions[selectedStatusIndex].id;
			experimentData.initiator = $user.emailAddress;

			const raw = JSON.stringify(experimentData);

			const requestOptions = {
				method: "PUT",
				headers: apiHeaders,
				body: raw,
				redirect: "follow"
			};


			fetch("https://mve.novus.studio/prod/experiments/update", requestOptions)
				.then((response) => response.json())
				.then((result) => {
					if (result.err && result.err.length > 0) {
						$toastMessage.type = "error";
						$toastMessage.content = "Something went wrong while changing experiment status.";				
					} else {
						if(experimentData.status === "successful" || experimentData.status === "failed") {
							$toastMessage.type = "success";
							$toastMessage.content = `Experiment completed with the status : ${experimentData.status}`;		
						}
						if(experimentData.status === "in-progress"){
							$toastMessage.type = "success";
							$toastMessage.content = "Experiment creation is in-progress, it will start getting traffic soon! No additional action is required.";		
						}		
					}

					setTimeout(() => {
						$toastMessage.type = "";
						$toastMessage.content = "";	
					},5000)	
				})
				.catch((error) => console.error(error));

			dialogResponse = "";
		} else {
			selectedStatusIndex = statusOptions.findIndex((option) => option.id === $page.data?.experimentRes?.data[0].status);
			dialogResponse = "";
		}
	}

	$: selectedStatusIndex, handleStatusChange();
	$: dialogResponse, handleDialogResponse();
	$: experimentData['variants']
</script>

<div class={`relative ${experimentData.type}-testing experiment-${selectedStatusIndex}`}>
	<div>
		<div class="experiment-top">
			<div>
				<h2>
					{experimentData.name}
				</h2>

				<p class="muted">
					{@html experimentData.hypothesis.objective}
				</p>
			</div>

			<div class="experiment-status" class:non-events={selectedStatusIndex > 1}>
				<span class="muted">Status</span>

				<Dropdown options={statusOptions} bind:selectedStatusIndex={selectedStatusIndex} />				
			</div>
		</div>

		<div class="experiment-configs">
			<ExperimentLocation slug={experimentData['baseURLs'][0]} />

			<ExperimentAudiences selectedAudience={experimentData['audiences']} bind:audiencesVisible={audiencesVisible} />

			<ExperimentVariants type={experimentData['type']} variants={experimentData['variants']} />
		</div>
	</div>
</div>

{#if audiencesVisible}
<Audiences bind:audiencesVisible={audiencesVisible} from="experiments" />
{/if}

{#if dialogModal}
	<Dialog data={dialogData} bind:dialogResponse={dialogResponse} bind:dialogModal={dialogModal}/>
{/if}

<style>
	.experiment-status.non-events {
		pointer-events: none;
		cursor: not-allowed;
	}

	:global(.experiment-status.non-events svg) {
		display: none;
	}

	:global(.experiment-status.non-events) {
		opacity: .3;
	}
	.relative {
		position: relative;

		background: url('/assets/images/back.jpg');
		background-repeat: repeat;
		background-size: cover;

		width: calc( 100vw - 12.6rem);
		overflow: scroll;
	}

	.relative > div {
		padding: 3.2rem;

		min-height: 60vh;
	}

	.muted {
		max-width: 40rem;

		color: #88888A;

		margin-top: .8rem;
	}

	.experiment-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.experiment-status {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: .4rem;
	}

	h2 {
		font-size: 1.8rem;
	}

	.experiment-configs {
		display: flex;
		gap: 16rem;

		width: 100%;

		margin-top: 5.6rem;
	}

	:global(.experiment-configs .config-outer-box .config-box) {
		position: relative;
	}

	:global(.experiment-configs .config-outer-box .config-box:after) {
		position: absolute;
		bottom: 2.15rem;
		left: 100%;

		width: 16.1rem;
		height: .1rem;

		content: '';

		background-color: #383C42;
	}

	:global(.muted) {
		font-size: 1.2rem;
	}

	:global(.experiment-1 .dropdown-box .dropdown .dropdown-option:first-child) {
		display: none;
	}

	:global(.experiment-0 .dropdown-box .dropdown .dropdown-option:nth-child(3)) {
		display: none;
	}
	:global(.experiment-0 .dropdown-box .dropdown .dropdown-option:nth-child(4)) {
		display: none;
	}

	@media screen and (max-width: 1400px) {
		.experiment-configs {
			gap: 6vw;
		}
	}
</style>
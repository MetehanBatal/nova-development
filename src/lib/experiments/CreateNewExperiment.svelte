<script>
	import { goto } from '$app/navigation';

	import { experiment } from '../../stores/experiment';
	import { user } from '../../stores/user';

	import ExperimentDetails from '$lib/experiments/onboarding/ExperimentDetails.svelte';
	import Hypothesis from '$lib/experiments/onboarding/Hypothesis.svelte';
	import AdvancedSettings from '$lib/experiments/onboarding/AdvancedSettings.svelte';

	import { toastMessage } from '../../stores/toast';

	const experimentSteps = [
		{
			component: ExperimentDetails,
			title: 'Experiment Details',
			icon: `
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path d="M5.6135 7.0734C5.7435 6.94339 5.89785 6.84026 6.06771 6.7699C6.23758 6.69954 6.41964 6.66333 6.6035 6.66333C6.78736 6.66333 6.96942 6.69954 7.13928 6.7699C7.30914 6.84026 7.46349 6.94339 7.5935 7.0734C7.7235 7.20341 7.82663 7.35775 7.89699 7.52762C7.96735 7.69748 8.00357 7.87954 8.00357 8.0634C8.00357 8.24726 7.96735 8.42932 7.89699 8.59919C7.82663 8.76905 7.7235 8.92339 7.5935 9.0534L3.96683 12.6667L1.3335 13.3334L1.9935 10.7001L5.6135 7.0734Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M1.3335 7.66667V3.33333C1.3335 2.6 1.9335 2 2.66683 2H5.28683C5.50644 2.00114 5.72237 2.0565 5.91543 2.16117C6.10849 2.26585 6.27271 2.41659 6.3935 2.6L6.94016 3.4C7.06095 3.58341 7.22516 3.73415 7.41823 3.83883C7.61129 3.9435 7.82722 3.99886 8.04683 4H13.3335C13.6871 4 14.0263 4.14048 14.2763 4.39052C14.5264 4.64057 14.6668 4.97971 14.6668 5.33333V12C14.6668 12.3536 14.5264 12.6928 14.2763 12.9428C14.0263 13.1929 13.6871 13.3333 13.3335 13.3333H7.00016" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>`,
			validation: [
				'name',
				'baseURLs',
				'type'
			]
		},
		{
			component: Hypothesis,
			title: 'Hypothesis',
			icon: `
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
					<g clip-path="url(#clip0_2778_7397)">
					<path d="M14.0001 4.66667L4.54681 14.12C4.19245 14.4704 3.71382 14.6664 3.21544 14.6652C2.71706 14.6639 2.23941 14.4656 1.88681 14.1133C1.53345 13.7596 1.33496 13.28 1.33496 12.78C1.33496 12.28 1.53345 11.8004 1.88681 11.4467L11.3335 2" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M14.0001 4.66667L4.54681 14.12C4.19245 14.4704 3.71382 14.6664 3.21544 14.6652C2.71706 14.6639 2.23941 14.4656 1.88681 14.1133C1.53345 13.7596 1.33496 13.28 1.33496 12.78C1.33496 12.28 1.53345 11.8004 1.88681 11.4467L11.3335 2" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M10.667 1.33325L14.667 5.33325" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M10.667 1.33325L14.667 5.33325" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M8.00033 10.6667H2.66699" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M8.00033 10.6667H2.66699" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
					</g>
					<defs>
					<clipPath id="clip0_2778_7397">
					<rect width="16" height="16" fill="white"/>
					</clipPath>
					</defs>
				</svg>`,
			validation: [
				'hypothesis.name',
				'hypothesis.objective'
			]
		},
		{
			component: AdvancedSettings,
			title: 'Advanced Settings',
			icon: `
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M6.99967 13.3334H2.66634C2.31272 13.3334 1.97358 13.1929 1.72353 12.9429C1.47348 12.6928 1.33301 12.3537 1.33301 12.0001V3.3334C1.33301 2.97978 1.47348 2.64064 1.72353 2.39059C1.97358 2.14054 2.31272 2.00006 2.66634 2.00006H5.26634C5.48933 1.99788 5.70931 2.05166 5.90614 2.15648C6.10297 2.2613 6.27037 2.41381 6.39301 2.60006L6.93301 3.40006C7.05441 3.58442 7.21969 3.73574 7.41401 3.84047C7.60833 3.94519 7.8256 4.00003 8.04634 4.00006H13.333C13.6866 4.00006 14.0258 4.14054 14.2758 4.39059C14.5259 4.64064 14.6663 4.97978 14.6663 5.3334V7.66673" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M6.99967 13.3334H2.66634C2.31272 13.3334 1.97358 13.1929 1.72353 12.9429C1.47348 12.6928 1.33301 12.3537 1.33301 12.0001V3.3334C1.33301 2.97978 1.47348 2.64064 1.72353 2.39059C1.97358 2.14054 2.31272 2.00006 2.66634 2.00006H5.26634C5.48933 1.99788 5.70931 2.05166 5.90614 2.15648C6.10297 2.2613 6.27037 2.41381 6.39301 2.60006L6.93301 3.40006C7.05441 3.58442 7.21969 3.73574 7.41401 3.84047C7.60833 3.94519 7.8256 4.00003 8.04634 4.00006H13.333C13.6866 4.00006 14.0258 4.14054 14.2758 4.39059C14.5259 4.64064 14.6663 4.97978 14.6663 5.3334V7.66673" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M14.4662 12.9334L13.8662 12.7334" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M14.4662 12.9334L13.8662 12.7334" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M10.1332 11.2666L9.5332 11.0667" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M10.1332 11.2666L9.5332 11.0667" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M11.0664 14.4667L11.2664 13.8667" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M11.0664 14.4667L11.2664 13.8667" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M12.7334 10.1334L12.9334 9.53345" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M12.7334 10.1334L12.9334 9.53345" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M13.0665 14.4667L12.7998 13.8" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M13.0665 14.4667L12.7998 13.8" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M11.2003 10.2001L10.9336 9.53345" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M11.2003 10.2001L10.9336 9.53345" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M9.5332 13.0667L10.1999 12.8" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M9.5332 13.0667L10.1999 12.8" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M13.7998 11.2L14.4665 10.9333" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M13.7998 11.2L14.4665 10.9333" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>`,
			validation: []
		},
	];

	export let isFormActive;
	let isActive = false;
	let activeStep = 0;

	$experiment.id = Math.floor(Math.random() * 1000000000000);

	function validateStep() {
		let allGood = true;

		experimentSteps[activeStep].validation.forEach((requiredItem) => {
			if (!allGood) { return; }
			// we already know there is maximum two nested childs
			let toCheck = requiredItem.includes('.') ? $experiment[requiredItem.split('.')[0]][requiredItem.split('.')[1]].toString() : $experiment[requiredItem].toString();
			
			if (toCheck.length < 1) {
				document.querySelector(`[data-validation-item="${requiredItem}"]`).classList.add('validation-failed');
				allGood = false; }
		});

		return allGood;
	}

	function goToStep(step) {
		let stepValidation = validateStep();

		if (stepValidation) {
			if (step === experimentSteps.length) {
				var apiHeaders = new Headers();
				apiHeaders.append("Content-Type", "application/json");

				$experiment.initiator = $user.emailAddress || 'metehanbatal@gmail.com';

				var requestOptions = {
					method: 'POST',
					headers: apiHeaders,
					body: JSON.stringify($experiment),
					redirect: 'follow'
				};

				fetch("http://localhost:3030/prod/experiments/create", requestOptions)
					.then(response => response.json())
					.then(result => {
						if (result.err && result.err.length > 0) {
							$toastMessage.type = "error";
							$toastMessage.content = 'Something went wrong while creating the experiment. Please contact system admin.'				
						} else {
							$toastMessage.type = "success";
							$toastMessage.content = `Experiment: ${$experiment.name} created as Draft.`;				
						}

						setTimeout(() => {
							$toastMessage.type = "";
							$toastMessage.content = "";		
						},5000)
						if (result.msg) {
							let parts = result.msg.split(' ');
							goto(`/experiments/${parts[parts.length - 2]}`);
						}
					}
					)
					.catch(error => console.error('error', error));

				return;
			} else {
				activeStep = step;
				console.log('Experiment: ', $experiment);
			};
		};
	};
</script>

<div class="experiment-title" on:click={() => isFormActive = false}>
	<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" >
		<path d="M8.75 3.5L5.25 7L8.75 10.5" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
	</svg>

	<p class="heading" >Create a New Experiment</p>
</div>

<div class="experiment-wrapper">
	<div class="experiment-header">
		<div class="experiment-steps-tab">
			{#each experimentSteps as step, _index}
				<div class="experiment-step" class:selected={activeStep === _index} on:click={() => goToStep(_index)}>
					{#if activeStep > _index}
						<svg class="white-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
							<path d="M8.00065 14.6666C11.6827 14.6666 14.6673 11.6819 14.6673 7.99992C14.6673 4.31792 11.6827 1.33325 8.00065 1.33325C4.31865 1.33325 1.33398 4.31792 1.33398 7.99992C1.33398 11.6819 4.31865 14.6666 8.00065 14.6666Z" fill="#0CB47F"/>
							<path d="M6 8.00008L7.33333 9.33341L10 6.66675" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					{:else}
						{@html step.icon}
					{/if}

					<p>{_index + 1}. {step.title}</p>
				</div>
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path d="M5.25 10.5L8.75 7L5.25 3.5" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M5.25 10.5L8.75 7L5.25 3.5" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			{/each}
		</div>
		<div class="buttons-wrapper">
			<div class="cta-button secondary">Save as Draft</div>
			<div class="cta-button primary" on:click={goToStep(activeStep + 1)}>{activeStep === 2 ? 'Create' : 'Continue'}</div>
		</div>
	</div>
</div>

<svelte:component this={experimentSteps[activeStep]['component']} />

<style>
	:global(.low-opacity) {
		opacity: 40%;
		pointer-events: none;
	}
</style>
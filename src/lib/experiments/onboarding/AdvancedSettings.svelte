<script>
	import SwitchBox from "$lib/toolkit/SwitchBox.svelte";

	import { experiment } from '$stores/experiment';

	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';
	
	let options = {
		minDate: new Date().fp_incr(10),
		enableTime: true,
		altInput: true,
    	altFormat: "F j, Y",
    	dateFormat: "Y-m-d",
	};

	let selectedDate;

	export let multiArmedStatus;
	export let selectedCriteria;

	let selectedMultiArm = null;
	let multiArmSelection = [
		{
			name : "ε-greedy method",
			value : "greedy"
		},
	];	

	let criteriaSelection = [
		{
			name : "By visitors",
			selected : false,
		},
		{
			name : "By date",
			selected : false,
		},
		{
			name : "By revenue generated",
			selected : false,
		}
	];
</script>

<div class="experiment-details">
	<div class="experiment-detail-step">
		<div class="step-item-wrapper">
			<p class="low-text">Time to go live</p>
			<div class="flatpickr-wrapper">
				<Flatpickr {options} bind:value={selectedDate} placeholder="Choose a date"  name="date" />
				
				<svg class:active-svg={selectedDate !== undefined} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path d="M13.3359 2.66699H2.66927C1.93289 2.66699 1.33594 3.26395 1.33594 4.00033V12.0003C1.33594 12.7367 1.93289 13.3337 2.66927 13.3337H13.3359C14.0723 13.3337 14.6693 12.7367 14.6693 12.0003V4.00033C14.6693 3.26395 14.0723 2.66699 13.3359 2.66699Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M6.66406 2.66699V5.33366" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M1.33594 5.33301H14.6693" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M4 2.66684V5.33351" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round" />
				</svg> 
			</div>
		</div>
	</div>
</div>

<div class="experiment-details">
	<div class="multi-armed-section">
		<SwitchBox title="Multi Armed Bandit" bind:status={multiArmedStatus}/>
	</div>
	<div class="experiment-detail-step type-select-step" class:low-opacity={!multiArmedStatus}> 
		{#each multiArmSelection as option}
			<div class="step-item-wrapper experiment-checkbox-wrapper" class:active={$experiment.armedBandit === option.value} on:click={() => { $experiment.armedBandit = option.value}}>
				<label class="experiment-checkbox">
					<span class="purple-checkmark"></span>
					<input type="checkbox"  checked={$experiment.armedBandit === option.value ? "true" : "false"}>
					{option.name}
				</label>
			</div>
		{/each}
	</div>
</div>

<div class="experiment-details">
	<p class="low-text">Completion Criteria</p>
	<div class="experiment-detail-step type-select-step">
		{#each criteriaSelection as option}
			<div class="step-item-wrapper experiment-checkbox-wrapper" class:active={selectedCriteria === option.name} on:click={() => { selectedCriteria = option.name; option.selected = !option.selected}}>
				<label class="experiment-checkbox">
					<span class="purple-checkmark"></span>
					<input type="checkbox" bind:checked={option.isChecked}>
					{option.name}
				</label>
			</div>
		{/each}
	</div>
	{#if selectedCriteria === "By visitors"}
		<div class="criteria-holder">
			<label for="criteria-type">Visitors Count</label>
			<input type="text"  bind:value={$experiment.completionCriteria.byVisitors}>
		</div>
	{/if}
	{#if selectedCriteria === "By date"}
		<div class="criteria-holder">
			<label for="criteria-type">Date</label>
			<input type="number" bind:value={$experiment.completionCriteria.byDate}>
		</div>
	{/if}
	{#if selectedCriteria === "By revenue generated"}
		<div class="criteria-holder">
			<label for="criteria-type">Revenue Value</label>
			<input type="text" name="criteria-type" bind:value={$experiment.completionCriteria.byRevenue}>
		</div>
	{/if}
</div>

<style>
	.multi-armed-section {
		margin-block: 3.2rem .8rem;
	}

	.dropdown-content.date-picker {
		width: 100%;
		transform: translateY(125%);
	}

	.criteria-holder {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		color: #88888A;
		gap: .8rem;
		margin-block: 2rem;
	}

	.criteria-holder input {
		background-color: transparent;
		border: none;
		border: .1rem solid #212830;
		padding: 1.2rem 2.4rem;
		border-radius: .8rem;
		color: #FFF;
	}

	.flatpickr-wrapper {
		position: relative;
		background-color: #0D121A;
	}

	.flatpickr-wrapper svg {
		position: absolute;
		left: 1rem;
		top: 30%;

		
	}

	:global(.flatpickr-wrapper input) {
		padding-left: 3rem;
	}

	:global(.flatpickr-wrapper svg path) {
		transition: all .3s ease-in-out;
	}

	:global(.flatpickr-wrapper .form-control) {
		cursor: pointer;
		position: relative;
		width: 100%;
		background-color: transparent;
		border: .1rem solid #212830;
		padding-left: 3rem;
	}

	:global(.flatpickr-wrapper .form-control:hover + svg path, .flatpickr-wrapper .form-control.active + svg path, .active-svg path) {
		stroke: white;
	}
</style>
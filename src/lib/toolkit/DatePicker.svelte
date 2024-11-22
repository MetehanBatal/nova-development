<script>
	import { onMount } from 'svelte';

	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';

	export let selectedOption;
	export let dateRange;

	let initialized = true;
	let mounted = false;

	let mode = selectedOption === 2 ? 'range': 'single';
	
	let options = {
		mode: mode,
		maxDate: new Date(),
		enableTime: true,
		altInput: true,
		altFormat: "F j",
		dateFormat: "Y-m-d",
		onClose: function(value) {
			if(!value.length) return
			if (selectedOption === 0) {
				dateRange.start = new Date(value[0]).getTime();
				dateRange.end = new Date().getTime();
			} else if (selectedOption === 1) {
				dateRange.start = new Date(value[0]).getTime() - (3 * 30 * 24 * 60 * 60 * 1000);
				dateRange.end = new Date(value[0]).getTime();
			} else if (selectedOption === 2) {
				if(dateRange == undefined){
					dateRange = {}
					dateRange["start"] = dateRange["end"] = new Date(value[0]).getTime();
					dateRange.end = new Date(value[1]).getTime();
				}
				dateRange.start = dateRange.end = new Date(value[0]).getTime();
				dateRange.end = new Date(value[1]).getTime();
			}
		}
	};

	if (dateRange !== undefined) {
		options['defaultDate'] = [new Date(dateRange.start).toISOString().split('T')[0], new Date(dateRange.end).toISOString().split('T')[0]]
	}

	let selectedDate;

	function resetDatePicker() {
		if (!mounted) {
			return; }
		
		selectedDate = '';

		initialized = false;

		options.mode = selectedOption === 2 ? 'range': 'single';

		setTimeout(() => initialized = true, 16);
	};

	function reportDateSelection() {
		const timestamp = new Date(selectedDate).getTime();
	}

	onMount(() => {
		mounted = true;
	})

	$: selectedOption, resetDatePicker();
	$: selectedDate, reportDateSelection();
</script>

<div class="date-picker">
	{#if initialized}
	<Flatpickr {options} bind:value={selectedDate} placeholder="Choose a date" name="date" />
	{/if}
</div>

<style>
	:global(.date-picker input) {
		min-width: auto;
		max-width: 12rem;

		padding: 0;
		background-color: transparent;

		cursor: pointer;
	}
</style>
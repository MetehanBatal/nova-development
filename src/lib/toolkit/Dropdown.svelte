<script>
	import { page } from '$app/stores';
	export let options;
	export let selectedStatusIndex;
	export let position;
	export let selection;
	export let type;
	export let from;
	export let placeholder

	let dropdownOpened = false;
	let searchTerm = '';

	if (selection === 'multiple' && selectedStatusIndex === null) {
		selectedStatusIndex = []; } 

	function handleCheckboxChange(target) {
		console.log(target);
	}

	function handleOptionSelect(event, option) {
		if (selection === 'multiple') {
			selectedStatusIndex.includes(option.index) ? selectedStatusIndex = selectedStatusIndex.filter(index => index !== option.index) : selectedStatusIndex = [...selectedStatusIndex, option.index]
		} else {
			selectedStatusIndex = option.index;
			if (!selectedStatusIndex || selectedStatusIndex == undefined) {
				selectedStatusIndex = options.findIndex((o) => o.id === option.id);
			}
			dropdownOpened = !dropdownOpened
		}

		selectedStatusIndex = selectedStatusIndex;
	}

	$: filteredData = options.filter(option =>
		option.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	console.log('D options: ', options, selectedStatusIndex, options.selectedStatusIndex?.icon);
</script>

<!-- 
@component
## Dropdown
Receives an array of objects for the options and an active index
-->


<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class={`dropdown-box ${type}`}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="dropdown-selection" class:opened={dropdownOpened} on:click={(e) => { options.length == 0 ? dropdownOpened = false : dropdownOpened = !dropdownOpened }}>
		<div class="option-content">
			{#if selectedStatusIndex !== null && options[selectedStatusIndex]?.icon}
				<!-- <img width="16" height="16" src={options[selectedStatusIndex]['icon']} alt={options[selectedStatusIndex]['name']}>-->

				{@html options[selectedStatusIndex]?.icon}
			{/if}

			{#if typeof(selectedStatusIndex) === 'object' && selectedStatusIndex !== null}
				<!-- {JSON.stringify(selectedStatusIndex)} -->
				<p>{selectedStatusIndex.length < 1 ? placeholder : `${options[selectedStatusIndex[0]]?.name}, ${selectedStatusIndex.length - 1} more...`}</p>
			{:else}
				<p class:sm={from === 'dashboard'} class:muted={selectedStatusIndex === null}>
					{
						from == "breakdown" && selectedStatusIndex !== null
						? options[selectedStatusIndex-1]?.name
						: selectedStatusIndex !== null
						? options[selectedStatusIndex]?.name
						: placeholder
					}
				</p>
			{/if}
			

			{#if from === 'dashboard'}
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
			{/if}
		</div>

		{#if type !== 'plain' && type !== 'eventLabel'}
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		{/if}
	</div>

	{#if dropdownOpened}
	<div class={`dropdown ${position} ${selection}`}>
		{#if selection === 'multiple'}
		<div class="search-field">
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
				<path d="M6.41667 11.0833C8.994 11.0833 11.0833 8.994 11.0833 6.41667C11.0833 3.83934 8.994 1.75 6.41667 1.75C3.83934 1.75 1.75 3.83934 1.75 6.41667C1.75 8.994 3.83934 11.0833 6.41667 11.0833Z" stroke="#88888A" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M6.41667 11.0833C8.994 11.0833 11.0833 8.994 11.0833 6.41667C11.0833 3.83934 8.994 1.75 6.41667 1.75C3.83934 1.75 1.75 3.83934 1.75 6.41667C1.75 8.994 3.83934 11.0833 6.41667 11.0833Z" stroke="black" stroke-opacity="0.2" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M12.2505 12.25L9.74219 9.7417" stroke="#88888A" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M12.2505 12.25L9.74219 9.7417" stroke="black" stroke-opacity="0.2" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
			<input type="text" placeholder="Search" bind:value={searchTerm} on:input={(event) => searchTerm = event.target.value.toLowerCase()}>
		</div>
		{/if}
		
		{#each filteredData as option, _index}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		 {#if option.header && option.header != ""}
			<div class="dropdown-option dropdown-header">{option.header}</div>
		 {/if}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class='dropdown-option' class:selected={selection === 'multiple' ? selectedStatusIndex.includes(option.index) : option.index === selectedStatusIndex} on:click={(e) => handleOptionSelect(e, option)}>
			<div class="option-content">
				{#if selection === 'multiple'}
					<input 
						type="checkbox" 
						class="checkmark"
						checked={selectedStatusIndex.includes(option.index)}
						on:change={(event) => handleCheckboxChange(event.target)}
					/>
				{/if}

				{#if option["icon"]}
					<!-- <img width="16" height="16" src={option['icon']} alt={option['name']}> -->
					{@html option["icon"]}
				{/if}	

				<p>{option['name']}</p>
			</div>

			<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</div>
		{/each}
	</div>
	{/if}
</div>

<style>
	.dropdown-box {
		position: relative;

		width: max-content;
	}

	.dropdown-selection {
		display: flex;
		align-items: center;
		gap: 1.4rem;

		background-color: #0D121A;
		border: .1rem solid #383C42;
		border-radius: .8rem;

		padding: 1rem 1.2rem;

		width: max-content;

		cursor: pointer;
	}

	.dropdown-box.plain .dropdown-selection {
		background-color: transparent;
		border: 0;
		
		padding: 0;
	}
	.dropdown-box.eventLabel .dropdown-selection {
		padding: .4rem .8rem;
		background-color: #212830;
		border: .1rem solid #383C42;
		border-radius: .6rem;
	}

	.dropdown-box.eventLabel .dropdown-selection p {
		font-size: 1.2rem;
	}

	.dropdown-selection svg {
		transition: transform .24s ease-in-out;
	}

	.dropdown-selection.opened svg {
		transform: rotate(180deg);
	}

	.dropdown {
		position: absolute;
		top: 100%;
		right: 0;

		width: max-content;
		max-height: 20rem;
		
		overflow: auto; 

		background-color: #0D121A;
		border: .1rem solid #383C42;
		border-radius: .8rem;

		padding: .8rem 0;

		transform: translateY(.4rem);
		z-index: 100;
	}

	.dropdown.left {
		left: 0;
		right: auto;
	}

	.dropdown-option {
		display: flex;
		align-items: center;
		gap: .8rem;

		width: 100%;

		padding: 1.2rem 1rem;

		transition: all .24s ease-in-out;
		cursor: pointer;
	}

	.dropdown-header{
		font-size: 15px;
		color: #88888A;
	}

	.dropdown-option:hover {
		background-color: rgba(33, 40, 48, .4);
	}

	.dropdown-option.selected {
		background-color: #212830;
	}

	.dropdown-option svg {
		margin-left: auto;

		opacity: 0;
	}

	.dropdown-option.selected svg {
		opacity: 1;
	}

	.dropdown.multiple p {
		margin-left: 2rem;
	}

	.option-content {
		display: flex;
		align-items: center;
		gap: .8rem;
	}

	.option-content p {
		white-space: nowrap;
	}

	.muted {
		font-style: italic;
		font-size: 1.4rem;
	} 

	p.sm {
		font-size: 1.2rem;
    	color: #88888A;
	}

	.option-content svg {
		width: 1.6rem;
		height: 1.6rem;

		stroke: #88888A;
	}

	.search-field {
		display: flex;
		align-items: center;
		justify-content: flex-start;

		width: 100%;

		padding-left: 1rem;
		
		border-bottom: 0.1rem solid #383C42;
	}

	.search-field input {
		width: 100%;

		background-color: transparent;
		color: #FFF;
		padding: 1.1rem 0 1.1rem .6rem;
		border: none;
		outline: 0;

		font-size: 1.2rem;

		cursor: pointer;
	}

	.checkmark {
		min-width: none;
		max-width: none;
			width: 0;
			height: 0;

		opacity: 1;

		background-color: #0D121A;
		border: .1rem solid #383C42;   
		
		cursor: pointer;
	}

	.checkmark:after {
		position: absolute;
		top: 0;
		left: 0;

		opacity: 1;

		width: 1.4rem;
		height: 1.4rem;
		border: .1rem solid #383C42;
		border-radius: .6rem;

		background-repeat: no-repeat;
		background-position: center;

		transform: translateY(-50%);
	}

	.checkmark:checked:after {
		background-image: url('/assets/icons/ic-check.svg');
	}
</style>
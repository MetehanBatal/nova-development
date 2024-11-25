<script>
	import { onMount, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let options;
	export let selectedIndex;
	export let nameEditable;
	export let variantCreatable;
	export let editNameEl = false;
	export let isActive = false;
	let initialized = false;

	let currentName = options[selectedIndex];

	onMount(() => {
		initialized = true;
	});

	function cancelHandler(e) {
		editNameEl = false;
		options[selectedIndex] = currentName;
	}

	function confirmHandler(e) {
		editNameEl = false;
		dispatch('nameChanged', [options[selectedIndex], 'name'])
	}

	function handleOptionSelect(index) {
		selectedIndex = index;

		isActive = !isActive;
	}

	function createNewOption() {
		options.push('New variant');
		options = options;

		console.log('Newly options: ', options);

		// handleOptionSelect(options.length - 1);
		let optLength = options.length - 1;
		dispatch('variantCreated', [optLength]);
		// let namePos = options[0].name.lastIndexOf(' ');
		// let newName = options[0].name.slice(0, namePos);
		// let idPos = options[0].id.lastIndexOf('-');
		// let newId = options[0].id.slice(0, idPos);

		// options.push({
		// 	id: `${newId}-${options.length}`,
		// 	name: `${newName} ${options.length}`,
		// 	pilotPage: ''
		// });

		// options = options;
		// handleOptionSelect(options.length - 1);
	}

	function handleListener() {
		if (!initialized) { return; }

		if (isActive) {
			document.addEventListener('click', attachEventListener);
		} else {
			document.removeEventListener('click', attachEventListener);
		}
	}

	function attachEventListener(event) {
		if (event.target.closest('.outer-box.active') === null) {
			isActive = false; }
	}

	$: isActive, handleListener();
	$: options, currentName = options[selectedIndex];
</script>

<div class="select-box">
	<div class="outer-box" class:active={isActive} class:wIcon={nameEditable}>
		<div class="elements" on:click={() => (isActive = !isActive)}>
			<p>{options[selectedIndex]}</p>
			
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M4 6L8 10L12 6" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>

			{#if editNameEl}
			<input bind:value={options[selectedIndex]} class="edit-input" type="text">

			<div class="input-actions">
				<svg on:click={(e) => cancelHandler(e)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
					<g clip-path="url(#clip0_2443_626)">
						<path d="M8.00065 14.6667C11.6825 14.6667 14.6673 11.6819 14.6673 8.00001C14.6673 4.31811 11.6825 1.33334 8.00065 1.33334C4.31875 1.33334 1.33398 4.31811 1.33398 8.00001C1.33398 11.6819 4.31875 14.6667 8.00065 14.6667Z" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M10 6L6 10" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M6 6L10 10" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
					</g>
					<defs>
						<clipPath id="clip0_2443_626">
							<rect width="16" height="16" fill="white"/>
						</clipPath>
					</defs>
				</svg>

				<svg on:click={(e) => confirmHandler(e)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path d="M8.00065 14.6667C11.6827 14.6667 14.6673 11.682 14.6673 8.00001C14.6673 4.31801 11.6827 1.33334 8.00065 1.33334C4.31865 1.33334 1.33398 4.31801 1.33398 8.00001C1.33398 11.682 4.31865 14.6667 8.00065 14.6667Z" fill="#0CB47F"/>
					<path d="M6 8.00001L7.33333 9.33334L10 6.66667" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
			{/if}
		</div>

		{#if nameEditable}
		<div class="edit-icon" on:click={(e) => editNameEl = !editNameEl}>
			<img src="/assets/icons/edit.svg" alt="Edit Name" width="16" height="16" />
		</div>
		{/if}

		<ul class="select-options">
			{#each options as option, _index}
			<li class="select-option" class:active={selectedIndex === _index} on:click={(e) => {handleOptionSelect(_index)}}>
				{option}
				<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" class="s-Z_UndjDak36a"><path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-linecap="round" stroke-linejoin="round" class="s-Z_UndjDak36a"></path></svg>
			</li>
			{/each}
			
			{#if variantCreatable}
			<li class="select-option" on:click={(e) => {createNewOption()}}>
				Create New Variant
				<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" class="s-Z_UndjDak36a"><path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-linecap="round" stroke-linejoin="round" class="s-Z_UndjDak36a"></path></svg>
			</li>
			{/if}
		</ul>
	</div>
</div>

<style>
	.outer-box {
		display: flex;
		align-items: center;
		gap: .8rem;

		position: relative;
	}

	.outer-box.wIcon .elements {
		width: calc(100% - 4rem);
	}

	.outer-box .elements {
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

	.outer-box.active .elements {
		border-color: #383C42;
	}

	.outer-box.active .elements > svg {
		transform: rotate(-180deg);
	}

	.outer-box p {
/*		width: calc(((100vw - 15.8rem) / 4) - 13rem);*/
		max-width: 100%;
		
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;

		font-size: 1.4rem;
		line-height: 1.8rem;
	}

	.edit-icon {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 3.2rem;
		height: 3.2rem;

		border-radius: .4rem;

		transition: background-color .24s ease-in-out;

		cursor: pointer;
	}

	.edit-icon:hover {
		background-color: var(--color-dark);
	}

	.outer-box > div {
		position: relative;
	}

	.select-options {
		width: 100%;
		max-height: 24rem;
		
		overflow: auto;

		position: absolute;
		top: 100%;

		transform: translateY(.4rem);
		z-index: 100;

		background-color: #0D121A;

		padding-block: .8rem;
		
		border: 0.1rem solid #383C42;
		
		opacity: 0;
		visibility: hidden;
		transition: all .3s ease-in-out;
		border-radius: .8rem;
	}

	.select-options.shrunk,
	:global(.cell:first-child .select-options) {
		width: calc(100% - 4rem);
	}

	.select-option {
		display: flex;
		align-items: center;
		justify-content: space-between;
		
		width: 100%;
		
		background-color: #0D121A;
		color: #FFF;
		
		padding: 1.2rem 1rem;
		font-size: 1.4rem;
		font-weight: 400;

		transition: all .3s ease-in-out;

		cursor: pointer;
	}

	.select-option svg {
		opacity: 0;
		visibility: hidden;

		transition: all .3s ease-in-out;
	}

	.select-option.active,
	.select-option:hover {
		background-color: #1a1f26;
	}

	.select-option.active svg,
	.select-option:hover svg {
		opacity: 1;
		visibility: visible;
	}

	.input-actions svg:last-child {
		cursor: pointer;
		position: absolute;
		right: 1rem;
		top: 20%;
	}

	.input-actions svg:first-child {
		position: absolute;
		right: 3rem;
		top: 20%;
	}

	.edit-input {
		position: absolute;
		top: 0;
		left: 0;
		transform: translateY(-2.5rem);
		background-color: #1A1F26;
		border: .1rem solid #383C42;
		color: #FFF;
		border-radius: .6rem;
		width: 100%;
		padding: .6rem 5rem .6rem .8rem;
	}

	.input-actions {
		position: absolute;
		right: 0;
		top: 0;
		transform: translateY(-1.8rem);
	}

	:global(.outer-box.active .select-options) {
		visibility: visible!important;
		opacity: 100!important;
	}

	.select-options .select-option:last-child {
		border-bottom-right-radius: .8rem;
		border-bottom-left-radius: .8rem;
	}

</style>
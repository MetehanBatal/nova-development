<script>
	import { colors } from '../../../stores/colors';
	import { page } from '$app/stores';
	import { componentStructureFunc } from '../../../stores/functions.js'
    import Chart from '../reporting/Chart.svelte';

	export let type;
	export let variants;

	let components = [];
	let componentStructure = '';
	async function fetchComponents() {
		try {
			const response = await fetch('https://preconvert.novus.studio/staging/components/view?limit=100&offset=0');
			
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			let routeData = await response.json(); // Parse the JSON response
			components = routeData.data.docs;

			componentStructure = componentStructureFunc(variants);
			console.log(components, components.find((c) => c.componentId === components[0].componentId)?.name);
		} catch (error) {
			console.error('Error:', error); // Log any errors
		}
	}

	fetchComponents();

	console.log(componentStructure, variants);

	let visibleVariants = [0];

	const sColors = [
		'#6e707f',
		'#e0e1e6',
		'#bac8d3',
		'#2B4066',
		'#DDD0BD',
		'#6b827c',
		'#9b482d',
		'#3a3a3a'
	];

	let isSummaryDropdown = false;
	let showChangeHandlers = false;

	let selectedOption;

	function summaryDropdownHandler(component) {
		isSummaryDropdown = !isSummaryDropdown;
		showChangeHandlers = true;
		selectedOption = component;
	}

	function editableContentHandler(variant, index) {
		isSummaryDropdown = false;
		let editableVariant =  document.querySelector(`.variants .variant:nth-child(${(index + 1)}) .editable-content`);

		editableVariant.setAttribute("contenteditable","true");
		editableVariant.focus();
	}

	function editableContentDecliner(variant, index) {
		showChangeHandlers = false;
	}
	function editableContentConfirmer(variant,index) {
		showChangeHandlers = false;
		let updatedElement =  document.querySelector(`.variants .variant:nth-child(${(index + 1)}) .editable-content`).textContent;
		$page.data.experimentRes.data[0].variants[index].name = updatedElement;
	}
</script>

<div class="variants-outer-box">
	<div class="variants-top">
		<span class="muted">Variants</span>

		{#if $page.data.experimentRes.data[0].status === 'draft'}
		<div class="add-button">
			<img width="12" height="12" src="/assets/icons/add.svg" alt="Add New Variant">

			<p>Add</p>
		</div>
		{/if}
	</div>

	<div class="variants-group" class:alone={componentStructure.length === 1}>
		{#each componentStructure as variantGroup, _index}
		<div class="variant-group">
			<div class="config-box">
				<span class="color" style={`background-color: ${colors[Math.floor(Math.random() * colors.length)]}`}></span>

				<p>{components.find((c) => c.componentId === variantGroup.name)?.name || variantGroup.name}</p>
			</div>

			<div class="variants">
				{#if visibleVariants.includes(_index)} 
				{#each variantGroup.components as component, __index}
				<div class="variant">
					<svg class="hook" width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M14 18L12.5001 18C5.87262 18.0001 0.5 12.6275 0.5 6.00002L0.5 8.72637e-05" stroke="#383C42"/>
					</svg>

					<div>
						<span class="color" style={`background-color: ${variantGroup.name === 'Colors' ? sColors[__index] : colors[Math.floor(Math.random() * colors.length)]}`}></span>

						<p class="editable-content">{component}</p>
					</div>

					<div class="summary-dropdown-wrapper">
						{#if !showChangeHandlers}
							<div class="summary-dropdown-handler" on:click={() => summaryDropdownHandler(component)}>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M8.0026 8.66732C8.37079 8.66732 8.66927 8.36884 8.66927 8.00065C8.66927 7.63246 8.37079 7.33398 8.0026 7.33398C7.63441 7.33398 7.33594 7.63246 7.33594 8.00065C7.33594 8.36884 7.63441 8.66732 8.0026 8.66732Z" stroke="#6D6D6E" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M8.0026 3.99935C8.37079 3.99935 8.66927 3.70087 8.66927 3.33268C8.66927 2.96449 8.37079 2.66602 8.0026 2.66602C7.63441 2.66602 7.33594 2.96449 7.33594 3.33268C7.33594 3.70087 7.63441 3.99935 8.0026 3.99935Z" stroke="#6D6D6E" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M8.0026 13.3333C8.37079 13.3333 8.66927 13.0349 8.66927 12.6667C8.66927 12.2985 8.37079 12 8.0026 12C7.63441 12 7.33594 12.2985 7.33594 12.6667C7.33594 13.0349 7.63441 13.3333 8.0026 13.3333Z" stroke="#6D6D6E" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</div>
						{/if}
						{#if isSummaryDropdown && selectedOption === component}
							<div class="summary-dropdown">
								<div class="summary-dropdown-item" on:click={() => editableContentHandler(component,__index)}>
									<img src="/assets/icons/edit-name.svg" alt="">
									Edit Name								
								</div>
								<div class="summary-dropdown-item">
									<img src="/assets/icons/preview-variant.svg" alt="">
									Preview Variant								
								</div>

								<img class="summary-dropdown-close-icon" on:click={() => isSummaryDropdown = !isSummaryDropdown} src="/assets/icons/summary-dropdown-close-icon.svg" alt="">
							</div>							
						{/if}
						
						{#if showChangeHandlers && selectedOption === component}
							<div class="input-actions">
								<svg on:click={(e) => editableContentDecliner(component,__index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
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
				
								<svg on:click={(e) => editableContentConfirmer(component,__index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path d="M8.00065 14.6667C11.6827 14.6667 14.6673 11.682 14.6673 8.00001C14.6673 4.31801 11.6827 1.33334 8.00065 1.33334C4.31865 1.33334 1.33398 4.31801 1.33398 8.00001C1.33398 11.682 4.31865 14.6667 8.00065 14.6667Z" fill="#0CB47F"/>
									<path d="M6 8.00001L7.33333 9.33334L10 6.66667" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</div>
						{/if}
					</div>
				</div>
				{/each}
				<div class="variants-toggler" on:click={(e) => {visibleVariants = visibleVariants.filter(variant => variant !== _index)}}>
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9 7.5L6 4.5L3 7.5" stroke="#575758" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>

					<span class="muted">Hide all variants</span>
				</div>
				{:else}
				<div class="variants-toggler" on:click={(e) => {visibleVariants.push(_index); visibleVariants = visibleVariants}}>
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M3 4.5L6 7.5L9 4.5" stroke="#575758" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>

					<span class="muted">Show all {variantGroup.components?.length} variants</span>
				</div>
				{/if}
			</div>
		</div>
		{/each}
	</div>
</div>

<style>

	.summary-dropdown {
		width: 100%;
		max-width: fit-content;

		position: absolute;
		top: 1rem;
		right: 0;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-block: 1.6rem;

		background-color: rgba(6, 11, 19, 1);

		border: .1rem solid rgba(33, 40, 48, 1);

		border-radius: .8rem;

		z-index: 3;
	}

	.summary-dropdown-item {
		width: 100%;

		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: .8rem;

		padding: .9rem 1.2rem;
		
		font-size: 1.2rem;
		line-height: 1.6rem;

		cursor: pointer;
	}

	.summary-dropdown-item:hover {
		background-color: rgba(33, 40, 48, 1);
	}

	.summary-dropdown-item img {
		width: 1.4rem;
	}

	.summary-dropdown-close-icon {
		width: 1rem;

		position: absolute;
		top: .6rem;
		right: .6rem;

		cursor: pointer;
	}

	.variants-outer-box {
		background-color: #0D121A;
		border-radius: 1.6rem;

		padding: 2.4rem 2.4rem 2.4rem 6.6rem;
		margin-top: -3.4rem;
	}

	.variants-top {
		display: flex;
		justify-content: space-between;
		align-items: center;

		min-height: 2.6rem;

		margin-bottom: .8rem;
	}

	.add-button {
		display: flex;
		align-items: center;
		gap: .4rem;

		background-color: #947AF0;
		color: #fff;

		border-radius: .4rem;

		padding: .4rem .8rem;

		cursor: pointer;
	}

	.add-button img {
		width: 1.2rem;
	}

	.config-box {
		display: flex;
		align-items: center;
		gap: 1rem;

		min-width: 32rem;

		background-color: #212830;
		border: .1rem solid #383C42;
		border-radius: .8rem;

		padding: 1.2rem 1.4rem;
	}

	.variants-group {
		display: flex;
		flex-direction: column;
		gap: 4rem;

		position: relative;
	}

	.variants-group:not(.alone):before {
		position: absolute;
		top: 2.2rem;
		right: calc(100% + 3rem);

		width: .1rem;
		height: calc(100% - 7.5rem);

		content: '';

		background-color: #383C42;
	}

	:global(.ab .variants-group:before) {
		display: none;
	}

	.variants-group:after {
		position: absolute;
		top: 2.1rem;
		right: calc(100% + 3rem);

		width: 3.6rem;
		height: .1rem;

		content: '';

		background-color: #383C42;
	}

	.variant-group {
		position: relative;
	}

	.variant-group:before {
		position: absolute;
		top: 2.1rem;
		right: 100%;

		width: 3rem;
		height: .1rem;

		content: '';

		background-color: #383C42;
	}

	.variant-group:after {
		position: absolute;
		top: 1.8rem;
		right: calc(100% + 2.65rem);

		width: .7rem;
		height: .7rem;

		content: '';

		background-color: #383C42;
		border-radius: 100%;
	}

	.alone .variant-group:after {
		display: none;
	}

	:global(.ab .variant-group:after) {
		display: none;
	}

	.variants {
		display: flex;
		flex-direction: column;
		gap: 2.4rem;

		position: relative;

		padding-top: 2.4rem;
	}

	.variant {
		display: flex;
		justify-content: space-between;
		align-items: center;

		position: relative;

		width: calc(100% - 3rem);
		
		padding: 1.2rem 0.8rem 1.2rem 1.4rem;
		margin-left: auto;
		
		border: 0.1rem solid #212830;
		border-radius: 0.8rem;
	}

	.hook {
		position: absolute;
		bottom: 2.1rem;
		right: 100%;

		width: 1.4rem;
		height: 1.9rem;		
	}

	.variants:after {
		position: absolute;
		top: 0;
		left: 1.7rem;

		width: .1rem;
		height: calc(100% - 6.5rem);

		content: '';

		background-color: #383C42;
	}

	.variant > div {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.color {
		display: block;

		width: .6rem;
		height: .6rem;

		border-radius: 100%;
	}

	.variants-toggler {
		display: flex;
		align-items: center;
		gap: .4rem;
		
		margin-left: auto;
		margin-top: -.8rem;

		cursor: pointer;
	}
</style>
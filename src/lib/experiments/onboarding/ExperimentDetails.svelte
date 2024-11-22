<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { experiment } from '../../../stores/experiment';

    import ComboBox from '$lib/toolkit/ComboBox.svelte';

	let experimentName;
	let dropdownRef;
	let isActive;
	let isVariantActive = false;
	export let variantDropdownRef;
	export let selectedOptions;

	let components = [
		{
			name: 'Headline Copy (Advertorial)',
			on: [
				'https://www.manvsevil.com/a/s6-reasons'
			],
			variants: [
				{
					name: 'Headline I',
					component: 'HeadlineI'
				},
				{
					name: 'Headline II',
					component: 'HeadlineII'
				},
				{
					name: 'Headline III',
					component: 'HeadlineIII'
				},
				{
					name: 'Headline IV',
					component: 'HeadlineIV'
				}
			],
			selectable: true
		},
		{
			name: 'Hero Image Change (Advertorial)',
			on: [
				'https://www.manvsevil.com/a/s6-reasons'
			],
			variants: [
				{
					name: 'Image I',
					component: 'ImageI'
				},
				{
					name: 'Image II',
					component: 'ImageII'
				},
				{
					name: 'Image III',
					component: 'ImageIII'
				}
			],
			selectable: true
		},
		{
			name: 'Free Gift',
			on: [ 'https://www.manvsevil.com/kit/ksp' ],
			variants: [
				{
					name: 'On',
					component: 'On'
				},
				{
					name: 'Off',
					component: 'Off'
				}
			],
			selectable: true
		},
		{
			name: 'Pricing Bundles',
			on: [ 'https://www.manvsevil.com/kit/ksp' ],
			variants: [
				{
					name: '6-month',
					component: '6-month'
				},
				{
					name: '4-month',
					component: '4-month'
				},
				{
					name: '2-month',
					component: '2-month'
				}
			],
			selectable: true
		},
		{
			name: 'Subscription+One time',
			on: [ 'https://www.manvsevil.com/kit/ksp' ],
			variants: [
				{
					name: 'On',
					component: 'On'
				},
				{
					name: 'Off',
					component: 'Off'
				}
			],
			selectable: true
		},
		{
			name: 'Post-purchase Popup Visibility',
			on: [ 'https://www.manvsevil.com/kit/ksp' ],
			variants: [
				{
					name: 'On',
					component: 'On'
				},
				{
					name: 'Off',
					component: 'Off'
				}
			],
			selectable: true
		},
		{
			name: 'Selectable Products',
			on: [ 'https://www.manvsevil.com/kit/ksp' ],
			variants: [
				{
					name: 'On',
					component: 'On'
				},
				{
					name: 'Off',
					component: 'Off'
				}
			],
			selectable: true
		},
		{
			name: 'Reviews Order',
			on: [ 'https://www.manvsevil.com/checkout/secure' ],
			variants: [
				{
					name: 'Cameron',
					component: 'cameron'
				},
				{
					name: 'Scott',
					component: 'scott'
				}
			],
			selectable: true
		},
		{
			name: 'Banner Coupon',
			on: [ 
				'https://www.manvsevil.com/a/s6-reasons',
				'https://www.manvsevil.com/kit/ksp',
				'https://www.manvsevil.com/checkout/secure'
			],
			variants: [
				{
					name: 'AutoApplied',
					component: 'AutoApplied'
				},
				{
					name: 'LevelUp',
					component: 'LevelUp'
				},
				{
					name: 'LevelUp10',
					component: 'LevelUp10'
				}
			],
			selectable: true
		},
		{
			name: 'Advertorial Traffic Split (Advertorial)',
			on: [
				'https://www.manvsevil.com/a/s6-reasons'
			],
			variants: [
				{
					name: 'Advertorial',
					component: 'Advertorial'
				},
				{
					name: 'Direct to Lander',
					component: 'DirectToLander'
				}
			],
			selectable: true
		},
		{
			name: 'Headline Copy Change',
			on: [
				'https://www.manvsevil.com/kit/ksp'
			],
			variants: [
				{
					name: 'Limiting Testosterones',
					component: 'LimitingTestosterones'
				},
				{
					name: 'Unleash Masculanity',
					component: 'UnleashMasculanity'
				}
			],
			selectable: true
		}
	];

	let selectedComponents = {};

	let pages = [
		{
			name: 'Kit - Advertorial',
			slug: 'https://www.manvsevil.com/a/s6-reasons'
		},
		{
			name: 'Kit - KSP',
			slug: 'https://www.manvsevil.com/kit/ksp',
		},
		{
			name: 'Kit - Checkout',
			slug: 'https://www.manvsevil.com/checkout/secure',
		},
		{
			name: 'Kit - Upsell 1a',
			slug: 'https://www.manvsevil.com/up/1a'
		},
		{
			name: 'Kit - Upsell 2a',
			slug: 'https://www.manvsevil.com/up/2a'
		},
		{
			name: 'Receipt',
			slug: 'https://www.manvsevil.com/receipt'
		},
		{
			name: 'Privacy Policy',
			slug: 'https://www.manvsevil.com/privacy-policy'
		},
		{
			name: 'Terms of Service',
			slug: 'https://www.manvsevil.com/terms-of-service'
		},
	];

	let experimentOptions = [
		{
			name: "A/B Testing",
			id: 'ab',
		},
		{
			name: "Multivariate Testing",
			id: 'multivariate',
		},
		{
			name: "Split URL",
			id: 'split-url',
		},
		{
			name: "Mask URL",
			id: 'mask-url',
		},
	];

	onMount(() => {
		if (browser) {
			document.addEventListener("click", (event) => {
				if (dropdownRef && !dropdownRef.contains(event.target)) {
					isActive = false;
				}
			});

			document.addEventListener("click", (event) => {
				if (variantDropdownRef && !variantDropdownRef.contains(event.target)) {
					isVariantActive = false;
				}
			});
		}
	});

	function removeExperimentItem(selectedComponent) {
		for (let component of components) {
			if (selectedComponents[component.name]) {
				selectedComponents[component.name] = selectedComponents[component.name].filter(item => item !== selectedComponent);
				if (selectedComponents[component.name].length === 0) {
					delete selectedComponents[component.name];
				}
			}
		}
	}

	// Function to generate all combinations
	function generateCombinations(groups, index = 0, current = []) {
		const keys = Object.keys(groups);
		if (index === keys.length) {
			return [current];
		}
		return groups[keys[index]].flatMap(item => 
			generateCombinations(groups, index + 1, [...current, { name: keys[index], component: item.component }])
		);
	};

	function handleComponentChange() {
		Object.keys(selectedComponents).forEach(component => {
			if (selectedComponents[component].length < 1) {
				delete selectedComponents[component];
			}
		});

		if (Object.keys(selectedComponents).length > 1) {
			$experiment.type = 'multivariate'
		} else {
			$experiment.type = 'ab'
		}

		// Generate the variants
		const combinations = generateCombinations(selectedComponents);
		const variants = combinations.map((combination, index) => ({
			id: index,
			name: `Variant ${index}`,
			allocation: (100 / combinations.length).toFixed(4),
			arms: combination
		}));

		$experiment.variants = variants;
	}

	function filterSelectableVariants() {
		if ($experiment.baseURLs.length < 1) {
			return; }

		components.forEach(component => {
			component.selectable = $experiment.baseURLs.every(url => component.on.includes(url));
		});
		
		components = components;
	}

	$: selectedComponents, handleComponentChange();

	$: $experiment.baseURLs, filterSelectableVariants();
</script>

<div class="experiment-details">
	<div class="experiment-detail-step">
		<div class="step-item-wrapper">
			<p class="low-text">Experiment Name</p>

			<div class="input-holder">
				<input data-validation-item="name" bind:value={$experiment.name} class="input" placeholder="Name of the experiment" type="text" /><span></span>
			</div>
		</div>

		<div class="step-item-wrapper">
			<p class="low-text">Experiment Base URLs</p>
			<div class="dropdown" dropdown-type="baseURL" class:active={isActive} on:click={() => (isActive = !isActive)} bind:this={dropdownRef}>
				<div class="dropdown-title" data-validation-item="baseURLs">
					<div class="item-name">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
							<path d="M13.3359 2.66699H2.66927C1.93289 2.66699 1.33594 3.26395 1.33594 4.00033V12.0003C1.33594 12.7367 1.93289 13.3337 2.66927 13.3337H13.3359C14.0723 13.3337 14.6693 12.7367 14.6693 12.0003V4.00033C14.6693 3.26395 14.0723 2.66699 13.3359 2.66699Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M6.66406 2.66699V5.33366" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M1.33594 5.33301H14.6693" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M4 2.66684V5.33351" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
						</svg>

						<div>{$experiment.baseURLs.length > 0 ? `${$experiment.baseURLs.length} page${$experiment.baseURLs.length > 1 ? 's' : ''} selected` : 'Triggering Page'}</div>
					</div>

					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
						<path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</div>
				<span></span>
				<div class="dropdown-content">
					{#each pages as page}
						<div class="dropdown-item" class:selected={$experiment.baseURLs.includes(page.slug)} on:click={(e) => {$experiment.baseURLs = $experiment.baseURLs.includes(page.slug) ? $experiment.baseURLs.filter(item => item !== page.slug) : [...$experiment.baseURLs, page.slug]}}>
							<p>{page.name}</p>
							<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
								<path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<div class="experiment-details">
	<p class="low-text">Experiment Type</p>
	
	<div class="experiment-detail-step type-select-step">
		{#each experimentOptions as option, _index}
			<div class="step-item-wrapper experiment-checkbox-wrapper" class:low-opacity={_index > 1} class:active={option.id === $experiment.type} on:click={() => { $experiment.type = option.id}}>
				<label class="experiment-checkbox">
					<span class="purple-checkmark"></span>
					<input type="checkbox" checked={option.id === $experiment.type ? 'true' : 'false'}>
					{option.name}
				</label>
			</div>    
		{/each}
	</div>
</div>

<div class="experiment-details">
	<div class="experiment-detail-step">
		<div class="step-item-wrapper">
			<p class="low-text">Variant Selection</p>

			{#if $experiment.type === 'multivariate' || $experiment.type === 'ab'}
			<div class="step-item">
				<div class="dropdown" class:active={isVariantActive} on:click={() => isVariantActive = true} bind:this={variantDropdownRef}>
					<div class="dropdown-title ">
						<div class="item-name ">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path d="M13.3359 2.66699H2.66927C1.93289 2.66699 1.33594 3.26395 1.33594 4.00033V12.0003C1.33594 12.7367 1.93289 13.3337 2.66927 13.3337H13.3359C14.0723 13.3337 14.6693 12.7367 14.6693 12.0003V4.00033C14.6693 3.26395 14.0723 2.66699 13.3359 2.66699Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M6.66406 2.66699V5.33366" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M1.33594 5.33301H14.6693" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M4 2.66684V5.33351" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
							</svg> 
							
							<div on:click={() => isVariantActive = true}>{Object.keys(selectedComponents).length > 0 ? `${Object.keys(selectedComponents).length} arms, ${Object.values(selectedComponents).reduce((acc, obj) => acc + obj.length, 0)} components, ${Object.values(selectedComponents).reduce((acc, obj) => acc * obj.length, 1)} variants` : `Select at least ${$experiment.type === 'multivariate' ? '2 arms and ': ''}2 components`}</div>
						</div>

						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
							<path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</div>
					<div class="dropdown-content checkbox-dropdown experiment-dropdown">
						<ComboBox {components} bind:selectedComponents={selectedComponents} />
					</div>
				</div>
				
				<div class="experiment-badge-wrapper">
					{#if Object.keys(selectedComponents).length > 0}
					{#each Object.keys(selectedComponents) as column, _index}
						<div>
							<p class="low-text">{column}</p>
							<div class="experiment-items">
								{#each selectedComponents[column] as selectedComponent}
								<div class="experiment-item">
									<p>{selectedComponent.name}</p>

									<div class="remove-icon" on:click={() => removeExperimentItem(selectedComponent)}>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
												<g clip-path="url(#clip0_2774_5861)">
													<path d="M8.0026 14.6668C11.6845 14.6668 14.6693 11.6821 14.6693 8.00016C14.6693 4.31826 11.6845 1.3335 8.0026 1.3335C4.32071 1.3335 1.33594 4.31826 1.33594 8.00016C1.33594 11.6821 4.32071 14.6668 8.0026 14.6668Z" stroke="#4F4A76" stroke-linecap="round" stroke-linejoin="round"/>
													<path d="M10 6L6 10" stroke="#4F4A76" stroke-linecap="round" stroke-linejoin="round"/>
													<path d="M6 6L10 10" stroke="#4F4A76" stroke-linecap="round" stroke-linejoin="round"/>
												</g>
												<defs>
													<clipPath id="clip0_2774_5861">
														<rect width="16" height="16" fill="white"/>
													</clipPath>
												</defs>
										</svg>
									</div>
								</div>
								{/each}
							</div>
						</div>
					{/each}
					{/if}
				</div>
			</div>
			{:else}
			<div>
				For Mask URL
			</div>
			{/if}
		</div>
	</div>
</div>


<style>
	.experiment-badge-wrapper {
		display: flex;
		flex-wrap: wrap;
		gap: 4rem;
	}
	.step-item .experiment-badge-wrapper > div {
		display: flex;
		flex-direction: column;
		align-items: center;


		color: #AA96F3;
		
	}

	.experiment-items {
		width: 100%;

		display: flex;
		flex-direction: column;
		gap: .6rem;
	}

	.experiment-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: .6rem;

		min-width: 12rem;
			width: 100%;
		
		padding: .2rem .4rem .2rem 1rem;
		
		border: .1rem solid rgba(170, 150, 243, 0.24);
		border-radius: 1.6rem;
		background-color: rgba(170, 150, 243, 0.04);
	}
	.step-item .experiment-badge-wrapper > div p {
		font-size: 1.2rem;
	}
	.step-item .dropdown-content {
		width: 100%;
	}
	.step-item .low-text {
		margin: 0 auto .6rem 0;
	}

	.experiment-badge-wrapper .remove-icon {
		cursor: pointer;
		display: flex;
		align-items: center;
	}

	.input::after {
		content: "";
		position: absolute;

		top: 0;
		left: 0;
	}

	div[dropdown-type="baseURL"] {
		width: max-content;
		min-width: auto;
	}
	div[dropdown-type="baseURL"] .dropdown-title {
		width: max-content;
		min-width: auto;
	}
	div[dropdown-type="baseURL"] .dropdown-content {
		width: 100%;

		padding-block: .8rem;

		background-color: #0D121A;

    	border: .1rem solid #383C42;
	}
	div[dropdown-type="baseURL"] .dropdown-item {
		width: 100%;
		min-width: auto;
		border: none;
	}
</style>
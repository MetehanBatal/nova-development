<script>
	import { onMount } from "svelte";
	import { browser } from '$app/environment';

	export let tabs;
	export let activeTabIndex;

	export let isAudiences;
	
	let selectedCategory = "Filtration";

	let categories =  ["Product", "Funnel", "Multivariant"];

	let isActive = false;
	let dropdownRef;

	onMount(() => {

		if(browser) {
			document.addEventListener("click", (event) => {
				if (dropdownRef && !dropdownRef.contains(event.target)) {
					isActive = false;
				}
			});
		}
	})

	let experimentSearchInput = "";

	export let filteredExperiments;
	export let experiments;

	function filterExperiments() {
		const searchInput = experimentSearchInput.toLowerCase();
		filteredExperiments = experiments.filter(element => element.name.toLowerCase().includes(searchInput));
	}

	$: experimentSearchInput, filterExperiments();
</script>

<div class="tabs overall">
	{#each tabs as tab, _index}
	<div class="tab-item" class:active={_index === activeTabIndex} on:click={(e) => { activeTabIndex = _index; experimentSearchInput = "" }}>
		<div class="tab-item-wrapper">
			<div class="item">
				{tab.title}
			</div>
		</div>
	</div>
	{/each}

	<div class="dropdown-search-wrapper">
		<div class="cta-button secondary" on:click={() => isAudiences = !isAudiences}>Audiences</div>
		
		<!-- <div class="dropdown" class:active={isActive} on:click={() => isActive = !isActive} bind:this={dropdownRef}>
			<div class="dropdown-title ">
				<div class="item-name">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
						<path d="M13.3359 2.66699H2.66927C1.93289 2.66699 1.33594 3.26395 1.33594 4.00033V12.0003C1.33594 12.7367 1.93289 13.3337 2.66927 13.3337H13.3359C14.0723 13.3337 14.6693 12.7367 14.6693 12.0003V4.00033C14.6693 3.26395 14.0723 2.66699 13.3359 2.66699Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M6.66406 2.66699V5.33366" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M1.33594 5.33301H14.6693" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M4 2.66684V5.33351" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
					</svg> 
					
					<div>{selectedCategory}</div>
				</div>
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
			<div class="dropdown-content" class:category-dropdown={selectedCategory === ''}>
				{#each categories as category}
					<div class="dropdown-item" on:click={() => selectedCategory = category }>
						<div>{category}</div>
						<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</div>
				{/each}
			</div>
		</div> -->
		<div class="input-holder">
			<input class="input" placeholder="Search " type="text" bind:value={experimentSearchInput}/>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round" />
				<path d="M13.9995 14.0001L11.1328 11.1335" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</div>
	</div>
</div>

<style>

	.tabs.overall {
		padding-right: 3.2rem; 

		display: flex;
		align-items: center;

		border-bottom: .1rem solid #212830;
	}

	.tabs.overall .tab-item {
		padding: 1.2rem .4rem;

		border-top: none;
		border-left: none;
		border-bottom: none;
	}

	.tab-item.active {
		color: #FFF;
		background-color: #1A1F26;
	}

	.tab-item .item {
		border: 0;
	}

	.tab-item:hover {
		border-color: #1A1F26;
		background-color: #1A1F26;
		color: #fff;
	}
	
	.dropdown-search-wrapper {
		display: flex;
		align-items: center;
		gap: 1.6rem;
		margin-left: auto;
	}

</style>
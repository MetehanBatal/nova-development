<script>
	import { onMount } from "svelte";
	import { browser } from '$app/environment';

	let fetchInProgress = true;
	const spinner = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

	let filterOptions = [
		{ label: 'Today', description: "Compared to the previous day", span: 24 },
		{ label: 'Last 7 Days', description: "Compared to the previous 7 days", span: 168 },            
		{ label: 'Last 30 Days', description: "Compared to the previous 30 days", span: 720 }
	];

	let data;

	let selectedFilterIndex = 2;

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

	async function fetchNewAnalytics(newType) {
		try {
			fetchInProgress = true;
			const selectedTimestamp = new Date().getTime() - (filterOptions[selectedFilterIndex]['span'] * 60 * 60 * 1000);
			const url = `https://preconvert.novus.studio/prod/mPurchases/analytics?timestamp=${selectedTimestamp}`;
			const response = await fetch(url);
			data = await response.json();
		} catch (error) {
			console.error('Fetch error:', error);
		}

		fetchInProgress = false;
	}

   onMount(() => {
		fetchNewAnalytics(filterOptions[selectedFilterIndex]['type']);
   })

   $: selectedFilterIndex, fetchNewAnalytics(); 

   let isEndOfScroll;


   function handleScroll(event) {
		const navWrapper = event.target;
		
		if ((navWrapper.scrollLeft + navWrapper.clientWidth) >= navWrapper.scrollWidth) {
			isEndOfScroll = true;
		} else {
			isEndOfScroll = false;
		}
	}
</script>

<!-- nav-item.type => First tab on the line-->
<!-- nav-item  => rest tabs -->


<header>
	<div class="navbar-dropdown-content" class:active={isActive}>
		{#each filterOptions as option, index }
			<div class="checkbox-dropdown-content" on:click={() => {selectedFilterIndex = index;}}>
				<label class="input-holder checkbox-holder" class:active={filterOptions[selectedFilterIndex]['label'] === option.label}>
					<div class="option-checkbox purchase-navbar" >
						<input class="navbar-checkbox" name="checkbox1" type="checkbox">

						<span class="checkmark">							
						</span>

					</div>
					<div class="option-description">
						<p>{option.label}</p>
						<p class="low-text">{option.description}</p>
					</div>
					
				</label>
			</div>
		{/each}
	</div>
	<div class="nav-wrapper" class:scroll-end={isEndOfScroll}>
		<nav on:scroll={handleScroll}>
			<div class="nav-item type">
				<div class="nav-dropdown" class:active={isActive} on:click={() => isActive = !isActive} bind:this={dropdownRef}>
					<div class="nav-dropdown-title">
						<p>{filterOptions[selectedFilterIndex]['label']}</p>
	
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" class="s-a1BlxZULllMI"><path d="M10.5 8.75L7 5.25L3.5 8.75" stroke="white" stroke-linecap="round" stroke-linejoin="round" class="s-a1BlxZULllMI"></path></svg>
					</div>
				</div>						
			</div>
			<div class="nav-item">
				{#if !fetchInProgress}
					{#if data?.totalOrders?.difference < 0 || data?.totalOrders?.difference === null}							
						<img class="graph" src="/assets/icons/downtick.svg"alt="downtick">				
					{/if}
					{#if data?.totalOrders?.difference > 0}	
						<img class="graph" src="/assets/icons/uptick.svg" alt="uptick">
					{/if}
				{/if}
				
				<div class="nav-item-description">
					<p class="nav-item-number">
						{#if !data || fetchInProgress}
							{@html spinner}
						{:else}
							{data.totalOrders.value}
						{/if}
					</p>
					<div class="nav-title">
						Total Orders
					</div>
				</div>
				{#if !fetchInProgress}
					<div class="nav-metric">
						{#if data?.totalOrders?.difference || data?.totalOrders?.difference === null}
							<div class="nav-metric-percentage" class:uptick={data.totalOrders.difference > 0} class:downtick={data.totalOrders.difference <= 0 || data?.totalOrders?.difference === null}>				
								{#if data.totalOrders.difference <= 0}						
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" class="s-EvZdnE7xYsG-"><path d="M11.7828 9.44971L7.29115 4.95804L4.95781 7.29137L1.63281 3.96637" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round" class="s-EvZdnE7xYsG-"></path><path d="M8.75 9.91681H12.25V6.41681" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round" class="s-EvZdnE7xYsG-"></path></svg>
									{:else}
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
										<path d="M11.7828 4.55029L7.29115 9.04196L4.95781 6.70863L1.63281 10.0336" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M8.75 4.08319H12.25V7.58319" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								{/if}
								<span>
									{data.totalOrders.difference !== null ? data.totalOrders.difference.toFixed(2) : 0}
								</span>
							</div>
						{/if}
					</div>
				{/if}
			</div>
			<div class="nav-item">			
				<div class="nav-item-description">
					<p class="nav-item-number">
						{#if !data || fetchInProgress}
							{@html spinner}
						{:else}
							{data.totalPurchasedItems.value !== null ?  data.totalPurchasedItems.value : 0}
						{/if}
					</p>
					<div class="nav-title">
						Total Purchased Items
					</div>
				</div>
				{#if !fetchInProgress}
					<div class="nav-metric">
						{#if data?.totalPurchasedItems?.difference || data?.totalPurchasedItems?.difference === null}
							<div class="nav-metric-percentage" class:uptick={data.totalPurchasedItems.difference > 0} class:downtick={data.totalPurchasedItems.difference <= 0 || data?.totalPurchasedItems?.difference === null}>
								{#if data.totalPurchasedItems.difference <= 0}						
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" class="s-EvZdnE7xYsG-"><path d="M11.7828 9.44971L7.29115 4.95804L4.95781 7.29137L1.63281 3.96637" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round" class="s-EvZdnE7xYsG-"></path><path d="M8.75 9.91681H12.25V6.41681" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round" class="s-EvZdnE7xYsG-"></path></svg>							
									{:else}
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
										<path d="M11.7828 4.55029L7.29115 9.04196L4.95781 6.70863L1.63281 10.0336" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M8.75 4.08319H12.25V7.58319" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								{/if}
								<span>
									{data.totalPurchasedItems.difference !== null ? data.totalPurchasedItems.difference.toFixed(2) : 0}
								</span>
							</div>
						{/if}
					</div>
				{/if}
			</div>
			<div class="nav-item">
				{#if !fetchInProgress}
					{#if data?.totalRevenue?.difference < 0 || data?.totalRevenue?.difference === null}							
						<img class="graph" src="/assets/icons/downtick.svg"alt="downtick">				
					{/if}
					{#if data?.totalRevenue?.difference > 0}	
						<img class="graph" src="/assets/icons/uptick.svg" alt="uptick">
					{/if}
				{/if}
				<div class="nav-item-description">
					<p class="nav-item-number">
						{#if !data || fetchInProgress}
							{@html spinner}
						{:else}
							{data.totalRevenue.value !== null ? (data.totalRevenue.value).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : 0}
						{/if}
					</p>
					<div class="nav-title">
						Total Revenue
					</div>
				</div>
				{#if !fetchInProgress}
					<div class="nav-metric">
						{#if data?.totalRevenue?.difference ||data?.totalRevenue?.difference === null}
							<div class="nav-metric-percentage" class:uptick={data.totalRevenue.difference > 0} class:downtick={data.totalRevenue.difference <= 0 || data?.totalRevenue?.difference === null}>
								{#if data.totalRevenue.difference <= 0}						
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" class="s-EvZdnE7xYsG-"><path d="M11.7828 9.44971L7.29115 4.95804L4.95781 7.29137L1.63281 3.96637" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round" class="s-EvZdnE7xYsG-"></path><path d="M8.75 9.91681H12.25V6.41681" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round" class="s-EvZdnE7xYsG-"></path></svg>
									{:else}
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11.7828 4.55029L7.29115 9.04196L4.95781 6.70863L1.63281 10.0336" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.75 4.08319H12.25V7.58319" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/></svg>
								{/if}
								<span >
									{data.totalRevenue.difference !== null ? data.totalRevenue.difference.toFixed(2) : 0}
								</span>
							</div>
						{/if}
					</div>
				{/if}
			</div>
			<div class="nav-item">
				<div class="nav-item-description">
					<p class="nav-item-number">
						{#if !data || fetchInProgress}
							{@html spinner}
						{:else}
							{data.averageRevenue.value !== null ? (data.averageRevenue.value).toLocaleString('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2}) : 0}
						{/if}
					</p>
					<div class="nav-title">
						Average Revenue
					</div>
				</div>
				{#if !fetchInProgress}
					<div class="nav-metric">
						{#if data?.averageRevenue?.difference || data?.averageRevenue?.difference === null}
							<div class="nav-metric-percentage" class:uptick={data.averageRevenue.difference > 0} class:downtick={data.averageRevenue.difference < 0 || data?.averageRevenue?.difference === null}>
								{#if data.averageRevenue.difference <= 0}						
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" class="s-EvZdnE7xYsG-"><path d="M11.7828 9.44971L7.29115 4.95804L4.95781 7.29137L1.63281 3.96637" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round" class="s-EvZdnE7xYsG-"></path><path d="M8.75 9.91681H12.25V6.41681" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round" class="s-EvZdnE7xYsG-"></path></svg>
									{:else}
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11.7828 4.55029L7.29115 9.04196L4.95781 6.70863L1.63281 10.0336" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.75 4.08319H12.25V7.58319" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/></svg>
								{/if}
								<span >
									{data.averageRevenue.difference !== null ? data.averageRevenue.difference.toFixed(2) : 0}
								</span>
							</div>
						{/if}
					</div>
				{/if}
			</div>
			<!-- <div class="nav-item">
				<div class="nav-item-description">
					<p class="nav-item-number">$189</p>
					<div class="nav-title">
						Average Revenue
					</div>
				</div>
				<div class="nav-metric ">
					<div class="nav-metric-percentage uptick">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
							<path d="M11.7828 4.55029L7.29115 9.04196L4.95781 6.70863L1.63281 10.0336" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M8.75 4.08319H12.25V7.58319" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						<span >20.9%</span>
					</div>
				</div>
			</div> -->
			<div class="nav-item">
				<div class="nav-item-description">
					<p class="nav-item-number">
						{#if !data || fetchInProgress}
							{@html spinner}
						{:else}
							0
						{/if}
					</p>
					<div class="nav-title">
						Refunds
					</div>
				</div>
				<div class="nav-metric ">
					<div class="nav-metric-percentage uptick">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
							<path d="M11.7828 4.55029L7.29115 9.04196L4.95781 6.70863L1.63281 10.0336" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M8.75 4.08319H12.25V7.58319" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						<span>
							
							0%					
							
						</span>
					</div>
				</div>
			</div>
		</nav>
	</div>
</header>


<style>

	header {
		position: relative;
	}

	nav {
		position: fixed;
		top: 0;
		z-index: 2;
		border: .1rem solid #1A1F26;
		display: flex;
		align-items: center;
		top: 6.4rem;
		left: 9.4rem;
		width: 100%;
		background-color: #060B13;
		justify-content: flex-start;
		width: calc(100% - 9.4rem);

		overflow-x: auto;
		overflow-y: hidden;
	}

	.nav-wrapper {
		position: relative;

		width: 100%;
	}

	.nav-wrapper::after {
		content: "";
		position: fixed;
		top: 6.4rem;
		right: 0;
		width: 4rem;
		height: 7rem;
		background: linear-gradient(to left, rgba(6, 11, 19, 1), rgba(6, 11, 19, 0));
		z-index: 2;
	}
	.nav-wrapper::before {
		content: "";
		position: fixed;
		top: 9.4rem;
		right: 0;
		width: 2.4rem;
		height: 2.4rem;
		left: 98%;

		transform: translate3d( -50%, -50%, 0);
		background-color: rgba(33, 40, 48, 1);
		background-image: url("assets/icons/arrow-right.svg");
		background-repeat: no-repeat;
		background-position: center;
		z-index: 3;

		border-radius: 50%;
	}

	.nav-wrapper.scroll-end::after,
	.nav-wrapper.scroll-end::before {
		display: none;
	}

	.nav-item {
		display: flex;
		position: relative;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		flex: 1;
	
		padding: 1.2rem 1.2rem 1.2rem 1.2rem;
		
		border-right: .1rem solid #1A1F26;
	}

	.nav-item.type {
		padding: 2.4rem 2.5rem;

		align-items: center;
		justify-content: flex-start;
		gap: .8rem;
		min-width: fit-content;
	}

	.nav-item.type .nav-title {
		font-size: 1.6rem;
		line-height: 2rem;
		font-weight: 500;
		color: #FFF;
	}

	.nav-item .nav-title {
		font-size: 1.2rem;
		line-height: 1.6rem;
		color: #88888A;
	}

	.nav-item-description{
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: .6rem;
	}

	.nav-item-description .nav-title {
		white-space: pre;
	}

	.nav-item-number {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: .8rem;
		font-size: 1.8rem;
		line-height: 2.2rem;
	}

	.nav-metric {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		gap: 1rem;
	}

	.nav-metric-percentage {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: .2rem .4rem;
		border-radius: 3rem;
		gap: .4rem;
		font-size: 1.2rem;
	}

	.nav-metric-percentage.uptick {
		background-color: #0CB47F;
		color: #0D121A;
	}
	.nav-metric-percentage.downtick {
		background-color: #F37361;
		color: #0D121A;
	}

	.nav-dropdown {
		display: flex;
		flex-direction: column;
		width: 100%;

		cursor: pointer;
	}

	.navbar-dropdown-content {
		min-width: 26rem;

		position: absolute;
		bottom: -1rem;
		left: 0;

		overflow: hidden;

		background-color: #060B13;
		border: .1rem solid #1a1f26;
		border-radius: 1.6rem;
 
		transition: all .3s ease-in-out;
		transform: translateY(130%);
		
		opacity: 0;
		visibility: hidden;

		z-index: 1000;
	}

	.navbar-dropdown-content .navbar-checkbox{
		display: none;  
	}

	.nav-dropdown .input-holder.checkbox-holder {
		align-items: flex-start;
	}
	 .navbar-dropdown-content.active {
		opacity: 1;
		visibility: visible;
	}

	.nav-dropdown-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: .4rem
	}

	.nav-dropdown-title svg {
		rotate: 180deg;
	}

	.nav-dropdown.active svg {
		rotate: 0deg;
	}

	.option-checkbox .checkmark svg {
		position: absolute;
		top: 0;
		left: -.1rem;
	}

	:global(.nav-item .checkbox-holder.active) {
		border-bottom: none;
	}

	.option-checkbox.purchase-navbar .checkmark::after {
		opacity: 0;
		visibility: hidden;
	}

	.input-holder.checkbox-holder.active .option-checkbox.purchase-navbar .checkmark::after {
		visibility: visible;
		opacity: 1;
	}

	.input-holder.checkbox-holder.active .option-checkbox.purchase-navbar .checkmark{
		border-color:rgba(136, 136, 138, 1);
	}


	.option-checkbox.purchase-navbar .checkmark {
		border-radius: 50% !important;
		border-color: rgba(56, 60, 66, 1);
		top: 2.2rem;
		
	}
	:global(.option-checkbox.purchase-navbar .checkmark::after) {
		top: 50%;
		left: 50%;

		transform: translate3d( -50%, -50%, 0);
		background-color:rgba(136, 136, 138, 1);
	}

	.graph {
		width: 12.5rem;
    	height: 3rem;

		position: absolute;
		right:-.3rem;
		bottom: 0;
	}

	@media screen and (max-width: 768px) {
		nav {
			left: 0;
			width: 100%;

			overflow-x: auto;
			overflow-y: hidden;
		}
	}

	@media screen and (min-width: 1200px) {
		.nav-wrapper::after {
			display: none;
		}
		.nav-wrapper::before {
			display: none;
		}
	}




</style>
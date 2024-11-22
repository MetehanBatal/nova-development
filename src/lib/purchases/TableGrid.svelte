<script>
    import { onMount } from "svelte";
	import { browser } from '$app/environment';
	import moment from 'moment';

	import { productsDictionary } from '../../stores/products--dev';
	import InnerOptions from "./InnerOptions.svelte";
	import { toastMessage } from "../../stores/toast";
	import DatePicker from "$lib/toolkit/DatePicker.svelte";

	const spinner = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

	const columns = [
		{
			name: "Date",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path d="M11.0833 2.33334H2.91667C2.27233 2.33334 1.75 2.85568 1.75 3.50001V11.6667C1.75 12.311 2.27233 12.8333 2.91667 12.8333H11.0833C11.7277 12.8333 12.25 12.311 12.25 11.6667V3.50001C12.25 2.85568 11.7277 2.33334 11.0833 2.33334Z" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M9.33203 1.1665V3.49984" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M4.66797 1.1665V3.49984" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M1.75 5.83334H12.25" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>`,
		},
		{
			name: "User ID",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path d="M8.45703 1.1665H3.4987C3.18928 1.1665 2.89253 1.28942 2.67374 1.50821C2.45495 1.72701 2.33203 2.02375 2.33203 2.33317V11.6665C2.33203 11.9759 2.45495 12.2727 2.67374 12.4915C2.89253 12.7103 3.18928 12.8332 3.4987 12.8332H10.4987C10.8081 12.8332 11.1049 12.7103 11.3237 12.4915C11.5424 12.2727 11.6654 11.9759 11.6654 11.6665V4.37484L8.45703 1.1665Z" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M8.16797 1.1665V4.6665H11.668" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M9.33464 7.5835H4.66797" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M9.33464 9.9165H4.66797" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M5.83464 5.25H4.66797" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>`,
		},
		{
			name: "Full Name",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
					<g clip-path="url(#clipPath)">
						<path d="M7.00002 12.8333C10.2217 12.8333 12.8334 10.2217 12.8334 6.99999C12.8334 3.77833 10.2217 1.16666 7.00002 1.16666C3.77836 1.16666 1.16669 3.77833 1.16669 6.99999C1.16669 10.2217 3.77836 12.8333 7.00002 12.8333Z" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M7 7.58334C7.9665 7.58334 8.75 6.79984 8.75 5.83334C8.75 4.86685 7.9665 4.08334 7 4.08334C6.0335 4.08334 5.25 4.86685 5.25 5.83334C5.25 6.79984 6.0335 7.58334 7 7.58334Z" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M4.08331 12.0528V11.0833C4.08331 10.7739 4.20623 10.4772 4.42502 10.2584C4.64381 10.0396 4.94056 9.91666 5.24998 9.91666H8.74998C9.0594 9.91666 9.35615 10.0396 9.57494 10.2584C9.79373 10.4772 9.91665 10.7739 9.91665 11.0833V12.0528" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					</g>
					<defs>
						<clipPath id="clipPath">
							<rect width="14" height="14" fill="white"/>
						</clipPath>
					</defs>
				</svg>`,
		},
		{
			name: "Product",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
				  <path d="M11.668 2.3335H2.33464C1.6903 2.3335 1.16797 2.85583 1.16797 3.50016V10.5002C1.16797 11.1445 1.6903 11.6668 2.33464 11.6668H11.668C12.3123 11.6668 12.8346 11.1445 12.8346 10.5002V3.50016C12.8346 2.85583 12.3123 2.3335 11.668 2.3335Z" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
				  <path d="M5.83203 2.3335V4.66683" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
				  <path d="M1.16797 4.6665H12.8346" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
				  <path d="M3.5 2.33334V4.66668" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>`,
		},
		{
			name: "Amount",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
					<g clip-path="url(#clip0_1301_4975)">
						<path d="M7.0013 12.8332C10.223 12.8332 12.8346 10.2215 12.8346 6.99984C12.8346 3.77818 10.223 1.1665 7.0013 1.1665C3.77964 1.1665 1.16797 3.77818 1.16797 6.99984C1.16797 10.2215 3.77964 12.8332 7.0013 12.8332Z" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M9.33464 4.6665H5.83464C5.52522 4.6665 5.22847 4.78942 5.00968 5.00821C4.79089 5.22701 4.66797 5.52375 4.66797 5.83317C4.66797 6.14259 4.79089 6.43934 5.00968 6.65813C5.22847 6.87692 5.52522 6.99984 5.83464 6.99984H8.16797C8.47739 6.99984 8.77413 7.12275 8.99293 7.34155C9.21172 7.56034 9.33464 7.85708 9.33464 8.1665C9.33464 8.47592 9.21172 8.77267 8.99293 8.99146C8.77413 9.21025 8.47739 9.33317 8.16797 9.33317H4.66797" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M7 10.5V3.5" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					</g>
					<defs>
						<clipPath id="clip0_1301_4975">
							<rect width="14" height="14" fill="white"/>
						</clipPath>
					</defs>
				</svg>`,
		},
		{
			name: "Country",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path d="M3.5 9.33334C4.4665 9.33334 5.25 8.54984 5.25 7.58334C5.25 6.61685 4.4665 5.83334 3.5 5.83334C2.5335 5.83334 1.75 6.61685 1.75 7.58334C1.75 8.54984 2.5335 9.33334 3.5 9.33334Z" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M5.65781 8.4001L5.13281 8.2251" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M1.86875 6.9416L1.34375 6.7666" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M2.68359 9.7418L2.85859 9.2168" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M4.43255 9.74154L4.19922 9.1582" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M2.79974 6.00814L2.56641 5.4248" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M1.34375 8.51654L1.92708 8.2832" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M5.07422 6.88324L5.65755 6.6499" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M4.31563 5.4248L4.14062 5.9498" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M8.16797 1.1665V4.6665H11.668" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M2.33203 3.20817V2.33317C2.33203 2.02375 2.45495 1.72701 2.67374 1.50821C2.89253 1.28942 3.18928 1.1665 3.4987 1.1665H8.45703L11.6654 4.37484V11.6665C11.6654 11.9759 11.5424 12.2727 11.3237 12.4915C11.1049 12.7103 10.8081 12.8332 10.4987 12.8332H3.4987C3.23376 12.8416 2.97386 12.7595 2.7618 12.6004C2.54974 12.4414 2.39817 12.2149 2.33203 11.9582" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>`,
		},
		{
			name: "Email",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
					<g clip-path="url(#clip0_1301_4975)">
						<path d="M7.0013 12.8332C10.223 12.8332 12.8346 10.2215 12.8346 6.99984C12.8346 3.77818 10.223 1.1665 7.0013 1.1665C3.77964 1.1665 1.16797 3.77818 1.16797 6.99984C1.16797 10.2215 3.77964 12.8332 7.0013 12.8332Z" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M9.33464 4.6665H5.83464C5.52522 4.6665 5.22847 4.78942 5.00968 5.00821C4.79089 5.22701 4.66797 5.52375 4.66797 5.83317C4.66797 6.14259 4.79089 6.43934 5.00968 6.65813C5.22847 6.87692 5.52522 6.99984 5.83464 6.99984H8.16797C8.47739 6.99984 8.77413 7.12275 8.99293 7.34155C9.21172 7.56034 9.33464 7.85708 9.33464 8.1665C9.33464 8.47592 9.21172 8.77267 8.99293 8.99146C8.77413 9.21025 8.47739 9.33317 8.16797 9.33317H4.66797" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M7 10.5V3.5" stroke="#88888A" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
					</g>
					<defs>
						<clipPath id="clip0_1301_4975">
							<rect width="14" height="14" fill="white"/>
						</clipPath>
					</defs>
				</svg>`,
		},
	];

	export let orders;
	export let totalPages;
	export let totalPurchases;

	let currentPage = 1;
	let isExportModalOpen = false
	let isExporting = false
	let pageNumberInput;
	let numberInput;
	let exportEmail = ""
	let isDateFilterActive = false
	let isFiltering = false
	let isChecked = false;

	let datePickerElement
	let dateRangeExport

	let datePickerElementFilter
	let dateRangeFilter
	
	let selectedCategory = "";
	let showExportResetButton
	let showFilterResetButton
	let rangeButton = "Export All Data";
	let rangeButtonFilter = "Show All Data"

	let categories =  ["Date", "Product", "Funnel", "Multivariant"]

	let selectedOptions = [
			{ label: 'Shampoo + Conditioner', isChecked: false },
			{ label: 'Plastic-Free Floss (3-Pack)', isChecked: false },
			{ label: 'Shampoo + Conditioner', isChecked: false },
			{ label: 'Plastic-Free Floss (3-Pack)', isChecked: false },
			{ label: 'Toxic-Free Mouthwash', isChecked: false },
			{ label: 'Shampoo + Conditioner', isChecked: false },
			{ label: 'Plastic-Free Floss (3-Pack)', isChecked: false },
			{ label: 'Toxic-Free Mouthwash', isChecked: false },
			{ label: '2 Month Supply', isChecked: false },
			{ label: '6 Month Supply', isChecked: false },	
			{ label: 'Get Free Toxic-Free MouthWash', isChecked: false }
	];

	let isActive = false;
	let dropdownRef;

	onMount(() => {
		if(browser) {
			document.addEventListener("click", (event) => {
				if (dropdownRef && !dropdownRef.contains(event.target) && selectedCategory.length <= 0) {
					// isActive = false;
					searchCategoryTerm = "";
				}
			});
		}
	})

	
	function handlePageNumberInput(event) {
		pageNumberInput = event.target.value;
	}
    function handlePageNumberKeyPress(event) {
		if (event.which === 13) {
			const newPage = parseInt(pageNumberInput);

			if (!isNaN(newPage)) {
				goToPage(newPage);
				pageNumberInput = ''; // Giriş kutusunu temizle
				numberInput = false;
			}
		}
  }

	function goToPage(newPage) {
		if (newPage >= 1 && newPage <= totalPages) {
			currentPage = newPage;
			fetchNewPageData(newPage);
		}
	}

	async function fetchNewPageData(newPage) {
		try {
			if(showFilterResetButton && (isNaN(dateRangeFilter.start) || isNaN(dateRangeFilter.end))){
				$toastMessage.type = "error";
				$toastMessage.content = 'Invaild Filter Date Range'
				return
			}
			isFiltering = true

			const url =
				showFilterResetButton
				? `https://mve.novus.studio/prod/purchases/view?offset=${(currentPage - 1) * 40}&limit=40&startDate=${dateRangeFilter.start}&endDate=${dateRangeFilter.end}`
				: `https://mve.novus.studio/prod/purchases/view?offset=${(currentPage - 1) * 40}&limit=40`;
			const response = await fetch(url);
			const newData = await response.json();
			orders = newData.docs;
			if(	currentPage == 1){
				totalPages = newData.availablePages
				totalPurchases = newData.totalDocs
			}
			isFiltering = false

		} catch (error) {
			isFiltering = false
			console.error('Fetch error:', error);
		}
	}

	let searchTerm = ''; 
	let searchCategoryTerm = '';

	function updateSearchTerm(event) {
		searchTerm = event.target.value.toLowerCase();
	}

	let innerWidth;

	if(browser) {
		innerWidth = window.innerWidth;
	}

	const handleExport = async () => {
		if(isExporting) return
		if(exportEmail == ""){
			$toastMessage.type = "error";
			$toastMessage.content = 'Invaild Email'
			return
		}

		if(isNaN(dateRangeExport.start) || isNaN(dateRangeExport.end)){
			$toastMessage.type = "error";
			$toastMessage.content = 'Invaild Date Range'
			return
		}

		isExporting = true
		let url = isDateFilterActive
			? `https://mve.novus.studio/prod/export/purchases?email=${exportEmail}&startDate=${dateRangeExport.start}&endDate=${dateRangeExport.end}`
			: `https://mve.novus.studio/prod/export/purchases?email=${exportEmail}`
		const req = await fetch(url);
		const res = await req;

		if(res.status == 200){
			isExportModalOpen = false
			isExporting = false
			exportEmail = ""
			$toastMessage.type = "success";
			$toastMessage.content = 'Export completed'
		} else{
			isExportModalOpen = false
			isExporting = false
			$toastMessage.type = "error";
			toastMessage.content = 'Something went wrong while exporting.'
		}
	}

	const handleDateRangeExport = () => {
		if(!dateRangeExport) return
		rangeButton = `${new Date(dateRangeExport.start).toDateString().split(" ").slice(1, 3).join(" ")} - ${new Date(dateRangeExport.end).toDateString().split(" ").slice(1, 3).join(" ")}`
		showExportResetButton = true
	}

	const handleDateRangeFilter = () => {
		if(!dateRangeFilter) return
		rangeButtonFilter = `${new Date(dateRangeFilter.start).toDateString().split(" ").slice(1, 3).join(" ")} - ${new Date(dateRangeFilter.end).toDateString().split(" ").slice(1, 3).join(" ")}`
		showFilterResetButton = true
		currentPage = 1
	}

	$: dateRangeExport, handleDateRangeExport()
	$: dateRangeFilter, handleDateRangeFilter()
</script>

<div class="table-wrapper purchases-table">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="table-inner">
		<div class="table-navbar">
			<div class="table-nav">
				<p>Purchases <span>({orders.length} out of {totalPurchases})</span></p>
	
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="selector-wrapper">
					<div class="cta-button secondary"
						on:click={() => {
							isExportModalOpen = !isExportModalOpen
							isActive = false
						}}>Export</div>
					<div class="export-to" style={`display:${isExportModalOpen ? "flex" : "none"}`}>
						<input class="input export-input" placeholder="Email" type="email" bind:value={exportEmail}>
						<div class="left-group-1">
							{#if showExportResetButton}
							<div
								class="select-range-button-reset cta-button secondary"
								on:click={(e) => {
									rangeButton = "Export All Data";
									showExportResetButton = false
								}}
							>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" class="s-EvZdnE7xYsG-">
								<path d="M2 8C2 9.18669 2.35189 10.3467 3.01118 11.3334C3.67047 12.3201 4.60754 13.0892 5.7039 13.5433C6.80026 13.9974 8.00666 14.1162 9.17054 13.8847C10.3344 13.6532 11.4035 13.0818 12.2426 12.2426C13.0818 11.4035 13.6532 10.3344 13.8847 9.17054C14.1162 8.00666 13.9974 6.80026 13.5433 5.7039C13.0892 4.60754 12.3201 3.67047 11.3334 3.01118C10.3467 2.35189 9.18669 2 8 2C6.32263 2.00631 4.71265 2.66082 3.50667 3.82667L2 5.33333" stroke="white" stroke-linecap="round" stroke-linejoin="round" class="s-EvZdnE7xYsG-"></path>
								<path d="M2 2V5.33333H5.33333" stroke="white" stroke-linecap="round" stroke-linejoin="round" class="s-EvZdnE7xYsG-"></path>
							</svg>
						</div>
							{/if}
						<div class="relative">
							<div class = "date-picker" bind:this = {datePickerElement}>
								<DatePicker selectedOption = {2} bind:dateRange={dateRangeExport} />
							</div>
							<div
								class="cta-button select-export-range-button secondary"
								on:click={() => {
									let temp = datePickerElement.childNodes[0].childNodes[1]
									temp.style.maxWidth = "4.2rem"
									temp.click()
								}}
							>
							{rangeButton}
						</div>
						</div>
							</div>
						<div class="cta-button export-button primary" on:click={() => handleExport()}>
							{#if isExporting}
								{@html spinner}
							{:else}
								Send
							{/if}
						</div>
					</div>
					<div class="dropdown" class:active={isActive} bind:this={dropdownRef}>
						<div href="#" class="dropdown-title" on:click={() => {isActive = !isActive; isExportModalOpen = false}}>
							<div class="item-name ">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path d="M13.3359 2.66699H2.66927C1.93289 2.66699 1.33594 3.26395 1.33594 4.00033V12.0003C1.33594 12.7367 1.93289 13.3337 2.66927 13.3337H13.3359C14.0723 13.3337 14.6693 12.7367 14.6693 12.0003V4.00033C14.6693 3.26395 14.0723 2.66699 13.3359 2.66699Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
									<path d="M6.66406 2.66699V5.33366" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
									<path d="M1.33594 5.33301H14.6693" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M4 2.66684V5.33351" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
								</svg> 
								
								<div>Filters</div>
							</div>
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
								<path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</div>
						<div class="dropdown-content dropdown-content-filter custom-bar checkbox-dropdown" class:category-dropdown={selectedCategory === ''}>
							<div class="input-holder ">
								<input bind:value={searchCategoryTerm} class="input" placeholder="Search" type="text" />
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round" />
									<path d="M13.9995 14.0001L11.1328 11.1335" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</div>
							{#if selectedCategory.length >= 1}
								<div class="return-holder" on:click={() => selectedCategory = ""}>
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
										<path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
									Return
								</div>
							{/if}
							{#if selectedCategory.length <= 0} 
								{#each categories as category }
									<div class="checkbox-dropdown-content">
										<label class="checkbox-holder category" on:click={() => selectedCategory = category }>
											{category}
											<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
												<path d="M5.25 10.5L8.75 7L5.25 3.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
											</svg>
										</label>
									</div>
								{/each}
							{:else if selectedCategory == "Date" }
							<div class="date-card">
									<div class="left-group-1">
										{#if showFilterResetButton}
										<div
											class="select-range-button-reset cta-button secondary"
											on:click={(e) => {
												rangeButtonFilter = "Show All Data";
												showFilterResetButton = false
												currentPage = 1
											}}
										>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" class="s-EvZdnE7xYsG-">
											<path d="M2 8C2 9.18669 2.35189 10.3467 3.01118 11.3334C3.67047 12.3201 4.60754 13.0892 5.7039 13.5433C6.80026 13.9974 8.00666 14.1162 9.17054 13.8847C10.3344 13.6532 11.4035 13.0818 12.2426 12.2426C13.0818 11.4035 13.6532 10.3344 13.8847 9.17054C14.1162 8.00666 13.9974 6.80026 13.5433 5.7039C13.0892 4.60754 12.3201 3.67047 11.3334 3.01118C10.3467 2.35189 9.18669 2 8 2C6.32263 2.00631 4.71265 2.66082 3.50667 3.82667L2 5.33333" stroke="white" stroke-linecap="round" stroke-linejoin="round" class="s-EvZdnE7xYsG-"></path>
											<path d="M2 2V5.33333H5.33333" stroke="white" stroke-linecap="round" stroke-linejoin="round" class="s-EvZdnE7xYsG-"></path>
										</svg>
									</div>
										{/if}
									<div class="relative">
										<div class = "date-picker" bind:this = {datePickerElementFilter}>
											<DatePicker selectedOption = {2} bind:dateRange={dateRangeFilter} />
										</div>
										<div
											class="cta-button select-export-range-button secondary"
											on:click={() => {
												let temp = datePickerElementFilter.childNodes[0].childNodes[1]
												temp.style.maxWidth = "4.2rem"
												temp.click()
											}}
										>
										{rangeButtonFilter}
									</div>
									</div>
										</div>

									<div class="cta-button primary export-button" on:click={() => fetchNewPageData()}>
										{#if isFiltering}
											{@html spinner}
										{:else}
											Send
										{/if}
									</div>
								</div>
							{:else}
								<InnerOptions bind:selectedOptions={selectedOptions} {selectedCategory} {searchCategoryTerm}/>
							{/if}
						</div>
					</div>
					<div class="input-holder ">
						<input bind:value={searchTerm} class="input" placeholder="Search" type="text" on:input={() => updateSearchTerm(event)}/>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
							<path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M13.9995 14.0001L11.1328 11.1335" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</div>
				</div>
			</div>
			<div class="selected-badge-wrapper">
					{#each selectedOptions as option }
						{#if option.isChecked}
							<div>
								<p>{option.label}</p>
								<div on:click={() => {option.isChecked = false}} class="remove-icon">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
										<g clip-path="url(#clip0_2291_7211)">
											<path d="M8.0026 14.6668C11.6845 14.6668 14.6693 11.6821 14.6693 8.00016C14.6693 4.31826 11.6845 1.3335 8.0026 1.3335C4.32071 1.3335 1.33594 4.31826 1.33594 8.00016C1.33594 11.6821 4.32071 14.6668 8.0026 14.6668Z" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
											<path d="M10 6L6 10" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
											<path d="M6 6L10 10" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
										</g>
										<defs>
											<clipPath id="clip0_2291_7211">
											<rect width="16" height="16" fill="white"/>
											</clipPath>
										</defs>
									</svg>
								</div>
							</div>
						{/if}
					{/each}
			</div>
		</div>
		<div class="table-order-wrapper">
			<tr class="top-row">
				{#each columns as { name, icon }}
					<th id={name.toLowerCase().replaceAll(' ', '')}>
						{@html icon}

						<span>{name}</span>
					</th>
				{/each}
			</tr>
			{#each orders as order, _index}
				{#if order.purchaseId.toLowerCase().includes(searchTerm)}
					<a href={`/purchases/${order.purchaseId}`}>
						<tr class="order">
							<td>
								<p class="order-date">
									{moment(order.date).format('D MMMM YYYY')}
								</p>
							</td>
							<td>
								<p class="purchase-id">
									{order.purchaseId}
								</p>
							</td>
							<td>
								<p>
									{`${order.billingAddress.first_name} ${order.billingAddress.last_name}`}
								</p>
							</td>
							<td class="product-count lg">
								<p>
									{productsDictionary.find((p) => p.variantId === order.purchase.primaryVariantId)?.name}

									<span>({order.purchase.products.length} products)</span>
								</p>
							</td>
							<td class="sm">
								<p class="purchase-id">
									{(order.purchase.subTotal + (order.purchase.shippingTotal ? order.purchase.shippingTotal : 0) - order.purchase.discount).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
								</p>
							</td>
							<td class="sm">
								<p>
									{order.billingAddress.country}
								</p>
							</td>
							<td>
								<p class="purchase-id">
									{order.email}
								</p>
							</td>
						</tr>
					</a>
				{/if}
			{/each}
		</div>
		<div class="pagination-wrapper">
			<div class="pagination prev" on:click={goToPage(currentPage - 1)}>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path d="M12.668 8H3.33464" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M8 3.33334L3.33333 8.00001L8 12.6667" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
				<span>Previous</span>
			</div>

			{#if innerWidth < 479}
				{#each Array.from({ length: 1 }, (_, index) => currentPage - index - 1).reverse() as page}
					{#if page >= 1 && page < totalPages}
						<div class="page-item" on:click={() => goToPage(page)}>{page}</div>
					{/if}
				{/each}

			{:else}

				{#each Array.from({ length: 3 }, (_, index) => currentPage - index - 1).reverse() as page}
					{#if page >= 1 && page < totalPages}
						<div class="page-item" on:click={() => goToPage(page)}>{page}</div>
					{/if}
				{/each}
			{/if}

			{#if numberInput}
				<input class="page-input" type="number" placeholder="..." bind:value={pageNumberInput} on:input={handlePageNumberInput} on:keypress={handlePageNumberKeyPress} />

				{:else}

				<div class="page-item" on:click={() => numberInput = true}>
					{#if currentPage === 1}
						1
						{:else}
						...
					{/if}
				</div>
			{/if}

			{#if innerWidth < 479}
				{#each Array.from({ length: 1 }, (_, index) => currentPage + index + 1) as page}
					{#if page >= 1 && page < totalPages}
					<div class="page-item" on:click={() => goToPage(page)}>{page}</div>
					{/if}
				{/each}

				{:else}

				{#each Array.from({ length: 3 }, (_, index) => currentPage + index + 1) as page}
					{#if page >= 1 && page < totalPages}
					<div class="page-item" on:click={() => goToPage(page)}>{page}</div>
					{/if}
				{/each}
			{/if}
			<div class="pagination next" on:click={goToPage(currentPage + 1)}>
				<span>Next</span>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path d="M3.33203 8H12.6654" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M8 3.33334L12.6667 8.00001L8 12.6667" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</div>
		</div>

		{#if numberInput}
			<p class="pagination-text">Please enter a page number and press Enter</p>
			{:else}
			<p class="pagination-text">{currentPage} / {totalPages} page results</p>
		{/if}
		
	</div>
</div>

<style>

	:global(.pagination.next.hide) {
		display: none !important;
	}
	.dropdown-content-filter.checkbox-dropdown input[type=text]{
		max-width: 100%;
		width: 100%;
	}
	.left-group-1{
		display: flex;
		gap: 1rem
	}
	.select-export-range-button{
		width: 100%;
		padding: 1.2rem 2.5rem;
	}
	.date-picker{
		max-width: 10px;
		height: 10px;
		padding: 0;
		overflow: hidden;
		position: relative;
		margin-left: auto;
		position: absolute;
		left: 0%;
		bottom: 0px;
		opacity: 0;
	}
	.relative{
		position: relative;
	}
	.date-card{
		padding: 2rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.8rem;
		align-items: center;
	}

	.date-input {
		display: flex;
		gap: 1.5rem;
		align-items: center;
		justify-content: space-between;
	}

	input[type="date"]::-webkit-calendar-picker-indicator{
		display: none;
	}

	.date-input span{
		width: 20%;
	}

	.dropdown-content {
		transform: none !important;
		top: 5rem;
		overflow: auto;
		transition: none;
		width: 300px;
	}

	.export-input {
		width: 100%;
		padding: 1.2rem 2rem;
		background-color: #1a1f26;
	}
	.export-to{
		width: 300px;
		right: 36rem;
		padding: 1.5rem;
		border-radius: 0.8rem;
		background-color: #0D121A;
		border: .1rem solid #1A1F26;
		color: #FFF;
		position: absolute;
		align-items: center;
		top: 50px;
		display: none;
		flex-direction: column;
		gap: 1.5rem;
	}

	.export-button{
		width: 45%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cta-button {
		padding: 1.2rem 3.2rem;
	}

	.product-count p {
		width: 100%;

		/* font-size: 1.2rem; */
		text-transform: capitalize;
    	white-space: pre;
    	text-overflow: ellipsis;
    	overflow: hidden;
	}

	.product-count span {
		font-style: italic;
		font-size: 1.2rem;
		color: #BABABA;

		margin-left: 1rem;
	}

	/* END @mete */
	.pagination-text {
		margin-top: 1rem;
		color: #88888A;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.page-input {
		cursor: pointer;
		max-width: 4.3rem;
		height: 4rem;

		background-color: #0d121a;
		border: .1rem solid #212830;
		color: #FFF;
		text-align: center;
	}

	:global(.pagination.disabled) {
		pointer-events: none;
	}

	.table-inner {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
		padding: 1.6rem;
	}

	.table-wrapper {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding-top: 8rem;
	}

	.table-wrapper .order:last-child td {
		border-bottom: 0;
	}

	table {
		overflow-x: auto;
		border-radius: 1.6rem;

		width: 100%;
		min-height: 65rem;

		border-collapse: collapse;

		margin-bottom: 1.6rem;
	}

	.sort-arrow {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		margin-left: auto;
	}

	.sort-arrow svg {
		cursor: pointer;
	}

	.top-row {
		display: flex;
		align-items: center;
		justify-content: flex-start;

		border-bottom: 0.1rem solid #1a1f26;
	}

	.order {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		font-weight: 400;
	}

	.order td {
		padding: 2.1rem 2.6rem;
		border: 0.1rem solid #1a1f26;
		border-left: 0;

		max-height: none;
	   
	}
	.order .purchase-id{
		text-overflow: ellipsis;  
		white-space: nowrap;
		overflow: hidden;
		width: 100%;
	}

	.table-order-wrapper {
		border: .1rem solid rgba(33, 40, 48, 1);
    	border-radius: 1.6rem;
	}

	:global(.table-order-wrapper > a:nth-child(odd) .order td) {
		background-color: #0D121A;
	}

	:global(.table-order-wrapper > a:nth-child(even) .order td) {
		background-color: #141921;
	}

	th {
		background-color: #0d121a;
		padding: 1.4rem 1.6rem 1.4rem 2.4rem;
	}

	th,
	td {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: calc(100% / 7);
		max-height: 4rem;

		border-right: 0.1rem solid #1a1f26;

		font-size: 1.4rem;
	}

	.top-row th {
		justify-content: flex-start;
		gap: 0.6rem;
	}

	th div {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
	}

	th span {
		color: #88888a;
		font-size: 1.4rem;
		line-height: 1.8rem;
	}

	.top-row th:first-child {
		border-top-left-radius: 1.6rem;
	}

	table a:last-child .order:last-child {
		border-bottom-right-radius: 1.6rem;
		border-bottom-left-radius: 1.6rem;
	}

	th:last-child {
		border-top-right-radius: 1.6rem;
	}

	.order td:last-child {
		border-right: none;
	}

	.page-item {
		cursor: pointer;

		padding: 1.1rem 1.5rem;
		border: 0.1rem solid #1a1f26;

		font-size: 1.4rem;

		background-color: #0d121a;

		transition: all 0.3s ease-in-out;
	}

	.page-item:hover {
		background-color: #1a1f26;
	}
	.page-item.active {
		background-color: #1a1f26;
	}

	.pagination-wrapper {
		position: relative;

		display: flex;
		align-items: center;
		justify-content: center;

		width: fit-content;

		margin-left: auto;
		margin-top: 2rem;
	}

	.pagination {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.8rem;

		background-color: #0d121a;
		color: #88888a;

		border: 0.1rem solid #212830;
		padding: 1.1rem 1.6rem;

		font-size: 1.4rem;

		transition: all 0.3s ease-in-out;

		cursor: pointer;
	}

	.pagination.prev {
		border-radius: 0.8rem 0rem 0rem 0.8rem;
	}

	.pagination.next {
		border-radius: 0rem 0.8rem 0.8rem 0rem;
	}

	svg path {
		transition: all 0.3s ease-in-out;
	}

	.pagination.active,
	.pagination:hover {
		color: #fff;
		border-color: #383C42;
	}

	.pagination.active svg path,
	.pagination:hover svg path,
	.sort-arrow svg:hover path {
		stroke: #fff;
	}

	.table-navbar {
		margin-bottom: 1.2rem;
	}

	.table-navbar p {
		font-size: 1.8rem;
	}

	.table-navbar {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
	}

	.selector-wrapper {
		display: flex;
		align-items: flex-end;
		gap: 1.5rem;
		position: relative
	}


	.table-navbar span {
		font-size: 1.4rem;
		color: #88888a;
	}

	.table-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.selected-badge-wrapper {
		margin-top: 0.8rem;
		display: flex;
		flex-wrap: wrap;
		gap: .8rem;
	}
	.selected-badge-wrapper > div {
		background-color: #1A1F26;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 1.2rem;
		color: #88888A;
		padding: .6rem .8rem;
		border: .1rem solid #383C42;
		border-radius: .6rem;
		gap: 1.6rem;
		transition: all .3s ease-in-out;
	}
	.selected-badge-wrapper p {
		font-size: inherit;
	}

	.selected-badge-wrapper .remove-icon {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.return-holder {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: .5rem;
		padding: 1.5rem;
		color: #88888A;
		cursor: pointer;
		transition: .3s all ease-in-out;
	}

	.return-holder svg {
		rotate: 90deg;
	}

	.return-holder svg path {
		stroke: #88888A;
	}

	.return-holder:hover svg path {
		stroke: white;
	}

	.return-holder:hover {
	   color: #fff;
	}

	.dropdown-content.category-dropdown {
		transform: translateY(27%)
	}

	.order-date {
		color: rgba(136, 136, 138, 1);
	}

	th#country,
	th#amount,
	td.sm {
		min-width: auto;
			width: calc(100% / 10);
	}

	th#product,
	td.lg {
		min-width: auto;
		
		flex: 1;
	}

	@media screen and (min-width: 768px) {

		.table-inner {
			padding: 3.2rem;
		}

		.pagination-wrapper {
			margin-top: 2.4rem;
		}

	}


</style>

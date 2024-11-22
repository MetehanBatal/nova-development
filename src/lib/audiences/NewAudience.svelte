<script>
	import Dropdown from '$lib/toolkit/Dropdown.svelte';
	import { audience } from '../../stores/audience';

	export let data;

	// let $audience.conditions = [
	// 	{
	// 		group: "Traffic Source",
	// 		name: 'campaign',
	// 		condition: 'contains',
	// 		values: [ 'some_keyword' ]
	// 	}
	// ];

	let conditionGroups = [
		{
			name : "Traffic Sources",
			items : [
				{
					name: "Campaign",
					id: "utm_campaign",
					draggable: true
				},
				{
					name: "Keyword",
					id: "utm_keyword",
					draggable: true
				},
				{
					name: "Medium",
					id: "utm_medium",
					draggable: true
				},
				{
					name: "Source",
					id: "utm_source",
					draggable: true
				}
			],
		},
		{
			name : "Visitor",
			items : [
				{
					name: "Average time on page",
					id: "average_time_on_page",
					draggable: false
				},
				{
					name: "Day since last_visit",
					id: "day_since_last_visit",
					draggable: false
				},
				{
					name: "Pages Visited",
					id: "pages_visited",
					draggable: false
				},
				{
					name: "Visit Duration",
					id: "visit_duration",
					draggable: false
				},
				{
					name: "Visitor Cookie",
					id: "visitor_cookie",
					draggable: true
				},
				{
					name: "Visits Count",
					id: "visits_count",
					draggable: false
				}
			]
		},
		{
			name : "Visit Time",
			items : [
				{
					name: "Day of week",
					id: "day_of_week",
					draggable: true
				},
				{
					name: "Hour of the day",
					id: "hour_of_the_day",
					draggable: true
				}
			]
		},
		{
			name : "System",
			items : [
				{
					name: "Browser",
					id: "browser",
					draggable: false
				},
				{
					name: "Browser Version",
					id: "browser_version",
					draggable: false
				},
				{
					name: "Operating System",
					id: "operating_system",
					draggable: false
				},
				{
					name: "Device Type",
					id: "device_type",
					draggable: false
				}
			]
		},
		{
			name : "Page Tags",
			items : [
				{
					name: "Product SKU",
					id: "product_sku",
					draggable: false
				},
				{
					name: "Primary Product ID",
					id: "primary_product_id",
					draggable: false
				},
				{
					name: "Primary Variant ID",
					id: "primary_variant_id",
					draggable: false
				},
				{
					name: "Product Price",
					id: "product_price",
					draggable: false
				},
				{
					name: "Product Name",
					id: "product_name",
					draggable: false
				},
				{
					name: "Customer ID",
					id: "customer_id",
					draggable: false
				}
			]
		},
		{
			name : "Geolocation and Weather",
			items : [
				{
					name: "Language",
					id: "language",
					draggable: false
				},
				{
					name: "City",
					id: "city",
					draggable: true
				},
				{
					name: "Country",
					id: "country",
					draggable: true
				},
				{
					name: "Weather",
					id: "weather",
					draggable: false
				}
			]
		},
	];

	const conditionRules = [
		{ id: 'matches_exactly', name: 'Matches exactly' },
		{ id: 'contains', name: 'Contains' },
		{ id: 'ends_with', name: 'Ends with' },
		{ id: 'starts_with', name: 'Starts with' },
		{ id: 'does_not_match_exactly', name: 'Does not match exactly' }
	];
	let selectedConditionIndexes = $audience.conditions.length > 0 ? $audience.conditions.map(condition => conditionRules.findIndex(rule => rule.id === condition.condition)) : [0];

	let searchTerm = ''; 
	function updateSearchTerm(event) {
		searchTerm = event.target.value.toLowerCase(); 
	}

	function handleDragStart(event, group, item) {
		event.dataTransfer.setData("group", group);
		event.dataTransfer.setData("item", item);
	}

	function handleDragEnter(event) {
		event.preventDefault();
		event.toElement.classList.add('hovering');
		event.dataTransfer.dropEffect = 'move';
	}

	function handleDropEvent(event, index) {
		let group = event.dataTransfer.getData('group');
		let item = event.dataTransfer.getData('item');

		if (event.toElement.getAttribute('data-method') === 'or') {
			if ($audience.conditions.some(condition => condition.name === item)) {
				$audience.conditions[$audience.conditions.findIndex(condition => condition.name === item)].values.push('');
			} else {
				$audience.conditions[index].group = group;
				$audience.conditions[index].name = item;
			}
		} else {
			$audience.conditions.push({
				id: Math.floor(Math.random() * (1000000000000 - 100000000000) + 1000000000000),
				group: group,
				name: item,
				condition: 'matches_exactly',
				values: ['']
			})

			selectedConditionIndexes = $audience.conditions.length > 0 ? $audience.conditions.map(condition => conditionRules.findIndex(rule => rule.id === condition.condition)) : [0];
		};

		$audience.conditions = $audience.conditions;
		selectedConditionIndexes = selectedConditionIndexes;

		document.querySelectorAll('.hovering').forEach((hoveredItem) => hoveredItem.classList.remove('hovering'));
	}

	function handleDragLeave(event) {
		event.toElement.classList.remove('hovering');
	}

	function handleDeleteCondition(conditionIndex, valueIndex) {
		$audience.conditions[conditionIndex].values.splice(valueIndex, 1);

		if ($audience.conditions[conditionIndex].values.length < 1) {
			$audience.conditions.splice(conditionIndex, 1);
		}

		$audience.conditions = $audience.conditions;
	};
</script>

<div class="new-audiences-wrapper">
	<div class="audience-name-section">
		
		<div class="input-holder">
			<span class="muted">Audience Name</span>
			<input class="input" name="audienceName" type="text" placeholder="Example audience name" bind:value={$audience.name}>
		</div>

		<div class="input-holder">
			<span class="muted">Audience Description</span>
			<textarea name="audienceText" id="" cols="30" rows="10" placeholder="Description about your target audience" bind:value={$audience.description}></textarea>
		</div>

	</div>

	<div class="audience-condition-section">
		<p class="low-heading">Conditions</p>
	  
		<div class="input-holder label-holder">
		  <img src="/assets/icons/icon_search.svg" alt="search-icon">
		  <input type="text" class="input" placeholder="Search" on:input={() => updateSearchTerm(event)}>
		</div>
	  
		<div class="all-conditions">
			{#each conditionGroups as conditionGroup}
				<div class="condition-type">
					<p class="low-text">{conditionGroup.name}</p>

					{#each conditionGroup.items as conditionItem}
						{#if conditionItem.name.toLowerCase().includes(searchTerm)}
							<div class="condition-item" draggable={conditionItem.draggable} on:dragstart={event => handleDragStart(event, conditionGroup.name, conditionItem.id)}>
								<img src="/assets/icons/selection.svg" alt="">
								<p class="low-text">{conditionItem.name}</p>
							</div>
						{/if}
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<div class="audience-rules-section" >
		<p class="low-heading">Rules & Conditions</p>

		<div class="rules-wrapper">
				<div class="rule-item">
					{#if $audience.conditions.length > 0}
					<div class="rule-header">
						<p class="low-text selected-rule capitalized">{$audience.conditions[0].name.replaceAll('_', ' ')}</p>

						<!-- <div class="trash-icon-holder">
							<img src="/assets/icons/trash-icon.svg" alt="Delete Icon">
						</div> -->
					</div>

					<div class="selected-rule-wrapper">
						<Dropdown options={conditionRules} bind:selectedStatusIndex={selectedConditionIndexes[0]} position="left" />
						<div class="inputs-holder">
							{#each $audience.conditions[0].values as value, _index}
							<div>
								<input type="text" class="input" placeholder={`${$audience.conditions[0].name} value`} bind:value={$audience.conditions[0].values[_index]}>

								<span class="svg-holder">
								{#if _index > 0}
								<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" on:click={(e) => handleDeleteCondition(0, _index)}>
									<path d="M1.75 3.5H12.25" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M1.75 3.5H12.25" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M11.0846 3.5V11.6667C11.0846 12.25 10.5013 12.8333 9.91797 12.8333H4.08464C3.5013 12.8333 2.91797 12.25 2.91797 11.6667V3.5" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M11.0846 3.5V11.6667C11.0846 12.25 10.5013 12.8333 9.91797 12.8333H4.08464C3.5013 12.8333 2.91797 12.25 2.91797 11.6667V3.5" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M4.66797 3.49984V2.33317C4.66797 1.74984 5.2513 1.1665 5.83464 1.1665H8.16797C8.7513 1.1665 9.33464 1.74984 9.33464 2.33317V3.49984" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M4.66797 3.49984V2.33317C4.66797 1.74984 5.2513 1.1665 5.83464 1.1665H8.16797C8.7513 1.1665 9.33464 1.74984 9.33464 2.33317V3.49984" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M5.83203 6.4165V9.9165" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M5.83203 6.4165V9.9165" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M8.16797 6.4165V9.9165" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M8.16797 6.4165V9.9165" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
								{/if}
								</span>
							</div>
							{/each}
						</div>
					</div>
					{/if}

					<p class="or">
						OR
					</p>

					<div class="drag-field" data-method="or" on:drop={event => handleDropEvent(event, 0)} on:dragleave={handleDragLeave} on:dragover={handleDragEnter}>
						<p class="pointer-events-none">Drop the same condition here to include more cases</p>
					</div>
				</div>
		</div>

		{#if $audience.conditions.length > 1}
		{#each $audience.conditions as condition, _index}
		{#if _index > 0 && condition.values.length > 0}
			<div class="rules-wrapper">
				<div class="rule-item">
					<div class="rule-header">
						<p class="low-text selected-rule capitalized">{condition.name}</p>
					</div>

					<div class="selected-rule-wrapper">
						<Dropdown options={conditionRules} bind:selectedStatusIndex={selectedConditionIndexes[_index]} position="left" />
						<div class="inputs-holder">
							{#each condition.values as value, __index}
							<div>
								<input type="text" class="input" placeholder={`${condition.name} value`} bind:value={$audience.conditions[_index].values[__index]}>

								<span class="svg-holder">
									<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" on:click={(e) => handleDeleteCondition(_index, __index)}>
										<path d="M1.75 3.5H12.25" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M1.75 3.5H12.25" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M11.0846 3.5V11.6667C11.0846 12.25 10.5013 12.8333 9.91797 12.8333H4.08464C3.5013 12.8333 2.91797 12.25 2.91797 11.6667V3.5" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M11.0846 3.5V11.6667C11.0846 12.25 10.5013 12.8333 9.91797 12.8333H4.08464C3.5013 12.8333 2.91797 12.25 2.91797 11.6667V3.5" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M4.66797 3.49984V2.33317C4.66797 1.74984 5.2513 1.1665 5.83464 1.1665H8.16797C8.7513 1.1665 9.33464 1.74984 9.33464 2.33317V3.49984" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M4.66797 3.49984V2.33317C4.66797 1.74984 5.2513 1.1665 5.83464 1.1665H8.16797C8.7513 1.1665 9.33464 1.74984 9.33464 2.33317V3.49984" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M5.83203 6.4165V9.9165" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M5.83203 6.4165V9.9165" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M8.16797 6.4165V9.9165" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M8.16797 6.4165V9.9165" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								</span>
							</div>
							{/each}
						</div>
					</div>

					<p class="or">
						OR
					</p>

					<div class="drag-field" data-method="or" on:drop={event => handleDropEvent(event, _index)} on:dragleave={handleDragLeave} on:dragover={handleDragEnter}>
						<p class="pointer-events-none">Drop 'or' conditions here from the left</p>
					</div>
				</div>
			</div>
		{/if}
		{/each}
		{/if}

		<div class="rules-wrapper empty">
			<p class="or">
				AND
			</p>

			<div class="drag-field" data-method="and" on:drop={event => handleDropEvent(event)} on:dragleave={handleDragLeave} on:dragover={handleDragEnter}>
				<p class="pointer-events-none">Drop a condition here to combine multiple filtration</p>
			</div>

		</div>
	</div>
</div>  



<style>
	.new-audiences-wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr 1.5fr;

		padding-inline:3.2rem 2.4rem;

		height: calc(80vh - 9rem);
	}

	.audience-name-section {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2.4rem;
		font-size: 1.2rem;
		padding:3.2rem 2.4rem 3.2rem 0;
		border-right: .1rem solid #212830;
	}

	.audience-condition-section {
		position: relative;

		height: 100%;
		max-height: calc(80vh - 9rem); 

		padding:3.2rem 2.4rem 3.2rem 2.4rem;

		background-color: #060B13;
		color: #FFF;

		border-right: .1rem solid #212830;

		overflow-y: scroll;
		overflow-x: hidden;
	}

	.audience-condition-section p {
		margin-bottom: 1.6rem;
	}

	.audience-condition-section .input {
		width: 100%;
		padding-left: 3.5rem;
	}

	.audience-condition-section .input-holder img {
		position: absolute;
		width: 1.6rem;
		height: 1.6rem;
		left: 1.5rem;
		top: 1.2rem;
		margin-right: 1.2rem;
	}

	.all-conditions {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
	}

	.audience-condition-section::after {
		content: "";

		position: sticky;
		bottom: 0;
		left: 0;

		display: inline-block;

		width: 105%;
		height: 5.6rem;

		background: linear-gradient(0deg, #060B13 0%, rgba(6, 11, 19, 0) 100%);
		transform: translateY(4rem);
	}

	.condition-type .low-text:first-child {
		margin-block: 3.2rem 1.6rem;
	}

	.all-conditions p {
		color: #FFF;
	}

	.condition-type {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		width: 100%;
		overflow: scroll;
	}

	.condition-item {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: .8rem;
		
		padding: 1.2rem;
		width: 100%;

		border-radius: .8rem;
		border: .1rem solid #212830;
		background-color:#0D121A;

		margin-bottom: 1.2rem;

		cursor: not-allowed;
	}

	.condition-item[draggable="true"] {
		cursor: grab;
	}

	.condition-item[draggable="true"]:active {
		cursor: grabbing;
	}

	.condition-item p {
		margin-bottom: 0;
	}

	.condition-item > img {
		width: 1.6rem;
	}

	.audience-rules-section {

		background-color: #060B13;

		padding:3.2rem 2.4rem 3.2rem 2.4rem;
		overflow: auto;
		max-height: 50rem;
	}

	.audience-rules-section p.low-heading:first-child {
		margin-bottom: 1.6rem;
	}

	.rules-wrapper {
		padding: 1.6rem;
		border-radius: .8rem;

		background-color: #0D121A;

		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;

		margin-bottom: 1.6rem;
	}

	.rules-wrapper.empty {
		padding-top: 0;
	}

	:global(.rules-wrapper .dropdown.active .dropdown-content) {
		width: 100%;
	}

	.rule-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
	}

	.selected-rule {
		margin-inline: .5rem auto;
	}

	.or-text {
		font-size: 1.2rem;
		color: #88888A !important;
	}

	.rule-header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: .8rem;
	}

	.rule-header p {
		color: #FFF;
	}

	.selected-rule-wrapper {
		display: flex;
		align-items: flex-start;
		gap: 1.6rem;

		width: 100%;
	}

	.inputs-holder {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex: 1;
	}

	.inputs-holder div {
		display: flex;
		gap: .8rem;
		align-items: center;

		position: relative;
	}

	.svg-holder {
		width: 1.6rem;
		height: 1.6rem;
	}

	.svg-holder svg {
		width: 100%;
		height: 100%;

		cursor: pointer;
	}

	.svg-holder svg:hover path {
		stroke: #fff;
	}

	.inputs-holder div:not(:first-child):after {
		position: absolute;
		top: 50%;
		left: 0;

		font-size: 1.2rem;
		color: #88888A;

		content: 'OR';

		transform: translate3d(calc(-100% - 1.6rem), -50%, 0);

		z-index: 1;
	}

	.selected-rule-wrapper input {
		padding-left: 1.2rem;
		width: 100%;
	}

	.empty-item {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: .8rem;
	}

	.draggable-spot {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

		padding: 1.6rem 2.4rem;
		border-radius: .8rem;

		border: .1rem dashed #212830;
		background-color: #0D121A;
		color: #88888A;
		font-size: 1.2rem;
	}

	.input-holder {
		flex-direction: column;
		align-items: flex-start;
		gap: .6rem;

		width: 100%;

		color: #88888A;
	}

	.audience-name-section .input {
		width: 100%;
		padding-left: 1.2rem;
	}

	.audience-name-section textarea {
		border: .1rem solid #212830;
		background-color: transparent;
	}

	.drag-field {
		width: 100%;

		display: flex;
		align-items: center;
		justify-content: center;

		padding: 1.6rem 1rem;

		border-radius: 1.6rem;
		border: .1rem dashed rgba(33, 40, 48, 1);    
	}

	:global(.drag-field.hovering) {
		border-color: #8d8d8d !important;
	}

	.drag-field p {
		color: rgba(136, 136, 138, 1);
		font-size: 1.2rem;
		line-height: 1.8rem;
		text-align: center;
	}

	.or {
		margin-block: 1.6rem .8rem;
	}

	@media screen and (min-height: 640px) {
		.new-audiences-wrapper {
			height: 50rem;
		}
		.audience-condition-section {
			max-height: 50rem;
		}
	}
</style>
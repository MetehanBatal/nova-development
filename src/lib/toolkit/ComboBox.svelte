<script>
	export let components;
	export let selectedComponents = [];
	let isChecked = false;

	function handleCheckboxChange(group, name, component, target) {
		if (!selectedComponents[group]) {
			selectedComponents[group] = [];
		}

		const index = selectedComponents[group].findIndex(item => item.name === name);

		if (index === -1) {
			// Add to selected components if not present
			selectedComponents[group].push({ name, component });

			target.parentNode.classList.add('active');
			target.checked = true;
		} else {
			// Remove from selected components if already present
			selectedComponents[group].splice(index, 1);

			target.parentNode.classList.remove('active');
			target.checked = false;
		}

		selectedComponents = selectedComponents;
	}

	function isComponentSelected(group, name) {
		return selectedComponents[group]?.some(item => item.name === name) ?? false;
	}

	let searchTerm = "";

	function updateSearchTerm(event) {
		searchTerm = event.target.value.toLowerCase(); 
	}
</script>

<div class="list">
	<div class="search-experiment">
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
			<path d="M6.41667 11.0833C8.994 11.0833 11.0833 8.994 11.0833 6.41667C11.0833 3.83934 8.994 1.75 6.41667 1.75C3.83934 1.75 1.75 3.83934 1.75 6.41667C1.75 8.994 3.83934 11.0833 6.41667 11.0833Z" stroke="#88888A" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M6.41667 11.0833C8.994 11.0833 11.0833 8.994 11.0833 6.41667C11.0833 3.83934 8.994 1.75 6.41667 1.75C3.83934 1.75 1.75 3.83934 1.75 6.41667C1.75 8.994 3.83934 11.0833 6.41667 11.0833Z" stroke="black" stroke-opacity="0.2" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M12.2505 12.25L9.74219 9.7417" stroke="#88888A" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M12.2505 12.25L9.74219 9.7417" stroke="black" stroke-opacity="0.2" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		<input type="text" placeholder="Search" bind:value={searchTerm} on:input={updateSearchTerm}>
	</div>

	{#each components as componentGroup, _index}
		<div class="experiment-list" class:nonselectable={!componentGroup.selectable}>
			<span class="low-text">{componentGroup.name}</span>
			{#each componentGroup.variants as { name, component }}
			<label>
				<input 
					type="checkbox" 
					class="checkmark"
					disabled={!componentGroup.selectable} 
					checked={isComponentSelected(componentGroup.name, name)}
					on:change={(event) => handleCheckboxChange(componentGroup.name, name, component, event.target)}
				/>
				<span>{name}</span>

				<div class="info-redirect">
					<div class="tooltip-wrapper">
						<div class="tooltip-content">
							{#each componentGroup.on as url}
								<p>{url}</p>
							{/each}
						</div>
						<div>
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
								<g clip-path="url(#clip0_2774_6100)">
									<path d="M6.99935 12.8334C10.221 12.8334 12.8327 10.2217 12.8327 7.00008C12.8327 3.77842 10.221 1.16675 6.99935 1.16675C3.77769 1.16675 1.16602 3.77842 1.16602 7.00008C1.16602 10.2217 3.77769 12.8334 6.99935 12.8334Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M6.99935 12.8334C10.221 12.8334 12.8327 10.2217 12.8327 7.00008C12.8327 3.77842 10.221 1.16675 6.99935 1.16675C3.77769 1.16675 1.16602 3.77842 1.16602 7.00008C1.16602 10.2217 3.77769 12.8334 6.99935 12.8334Z" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M7 9.33333V7" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M7 9.33333V7" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M7 4.66681H7.00394" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M7 4.66681H7.00394" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
								</g>
								<defs>
									<clipPath id="clip0_2774_6100">
										<rect width="14" height="14" fill="white"/>
									</clipPath>
								</defs>
							</svg>
						</div>
					</div>
					{#each componentGroup.on as url}
						<a href="{url}" class="redirect-wrapper" target="_blank" rel="noopener noreferrer">
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
								<path d="M12.25 5.25001L12.25 1.75001M12.25 1.75001H8.74999M12.25 1.75001L7 7M5.83333 1.75H4.55C3.56991 1.75 3.07986 1.75 2.70552 1.94074C2.37623 2.10852 2.10852 2.37623 1.94074 2.70552C1.75 3.07986 1.75 3.56991 1.75 4.55V9.45C1.75 10.4301 1.75 10.9201 1.94074 11.2945C2.10852 11.6238 2.37623 11.8915 2.70552 12.0593C3.07986 12.25 3.56991 12.25 4.55 12.25H9.45C10.4301 12.25 10.9201 12.25 11.2945 12.0593C11.6238 11.8915 11.8915 11.6238 12.0593 11.2945C12.25 10.9201 12.25 10.4301 12.25 9.45V8.16667" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M12.25 5.25001L12.25 1.75001M12.25 1.75001H8.74999M12.25 1.75001L7 7M5.83333 1.75H4.55C3.56991 1.75 3.07986 1.75 2.70552 1.94074C2.37623 2.10852 2.10852 2.37623 1.94074 2.70552C1.75 3.07986 1.75 3.56991 1.75 4.55V9.45C1.75 10.4301 1.75 10.9201 1.94074 11.2945C2.10852 11.6238 2.37623 11.8915 2.70552 12.0593C3.07986 12.25 3.56991 12.25 4.55 12.25H9.45C10.4301 12.25 10.9201 12.25 11.2945 12.0593C11.6238 11.8915 11.8915 11.6238 12.0593 11.2945C12.25 10.9201 12.25 10.4301 12.25 9.45V8.16667" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</a>
					{/each}
				</div>
			</label>
			{/each}
		</div>
	{/each}
</div>

<style>
	.experiment-list {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.experiment-list > span {
		font-size: 1.2rem;
		color: #88888a;
		width: 100%;
		display: block;
		padding: 1.2rem 0 0.6rem 1rem;
		border-bottom: 0.1rem solid #212830;
	}

	.experiment-list label {
		display: flex;
		justify-content: space-between;
		position: relative;
		padding: 1.2rem 1rem 1.2rem 3.6rem;
		cursor: pointer;
	}

	:global(.experiment-list label.active) {
		transition: all 0.3s ease-in-out;
		background-color: #212830;
	}

	.experiment-list:not(.nonselectable) label:hover {
		transition: all 0.3s ease-in-out;
		background-color: #212830;
	}

	.list {
		transform: translateY(0);
	}

	.experiment-list label .checkmark {
		opacity: 1;
		position: absolute;
		top: auto;
		bottom: auto;
		background-color: #0D121A;
		border: .1rem solid #383C42;        
	}

	.experiment-list label .checkmark:after {
		opacity: 1;
		top: 0;
		left: 0;
		width: 1.4rem;
		height: 1.4rem;
		border: .1rem solid #383C42;
		border-radius: .6rem;

		background-repeat: no-repeat;
		background-position: center;
	}

	.checkmark:checked:after {
		background-image: url('/assets/icons/ic-check.svg');
	}

	.info-redirect {
		position: relative;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: .8rem;
		opacity: 0;

		transition: all .3s ease-in-out;
	}

	.info-redirect .redirect-wrapper {
		position: relative;
		z-index: 20;
	}

	.experiment-list label:hover .info-redirect,
	.experiment-list label.active .info-redirect {
		opacity: 1;
	}
	

	.search-experiment {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding-left:1rem;
		border-bottom: 0.1rem solid #383C42;
	}

	.search-experiment input {
		cursor: pointer;
		width: 100%;
		background-color: transparent;
		padding: 1.1rem 0 1.1rem .6rem;
		border-bottom: none;
		color: #FFF;

		font-size: 1.2rem;
	}

	.nonselectable label {
		opacity: .4;
		cursor: not-allowed;
	}
</style>

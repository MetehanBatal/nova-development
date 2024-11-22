<script>
	export let options;
	export let selectedSteps;

	let dropdownOpened = false;

	function removeStep(index) {
		selectedSteps = selectedSteps.filter((s, _i) => _i !== index);
	}

	function handleStepAddup() {
		dropdownOpened = !dropdownOpened;
	}
</script>

<div class="query-outer-box">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="query-bar" on:click={() => handleStepAddup()}>
		<p>
			Steps
		</p>

		<svg style={`transform: rotate(${dropdownOpened ? '-45deg' : '0deg'})`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M3.33398 8H12.6673" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M8 3.33325V12.6666" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>

		{#if dropdownOpened}
		<div class="dropdown">
			{#each options as option, _index}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="dropdown-option" class:optout={selectedSteps.includes(_index)} on:click={(e) => { selectedSteps.push(_index); selectedSteps = selectedSteps.sort((a, b) => a - b) }}>
				<div class="option-content">
					{#if option["icon"]}
						<img width="16" height="16" src={option['icon']} alt={option['name']}>
					{/if}	

					<p class="capitalized">{option['name']} View</p>
				</div>

				<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
			{/each}
		</div>
		{/if}
	</div>

	{#each options.filter((_, index) => selectedSteps.includes(index)) as option, _index}
	<div class="query-box">
		<div class="query">
			<p class="capitalized">
				<span class="step-count">{_index + 1}</span>

				{option.name} View
			</p>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<svg on:click={() => removeStep(_index)} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M10 2L2 10" stroke="#6E6D81" stroke-linecap="round" stroke-linejoin="round"></path>
				<path d="M2 2L10 10" stroke="#6E6D81" stroke-linecap="round" stroke-linejoin="round"></path>
			</svg>
		</div>
	</div>
	{/each}
</div>

<style>
	.query-outer-box {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.query-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;

		position: relative;

		width: 100%;
	}

	.query-box {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;

		width: 100%;

		padding: .8rem 1.2rem;

		border: .1rem solid rgba(33, 40, 48, 1);
		border-radius: .8rem;
	}

	.query-box svg {
		will-change: transform;

		transition: .24s ease-in-out;
		cursor: pointer;
	}

	.query {
		display: flex;
		justify-content: space-between;
		align-items: center;

		width: 100%;
	}

	.step-count {
		display: inline-flex;
		justify-content: center;
		align-items: center;

		width: 2.4rem;
		height: 2.4rem;

		font-size: 1.2rem;

		background: #212830;
		border-radius: 100%;

		margin-right: .4rem;
	}

	.dropdown {
		position: absolute;
		top: 100%;
		right: 0;

		width: max-content;

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

	.dropdown-option:not(.optout):hover {
		background-color: rgba(33, 40, 48, .4);
	}

	.dropdown-option.optout {
		color: #6d6d6d;

		cursor: not-allowed;
	}

	.dropdown-option svg {
		margin-left: auto;

		opacity: 0;
	}

	.option-content {
		display: flex;
		align-items: center;
		gap: .8rem;
	}

	.option-content p {
		white-space: nowrap;
	}
</style>
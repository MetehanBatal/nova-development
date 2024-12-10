<script>
	import { experiment } from '$stores/experiment';

	let selectedStatus = 'Draft';

	let statusHypothesis = [
		{
			name : "Draft",
			selected : true,
		},
		{
			name : "In-progress",
			selected : false,
		},
		{
			name : "Successful",
			selected : false,
		},
		{
			name : "Failed",
			selected : false,
		},
	];

	let progressBars = [
		{ sqSize: 146, percentage: 20, width: 146, height: 146},
		{ sqSize: 116, percentage: 20, width: 116, height: 116},
		{ sqSize: 86, percentage: 20, width: 86, height: 86},
	];

	function updateProgressBar(progressBar) {
		const radius = (progressBar.sqSize - 10) / 2;
		const dashArray = radius * Math.PI * 2;
		const dashOffset = dashArray - (dashArray * progressBar.percentage) / 100;

		progressBar.dashArray = dashArray;
		progressBar.dashOffset = dashOffset;
	}
</script>

<div class="experiment-details">
	<div class="experiment-detail-step hypothesis">
		<div class="step-item-wrapper">
			<p class="low-text">Hypothesis Name</p>
			<div class="input-holder">
				<input class="input" data-validation-item="hypothesis.name" bind:value={$experiment.hypothesis.name} placeholder="Boosting conversion rates" type="text"/><span></span>
			</div>
		</div>
		<div class="step-item-wrapper">
			<p class="low-text">Objective</p>
			<div class="input-holder experiment">
				<textarea data-validation-item="hypothesis.objective" bind:value={$experiment.hypothesis.objective} placeholder="What are the expectations?" cols="60"></textarea><span></span>
			</div>
		</div>

	</div>
</div>
<div class="experiment-details">
	<p class="low-text">Status of Hypothesis</p>
	<div class="experiment-detail-step type-select-step">
		<!-- on:click={() => { selectedStatus = option.name; option.selected = !option.selected}} -->
		{#each statusHypothesis as option}
			<div class="step-item-wrapper experiment-checkbox-wrapper" class:not-allowed={option.selected === false} class:active={selectedStatus === option.name} >
				<label class="experiment-checkbox">
					<span class="purple-checkmark"></span>
					<input type="checkbox" bind:checked={option.isChecked}>
					{option.name}
				</label>
			</div>          
		{/each}
	</div>
</div>
<div class="experiment-details">
	<div class="experiment-detail-step hypothesis">
		<div class="step-item-wrapper">
			<div class="priority-selection-wrapper">
				<div class="priorty-selections">
					<p>Priority</p>
					{#each Object.keys($experiment.hypothesis.priority) as item, priorityIndex}
					<div class={`priority-section ${item}`}>
						<p class="low-text capitalized">{item}</p>
						<div class="priority-selectors">
							{#each Array(5) as holder, _index}
								<div on:click={() => {$experiment['hypothesis']['priority'][item] = _index + 1; progressBars[priorityIndex]['percentage'] = ((_index + 1) * 20)}} class:selected={$experiment['hypothesis']['priority'][item] === _index + 1} class="priority-item">
									{_index + 1}
								</div>
							{/each}
						</div>
					</div>
				{/each}
				</div>
				<div class="priority-progress-bar-section">
					<div class="priority-progress-bar">
						<div class="progress-bars">
							{#each progressBars as progressBar (progressBar.sqSize)}
							<div class="progress-container">
								<div class="progress-bar" data-sq-size={progressBar.sqSize} data-percentage={progressBar.percentage}>
									<svg width={progressBar.width} height={progressBar.height}>
										<circle class="circle-background" cx={progressBar.sqSize / 2} cy={progressBar.sqSize / 2} r={(progressBar.sqSize - 10) / 2} stroke-width="7"></circle>
										<circle class="circle-progress" cx={progressBar.sqSize / 2} cy={progressBar.sqSize / 2} r={(progressBar.sqSize - 10) / 2} stroke-width="7" transform="rotate(-90 {progressBar.sqSize / 2} {progressBar.sqSize / 2})"
											style={`stroke-dasharray: ${2 * Math.PI * ((progressBar.sqSize - 10) / 2)}; stroke-dashoffset: ${2 * Math.PI * ((progressBar.sqSize - 10) / 2) * (1 - progressBar.percentage / 100)};`}></circle>
									</svg>
								</div>
							</div>
							{/each}
							<div class="percentage-title">
								<p>{(parseInt(Object.values($experiment.hypothesis.priority).reduce((acc, obj) => acc + (obj * 20), 0)) / 3).toFixed(2)}%</p>
							</div>
						</div>                           
					</div>
					<div class="progress-description">
						{#each Object.keys($experiment.hypothesis.priority) as item}
						<div class="progress-item">
							<div class={`small-bg ${item}`}></div>
							<div class="item-name">{item} • {$experiment.hypothesis.priority[item] * 20}%</div>
						</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- <div class="experiment-details">
	<div class="step-item-wrapper">
		<div class="experiment-detail-step flex-column-start summary">
			<label for="summary" class="low-text">Summary</label>
			<textarea name="summary" id="" cols="60" rows="10"></textarea>
		</div>
	</div>
</div> -->

<style>
	.priorty-selections {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		gap: 1.6rem;
	}

	.priority-section {
		padding: 1.6rem;

		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: .8rem;

		border: .1rem solid #212830;
		border-radius: .8rem;
	}

	.priority-selectors {
		display: flex;
		align-items: center;
		gap: .8rem
	}

	.priority-item {
		cursor: pointer;
		font-size: 1.4rem;

		padding: .8rem 1.55rem;

		border: .1rem solid #212830;
		border-radius: .8rem;
		transition:all .3s ease-in-out;
	}

	.priority-item.selected {
		border-color: #947AF0;
	}

	.progress-bars .progress-container:nth-child(3) .circle-progress {
		stroke: #0CB47F;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.progress-bars .progress-container:nth-child(2) .circle-progress {
		stroke: #F37361;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.progress-bars .progress-container:nth-child(1) .circle-progress {
		stroke: #AA96F3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.priority-selection-wrapper {
		display: flex;
		align-items: center;
	}
	.progress-bars {
		position: relative;
		position: relative;
		transform: translate(50%, 0%);
		min-width: 30rem;
		/* min-height: 300px; */
		display: flex;
	}

	.progress-container {
		display: inline-block;
		position: relative;
	}

	.progress-bar {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
	}

	.progress-bars svg {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		transition: all .3s ease-in-out;
	}

	.progress-bars svg > circle {
		transition: all .3s ease-in-out;
	}

	.percentage-title {
		position: absolute;
		top: 0;
		left: 0;
		transform: translate(-50%, -50%);
		font-size: 1.8rem;
		line-height: 2.2rem;
		font-weight: 500;
	}

	.progress-description {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		transform: translateY(150%);
		gap: .8rem;
	}

	.progress-item  {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		color: #88888A;
	}

	.small-bg {
		width: .8rem;
		height: .8rem;
		margin-right: 1rem;
	}

	.progress-description .potential {
		background-color: #AA96F3;
	}

	.progress-description .ease {
		background-color: #0CB47F;
	}

	.progress-description .importance {
		background-color: #F37361;
	}

	.priority-progress-bar-section {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	input, textarea {
		color: #FFF;
	}

	textarea {
		background-color: #0D121A;
		border: .1rem solid #212830;
	}

	.summary {
		gap: .6rem;
	}

	:global(.not-allowed) {
		opacity: .75;
	}
	:global(.not-allowed input) {
		cursor: not-allowed !important;
	}
</style>
<script>
	import { onMount } from "svelte";
	import { page } from '$app/stores';
	import { browser } from "$app/environment";
	
	export let isActive;
	export let dropdownRef;

	const logs = $page.data.experimentRes.data[0].logs;

	function formatDate(timestamp) {
		const date = new Date(timestamp);
		const day = date.getDate();
		const month = date.getMonth() + 1; // Months are 0-indexed
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
	}

	// Grouping logs by day
	const groupedLogs = logs.reduce((acc, log) => {
		const formattedDate = formatDate(log.timestamp);
		if (!acc[formattedDate]) {
		    acc[formattedDate] = [];
		}
		acc[formattedDate].push(log);
		return acc;
	}, {});

	onMount(() => {
		if (browser) {
			document.addEventListener("click", (event) => {
				if (dropdownRef && !dropdownRef.contains(event.target)) {
					isActive = false;
				}
			});
		}
	});
</script>

<div class="wrapper">
	<div class="type-item-wrapper">
		<p>Latest Activity</p>
	</div>

	{#each Object.keys(groupedLogs) as date, _index}
	<div class="type-timeline-wrapper">
		<div class="type-timeline-date">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path d="M2 8C2 9.18669 2.35189 10.3467 3.01118 11.3334C3.67047 12.3201 4.60754 13.0892 5.7039 13.5433C6.80026 13.9974 8.00666 14.1162 9.17054 13.8847C10.3344 13.6532 11.4035 13.0818 12.2426 12.2426C13.0818 11.4035 13.6532 10.3344 13.8847 9.17054C14.1162 8.00666 13.9974 6.80026 13.5433 5.7039C13.0892 4.60754 12.3201 3.67047 11.3334 3.01118C10.3467 2.35189 9.18669 2 8 2C6.32263 2.00631 4.71265 2.66082 3.50667 3.82667L2 5.33333" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M2 8C2 9.18669 2.35189 10.3467 3.01118 11.3334C3.67047 12.3201 4.60754 13.0892 5.7039 13.5433C6.80026 13.9974 8.00666 14.1162 9.17054 13.8847C10.3344 13.6532 11.4035 13.0818 12.2426 12.2426C13.0818 11.4035 13.6532 10.3344 13.8847 9.17054C14.1162 8.00666 13.9974 6.80026 13.5433 5.7039C13.0892 4.60754 12.3201 3.67047 11.3334 3.01118C10.3467 2.35189 9.18669 2 8 2C6.32263 2.00631 4.71265 2.66082 3.50667 3.82667L2 5.33333" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M2 2V5.33333H5.33333" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M2 2V5.33333H5.33333" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M8 4.66675V8.00008L10.6667 9.33341" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M8 4.66675V8.00008L10.6667 9.33341" stroke="black" stroke-opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
			<p>
				{date}
			</p>
		</div>
		{#each groupedLogs[date] as log, __index}
		<div class="type-timeline-content">
			<div class="type-timeline-content-item">
				<!-- const amOrPm = hours >= 12 ? 'PM' : 'AM'; -->
				<!-- const formattedHours = hours % 12 || 12; -->
				<p>{`${new Date(log.timestamp).getHours()}:${new Date(log.timestamp).getMinutes()}`}</p>
				<div>
					<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
						<circle cx="3" cy="3" r="3" fill="#0CB47F"/>
					</svg>
					<p>
						{@html log.action}
					</p>
				</div>
			</div>
		</div>
		{/each}
	</div>
	{/each}
</div>

<style>
	.wrapper {
		padding: 3.2rem;
	}

	.type-item-wrapper {
		display: flex;
		align-items: center;
		gap: 3.2rem;
		border-bottom: .1rem solid #212830;
		padding-bottom: 2.4rem;
	}

	.type-item-wrapper > p {
		font-size: 1.6rem;
	}

	.type-timeline-wrapper {
		padding-block: 4rem;
		border-bottom: .1rem solid #212830;
	}
	
	.type-timeline-wrapper:last-child {
		border: none;
	}

	.type-timeline-date {
		position: relative;

		display: flex;
		align-items: center;
		gap: .8rem;

		margin-bottom: .8rem;
	}

	.type-timeline-date::before {
		content: "";
		position: absolute;
		left: 0;
		bottom: 0;
		height: 2.7rem;
		background-color: #383C42;
		width: 1px;
		transform: translateY(4.1rem);
	}



	.type-timeline-content {
		padding-top: 3.3rem;
		position: relative;
	}

	.type-timeline-content p {
		color: #88888A;
	}

	.type-timeline-content::before {
		content: "";
		position: absolute;
		left: 0;
		bottom: 1.9;
		width: 2.5rem;
		background-image: url("/assets/icons/timeline.svg");
		height: 2rem;
	}

	.type-timeline-content-item {
		display: flex;
		border-left: .1rem solid #383C42;
		align-items: center;
		padding-left: 4rem;
		gap: 1.2rem;
		position: relative;
		
	}

	.type-timeline-content-item::before {
		content: "";
		position: absolute;
		left: 0;
		background-color: #383C42;
		height: 3.8rem;
		width: 0.1rem;
		transform: translate(-1px, 40px);
	}

	.type-timeline-wrapper .type-timeline-content:last-child .type-timeline-content-item {
		border-left: 0;
	}
	.type-timeline-wrapper .type-timeline-content:last-child .type-timeline-content-item::before {
		display: none;
	}
	.type-timeline-content-item > div {
		padding: 1.2rem 1.4rem;
		width: 100%;
		max-width: 56rem;
		border: .1rem solid #212830;
		background-color: #0D121A;
		border-radius: .8rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.type-timeline-date p {
		color: #88888A;
	}

</style>
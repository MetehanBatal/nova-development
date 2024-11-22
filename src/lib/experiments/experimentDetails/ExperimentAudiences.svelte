<script>
	import { page } from '$app/stores';

	export let selectedAudience;
	export let audiencesVisible;
</script>

<div class="config-outer-box">
	<span class="muted">Audiences</span>

	<div class="config-holder">
		<div class="config-box">
			<p>100%</p>	

			<div class="buttons">
				<div class="increment">
					<svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M1 3.78613L4 0.786133L7 3.78613" stroke="#575758" stroke-width="0.857143" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</div>

				<div class="decrement">
					<svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M1 1.35645L4 4.35645L7 1.35645" stroke="white" stroke-width="0.857143" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</div>
			</div>
		</div>

		<div class="config-box lg" on:click={(e) => {audiencesVisible = !audiencesVisible}}>

			<p class="capitalized">{$page.data?.experimentRes?.data[0]?.audiences[0]?.name.length > 0 ? $page.data?.experimentRes?.data[0].audiences[0].name : 'All Visitors'}</p>

			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g clip-path="url(#clip0_189_6584)">
					<path d="M11.332 2.0001C11.5018 1.79946 11.7118 1.63614 11.9487 1.52055C12.1856 1.40497 12.4441 1.33966 12.7078 1.32878C12.9715 1.31789 13.2346 1.36169 13.4803 1.45736C13.726 1.55303 13.9489 1.69848 14.1349 1.88445C14.3209 2.07041 14.4658 2.29281 14.5604 2.53746C14.655 2.78211 14.6973 3.04366 14.6844 3.30542C14.6716 3.56718 14.604 3.82342 14.486 4.05781C14.3679 4.2922 14.2019 4.49959 13.9987 4.66677L4.9987 13.6668L1.33203 14.6668L2.33203 11.0001L11.332 2.0001Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M10 3.3335L12.6667 6.00016" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				</g>
				<defs>
				<clipPath id="clip0_189_6584">
					<rect width="16" height="16" fill="white"/>
				</clipPath>
				</defs>
			</svg>
		</div>
	</div>
</div>

<style>
	.config-outer-box {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
	}

	.config-holder {
		display: flex;
		gap: 4.8rem;
	}

	.config-holder .config-box:first-child {
		position: relative;
	}

	.config-holder .config-box:first-child:after {
		position: absolute;
		bottom: 2.15rem;
		left: 100%;

		width: 4.8rem;
		height: .1rem;

		content: '';

		background-color: #383C42;
	}

	.config-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1.2rem;

		background-color: #0D121A;
		border: .1rem solid #212830;
		border-radius: .8rem;

		padding: 1.2rem 1.4rem;

		cursor: pointer;
	}

	.config-box.lg {
		min-width: 20rem;
	}
/*
	.config-box > div {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 3.2rem;
		height: 3.2rem;

		border-radius: .3rem;

		transition: all .24s ease-in-out;

		cursor: pointer;
	}
*/

	.config-box:hover svg path {
		stroke: #fff;
	}

	.config-box img {
		width: 1.6rem;
	}

	.buttons {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 0;

		height: 100%;
	}

	.buttons div {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
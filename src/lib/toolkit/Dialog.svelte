<script>
	export let data;
	export let dialogResponse;
	export let dialogModal;
</script>

<div class="dialog-box">
	
	<div class="dialog">
		<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" on:click={(e) => { dialogResponse = 'declined'; dialogModal = false;}}>
			<path d="M10 2L2 10" stroke="#6E6D81" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M2 2L10 10" stroke="#6E6D81" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>

		<div class="blurred-shape"></div>
		<div class="blurred-shape ii"></div>

		<div class="icon-box">
			<img width="36" height="36" src={data.icon} alt="Dialog Icon" />
		</div>

		<h3>{@html data.title}</h3>
		{#if data.content}
			<p class="dialog-content">{@html data.content}</p>
		{/if}

		<div class="buttons">
			<div class="cta-button secondary" on:click={(e) => { dialogResponse = 'declined'; dialogModal = false;}}>{data.declineText}</div>
			<div class="cta-button primary" on:click={(e) => { dialogResponse = 'confirmed'; dialogModal = false; }}>{data.confirmText}</div>
		</div>
	</div>
</div>

<style>
	.dialog-box {
		display: flex;
		justify-content: center;
		align-items: center;

		position: fixed;
		top: 0;
		left: 0;

		width: 100vw;
		height: 100vh;

		background-color: rgba( 6, 11, 19, .8);

		z-index: 99999;
	}

	.dialog {
		display: flex;
		flex-direction: column;
		align-items: center;

		position: relative;

		padding: 3.2rem 6rem;

		max-width: 42rem;
			width: 92%;

		background-color: #0D121A;
		border-radius: 1.6rem;

		overflow: hidden;
	}

	.blurred-shape {
		position: absolute;
		top: 0;
		right: 0;

		width: 20rem;
		height: 11rem;

		background-color: rgba(148, 122, 240, .72);
		border-radius: 100%;

		filter: blur(6.4rem);

		transform: translate3d(-1.6rem, calc(1.6rem - 100%), 0);
	}

	.blurred-shape.ii {
		background-color: rgba(148, 122, 240, .32);

		transform: translate3d(calc(100% - 4.8rem), -2.4rem, 0);
	}

	.icon-box {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 7.2rem;
		height: 7.2rem;

		background: rgba(255, 255, 255, 0.04);
		border: .1rem solid rgba(255, 255, 255, 0.02);
		border-radius: 100%;
	}

	h3 {
		font-size: 2.2rem;
		line-break: 2.4rem;
		text-align: center;

		margin-top: 2.4rem;
/*		margin-bottom: 1.6rem;*/
	}

	p {
		font-size: 1.6rem;
		line-height: 1.4;
		text-align: center;

		color: var(--fontColor-secondary);
	}

	p > a {
		color: var(--fontColor-secondary);

		text-decoration: underline;
	}

	.buttons {
		margin-top: 3.6rem;
	}

	.cta-button.primary {
		padding: 1rem 2rem;
		white-space: pre;
	}

	.dialog-content {
		margin-block: 1rem;
	}

	.dialog-box svg {
		position: absolute;
		right: 2rem;
		top: 2rem;

		z-index: 100;
		cursor: pointer;
	}

	.dialog-box svg path {
		transition: all .3s ease-in-out;
	}

	.dialog-box svg:hover path {
		stroke: #FFF;
	}
</style>
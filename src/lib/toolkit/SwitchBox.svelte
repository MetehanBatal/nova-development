<script>
	export let title;
	export let fullWidth;
	export let status;

	console.log(status);

	function handleSwitch() {
		status = status === true ? false : true;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class={`outer-box ${fullWidth ? 'fullWidth' : ''}`} class:checked={status} on:click={() => {handleSwitch()}}>
	<div class="switch-box">
		<span></span>
	</div>

	<p>{title}</p>
</div>

<style scoped>
	.outer-box {
		display: flex;
		align-items: center;
		gap: .8rem;
	}

	.outer-box.fullWidth {
		justify-content: space-between;

		width: 100%;
	}

	.outer-box.fullWidth .switch-box {
		order: 1;
	}

	.switch-box {
		position: relative;

		width: 3.6rem;
		height: 2rem;

		background-color: #383C42;
		border: .1rem solid #383C42;
		border-radius: 12rem;

		transition: all .24s ease-in-out;

		cursor: pointer;
	}

	span {
		position: absolute;
		top: 50%;
		left: 0%;

		width: 1.6rem;
		height: 1.6rem;

		background-color: #FFFFFF;
		border-radius: 100%;

		transform: translate3d(.2rem, -50%, 0);

		transition: transform .24s ease-in-out;
		will-change: transform;
	}

	p {
		color: var(--fontColor-secondary);

		transition: color .24s ease-in-out;
		will-change: color;
	}

	.checked p {
		color: var(--fontColor-primary);
	}

	.checked span {
		transform: translate3d(1.6rem, -50%, 0);
	}

	.checked .switch-box {
		background-color: var(--color-purple);
	}

/*	#484C51*/
</style>
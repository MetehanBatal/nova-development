<script>
	import { onMount, onDestroy } from 'svelte';
	import { toastMessage } from '../../stores/toast';
  
	export let type;
	export let content;

	let countdown = 5;
	let timer;

	const startTimer = () => {
		timer = setInterval(() => {
			countdown--;
			
			if (countdown === 0) {
				clearInterval(timer);

				$toastMessage.type = '';
				$toastMessage.content = '';
			}
	  	}, 1000);
	};
	
	onMount(() => {
		startTimer();
	});
  
	onDestroy(() => {
		clearInterval(timer);
	});
  </script>



<div class="toast-message-wrapper">
	<div class="toast-message">

		<div class="toast-icon-wrapper">
			<img src="/assets/icons/toast/{type}.svg" alt="toast-icon">
		</div>
	
		<div class="toast-content">
			<div class="bg-light {type}"></div>
			<p class="text-capitalize">{type}</p>
			<p>{content}</p>
		</div>     
		<div class="close-icon" on:click={() => closeToast()} >
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M13.3333 2.66667L2.66663 13.3333" stroke="#6E6D81" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M2.66663 2.66667L13.3333 13.3333" stroke="#6E6D81" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</div>
		<div class="toast-message-progress">
			<div class="toast-message-fill"></div>
		</div>
	</div>
</div>



<style>

	.bg-light.success {
		background-color: rgba(12, 180, 127, 64%);
	}
	.bg-light.error {
		background-color: rgba(243, 115, 97, 64%);
	}
	.bg-light.warning {
		background-color: rgba(243, 220, 97, 64%);
	}
	.bg-light.info {
		background-color: rgba(148, 122, 240, 64%);
	}

	:global(.hide) {
		opacity: 0;
		transition: opacity 0.5s ease;
	}

	.text-capitalize {
		font-weight: 500;
		text-transform: capitalize;
	}

	.toast-message-wrapper {
		position: fixed;
		top: 8rem;
		right: 3rem;

		z-index: 100;
	}

	.toast-message {
		position: relative;
		width: 40rem;
		display: flex;
		align-items: center;
		gap: 1.6rem;

		padding: 1.2rem 1.6rem 1.7rem 1.2rem;

		background-color: rgba(6, 11, 19, 1);

		border: .1rem solid rgba(33, 40, 48, 1);

		border-radius: 1.6rem;

		overflow: hidden;
	}

	.toast-content {
		position: relative;
		z-index: 2;
	}

	.toast-content p:last-child {
		font-size: 1.2rem;
	}

	.toast-icon-wrapper {
		width: 4.8rem;
		height: 4.8rem;

		position: relative;
		z-index: 3;

		display: flex;
		align-items: center;
		justify-content: center;

		background-color: rgba(255, 255, 255, 0.04);

		border-radius: 50%;
	}

	.toast-icon-wrapper img {
		width: 2.4rem;
		height: 2.4rem;
	}

	.close-icon {
		width: 1.6rem;
		height: 1.6rem;
		display: flex;
		margin-left: auto;

		position: relative;

		z-index: 100;
		cursor: pointer;
	}

	.close-icon svg path {
		transition: all .3s ease-in-out;
	}

	.close-icon:hover svg path  {
		stroke: #FFFFFF;
	}

	.bg-light {
		position: absolute;
		left: -18.8rem;
		top:-5.2rem;

		width: 31.9rem;
		height: 11rem;

		filter: blur(10rem);

		z-index: 1;
	}

	.toast-message-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		height: .3rem;
		width: 100%;
		background-color: #FFFFFF;
	}

	.toast-message-fill {
		width: 100%;
		height: 1.5rem;

		position: absolute;
		right: 0;
		top: 0;

		background-color: rgba(148, 122, 240, 1);

		transition: all .3s ease-in-out;

		animation: fill-out 5s ease-in-out forwards;
	}


	@keyframes fill-out {
		0% {
			width: 100%;
		}
		100% {
			width: 0;
		}
	}



	

</style>

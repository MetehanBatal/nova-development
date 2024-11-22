<script>
	import { goto } from '$app/navigation';

	export let data;

	const isEmailValid = (email) => {
  		return email.match(
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
	};
	
	const validationFailed = data.email === 'validationfailed' || !isEmailValid(data.email) ? true : false;
	let passwordChanged = false;
	let passwordEl;
	let passwordReEl;
	let passwordType = 'password';
	let isPasswordsMatching = true;
	let secondsRemaining = 10;

	function ctaHandler() {
		if (passwordEl.value !== passwordReEl.value) {
			isPasswordsMatching = false;

			return;
		}

		if (validationFailed) {
			return;
		}

		var apiHeaders = new Headers();
			apiHeaders.append("Content-Type", "application/x-www-form-urlencoded");

		var urlencoded = new URLSearchParams();
			urlencoded.append("emailAddress", data.email);
			urlencoded.append("password", passwordEl.value);

		var requestOptions = {
			method: 'POST',
			headers: apiHeaders,
			body: urlencoded,
			redirect: 'follow'
		};

		fetch("https://mve.novus.studio/prod/users/createPassword", requestOptions)
			.then(response => response.json())
			.then((result) => {
				if (result.msg === 'success') {
					let redirectionInterval = setInterval(() => {
						secondsRemaining = secondsRemaining - 1;

						if (secondsRemaining === 0) {
							clearInterval(redirectionInterval);
							goto('/login');
						}
					}, 1000)
					passwordChanged = true; }
			})
			.catch(error => console.error('error', error));
	}
</script>

<div class="login-wrapper">
	<div class="login-box">
	{#if !passwordChanged}
		<div class="logo">
			<img src="assets/icons/company-logo.svg" alt="">
		</div>

		<p class="login-title">Change password</p>

		{#if validationFailed}
		<p class="error-message">You don't have a valid token. If you would like to reset your password, go back to the <a href="/login">login page</a>.</p>
		{/if}

		<div class="login-holder">
			<input bind:this={passwordEl} type={passwordType} readonly={validationFailed} class="login-input password" placeholder="Enter your password">
			<div class="blinking" on:click={() => passwordType = passwordType === 'text' ? 'password' : 'text'}>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
					<path d="M7.40948 7.41016C7.18842 7.61614 7.01112 7.86454 6.88814 8.14054C6.76517 8.41654 6.69904 8.71448 6.69371 9.01659C6.68838 9.3187 6.74395 9.61878 6.85712 9.89895C6.97028 10.1791 7.13871 10.4336 7.35237 10.6473C7.56603 10.8609 7.82053 11.0294 8.10069 11.1425C8.38086 11.2557 8.68094 11.3113 8.98305 11.3059C9.28516 11.3006 9.5831 11.2345 9.8591 11.1115C10.1351 10.9885 10.3835 10.8112 10.5895 10.5902" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M8.04688 3.81C8.36286 3.77063 8.68095 3.75059 8.99938 3.75C14.2494 3.75 16.4994 9 16.4994 9C16.1641 9.71784 15.7435 10.3927 15.2469 11.01" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M4.9575 4.95703C3.46594 5.973 2.2724 7.36848 1.5 8.99953C1.5 8.99953 3.75 14.2495 9 14.2495C10.4369 14.2534 11.8431 13.8334 13.0425 13.042" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M1.5 1.5L16.5 16.5" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
		</div>
		<div class="login-holder">
			<input bind:this={passwordReEl} type={passwordType} readonly={validationFailed} class="login-input password" placeholder="Re-enter new password">
			<div class="blinking" on:click={() => passwordType = passwordType === 'text' ? 'password' : 'text'}>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
					<path d="M7.40948 7.41016C7.18842 7.61614 7.01112 7.86454 6.88814 8.14054C6.76517 8.41654 6.69904 8.71448 6.69371 9.01659C6.68838 9.3187 6.74395 9.61878 6.85712 9.89895C6.97028 10.1791 7.13871 10.4336 7.35237 10.6473C7.56603 10.8609 7.82053 11.0294 8.10069 11.1425C8.38086 11.2557 8.68094 11.3113 8.98305 11.3059C9.28516 11.3006 9.5831 11.2345 9.8591 11.1115C10.1351 10.9885 10.3835 10.8112 10.5895 10.5902" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M8.04688 3.81C8.36286 3.77063 8.68095 3.75059 8.99938 3.75C14.2494 3.75 16.4994 9 16.4994 9C16.1641 9.71784 15.7435 10.3927 15.2469 11.01" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M4.9575 4.95703C3.46594 5.973 2.2724 7.36848 1.5 8.99953C1.5 8.99953 3.75 14.2495 9 14.2495C10.4369 14.2534 11.8431 13.8334 13.0425 13.042" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M1.5 1.5L16.5 16.5" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
		</div>

		{#if !isPasswordsMatching}
		<p class="error-message">Please make sure you re-typed your password correctly.</p>
		{/if}

		<div class="cta-button primary" on:click={() => ctaHandler()}>
			Change Password
		</div>
	{:else}
		<div class="checked-bg">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path d="M22 11.0799V11.9999C21.9988 14.1563 21.3005 16.2545 20.0093 17.9817C18.7182 19.7088 16.9033 20.9723 14.8354 21.5838C12.7674 22.1952 10.5573 22.1218 8.53447 21.3744C6.51168 20.6271 4.78465 19.246 3.61096 17.4369C2.43727 15.6279 1.87979 13.4879 2.02168 11.3362C2.16356 9.18443 2.99721 7.13619 4.39828 5.49694C5.79935 3.85768 7.69279 2.71525 9.79619 2.24001C11.8996 1.76477 14.1003 1.9822 16.07 2.85986" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M9 11L12 14L22 4" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</div>
		<p class="forgot-title">
			Your password has been changed successfully.
		</p>
		<p class="forgot-subtitle">
			You will be redirected to the login page automatically in {secondsRemaining} seconds.
		</p>

		<div class="cta-button secondary return-button" on:click={() => goto('/login')}>Back to login page</div>
	{/if}
	</div>
</div>

<style scoped>
	.login-wrapper {
		position: relative;
		width: 100vw;
		height: 100vh;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.login-wrapper::before {
		content: "";
		width: 1003px;
		height: 174px;
		flex-shrink: 0;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		border-radius: 1003px;
		background: #947AF0;
		opacity: .50;
		filter: blur(375px);
	}

	:global(.hidden) {
		display: none !important;
	}

	.login-box {
		width: 100%;
		max-width: 40rem;

		border-radius: 1.6rem;
		border: .1rem solid rgba(255, 255, 255, 0.08);

		background: rgba(255, 255, 255, 0.02);

		padding: 4rem;

		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
	}

	.login-title {
		margin-block: 2.7rem;
		font-size: 2.2rem;
	}

	.login-holder {
		position: relative;
		width: 100%;
		margin-bottom: 1.6rem;
	}

	.login-input {
		width: 100%;
		max-width: 32rem;
		background-color: #0D121A;
		color: #FFF;

		padding: 1.4rem;
		border: .1rem solid #212830;
		border-radius: .8rem;
	}

	.blinking {
		cursor: pointer;
		position: absolute;
		top: 1.4rem;
		right: 1.4rem;
	}

	.forgot {
		cursor: pointer;
		width: 100%;
		color: #88888A;
		font-size: 1.2rem;
		text-align: right;
	}


	.checked-bg {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-inline: auto;
		width: 5.6rem;
		height: 5.6rem;

		border-radius: 50%;
		background-color:rgba(255, 255, 255, 0.04);
	}


	.forgot-title {
		font-size: 2.2rem;
		line-height: normal;
		text-align: center;
		margin-top: 2.7rem;
	}


	.forgot-subtitle {
		margin-top: 1.8rem;
		font-size: 1.4rem;
		line-height: 1.8rem;
		color: #88888A;
		text-align: center;

		margin-inline: auto;

		margin: 1.8rem auto 2.7rem auto;
	}

	.return-button {
		margin-inline: auto;
	}

	.login-box .cta-button {
		margin-top: 1.5rem;
	}

	:global(.sidebar),
	:global(.user-navbar-wrapper) {
		display: none!important;
	}

	:global(main) {
		padding-top: 0!important;
	}


	
</style>

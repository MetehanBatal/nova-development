<script>
	import { goto } from '$app/navigation';
	import { user } from '$stores/user';
	import { toastMessage } from '$stores/toast';

	import Cookies from 'js-cookie';

	export let data;
	const signUpValidationExpired = data.signUpStatus === 'validationfailed' ? true : false;
	let errorMessage = signUpValidationExpired ? 'Your invitation is expired. Please contact with the account admin.' : '';

	const isEmailValid = (email) => {
  		return email.match(
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
	};

	const eligibleForSignUp = !signUpValidationExpired && data.signUpStatus && isEmailValid(data.signUpStatus) ? true : false;

	let forgottenPassword = false;
	let instructionsSent = false;
	let passwordType = 'password';
	let emailAddress = eligibleForSignUp ? data.signUpStatus : '';
	let passwordElement;

	const spinner = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

	let buttonContent = !forgottenPassword ? !data.signUpStatus ? 'Log In' : 'Sign Up' : 'Send Instructions';

	function ctaHandler() {
		buttonContent = spinner;

		let fetchEndpoint = forgottenPassword ?  '/resetPassword' : '/login';

		if (eligibleForSignUp) {
			fetchEndpoint = '/createPassword';
		}
		var apiHeaders = new Headers();
			// apiHeaders.append("x-mve", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbEFkZHJlc3MiOiJvYWtpbm9ndW5kZWppQGdtYWlsLmNvbSIsImlhdCI6MTcwODY4Njk2MSwiZXhwIjoxNzA4NzczMzYxfQ.pbKIokpX5i-UubG1ZHiBrugGohpFzLEEO8WmHt7DaEQ');
			apiHeaders.append("Content-Type", "application/x-www-form-urlencoded");

		var urlencoded = new URLSearchParams();
			urlencoded.append('emailAddress', emailAddress);
		if (!forgottenPassword) {
			if (!isEmailValid(emailAddress) || passwordElement.value.length < 3) {
				errorMessage = 'Please check your details.';
				return; 
			}

			urlencoded.append('password', passwordElement.value);
		}

		var requestOptions = {
			method: 'POST',
			headers: apiHeaders,
			body: urlencoded,
			redirect: 'follow'
		};

		fetch(`https://mve.novus.studio/prod/users${fetchEndpoint}`, requestOptions)
			.then(response => response.json())
			.then((result) => {
				if (result.msg && forgottenPassword) {
					instructionsSent = true;
					return;
				}
				buttonContent = "Log In";
				if (result.msg && eligibleForSignUp && result.msg === 'success') {
					if (result.err && result.err.length > 0) {
						$toastMessage.type = "error";
						$toastMessage.content = 'Something went wrong while creating account.'				
					} else {
						$toastMessage.type = "success";
						$toastMessage.content = "Account created.";				
					}

					Cookies.set('novaUser', JSON.stringify({
						firstName: '',
						lastName: '',
						emailAddress: emailAddress,
						role: '',
						phone: '',
						country: '',
						thumbnail: '',
						notifications: []
					}));

					setTimeout(() => {
						$toastMessage.type = "";
						$toastMessage.content = "";		
					},5000) 

					goto('/dashboard?signup=true');

					return;
				}
				
				if (result.msg && result.msg === 'invalid password') {
					errorMessage = "We couldn't find an account matching with provided email/password." 
				};

				if (result.msg && result.msg === 'success') {

					fetch(`https://mve.novus.studio/prod/users/view?emailAddress=${emailAddress}`, { method: 'GET', redirect: 'follow'})
						.then(response => response.json())
  						.then(result => {
  							result = result.msg;

							$toastMessage.type = "success";
							$toastMessage.content = "Logged in successfully.";
  							
  							Cookies.set('novaUser', JSON.stringify(result));

							$user.notifications.push('Logged in');

  							for (const key in $user) {
								if (result.hasOwnProperty(key)) {
									$user[key] = result[key];
								}
							}
  							
  							const redirectionAddress = result.firstName.length > 2 ? '/dashboard' : '/dashboard?signup=true';
  							goto(redirectionAddress);
  						})
  						.catch(error => console.error('error', error));

					return;
				}
				if (result.msg && result.msg === 'invalid password') {
					errorMessage = "Your email and password doesn't match. If you forgotten your password click the Forgot Password button below.";
				}

				buttonContent = !forgottenPassword ? !data.signUpStatus ? 'Log In' : 'Sign Up' : 'Send Instructions';
			})
			.catch(error => console.error('error', error));
	}
</script>


<div class="login-wrapper">
	<div class="login-box">
		{#if !instructionsSent}
			<div class="logo">
				<img src="/assets/icons/company-logo.svg" width="60" height="60" alt="">
			</div>

			<p class="login-title">
				{#if !forgottenPassword}
					{#if !data.signUpStatus}
					Login
					{:else}
					Set up your password
					{/if}
				{:else}
				Restore Password
				{/if}
			</p>

			{#if errorMessage.length > 0}
			<p class="error-message">{errorMessage}</p>
			{/if}

			<div class="login-holder">
				<input bind:value={emailAddress} type="email" readonly={eligibleForSignUp} class="login-input" placeholder="Enter your email address" required>
			</div>

			{#if !forgottenPassword}
			<div class="login-holder">
				<input bind:this={passwordElement} type={passwordType} class="login-input password" placeholder="Enter your password">
				
				<div class="blinking" on:click={() => passwordType = passwordType === 'text' ? 'password' : 'text'} >
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
						<path d="M7.40948 7.41016C7.18842 7.61614 7.01112 7.86454 6.88814 8.14054C6.76517 8.41654 6.69904 8.71448 6.69371 9.01659C6.68838 9.3187 6.74395 9.61878 6.85712 9.89895C6.97028 10.1791 7.13871 10.4336 7.35237 10.6473C7.56603 10.8609 7.82053 11.0294 8.10069 11.1425C8.38086 11.2557 8.68094 11.3113 8.98305 11.3059C9.28516 11.3006 9.5831 11.2345 9.8591 11.1115C10.1351 10.9885 10.3835 10.8112 10.5895 10.5902" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M8.04688 3.81C8.36286 3.77063 8.68095 3.75059 8.99938 3.75C14.2494 3.75 16.4994 9 16.4994 9C16.1641 9.71784 15.7435 10.3927 15.2469 11.01" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M4.9575 4.95703C3.46594 5.973 2.2724 7.36848 1.5 8.99953C1.5 8.99953 3.75 14.2495 9 14.2495C10.4369 14.2534 11.8431 13.8334 13.0425 13.042" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M1.5 1.5L16.5 16.5" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</div>
			</div>
			{/if}

			{#if !forgottenPassword && !eligibleForSignUp}
			<div class="forgot" on:click={() => forgottenPassword = true}>
				Forgot password?
			</div>
			{/if}

			<div class="cta-button primary" on:click={() => ctaHandler()}>
				{@html buttonContent}
			</div>
		{:else}
			<div class="checked-bg">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path d="M22 11.0799V11.9999C21.9988 14.1563 21.3005 16.2545 20.0093 17.9817C18.7182 19.7088 16.9033 20.9723 14.8354 21.5838C12.7674 22.1952 10.5573 22.1218 8.53447 21.3744C6.51168 20.6271 4.78465 19.246 3.61096 17.4369C2.43727 15.6279 1.87979 13.4879 2.02168 11.3362C2.16356 9.18443 2.99721 7.13619 4.39828 5.49694C5.79935 3.85768 7.69279 2.71525 9.79619 2.24001C11.8996 1.76477 14.1003 1.9822 16.07 2.85986" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M9 11L12 14L22 4" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>

			<p class="forgot-title">
				Sent! Instructions were sent to your email.
			</p>
			<p class="forgot-subtitle">
				Follow them to reset your password
			</p>

			<div class="cta-button secondary return-button" on:click={() => { forgottenPassword = false; instructionsSent = false; }}>Return to the login page</div>
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

	
</style>

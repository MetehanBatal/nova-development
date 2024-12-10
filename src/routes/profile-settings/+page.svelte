<script>
	import { onMount } from "svelte";
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { user } from '$stores/user';
	import { toastMessage } from '$stores/toast';

	const hasRequiredInfo = $page.url.searchParams.get('signup') ? true : false;

	let inProgress;
	const spinner = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

	function handleUserUpdate() {
		inProgress = true;
		var apiHeaders = new Headers();
		apiHeaders.append("Content-Type", "application/x-www-form-urlencoded");

		var urlencoded = new URLSearchParams();
		for (const key in $user) {
			urlencoded.append(key, $user[key]);
		}

		var requestOptions = {
			method: 'PUT',
			headers: apiHeaders,
			body: urlencoded,
			redirect: 'follow'
		};

		fetch("https://mve.novus.studio/prod/users/update", requestOptions)
			.then(response => response.json())
			.then(result => {
				inProgress = false;
				if (result.err && result.err.length > 0) {
					$toastMessage.type = "error";
					$toastMessage.content = 'Something went wrong while updating information.'
				} else {
					$toastMessage.type = "success";
					$toastMessage.content = "Informations updated successfully.";
					goto('/dashboard')
				}
			})
			.catch(error => console.error('error', error));
	}

	import SwitchBox from "$lib/toolkit/SwitchBox.svelte";
    
	import intlTelInput from 'intl-tel-input';

	import 'intl-tel-input/build/css/intlTelInput.css';

	let switchTitle = "";

	let imgElement;
    let fileInput;
	let loadedName;
	let loadedData;
	let updatePhoto = false; 

	let countryName;
	let phoneSelection;

    function readDocument () {
		loadedName = fileInput.files[0].name;
		loadedData = fileInput.files[0].size / 1048576;

		const reader = new FileReader();
		reader.onload = function (e) {
		const imageSrc = e.target.result;
			imgElement.src = imageSrc;
		};

		reader.readAsDataURL(fileInput.files[0]);

		const formdata = new FormData();
			formdata.append("emailAddress", $user.emailAddress);
			formdata.append("firstName", $user.firstName);
			formdata.append("lastName", $user.lastName);
			formdata.append("file", fileInput.files[0], Date.now());

		const requestOptions = {
			method: "POST",
			body: formdata,
			redirect: "follow"
		};

		fetch("https://mve.novus.studio/prod/users/uploadPhoto", requestOptions)
			.then((response) => response.json())
			.then((result) => {
				$user.thumbnail = result.url;
				inProgress = false;
				if (result.err && result.err.length > 0) {
					$toastMessage.type = "error";
					$toastMessage.content = 'Something went wrong while uploading profile photo.'
				} else {
					$toastMessage.type = "success";
					$toastMessage.content = "Profile photo updated successfully.";
				}
			})
			.catch((error) => console.error(error));
	}

	onMount(() => {
		var iti = intlTelInput(phoneSelection, {
			separateDialCode: true,
		});

		phoneSelection.addEventListener("countrychange", function() {
			var selectedCountryDialCode = iti.activeItem.dataset.dialCode;
			phoneSelection.placeholder = selectedCountryDialCode;
		});
	});


</script>


<div class="setting-header">
	<p>Profile Settings</p>
</div>

<div class="settings-container">
	<div class="type-header">
		<p class="type-title">Personal info</p>
		<p class="type-subtitle">Update your photo and personal details here.</p>
	</div>

	<div class="setting-divider"></div>

	<div class="settings-input-holder">
		<label for="name">
			Name <sup>(*required)</sup>
		</label>
		<div class="settings-inputs">
			<input type="text" name="firstName" bind:value={$user.firstName} placeholder="First Name" required>
			<input type="text" name="lastName" bind:value={$user.lastName} placeholder="Last Name" required>
		</div>
	</div>

	<div class="setting-divider"></div>

	<div class="settings-input-holder">
		<label for="email">
			Contact details
		</label>
		<div class="settings-inputs">
			<input bind:this={phoneSelection} type="text" name="phone" id="phoneNumber">
		</div>
	</div>

	<div class="setting-divider"></div>

	<div class="settings-input-holder file-holder">
        <label for="fileSelector">
			Profile picture
		</label>
        <div class="settings-logo-container">
            <div class="setting-logo-wrapper">
                <img bind:this={imgElement} src={`${$user.thumbnail.length > 0 ? $user.thumbnail : '/assets/icons/company.jpg'}`} alt="">            
				<div class="img-icon-holder">
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
						<path d="M8.45829 2.33331H5.54163L4.08329 4.08331H2.33329C2.02387 4.08331 1.72713 4.20623 1.50833 4.42502C1.28954 4.64381 1.16663 4.94056 1.16663 5.24998V10.5C1.16663 10.8094 1.28954 11.1061 1.50833 11.3249C1.72713 11.5437 2.02387 11.6666 2.33329 11.6666H11.6666C11.976 11.6666 12.2728 11.5437 12.4916 11.3249C12.7104 11.1061 12.8333 10.8094 12.8333 10.5V5.24998C12.8333 4.94056 12.7104 4.64381 12.4916 4.42502C12.2728 4.20623 11.976 4.08331 11.6666 4.08331H9.91663L8.45829 2.33331Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M7 9.33331C7.9665 9.33331 8.75 8.54981 8.75 7.58331C8.75 6.61681 7.9665 5.83331 7 5.83331C6.0335 5.83331 5.25 6.61681 5.25 7.58331C5.25 8.54981 6.0335 9.33331 7 9.33331Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</div>
            </div>
            <span on:click={() => imgElement.src = ""}>Remove</span>
        </div>
        <div class="input-file-holder">
            <input bind:this={fileInput} type="file" name="fileSelector" on:change={readDocument}>
            <div class="file-input-content">
                <div class="input-img">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M3.33345 12.4159C2.71432 11.7833 2.24726 11.0181 1.96765 10.1783C1.68804 9.33851 1.60321 8.44607 1.71959 7.56862C1.83597 6.69117 2.1505 5.8517 2.63937 5.11382C3.12823 4.37593 3.77861 3.75897 4.54123 3.30966C5.30385 2.86036 6.15873 2.5905 7.04109 2.52052C7.92346 2.45054 8.81018 2.58228 9.63409 2.90575C10.458 3.22923 11.1975 3.73596 11.7966 4.38757C12.3956 5.03917 12.8386 5.81856 13.0918 6.6667H14.5835C15.388 6.66661 16.1713 6.92531 16.8176 7.40457C17.4639 7.88384 17.9389 8.55826 18.1724 9.32821C18.406 10.0982 18.3857 10.9228 18.1146 11.6803C17.8434 12.4379 17.3359 13.0881 16.6668 13.535" stroke="#88888A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3.33345 12.4159C2.71432 11.7833 2.24726 11.0181 1.96765 10.1783C1.68804 9.33851 1.60321 8.44607 1.71959 7.56862C1.83597 6.69117 2.1505 5.8517 2.63937 5.11382C3.12823 4.37593 3.77861 3.75897 4.54123 3.30966C5.30385 2.86036 6.15873 2.5905 7.04109 2.52052C7.92346 2.45054 8.81018 2.58228 9.63409 2.90575C10.458 3.22923 11.1975 3.73596 11.7966 4.38757C12.3956 5.03917 12.8386 5.81856 13.0918 6.6667H14.5835C15.388 6.66661 16.1713 6.92531 16.8176 7.40457C17.4639 7.88384 17.9389 8.55826 18.1724 9.32821C18.406 10.0982 18.3857 10.9228 18.1146 11.6803C17.8434 12.4379 17.3359 13.0881 16.6668 13.535" stroke="black" stroke-opacity="0.2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 10V17.5" stroke="#88888A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 10V17.5" stroke="black" stroke-opacity="0.2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M13.3334 13.3333L10.0001 10L6.66675 13.3333" stroke="#88888A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M13.3334 13.3333L10.0001 10L6.66675 13.3333" stroke="black" stroke-opacity="0.2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <p><span>Click to upload </span>or drag and drop <br> SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
        </div>
    </div>

	<div class="setting-divider"></div>
	
	<div class="settings-button-wrapper">
		<div class="cta-button secondary">Cancel</div>
		<div class="cta-button primary" on:click={() => handleUserUpdate()}>
			{#if inProgress}
				{@html spinner}
			{:else}
				Save Changes
			{/if}
		</div>
	</div>

	
</div>
<!-- 
<div class="settings-container">
	<div class="type-header">
		<p class="type-title">Security Settings</p>
		<p class="type-subtitle">Update your photo and personal details here.</p>
	</div>

	<div class="setting-divider"></div>

	<div class="settings-input-holder">
		<label for="email">
			Change email
		</label>
		<div class="settings-inputs">
			<input type="mail" name="email" placeholder="New Email">
			<input type="mail" name="newEmail" placeholder="Confirm Email">
		</div>
	</div>

	<div class="setting-divider"></div>

	<div class="settings-input-holder">
		<label for="password">
			Change password
		</label>
		<div class="settings-inputs">
			<input type="password" name="password" placeholder="New Password">
			<input type="password" name="applyPassword" placeholder="Confirm Password">
		</div>
	</div>

	<div class="setting-divider"></div>

	<div class="settings-button-wrapper">
        <a class="cta-button secondary" href="">Cancel</a>
        <a class="cta-button primary" href="">Save Changes</a>
    </div>
</div> -->

<div class="settings-container">
	<div class="type-header">
		<p class="type-title">Notification Preferences</p>
		<p class="type-subtitle">Update your photo and personal details here.</p>
	</div>

	<div class="setting-divider"></div>

	<div class="settings-input-holder notif-holder">
		<label>
			Email Notifications
		</label>
		<div class="settings-inputs notif-inputs">
			<div class="notif-item">
				<div class="notif-description">
					<p class="notif-title">Analytics Updates</p>
					<p class="notif-subtitle">Receive notifications for significant changes in web analytics metrics such as page views, conversion rates, and bounce rates via email.</p>
				</div>
				<SwitchBox title={switchTitle}/>
			</div>
			<div class="notif-item">
				<div class="notif-description">
					<p class="notif-title">Experiment Results</p>
					<p class="notif-subtitle">Get notified about the completion of the experiments and the results, including which variant performed better and any statistical significance.</p>
				</div>
				<SwitchBox  title={switchTitle}/>
			</div>
			<div class="notif-item">
				<div class="notif-description">
					<p class="notif-title">Purchase Activity</p>
					<p class="notif-subtitle">Stay informed about recent purchasing activity, including new paying customers, high-value transactions, and trends in purchase summary metrics.</p>
				</div>
				<SwitchBox  title={switchTitle}/>
			</div>
			<div class="notif-item">
				<div class="notif-description">
					<p class="notif-title">System Updates</p>
					<p class="notif-subtitle">Stay informed about scheduled maintenance or new feature updates.</p>
				</div>
				<SwitchBox  title={switchTitle}/>
			</div>
		</div>
	</div>

	<div class="setting-divider"></div>

	<div class="settings-input-holder notif-holder">
		<label>
			Slack Notifications
		</label>
		<div class="settings-inputs notif-inputs">
			<div class="notif-item">
				<div class="notif-description">
					<p class="notif-title">Alert System</p>
					<p class="notif-subtitle">Get notified about the spikes on page views and conversion rates via Slack.</p>
				</div>
				<SwitchBox title={switchTitle}/>
			</div>
			<div class="notif-item">
				<div class="notif-description">
					<p class="notif-title">Error Detection</p>
					<p class="notif-subtitle">Get notified about the errors real-time.</p>
				</div>
				<SwitchBox  title={switchTitle}/>
			</div>
		</div>
	</div>

	<div class="setting-divider"></div>

	<div class="settings-button-wrapper">
        <a class="cta-button secondary" href="">Cancel</a>
        <a class="cta-button primary" href="">Save Changes</a>
    </div>

	
</div>


{#if updatePhoto}
	<div class="update-photo-wrapper">
		<div class="photo-update-popup">
			<div class="close-button" on:click={() => updatePhoto = !updatePhoto}>
				<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path d="M10 2L2 10" stroke="#6E6D81" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M2 2L10 10" stroke="#6E6D81" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
			<div class="icon-holder">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18456 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M9 11L12 14L22 4" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
			<p>
				Your new photo has been successfully added to your profile.
			</p>
			<a class="cta-button secondary" href="" on:click={() => updatePhoto = !updatePhoto}>Close</a>
			
		</div>
	</div>
{/if}


<style>

	.img-icon-holder {
		opacity: 0.56;
		padding-block: .1rem;
		background-color:  #060B13;
		transform: translateY(-115%);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.update-photo-wrapper {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(6, 11, 19, 0.80);
		z-index: 100;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.photo-update-popup {
		position: relative;

		max-width: 34rem;
		border-radius: 1.6rem;
		background-color: rgba(13, 18, 26, 0.4);
		backdrop-filter: blur(1.2rem);

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;

		padding: 2.9rem 5.4rem;

		gap: 1.6rem;
		overflow: hidden;
		border : .1rem solid rgba(255, 255, 255, 0.08)
	}

	.photo-update-popup::before {
		content: "";
		position: absolute;
		top: 0;
		background-image: url("assets/icons/top-light.png");
		height: 29rem;
		width: 40rem;
		transform: translateX(9%)translateY(-39%);
		opacity: 1;
		filter: blur(8.2rem);		
	}
	
	.photo-update-popup::after {
		content: "";
		position: absolute;
		top: 0;
		right: 0;
		background-image: url("assets/icons/right-light.png");
		height: 11rem;
		width: 20rem;
		opacity: 1;
		filter: blur(8.2rem);
		transform: translateY(-60%) translateX(80%);
	}

	.icon-holder {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.6rem;
		
		background-color: rgba(255, 255, 255, 0.04);
		border-radius: 50%;
	}

	.close-button {
		z-index: 10;
		position: absolute;
		top: 1.6rem;
		right: 1.6rem;
		cursor: pointer;
	}

	.photo-update-popup p {
		font-size: 1.8rem;
		line-height: 2.2rem;
	}

	.photo-update-popup .cta-button {
		margin-top: .8rem;
	}

	svg path {
        transition: all .3s ease-in-out;
    }

	.setting-header {
		width: 100%;
		padding: 3.2rem 2.4rem;

		border-bottom: .1rem solid #212830;
	}

	.setting-divider {
		width: 100%;
		height:.1rem;
		background-color: #212830;
		opacity: .32;

		margin-block: 2.4rem;
	}

	.setting-header p,.type-title {
		font-size: 1.8rem;
		line-height: 2.2rem;
	}

	p.type-subtitle {
		color: #88888A;
	}

	.settings-container {
		margin: 3.2rem 0rem 0rem 3.2rem;

		width: 100%;
		max-width: 83.2rem;

		background-color: #0D121A;

		border: .1rem solid #212830;
		border-radius: 1.6rem;

		padding: 3.2rem 3.2rem 3.2rem 2.4rem;
	}

	.type-header {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.settings-inputs.notif-inputs {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: space-between;
		justify-content: space-between;
	}

	.settings-inputs .notif-item {
		width: 100%;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 5.6rem;
		font-size: 1.4rem;
	}

	.settings-inputs .notif-description {
		display: flex;
		flex-direction: column;
		gap: .8rem;
		font-size: 1.4rem;
	}

	.notif-holder label {
		max-width: 24rem;
	}

	.settings-inputs .notif-title {
		color: #FFF;
	}
	.settings-inputs .notif-subtitle {
		color: #88888A;
	}
	


	
</style>

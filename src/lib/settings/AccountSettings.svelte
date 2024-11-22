<script>
	import Dropdown from '$lib/toolkit/Dropdown.svelte';
	import { organization } from '../../stores/organization';

    import SwitchBox from '$lib/toolkit/SwitchBox.svelte';

	let imgElement;
	let fileInput;
	let loadedData = "https://www.manvsevil.m"; // Should be change after create db.
	let loadedName;
	

	let inProgress = false;

	const memberTypes = [
		{ id: 'admin', name: 'Admin'},
		{ id: 'projectManager', name: 'Project Manager' },
		{ id: 'member', name: 'Member' },
		{ id: 'editor', name: 'Editor' },
		{ id: 'tester', name: 'Tester' }
	];
	let defaultRoleIndex = 2;
	let attachmentAccessIndex = 2;
	let projectAccessIndex = 2;
	let aiSuggestion = false;

	let avatarSelection = 1;

	/*

	function saveGeneralSettings () {
		inProgress = true;
		loadedName = fileInput.files[0].name;
		loadedData = fileInput.files[0].size / 1048576;

		const reader = new FileReader();
		reader.onload = function (e) {
		const imageSrc = e.target.result;
			imgElement.src = imageSrc;
		};

		reader.readAsDataURL(fileInput.files[0]);

		const formdata = new FormData();
		formdata.append("file", fileInput.files[0], Date.now());

		const requestOptions = {
			method: "POST",
			body: formdata,
			redirect: "follow"
		};

		fetch("https://mve.novus.studio/prod/users/uploadPhoto", requestOptions)
			.then((response) => response.json())
			.then((result) => {			
				inProgress = false;
				if (result.err && result.err.length > 0) {
					$toastMessage.type = "error";
					$toastMessage.content = 'Something went wrong while updating brand image.'
				} else {
					$toastMessage.type = "success";
					$toastMessage.content = "Image updated successfully.";
				}

				setTimeout(() => {
					$toastMessage.type = "";
					$toastMessage.content = "";
				},5000)
			})
			.catch((error) => console.error(error));
	}

	*/

	function readDocument() {
		const reader = new FileReader();
		reader.onload = function(e) {
			const imageSrc = e.target.result;
			imgElement.src = imageSrc;
		};

		reader.readAsDataURL(fileInput.files[0]);
	}


	$: aiSuggestion, console.log("AI Suggestion",aiSuggestion) // SwitchBox
</script>


<div class="settings-container">
	<div class="settings-group">
		<div>
			<h3>Organization Slug</h3>
			<p class="muted">A unique ID used to identify this organization.</p>
		</div>

		<input class="input" type="text" bind:value={$organization.slug}>
	</div>

	<div class="setting-divider"></div>

	<div class="settings-group">
		<div>
			<h3>Display Name</h3>
			<p class="muted">A human-friendly name for the organization.</p>
		</div>

		<input class="input" type="text" bind:value={$organization.displayName}>
	</div>

	<div class="setting-divider"></div>

	<div class="settings-group">
		<div>
			<h3>AI-suggested Solution</h3>
			<p class="muted">Opt-in to AI suggested solution to get help on how to solve an issue.</p>
		</div>

		<SwitchBox title="" bind:status={aiSuggestion}/>
	</div>

	<div class="setting-divider"></div>

	<div class="settings-button-wrapper">
		<div class="cta-button primary">Save Changes</div>
	</div>

</div>

<div class="settings-container">
	<div class="settings-group">
		<div>
			<h3>Default Role</h3>
			<p class="muted">The default role new member will receive.</p>
		</div>

		<Dropdown options={memberTypes} bind:selectedStatusIndex={defaultRoleIndex} />
	</div>

	<div class="setting-divider"></div>

	<div class="settings-group">
		<div>
			<h3>Attachments Access</h3>
			<p class="muted">Role required to export the events and reports.</p>
		</div>

		<Dropdown options={memberTypes} bind:selectedStatusIndex={attachmentAccessIndex} />
	</div>

	<div class="setting-divider"></div>

	<div class="settings-group">
		<div>
			<h3>Project Access</h3>
			<p class="muted">Role required to access the subsequent projects.</p>
		</div>

		<Dropdown options={memberTypes} bind:selectedStatusIndex={projectAccessIndex} />
	</div>

	<div class="setting-divider"></div>

	<div class="settings-group">
		<div>
			<h3>Avatar</h3>

			<div>
				<div class="radio-button" class:active={avatarSelection === 0} on:click={() => avatarSelection = 0}>
					<div class="checkbox"></div>

					<p>Use Initials</p>
				</div>

				<div class="radio-button" class:active={avatarSelection === 1} on:click={() => avatarSelection = 1}>
					<div class="checkbox"></div>

					<p>Upload an image</p>
				</div>
			</div>
		</div>

		{#if avatarSelection === 0}
		<div class="thumbnail-wrapper">
			<img bind:this={imgElement} class="thumbnail" src={$organization.thumbnail}>
		</div>
		
		{:else}
		<div class="thumbnail-wrapper">
			{#if loadedData === "https://www.manvsevil.com"}
				<img bind:this={imgElement} class="thumbnail" src={$organization.thumbnail}>				
				{:else}
				<div class="thumbnail-overlay">
					<img src="/assets/icons/upload-icon.svg" alt="upload-icon">
					<p>Click to change image</p>
					<input class="thumbnail-changer" bind:this={fileInput} type="file" name="fileSelector" on:change={readDocument}>
				</div>
				<img bind:this={imgElement} class="thumbnail" src={$organization.thumbnail}>	
			{/if}
		</div>

		{/if}
	</div>

	<div class="setting-divider"></div>

	<div class="settings-button-wrapper">
		<div class="cta-button primary">Save Changes</div>
	</div>

</div>


<style>
	.settings-group {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	h3 {
		font-size: 1.8rem;
		line-height: 2.2;
	}

	.input {
		padding-left: 1.2rem;

		width: 100%;
		max-width: 25rem;
	}

	.radio-button {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 1rem;

		padding: 1.3rem 1rem;
	}

	.radio-button .checkbox {
		position: relative;

		width: 1.6rem;
		height: 1.6rem;

		border: .1rem solid rgba(136, 136, 138, 1);

		border-radius: 50%;

		cursor: pointer;
	}

	.radio-button.active .checkbox::after {
		content: "";

		width: .6rem;
		height: .6rem;

		position: absolute;
		top: 50%;
		left: 50%;

		transform: translate3d( -50%, -50%, 0);

		background-color: rgba(136, 136, 138, 1);

		border-radius: 50%;
	}

	.thumbnail-wrapper {
		position: relative;

		margin-block: auto;
	}

	.thumbnail-wrapper  img {
		max-width: 20rem;
    	margin-block: auto;
	}

	:global(.settings-group .dropdown-box, .settings-group .dropdown-selection, .settings-group .dropdown) {
		width: 100% !important;
		max-width: 25rem;
	}
	:global(.settings-group .dropdown-box .dropdown-selection) {
		justify-content: space-between;
	}


	.thumbnail-overlay {
		position: absolute;
		top: 0;
		left: 0;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		width: 100%;
		height: 100%;

		opacity: 1;
		background-color: rgba(0, 0, 0, .8);
		
		z-index: 1000;
		transition: all .3s ease-in-out;
		cursor: pointer;
	}

	.thumbnail-overlay p {
		font-size: 1.4rem;
		color: #FFFFFF;
	}

	.thumbnail-overlay img {
		width: 2.4rem;
		height: 2.4rem;
		opacity: 0;
		visibility: hidden;
		transition: all .3s ease-in-out;
		margin-block: 0;
	}

	.thumbnail-overlay:hover img {
		visibility: visible;
		opacity: 1;
	}

	.thumbnail-changer {
		width: 100%;
		height: 100%;
		background-color: transparent;
	}
</style>
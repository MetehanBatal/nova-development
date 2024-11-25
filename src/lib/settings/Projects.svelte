<script>
	import { organization } from '../../stores/organization';
  import PageSettings from '../cms/PageSettings.svelte';

	let pageSettingsId = '';

	console.log($organization);

	function triggerSettings(id) {
		pageSettingsId = id;
	}
</script>


<div class="settings-container">
	{#if pageSettingsId.toString().length > 0}
	<p on:click={() => pageSettingsId = ''}>{`< Go Back`}</p>

	<div class="collapse-group">
		<div class="collapse-heading" on:click={() => { dropdownOpened = !dropdownOpened }}>
			<h4>General</h4>
		</div>

		<div class="collapse-content">
			<div class="input-holder">
				<p class="label">Name</p>
	
				<input type="text" bind:value={$organization.projects[pageSettingsId].projectName}>
			</div>
	
			<div class="input-holder">
				<p class="label">Page Slug</p>
	
				<input type="text" bind:value={$organization.projects[pageSettingsId].webclipURL}>
			</div>
		</div>
	</div>
	<div class="collapse-group">
		<div class="collapse-heading" on:click={() => { dropdownOpened = !dropdownOpened }}>
			<h4>Icons</h4>
		</div>

		<div class="collapse-content">
			<div class="input-holder">
				<p class="label">Favicon</p>

				<div></div>
			</div>

			<div class="input-holder">
				<p class="label">Webclip</p>

				<div></div>
			</div>
		</div>
	</div>
	<div class="collapse-group">
		<div class="collapse-heading" on:click={() => { dropdownOpened = !dropdownOpened }}>
			<h4>Custom Code</h4>
		</div>

		<div class="collapse-content">
			<div class="input-holder">
				<p class="label">Head code</p>
	
				<textarea type="text" bind:value={$organization.projects[pageSettingsId].projectName}></textarea>
			</div>

			<div class="input-holder">
				<p class="label">Footer code</p>
	
				<textarea type="text" bind:value={$organization.projects[pageSettingsId].projectName}></textarea>
			</div>
		</div>
	</div>
	{:else}
	{#each $organization.projects as project, _index}
	<div class="project">
		<div class="project-thumbnail">
			<img src={project.faviconURL} alt={`${project.projectNamename} Logo`} />
		</div>

		<h4>{project.projectName}</h4>

		<div style="margin-left: auto;">
			<div class="cta-button secondary">Switch Project</div>
			<div class="cta-button secondary" on:click={() => triggerSettings(_index)}>Settings</div>
		</div>
	</div>
	<div class="setting-divider"></div>
	{/each}
	{/if}
</div>

<style>
	.project {
		display: flex;
		align-items: center;
		gap: 1.6rem;
	}
	
	.project-thumbnail {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 2.4rem;
		height: 2.4rem;
		
		background: #212830;
		border-radius: .4rem;

		padding: .2rem;
	}

	.cta-button.secondary {
		margin-left: auto;
	}

	h4 {
		font-size: 1.8rem;
		line-height: 2.2;
	}

</style>
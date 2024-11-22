<script>
	import Dropdown from '$lib/toolkit/Dropdown.svelte';
	
	const integrations = [
		{
			id: 'slack',
			name: 'Slack',
			logo: '/assets/icons/integrations/slack.svg',
			status: 'installed',
			tags: [
				'chat',
				'alert rule',
				'push notifications'
			]
		}
	];

	let categories = [
		{
			id: 'chat',
			name: 'Chat'
		},
		{
			id: 'alert rule',
			name: 'Alert Rule'
		},
		{
			id: 'push notification',
			name: 'Push Notification'
		}
	];

	let selectedFiltrationCategory = null;
</script>


<div class="settings-container integrations">
	<div class="header">
		<Dropdown options={categories} bind:selectedStatusIndex={selectedFiltrationCategory} position="left" />

		<div class="input-holder">
			<input class="input" placeholder="Filter integrations" type="text">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"></path>
				<path d="M13.9995 14.0001L11.1328 11.1335" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round" class="s-jB14qlvOq3Qq"></path>
			</svg>
		</div>
		<div class="cta-button secondary">Create New Integration</div>
	</div>
	
	<div class="projects">
		{#each integrations as integration}
		<div class="project">
			<div class="project-thumbnail">
				<img src={integration.logo} alt={`${integration.name} Logo`} />
			</div>
			
			<div class="project-info">
				<h4>{integration.name}</h4>

				<p class="muted capitalized" class:installed={integration.status === 'installed'}>
					<span></span>

					{integration.status}
				</p>
			</div>

			<div class="tags">
				{#each integration.tags as tag}
				<div class="tag">
					{tag}
				</div>
				{/each}
			</div>
			<div class={`cta-button ${integration.status === 'installed' ? 'secondary' : 'primary'}`}>{integration.status === 'installed' ? 'Delete' : 'Add'} Integration</div>
		</div>
		<div class="setting-divider"></div>
		{/each}
	</div>
</div>

<style>
	.header {
		display: grid;
		grid-template-columns: 1.5fr 2fr 1.5fr;
		gap: 1.6rem;

		padding-bottom: 3.2rem;

		border-bottom: .1rem solid #212830;
	}

	:global(.header .dropdown-box),
	:global(.header .dropdown-selection) {
		width: 100% !important;
		height: 100%;
	}

	.input-holder {
		flex: 1;
	}

	.input {
		width: 100%;
		background-color: #212830;
	}

	.projects {
		margin-top: 3.2rem;
	}

	.project {
		display: flex;
		align-items: center;
		gap: 1.6rem;
	}
	
	.project-thumbnail {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 4.2rem;
		height: 4.2rem;
		
		background: #212830;
		border-radius: .8rem;

		padding: .6rem;
	}

	.project-info .installed {
		color: #0CB47F;
	}

	.project-info p {
		display: flex;
		align-items: center;
		gap: .6rem;
	}

	.project-info span {
		width: .8rem;
		height: .8rem;

		background-color: currentColor;
		border-radius: 100%;
	}

	.tags {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: .8rem;

		margin-left: auto;
	}

	.tag {
		text-transform: capitalize;
		font-size: 1.2rem;
		line-height: 1.6rem;

		border: 1px solid #212830;
		border-radius: 12rem;

		padding: .2rem 1.2rem;
	}

	h4 {
		font-size: 1.8rem;
		line-height: 2.2rem;

		margin-bottom: .2rem;
	}

	:global(.integrations .dropdown-box .dropdown-selection) {
		justify-content: space-between;
	}

</style>
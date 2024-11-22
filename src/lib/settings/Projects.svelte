<script>
	import { organization } from '../../stores/organization';
</script>


<div class="settings-container">
	{#each $organization.projects as project}
	<div class="project">
		<div class="project-thumbnail">
			<img src={project.logo} alt={`${project.name} Logo`} />
		</div>

		<h4>{project.name}</h4>

		<div class="cta-button secondary">Switch Project</div>
	</div>
	<div class="setting-divider"></div>
	{/each}
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
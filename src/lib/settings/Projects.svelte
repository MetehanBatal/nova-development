<script>
  import { organization } from '$stores/organization';
  import Button from '$uiKit/components/Button.svelte';
  import Textarea from '$uiKit/components/Textarea.svelte';
  import Input from '$uiKit/components/Input.svelte';

  let pageSettingsId = '';

  console.log($organization);

  function triggerSettings(id) {
    pageSettingsId = id;
  }
</script>

<div class="settings-container">
  {#if pageSettingsId.toString().length > 0}
    <p on:click={() => (pageSettingsId = '')} class="go-back-button">{`< Go Back`}</p>

    <div class="collapse-group">
      <div class="collapse-heading">
        <h4>General</h4>
      </div>

      <div class="collapse-content">
        <div class="input-holder">
          <p class="label">Name</p>
          <Input name="projectName" bind:value={$organization.projects[pageSettingsId].projectName} />
        </div>

        <div class="input-holder">
          <p class="label">Page Slug</p>
          <Input name="webclipURL" bind:value={$organization.projects[pageSettingsId].webclipURL} />
        </div>
      </div>
    </div>
    <div class="collapse-group">
      <div class="collapse-heading">
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
      <div class="collapse-heading">
        <h4>Custom Code</h4>
      </div>

      <div class="collapse-content">
        <div class="input-holder">
          <p class="label">Head code</p>
          <Textarea width="full" bind:value={$organization.projects[pageSettingsId].projectName} />
        </div>

        <div class="input-holder">
          <p class="label">Footer code</p>
          <Textarea width="full" bind:value={$organization.projects[pageSettingsId].projectName} />
        </div>
      </div>
    </div>
  {:else}
    {#each $organization.projects as project, _index}
      <div class="project">
        <div class="project-thumbnail">
          <img src={project.faviconURL} alt={`${project.projectName} Logo`} />
        </div>

        <h4>{project.projectName}</h4>

        <div style="margin-left: auto; display: flex; gap: 0.8rem">
          <Button variant="additional">Switch Project</Button>
          <Button variant="additional" on:click={() => triggerSettings(_index)}>Settings</Button>
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
    border-radius: 0.4rem;

    padding: 0.2rem;
  }

  .go-back-button {
    cursor: pointer;
  }

  h4 {
    font-size: 1.8rem;
    line-height: 2.2;
  }
</style>

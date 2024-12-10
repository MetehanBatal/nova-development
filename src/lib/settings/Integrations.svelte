<script>
  import Combobox from '$uiKit/components/combobox/Combobox.svelte';
  import Input from '$uiKit/components/Input.svelte';
  import Button from '$uiKit/components/Button.svelte';
  import Badge from '$uiKit/components/Badge.svelte';

  const integrations = [
    {
      id: 'slack',
      name: 'Slack',
      logo: '/assets/icons/integrations/slack.svg',
      status: 'installed',
      tags: ['chat', 'alert rule', 'push notifications']
    }
  ];

  let categories = [
    {
      key: 'chat',
      label: 'Chat'
    },
    {
      key: 'alert rule',
      label: 'Alert Rule'
    },
    {
      key: 'push notification',
      label: 'Push Notification'
    }
  ];

  let selectedFiltrationCategory = null;
</script>

<div class="settings-container integrations">
  <div class="header">
    <Combobox
      placeholder="Choose categories"
      name="categories"
      items={categories}
      bind:value={selectedFiltrationCategory}
    ></Combobox>

    <div class="">
      <Input name="filterIntegration" placeholder="Filter integrations" iconLeft="mingcute:search-line" />
    </div>
    <Button variant="additional">Create New Integration</Button>
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
            <Badge
              label={tag.slice(0, 1).toUpperCase() + tag.slice(1)}
              type="text"
              textColor="#ffffff"
              border="#212830"
              size="wide"
            />
          {/each}
        </div>
        <Button variant="additional">{integration.status === 'installed' ? 'Delete' : 'Add'} Integration</Button>
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

    border-bottom: 0.1rem solid #212830;
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
    border-radius: 0.8rem;

    padding: 0.6rem;
  }

  .project-info .installed {
    color: #0cb47f;
  }

  .project-info p {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .project-info span {
    width: 0.8rem;
    height: 0.8rem;

    background-color: currentColor;
    border-radius: 100%;
  }

  .tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.8rem;

    margin-left: auto;
  }

  .tag {
    text-transform: capitalize;
    font-size: 1.2rem;
    line-height: 1.6rem;

    border: 1px solid #212830;
    border-radius: 12rem;

    padding: 0.2rem 1.2rem;
  }

  h4 {
    font-size: 1.8rem;
    line-height: 2.2rem;

    margin-bottom: 0.2rem;
  }

  :global(.integrations .dropdown-box .dropdown-selection) {
    justify-content: space-between;
  }
</style>

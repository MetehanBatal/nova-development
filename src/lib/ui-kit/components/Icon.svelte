<script lang="ts">
  import Icon from '@iconify/svelte';
  import { v4 as uuidv4 } from 'uuid';

  export let iconName: string;
  let isHovered = false;
  let uniqueId = uuidv4();
  let buttonElement: HTMLElement | null = null;

  $: if (isHovered) {
    setTimeout(() => {
      buttonElement = document.getElementById(`copy-button-${uniqueId}`);
    }, 200);
  }

  function mouseEnter() {
    isHovered = true;
  }

  function mouseLeave() {
    isHovered = false;
  }

  async function copy() {
    try {
      if (!buttonElement) {
        console.error('Button element not found');
      }

      await navigator.clipboard.writeText(
        "import Icon from '@iconify/svelte'; \n\n" +
          `<Icon icon="${iconName}" width="24" height="24" style="color: white" />`
      );

      buttonElement!.textContent = 'Copied!';
      setTimeout(() => (buttonElement!.textContent = 'Copy Code'), 2000);
    } catch (error) {
      console.error('Copying error:', error);
      buttonElement!.textContent = 'Error';
      setTimeout(() => (buttonElement!.textContent = 'Copy code'), 2000);
    }
  }
</script>

<div class="nsuk-icon" on:mouseenter={mouseEnter} on:mouseleave={mouseLeave} role="tooltip">
  <Icon icon={iconName} width="24" height="24" style="color: white" />
  <div class="nsuk-icon__name">{iconName}</div>
  {#if isHovered}
    <button id={`copy-button-${uniqueId}`} class="nsuk-icon--hover" on:click={copy}>Copy Code</button>
  {/if}
</div>

<style lang="scss">
  .nsuk-icon {
    min-width: 216px;
    height: 92px;
    flex: 1 1 0%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: 1px solid var(--ns-border-color);
    border-radius: 8px;
    position: relative;

    &__name {
      font-size: 12px;
      color: white;
      line-height: 14px;
      font-weight: 400;
    }

    &--hover {
      position: absolute;
      font-size: 14px;
      color: white;
      line-height: 18px;
      font-weight: 400;
      padding: 7px 12px;
      border-radius: 6px;
      background-color: rgba(13, 18, 26, 1);
      cursor: pointer;
    }
  }
</style>

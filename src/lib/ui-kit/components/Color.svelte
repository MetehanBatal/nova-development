<script lang="ts">
  import { v4 as uuidv4 } from 'uuid';

  export let color: string;
  export let height: number = 140;
  let isHovered = false;
  let uniqueId = uuidv4();
  let colorElement: HTMLElement | null = null;

  $: if (isHovered) {
    setTimeout(() => {
      colorElement = document.getElementById(`copy-button-${uniqueId}`);
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
      if (!colorElement) {
        console.error('Button element not found');
      }

      await navigator.clipboard.writeText(`${color}`);

      colorElement!.textContent = 'Copied!';
      setTimeout(() => (colorElement!.textContent = 'Copy Code'), 2000);
    } catch (error) {
      console.error('Copying error:', error);
      colorElement!.textContent = 'Error';
      setTimeout(() => (colorElement!.textContent = 'Copy code'), 2000);
    }
  }
</script>

<div
  class="nsuk-color"
  role="tooltip"
  style={`min-height: ${height}px; background-color: ${color}`}
  on:mouseenter={mouseEnter}
  on:mouseleave={mouseLeave}
>
  {#if isHovered}
    <button id={`copy-button-${uniqueId}`} class="nsuk-color--hover" on:click={copy}>Copy Hex Code</button>
  {/if}
</div>

<style lang="scss">
  .nsuk-color {
    border-radius: 8px;
    border: 1px solid var(--ns-border-color);
    position: relative;
    min-width: 210px;
    width: 100%;

    &--hover {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
      color: white;
      line-height: 18px;
      font-weight: 400;
      padding: 7px 12px;
      border-radius: 6px;
      background-color: rgba(13, 18, 26, 0.6);
      cursor: pointer;
      text-wrap: nowrap;
    }
  }
</style>

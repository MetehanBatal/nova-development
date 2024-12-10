<!-- ToastContainer.svelte -->
<script lang="ts">
  import { flip } from 'svelte/animate';
  import { scale } from 'svelte/transition';
  import { linear } from 'svelte/easing';

  import { usePortal } from './utils';
  import { toasts, clearLastToast } from './utils';

  import Toast from './toast-component.svelte';

  export let withProgress: boolean = true;
  export let stacked: boolean = true;
  export let maxToasts: number = 5;
  export let closable: boolean = true;
  export let customToast: boolean = false;
  export let position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' =
    'top-right';

  let enterTransition = { x: 20, duration: 500 };
  let exitTransition = { x: -20, duration: 500 };

  function positionClass(position: string) {
    switch (position) {
      case 'top-left':
        return 'nsuk-top-left';
      case 'top-center':
        return 'nsuk-top-center';
      case 'top-right':
        return 'nsuk-top-right';
      case 'bottom-left':
        return 'nsuk-bottom-left';
      case 'bottom-center':
        return 'nsuk-bottom-center';
      case 'bottom-right':
        return 'nsuk-bottom-right';
      default:
        return 'nsuk-bottom-right';
    }
  }

  function calculatePositionStyle(index: number) {
    return position === 'top-center' || position === 'top-left' || position === 'top-right'
      ? `top: calc(${index * 15}px);`
      : position === 'bottom-center' || position === 'bottom-left' || position === 'bottom-right'
        ? `bottom: calc(${index * 15}px);`
        : '';
  }

  $: {
    switch (position) {
      case 'top-center':
        enterTransition = { y: -20, duration: 500 };
        exitTransition = { y: 20, duration: 500 };
        break;
      case 'top-right':
        enterTransition = { x: 20, duration: 500 };
        exitTransition = { x: -20, duration: 500 };
        break;
      case 'top-left':
        enterTransition = { x: -20, duration: 500 };
        exitTransition = { x: 20, duration: 500 };
        break;
      case 'bottom-center':
        enterTransition = { y: 20, duration: 500 };
        exitTransition = { y: -20, duration: 500 };
        break;
      case 'bottom-left':
        enterTransition = { x: -20, duration: 500 };
        exitTransition = { x: 20, duration: 500 };
        break;
      case 'bottom-right':
        enterTransition = { x: 20, duration: 500 };
        exitTransition = { x: -20, duration: 500 };
        break;
    }
  }

  $: {
    if ($toasts.length > maxToasts) {
      clearLastToast(maxToasts);
    }
  }
</script>

<div use:usePortal class={`nsuk-portal ${positionClass(position)} `}>
  {#each $toasts as toast, index (toast.id)}
    <div
      animate:flip
      in:scale={{ duration: 200, easing: linear, delay: 0, opacity: 0.5, start: 0.8 }}
      out:scale={exitTransition}
      class={`nsuk-portal-inner ${stacked ? `nsuk-portal-inner ${positionClass(position)}` : ''}`}
      style={calculatePositionStyle(index)}
    >
      {#if customToast}
        <!--{@render children?.({ data: toast })}-->
      {:else}
        <Toast {withProgress} {toast} {closable} {enterTransition} {exitTransition} />
      {/if}
    </div>
  {/each}
</div>

<style lang="scss">
  .nsuk-portal {
    position: fixed;
    max-width: max-content;
    max-height: max-content;
    display: flex;
    align-items: end;
    gap: 8px;
    z-index: 9999;
    margin: 12px 8px;

    &-inner {
      position: absolute;
      padding: 12px 0;
    }
  }
  .nsuk-top-left {
    top: 0;
    left: 0;
    flex-direction: column-reverse;
  }
  .nsuk-top-center {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: column-reverse;
  }
  .nsuk-top-right {
    top: 0;
    right: 0;
    flex-direction: column-reverse;
  }
  .nsuk-bottom-left {
    bottom: 0;
    left: 0;
    flex-direction: column;
  }
  .nsuk-bottom-center {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: column;
  }
  .nsuk-bottom-right {
    bottom: 0;
    right: 0;
    flex-direction: column;
  }
</style>

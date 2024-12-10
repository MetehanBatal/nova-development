<script lang="ts">
  import { removeToast } from './utils';
  import type { Toast } from './types';

  import { fly } from 'svelte/transition';

  import CheckIcon from './icons/success.svelte';
  import InfoIcon from './icons/info.svelte';
  import ErrorIcon from './icons/error.svelte';
  import WarningIcon from './icons/warning.svelte';
  import Loader from './icons/loading.svelte';
  import { onMount } from 'svelte';

  interface FlyTransitionOptions {
    x?: number;
    y?: number;
    duration?: number;
    delay?: number;
    easing?: (t: number) => number;
  }

  export let toast: Toast;
  export let closable: boolean = true;
  export let enterTransition: FlyTransitionOptions;
  export let exitTransition: FlyTransitionOptions;
  export let withProgress: boolean = false;

  const { progress } = toast;

  function getIconComponent() {
    switch (toast.type) {
      case 'success':
        return CheckIcon;
      case 'info':
        return InfoIcon;
      case 'error':
        return ErrorIcon;
      case 'warning':
        return WarningIcon;
      default:
        return CheckIcon;
    }
  }

  let promiseResolved = false;

  if (toast.type === 'promise' && toast.content instanceof Promise) {
    toast.content.then((result) => {
      if (!promiseResolved) {
        toast.content = result;
        promiseResolved = true;
        setTimeout(() => {
          removeToast(toast.id);
        }, 2000);
      }
    });
  }

  let windowWidth: number = 0;

  function handleResize() {
    windowWidth = window.innerWidth;
  }

  onMount(() => {
    windowWidth = window.innerWidth;
    window.addEventListener('resize', handleResize);
  });
</script>

<div
  role="button"
  tabindex="0"
  on:click={() => removeToast(toast.id)}
  on:keydown={() => removeToast(toast.id)}
  in:fly={{ ...enterTransition }}
  out:fly={{ ...exitTransition }}
  class={`nsuk-button ${toast.type === 'success' ? 'nsuk-button-success' : toast.type === 'info' ? 'nsuk-button-info' : toast.type === 'error' ? 'nsuk-button-error' : toast.type === 'warning' ? 'nsuk-button-warning' : ''}`}
  style={`width: ${windowWidth < 420 ? '280px' : '400px'}`}
>
  <div class="nsuk-button-inner">
    <div class="nsuk-button-inner__item">
      {#if toast.type === 'promise'}
        {#if promiseResolved}
          {@const SvelteComponent = getIconComponent()}
          <SvelteComponent />
          <p>{@html toast.content}</p>
        {:else if !promiseResolved}
          <Loader />
          <p>Loading...</p>
        {/if}
      {:else}
        {@const SvelteComponent_1 = getIconComponent()}
        <div class="nsuk-button-inner__item-icon">
          <SvelteComponent_1 />
        </div>
        <div class="nsuk-button-inner__item-content">
          <h2 class="nsuk-button-inner__item-title">{@html toast.title}</h2>
          <p class="nsuk-button-inner__item-description">{@html toast.content}</p>
        </div>
      {/if}
    </div>

    {#if closable}
      <button class="nsuk-button-inner__close-button" aria-label="Close" on:click={() => removeToast(toast.id)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-4 h-4"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    {/if}
  </div>
  {#if withProgress}
    <div class="nsuk-progress" style={`width: ${$progress - 3}%`}></div>
    <div class="nsuk-progress-background"></div>
  {/if}
</div>

<style lang="scss">
  .nsuk-progress {
    position: absolute;
    bottom: 2px;
    left: 5px;
    height: 3px;
    width: 97%;
    border-radius: 0.375rem;
    background-color: white;
    z-index: 100;
    &-background {
      position: absolute;
      bottom: 2px;
      left: 5px;
      height: 3px;
      border-radius: 0.375rem;
      width: 97%;
      background-color: var(--ns-main-purple-color);
    }
  }

  .nsuk-button {
    position: relative;
    display: flex;
    border-radius: 16px;
    padding: 5px 5px 5px 15px;
    max-width: 400px;
    width: 100%;
    color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1));
    border: 1px solid #212830;
    &-inner {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 16px 0;
      display: flex;
      justify-content: center;
      align-items: center;

      &__item {
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 16px;
        width: 100%;
        height: 100%;

        &-title {
          font-size: 14px;
          font-weight: 400;
          margin-bottom: 10px;
        }

        &-description {
          font-size: 12px;
          font-weight: 400;
        }

        &-icon {
          min-width: 48px;
          min-height: 48px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        &-content {
          padding-right: 40px;
        }
      }

      &__close-button {
        position: absolute;
        right: 4px;
        top: 50%;
        transform: translateY(-50%);
        color: #6e6d81;
        width: 20px;
        height: 20px;
      }
    }

    &-info {
      background: linear-gradient(90deg, #22213f, #060b14);
    }

    &-success {
      background: linear-gradient(90deg, #072c28, #060b14);
    }

    &-error {
      background: linear-gradient(90deg, #341f22, #060b14);
    }

    &-warning {
      background: linear-gradient(90deg, #343422, #060b14);
    }
  }
</style>

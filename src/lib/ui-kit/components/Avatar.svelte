<script lang="ts">
  import Icon from '@iconify/svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let src: string = '';
  export let alt: string = '';
  export let size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  export let placeholder: string;
  export let changeable: boolean = true;

  let sizeClasses = '';
  let isHovered = false;

  switch (size) {
    case 'xs':
      sizeClasses = 'nsuk-avatar_xs';
      break;
    case 'sm':
      sizeClasses = 'nsuk-avatar_sm';
      break;
    case 'md':
      sizeClasses = 'nsuk-avatar_md';
      break;
    case 'lg':
      sizeClasses = 'nsuk-avatar_lg';
      break;
  }

  function mouseEnter() {
    isHovered = true;
  }

  function mouseLeave() {
    isHovered = false;
  }

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      dispatch('fileChange', { file });
    }
  }
</script>

<button class={`nsuk-avatar ${sizeClasses}`} on:mouseenter={mouseEnter} on:mouseleave={mouseLeave}>
  {#if src}
    <img {src} {alt} />
  {:else}
    <div class={`nsuk-avatar__placeholder ${sizeClasses}`}>
      {placeholder.charAt(0).toUpperCase()}
    </div>
  {/if}
  {#if isHovered && changeable}
    <div class="nsuk-avatar__icon">
      <Icon icon="lucide:camera" width="14" height="14" style="color: white" />
      <input type="file" on:change={handleFileChange} />
    </div>
  {/if}
</button>

<style lang="scss">
  .nsuk-avatar {
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    cursor: default;
    padding: 0;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &__placeholder {
      background-color: var(--ns-main-purple-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__icon {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 16px;
      background-color: var(--ns-icon-hover-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      input {
        opacity: 0;
        position: absolute;
        cursor: pointer;
      }
    }
  }

  .nsuk-avatar_xs {
    font-size: 20px;
    width: 40px;
    height: 40px;
  }

  .nsuk-avatar_sm {
    font-size: 24px;
    width: 56px;
    height: 56px;
  }

  .nsuk-avatar_md {
    font-size: 28px;
    width: 64px;
    height: 64px;
  }

  .nsuk-avatar_lg {
    font-size: 32px;
    width: 72px;
    height: 72px;
  }
</style>

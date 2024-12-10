<script lang="ts">
  import Toggle from '$uiKit/components/Toggle.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let title = '';
  export let description = '';
  export let size: 'xs' | 'sm' | 'md' | 'lg' = 'sm';
  export let type: 'normal' | 'mini' | 'choice' = 'normal';
  export let isChoice = false;
  export let widthHalf: boolean = false;
  export let widthThird: boolean = false;
  let toggleStatus = false;

  function handleToggle(event: CustomEvent<boolean>) {
    dispatch('toggle', event.detail);
  }
</script>

<div class={`nsuk-flex ${widthHalf ? 'nsuk-width-half' : widthThird ? 'nsuk-width-third' : ''}`}>
  <div class={type === 'mini' ? 'nsuk-flex' : ''}>
    <h2
      class={size === 'sm' && type !== 'mini'
        ? 'nsuk-title nsuk-title-sm'
        : size === 'md' && type !== 'mini'
          ? 'nsuk-title nsuk-title-md'
          : size === 'lg' && type !== 'mini'
            ? 'nsuk-title nsuk-title-lg'
            : type === 'mini' || size === 'xs'
              ? 'nsuk-title nsuk-title-xs'
              : ''}
    >
      {title}
    </h2>
    {#if description}
      <p
        class={type === 'mini' || size === 'xs'
          ? 'nsuk-description nsuk-description-mini'
          : type === 'normal' || type === 'choice'
            ? 'nsuk-description nsuk-description-normal'
            : ''}
      >
        {description}
      </p>
    {/if}
  </div>
  {#if isChoice}
    <div>
      <Toggle bind:value={toggleStatus} on:toggle={handleToggle} />
    </div>
  {/if}
</div>

<style lang="scss">
  .nsuk-title {
    font-weight: 500;
    margin-bottom: 8px;
    color: white;

    &-xs {
      font-size: 14px;
    }

    &-sm {
      font-size: 16px;
    }

    &-md {
      font-size: 18px;
    }

    &-lg {
      font-size: 20px;
    }
  }

  .nsuk-description {
    color: var(--ns-text-secondary-color);
  }

  .nsuk-description-mini {
    font-size: 12px;
  }

  .nsuk-description-normal {
    font-size: 14px;
  }

  .nsuk-flex {
    min-width: 200px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;

    p {
      padding-bottom: 4px;
    }
  }

  .nsuk-width-half {
    width: 50%;
  }

  .nsuk-width-third {
    width: 33.33%;
  }
</style>

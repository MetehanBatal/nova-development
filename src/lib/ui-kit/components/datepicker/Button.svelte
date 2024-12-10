<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let type: 'colored' | 'transparent' = 'colored';

  function handleClick() {
    dispatch('click');
  }
</script>

<button
  class={`nsuk-button ${type === 'colored' ? 'nsuk-button--colored' : 'nsuk-button--transparent'}`}
  on:click={handleClick}
>
  <slot />
</button>

<style lang="scss">
  .nsuk-button {
    font-size: 12px;
    border-radius: 8px;
    padding: 8px 24px;

    &--colored {
      background-color: var(--ns-main-purple-color);
      color: white;
    }

    &--transparent {
      background-color: transparent;
      color: rgba(136, 136, 138, 0.56);
    }
  }
</style>

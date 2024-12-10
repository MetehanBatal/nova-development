<script lang="ts">
  import Icon from '@iconify/svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let label: string | undefined = undefined;
  export let id: string = 'checkbox';
  export let name: string | undefined = 'checkbox';
  export let checked: boolean = false;
  export let disabled: boolean = false;

  function handleClick(event: Event) {
    if (!disabled) {
      event.stopPropagation();
      dispatch('handleChecked', { checked: !checked });
    }
  }
</script>

<div class="nsuk-checkbox">
  <div class="nsuk-checkbox__inner">
    <input
      {id}
      {name}
      type="checkbox"
      bind:checked
      {disabled}
      style={`cursor: ${disabled ? 'default' : 'pointer'}`}
      on:click={handleClick}
    />
    <div
      class="checkbox__inner-checkmark"
      style={`border: 1px solid ${disabled ? '#68696A' : checked ? 'transparent' : '#88888A'}; background-color: ${checked ? '#383c42' : 'transparent'}`}
    >
      {#if checked}
        <Icon icon="bi:check" width="16" height="16" style={`color: ${disabled ? '#68696A' : '#ffffff'};`} />
      {/if}
    </div>
  </div>
  {#if label}
    <label
      class="nsuk-checkbox__label"
      for={id}
      style={`color: ${disabled ? '#68696A' : '#ffffff'}; cursor: ${disabled ? 'default' : 'pointer'}`}>{label}</label
    >
  {/if}
</div>

<style lang="scss">
  .nsuk-nsuk-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;

    &__inner {
      position: relative;
      cursor: pointer;

      input {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        width: 16px;
        height: 16px;
      }

      &-checkmark {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }

    &__label {
      font-size: 16px;
      line-height: 24px;
    }
  }
</style>

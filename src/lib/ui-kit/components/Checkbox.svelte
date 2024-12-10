<script lang="ts">
  import Icon from '@iconify/svelte';

  export let label: string | undefined = undefined;
  export let id: string = 'checkbox';
  export let name: string | undefined = 'checkbox';
  export let checked: boolean = false;
  export let disabled: boolean = false;
</script>

<div class="nsuk-checkbox">
  <div class="nsuk-checkbox__inner">
    <input {id} {name} type="checkbox" bind:checked {disabled} style={`cursor: ${disabled ? 'default' : 'pointer'}`} />
    <div
      class="nsuk-checkbox__inner-checkmark"
      style={`border: 1px solid; color: ${disabled ? '#68696A' : '#ffffff'};`}
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
  .nsuk-checkbox {
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
        width: 18px;
        height: 18px;
      }

      &-checkmark {
        width: 18px;
        height: 18px;
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

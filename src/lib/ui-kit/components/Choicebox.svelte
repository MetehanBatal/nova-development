<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';

  const dispatch = createEventDispatcher();

  export let items: { value: string | number; label: string }[] = [];
  export let name: string;
  export let type: 'radio' | 'checkbox' = 'radio';
  export let disabled = false;
  export let radioSelected: string | number | boolean = '';
  export let checkboxSelected: string[] = [];
  export let isBorderVisible = true;
  export let direction: 'row' | 'column' = 'row';

  function handleRadioInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (type === 'checkbox') {
      if (input.checked) {
        checkboxSelected = [...checkboxSelected, value];
      } else {
        checkboxSelected = checkboxSelected.filter((item) => item !== value);
      }
      dispatch('selected', checkboxSelected);
    }
    if (type === 'radio') {
      radioSelected = value;
      dispatch('selected', radioSelected);
    }
  }
</script>

<div
  class={`nsuk-choicebox ${direction === 'row' ? 'nsuk-row' : 'nsuk-column'}`}
  style={`gap: ${isBorderVisible && direction === 'row' ? '20px' : isBorderVisible && direction === 'column' ? '15px' : '0px'}`}
>
  {#each items as item, i}
    <label
      style="--border-color: {(item.value === radioSelected && !disabled && isBorderVisible) ||
      (checkboxSelected.find((selected) => selected === item.value) && !disabled && isBorderVisible)
        ? '#AA96F3'
        : disabled && isBorderVisible
          ? 'var(--ns-border-color)'
          : !isBorderVisible
            ? 'transparent'
            : 'white'}; cursor: {disabled ? 'not-allowed' : 'pointer'}; padding: {(direction === 'row' &&
        isBorderVisible) ||
      (direction === 'column' && isBorderVisible)
        ? '18px 25px 18px 40px'
        : direction === 'column' && !isBorderVisible
          ? '10px 25px'
          : '18px 25px'};"
    >
      {#if type === 'radio'}
        <input
          type="radio"
          id={item.value}
          {name}
          value={item.value}
          bind:group={radioSelected}
          on:input={handleRadioInput}
          {disabled}
        />
      {:else if type === 'checkbox'}
        <input
          type="checkbox"
          id={item.value}
          {name}
          value={item.value}
          bind:group={checkboxSelected}
          {disabled}
          on:input={handleRadioInput}
        />
      {/if}

      <div
        class={`${type === 'radio' ? 'nsuk-choicebox-check__radio' : type === 'checkbox' ? 'nsuk-choicebox-check__checkbox' : ''} ${radioSelected === item.value && type === 'radio' ? 'nsuk-choicebox-check__radio-checked' : checkboxSelected.find((selected) => selected === item.value) && type === 'checkbox' ? 'nsuk-choicebox-check__checkbox-checked' : ''} ${item.value === radioSelected && type === 'radio' ? 'nsuk-visible' : ''}`}
        style="--border-color: {(item.value === radioSelected && !disabled) ||
        (checkboxSelected.find((selected) => selected === item.value) && !disabled)
          ? '#AA96F3'
          : disabled
            ? 'var(--ns-text-gray-color)'
            : 'white'}; left: {(direction === 'row' && isBorderVisible) || (direction === 'column' && isBorderVisible)
          ? '25px'
          : '10px'}; --point-color: {disabled ? 'var(--ns-text-secondary-color)' : 'var(--ns-purple-border-color)'}"
      >
        {#if type === 'checkbox' && checkboxSelected.find((selected) => selected === item.value)}
          <Icon icon="material-symbols:check" width="20" height="20" style="color: #AA96F3" />
        {/if}
      </div>

      <span class="nsuk-choicebox-label {disabled ? 'nsuk-choicebox-label--disabled' : ''}">{item.label}</span>
    </label>
  {/each}
</div>

<style lang="scss">
  :root {
    --point-color: var(--ns-text-gray-color);
  }

  .nsuk-choicebox {
    input {
      position: absolute;
      opacity: 0;
      left: 25px;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 16px;
      background-color: #7f7f7f;
    }

    label {
      position: relative;
      padding: 18px 25px 18px 40px;
      border: 1px solid var(--border-color, white);
      border-radius: 8px;
    }

    &-check__radio {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      visibility: hidden;
      background-color: var(--point-color);

      &::before {
        content: '';
        position: absolute;
        top: -5px;
        left: -5px;
        width: 16px;
        height: 16px;
        border: 1px solid var(--border-color, white);
        border-radius: 50%;
        box-sizing: border-box;
        visibility: visible;
      }
    }

    &-check__checkbox {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 16px;
      border-radius: 4px;
      border: 1px solid var(--border-color, white);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-label {
      font-size: 14px;
      color: white;
      text-wrap: nowrap;

      &--disabled {
        color: var(--ns-text-secondary-color);
      }
    }
  }

  .nsuk-visible {
    visibility: visible;
  }

  .nsuk-row {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .nsuk-column {
    display: flex;
    flex-direction: column;
  }
</style>

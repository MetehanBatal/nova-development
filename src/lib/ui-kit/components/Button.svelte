<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { clickOutside } from 'svelte-use-click-outside';
  import Spinner from '$lib/ui-kit/general/Spinner.svelte';
  import Portal from 'svelte-portal';

  const dispatch = createEventDispatcher();

  export let size: 'default' | 'big' | 'small' = 'default';
  export let variant: 'primary' | 'secondary' | 'additional' | 'split' = 'primary';
  export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
  export let disabled = false;
  export let split = false;
  export let isSpinner = false;
  let showDropdown = false;
  let spinner = false;
  let buttonElement: HTMLElement | null = null;
  let position = { top: 0, left: 0 };

  function handleClick() {
    if (isSpinner) {
      spinner = true;
    }
    dispatch('click');
  }

  function handleDropdownItem1() {
    dispatch('handleDropdownItem1');
    showDropdown = false;
  }

  function handleDropdownItem2() {
    dispatch('handleDropdownItem2');
    showDropdown = false;
  }

  function handleDropdown() {
    showDropdown = !showDropdown;
    if (showDropdown) {
      const rect = buttonElement?.getBoundingClientRect();
      position = {
        top: rect!.bottom + window.scrollY + 10,
        left: rect!.left + window.scrollX
      };
    }
  }

  function clickOutsideHandler() {
    showDropdown = false;
  }
</script>

<button
  {type}
  {disabled}
  class={`nsuk-button ${size === 'default' && !isSpinner ? 'nsuk-default' : size === 'big' && !isSpinner ? 'nsuk-big' : size === 'small' ? 'nsuk-small' : ''} ${isSpinner && spinner ? 'nsuk-spinner-padding' : 'nsuk-default'} ${variant === 'primary' ? 'nsuk-primary' : variant === 'secondary' ? 'nsuk-secondary' : variant === 'additional' ? 'nsuk-additional' : variant === 'split' ? 'nsuk-split' : ''} ${disabled ? 'nsuk-disabled' : ''}`}
  on:click={handleClick}
  bind:this={buttonElement}
>
  {#if spinner}
    <div>
      <Spinner />
    </div>
  {/if}
  <div class="nsuk-prefix">
    <slot name="prefix"></slot>
  </div>
  <slot>Button</slot>
  <div class="nsuk-suffix">
    <slot name="suffix"></slot>
  </div>
  {#if split}
    <button class="nsuk-split" on:click|stopPropagation={handleDropdown} use:clickOutside={clickOutsideHandler}>
      <slot name="split"></slot>
      {#if showDropdown}
        <Portal target="body">
          <div class="nsuk-dropdown" style={`top: ${position.top}px; left: ${position.left}px;`}>
            <button on:click|stopPropagation={handleDropdownItem1}>
              <slot name="item1"></slot>
            </button>
            <button on:click|stopPropagation={handleDropdownItem2}>
              <slot name="item2"></slot>
            </button>
          </div>
        </Portal>
      {/if}
    </button>
  {/if}
</button>

<style lang="scss">
  .nsuk-button {
    display: flex;
    align-items: center;
    gap: 15px;
    font-weight: 500;
    color: white;
    border-radius: 8px;
    position: relative;
    height: fit-content;
  }

  .nsuk-default {
    font-size: 14px;
    padding: 12px 30px 12px 30px;
  }

  .nsuk-big {
    font-size: 16px;
    padding: 14px 36px;
  }

  .nsuk-small {
    font-size: 12px;
    padding: 12px 20px;
  }

  .nsuk-spinner-padding {
    padding: 12px 30px 12px 22px;
  }

  .nsuk-button.nsuk-primary {
    background-color: var(--ns-main-purple-color);
  }

  .nsuk-button.nsuk-secondary {
    background-color: transparent;
    border: 1px solid white;
  }

  .nsuk-button.nsuk-additional {
    border: 1px solid var(--ns-border-color);
  }

  .nsuk-button.nsuk-secondary.nsuk-disabled {
    border: 1px solid #929292;
    color: #929292;
    cursor: not-allowed;
  }

  .nsuk-button.nsuk-primary.nsuk-disabled {
    background-color: #61519d;
    color: #929292;
    cursor: not-allowed;
  }

  .nsuk-button.nsuk-additional.nsuk-disabled {
    color: #929292;
    cursor: not-allowed;
  }

  .nsuk-dropdown {
    position: absolute;
    z-index: 100;
    top: 120%;
    left: 0;
    width: 250px;
    background-color: var(--ns-primary-color);
    border-radius: 8px;
    border: 1px solid var(--ns-border-color);
    padding: 10px;

    button {
      width: 90%;
      padding: 10px;
      border-radius: 8px;
    }

    button:hover {
      background-color: var(--ns-border-color);
    }
  }

  .nsuk-split {
    display: flex;
    align-items: end;
    margin: -10px;
    padding-top: 2px;
  }

  .nsuk-prefix {
    display: flex;
    align-items: center;
    margin: -10px;
    padding-top: 2px;
  }

  .nsuk-suffix {
    display: flex;
    align-items: center;
    margin: -10px;
    padding-top: 2px;
  }
</style>

<script lang="ts">
  import Icon from '@iconify/svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ input: string }>();

  export let placeholder: string = 'Placeholder';
  export let type: 'text' | 'password' | 'email' | 'number' | 'tel' = 'text';
  export let iconLeft: string | null = null;
  export let iconRight: string | null = null;
  export let disabled: boolean = false;
  export let size: 'sm' | 'md' = 'md';
  export let value: string = '';
  export let fullWidth: boolean = false;
  export let error: string | null = null;
  export let name: string;
  export let inputRef: HTMLInputElement | null = null;

  function handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    value = input.value;

    dispatch('input', value);
  }
</script>

<div class={`nsuk-wrapper ${fullWidth ? 'nsuk-full-width' : ''}`}>
  <div class="nsuk-input">
    {#if iconLeft}
      <div class="nsuk-input-icon__left">
        <Icon icon={iconLeft} width="14" height="14" style="color: white" />
      </div>
    {/if}
    {#if type === 'text'}
      <input
        bind:this={inputRef}
        bind:value
        type="text"
        {placeholder}
        {disabled}
        {name}
        class={`${size === 'sm' ? 'nsuk-size-sm' : 'nsuk-size-md'} ${iconLeft ? 'nsuk-pl' : ''} ${iconRight ? 'nsuk-pr' : ''} ${error ? 'nsuk-error' : ''}`}
        on:input={handleInput}
      />
    {/if}
    {#if type === 'password'}
      <input
        bind:this={inputRef}
        bind:value
        type="password"
        {placeholder}
        {disabled}
        {name}
        class={`${size === 'sm' ? 'nsuk-size-sm' : 'nsuk-size-md'} ${iconLeft ? 'nsuk-pl' : ''} ${iconRight ? 'nsuk-pr' : ''} ${error ? 'nsuk-error' : ''}`}
        on:input={handleInput}
      />
    {/if}
    {#if type === 'email'}
      <input
        bind:this={inputRef}
        bind:value
        type="email"
        {placeholder}
        {disabled}
        {name}
        class={`${size === 'sm' ? 'nsuk-size-sm' : 'nsuk-size-md'} ${iconLeft ? 'nsuk-pl' : ''} ${iconRight ? 'nsuk-pr' : ''} ${error ? 'nsuk-error' : ''}`}
        on:input={handleInput}
      />
    {/if}
    {#if type === 'number'}
      <input
        bind:this={inputRef}
        bind:value
        type="number"
        {placeholder}
        {disabled}
        {name}
        class={`${size === 'sm' ? 'nsuk-size-sm' : 'nsuk-size-md'} ${iconLeft ? 'nsuk-pl' : ''} ${iconRight ? 'nsuk-pr' : ''} ${error ? 'nsuk-error' : ''}`}
        on:input={handleInput}
      />
    {/if}
    {#if type === 'tel'}
      <input
        bind:this={inputRef}
        bind:value
        type="tel"
        {placeholder}
        {disabled}
        {name}
        class={`${size === 'sm' ? 'nsuk-size-sm' : 'nsuk-size-md'} ${iconLeft ? 'nsuk-pl' : ''} ${iconRight ? 'nsuk-pr' : ''} ${error ? 'nsuk-error' : ''}`}
        on:input={handleInput}
      />
    {/if}
    {#if iconRight}
      <div class="nsuk-input-icon__right">
        <Icon icon={iconRight} width="14" height="14" style="color: white" />
      </div>
    {/if}
  </div>
  {#if error}
    <p class="nsuk-error-message">{error}</p>
  {/if}
</div>

<style lang="scss">
  .nsuk-wrapper {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 250px;
    max-width: 380px;
  }

  .nsuk-full-width {
    width: 100%;
  }

  .nsuk-input {
    position: relative;
    border: none;
    padding: 0;
    width: 100%;

    input {
      min-width: 200px;
      max-width: 380px;
      width: 100%;
      background-color: transparent;
      color: white;
      border-radius: 8px;
      border: 1px solid #383c42;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
    }

    input::placeholder {
      color: var(--ns-text-secondary-color);
    }

    Input:hover {
      background-color: var(--ns-border-color);
    }

    input:disabled:hover {
      background-color: transparent;
    }

    input:disabled {
      border: 1px solid #1d251f;
    }

    input:disabled::placeholder {
      color: #1d251f;
    }

    input:focus {
      outline: none;
    }

    .nsuk-error {
      border-color: #f37261;
    }

    .nsuk-size-sm {
      padding: 10px 10px;
    }

    .nsuk-size-md {
      padding: 12px 10px;
    }

    &-icon__left {
      position: absolute;
      top: 50%;
      left: 12px;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
    }

    &-icon__right {
      position: absolute;
      top: 50%;
      right: 12px;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
    }

    .nsuk-pl {
      padding-left: 34px;
    }

    .nsuk-pr {
      padding-right: 34px;
    }
  }

  .nsuk-error-message {
    color: #f37261;
    font-size: 12px;
    margin-top: 5px;
  }
</style>

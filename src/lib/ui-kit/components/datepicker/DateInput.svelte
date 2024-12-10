<script lang="ts">
  import { toText } from './utils/date-utils.js';
  import type { Locale } from './utils';
  import { parse, createFormat, type FormatToken } from './utils';
  import DateTimePicker from './DatePicker.svelte';
  import { writable } from 'svelte/store';
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import Icon from '@iconify/svelte';
  import Portal from 'svelte-portal';

  const dispatch = createEventDispatcher<{
    select: Date;
  }>();

  const defaultDate = new Date();

  const innerStore = writable(null as Date | null);
  const store = (() => {
    return {
      subscribe: innerStore.subscribe,
      set: (date: Date | null) => {
        if (date === null || date === undefined) {
          innerStore.set(null);
          value = date;
        } else if (date.getTime() !== $innerStore?.getTime()) {
          innerStore.set(date);
          value = date;
        }
      }
    };
  })();

  export let value: Date | null = null;
  $: store.set(value);

  export let min = new Date(defaultDate.getFullYear() - 20, 0, 1);
  export let max = new Date(defaultDate.getFullYear() + 10, 11, 31, 23, 59, 59, 999);
  export let id: string | null = null;
  export let placeholder = 'GG.AA.YYYY';
  export let size: 'normal' | 'big' = 'normal';
  export let color: 'dark' | 'light' = 'dark';
  export let valid = true;
  export let disabled = false;
  export let required = false;
  let classes = '';
  export { classes as class };
  export let locale: Locale = {};

  export let format = 'dd.MM.yyyy';
  let formatTokens = createFormat(format, locale);
  $: formatTokens = createFormat(format, locale);

  function valueUpdate(value: Date | null, formatTokens: FormatToken[]) {
    text = toText(value, formatTokens);
  }
  $: valueUpdate($store, formatTokens);

  export let text = toText($store, formatTokens);

  function textUpdate(text: string, formatTokens: FormatToken[]) {
    if (text.length) {
      const result = parse(text, formatTokens, $store);
      if (result.date !== null) {
        valid = true;
        store.set(result.date);
      } else {
        valid = false;
      }
    } else {
      valid = true;
      if (value) {
        value = null;
        store.set(null);
      }
    }
  }
  $: textUpdate(text, formatTokens);

  export let visible = false;
  export let browseWithoutSelecting = false;
  export let timePrecision: 'minute' | 'second' | 'millisecond' | null = null;

  function onFocusOut(e: FocusEvent) {
    if (e.relatedTarget instanceof Node) {
      return;
    } else {
      visible = false;
    }
  }
  function keydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && visible) {
      visible = false;
      e.preventDefault();
      e.stopPropagation();
    } else if (e.key === 'Enter') {
      visible = !visible;
      e.preventDefault();
    }
  }

  function onSelect(e: CustomEvent<Date>) {
    dispatch('select', e.detail);
    visible = false;
  }

  let inputElement: HTMLElement | null = null;
  let position = { top: 0, left: 0 };
  let pickerElement: HTMLElement | null;
  let showAbove = false;

  async function handlePicker() {
    visible = !visible;
    if (visible) {
      await tick();
      const inputRect = inputElement?.getBoundingClientRect();
      if (!inputRect) return;
      const containerWidth = pickerElement?.offsetWidth || 0;
      const windowWidth = window.innerWidth;
      position = {
        top: inputRect!.bottom + window.scrollY,
        left: inputRect!.left + window.scrollX
      };
      if (position.left + containerWidth > windowWidth) {
        position.left = windowWidth - containerWidth - 20;
      }
    }
  }

  let windowWidth: number = 0;

  onMount(() => {
    windowWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      windowWidth = window.innerWidth;
    });
  });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="nsuk-date-time-field {classes}" on:focusout={onFocusOut} on:keydown={keydown}>
  <input
    bind:this={inputElement}
    class:nsuk-invalid={!valid}
    class={`${color === 'dark' ? 'nsuk-dark' : 'nsuk-light'}`}
    type="text"
    autocomplete="off"
    value={text}
    {id}
    {placeholder}
    {disabled}
    {required}
    on:click={handlePicker}
    on:input={(e) => {
      if (
        e instanceof InputEvent &&
        e.inputType === 'insertText' &&
        typeof e.data === 'string' &&
        e.currentTarget.value === text + e.data
      ) {
        let result = parse(text, formatTokens, $store);
        if (result.missingPunctuation !== '' && !result.missingPunctuation.startsWith(e.data)) {
          text = text + result.missingPunctuation + e.data;
          return;
        }
      }
      text = e.currentTarget.value;
    }}
    style={`background: ${color === 'dark' ? '#0d121a' : '#ffffff'}; color: ${color === 'dark' ? '#ffffff' : '#060B13'}`}
  />
  {#if visible && !disabled}
    <Portal target="body">
      <div
        class="nsuk-picker"
        class:nsuk-visible={visible}
        class:nsuk-above={showAbove}
        bind:this={pickerElement}
        style="{`top: ${position.top}px; left: ${position.left}px; width: ${size === 'normal' || (size === 'big' && windowWidth < 475) ? '280px' : '350px'}`};"
      >
        <DateTimePicker
          on:select={onSelect}
          bind:value={$store}
          {min}
          {max}
          {locale}
          {browseWithoutSelecting}
          {timePrecision}
          {color}
          {size}
        >
          <slot />
        </DateTimePicker>
      </div>
    </Portal>
  {/if}
  <span>
    <Icon
      icon="ion:calendar-outline"
      width="20"
      height="20"
      style={`color: ${color === 'dark' ? '#ffffff' : '#060B13'}; opacity: ${disabled ? 0.5 : 1}`}
    />
  </span>
</div>

<style lang="scss">
  .nsuk-date-time-field {
    position: relative;
  }

  input {
    min-width: 0px;
    box-sizing: border-box;
    padding: 14px 20px;
    margin: 0px;
    border: 1px solid rgba(103, 113, 137, 0.3);
    border-radius: 5px;
    width: fit-content;
    outline: none;
    font-size: 14px;
    transition: all 80ms cubic-bezier(0.4, 0, 0.2, 1);
    &:focus {
      box-shadow: 0px 0px 0px 2px var(--date-picker-highlight-shadow, rgba(#000000, 0.4));
    }

    &:disabled {
      opacity: 0.5;
    }
  }

  .nsuk-dark::placeholder {
    color: white;
  }

  .nsuk-light::placeholder {
    color: #060b13;
  }

  .nsuk-invalid {
    border: 1px solid rgba(#f92f72, 0.5);
    background-color: rgba(#f92f72, 0.1);

    &:focus {
      border-color: #f92f72;
      box-shadow: 0px 0px 0px 2px rgba(#f92f72, 0.5);
    }
  }

  .nsuk-picker {
    display: none;
    position: absolute;
    padding: 1px;
    margin-top: 10px;
    z-index: 10;

    &.nsuk-above {
      bottom: 100%;
    }

    &.nsuk-visible {
      display: block;
    }
  }

  span {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    pointer-events: none;
  }
</style>

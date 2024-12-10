<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let rows: number = 5;
  export let name: string = '';
  export let placeholder: string = 'Draft';
  export let disabled: boolean = false;
  export let value: string = '';
  export let width: 'default' | 'full' = 'default';

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    dispatch('input', value);
  }

  onMount(() => {
    const textareas = document.querySelectorAll('.resize-textarea');

    textareas.forEach((textarea) => {
      textarea.addEventListener('input', autoResize, false);
    });

    function autoResize() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    }
  });
</script>

<div class={`nsuk-textarea ${width === 'default' ? 'nsuk-textarea_width-default' : 'nsuk-textarea_width-full'}`}>
  <textarea {rows} {name} {placeholder} {disabled} {value} on:input={handleInput} />
</div>

<style lang="scss">
  .nsuk-textarea {
    &_width-default {
      width: 426px;
    }

    &_width-full {
      width: 100%;
    }

    textarea {
      background-color: var(--ns-bg-nav-color);
      border: 1px solid var(--ns-border-color);
      border-radius: 8px;
      min-width: 210px;
      width: 100%;
      color: white;
      font-size: 14px;
      white-space: pre-wrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      padding: 12px;
      resize: none;

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        box-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
      }

      &::placeholder {
        color: var(--ns-text-secondary-color);
      }

      &:disabled {
        border: 1px solid #1d251f;
      }

      &:disabled::placeholder {
        color: #1d251f;
      }
    }
    .nsuk-error {
      border: 1px solid #f37261;
    }
  }
  .nsuk-error-message {
    color: #f37261;
    font-size: 12px;
    margin-top: 15px;
  }
</style>

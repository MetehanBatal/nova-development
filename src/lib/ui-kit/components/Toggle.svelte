<script lang="ts">
  import { v4 as uuidv4 } from 'uuid';
  import { createEventDispatcher } from 'svelte';
  import * as Yup from 'yup';

  const dispatch = createEventDispatcher();

  export let value = false;
  export let isRequired = false;

  let checked = false;
  let errorMessage = '';

  const uniqueID = uuidv4();

  const validationSchema = Yup.object({
    value: Yup.string()
      .test('is-on', 'The toggle must be set to "on".', (val) => val === 'on')
      .required('This field is required if isRequired is true')
  });

  async function validateValue() {
    if (isRequired) {
      try {
        await validationSchema.validate({ value });
        errorMessage = '';
      } catch (error) {
        if (error instanceof Error) {
          errorMessage = error.message;
          dispatch('validationError', error.message);
        } else {
          console.error('Unexpected error:', error);
        }
      }
    }
  }

  function handleClick(event: Event) {
    const target = event.target as HTMLElement;

    const state = target?.getAttribute('aria-checked');

    checked = state !== 'true';

    value = checked;
    validateValue();
    dispatch('toggle', checked);
  }
</script>

<div class="nsuk-s nsuk-s--slider">
  <button role="switch" aria-checked={checked} aria-labelledby={`switch-${uniqueID}`} on:click={handleClick}></button>
  {#if errorMessage}
    <p class="nsuk-error-message">{errorMessage}</p>
  {/if}
</div>

<style>
  :root {
    --accent-color: var(--ns-main-purple-color);
    --gray: #ccc;
  }

  .nsuk-s--slider button {
    width: 40px;
    height: 24px;
    position: relative;
    margin: 0 0 0 0.5em !important;
    padding: 0 !important;
    background: var(--gray);
    border: none;
  }

  .nsuk-s--slider button::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: #fff;
    top: 0.12em;
    left: 0.2em;
    transition: transform 0.3s;
  }

  .nsuk-s--slider button[aria-checked='true'] {
    background-color: var(--accent-color);
  }

  .nsuk-s--slider button[aria-checked='true']::before {
    transform: translateX(1em);
    transition: transform 0.3s;
  }

  .nsuk-s--slider button:focus {
    box-shadow: 0 0px 0px 1px var(--accent-color);
  }

  .nsuk-s--slider button {
    border-radius: 1.5em;
  }

  .nsuk-s--slider button::before {
    border-radius: 100%;
  }

  .nsuk-s--slider button:focus {
    box-shadow: 0 0px 8px var(--accent-color);
    border-radius: 1.5em;
  }

  .nsuk-error-message {
    color: #f37261;
    font-size: 12px;
    margin-top: 5px;
  }
</style>

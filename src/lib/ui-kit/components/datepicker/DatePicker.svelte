<script lang="ts">
  import TimePicker from './TimePicker.svelte';
  import Button from './Button.svelte';
  import { getMonthLength, getCalendarDays, type CalendarDay } from './utils';
  import { getInnerLocale, type Locale } from './utils';
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher<{
    select: Date;
  }>();

  function cloneDate(d: Date) {
    return new Date(d.getTime());
  }

  export let value: Date | null = null;

  function setValue(d: Date) {
    if (d.getTime() !== value?.getTime()) {
      browseDate = clamp(d, min, max);
      value = cloneDate(browseDate);
    }
  }

  function setValueDate(d: Date) {
    if (d.getTime() !== value?.getTime()) {
      browseDate = clampDate(d, min, max);
      value = cloneDate(browseDate);
    }
  }

  function browse(d: Date) {
    browseDate = clampDate(d, min, max);
    if (!browseWithoutSelecting && value) {
      setValue(browseDate);
    }
  }

  function setTime(d: Date) {
    browseDate = clamp(d, min, max);
    if (value) {
      setValue(browseDate);
    }
    return browseDate;
  }

  const todayDate = new Date();

  const defaultDate = new Date();

  export let timePrecision: 'minute' | 'second' | 'millisecond' | null = null;
  export let min = new Date(defaultDate.getFullYear() - 20, 0, 1);
  export let max = new Date(defaultDate.getFullYear() + 10, 11, 31, 23, 59, 59, 999);
  export let color: 'dark' | 'light' = 'dark';
  export let size: 'normal' | 'big' = 'normal';

  $: if (value && value > max) {
    setValue(max);
  } else if (value && value < min) {
    setValue(min);
  }
  function clamp(d: Date, min: Date, max: Date) {
    if (d > max) {
      return cloneDate(max);
    } else if (d < min) {
      return cloneDate(min);
    } else {
      return cloneDate(d);
    }
  }
  function clampDate(d: Date, min: Date, max: Date) {
    const limit = clamp(d, min, max);
    if (limit.getTime() !== d.getTime()) {
      d = new Date(
        limit.getFullYear(),
        limit.getMonth(),
        limit.getDate(),
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
        d.getMilliseconds()
      );
      d = clamp(d, min, max);
    }
    return d;
  }

  let browseDate = value ? cloneDate(value) : cloneDate(clampDate(defaultDate, min, max));
  $: setBrowseDate(value);
  function setBrowseDate(value: Date | null) {
    if (browseDate.getTime() !== value?.getTime()) {
      browseDate = value ? cloneDate(value) : browseDate;
    }
  }

  let formatedDate: string = '';
  $: formatedDate = formatDate(browseDate);

  function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  }

  let years = getYears(min, max);
  $: years = getYears(min, max);
  function getYears(min: Date, max: Date) {
    let years = [];
    for (let i = min.getFullYear(); i <= max.getFullYear(); i++) {
      years.push(i);
    }
    return years;
  }

  export let locale: Locale = {};
  $: iLocale = getInnerLocale(locale);
  export let browseWithoutSelecting = false;

  $: browseYear = browseDate.getFullYear();
  function setYear(newYear: number) {
    browseDate.setFullYear(newYear);
    browse(browseDate);
  }

  $: browseMonth = browseDate.getMonth();
  function setMonth(newMonth: number) {
    let newYear = browseDate.getFullYear();
    if (newMonth === 12) {
      newMonth = 0;
      newYear++;
    } else if (newMonth === -1) {
      newMonth = 11;
      newYear--;
    }

    const maxDate = getMonthLength(newYear, newMonth);
    const newDate = Math.min(browseDate.getDate(), maxDate);
    browse(
      new Date(
        newYear,
        newMonth,
        newDate,
        browseDate.getHours(),
        browseDate.getMinutes(),
        browseDate.getSeconds(),
        browseDate.getMilliseconds()
      )
    );
  }

  $: calendarDays = getCalendarDays(browseDate, iLocale.weekStartsOn);

  let selectedDay: Date | null = null;
  function selectDay(calendarDay: CalendarDay) {
    if (dayIsInRange(calendarDay, min, max)) {
      browseDate.setFullYear(0);
      browseDate.setMonth(0);
      browseDate.setDate(1);
      browseDate.setFullYear(calendarDay.year);
      browseDate.setMonth(calendarDay.month);
      browseDate.setDate(calendarDay.number);
      setValueDate(browseDate);
      if (color === 'dark') {
        dispatch('select', cloneDate(browseDate));
      } else {
        selectedDay = cloneDate(browseDate);
      }
    }
  }

  function handleApply() {
    if (selectedDay) {
      dispatch('select', selectedDay);
    }
  }

  function dayIsInRange(calendarDay: CalendarDay, min: Date, max: Date) {
    const date = new Date(calendarDay.year, calendarDay.month, calendarDay.number);
    const minDate = new Date(min.getFullYear(), min.getMonth(), min.getDate());
    const maxDate = new Date(max.getFullYear(), max.getMonth(), max.getDate());
    return date >= minDate && date <= maxDate;
  }
  function shiftKeydown(e: KeyboardEvent) {
    if (e.shiftKey && e.key === 'ArrowUp') {
      setYear(browseDate.getFullYear() - 1);
    } else if (e.shiftKey && e.key === 'ArrowDown') {
      setYear(browseDate.getFullYear() + 1);
    } else if (e.shiftKey && e.key === 'ArrowLeft') {
      setMonth(browseDate.getMonth() - 1);
    } else if (e.shiftKey && e.key === 'ArrowRight') {
      setMonth(browseDate.getMonth() + 1);
    } else {
      return false;
    }
    e.preventDefault();
    return true;
  }
  function yearKeydown(e: KeyboardEvent) {
    let shift = e.shiftKey || e.altKey;
    if (shift) {
      shiftKeydown(e);
      return;
    } else if (e.key === 'ArrowUp') {
      setYear(browseDate.getFullYear() - 1);
    } else if (e.key === 'ArrowDown') {
      setYear(browseDate.getFullYear() + 1);
    } else if (e.key === 'ArrowLeft') {
      setMonth(browseDate.getMonth() - 1);
    } else if (e.key === 'ArrowRight') {
      setMonth(browseDate.getMonth() + 1);
    } else {
      shiftKeydown(e);
      return;
    }
    e.preventDefault();
  }
  function monthKeydown(e: KeyboardEvent) {
    let shift = e.shiftKey || e.altKey;
    if (shift) {
      shiftKeydown(e);
      return;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      setMonth(browseDate.getMonth() - 1);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      setMonth(browseDate.getMonth() + 1);
    } else {
      shiftKeydown(e);
      return;
    }
    e.preventDefault();
  }
  function keydown(e: KeyboardEvent) {
    let shift = e.shiftKey || e.altKey;
    if ((e.target as HTMLElement)?.tagName === 'SELECT' || (e.target as HTMLElement)?.tagName === 'SPAN') {
      return;
    }
    if (shift) {
      shiftKeydown(e);
      return;
    } else if (e.key === 'ArrowUp') {
      browseDate.setDate(browseDate.getDate() - 7);
      setValueDate(browseDate);
    } else if (e.key === 'ArrowDown') {
      browseDate.setDate(browseDate.getDate() + 7);
      setValueDate(browseDate);
    } else if (e.key === 'ArrowLeft') {
      browseDate.setDate(browseDate.getDate() - 1);
      setValueDate(browseDate);
    } else if (e.key === 'ArrowRight') {
      browseDate.setDate(browseDate.getDate() + 1);
      setValueDate(browseDate);
    } else if (e.key === 'Enter') {
      setValue(browseDate);
      dispatch('select', cloneDate(browseDate));
    } else {
      return;
    }
    e.preventDefault();
  }

  let windowWidth: number = 0;

  onMount(() => {
    windowWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      windowWidth = window.innerWidth;
    });
  });
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class={`nsuk-date-time-picker ${color === 'dark' ? 'nsuk-dark' : 'nsuk-light'}`}
  on:focusout
  tabindex="0"
  on:keydown={keydown}
>
  <div class="nsuk-tab-container" tabindex="-1">
    <div class="nsuk-top">
      <button
        type="button"
        aria-label="Previous month"
        class="nsuk-page-button"
        tabindex="-1"
        on:click={() => setMonth(browseDate.getMonth() - 1)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={`fill: ${color === 'dark' ? '#ffffff' : '#0D121A'}`}
          ><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" transform="rotate(180, 12, 12)" /></svg
        >
      </button>
      <div class="nsuk-top-inner">
        <div class="nsuk-dropdown nsuk-month">
          <select
            value={browseMonth}
            on:keydown={monthKeydown}
            on:input={(e) => setMonth(parseInt(e.currentTarget.value))}
          >
            {#each iLocale.months as monthName, i}
              <option
                class={`${color} === 'dark' ? 'nsuk-dark' : 'nsuk-light'`}
                disabled={new Date(browseYear, i, getMonthLength(browseYear, i), 23, 59, 59, 999) < min ||
                  new Date(browseYear, i) > max}
                value={i}
              >
                &nbsp;&nbsp;&nbsp;&nbsp;{monthName}&nbsp;&nbsp;&nbsp;&nbsp;
              </option>
            {/each}
          </select>
          <select class={`nsuk-dummy-select ${color === 'dark' ? 'nsuk-dark' : 'nsuk-light'}`} tabindex="-1">
            {#each iLocale.months as monthName, i}
              <option value={i} selected={i === browseMonth}>{monthName}</option>
            {/each}
          </select>
        </div>
        <div class="nsuk-dropdown nsuk-year">
          <select
            value={browseYear}
            on:input={(e) => setYear(parseInt(e.currentTarget.value))}
            on:keydown={yearKeydown}
          >
            {#each years as v}
              <option class={`${color} === 'dark' ? 'nsuk-dark' : 'nsuk-light'`} value={v}
                >&nbsp;&nbsp;&nbsp;&nbsp;{v}&nbsp;&nbsp;&nbsp;&nbsp;</option
              >
            {/each}
          </select>
          <select class={`nsuk-dummy-select ${color === 'dark' ? 'nsuk-dark' : 'nsuk-light'}`} tabindex="-1">
            {#each years as v}
              <option value={v} selected={v === browseDate.getFullYear()}>{v}</option>
            {/each}
          </select>
        </div>
      </div>
      <button
        type="button"
        aria-label="Next month"
        class="nsuk-page-button"
        tabindex="-1"
        on:click={() => setMonth(browseDate.getMonth() + 1)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={`fill: ${color === 'dark' ? '#ffffff' : '#0D121A'}`}
          ><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" /></svg
        >
      </button>
    </div>
    <div class="nsuk-header">
      <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
      {#each Array(7) as _, i}
        {#if i + iLocale.weekStartsOn < 7}
          <div class="nsuk-header-cell">{iLocale.weekdays[iLocale.weekStartsOn + i]}</div>
        {:else}
          <div class="nsuk-header-cell">{iLocale.weekdays[iLocale.weekStartsOn + i - 7]}</div>
        {/if}
      {/each}
    </div>
    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
    {#each Array(6) as _, weekIndex}
      <div
        class="nsuk-week"
        style={`gap: ${size === 'normal' || (size === 'big' && windowWidth < 475) ? '5px' : '20px'}`}
      >
        {#each calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7) as calendarDay}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            class="nsuk-cell"
            on:click={() => selectDay(calendarDay)}
            class:nsuk-disabled={!dayIsInRange(calendarDay, min, max)}
            class:nsuk-selected={value &&
              calendarDay.year === value.getFullYear() &&
              calendarDay.month === value.getMonth() &&
              calendarDay.number === value.getDate()}
            class:nsuk-today={calendarDay.year === todayDate.getFullYear() &&
              calendarDay.month === todayDate.getMonth() &&
              calendarDay.number === todayDate.getDate()}
            class:nsuk-other-month={calendarDay.month !== browseMonth}
            class:nsuk-cell--big={size === 'big'}
            class:nsuk-cell--normal={size === 'normal'}
            class:nsuk-cell--light={color === 'light'}
            class:nsuk-cell--dark={color === 'dark'}
          >
            <span>{calendarDay.number}</span>
          </div>
        {/each}
      </div>
    {/each}

    {#if color === 'light'}
      <div class="nsuk-tab-container__input">
        <input type="text" bind:value={formatedDate} />
      </div>
      <div class="nsuk-tab-container__buttons">
        <Button type="transparent">Cancel</Button>
        <Button type="colored" on:click={handleApply}>Apply</Button>
      </div>
    {/if}

    <TimePicker {timePrecision} bind:browseDate {setTime} />

    <slot />
  </div>
</div>

<style lang="scss">
  .nsuk-date-time-picker {
    display: inline-block;
    color: #ffffff;
    user-select: none;
    -webkit-user-select: none;
    padding: 0.5rem;
    cursor: default;
    font-size: 0.75rem;
    border: 1px solid rgba(103, 113, 137, 0.3);
    border-radius: 3px;
    box-shadow:
      0px 2px 6px rgba(#000000, 0.08),
      0px 2px 6px rgba(#000000, 0.11);
    outline: none;
    transition: all 80ms cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;

    &:focus {
      border-color: var(--date-picker-highlight-border, #0269f7);
      box-shadow: 0px 0px 0px 2px var(--date-picker-highlight-shadow, rgba(#0269f7, 0.4));
    }
  }

  .nsuk-tab-container {
    outline: none;

    &__input {
      padding: 0 15px;
      margin-bottom: 10px;
      box-sizing: border-box;

      input {
        width: 100%;
        border: 1px solid rgba(136, 136, 138, 0.16);
        border-radius: 8px;
        text-align: center;
        color: var(--ns-secondary-color);
        padding: 8px 12px;

        &:focus {
          outline: none;
        }
      }
    }

    &__buttons {
      display: flex;
      gap: 8px;
      justify-content: end;
      width: 100%;
      padding: 0 15px;
      box-sizing: border-box;
    }
  }

  .nsuk-dark {
    color: #ffffff;
    background: var(--ns-secondary-color);
  }

  .nsuk-light {
    color: var(--ns-secondary-color);
    background: #ffffff;
  }

  .nsuk-top {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 0.5rem;

    &-inner {
      flex-grow: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }

  .nsuk-dropdown {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    position: relative;
    display: flex;
  }

  .nsuk-month {
    flex-grow: 1;
    text-align: right;

    .nsuk-dummy-select {
      text-align: right;
    }
  }

  .nsuk-year {
    flex-grow: 1;
  }

  svg {
    display: block;
    fill: #ffffff;
    opacity: 0.75;
    outline: none;
  }

  .nsuk-page-button {
    background-color: transparent;
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
    border-radius: 5px;
    box-sizing: border-box;
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: rgba(#808080, 0.08);
      border: 1px solid rgba(#808080, 0.08);
    }

    svg {
      width: 0.68rem;
      height: 0.68rem;
    }
  }

  select.nsuk-dummy-select {
    position: absolute;
    width: 100%;
    pointer-events: none;
    outline: none;
    border: none;
    font-size: 14px;
  }

  select:focus + select.nsuk-dummy-select {
    border: none;
    outline: none;
  }

  select:not(.nsuk-dummy-select) {
    opacity: 0;
  }

  select {
    font-size: inherit;
    font-family: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    flex-grow: 1;
    height: 1.5rem;
    border: 1px solid rgba(108, 120, 147, 0.3);
    outline: none;
    transition: all 80ms cubic-bezier(0.4, 0, 0.2, 1);
    background-image: none;

    option {
      color: #ffffff;
      background-color: var(--ns-secondary-color);
      padding: 0.35rem;
    }

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #2f2c2c;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #888;
      border-radius: 4px;

      &:hover {
        background-color: #555;
      }
    }

    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
  }

  .nsuk-header {
    display: flex;
    font-weight: 600;
    padding-bottom: 2px;

    .nsuk-header-cell {
      width: 1.875rem;
      text-align: center;
      flex-grow: 1;
      color: var(--ns-text-secondary-color);
    }
  }

  .nsuk-week {
    display: flex;
  }

  .nsuk-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    border-radius: 100%;
    font-size: 14px;
    box-sizing: border-box;
    border: 2px solid transparent;
    width: 32px;
    height: 32px;

    &--light.nsuk-today {
      border: 2px solid var(--ns-main-purple-color);
    }

    &--dark.nsuk-today {
      font-weight: 600;
      border: 2px solid var(--date-picker-today-border, rgba(#808080, 0.3));
    }

    &:hover {
      background-color: rgba(#808080, 0.08);
    }

    &.nsuk-nsuk-disabled {
      visibility: hidden;

      &:hover {
        border: none;
        background-color: transparent;
      }
    }

    &.nsuk-other-month span {
      opacity: 0.4;
    }

    &--dark.nsuk-selected {
      color: var(--date-picker-selected-color, inherit);
      background: var(--date-picker-selected-background, rgba(2, 105, 247, 0.2));
      border: 2px solid var(--date-picker-highlight-border, #0269f7);
    }

    &--light.nsuk-selected {
      color: white;
      background: var(--ns-main-purple-color);
    }
  }
</style>

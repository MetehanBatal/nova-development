<script lang="ts">
  import { clickOutside } from 'svelte-use-click-outside';
  import Icon from '@iconify/svelte';
  import { createEventDispatcher, tick } from 'svelte';
  import Checkbox from './Checkbox.svelte';
  import type { SingleItem, GroupedItems, Items } from './types';
  import Portal from 'svelte-portal';
  import { onMount } from 'svelte';

  const dispatch = createEventDispatcher();

  export let name: string;
  export let placeholder: string;
  export let icon: string | null = null;
  export let search: boolean = false;
  export let items: Items;
  export let type: 'select' | 'multi' = 'select';
  export let value: SingleItem | GroupedItems[] | string | unknown = '';
  export let error: string | null = null;
  export let border: boolean = true;
  let initialItems: Items = items;
  let showDropdown: boolean = false;
  let isRotatedArrow: boolean = false;
  let selectedItem: SingleItem = { label: '', key: '' };
  let selectedItems: GroupedItems[] = [];
  let showInfo: boolean = false;
  let arrayOfSelectedItems: string[] = [];
  let inputElement: HTMLElement | null = null;
  let dropdownElement: HTMLElement | null = null;
  let position = { top: 0, left: 0 };
  let isClickOutsideHandler: boolean = false;
  let block: HTMLElement | null = null;
  let maxHeightDropdown: number = 0;

  async function handleDropdown() {
    if (isClickOutsideHandler) return;
    showDropdown = !showDropdown;
    isRotatedArrow = !isRotatedArrow;
    if (showDropdown) {
      await tick();
      const rect = inputElement?.getBoundingClientRect();
      if (!rect) return;
      const containerWidth = dropdownElement?.offsetWidth || 0;
      const windowWidth = window.innerWidth;
      position = {
        top: rect!.bottom + window.scrollY,
        left: rect!.left + window.scrollX
      };
      if (position.left + containerWidth > windowWidth) {
        position.left = windowWidth - containerWidth;
      }
    }
  }

  function clickOutsideHandler() {
    isClickOutsideHandler = true;
    if (!showDropdown) return;
    showDropdown = false;
    isRotatedArrow = !isRotatedArrow;
    if (type === 'select') {
      items = initialItems;
    }
    if (type === 'multi') {
      items = (initialItems as GroupedItems[]).map((group: GroupedItems) => {
        return {
          title: group.title,
          key: group.key,
          items: group.items.map((item: SingleItem) => {
            return {
              ...item,
              checked: selectedItems
                .find((selectedItem) => selectedItem.key === group.key)
                ?.items.some((i) => i.key === item.key)
            };
          })
        };
      });
    }
    setTimeout(() => {
      isClickOutsideHandler = false;
    }, 300);
  }

  function handleSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const searchValue = input.value;
    if (searchValue.length > 0) {
      if (type === 'select') {
        items = (initialItems as SingleItem[]).filter((item: SingleItem) =>
          item.label.toLowerCase().includes(searchValue.trim().toLowerCase())
        );
      }

      if (type === 'multi') {
        items = (initialItems as GroupedItems[])
          .map((group: GroupedItems) => {
            return {
              title: group.title,
              key: group.key,
              items: group.items.filter((item: SingleItem) =>
                item.label.toLowerCase().includes(searchValue.trim().toLowerCase())
              )
            };
          })
          .filter((group: GroupedItems) => group.items.length > 0);
      }
    } else {
      if (type === 'select') {
        items = initialItems;
      }
      if (type === 'multi') {
        items = (initialItems as GroupedItems[]).map((group: GroupedItems) => {
          return {
            title: group.title,
            key: group.key,
            items: group.items.map((item: SingleItem) => {
              return {
                ...item,
                checked: selectedItems
                  .find((selectedItem) => selectedItem.key === group.key)
                  ?.items.some((i) => i.key === item.key)
              };
            })
          };
        });
      }
    }
  }

  function handleSelectItem(item: SingleItem) {
    selectedItem = item;
    showDropdown = false;
    isRotatedArrow = false;
    items = initialItems;
    value = item as unknown as SingleItem;
    dispatch('selected', item);
  }

  function handleMultipelItems(group: { title: string; key: string | number }, item: SingleItem) {
    if (value && type === 'multi') {
      selectedItems = value as GroupedItems[];
    }
    const groupIndex = selectedItems.findIndex((g) => g.key === group.key);

    if (groupIndex !== -1) {
      const itemIndex = selectedItems[groupIndex].items.findIndex((selectedItem) => selectedItem.label === item.label);

      if (itemIndex !== -1) {
        selectedItems[groupIndex].items.splice(itemIndex, 1);

        if (selectedItems[groupIndex].items.length === 0) {
          selectedItems.splice(groupIndex, 1);
        }
      } else {
        selectedItems[groupIndex].items.push(item);
      }
    } else {
      selectedItems.push({
        title: group.title,
        key: group.key,
        items: [item]
      });
    }
    value = selectedItems as unknown as GroupedItems[];

    arrayOfSelectedItems = selectedItems.map((selectedItem) => {
      return selectedItem.items.map((item) => item.label).join(', ');
    });

    items = items.map((i) => {
      if ('items' in i && group.key === i.key) {
        return {
          ...i,
          items: i.items.map((subItem: SingleItem) => {
            if (subItem.key === item.key) {
              return {
                ...subItem,
                checked: !subItem.checked
              };
            }
            return subItem;
          })
        };
      }
      return i;
    }) as Items;

    dispatch('selected', selectedItems);
  }

  const calculateDistance = () => {
    if (block) {
      const rect = block.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      maxHeightDropdown = viewportHeight - rect.bottom - 100;
    }
  };

  function handleInfo(event: Event) {
    event.stopPropagation();
    showInfo = !showInfo;
  }

  function clickOutsideInfo() {
    showInfo = false;
  }

  const isSingleItem = (item: SingleItem | GroupedItems): item is SingleItem =>
    typeof item === 'object' && 'label' in item && 'key' in item;

  const isSingleItemArray = (items: Items): items is SingleItem[] =>
    Array.isArray(items) && items.every((item): item is SingleItem => 'label' in item && 'key' in item);

  const isSingleItemValue = (value: unknown): value is SingleItem =>
    value !== null && typeof value === 'object' && 'key' in value && 'label' in value;

  function isGroupedItem(item: SingleItem | GroupedItems): item is GroupedItems {
    return 'title' in item;
  }

  $: {
    console.log('value', value);
    getObjectSelectValue();
    getStringSelectValue();
    getArrayMultiValue();
    getStringMultiValue();
  }

  const getObjectSelectValue = () => {
    if (value && typeof value === 'object' && isSingleItemValue(value) && type === 'select') {
      console.log(222);
      const singleValue = value as SingleItem;
      if (Array.isArray(items) && isSingleItemArray(items)) {
        const init = items.find((item) => item.key === singleValue.key);
        selectedItem = init ? init : { label: '', key: '' };
      }
    }
    if (!value) {
      selectedItem = { label: '', key: '' };
    }
  };

  const getStringSelectValue = () => {
    if (value && typeof value === 'string' && type === 'select') {
      console.log(333);
      if (Array.isArray(items) && isSingleItemArray(items)) {
        const init = items.find((item) => item.label === value);
        selectedItem = init ? init : { label: '', key: '' };
      }
    }
    if (!value) {
      selectedItem = { label: '', key: '' };
    }
  };

  const getArrayMultiValue = () => {
    if (
      value &&
      Array.isArray(value) &&
      value.every((item) => 'title' in item && 'items' in item) &&
      type === 'multi' &&
      value.length > 0
    ) {
      console.log(444);
      const groupedValue = value as GroupedItems[];

      arrayOfSelectedItems = groupedValue.map((group) => {
        return group.items.map((item) => item.label).join(', ');
      });
      items = items.map((i) => {
        if ('items' in i) {
          return {
            ...i,
            items: i.items.map((subItem: SingleItem) => {
              if (
                groupedValue.some((selectedItem: GroupedItems) =>
                  selectedItem.items.some((i) => i.label === subItem.label)
                )
              ) {
                return {
                  ...subItem,
                  checked: true
                };
              }
              return subItem;
            })
          };
        }
        return i;
      }) as Items;
      console.log('items', items);
    }
    if (!value || (Array.isArray(value) && value.length === 0)) {
      arrayOfSelectedItems = [];
    }
  };

  const getStringMultiValue = () => {
    if (value && typeof value === 'string' && type === 'multi') {
      console.log(555);
      arrayOfSelectedItems = [value];
      items = items.map((i) => {
        if ('items' in i) {
          return {
            ...i,
            items: i.items.map((subItem: SingleItem) => {
              if (subItem.label === value) {
                return {
                  ...subItem,
                  checked: true
                };
              }
              return subItem;
            })
          };
        }
        return i;
      }) as Items;
    }
    if (!value || (Array.isArray(value) && value.length === 0)) {
      arrayOfSelectedItems = [];
    }
  };

  onMount(() => {
    calculateDistance();
    window.addEventListener('resize', calculateDistance);
    getObjectSelectValue();
    getStringSelectValue();
    getArrayMultiValue();
    getStringMultiValue();

    return () => {
      window.removeEventListener('resize', calculateDistance);
    };
  });
</script>

<div>
  <div class="nsuk-combobox" bind:this={inputElement}>
    <div bind:this={block}>
      {#if type === 'select'}
        <input
          {name}
          type="text"
          bind:value={selectedItem.label}
          {placeholder}
          readonly
          on:click|stopPropagation={handleDropdown}
          style={`padding-left: ${icon ? '40px;' : ';'} border: ${border && !error ? '1px solid #212830;' : error && border ? '1px solid #f37261;' : '1px solid transparent;'} background-color: ${border ? '#0b1018' : 'transparent'}`}
        />
      {/if}
      {#if type === 'multi'}
        <input
          {name}
          type="text"
          bind:value={arrayOfSelectedItems}
          {placeholder}
          readonly
          on:click|stopPropagation={handleDropdown}
          style={`padding-left: ${icon ? '40px;' : ';'} border: ${border && !error ? '1px solid #212830;' : error && border ? '1px solid #f37261;' : '1px solid transparent;'} background-color: ${border ? '#0b1018' : 'transparent'}`}
        />
      {/if}
    </div>
    {#if icon}
      <div class="nsuk-combobox-icon"><Icon {icon} width="18" height="18" style="color: white" /></div>
    {/if}
    <button class="nsuk-arrow" on:click|stopPropagation={handleDropdown}>
      <Icon
        icon="ri:arrow-down-s-line"
        width="20"
        height="20"
        style={`color: white; transition: transform 300ms ease-in-out; ${isRotatedArrow && showDropdown ? 'transform: rotate(180deg);' : ''}`}
        class="nsuk-arrow-icon"
      />
    </button>
    {#if showDropdown}
      <Portal target="body">
        <div
          class="nsuk-dropdown"
          style={`top: ${position.top}px; left: ${position.left}px;`}
          use:clickOutside={clickOutsideHandler}
          use:clickOutside={clickOutsideInfo}
          bind:this={dropdownElement}
        >
          {#if search}
            <div class="nsuk-dropdown-search">
              <input type="text" placeholder="Search" on:input={handleSearch} />
              <span class="nsuk-dropdown-search__icon">
                <Icon icon="iconamoon:search-light" width="16" height="16" style="color: #88888A" />
              </span>
            </div>
          {/if}
          {#if type === 'select'}
            <div class="nsuk-dropdown-items" style={`max-height: ${maxHeightDropdown}px`}>
              {#each items as item}
                {#if isSingleItem(item)}
                  <div
                    class="nsuk-dropdown-items__select"
                    on:click={() => isSingleItem(item) && handleSelectItem(item)}
                    on:keydown={() => isSingleItem(item) && handleSelectItem(item)}
                    tabindex="0"
                    role="option"
                    aria-selected={item.label === selectedItem.label}
                    style={`${item.icon ? 'padding-left: 36px;' : ''}${
                      item.label === selectedItem.label ? ' background-color: #1e222b;' : ''
                    }`}
                  >
                    {#if item.icon}
                      <span class="nsuk-dropdown-items__select-icon">
                        <Icon icon={item.icon} width="16" height="16" style="color: white" />
                      </span>
                    {/if}
                    {item.label}
                    {#if item.label === selectedItem.label}
                      <span class="nsuk-dropdown-items__select-icon-check">
                        <Icon icon="ic:outline-check" width="16" height="16" style="color: white" />
                      </span>
                    {/if}
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
          {#if type === 'multi'}
            <div class="nsuk-dropdown-items" style={`max-height: ${maxHeightDropdown}px`}>
              {#each items as item}
                {#if isGroupedItem(item)}
                  <li class="nsuk-dropdown-items__multi">
                    <div class="nsuk-dropdown-items__multi-title">{item.title}</div>
                    <ul class="nsuk-dropdown-items__multi-items">
                      {#each item.items as subItem}
                        <li
                          class="nsuk-dropdown-items__multi-item"
                          on:click={() =>
                            isGroupedItem(item) && handleMultipelItems({ title: item.title, key: item.key }, subItem)}
                          on:keydown={() =>
                            isGroupedItem(item) && handleMultipelItems({ title: item.title, key: item.key }, subItem)}
                          tabindex="0"
                          role="option"
                          aria-selected={subItem.label ===
                            selectedItems.find((i) => i.key === item.key)?.items.find((i) => i.key === subItem.key)
                              ?.label}
                          style={`${subItem.checked ? 'background-color: #1e222b;' : ''}`}
                        >
                          <Checkbox
                            checked={subItem.checked}
                            on:handleChecked={() =>
                              isGroupedItem(item) && handleMultipelItems({ title: item.title, key: item.key }, subItem)}
                          ></Checkbox>
                          <div class="nsuk-dropdown-items__multi-item-label">{subItem.label}</div>
                          {#if subItem.info || subItem.link}
                            <div class="nsuk-dropdown-items__multi-item-buttons">
                              {#if subItem.info}
                                <button
                                  class="nsuk-dropdown-items__multi-item-info"
                                  on:click={handleInfo}
                                  use:clickOutside={clickOutsideInfo}
                                >
                                  <Icon icon="bi:info-circle" width="14" height="14" style="color: #88888A" />
                                  {#if showInfo}
                                    <span>{subItem.info}</span>
                                  {/if}
                                </button>
                              {/if}
                              {#if subItem.link}
                                <a href={subItem.link} target="_blank" on:click={(event) => event.stopPropagation()}>
                                  <Icon
                                    icon="iconamoon:link-external-light"
                                    width="18"
                                    height="18"
                                    style="color: #88888A"
                                  />
                                </a>
                              {/if}
                            </div>
                          {/if}
                        </li>
                      {/each}
                    </ul>
                  </li>
                {/if}
              {/each}
            </div>
          {/if}
        </div></Portal
      >
    {/if}
  </div>
  {#if error}
    <p class="nsuk-error-message">{error}</p>
  {/if}
</div>

<style lang="scss">
  .nsuk-combobox {
    position: relative;
    z-index: 1;

    &-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      padding-top: 4px;
    }

    input {
      border-radius: 8px;
      padding: 14px 40px 14px 14px;
      color: white;
      font-size: 14px;
      cursor: pointer;

      &::placeholder {
        color: var(--ns-text-secondary-color);
        opacity: 0.8;
        font-size: 14px;
      }

      &:focus {
        outline: none;
      }
    }
  }

  .nsuk-error-message {
    color: #f37261;
    font-size: 12px;
    margin-top: 10px;
  }
  .nsuk-dropdown {
    position: absolute;
    background-color: #0b1018;
    border: 1px solid var(--ns-text-gray-color);
    border-radius: 8px;
    padding: 10px 0;
    margin-top: 4px;
    color: white;
    width: fit-content;
    z-index: 10;

    &-items {
      overflow: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--ns-text-gray-color) transparent;

      &::-webkit-scrollbar {
        width: 5px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: var(--ns-text-gray-color);
      }

      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      &__select {
        padding: 12px 36px 12px 12px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
        position: relative;

        &-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          padding-top: 4px;
        }

        &-icon-check {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          padding-top: 4px;
        }

        &:hover {
          background-color: #333a49;
        }
      }

      &__multi {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      &__multi-title {
        padding: 12px;
        font-size: 14px;
        font-weight: 500;
        color: var(--ns-text-secondary-color);
        border-bottom: 1px solid var(--ns-border-color);
      }

      &__multi-item {
        display: flex;
        align-items: start;
        padding: 14px 12px;
        font-size: 14px;
        font-weight: 400;
        position: relative;

        &:hover {
          background-color: #333a49;
        }

        &-buttons {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: 20px;
          margin-top: -5px;

          a {
            display: inline-block;
            padding-top: 4px;
          }
        }

        &-label {
          margin-left: 8px;
          text-wrap: nowrap;
        }

        &-info {
          position: relative;
          display: flex;
          align-items: center;
          color: var(--ns-text-secondary-color);
          cursor: pointer;

          span {
            position: absolute;
            bottom: 180%;
            left: 50%;
            transform: translateX(-50%);
            background-color: #0b1018;
            padding: 10px;
            border: 1px solid var(--ns-border-color);
            border-radius: 8px;
            color: white;
          }
        }
      }
    }

    &-search {
      width: 100%;
      position: relative;

      input {
        border: none;
        border-bottom: 1px solid #212830;
        background-color: #0b1018;
        border-radius: 8px;
        padding: 6px 14px 14px 40px;
        color: var(--ns-text-secondary-color);
        font-size: 12px;
        width: 100%;
        box-sizing: border-box;

        &::placeholder {
          color: var(--ns-text-secondary-color);
          font-size: 14px;
        }

        &:focus {
          outline: none;
        }
      }

      &__icon {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        padding-bottom: 6px;
      }
    }
  }

  .nsuk-arrow {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    padding-top: 4px;
  }
</style>

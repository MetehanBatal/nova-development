<script lang="ts">
  import Icon from '@iconify/svelte';

  export let label: string = '';
  export let type: 'default' | 'icon' | 'text' = 'default';
  export let bgColor: string = 'transparent';
  export let iconColor: string = 'white';
  export let textColor: string = 'white';
  export let isRounded: boolean = true;
  export let size: 'default' | 'thin' | 'wide' | 'wide-thin' = 'default';
  export let iconPosition: 'left' | 'right' = 'left';
  export let iconName: string = '';
  export let border: string = 'none';
  let padding: string = '2px 6px';

  $: {
    if (size === 'thin') {
      padding = '0 4px';
    } else if (size === 'wide') {
      padding = '2px 12px';
    } else if (size === 'wide-thin') {
      padding = '0 12px';
    } else {
      padding = '2px 6px';
    }
  }
</script>

<div
  class="nsuk-badge"
  style={`background-color: ${bgColor};border: 1px solid ${border};padding: ${padding};border-radius: ${isRounded ? '30px' : '4px'}`}
>
  {#if (type === 'default' || type === 'icon') && iconPosition === 'left' && iconName}
    <div class="nsuk-badge__icon">
      <Icon icon={iconName} width="16" height="16" style={`color: ${iconColor}`} />
    </div>
  {/if}
  {#if (type === 'default' || type === 'text') && label}
    <div class="nsuk-badge__label" style={`color: ${textColor}`}>
      {label}
    </div>
  {/if}
  {#if (type === 'default' || type === 'icon') && iconPosition === 'right' && iconName}
    <div class="nsuk-badge__icon">
      <Icon icon={iconName} width="16" height="16" style={`color: ${iconColor}`} />
    </div>
  {/if}
</div>

<style lang="scss">
  .nsuk-badge {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    width: fit-content;

    &__label {
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
      text-wrap: nowrap;
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>

<script>
    import DropdownNoCheckBox from "$lib/toolkit/DropdownNoCheckBox.svelte";
    import { goto } from '$app/navigation';

    let selectedActionIndex = 0;
    let selectedfilterOptionsIndex = 2;
    let isActive = false;
    let isActiveFilterOption = false;

    let actions = [
        { name: "Export", index: 0 },
        { name: "Import", index: 1 },
        { name: "Share", index: 2 },
    ];

    let productOrders = [
        {
            name: "Orders",
            value: 432,
            percentage: 0,
            isIncreased: true,
            showChart: true,
        },
        {
            name: "Ordered Items",
            value: 1389,
            percentage: 20.9,
            isIncreased: false,
            showChart: false,
        },
        {
            name: "Returned Items",
            value: 12,
            percentage: 12,
            isIncreased: true,
            showChart: false,
        },
        {
            name: "Total Revenue",
            value: "$432",
            percentage: 20.9,
            isIncreased: true,
            showChart: true,
        },
        {
            name: "Average Revenue",
            value: "$189",
            percentage: 12.6,
            isIncreased: false,
            showChart: false,
        },
        {
            name: "Time to Fulfil",
            value: "12h 13m",
            percentage: 0,
            isIncreased: true,
            showChart: false,
        },
    ];

    let filterOptions = [
        { label: "Today", description: "Compared to the previous day", span: 24 },
        {
        label: "Last 7 Days",
        description: "Compared to the previous 7 days",
        span: 168,
        },
        {
        label: "Last 30 Days",
        description: "Compared to the previous 30 days",
        span: 720,
        },
    ];
</script>

<!-- top nav -->
<div class="product-top-nav">
  <span class="title">Products</span>
  <div class="right">
    <DropdownNoCheckBox title = "More Actions" {actions} {isActive}/>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="cta-button primary" on:click={() => goto("/products/viewProducts?id=add-new")}>Add product</div>
  </div>
</div>

<!-- product order nav -->
<div class="product-card custom-bar">
  <div class="product-order-nav">
    <div class="order-card">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="nav-dropdown"
        class:active={isActiveFilterOption}
        on:click={() => (isActiveFilterOption = !isActiveFilterOption)}
      >
        <div class="nav-dropdown-title">
          <p>{filterOptions[selectedfilterOptionsIndex]["label"]}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M10.5 8.75L7 5.25L3.5 8.75"
              stroke="white"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </div>
      </div>
      <div class="navbar-dropdown-content" class:active={isActiveFilterOption}>
        {#each filterOptions as option, index}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div class="checkbox-dropdown-content">
            <label class="input-holder checkbox-holder">
              <div class="option-checkbox purchase-navbar">
                <input
                  class="navbar-checkbox"
                  name="checkbox1"
                  type="checkbox"
                />

                <span class="checkmark"> </span>
              </div>
              <div class="option-description">
                <p>{option.label}</p>
                <p class="low-text">{option.description}</p>
              </div>
            </label>
          </div>
        {/each}
      </div>
    </div>
    {#each productOrders as order, i}
      <div class="order-card">
        <div class="nav-item">
          {#if true && order.showChart}
            {#if !order.isIncreased}
              <img
                class="graph"
                src="/assets/icons/downtick.svg"
                alt="downtick"
              />
            {:else}
              <img class="graph" src="/assets/icons/uptick.svg" alt="uptick" />
            {/if}
          {/if}

          <div class="nav-item-description">
            <p class="nav-item-number">
              <!-- {#if !data || fetchInProgress}
                                  {@html spinner}
                              {:else} -->
              {order.value}
              <!-- {/if} -->
            </p>
            <div class="nav-title">
              {order.name}
            </div>
          </div>
          {#if true}
            <div class="nav-metric">
              {#if true}
                <div
                  class="nav-metric-percentage"
                  class:uptick={order.isIncreased}
                  class:downtick={!order.isIncreased}
                >
                  {#if !order.isIncreased}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      class="s-EvZdnE7xYsG-"
                      ><path
                        d="M11.7828 9.44971L7.29115 4.95804L4.95781 7.29137L1.63281 3.96637"
                        stroke="#060B13"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="s-EvZdnE7xYsG-"
                      ></path><path
                        d="M8.75 9.91681H12.25V6.41681"
                        stroke="#060B13"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="s-EvZdnE7xYsG-"
                      ></path></svg
                    >
                  {:else}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M11.7828 4.55029L7.29115 9.04196L4.95781 6.70863L1.63281 10.0336"
                        stroke="#060B13"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.75 4.08319H12.25V7.58319"
                        stroke="#060B13"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  {/if}
                  <span>
                    {order.percentage + "%"}
                    <!-- {data.totalOrders.difference !== null ? data.totalOrders.difference.toFixed(2) : 0} -->
                  </span>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  /* PRODUCT TOP NAV */
  .product-top-nav {
    left: 9.4rem;
    top: 75px;
    position: sticky;
    height: 7rem;
  }
  .product-top-nav,
  .product-order-nav {
    border-bottom: 0.1rem solid #1a1f26;
    width: calc(100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 3.2rem;
  }

  .cta-button {
    padding: 1rem 1.5rem;
  }

  .product-top-nav {
    z-index: 3;
  }

  .product-top-nav .title {
    font-size: 2rem;
    line-height: 2.2rem;
    font-weight: 400;
  }

  .product-top-nav .right {
    display: flex;
    gap: 1.5rem;
  }

  /* PRODUCT ORDER NAV */
  .product-card {
    position: sticky;
    top: calc(7rem + 75px);
    z-index: 2;
    /* overflow-x: auto; */
  }
  .product-order-nav {
    min-width: 1000px;
    padding: 0px;
    margin: 0px;
    background-color: #060b13;
  }

  .order-card {
    border-right: 0.1rem solid #1a1f26;
    width: 100%;
    cursor: pointer;
    position: relative;
    height: 7.9rem;
  }

  .order-card .nav-item-description {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.3rem;
  }

  .order-card .nav-item-number {
    font-size: 1.8rem;
    line-height: 2.2rem;
    font-weight: 400;
    color: #fefefe;
  }

  .order-card .nav-title {
    font-size: 1.15rem;
    font-weight: 500;
    line-height: 1.6rem;
    margin-top: 1.5rem;
    color: #88888a;
  }

  .order-card .nav-metric {
    position: absolute;
    top: 1.3rem;
    right: 1.3rem;
  }

  .nav-metric-percentage {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem 0.4rem;
    border-radius: 3rem;
    font-size: 1.1rem;
    font-weight: 600;
    color: #0d121a;
  }
  .downtick {
    background-color: #f37361;
  }
  .uptick {
    background-color: #0cb47f;
  }

  .order-card:first-child,
  .order-card .nav-dropdown,
  .order-card .nav-dropdown-title {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .order-card .nav-dropdown-title p {
    margin-right: 1.5rem;
  }

  .order-card:last-child {
    border-right: 0px;
  }

  .order-card .navbar-dropdown-content {
    min-width: 26rem;
    position: absolute;
    left: 1.5rem;
    top: 8.2rem;
    overflow: hidden;
    background-color: #060b13;
    border: 0.1rem solid #1a1f26;
    border-radius: 1.6rem;
    transition: all 0.3s ease-in-out;
    opacity: 0;
    visibility: hidden;
    z-index: 1000;
  }

  .order-card .navbar-dropdown-content .navbar-checkbox {
    display: none;
  }

  .order-card .navbar-dropdown-content.active {
    opacity: 1;
    visibility: visible;
  }

  .order-card .nav-dropdown-title svg {
    rotate: 180deg;
  }

  .order-card .nav-dropdown.active svg {
    rotate: 0deg;
  }

  :global(.nav-item .checkbox-holder.active) {
    border-bottom: none;
  }

  .order-card .option-checkbox.purchase-navbar .checkmark::after {
    opacity: 0;
    visibility: hidden;
  }

  .order-card
    .input-holder.checkbox-holder.active
    .option-checkbox.purchase-navbar
    .checkmark::after {
    visibility: visible;
    opacity: 1;
  }

  .order-card
    .input-holder.checkbox-holder.active
    .option-checkbox.purchase-navbar
    .checkmark {
    border-color: rgba(136, 136, 138, 1);
  }

  .order-card .option-checkbox.purchase-navbar .checkmark {
    border-radius: 50% !important;
    border-color: rgba(56, 60, 66, 1);
    top: 2.2rem;
  }

  :global(.option-checkbox.purchase-navbar .checkmark::after) {
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    background-color: rgba(136, 136, 138, 1);
  }

  .order-card .graph {
    width: 12.5rem;
    height: 3rem;
    position: absolute;
    right: -0.3rem;
    bottom: 0;
  }
</style>

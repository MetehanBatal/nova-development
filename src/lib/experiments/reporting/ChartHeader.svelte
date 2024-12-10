<script>
  export let keys;
  export let innerWidth;
  export let handleLegendClick
  export let chartsData
  export let selectedDate
  export let dateArray
  export let accuracy
  export let selectedPath
  export let metrics
  export let metricsSelected

  import {timeFormat} from 'd3';
  import { colors } from "$stores/colors.js";
  import { onMount } from "svelte";

  $: legendDom = "";
  let dateFormat = accuracy == "day" ? timeFormat("%b %d") : timeFormat("%b %d, %I%p");

  onMount(() => {
    legendDom = document.getElementsByClassName("legend")[0];
  });

  const handleClick = (direction = "right") => {
    let amount =
      direction == "left"
        ? legendDom.scrollLeft - 500
        : legendDom.scrollLeft + 500;

    legendDom.scroll({
      left: amount,
      behavior: "smooth",
    });
  };
</script>

<div class="header" style={`width: ${innerWidth + 70}px; margin-left: ${0}px`}>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    style="transform: rotate(180deg)"
    xmlns="http://www.w3.org/2000/svg"
    on:click={() => handleClick("left")}
  >
    <circle cx="12" cy="12" r="12" fill="#212830" />
    <path
      d="M10.25 15.5L13.75 12L10.25 8.5"
      stroke="white"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="legend" style={`width: ${innerWidth - 120}px;`}>
    {#each keys as k, i}
        {#if handleLegendClick}
            <div class="row-1">
            <div class="unclicked" id = {"click-" + k} on:click={() => handleLegendClick(k)}>
                <div class="indictor" style={`background: ${colors[k]}`}></div>
                <span> k </span>
                {#if selectedPath.length == 0 || selectedPath.includes(k)}
                <p class="value">
                  {`${dateFormat(dateArray[selectedDate])}: `}
                  <b>{
                      metricsSelected == metrics[1].id
                      ? chartsData[k][selectedDate].value.toFixed(2)
                      : metricsSelected == metrics[2].id || metricsSelected == metrics[3].id
                      ? "$" + chartsData[k][selectedDate].value.toFixed(2)
                      : chartsData[k][selectedDate].value
                    }</b>
              </p>
                {/if}
            </div>
          </div>
        {:else}
        <div class="row-1">
                <div class="indictor" style={`background: ${colors[i]}`}></div>
                <span>{k} </span>
          </div>
        {/if}
     
    {/each}
  </div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    on:click={() => handleClick()}
  >
    <circle cx="12" cy="12" r="12" fill="#212830" />
    <path
      d="M10.25 15.5L13.75 12L10.25 8.5"
      stroke="white"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</div>

<style>
  .header {
    padding-top: 30px;
    font-size : 11px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    cursor: pointer;
  }
  .legend {
    display: flex;
    overflow: hidden;
  }
  .legend .row-1 {
    width: 130px;
    color: #999;
    flex-shrink: 0;
  }
  .legend .indictor {
    margin-right: 3px;
  }
  .indictor {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    margin-right: 10px;
    display: inline-block;
  }
  .row-1 {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  .unclicked{
    padding: 5px;
    border-radius: 3px;
  }
  .value{
    font-size: 11px;

  }
</style>
<script>
  import { parsePeriodNum } from "$stores/functions.js";
  import Xaxis from "$lib/experiments/charts/Lines/Xaxis.svelte";
  import Yaxis from "$lib/experiments/charts/Lines/Yaxis.svelte";
  import { colors } from "$stores/colors.js";
  import ChartHeader from "./ChartHeader.svelte"
  
	import { page } from "$app/stores";

  import {
    scaleTime,
    scaleLinear,
    extent,
    curveBumpX,
    line,
    pointer,
    bisectLeft,
    max,
    timeFormat
  } from "d3";

  export let chartsData;
  export let keys;
  export let width;
  export let accuracy;
  export let metrics
  export let metricsSelected
  export let experimentVariantsObjectFormat

  let height = 520;
  let dateFormat = accuracy == "day" ? timeFormat("%b %d") : timeFormat("%b %d, %I%p");
  let experimentVariants = $page.data.experimentRes.data[0].variants;

  let margin = {
    top: 30,
    right: 5,
    bottom: 55,
    left: 45,
  };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const transform = `translate(${margin.left}, ${margin.top})`;

  const timeParse =
    parsePeriodNum[chartsData[keys[0]][0]["_id"].split("-").length];

  let temp = [];
  let yDataMax
  let yScale
  let xScale

  chartsData[keys[0]].map((d) => {
    temp.push(timeParse(d._id));
  });

  $: dateArray = [...temp];

  const getMaxNodes = () => {
    console.log(chartsData);
    let temp2 = [];
    keys.map((d) => {
      temp2.push(max(chartsData[d], (dd) => dd.value));
    });
    return max(temp2)
  }

  $: chartsData, yDataMax = getMaxNodes();

  $: chartsData, xScale = scaleTime(extent(dateArray), [0, innerWidth]);

  $: chartsData, yScale = scaleLinear(extent([0, yDataMax]), [innerHeight, 0]).nice();


  let lineGenerator = line()
    .curve(curveBumpX)
    .x((d, i) => xScale(dateArray[i]))
    .y((d) => yScale(d.value));

  let selectedPath = [];
  let selectedDate = 0;
  let pathG = {};
  let x = 0;
  let y = 0;

  // onMount(() => {
  //   pathG = document.getElementById("pathG");
  // });

  const handleMousemove = (e) => {
    let temp2 = pointer(e);
    x = temp2[0];
    y = temp2[1];
    selectedDate = bisectLeft(dateArray, xScale.invert(x - 10));
    x = xScale(dateArray[selectedDate]);
  }

  const handleLegendClick = (k) => {
    let tempArray = [...selectedPath]
    let temp = document.getElementById("path-" + k);
    let tempDom = document.getElementById("click-" + k)
    pathG.removeChild(temp);
    pathG.appendChild(temp);
    if(tempArray.includes(k) ) {
      tempArray.splice(tempArray.indexOf(k), 1)
      tempDom.style.backgroundColor = "#222"
    } else {
      tempArray.push(k)
      tempDom.style.backgroundColor = "transparent"
    }

    selectedPath = [...tempArray]
  }

</script>
<!--
<ChartHeader
  {keys}
  {innerWidth}
  {handleLegendClick}
  {chartsData}
  {selectedDate}
  {dateArray}
  {accuracy}
  {selectedPath}
  {metrics}
  {metricsSelected}
/> -->

<svg {width} {height}>
  <g {transform}>
    <Yaxis {innerWidth} {yScale} {chartsData}/>
    <Xaxis {xScale} {innerHeight} />
    <g id="pathG" bind:this = {pathG}>
      {#each keys as k, i}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <path
          id={"path-" + k}
          d={lineGenerator(chartsData[k])}
          fill="none"
          stroke={selectedPath.length == 0 || selectedPath.includes(k) ? colors[experimentVariantsObjectFormat[k].id] : "rgba(50,50,50,0.2)"}
          stroke-width={1.2 }
        />
      {/each}
    </g>
    {#if selectedDate > -1}
      <line
        x1 = {x}
        x2 = {x}
        y1 = 0
        y2 = {innerHeight}
        stroke = "#ccc"
      />
      <!-- <circle
        r="3"
        fill="#ccc"
        stroke="#000"
        cx={xScale(dateArray[selectedDate])}
        cy={yScale(chartsData[selectedPath][selectedDate].value)}
      /> -->
    {/if}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <!--       on:mouseout={handleMouseout}  -->
    <rect
      class= "overlay"
      width = {innerWidth}
      height = {innerHeight}
      fill = "rgba(0,0,0,0)"
      on:mousemove={handleMousemove}

    />
  </g>
</svg>
{#if selectedDate > -1 && selectedPath.length > -1}
  <div
    class="tooltip"
    style={`
      top: ${95}px;
      left: ${width / 2 > x ? x + margin.left : x - 150 + margin.left}px`
    }
  >
    <div class="tooltip-header">
      <span>{dateFormat(dateArray[selectedDate])}</span>
    </div>
    <div class = "content">
    {#each keys as k, i}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="row-1" id = {"click-" + k} on:click={() => handleLegendClick(k)}>
        <div class="title">
          <div class="indictor" style={`background: ${colors[experimentVariantsObjectFormat[k].id]}`}></div>
          <span>{k} :  </span>
        </div>
        <div class="left">
          {
            metricsSelected == metrics[1].id
            ? chartsData[k][selectedDate].value.toFixed(2)
            : metricsSelected == metrics[2].id || metricsSelected == metrics[3].id
            ? "$" + chartsData[k][selectedDate].value.toFixed(2)
            : chartsData[k][selectedDate].value
          }
        </div>
      </div>
    {/each}
    </div>
  </div>
{/if}

<style>
  .overlay {
    cursor: pointer;
  }
  .left{
    font-weight: 500;
  }

  .row-1 {
    display: flex;
    align-items: center;
    padding: 5px 0px 5px 10px;
    background-color: #222;
    font-size: 11px;
    border-bottom: 1px solid #0D121A;
    cursor: pointer;
  }

  .tooltip-header{
    margin-bottom: 15px;
  }

  .content::-webkit-scrollbar {
		height: .8rem;
		width: .8rem;
	}
	.content::-webkit-scrollbar-track {
		width: 100%;
		border-left: .1rem solid #212830;
		border-top: .1rem solid #212830;
		background: #0d121a;
		border-radius: 3rem;

	}

	.content::-webkit-scrollbar-thumb {
		background: #383c42;
		border-radius: 3rem;
	}

	.content::-webkit-scrollbar-corner {
		background: #0d121a;
		border-top: .1rem solid #212830;
		border-right: .1rem solid #212830;
	}

  .tooltip {
    width: 150px;
    padding: 10px;
    height: auto;
    border-radius: 0px 5px 5px 0px;
    background-color: rgba(100, 100, 100, 0.2);
    position: absolute;
    top: 0px;
    color: #eee;
  }
  .content{
    max-height: 150px;
    overflow-y: auto;
  }
  .title {
    margin-right: 5px;
    display: flex;
    align-items: center;
  }
  .indictor {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    margin-right: 10px;
    display: inline-block;
  }

</style>
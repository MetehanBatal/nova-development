<script>
	export let tooltipTitle;
	export let strokeColor1;
	export let strokeColor2;
	export let past;
	export let present;
	export let presentPurchases
	export let pastPurchases
	export let dateArray;
	export let dateArrayPast;
	export let selected;
	export let xScale;
	export let yScale;
	export let bottom;
	export let isTooltip2;
	export let tooltipTitle2;
	export let past2
	export let present2
	export let width
	export let margin
	
	import { timeFormat } from "d3";
	let dateFormat = timeFormat("%a %b %d, %Y %I:%M%p");
	let pastValue
	let presentValue
	let dateValue
	let left
	let y
	let percentRate
  
	$: selected, presentValue = present[selected];
	$: selected, pastValue  = past[selected];
	$: selected, dateValue = dateArray[selected];
	$: selected, left = xScale(dateValue);
  
	$: selected, y = Math.abs(yScale(presentValue)) / 2;
	$: selected, percentRate = !pastValue ? "100.0" : (((presentValue - pastValue) / pastValue) * 100).toFixed(1);
  </script>

  <div
	class="tooltip"
	style="top:{y + bottom}px; 
		  left:{
			  left > width / 2
				  ? left - 230 + margin.left - 15
				  : left + margin.left + 15
		  }px"
  >
	{#if isTooltip2}
	  <div>
		  <div class="row2 row2-1">
			  <div class="title">{tooltipTitle}</div>
			  <div class="color-gray">{dateFormat(dateArray[selected])}</div>
			  <div class= "content">
				  {#if present[selected] != undefined}
					  <div>
						  <div class="indicator" style="border-color:{strokeColor1};"></div>
						  <span class="color-gray">
							{(present[selected] * 100).toFixed(3)}%  ({presentPurchases[selected]})
						</span>
					  </div>
				  {/if}
				  {#if past[selected] != undefined}
					  <div>
						  <div class="indicator" style="border-color:{strokeColor2};"></div>
						  <span class="color-gray"> {(past[selected] * 100).toFixed(3)}% ({pastPurchases[selected]})</span>
						  <!-- <span class="color-gray">null</span> -->
					  </div>
				  {/if}
			  </div>
		  </div>
		  <div class="row2">
			  <div class="title">{tooltipTitle2}</div>
			  <div class="color-gray">{dateFormat(dateArrayPast[selected])}</div>
			  <div class= "content">
				  {#if present2[selected] != undefined}
					  <div>
						  <div class="indicator" style="border-color:{strokeColor1};"></div>
						  <span class="color-gray">{(present2[selected]).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</span>
					  </div>
				  {/if}
				  {#if past2[selected] != undefined}
					  <div>
						  <div class="indicator" style="border-color:{strokeColor2};"></div>
						  <span class="color-gray">{(past2[selected]).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</span>
					  </div>
				  {/if}
			  </div>
		  </div>
	  </div>
	{:else}
	  <div class="title">{tooltipTitle}</div>
	  <div class="row row-1">
		<div class="indicator" style="border-color:{strokeColor1};"></div>
		<div class="content">
		  <div class="color-gray">{dateFormat(dateValue)}</div>
		  <div class="view">
			<span class="color-white">{presentValue.toFixed(0)}</span>
			<span class="color-gray"> views</span>
		  </div>
		  <div class="rate">
			<span style="color: {percentRate > 0 ? '#0ca978' : 'red'}"
			  >{percentRate}%</span
			>
			<span class="color-gray"> from previous period</span>
		  </div>
		</div>
	  </div>
	  {#if pastValue != undefined}
		  <div class="row row-2">
			  <div class="indicator" style="border-color:{strokeColor2};"></div>
			  <div class="content">
			  <div class="color-gray">{dateFormat(dateArrayPast[selected])}</div>
			  <div class="view">
				  <span class="color-white">{pastValue.toFixed(0)}</span>
				  <span class="color-gray"> views</span>
			  </div>
			  </div>
		  </div>
	  {/if}
	{/if}
  </div>
  
  <style>
	.tooltip {
	  position: absolute;
	  background-color: #060b13;
	  padding: 15px 20px;
	  border: 1px solid #131921;
	  border-radius: 7px;
	  pointer-events: none;
	  width: 230px;
	  font-size: 12px;
	  transition: left 0.5s ease, top 0.4s ease
	}
	.title {
	  font-weight: 600;
	  font-size: 13px;
	  display: block;
	  color: #aaacae;
	  margin-bottom: 0px;
	}
  
	.row2 .content {
	  display: flex;
	  justify-content: space-between;
	  margin-top: 8px;
	}
  
	.row-1 {
	  margin-top: 15px;
	}
  
	.color-white {
	  color: #fff;
	}
  
	.row {
	  display: flex;
	}
  
	.row2-1, .row-1{
	  margin-bottom: 20px;
	}
  
	.row-1 .view {
	  margin-bottom: 7px;
	}
  
	.color-gray {
	  color: #4a4b4f;
	}
  
	.indicator {
	  width: 9px;
	  height: 9px;
	  border-radius: 50%;
	  border: 2px solid;
	  margin-top: 3px;
	  margin-right: 7px;
	}
  
	.row2 .indicator{
	  display: inline-block;
	  margin-right: 4px;
	}
  </style>
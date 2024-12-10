<script>
	export let tooltipTitle;
	export let strokeColor1;
	export let strokeColor2;
	export let data
	export let selected;
	export let xScale;
	export let yScale;
	export let bottom;
	export let width
	export let margin
	export let hasComparison
	export let isTimeScale
	
	import { timeFormat } from "d3";
  import { colors } from "$stores/colors";
	let dateFormat = timeFormat("%a %b %d, %Y %I:%M%p");
	let pastValue
	let presentValue
	let dateValue
	let presentTraits
	let pastTraits
	let datePastValue
	let left
	let y
	let percentRate

	const handleUpdate = () => {
		presentValue = +data.current[selected].value;
		dateValue = data.current[selected].key;
		presentTraits = data.current[selected].traits
		left = xScale(dateValue);

		if(hasComparison){
			pastValue  = +data.comparison[selected].value;
			datePastValue = data.comparison[selected].key;
			pastTraits = data.comparison[selected].traits;

			percentRate = !pastValue ? "100.0" : (((presentValue - pastValue) / pastValue) * 100).toFixed(1);
		}

		y = Math.abs(yScale(presentValue)) / 2;

	}

	$: selected, handleUpdate()
  
  </script>

  <div
	class="tooltip"
	style="top:{y + bottom}px; 
		  left:{
			  left > width / 2
				  ? left - 280 + margin.left - 15
				  : left + margin.left + 15
		  }px"
  >
	  <div class="title">{tooltipTitle}</div>
	  <div class="row row-1">
		<div class="content">
			<div class = "title-row">
				<div class="indicator" style="border-color:{strokeColor1};"></div>
				<div class="color-gray">{isTimeScale ? dateFormat(dateValue) : dateValue}</div>
			</div>
		  <div class="view">
			{#if hasComparison}
				<div class = "value">
					<div class = "indicator indicator-box" style={`background-color: ${colors[0]}`}></div>
					<span style="color: {percentRate > 0 ? '#0ca978' : 'red'}">{percentRate}%</span>
				</div>
			{/if}
			<div class = "value">
				<div class = "indicator indicator-box" style={`background-color: ${colors[1]}`}></div>
				<span>{presentValue.toFixed(2)}</span>
			</div>
			{#if presentTraits}
				{#each Object.keys(presentTraits) as k, i}
				<div class = "value">
					<div class = "indicator indicator-box" style={`background-color: ${colors[i + 2]}`}></div>
					<span>{presentTraits[k]}</span>
				</div>
				{/each}
			{/if}
		  </div>
		</div>
	  </div>
	  {#if pastValue != undefined}
		  <div class="row row-2">
			  <div class="content">
				<div class = "title-row">
					<div class="indicator" style="border-color:{strokeColor2};"></div>
					<div class="color-gray">{isTimeScale ? dateFormat(datePastValue) : datePastValue}</div>
				</div>
				<div class="view">
					<!-- <div class = "value">
						<div class = "indicator" style="background-color: transparent"></div>
						<span></span>
					</div> -->
				<div class = "value">
					<div class = "indicator indicator-box" style={`background-color: ${colors[1]}`}></div>
					<span>{pastValue.toFixed(2)}</span>
				</div>
					{#if pastTraits}
						{#each Object.keys(pastTraits) as k, i}
						<div class = "value">
							<div class = "indicator indicator-box" style={`background-color: ${colors[i + 2]}`}></div>
							<span>{pastTraits[k]}</span>
						</div>
						{/each}
					{/if}
				</div>
			  </div>
		  </div>
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
	  width: 280px;
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

	.title-row {
		width: 100%;
		display: flex;
	}

  
	.row-1 {
	  margin-top: 15px;
	}
  
	.row {
	  display: flex;
	}
  
 	.view {
	  margin: 5px 0px 10px 15px;
	  display: flex;
	  flex-wrap: wrap;
	  column-gap: 10px;
	  row-gap: 3px;
	}

	.view .value{
		width: 65px;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
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

	.indicator-box {
		border-radius: 1px;
		border: 1px solid #060b13;
		margin-top: 0px;
		width: 10px;
		border-radius: 2px;
		height: 10px
	}

  </style>
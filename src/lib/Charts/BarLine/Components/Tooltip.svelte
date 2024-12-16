<script>
	export let bottom;
	export let width
	export let margin
	export let data
	export let xScale
	export let yScale
	export let selected
	export let hasComparison
	export let breakdown
	export let extentFlat
	export let isTimeScale
	
	import { timeFormat } from "d3";
	let dateFormat = timeFormat("%a %b %d, %Y %I:%M%p");

	let left
	let y

	let presentValue
	let dateValue
	let presentTraits
	let pastValue
	let datePastValue
	let pastTraits
	let percentRate
	let show

	const handleV = () => {
		let v = Object.values(extentFlat.current)
		show = v[v.findIndex((d) => d.checked)].name
	}
	handleV()
	const handleUpdate = () => {
		presentValue = +data.current[show][selected].value;
		dateValue = data.current[show][selected].key;
		presentTraits = data.current[show][selected].traits
		left = xScale(dateValue);

		if(hasComparison && data?.comparison?.[show]?.[selected]){
			pastValue  = +data.comparison[[show]][selected].value;
			datePastValue = data.comparison[show][selected].key;
			pastTraits = data.comparison[show][selected].traits;
			percentRate = !pastValue ? "100.0" : (((presentValue - pastValue) / pastValue) * 100).toFixed(1);
		}

		y = Math.abs(yScale(presentValue)) / 2;

	}

	const handleBreakdownName  = () => {
		let temp = show.split("_")
		let i = breakdown.findIndex((d) => d.value == "timestamp")
		if(i != -1 && i != breakdown.length - 1){
			temp[i] = dateFormat(new Date(temp[i]))
		}

		if(breakdown[breakdown.length - 1].value == "timestamp"){
			temp.push(dateFormat(data.current[show][selected].key))
		} else {
			temp.push(data.current[show][selected].key)
		}

		return temp.join(" | ")
	}

	const handleValue = (p, q) => {
		if(q && q != 0 && p > q){
			return +((p / q) * 100)
		} else if (q && p != 0 && p < q){
			return -((q / p) * 100)
		} else if(p == 0 && q == 0){
			return +0
		} else if (p == 0 && q) {
			return -(100 * q)
		} else {
			return +(100 * p)
		}
	}

	$: selected, handleUpdate()

	$: extentFlat, handleV()
  </script>

  <div
	class="tooltip"
	style="top:{y + bottom}px; 
		  left:{
			  left > width / 2
				  ? left - 280 + margin.left - 20
				  : left + margin.left + 20
		  }px"
  >
<div class="upper flex">
		<div class="left">
			<div class="indicator" style={`border-color: ${extentFlat.current[show].color}`}></div>
		</div>
		<div class="right">
			<span class="breakdown gray block line-height">{handleBreakdownName()}</span>
			<div>
				<span class="breakdown">{data.current[show][selected].value} </span>
				<span class="gray"> events </span>
				{#if hasComparison}
					<span class={`${handleValue(data?.current?.[show]?.[selected]?.value, data?.comparison?.[show]?.[selected]?.value) >= 0 ? "green" : "red" }`}>
						{`${handleValue(data?.current?.[show]?.[selected]?.value ,data?.comparison?.[show]?.[selected]?.value) >= 0 ? "+" : ""}${handleValue(data?.current?.[show]?.[selected]?.value ,data?.comparison?.[show]?.[selected]?.value).toFixed(2)}%`}
					</span>
				{/if}
			</div>
			{#each Object.keys(data.current[show][selected].traits) as k}
				<div>
					<span> {k}: </span>
					<span class="breakdown gray">{data.current[show][selected].traits[k]} </span>
					{#if hasComparison}
						<span class={`${handleValue(data.current?.[show]?.[selected]?.traits?.[k], data.comparison?.[show]?.[selected]?.traits?.[k]) >= 0 ? "green" : "red" }`}>
							{`${handleValue(data.current?.[show]?.[selected]?.traits?.[k], data.comparison?.[show]?.[selected]?.traits?.[k]) >= 0 ? "+" : ""}${handleValue(data.current?.[show]?.[selected]?.traits?.[k], data.comparison?.[show]?.[selected]?.traits?.[k]).toFixed(2)}%`}
						</span>
					{/if}
				</div>
			{/each}
		</div>
	</div>
	{#if data?.comparison?.[show]?.[selected]}
	<div class="lower flex">
		<div class="left">
			<div class="indicator dotted" style={`border-color: ${extentFlat.current[show].color}`}></div>

		</div>
		<div class="right">
			<span class="breakdown gray block line-height">{handleBreakdownName()}</span>
			<div>
				<span class="breakdown">{data.comparison[show][selected].value} </span>
				<span class="gray"> events </span>
			</div>
			{#each Object.keys(data.comparison[show][selected].traits) as k}
				<div>
					<span> {k}: </span>
					<span class="breakdown gray">{data.comparison[show][selected].traits[k]} </span>
				</div>
			{/each}
		</div>
	</div>
	{/if}
  </div>
  
  <style>
	.line-height {
		line-height: 1.5;
	}
	.green {
		color: #0CB47F
	}
	.red {
		color:#F37261
	}
	.block {
		display: block;
		margin-bottom: 0.8rem;
	}
	.indicator{
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 2px solid #ccc;
	}
	.dotted{
		border: 2px dotted #ccc;
	}
	.tooltip {
	  position: absolute;
	  background-color: #060b13;
	  padding: 1rem;
	  border: 1px solid #131921;
	  border-radius: 7px;
	  pointer-events: none;
	  width: 280px;
	  font-size: 1.1rem;
	  transition: left 0.5s ease, top 0.4s ease;
	  line-height: 1;
	  display: flex;
	  flex-direction: column;
	  gap: 2rem;
	}

	.flex {
		display:  flex;
		gap: 1rem;
		align-items: top;
	}
	.upper {
		margin-bottom: 1rem;
	}

	.flex .right {
		width: 100%;
	}
	.gray {
		color: #88888A;
	}

	.right{
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

  </style>
<script>
	export let yScale;
	export let xScale;
	export let data
	export let innerHeight;
	export let hasComparison
	export let firstCurrent
	//export let firstComparison
	export let extentFlat
	export let currentParentKeys
	export let comparisonParentKeys
	export let rowHovered
	import {line, area, curveBumpX, selectAll} from 'd3'

	let lineGenerator = line()
		.curve(curveBumpX)
		.x((d, i) => xScale(data.current[firstCurrent][i].key))
		.y((d) => yScale(d.value));

	let areaGenerator = area()
		.curve(curveBumpX)
		.x((d, i) => xScale(data.current[firstCurrent][i].key))
		.y0(innerHeight)
		.y1((d) => yScale(d.value));

	$: data, selectAll(".defs-area").remove()
</script>


	{#each  Object.values(extentFlat.current) as key, i}
	{#if key.checked}
		<defs class={"defs-area" + key.name}>
			<linearGradient y2 = 1 y1 = 0 x1 = 0 x2 = 0 id = {`area-color-${key.name}`}  >
				<stop  offset = "0%" stop-color = {key.color}/>
				<stop  offset = "100%" stop-opacity = 0 stop-color = "rgba(0,0,0,0)"/>
			</linearGradient>
		</defs>
		<g class="path-area">
			<path
				d = {areaGenerator(data.current[key.name])}
				fill = {`url(#area-color-${key.name})`}
				fill-opacity = {
					rowHovered == "" ||  rowHovered == key.name
						? 1
						: 0.1
				}
			/>
		
		<!-- {#if hasComparison && data.comparison?.[key.name] && comparisonParentKeys.includes(key.name.split("_").slice(0, -1).join("_"))}
			<path
				d = {areaGenerator(data.comparison[key.name])}
				fill = "none"
			/>
			
		{/if} -->
		</g>

		<g class="path-line">
			<path
				d = {lineGenerator(data.current[key.name])}
				stroke = {key.color}
				stroke-opacity = {
					rowHovered == "" ||  rowHovered == key.name
						? 1
						: 0.1
				}
				fill = "none"
			/>
			{#if hasComparison && data.comparison?.[key.name] && comparisonParentKeys.includes(key.name.split("_").slice(0, -1).join("_"))}
				<path
					d = {lineGenerator(data.comparison[key.name])}
					stroke = {key.color}
					stroke-opacity = {
						rowHovered == "" ||  rowHovered == key.name
							? 1
							: 0.1
					}
					stroke-dasharray = "4, 2"
					fill = "none"
				/>
			{/if}
		</g>
	{/if}
	{/each}
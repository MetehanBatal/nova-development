<script>
	export let yScale;
	export let xScale;
	export let data
	export let innerHeight;
	export let hasComparison

	import {line, area, curveBumpX} from 'd3'

	console.log(data);

	let lineGenerator = line()
		.curve(curveBumpX)
		.x((d, i) => xScale(data.current[i].key))
		.y((d) => yScale(d.value));

	let areaGenerator = area()
		.curve(curveBumpX)
		.x((d, i) => xScale(data.current[i].key))
		.y0(innerHeight)
		.y1((d) => yScale(d.value));
</script>

	<defs> 
		<linearGradient y2 = 1 y1 = 0 x1 = 0 x2 = 0 id = "area-color" >
			<stop  offset = "40%" stop-color = "#2a2a44"/>
			<stop  offset = "100%" stop-opacity = 0 stop-color = "rgba(0,0,0,0)"/>
		</linearGradient>
	</defs>

	<g class="path-area">
		<path
			d = {areaGenerator(data.current)}
			fill = "url('#area-color')"
		/>
		{#if hasComparison}
			<path
				d = {areaGenerator(data.comparison)}
				fill = "none"
			/>
		{/if}
		
	</g>

	<g class="path-line">
		<path
			d = {lineGenerator(data.current)}
			stroke = "#8073ba"
			fill = "none"
		/>
		{#if hasComparison}
		<path
			d = {lineGenerator(data.comparison)}
			stroke = "#82838a"
			stroke-dasharray = "2, 2"
			fill = "none"
		/>
		{/if}
			
	</g>
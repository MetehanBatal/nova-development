<script>
	export let yScale;
	export let xScale;
	export let past;
	export let present;
	export let dateArray;
	export let innerHeight;

	import {line, area, curveBumpX} from 'd3'

	let lineGenerator = line()
		.curve(curveBumpX)
		.x((d, i) => xScale(dateArray[i]))
		.y((d) => yScale(d));

	let areaGenerator = area()
		.curve(curveBumpX)
		.x((d, i) => xScale(dateArray[i]))
		.y0(innerHeight)
		.y1((d) => yScale(d));
</script>

	<defs> 
		<linearGradient y2 = 1 y1 = 0 x1 = 0 x2 = 0 id = "area-color" >
			<stop  offset = "40%" stop-color = "#2a2a44"/>
			<stop  offset = "100%" stop-opacity = 0 stop-color = "rgba(0,0,0,0)"/>
		</linearGradient>
	</defs>

	<g class="path-area">
		<path
			d = {areaGenerator(present)}
			fill = "url('#area-color')"
		/>
		<path
			d = {areaGenerator(past)}
			fill = "none"
		/>
	</g>

	<g class="path-line">
		<path
			d = {lineGenerator(present)}
			stroke = "#8073ba"
			fill = "none"
		/>
		<path
			d = {lineGenerator(past)}
			stroke = "#82838a"
			stroke-dasharray = "2, 2"
			fill = "none"
		/>
	</g>
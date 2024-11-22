<script>
	export let selected;
	export let innerHeight;
	export let past;
	export let present;
	export let dateArray;
	export let yScale;
	export let xScale;
	export let strokeColor1;
	export let strokeColor2;
	export let dataProperty;

	import { select, selectAll, easeLinear } from "d3";
	import { onMount } from 'svelte';


	$: xLoc = xScale(dateArray[selected]);
	$: yLocPast = yScale(past[selected]);
	$: yLocPresent = yScale(present[selected]);

	let strokeWidth = 1.5;
	let r = 3;
	let justMounted = false

	onMount(() => {
		justMounted = true
	})

	const g = select(".g-" + dataProperty);

	$: xLoc,
		g
			.selectAll(".trends-" + dataProperty)
			.data([null], (d) => d)
			.join("line")
			.attr("class", "trends-" + dataProperty)
			.attr("stroke", strokeColor1)
			.attr("y1", innerHeight)
			.style("pointer-events", "none")
			.attr('opacity', 1)
			.transition(500)
			.delay(10)
			.ease(easeLinear)
			.attr("x1", xLoc)
			.attr("x2", xLoc);

	$: xLoc,
		yLocPresent,
		g
			.selectAll(".c1-" + dataProperty)
			.data([null], (d) => d)
			.join("circle")
			.attr("class", "c1-" + dataProperty)
			.attr("stroke", strokeColor1)
			.attr("stroke-width", strokeWidth)
			.attr("r", r)
			.attr("cy", yLocPresent - 1)
			.attr('opacity', 1)
			.style("pointer-events", "none")
			.transition(500)
			.delay(10)
			.ease(easeLinear)
			.attr("cx", xLoc)
			.attr("cy", yLocPresent);

	$: xLoc,
		yLocPast,
		g
			.selectAll(".c2-" + dataProperty)
			.data([null], (d) => d)
			.join("circle")
			.attr("class", "c2-" + dataProperty)
			.attr("stroke", strokeColor2)
			.attr("stroke-width", strokeWidth)
			.attr("r", r)
			.attr("cy", yLocPast - 1)
			.style("pointer-events", "none")
			.attr('opacity', 1)
			.transition(500)
			.delay(10)
			.ease(easeLinear)
			.attr("cx", xLoc)
			.attr("cy", yLocPast);
</script>

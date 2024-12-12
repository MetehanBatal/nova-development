<script>
	export let selected;
	export let innerHeight;
	export let data
	export let yScale;
	export let xScale;
	export let strokeColor1;
	export let strokeColor2;
	export let dataProperty;
	export let hasComparison
	export let isTimeScale
	export let firstCurrent
	export let extentFlat

	import { select, selectAll, easeLinear } from "d3";
	import { onMount } from 'svelte';
	let xLoc
	let strokeWidth = 1.5;
	let r = 3;
	let justMounted = false
	let checked = []
	let prev = 0

	const handlexLoc = () => {
		prev = xLoc
		xLoc = isTimeScale ? xScale(data.current[firstCurrent][selected].key) : selected * xScale.step()
	}

	const handleChecking = () => {
		checked = []
		Object.values(extentFlat.current).map((d) => {if(d.checked) checked.push(d)})
	}
	$:selected, handlexLoc()
	// $: yLocPast = hasComparison && yScale(data.comparison[firstCurrent][selected].value);
	//$: yLocPresent = yScale(data.current[firstCurrent][selected].value);

	$:extentFlat, handleChecking()
	$:checked, console.log(checked);
	onMount(() => {
		justMounted = true
	})

	const g = select(".g-" + dataProperty);

	$: checked,
		g
			.selectAll(".c1-" + dataProperty)
			.data(checked, (d) => d)
			.join("circle")
			.attr("class", "c1-" + dataProperty)
			.attr("stroke", (d) => d.color)
			.attr("stroke-width", strokeWidth)
			.attr("r", r)
			.attr("cy", d => yScale(data.current[d.name][selected].value) - 1)
			.attr('opacity', 1)
			.style("pointer-events", "none")
			.attr("cx", prev)
			.transition(500)
			.delay(10)
			.ease(easeLinear)
			.attr("cx", xLoc)
			.attr("cy", d => yScale(data.current[d.name][selected].value));

	// $: xLoc,
	// 	yLocPast,
	// 	hasComparison && g
	// 		.selectAll(".c2-" + dataProperty)
	// 		.data([null], (d) => d)
	// 		.join("circle")
	// 		.attr("class", "c2-" + dataProperty)
	// 		.attr("stroke", strokeColor2)
	// 		.attr("stroke-width", strokeWidth)
	// 		.attr("r", r)
	// 		.attr("cy", yLocPast - 1)
	// 		.style("pointer-events", "none")
	// 		.attr('opacity', 1)
	// 		.transition(500)
	// 		.delay(10)
	// 		.ease(easeLinear)
	// 		.attr("cx", xLoc)
	// 		.attr("cy", yLocPast);
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
			.attr("x1", prev)
			.attr("x2", prev)
			.transition(500)
			//.delay(10)
			.ease(easeLinear)
			.attr("x1", xLoc)
			.attr("x2", xLoc);
</script>

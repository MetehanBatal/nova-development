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
	export let checked

	import { select, selectAll, easeLinear } from "d3";
	import { onMount } from 'svelte';
	let xLoc
	let strokeWidth = 1.5;
	let r = 3;
	let justMounted = false

	const handlexLoc = () => {
		xLoc = isTimeScale ? xScale(data.current[firstCurrent][selected].key) : selected * xScale.step()
	}

	$:selected, handlexLoc()

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
		
	$: checked, checked.length !=0 && checked.map((d) => {
		g
			.selectAll(`.c1${dataProperty}${d.name.replaceAll(".", "").replaceAll(":", "")}`.replaceAll("-", ""))
			.data([null], (dd) => dd)
			.join("circle")
			.attr("class", `c1${dataProperty}${d.name.replaceAll(".", "").replaceAll(":", "")}`.replaceAll("-", ""))
			.attr("stroke", d.color)
			.attr("stroke-width", strokeWidth)
			.attr("r", r)
			.attr("cy", yScale(data.current[d.name][selected].value) - 1)
			.attr('opacity', 1)
			.attr('fill', "#060b13")
			.style("pointer-events", "none")
			.transition(500)
			.delay(10)
			.ease(easeLinear)
			.attr("cx", xLoc)
			.attr("cy", yScale(data.current[d.name][selected].value));

		if(hasComparison && data.comparison?.[d.name]?.[selected]){
			g
				.selectAll(`.c2${dataProperty}${d.name.replaceAll(".", "").replaceAll(":", "")}`.replaceAll("-", ""))
				.data([null], (dd) => dd)
				.join("circle")
					.attr("class", `c2${dataProperty}${d.name.replaceAll(".", "").replaceAll(":", "")}`.replaceAll("-", ""))
					.attr("stroke", d.color)
					.attr("stroke-width", 2)
					.attr("r", r)
					.attr("cy", yScale(data.comparison[d.name][selected].value) - 1)
					.attr('opacity', 1)
					.attr('fill', "#060b13")
					.attr('stroke-dasharray', "1, 1")
					.style("pointer-events", "none")
					.transition(500)
					.delay(10)
					.ease(easeLinear)
					.attr("cx", xLoc)
					.attr("cy", yScale(data.comparison[d.name][selected].value));
			}
	})
		
</script>

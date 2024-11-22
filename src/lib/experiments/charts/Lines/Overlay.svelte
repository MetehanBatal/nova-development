<script>
	export let innerHeight;
	export let innerWidth;
	export let handleMousemove;
	export let handleMouseLeave;
</script>

<rect 
	width = {innerWidth} 
	height = {innerHeight} 
	fill-opacity = 0  
	on:mousemove={handleMousemove}
	on:mouseleave={handleMouseLeave}
/>
<script>
	export let innerHeight;
	export let innerWidth;
	export let handleMousemove;
	export let handleMouseLeave;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<rect 
	width = {innerWidth} 
	height = {innerHeight} 
	fill-opacity = 0  
	on:mousemove={handleMousemove}
	on:mouseleave={handleMouseLeave}
/>
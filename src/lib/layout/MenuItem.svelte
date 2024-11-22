<script>
	import { page } from '$app/stores';

	export let itemData;

	let highlightPath = false;
	
	$: highlightPath = $page.url.pathname?.includes(itemData.slug) ? true : false;
</script>

<a href={itemData.slug} class="menu-item" class:active={highlightPath}>
	{@html itemData.icon}
	<div class="name">{itemData.name}</div>
</a>

<style>
	.menu-item {
		position: relative;
		
		padding: 1.2rem;
		border-radius: .8rem;
		background-color: transparent;
		transition: all .3s ease-in-out;
		
		cursor: pointer;
		
		z-index: 5;
	}

	.menu-item.active {
		background-color: #1A1F26;
	}

	.menu-item:hover {
		background-color: #1A1F26;
	}

	.menu-item.active svg, .menu-item.active path {
		stroke: #FFF;
	}

	.menu-item:hover svg, .menu-item:hover path {
		stroke: #FFF;
	}

	.menu-item .name {
		position: absolute;
		right: 0;
		top: 15%;

		visibility: hidden;
		opacity: 0;
		
		padding: .8rem 1.2rem;
		
		border-radius: .8rem;
		background-color: #1A1F26;
		
		transform: translateX(110%);
		white-space: pre;
		font-size: 1.4rem;
		
		transition: all .3s ease-in-out;
		
		z-index: 5;
	}

	.menu-item .name::after {
		position: absolute;
		left: -.5rem;
		top: 30%;

		content: "";
		
		width: 0;
		height: 0;

		border-top: .5rem solid transparent;
		border-right: .5rem solid #1A1F26;
		border-bottom: .5rem solid transparent;

		z-index: 100000;
	}

	.menu-item:hover .name {
		visibility: visible;
		opacity: 1;
	}
</style>
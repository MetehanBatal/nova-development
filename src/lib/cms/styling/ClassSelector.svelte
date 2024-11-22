<script>
    import ClassSelector from '$lib/toolkit/ClassSelector.svelte';


</script>

<div class="style-selector">
    <p class="selector-category-title">Style Selector</p>

    <ClassSelector />
</div>

<style>
    .style-selector {
        position: relative;
        
        padding: 1rem;

        border-top: .1rem solid #2e2e2e;
        border-bottom: .1rem solid #2e2e2e;
    }
</style>
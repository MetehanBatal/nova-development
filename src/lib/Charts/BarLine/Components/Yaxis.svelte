<script>

    export let innerWidth
    export let yScale
    export let dataProperty
    export let type
    export let margin

    import { range } from 'd3';
    let stroke = "#3b3d42"
    let x = -30
    let dy = "0.32em" // default
    let min 
    let max
    let ticks
    let step

    const handleTicks = () => {
        min = yScale.domain()[0]
        max = yScale.domain()[1]
        step = (max - min) / 4
        ticks = range(min, max, step)

        console.log(ticks);
    }

    $:type, yScale, handleTicks()

</script>
    <g>
        {#each ticks as tick}
            <g class = "y-axis" transform = {`translate(0, ${yScale(tick)})`}>
                <line x2 = {innerWidth} {stroke} />
                <text {x} {dy} >{dataProperty == "conversion" ? `${(+tick * 100).toFixed(0)}%` : +tick.toFixed(2)}</text>
            </g>
        {/each}
    </g>

<style>
    text {
        font-size: 10.5px;
        font-weight: 500;
        fill: #6d6f73
    }
</style>
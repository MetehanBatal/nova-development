<script>

    import {pie, arc, descending} from 'd3'

    export let data
    // export let headline
    // export let type
    export let width
    export let height
    export let colors
    export let margin
    export let rowHovered

    let processedData
    let arcs
    let radius = width / 2
    let innerRadius = radius - 70

    const processedDatafunc = () => {
        if(rowHovered == ""){
            processedData = JSON.parse(JSON.stringify(data.current[Object.keys(data.current)[0]]))
        } else {
            processedData = JSON.parse(JSON.stringify(data.current[rowHovered]))
        }

    }

    processedDatafunc()

    const pieFunc = pie()
		.value((d) => d.value);

    $:rowHovered, processedDatafunc()
    $:processedData,  arcs = pieFunc(processedData);


</script>

<svg width = {width + "px"} height = {height + "px"}>
    <g class="doughnut-chart-g" style = {`transform: translate(${width/2}px, ${200}px)`}>
        {#each arcs as d, i}
            <path
                fill = {colors[i] || "#333"}
                stroke =  {colors[i] || "#333"}
                d = {
                    arc()
                        .cornerRadius(3)
                        .innerRadius(innerRadius)
                        .outerRadius(radius)
                        .startAngle(d.startAngle)
                        .endAngle(d.endAngle)
                        .padAngle(0.025)
                        ()
                    }
            />
            <!-- <g
                class = "chart-g"
                style={`transform: translate(${-50}px,
                ${ i != 1
                    ? ((40 + ((2 - i) * 8)) * (-1 + i)) + "px"
                    : "-8px"
                })`}
            >
                <rect
                    class = "chart-rect"
                    width = "12"
                    height = "12"
                    fill = {
                        "" != d.data.key
                            ? colors[i]
                            :  "#ccc"
                    }
                    stroke =  "#1e1e39"
                    rx = 3
                />
                <text
                    class = "chart-text"
                    x = 15
                    y = 10
                    style = "font-size: 12px"
                    fill = "#eee"
                >
                    {
                        "" != d.data.key
                            ? d.data.key.toUpperCase()
                            : "OTHERS"
                    }
                </text>
                <text
                    class = "chart-count"
                    x = 15
                    y = 25
                    style = "font-size: 12px"
                    fill = "#eee"
                >
                    {`${d.data.value} (${d.data.percentage})`}
                </text>
            </g> -->
        {/each}
    </g>
</svg>

<style>
    svg {
        display: block;
        margin: 0px auto;
    }
</style>
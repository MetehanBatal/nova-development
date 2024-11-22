<script>
    export let data
    export let xScale
    export let yScale
    export let subXScale
    export let innerHeight
    export let hasComparison
    export let relatedBar
    export let handleMoveBarIndicator

    import {max } from 'd3'

    let colorScale = ["#1e1e39", "#aa96f3", "#373556", "#48436c", "rgba(170, 150, 243, 0.4)"]

    let insetHeight = 7
    let indictorFill = "#060b13"
    let indictorHeight = data?.current?.[0]?.traits ? Object.keys(data?.current?.[0]?.traits).length * 20  : 0  
    let bars = []
    console.log(data);
     bars = [
        {
            y : (i) => {
                if(!relatedBar){
                    return 100
                }
                return data?.current?.[i-1]?.value || 100
            },
            x : 1,
            fill: 2,
            masked: "",
            class: "rect-bar-present"
        },
     
        {
            y : (i) => data?.current?.[i].value > 100 ? 100 : data?.current?.[i].value,
            x : 1,
            fill: 1,
            masked: "",
            class: "rect-bar-present-2"
        },
    ]

    if(hasComparison){
        bars = [
            {
                y : (i) => {
                    if(!relatedBar){
                        return 100
                    }
                    return data?.comparison?.[i-1]?.value || 100
                },
                x : 0,
                fill: 2,
                masked: "",
                class: "rect-bar-past"
            },
            
            {
                y : (i) => {
                    if(!relatedBar){
                        return 100
                    }
                    return data?.comparison?.[i-1]?.value || 100
                },
                x : 0,
                fill: 0,
                masked: "url(#mask)",
                class: "rect-bar-past-hashed"
            },
            
            {
                y :  (i) => data?.comparison?.[i].value > 100 ? 100 : data?.comparison?.[i].value,
                x : 0,
                fill: 1,
                masked: "",
                class: "rect-bar-past-2"
            },
            {
                y : (i) => data?.comparison?.[i].value > 100 ? 100 : data?.comparison?.[i].value,
                x : 0,
                fill: 0,
                masked: "url(#mask)",
                class: "rect-bar-past-hashed-2"
            },
            ...bars
        ]
    }

    let xGroupDepth = Object.keys(data).reverse()

    const handleInfoPosition = (e, d, i) => {

        if(!relatedBar){
            return  yScale(100) - indictorHeight * 0.25
        }

        if(e == "comparison"){
            let temp = data?.comparison?.[i - 1]?.value || 100
            return yScale(max([temp, data?.comparison?.[i]?.value ])) - indictorHeight * 0.25
        }
        let temp = data?.current?.[i - 1]?.value || 100
        return yScale(max([temp, d.value ])) - indictorHeight * 0.25
    }
</script>

{#each data.current as d, i}
    <g class="bar-group" transform={`translate(${xScale(d.key)}, 0)`}>
        {#each bars as b}
            <rect 
                class={`bar-rect ${b.class}`} 
                y= {yScale(b.y(i))} 
                x = {hasComparison ? subXScale(xGroupDepth[b.x]) : 0}
                height={innerHeight - yScale(b.y(i)) + insetHeight} 
                rx={insetHeight}
                width={hasComparison ? subXScale.bandwidth() : xScale.bandwidth()} 
                fill={colorScale[b.fill]}
                mask={b.masked}
                clip-path="url(#clip)" 
            ></rect>
       {/each}

       {#each xGroupDepth as e}
            <g transform = {`translate(${hasComparison ? subXScale(e) : 0}, ${handleInfoPosition(e, d, i)})`}>
                <rect 
                    rx={insetHeight} 
                    height={indictorHeight}
                    width={hasComparison ? subXScale.bandwidth() - (subXScale.bandwidth() * 0.2) :  xScale.bandwidth() - (xScale.bandwidth() * 0.2)}
                    fill={indictorFill}
                    stroke = {colorScale[0]}
                    x = {hasComparison ? subXScale.bandwidth() * 0.1 : xScale.bandwidth() * 0.1}
                ></rect>

                {#each data?.[e]?.[i]?.traits && Object.keys(data?.[e]?.[i]?.traits) as k, m}
                <!-- svelte-ignore missing-declaration -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                <text 
                    dy= {15 * (m + 1)}
                        x={ hasComparison ? subXScale.bandwidth()/2 : xScale.bandwidth() / 2} 
                        text-anchor="middle"
                        on:mouseover = {(event) => handleMoveBarIndicator(event, k, data[e][i].traits[k])}
                    >
                    {`${k.toUpperCase().slice(0, 7) + "..."} : ${data[e][i].traits[k].toFixed(2)}`}
                </text>
                {/each}
            </g>
       {/each}
    </g>
{/each}
<style>
    .bar-rect {
        cursor: pointer;
        clip-path: inset(0px 0px 7px 0px);
    }

    rect {
        cursor: pointer;
    }

    text{
        font-size: 7.5px;
        font-weight: 500;
        fill: #AAA;
        cursor: pointer;
    }
</style>
<script>
    export let data
    export let xScale
    export let yScale
    export let subXScale
    export let mainSubXscale
    export let innerHeight
    export let hasComparison
    export let relatedBar
    export let handleMoveBarIndicator
    export let chartType
    export let firstCurrent
    export let comparisonParentKeys
    export let currentParentKeys
    export let currentParentKeys2
    export let extentFlat
    export let rowHovered

    import {max } from 'd3'
    import { colors } from '../../../../stores/colors';

    let colorScale = ["#1e1e39", "#aa96f3", "#373556", "#48436c", "rgba(170, 150, 243, 0.4)"]


    let insetHeight = 3
    let indictorFill = "#060b13"
    let indictorHeight = data?.current?.[firstCurrent]?.[0]?.traits ? Object.keys(data?.current?.[firstCurrent]?.[0]?.traits).length * 20  : 0
    let bars = []

    // extract from https://www.sitepoint.com/javascript-generate-lighter-darker-color/
    function ColorLuminance(hex, lum) {

        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i*2,2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00"+c).substr(c.length);
        }

        return rgb;
    }

    const handleBars = (key) => {
        let main_group = key.split("_").slice(0, -1).join("_")
        bars = [
        {
            y : (i) => {
                if(!relatedBar){
                    return 100
                }
                return data?.current?.[key]?.[i-1]?.value || 100
            },
            x : 1,
            fill: ColorLuminance(extentFlat.current[key].color, -0.7),
            masked: "",
            class: "rect-bar-present"
        },
     
        {
            y : (i) => data?.current?.[key]?.[i].value > 100 ? 100 : data?.current?.[key]?.[i].value,
            x : 1,
            fill: extentFlat.current[key].color,
            masked: "",
            class: "rect-bar-present-2"
        },
    ]

    if(hasComparison && comparisonParentKeys.includes(main_group)){
        bars = [
            {
                y : (i) => {
                    if(!data?.comparison?.[key]){
                        return 0.5
                    }
                    if(!relatedBar){
                        return 100
                    }
                    return data?.comparison?.[key]?.[i-1]?.value || 100
                },
                x : 0,
                fill: ColorLuminance(extentFlat.current[key].color, -0.7),
                masked: "",
                class: "rect-bar-past"
            },
            {
                y : (i) => {
                    if(!data?.comparison?.[key]){
                        return 0.5
                    }
                    if(!relatedBar){
                        return 100
                    }
                    return data?.comparison?.[key]?.[i-1]?.value || 100
                },
                x : 0,
                fill: ColorLuminance(extentFlat.current[key].color, -0.85),
                masked: "url(#mask)",
                class: "rect-bar-past-hashed"
            },
            {
                y :  (i) => {
                    if(data?.comparison?.[key]){
                       return data?.comparison?.[key]?.[i].value > 100 ? 100 : data?.comparison?.[key]?.[i].value
                    } else {
                        return 0.5
                    }
                },
                x : 0,
                fill: extentFlat.current[key].color,
                masked: "",
                class: "rect-bar-past-2"
            },
            {
                y : (i) => {
                    if(data?.comparison?.[key]){
                       return data?.comparison?.[key]?.[i].value > 100 ? 100 : data?.comparison?.[key]?.[i].value
                    } else {
                        return 0.5
                    }
                },
                x : 0,
                fill: ColorLuminance(extentFlat.current[key].color, -0.7),
                masked: "url(#mask)",
                class: "rect-bar-past-hashed-2"
            },
            ...bars
        ]
    } else {
        bars = [
            {
                y : (i) => 0.5,
                x : 0,
                fill: ColorLuminance(extentFlat.current[key].color, -0.7),
                masked: "",
                class: "rect-bar-past"
            },
            {
                y : (i) => 0.5,
                x : 0,
                fill: ColorLuminance(extentFlat.current[key].color, -0.85),
                masked: "url(#mask)",
                class: "rect-bar-past-hashed"
            },
            ...bars
        ]
    }
    return bars
    }
    let xGroupDepth = ["current", "comparison"]//Object.keys(data).reverse()
    // const handleInfoPosition = (e, key, d, i) => {

    //     if(!relatedBar){
    //         return  yScale(100) - indictorHeight * 0.25
    //     }

    //     if(e == "comparison"){
    //         let temp = data?.comparison?.[key]?.[i - 1]?.value || 100
    //         return yScale(max([temp, data?.comparison?.[key]?.[i]?.value ])) - indictorHeight * 0.25
    //     }
    //     let temp = data?.current?.[key]?.[i - 1]?.value || 100
    //     return yScale(max([temp, d.value ])) - indictorHeight * 0.25
    // }

    // const handleTranslate = (key, i) => {
    //     if(chartType != "funnel"){
    //         return mainSubXscale(key)
    //     } else {
    //         return mainSubXscale(`${i}. ${key}`)
    //     }
    // }

    $:xScale, console.log(subXScale.bandwidth(), mainSubXscale.bandwidth(), xScale.bandwidth());
</script>
    {#each data.current[firstCurrent].map((k) => k.key ) as d, i}
        <g class="bar-group" transform={"translate(" + xScale(d) + ", 0)"}>
            {#each Object.keys(data.current) as h, j}
                {#if extentFlat.current[h].checked}
                    <g class="bar-group" transform={"translate(" + mainSubXscale(h) + ", 0)"}>
                        {#each handleBars(h) as b}
                            <rect
                                class={`bar-rect ${b.class}`} 
                                y= {yScale(b.y(i))}
                                x = {hasComparison ? subXScale(xGroupDepth[b.x]) : 0}
                                height={innerHeight - yScale(b.y(i)) + insetHeight}
                                rx={insetHeight}
                                width={hasComparison ? subXScale.bandwidth() : mainSubXscale.bandwidth()}
                                fill={b.fill}
                                fill-opacity = {
                                    rowHovered == "" ||  rowHovered == h
                                        ? 1
                                        : 0.1
                                }
                                mask={b.masked}
                                clip-path="url(#clip)"
                            ></rect>
                        {/each}
                    </g>
                {/if}
            {/each}
        </g>
    {/each}
<!-- {#each Object.keys(data.current) as h, j}
    {#if extentFlat.current[h].checked}
        <g class="bar-group" transform={"translate(" + xScale(h) + ", 0)"}>
            {#each data.current[h] as d, i}
                <g class="bar-group" transform={"translate(" + handleTranslate(d.key, j) + ", 0)"}>
                    {#each handleBars(h) as b}
                        <rect
                            class={`bar-rect ${b.class}`}
                            y= {yScale(b.y(i))}
                            x = {hasComparison ? subXScale(xGroupDepth[b.x]) : 0}
                            height={innerHeight - yScale(b.y(i)) + insetHeight}
                            rx={insetHeight}
                            width={hasComparison ? subXScale.bandwidth() : mainSubXscale.bandwidth()} 
                            fill={b.fill}
                            mask={b.masked}
                            clip-path="url(#clip)"
                        ></rect>
                    {/each}
                    {#if indictorHeight}
                        {#each xGroupDepth as e}
                            <g class="o" transform = {`translate(${hasComparison ? subXScale(e) : 0}, ${handleInfoPosition(e, h, d, j)})`}>
                                <rect
                                    rx={insetHeight}
                                    height={indictorHeight}
                                    width={hasComparison ? subXScale.bandwidth() - (subXScale.bandwidth() * 0.2) :  mainSubXscale.bandwidth() - (mainSubXscale.bandwidth() * 0.2)}
                                    fill={indictorFill}
                                    stroke = {"#000"}
                                    x = {hasComparison ? subXScale.bandwidth() * 0.1 : mainSubXscale.bandwidth() * 0.1}
                                ></rect>

                                {#each data?.[e]?.[h]?.[j]?.traits && Object.keys(data?.[e]?.[h]?.[j]?.traits) as k, m}
                                <text 
                                    dy= {15 * (m + 1)}
                                        x={ hasComparison ? subXScale.bandwidth()/2 : mainSubXscale.bandwidth() / 2} 
                                        text-anchor="middle"
                                        on:mouseover = {(event) => handleMoveBarIndicator(event, k, data[e][h][i].traits[k])}
                                    >
                                    {`${k.toUpperCase().slice(0, 7) + "..."} : ${data[e][h][i].traits[k].toFixed(2)}`}
                                </text>
                                {/each}
                            </g>
                        {/each}
                    {/if}
                </g>
            {/each}
        </g>
    {/if}
{/each} -->

<style>
    .bar-rect {
        cursor: pointer;
        clip-path: inset(0px 0px 3px 0px);
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
<script>
    export let data;
    export let width;
    export let margin
    export let type
    export let colors
    export let displayType
    export let hasComparison
    export let isTimeScale

    import {dateFormat} from "../utlis"

    let legendDom

    let scrollAmount = width/2 < 500 ? width/2 : 500
    const handleClick = (direction = "right") => {

      let amount =
        direction == "left"
          ? legendDom.scrollLeft - scrollAmount
          : legendDom.scrollLeft + scrollAmount;

      legendDom.scroll({
        left: amount,
        behavior: "smooth",
      });
    };
  </script>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
  
  {#if displayType == "keyOnly"}
    <div class="header">
      <div class="legend legend-keyOnly" bind:this = {legendDom}>
          {#each data as k, i}
            {#if i == 0 && hasComparison || i > 0}
              <div class="row-1">
                  <div class="indictor" style={`background: ${colors[i]}`}></div>
                  <div>
                    <span>{k.toUpperCase()} </span>
                  </div>
              </div>
            {/if}
      
          {/each} 
      </div>
    </div>
  {:else}
    <div class="header withKey">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        style="transform: rotate(180deg)"
        xmlns="http://www.w3.org/2000/svg"
        on:click={() => handleClick("left")}
      >
        <circle cx="12" cy="12" r="12" fill="#212830" />
        <path
          d="M10.25 15.5L13.75 12L10.25 8.5"
          stroke="white"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
  
      <div class="legend" bind:this = {legendDom}>

          {#each data as k, i}
            <div class="row-1">
                    <div class="indictor" style={`background: ${colors[i]}`}></div>
                    <div>
                      <span>{k.key == "" ? "OTHERS" : `${isTimeScale ? dateFormat(new Date(k.key)) : k.toUpperCase()}`} </span>
                      <p>{k.value} ({k.percentage})</p>
                    </div>
                    
              </div>
          {/each} 

      </div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        on:click={() => handleClick()}
      >
        <circle cx="12" cy="12" r="12" fill="#212830" />
        <path
          d="M10.25 15.5L13.75 12L10.25 8.5"
          stroke="white"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  {/if}

  
  <style>
    .header {
      padding:0px 0px 20px;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      z-index: 10;
      position: absolute;
    }
    .withKey{
      padding: 3rem 3rem 0rem;
    }

    .legend {
      display: flex;
      overflow: auto;
      gap: 1.5rem;
      font-size: 1rem;
      align-items: center;
      margin: 0px 1.2rem;
      padding-bottom: 1rem;
      width: calc(100% - 2.4rem);
    }

    .legend-keyOnly {
      justify-content: center;
      padding: 0px;
      margin-top: 2rem;
      /* padding-bottom: 1.5rem; */
    }

    .legend p{
        font-size: 1rem;
        font-weight: 600;
    }

    .legend .row-1 {
      width: auto;
      color: #ccc;
      flex-shrink: 0;
      margin: 0 0.5px;
    }
    .legend .indictor {
      margin-right: 3px;
    }
    .indictor {
      width: 12px;
      height: 12px;
      border-radius: 3px;
      margin-right: 10px;
      display: inline-block;
    }
    .row-1 {
      display: flex;
      /* align-items: center; */
      /* margin-bottom: 5px; */
    }
    .legend::-webkit-scrollbar {
		height: .5rem;
		width: .5rem;
	}
	.legend::-webkit-scrollbar-track {
		width: 100%;
		border-left: .1rem solid #212830;
		border-top: .1rem solid #212830;
		background: #0d121a;
		border-radius: 3rem;

	}

	.legend::-webkit-scrollbar-thumb {
		background: #383c42;
		border-radius: 1rem;
	}

	::-webkit-scrollbar-corner {
		background: #0d121a;
		border-top: .1rem solid #212830;
		border-right: .1rem solid #212830;
	}
  </style>
<script>
    export let isActive
    export let actions
    export let title
    export let selectedIndex
    export let type
    export let tags
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
      class="dropdown"
      class:active={isActive}
  
>
      <div on:click={() => (isActive = !isActive)} href="#" class="dropdown-title">
        <div class="item-name">
          <div>
            {#if type == "multiple"}
                <div class="tags">
                    {#each tags as t}
                        <span>{t}</span>
                    {/each}
                </div>
            {:else}
                {title}
            {/if}
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3.5 5.25L7 8.75L10.5 5.25"
            stroke="white"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="{`dropdown-content ${$$restProps.class}` || 'dropdown-content'}">
        {#each actions as action, i}
          <div>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            {#if type == "multiple"}
                <div class="checkbox-holder" on:click={(e) => {
                    let temp = [...tags]
                    if(temp.includes(action.name)){
                        temp.splice(tags.indexOf(action.name), 1)
                        tags = temp
                        
                    } else {
                        temp.push(action.name)
                        tags = temp
                    }
                
                }}>
                    <div>
                        <input 
                            type="checkbox" 
                            class="checkmark"
                        />
                    </div>
                   
                    {action.name}
                </div>
            {:else}
                <div class="checkbox-holder" on:click={() =>  selectedIndex = i}>
                    {action.name}
                </div>
            {/if}
          </div>
        {/each}
      </div>
</div>

<style>
.tags {
    display: flex;
    gap: 1rem;
}
.tags span {
    background-color: #383C42;
    padding: 0.5rem;
    border-radius: 0.5rem;
}
.dropdown-title {
    background-color: #0d121a;
    cursor: pointer;
    padding: 1rem 1.5rem;
    font-size: 1.3rem;
    border: .1rem solid #1A1F26;
}

.dropdown-content {
    width: 160px;
    background-color: #0d121a;
    border: .1rem solid #1A1F26;
    right: 0px;
    position: absolute;
    top: -5px;
    overflow: hidden;
    font-size: 1.3rem;
  }

.checkbox-holder {
    padding-left: 1.5rem;
    display: flex;
    gap: 3rem;
    align-items: center;
}

.item-name{
    margin-right: 1.5rem ;
}

.checkmark {
		min-width: auto;
		max-width: auto;
        width: 0;
        height: 0;
		opacity: 1;
		border: .2rem solid #383C42;   
		cursor: pointer;
	}

.checkmark:after {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1;
    width: 1.8rem;
    height: 1.8rem;
    border: .2rem solid #383C42;
    border-radius: .4rem;
    background-repeat: no-repeat;
    background-position: center;
    transform: translateY(-50%);
}

.checkmark:checked:after {
    background-image: url('/assets/icons/ic-check.svg');
}

</style>
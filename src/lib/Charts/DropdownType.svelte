<script>
    export let isActive;
    export let actions;
    export let title;
    export let selectedIndex;
    export let type;
    export let tags;
    export let allowSearch;
    export let allowTypeAdd;
    export let prefix;
    export let icon

    let domChecks = [];
    let searchValue = "";
    let tagValue = "";
    let proccesedActions = [];

    $: searchValue, allowSearch && handleSearch();
    $: actions, (proccesedActions = actions);

    const handleSearch = () => {
        proccesedActions = actions.filter((d) =>
            d.name.toLowerCase().includes(searchValue.toLowerCase())
        );
    };

    const handleKeydown = (e) => {
        if (e.key != "Enter" || !allowTypeAdd) return;
        actions.push({
            name: tagValue,
            index: actions.length,
        });
        tags.push(tagValue);

        actions = actions;
        proccesedActions = actions;
        tags = tags;
        tagValue = "";
    };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="dropdown" class:active={isActive}>
  <div on:click={() => (isActive = !isActive)} href="#" class="dropdown-title">
    <div class="item-name">
      <div>
        {#if type == "multiple"}
            <div class="tags">
                {#each tags as t}
                    {#if t}
                        <span>{t}</span>
                    {/if}
                {/each}
            </div>
        {:else}
            <div class="no-checkbox-holder">
                {#if icon}
                    {@html icon}
                {/if}
                {`${title}${prefix ? prefix : ""}`}

            </div>
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
            stroke="#88888A"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
  </div>
    <div class={`dropdown-content ${$$restProps.class} custom-bar` ||
        "dropdown-content custom-bar"}
    >
        {#if allowSearch}
        <input
            class="searchAction"
            type="text"
            placeholder="search"
            bind:value={searchValue}
        />
        {/if}
        {#if allowTypeAdd}
            <input
                on:keydown={handleKeydown}
                class="searchAction"
                type="text"
                placeholder="add tag"
                bind:value={tagValue}
            />
        {/if}
        <div class={`${$$restProps.class} custom-bar` || "custom-bar"}>
        {#each proccesedActions as action, i}
            <div>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            {#if type == "multiple"}
                <div class="checkbox-holder">
                <div>
                    <input
                    bind:this={domChecks[i]}
                    on:click={() => {
                        let temp = [...tags];
                        if (temp.includes(action.name)) {
                        temp.splice(tags.indexOf(action.name), 1);
                        tags = temp;
                        } else {
                        temp.push(action.name);
                        tags = temp;
                        }
                    }}
                    type="checkbox"
                    class="checkmark"
                    checked={tags.includes(action.name)}
                    />
                </div>

                <span
                    on:click={() => {
                    domChecks[i].click();
                    }}>{action.name}</span
                >
                </div>
            {:else}
                <div
                    class="checkbox-holder no-checkbox-holder"
                    on:click={() => {selectedIndex = action.index; isActive = !isActive}}
                >
                
                        {#if action.icon}
                            {@html action.icon}
                        {/if}
                        {`${action.name}${prefix ? prefix : ""}`}
            
                    
                </div>
            {/if}
            </div>
        {/each}
        </div>
  </div>
</div>

<style>
.no-checkbox-holder{
    display: flex;
    align-items: center;
    gap: 1rem !important
}

.flex{
    display: flex;
    align-items: center;
}
.dropdown{
    font-size: 1.3rem;
}
.searchAction {
    background-color: #1a1f26;
    color: #fff;
    border: none;
    outline: none;
    padding: 1rem 1.3rem;
    border-bottom: 1px solid #0d121a;
    position: static;
    top: 0px;
}
.tags {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}
.tags span {
    background-color: #383c42;
    padding: 0.5rem;
    border-radius: 0.5rem;
}
.dropdown-title {
    background-color: transparent;
}

.dropdown-content {
    width: 160px;
    background-color: #0d121a;
    border: 0.1rem solid #1a1f26;
    right: 0px;
    position: absolute;
    top: -5px;
    overflow: hidden;
    border-radius: 0.5rem;
}

.checkbox-holder {
    padding-left: 1.5rem;
    display: flex;
    gap: 3rem;
    align-items: center;
}

.item-name {
    margin-right: 1.5rem;
}

.checkmark {
    min-width: auto;
    max-width: auto;
    width: 0;
    height: 0;
    opacity: 1;
    border: 0.2rem solid #383c42;
    cursor: pointer;
}

.checkmark:after {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1;
    width: 1.8rem;
    height: 1.8rem;
    border: 0.2rem solid #383c42;
    border-radius: 0.4rem;
    background-repeat: no-repeat;
    background-position: center;
    transform: translateY(-50%);
}

.checkmark:checked:after {
    background-image: url("/assets/icons/ic-check.svg");
}
</style>

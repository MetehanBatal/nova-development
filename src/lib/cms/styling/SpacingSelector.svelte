<script>
    import { selectedInstance } from "$stores/cms/selectedInstance";
	import { alterStylingProperty } from '$stores/cms/functions';

	import { onMount } from "svelte";

	let initialized = false;
	let selectionChangeInProgress = false;
	let dropdownExpanded = false;

    onMount(() => {
        initialized = true;
    });

	let marginTopValue = '';
	let marginLeftValue = '';
	let marginRightValue = '';
	let marginBottomValue = '';
	/* ********************** */
	let paddingTopValue = '';
	let paddingLeftValue = '';
	let paddingRightValue = '';
	let paddingBottomValue = '';


    function getProperties() {
        selectionChangeInProgress = true;
        marginTopValue = $selectedInstance.styling?.['margin-top'] ? $selectedInstance.styling['margin-top'] : '';
		marginLeftValue = $selectedInstance.styling?.['margin-left'] ? $selectedInstance.styling['margin-left'] : '';
		marginRightValue = $selectedInstance.styling?.['margin-right'] ? $selectedInstance.styling['margin-right'] : '';
		marginBottomValue = $selectedInstance.styling?.['margin-bottom'] ? $selectedInstance.styling['margin-bottom'] : '';
		paddingTopValue = $selectedInstance.styling?.['padding-top'] ? $selectedInstance.styling['padding-top'] : '';
		paddingLeftValue = $selectedInstance.styling?.['padding-left'] ? $selectedInstance.styling['padding-left'] : '';
		paddingRightValue = $selectedInstance.styling?.['padding-right'] ? $selectedInstance.styling['padding-right'] : '';
		paddingBottomValue = $selectedInstance.styling?.['padding-bottom'] ? $selectedInstance.styling['padding-bottom'] : '';
        
        setTimeout(() =>{
            selectionChangeInProgress = false;
        }, 120);
    }

	function handleStylingChange(target) {
        alterStylingProperty(target.getAttribute('name'), target.value);
    }

	$: $selectedInstance.instanceId, getProperties();
</script>

<div class="styling-group">
    <div class="header" on:click={() => { dropdownExpanded = !dropdownExpanded }}>
        <h4>Spacing</h4>
        
        <svg style={`transform: rotate(${dropdownExpanded ? '90deg' : '0deg'});`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.29287 8.00004L6.64642 5.35359L7.35353 4.64648L10.7071 8.00004L7.35353 11.3536L6.64642 10.6465L9.29287 8.00004Z" fill="currentColor"></path>
        </svg>
    </div>

    {#if dropdownExpanded}
      <div class="options"> 
        <p>Margin</p>
        <div class="spacing-items">
            <div>
              <label for="margin-top">Top</label>
              <input type="text" name="margin-top" bind:value={marginTopValue} on:blur={(e) => { handleStylingChange(e.target)}} />
            </div>
            
            <div>
              <label for="margin-left">Left</label>
              <input type="text" name="margin-left" bind:value={marginLeftValue} on:blur={(e) => { handleStylingChange(e.target)}} />
            </div>

            <div>
              <label for="margin-right">Right</label>
              <input type="text" name="margin-right" bind:value={marginRightValue} on:blur={(e) => { handleStylingChange(e.target)}} />
            </div>

            <div>
              <label for="margin-bottom">Bottom</label>
              <input type="text" name="margin-bottom" bind:value={marginBottomValue} on:blur={(e) => { handleStylingChange(e.target)}} />
            </div>
        </div>

        <p>Padding</p>
        <div class="spacing-items">
            <div>
              <label for="padding-top">Top</label>
              <input type="text" name="padding-top" bind:value={paddingTopValue} on:blur={(e) => { handleStylingChange(e.target)}} />
            </div>
            
            <div>
              <label for="padding-left">Left</label>
              <input type="text" name="padding-left" bind:value={paddingLeftValue} on:blur={(e) => { handleStylingChange(e.target)}} />
            </div>

            <div>
              <label for="padding-right">Right</label>
              <input type="text" name="padding-right" bind:value={paddingRightValue} on:blur={(e) => { handleStylingChange(e.target)}} />
            </div>

            <div>
              <label for="padding-bottom">Bottom</label>
              <input type="text" name="padding-bottom" bind:value={paddingBottomValue} on:blur={(e) => { handleStylingChange(e.target)}} />
            </div>
        </div>
    </div>
    {/if}
</div>

<style>
    .styling-group {
        padding: 1rem;

        border-bottom: .1rem solid #2e2e2e;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        font-size: 1.4rem;
    }

    .options > p {
      margin-block: 1.5rem;
      font-size: 1.3rem;
    }
</style>
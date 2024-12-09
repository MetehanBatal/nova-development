<script>
    import { onDestroy } from 'svelte';
    import { selectedInstance } from "../../stores/cms/selectedInstance";
    import { styleSheet } from '../../stores/cms/styleSheet';

    export let selectedPage;

    // Component state
    let classSelections = [];
    let suggestedClassNames = [];
    let selectionMode = false;
    let selectionInput;
    let newClassName = '';
    let selectionBox;

    let lastSelectedId = '';

    // Helper functions
    const parseClassAttribute = (attribute) => 
        attribute?.value
            ?.split(' ')
            .map(className => className.trim())
            .filter(Boolean)
            .map(name => ({ name })) ?? [];

    const updateClassSelections = (from) => {
        if (from === 'elementChange' && lastSelectedId === JSON.stringify($selectedInstance.instanceId)) {
            return; }
        lastSelectedId = JSON.stringify($selectedInstance.instanceId);
        const classAttribute = $selectedInstance.attributes?.find(attr => attr.name === 'class');
        classSelections = parseClassAttribute(classAttribute);

        console.log($selectedInstance.instanceId);
        selectedPage.triggerId = $selectedInstance.instanceId;
    };

    const getSuggestedClasses = (searchTerm = '') => {
        const filtered = $styleSheet.filter(ss => 
            ss.type === 'class' && 
            (!searchTerm || ss.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        // Convert to Set and back to array to remove duplicates
        const uniqueNames = [...new Set(filtered.map(ss => ss.name))];
        
        // Return first 25 or 5 results depending on searchTerm
        return uniqueNames.slice(0, searchTerm ? 25 : 5);
    };

    // Event handlers
    const handleClickOutside = (event) => {
        if (selectionBox && !selectionBox.contains(event.target)) {
            selectionMode = false;
        }
    };

    // const handleEnterKey = (event) => {
    //     if (event.key === 'Enter') {
    //         handleClassAdd();
    //     } else if (event.key === 'Backspace' && selectionMode && !newClassName) {
    //         const lastClass = classSelections[classSelections.length - 1]?.name;
    //         console.log('Last class: ', lastClass);
    //         if (lastClass) {
    //             removeClass(lastClass);
    //             classSelections = classSelections.slice(0, -1);
    //             console.log('Class s: ', classSelections);
    //             console.log('Ins after removal: ', $selectedInstance);
    //         }
    //     }
    // };

    // const handleClassAdd = () => {
    //     console.log($selectedInstance);
    //     if (newClassName) {
    //         console.log('NEW CLASS TO CADD: ', newClassName.toLowerCase().replace(/\s+/g, '-'), classSelections);
            
    //         newClassName = '';
    //     }
    //     selectionMode = false;
    // };

    // Lifecycle and reactive statements
    $: {
        if (selectionMode) {
            setTimeout(() => {
                selectionInput?.focus();
                document.addEventListener('click', handleClickOutside);
                // document.addEventListener('keydown', handleEnterKey);
            }, 240);
        } else {
            document.removeEventListener('click', handleClickOutside);
            // document.removeEventListener('keydown', handleEnterKey);
        }
    }

    $: suggestedClassNames = getSuggestedClasses(newClassName);
    $: $selectedInstance.instanceId, updateClassSelections('elementChange');

    onDestroy(() => {
        document.removeEventListener('click', handleClickOutside);
        // document.removeEventListener('keydown', handleEnterKey);
    });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="selection-box">
    <div class="selections" on:click={() => selectionMode = true}>
        <div class="icon-holder">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 5.36602L10.1519 6.43301L9.65192 5.56699L11.5 4.5L9.65193 3.43301L10.1519 2.56699L12 3.63397V1.5H13V3.63397L14.8481 2.56699L15.3481 3.43301L13.5 4.5L15.3481 5.56699L14.8481 6.43301L13 5.36602V7.5H12V5.36602ZM3 4H8V5H3V12H13V9H14V12H16V13H0V12H2V5C2 4.44772 2.44772 4 3 4Z" fill="currentColor"></path></svg>
        </div>
        {#if classSelections.length > 0}
            {#each classSelections as selection}
                <div class="selection">
                    <p>{selection.name}</p>
                </div>
            {/each}
        {:else if !selectionMode}
            <p class="label">Select an element from canvas</p>
        {/if}

        <input 
            bind:this={selectionInput} 
            bind:value={newClassName} 
            type="text" 
            style="flex: {selectionMode ? 1 : 0}"
        />
    </div>
</div>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- {#if selectionMode}
    <div class="class-selection-box" bind:this={selectionBox}>
        <div>
            <p class="subtitle">New Class</p>            
            <p on:click={handleClassAdd}>
                {newClassName || 'Type in to create a new class'}
            </p>
        </div>

        <div>
            <p class="subtitle">HTML Tag</p>
            <p class="tag">All {$selectedInstance.nodeName} Elements</p>
        </div>

        <div>
            <p class="subtitle">Existing Classes</p>
            {#each suggestedClassNames as className}
                <p  class="tag blue"  on:click={() => { newClassName = className; handleClassAdd(); }} >
                    {className}
                </p>
            {/each}
        </div>
    </div>
{/if} -->

<style>
    input {
        width: 0;
        border: 0;
        background-color: transparent;
        padding: 0;
    }

    .selection-box {
        display: flex;
        width: 100%;
        padding: 0.4rem;
        border: 0.1rem solid #212830;
        border-radius: 0.6rem;
        background-color: #0D121A;
        margin-top: 0.8rem;
    }

    .selections {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        flex: 1;
        gap: 0.4rem;
        height: 100%;
    }

    .selection {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 2.4rem;
        padding: 0 0.6rem;
        border-radius: 0.3rem;
        background-color: #947AF0;
        cursor: text;
        user-select: none;
    }

    .label {
        font-size: 1.2rem;
        line-height: 2.4rem;
        padding-left: 0.6rem;
        color: rgba(255, 255, 255, 0.66);
    }

    .class-selection-box {
        position: absolute;
        top: 100%;
        left: 1rem;
        right: 1rem;
        padding: 1rem;
        border: 0.1rem solid #212830;
        border-radius: 0.8rem;
        background-color: #0d121a;
        box-shadow: 0 0 0.8rem 0 rgba(13, 18, 26, 0.48);
        max-height: 36rem;
        overflow: auto;
        transform: translate3d(0, -0.4rem, 0);
        z-index: 9;
    }

    .class-selection-box div {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        margin-bottom: 0.8rem;
    }

    .subtitle {
        color: rgba(255, 255, 255, 0.66);
    }

    .tag {
        width: fit-content;
        
        line-height: 2.4rem;
        padding: 0 0.6rem;
        margin-bottom: 0.4rem;
        
        background-color: rgba(0, 125, 240, 0.25);
        border-radius: 0.2rem;

        cursor: pointer;
    }

    .blue {
        background-color: rgba(0, 125, 240, 0.25);
    }
</style>
<script>
    import { onDestroy } from 'svelte';
    import { selectedInstance } from "../../stores/cms/selectedInstance";
    import { styleSheet } from '../../stores/cms/styleSheet';
    import { injectClass } from "../../stores/cms/functions";

    let classSelections = [];
    let suggestedClassNames = [];
    let selectionMode = false;
    let selectionInput;
    let newClassName = '';
    let selectionBox;

    let classAttribute = $selectedInstance.attributes.find((attr) => attr.name === 'class');
    if (classAttribute && classAttribute.value) {
        classSelections = classAttribute.value
            .split(',') // Split the string by commas
            .map(className => className.trim()) // Trim whitespace from each class name
            .filter(className => className) // Remove any empty strings
            .map(className => ({ name: className })); // Map to the desired object structure
    }

    function focusInput() {
        if (!selectionMode) { return; }

        selectionInput.focus();
    }

    function alterSuggestedClassNames() {
        if (newClassName.length < 1) {
            suggestedClassNames = $styleSheet
                .filter((ss) => ss.type === 'class')
                .slice(0, 5)
                .map((ss) => ss.name);

            console.log(suggestedClassNames);
        } else {
            // When the user types something, filter class names that include the input
            const searchTerm = newClassName.toLowerCase();
            suggestedClassNames = $styleSheet
                .filter(ss => 
                    ss.type === 'class' && 
                    ss.name.toLowerCase().includes(searchTerm)
                )
                .slice(0, 25)
                .map(ss => ss.name);

            console.log('eeeeee??: ', suggestedClassNames);
        }
    }

    function handleClickOutside(event) {
        if (selectionBox && !selectionBox.contains(event.target)) {
            selectionMode = false;
        }
    }

    function handleEnterKey(event) {
        if (event.key === 'Enter') {
            handleClassAddUp();
        }
    }

    function handleClassAddUp() {
        if (newClassName.length > 0) {
            injectClass(newClassName);
        } 
        selectionMode = false;
    }

    function handlePopoverChanges() {
        if (selectionMode) {
            focusInput();

            setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
                document.addEventListener('keydown', handleEnterKey);
            }, 240);
        } else {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleEnterKey);
        }
    }

    $: selectionMode, handlePopoverChanges();
    $: newClassName, alterSuggestedClassNames();

    onDestroy(() => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEnterKey);
    });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="selection-box">
    <div class="selections" on:click={() => {selectionMode = true}}>
        {#if classSelections.length > 0}
            {#each classSelections as selection}
            <div class="selection">
                <p>{selection.name}</p>
            </div>
            {/each}
        {:else}
            {#if !selectionMode}
            <p class="label">Select a class or tag</p>
            {/if}
        {/if}

        <input bind:this={selectionInput} bind:value={newClassName} type="text" style={`flex: ${selectionMode ? 1 : 0}`} />
    </div>
</div>

{#if selectionMode}
<div class="class-selection-box" bind:this={selectionBox}>
    <div>
        <p class="subtitle">New Class</p>

        <p on:click={handleClassAddUp}>
            {newClassName.length > 0 ? newClassName : 'Type in to create a new class'}
        </p>
    </div>

    <div>
        <p class="subtitle">HTML Tag</p>

        <p class="tag">All {$selectedInstance.nodeName} Elements</p>
    </div>

    <div>
        <p class="subtitle">Existing Classes</p>

        {#each suggestedClassNames as className}
        <p class="tag blue" on:click={() => {newClassName = className; handleClassAddUp()}}>{className}</p>
        {/each}
    </div>
</div>
{/if}

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
        gap: 0.4rem;
        flex: 1;
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
    }

    .blue {
        background-color: rgba(0, 125, 240, 0.25);
    }
</style>

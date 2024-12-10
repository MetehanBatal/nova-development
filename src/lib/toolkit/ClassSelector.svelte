<script>
    import { onDestroy } from 'svelte';
    import { selectedInstance } from "$stores/cms/selectedInstance";
    import { styleSheet } from '$stores/cms/styleSheet';
    import { injectClass, removeClass } from "$stores/cms/functions";

    // Component state
    let classSelections = [];
    let suggestedClassNames = [];
    let selectionMode = false;
    let selectionInput;
    let newClassName = '';
    let selectionBox;

    // Helper functions
    const parseClassAttribute = (attribute) => 
        attribute?.value
            ?.split(' ')
            .map(className => className.trim())
            .filter(Boolean)
            .map(name => ({ name })) ?? [];

    const updateClassSelections = () => {
        const classAttribute = $selectedInstance.attributes.find(attr => attr.name === 'class');
        classSelections = parseClassAttribute(classAttribute);
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

    const handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            handleClassAdd();
        } else if (event.key === 'Backspace' && selectionMode && !newClassName) {
            const lastClass = classSelections[classSelections.length - 1]?.name;
            if (lastClass) {
                removeClass(lastClass);
                classSelections = classSelections.slice(0, -1);
            }
        }
    };

    const handleClassAdd = () => {
        if (newClassName) {
            injectClass(newClassName.toLowerCase().replace(/\s+/g, '-'), classSelections, 'handle class add');
            updateClassSelections();
            newClassName = '';
        }
        selectionMode = false;
    };

    // Lifecycle and reactive statements
    $: {
        if (selectionMode) {
            setTimeout(() => {
                selectionInput?.focus();
                document.addEventListener('click', handleClickOutside);
                document.addEventListener('keydown', handleEnterKey);
            }, 240);
        } else {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleEnterKey);
        }
    }

    $: suggestedClassNames = getSuggestedClasses(newClassName);
    $: if ($selectedInstance.instanceId) updateClassSelections();

    onDestroy(() => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEnterKey);
    });
</script>

<div class="selection-box">
    <div class="selections" on:click={() => selectionMode = true}>
        {#if classSelections.length}
            {#each classSelections as selection}
                <div class="selection">
                    <p>{selection.name}</p>
                </div>
            {/each}
        {:else if !selectionMode}
            <p class="label">Select a class or tag</p>
        {/if}

        <input 
            bind:this={selectionInput} 
            bind:value={newClassName} 
            type="text" 
            style="flex: {selectionMode ? 1 : 0}"
        />
    </div>
</div>

{#if selectionMode}
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
                <p 
                    class="tag blue" 
                    on:click={() => {
                        newClassName = className;
                        handleClassAdd();
                    }}
                >
                    {className}
                </p>
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
    }

    .blue {
        background-color: rgba(0, 125, 240, 0.25);
    }
</style>
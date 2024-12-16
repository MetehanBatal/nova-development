<script>
    import { generateRandomString, generateRandomNumber, dbActions, sanitizeComponentName } from "../../../stores/cms/functions";
    import { pages } from '../../../stores/cms/pages';
    import { selectedInstance } from '../../../stores/cms/selectedInstance';
    import { instances } from '../../../stores/cms/instances';
    import { toastMessage } from "../../../stores/toast";

    let componentMenuRevealed = false;
    let componentName = '';

    let newComponentId = `c-${generateRandomString()}`;
    let newVariantId = `v-${generateRandomString()}`;
    let currentInstance;
    $: $selectedInstance.instanceId, currentInstance = $instances.find((ins) => ins.instanceId === $selectedInstance.instanceId);

    let instancesToUpdate = [];
    let componentOrderCount = 1;
    let componentDepthCount = 1;
    function updateChildInstances(topInstanceId) {
        const childrens = $instances.filter((i) => i.parentInstanceId === topInstanceId).sort((a, b) => a.order - b.order);

        console.log(childrens, $instances, topInstanceId);

        childrens.forEach((child) => {
            child.componentId = newComponentId;
            child.variantId = newVariantId;
            child.order = componentOrderCount;
            child.depth = componentDepthCount;
            child.pageId = 'COMPONENT';

            componentOrderCount = componentOrderCount + 1;

            instancesToUpdate.push(child);

            if ($instances.some((i) => i.parentInstanceId === child.instanceId)) {
                componentDepthCount = componentDepthCount + 1;
                updateChildInstances(child.instanceId);
            }
        });
    }

    async function saveComponent() {
        const sanitizedName = sanitizeComponentName(componentName);
        let schema = {
            componentId: newComponentId,
            name: componentName,
            componentName: sanitizedName,
            occurrences: [
                {
                    pageId: $pages.pages[$pages.selectedPageIndex].pageId,
                    order: currentInstance.order,
                    depth: currentInstance.depth,
                    parentInstanceId: currentInstance.parentInstanceId,
                    defaultVariantId: newVariantId
                }
            ],
            path: `/src/lib/components/${newComponentId}.svelte`,
            thumbnail: '',
            attributes: []
        };

        let componentPlaceholder = {
            instanceId: generateRandomString(),
            componentId: newComponentId,
            variantId: newVariantId,
            order: currentInstance.order,
            depth: currentInstance.depth,
            nodeName: componentName,
            pageId: $pages.pages[$pages.selectedPageIndex].pageId,
            parentInstanceId: currentInstance.parentInstanceId,
            attributes: [{
                name: 'defaultVariantId',
                value: newVariantId
            }]
        };

        currentInstance.componentId = newComponentId;
        currentInstance.variantId = newVariantId;
        currentInstance.pageId = 'COMPONENT';
        currentInstance.parentInstanceId = null;
        currentInstance.order = 0;
        currentInstance.depth = 0;

        updateChildInstances(currentInstance.instanceId);

        // Add componentPlaceholder & currentInstance to the update list
        instancesToUpdate.push(currentInstance);
        instancesToUpdate.push(componentPlaceholder);
        

        // Filter out undefined instances (in case of unexpected results)
        instancesToUpdate = instancesToUpdate.filter((instance) => instance !== undefined);

        // Build the variant schema
        let variantSchema = {
            variantId: newVariantId,
            componentId: newComponentId,
            name: `Base Variant ${generateRandomNumber(4)}`
        };

        const instanceMap = new Map($instances.map(instance => [instance.instanceId, instance]));
        
        instancesToUpdate.forEach(updateInstance => {
            instanceMap.set(updateInstance.instanceId, updateInstance);
        });
        
        $instances = Array.from(instanceMap.values());


        console.log(instancesToUpdate, schema, variantSchema);


        // currentInstance.parentInstanceId = 'component';

        let updatedInstances = await dbActions(instancesToUpdate, 'instances', 'upsert');
        let updatedComponent = await dbActions(schema, 'components', 'upsert');
        let updatedVariant = await dbActions(variantSchema, 'variants', 'upsert');

        $toastMessage = {
            type: 'success',
            content: 'Component created!'
        }

        componentMenuRevealed = false;
    }
</script>

<button class="create-component-button" on:click={() => componentMenuRevealed = !componentMenuRevealed}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.47885 1.69144C8.18037 1.52863 7.81963 1.52863 7.52115 1.69144L2.52115 4.41871C2.19989 4.59395 2 4.93066 2 5.29661V10.703C2 11.0689 2.19989 11.4056 2.52115 11.5809L7.52115 14.3081C7.81963 14.471 8.18037 14.471 8.47885 14.3081L8.5 14.2966V13.1575V11.5V8.29661L13 5.84206V8H14V5.29661C14 4.93066 13.8001 4.59395 13.4789 4.41871L8.47885 1.69144ZM3.54416 4.99979L8 2.56934L12.4558 4.99979L8 7.43025L3.54416 4.99979ZM3 5.84206L3 10.703L7.5 13.1575V8.29661L3 5.84206ZM13 9V11H15V12H13V14H12V12H10V11H12V9H13Z" fill="currentColor"></path></svg>
</button>

{#if componentMenuRevealed}
<div class="component-menu">
    <div>
        <p>Name</p>
        
        <input type="text" name="text" bind:value={componentName} />
    </div>

    <button on:click={() => saveComponent()}>
        <p>Save</p>
    </button>
</div>
{/if}

<style>
    .create-component-button {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 3.2rem;
        height: 3.2rem;

        margin-left: auto;

        border-radius: .4rem;

        color: #e3e3e3;

        cursor: pointer;
    }

    button svg {
        width: 2.4rem;
    }

    .component-menu {
        display: flex;
        flex-direction: column;
        gap: .6rem;

        position: absolute;
        top: 3rem;
        right: 0;
        
        background: #060b13;
        padding: 1.2rem;

        z-index: 9;
    }

    .component-menu button {
        border: .1rem solid #2e2e2e;
        border-radius: .6rem;
    }

    button p {
        color: #fff
    }
</style>
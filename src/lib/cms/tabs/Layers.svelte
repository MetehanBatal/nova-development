<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import DragDropList from '$lib/cms/DragDropList.svelte';

    import { clipboard } from '../../../stores/cms/clipboard';
    import { instances } from '../../../stores/cms/instances';
    import { visibleIds } from '../../../stores/cms/visibleIds';
    import { selectedInstance } from '../../../stores/cms/selectedInstance';
    import { pages } from '../../../stores/cms/pages';
    import { styleSheet } from '../../../stores/cms/styleSheet';
    import { nodeTags } from '../../../stores/cms/nodeTags';
    import { drawInstances, postMessage, generateRandomString, dbActions } from '../../../stores/cms/functions';

    let pageComponents = [];

    function filterAdditionalVariants(instances, pageComponents, pageId) {
        return instances.filter(instance => {
            if (!instance.componentId) return true;
            const matchingComponent = pageComponents.find(comp => 
                comp.componentId === instance.componentId
            );
            if (!matchingComponent) return true;
            const occurrence = matchingComponent.occurrences.find(occ => 
                occ.pageId === pageId
            );
            if (!occurrence) return true;
            return !instance.variantId || instance.variantId === occurrence.defaultVariantId;
        }).map(({
            instanceId, 
            assetId, 
            pageId, 
            componentId, 
            variantId, 
            nodeName, 
            parentInstanceId, 
            attributes, 
            content, 
            order, 
            depth
        }) => ({
            instanceId,
            assetId,
            pageId,
            componentId,
            variantId,
            nodeName,
            parentInstanceId,
            attributes,
            content,
            order,
            depth
        }));
    }

    let currentOrder = 1;
    let dInstances = [];
    
    function calculateLayerOrders(element) {
        if (element.nodeName === 'BODY') {
            element.layerOrder = 0;
        }
        let children = dInstances.filter((d) => d.parentInstanceId === element.instanceId).sort((a, b) => a.order - b.order);

        children.forEach((child) => {
            child.layerOrder = currentOrder;
            currentOrder += 1;
            if (dInstances.some((d) => d.parentInstanceId === child.instanceId)) {
                calculateLayerOrders(child);
            }
        });
    }

    async function fetchInstances(from) {
        setTimeout(async () => {
            console.warn('Fetch instances called');
            let selectedPageId = $pages.pages[$pages.selectedPageIndex].pageId
            try {
                const instanceReq = await fetch(`https://preconvert.novus.studio/staging/instances/view?pageId=${selectedPageId}`);
                const instanceRes = await instanceReq.json();

                dInstances = instanceRes.data.instances;

                pageComponents = instanceRes.data.components;
                $instances = filterAdditionalVariants(instanceRes.data.instances, pageComponents, selectedPageId);
                calculateLayerOrders(instanceRes.data.instances.find((d) => d.nodeName === 'BODY'));
                $instances = dInstances;

                console.log(pageComponents);

                let drawIns = drawInstances();

                if (from === 'pageChange') {
                    postMessage('initialization', {
                        page: $pages.pages[$pages.selectedPageIndex], 
                        components: pageComponents, 
                        instances: $instances, 
                        styleSheet: $styleSheet
                    });
                }
                
                return instanceRes.data;
            } catch (error) {
                console.error('Error fetching instances:', error);
            }
        }, 1800)
    }

    async function updateElements(items, instance) {
        // let updatedInstances = await dbActions(items, 'instances', 'upsert');

        console.log('Updated instance for order: ', instance);

        postMessage('orderChanged', { instanceId: instance.instanceId, parentId: instance.parentInstanceId, order: instance.order });

        console.log(items, instance);
    }

    function getAllDescendants(items, item) {
        // Get all descendants of an item in order
        const descendants = [];
        const processItem = (currentItem) => {
            const children = items
                .filter(i => i.parentInstanceId === currentItem.instanceId)
                .sort((a, b) => a.order - b.order);
                
            children.forEach(child => {
                descendants.push(child);
                processItem(child);
            });
        };
        
        processItem(item);
        return descendants;
    }

    async function handleKeyboard(e) {
        // Check if cmd (mac) or ctrl (windows) is pressed
        const isCmdOrCtrl = e.metaKey || e.ctrlKey;
        
        // Only handle if element is focused
        if ($selectedInstance.instanceId.length < 1) return;

        if (isCmdOrCtrl && e.key === 'c') {
            e.preventDefault(); // Prevent default copy
            // Store data in internal clipboard
            let data = [$instances.find((i) => i.instanceId === $selectedInstance.instanceId), ...getAllDescendants(JSON.parse(JSON.stringify($instances)), $selectedInstance)];
            $clipboard = JSON.stringify(data);

            console.log('DATA COPIED: ', data);

            // // Also put data in system clipboard, but in a marked format
            // const markedData = {
            //     type: 'cms-internal-data',
            //     timestamp: Date.now(),
            //     content: data
            // };

            // try {
            //     await navigator.clipboard.writeText(JSON.stringify(markedData));
            //     // Optional: Show success feedback
            //     console.log('Copied to clipboard');
            // } catch (err) {
            //     console.error('Failed to copy to system clipboard:', err);
            // }
        }

        if (isCmdOrCtrl && e.key === 'v') {
            if ($clipboard) {
                const pastedData = JSON.parse($clipboard);
                onPaste(pastedData);
            }
        }
    };

    async function onPaste(data) {
        let transformed = transformIds(data.sort((a,b) => a.depth - b.depth));

        console.log('DATA PASTED: ', transformed);

        // Find the current instance        
        let siblings = $instances.filter((i) => i.parentInstanceId === $selectedInstance.instanceId).sort((a,b) => a.order - b.order);
        let newOrder = siblings.length > 0 ? siblings[siblings.length - 1].order + 1 : 0;
        let topInstance = transformed.find((t) => t.parentInstanceId === null)
        topInstance.order = newOrder;
        topInstance.parentInstanceId = $selectedInstance.instanceId;

        let updatedInstances = await dbActions(transformed, 'instances', 'upsert');
    }

    function transformIds(items) {
        // Create a mapping of old IDs to new IDs
        const idMapping = {};
        
        items.forEach(item => {
            const newId = generateRandomString();
            idMapping[item.instanceId] = newId;
        });
        
        const transformedItems = items.map(item => ({
            ...item,
            instanceId: idMapping[item.instanceId],
            parentInstanceId: idMapping[item.parentInstanceId] ? idMapping[item.parentInstanceId] : null
        }));
        
        return transformedItems;
    }

    $: $pages.selectedPageIndex, fetchInstances('pageChange');
    $: $instances, dInstances.length > 0 ? calculateLayerOrders(dInstances.find((d) => d.nodeName === 'BODY')) : '';

    onMount(() => {
        if (browser) {
            window.addEventListener('keydown', handleKeyboard);
        }
    });

    onDestroy(() => {
        if (browser) {
            window.removeEventListener('keydown', handleKeyboard);
        }
    });
</script>

<DragDropList 
    items={$instances}
    pageComponents={pageComponents}
    nodeTags={nodeTags}
    on:change={({ detail }) => {
        console.log(detail);
        $instances = detail.finalItems;
        updateElements(detail.affectedInstances, detail.movedInstance);
        // $instances = detail.items;
    }}
/>
<script>
    import DragDropList from '$lib/cms/DragDropList.svelte';
    import { instances } from '../../../stores/cms/instances';
    import { visibleIds } from '../../../stores/cms/visibleIds';
    import { pages } from '../../../stores/cms/pages';
    import { styleSheet } from '../../../stores/cms/styleSheet';
    import { nodeTags } from '../../../stores/cms/nodeTags';
    import { drawInstances, postMessage, dbActions } from '../../../stores/cms/functions';

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

    async function fetchInstances(from) {
        setTimeout(async () => {
            console.warn('Fetch instances called');
            let selectedPageId = $pages.pages[$pages.selectedPageIndex].pageId
            try {
                const instanceReq = await fetch(`http://localhost:3030/staging/instances/view?pageId=${selectedPageId}`);
                const instanceRes = await instanceReq.json();

                pageComponents = instanceRes.data.components;
                $instances = filterAdditionalVariants(instanceRes.data.instances, pageComponents, selectedPageId);

                console.log($instances);

                let drawIns = drawInstances();
                console.log('DDD: ', drawIns, $visibleIds);

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
        let updatedInstances = await dbActions(items, 'instances', 'upsert');

        postMessage('orderChanged', { instanceId: instance.instanceId, parentId: instance.parentId, order: instance.order });

        console.log(items, updatedInstances);
    }

    $: $pages.selectedPageIndex, fetchInstances('pageChange');
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
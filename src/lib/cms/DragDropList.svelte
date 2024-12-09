<script>
    import { selectedInstance } from '../../stores/cms/selectedInstance';
    import { visibleIds } from '../../stores/cms/visibleIds';
    import { instances } from '../../stores/cms/instances';
    import { pages } from '../../stores/cms/pages';
    import { cmsMode } from '../../stores/cms/cmsMode';
    import { drawInstances, changeSelection, toggleExpand, focusOnComponent} from '../../stores/cms/functions';
    import { browser } from '$app/environment';
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';

    const dispatch = createEventDispatcher();

    export let items = [];
    export let nodeTags;
    export let canDrag = () => true;

    let draggedItem = null;
    let draggedIndex = -1;
    let listElement;
    let itemElements = [];
    let dropIndicator;
    let currentDropTarget = null;
    let isDragging = false;

    function createDropIndicator() {
        dropIndicator = document.createElement('div');
        dropIndicator.className = 'drop-indicator';
        document.body.appendChild(dropIndicator);
    }

    function getAllDescendants(item) {
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

    function updateDepths(item, newParentDepth) {
        // Update depth of item and all its descendants
        const depthDiff = (newParentDepth + 1) - item.depth;
        item.depth = newParentDepth + 1;
        
        const descendants = getAllDescendants(item);
        descendants.forEach(descendant => {
            descendant.depth += depthDiff;
        });
    }

    function recalculateOrders(startIndex) {
        // Recalculate orders for all items after startIndex
        const sortedItems = [...items].sort((a, b) => a.order - b.order);
        const baseOrder = startIndex > 0 ? sortedItems[startIndex - 1].order : -1;
        
        for (let i = startIndex; i < sortedItems.length; i++) {
            sortedItems[i].order = baseOrder + i + 1;
        }
        
        return sortedItems;
    }

    function handleDragStart(e, index) {
        if (!browser || !canDrag(items[index])) return;
        
        isDragging = true;
        draggedItem = items[index];
        draggedIndex = index;

        console.log('Dragged Item: ', draggedItem);
        
        createDropIndicator();
        
        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('mouseup', handleDragEnd);
        
        itemElements[draggedIndex].style.opacity = "0.8";
        
        e.preventDefault();
    }

    function handleDrag(e) {
        if (!browser || draggedIndex === -1) return;

        const currentY = e.clientY;
        const listRect = listElement.getBoundingClientRect();
        
        // Handle scrolling
        if (currentY < listRect.top + 50) {
            listElement.scrollTop -= 10;
        } else if (currentY > listRect.bottom - 50) {
            listElement.scrollTop += 10;
        }

        // Get dragged item and its descendants
        const draggedItemWithChildren = [draggedItem, ...getAllDescendants(draggedItem)];
        const draggedIds = draggedItemWithChildren.map(item => item.instanceId);

        // Find closest drop target (excluding dragged item and its children)
        const visibleIndices = items.reduce((acc, item, index) => {
            if ($visibleIds.includes(item.instanceId) && 
                !draggedIds.includes(item.instanceId) &&
                itemElements[index]) {
                acc.push(index);
            }
            return acc;
        }, []);

        if (visibleIndices.length === 0) return;

        // Find closest valid target
        let closestIndex = -1;
        let minDistance = Infinity;
        let position = 'before';

        for (const index of visibleIndices) {
            const element = itemElements[index];
            if (!element) continue;

            const rect = element.getBoundingClientRect();
            const topDistance = Math.abs(currentY - rect.top);
            const bottomDistance = Math.abs(currentY - rect.bottom);

            if (topDistance < minDistance) {
                minDistance = topDistance;
                closestIndex = index;
                position = 'before';
            }
            if (bottomDistance < minDistance) {
                minDistance = bottomDistance;
                closestIndex = index;
                position = 'after';
            }
        }

        if (closestIndex === -1) return;

        // Only proceed if target has changed
        if (currentDropTarget?.index !== closestIndex || currentDropTarget?.position !== position) {
            const targetItem = items[closestIndex];
            const newItems = [...items];

            // Determine new parent
            const newParent =
            position === 'after' && newItems.filter((i) => i.parentInstanceId === targetItem.instanceId).some(({instanceId}) => $visibleIds.includes(instanceId))
                ? targetItem 
                : newItems.find(item => item.instanceId === targetItem.parentInstanceId);

            // Update depths based on new parent
            if (newParent) {
                updateDepths(draggedItem, newParent.depth);
                draggedItem.parentInstanceId = newParent.instanceId;
            }

            // Remove and reinsert all moving items
            draggedItemWithChildren.forEach(item => {
                const index = newItems.findIndex(i => i.instanceId === item.instanceId);
                if (index !== -1) newItems.splice(index, 1);
            });

            const insertIndex = position === 'before' ? 
                closestIndex : 
                (closestIndex < draggedIndex ? closestIndex + 1 : closestIndex);

            newItems.splice(insertIndex, 0, ...draggedItemWithChildren);
            
            // Recalculate orders
            items = recalculateOrders(insertIndex);
            draggedIndex = insertIndex;
            currentDropTarget = { index: closestIndex, position };

            // Update drop indicator
            if (dropIndicator) {
                const targetElement = itemElements[closestIndex];
                if (targetElement) {
                    const rect = targetElement.getBoundingClientRect();
                    const parentRect = listElement.getBoundingClientRect();
                    const offset = 12 * draggedItem.depth;
                    
                    dropIndicator.style.left = `${parentRect.left + offset}px`;
                    dropIndicator.style.width = `${parentRect.width - offset}px`;
                    dropIndicator.style.top = `${position === 'before' ? rect.top : rect.bottom}px`;
                }
            }
        }
    }

    function handleDragEnd() {
        if (!browser || draggedIndex === -1) return;
        
        isDragging = false;
        if (dropIndicator) {
            dropIndicator.remove();
            dropIndicator = null;
        }

        itemElements[draggedIndex].style.opacity = "";

        console.log('Drag ended: ', itemElements[draggedIndex]);
        
        const currentInstances = JSON.parse(JSON.stringify($instances));
        const changedInstances = items.filter((item, index) => {
            const originalItem = currentInstances.find(i => i.instanceId === item.instanceId);
            return originalItem && (
                originalItem.order !== item.order ||
                originalItem.depth !== item.depth ||
                originalItem.parentInstanceId !== item.parentInstanceId
            );
        });
        
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
        
        dispatch('change', {
            affectedInstances: changedInstances.map(item => ({
                instanceId: item.instanceId,
                order: item.order,
                depth: item.depth,
                parentInstanceId: item.parentInstanceId
            })),
            movedInstance: items[draggedIndex],
            finalItems: items
        });
        
        currentDropTarget = null;
        draggedItem = null;
        draggedIndex = -1;
    }

    onDestroy(() => {
        if (dropIndicator) {
            dropIndicator.remove();
        }
    });

    $: $cmsMode, console.log('CMS MODE: ', $cmsMode);
    $: items, console.log('ITEMS CHANGED: ', items);
    $: itemElements, console.log('ITEM ELEMENTS CHANGED: ', itemElements, items);
    $: $instances, console.log('INSTANCES CHANGED: ', $instances);
</script>

<ul bind:this={listElement} class="drag-drop-list navigator-holder">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    {#each items
        .filter((i) => $cmsMode === 'component' || i.pageId === $pages.pages[$pages.selectedPageIndex].pageId)
        .sort((a, b) => a.layerOrder - b.layerOrder) 
        as item, i (item.instanceId)}
        <li
            bind:this={itemElements[i]}
            data-index={i}
            data-id={item.instanceId}
            data-depth={item.depth}
            data-order={item.order}
            data-layerOrder={item.layerOrder}
            data-expanded={items.filter((i) => i.parentInstanceId === item.instanceId).some(childId => $visibleIds.includes(childId))}
            class="drag-drop-item cms-line {$visibleIds.includes(item.instanceId) ? '' : 'hidden'} {item.componentId && $cmsMode !== 'component' ? 'component-line' : ''}"
            class:selected={item.instanceId === $selectedInstance.instanceId}
            class:dragging={i === draggedIndex}
            on:click={(e) => {changeSelection(e, item.instanceId)} }
            on:dblclick={(e) => {
                if (item.componentId?.length > 0) {
                    focusOnComponent(item.componentId);
                }
            }}
        >
            {#if item.depth !== 0}
            <div 
                class="drag-handle" 
                on:mousedown={(e) => handleDragStart(e, i)}
            >⋮⋮</div>
            {/if}
            
            <div class="item-content">
                {#each Array(item.depth !== 0 ? item.depth - 1 : item.depth) as _, i}
                    <span class="depth"></span>
                {/each}

                <button 
                    class="cms-line-dropdown" 
                    on:click={() => {toggleExpand(item.instanceId)}} 
                >
                    {#if items.some((i) => i.parentInstanceId === item.instanceId)}
                        <svg 
                            style={`transform: rotate(${items.filter((i) => i.parentInstanceId === item.instanceId).some(({instanceId}) => $visibleIds.includes(instanceId)) ? 0 : -90}deg);`} 
                            width="8" 
                            height="6" 
                            viewBox="0 0 8 6" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.2268 3.70209L7.20441 0.724487L8 1.52008L4.2268 5.29329L0.453609 1.52008L1.24919 0.724487L4.2268 3.70209Z" fill="white"/>
                        </svg>
                    {/if}
                </button>

                {@html nodeTags.find((tag) => tag.name === (item.componentId?.length > 0 && $cmsMode !== 'component' ? 'COMPONENT' : item.nodeName))?.icon}
                <p>{item.attributes.some((attr) => attr.name === 'class') ? item.attributes.find((attr) => attr.name === 'class').value.split(' ')[0].replace('-', ' ') : item.nodeName}</p>
            </div>
        </li>
    {/each}
</ul>

<style>
    .drag-drop-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        max-height: 100%;
        overflow-y: auto;
    }

    .drag-drop-item {
        display: flex;
        align-items: center;
        border-radius: 4px;
        user-select: none;
    }

    .hidden {
        display: none;
    }

    .drag-drop-item.dragging {
        cursor: grabbing;
        background: var(--item-bg-dragging, #3a3a3a);
    }

    .drag-handle {
        position: absolute;
        left: 0;
        margin-right: 0.5rem;
        color: #666;
        cursor: grab;
        padding: 0 0.5rem;
        opacity: 0;
    }

    .navigator-component-holder ul:hover .drag-handle {
        opacity: 1;
    }

    .dragging .drag-handle {
        cursor: grabbing;
    }

    .item-content {
        display: flex;
        align-items: center;
        flex: 1;
    }

    .component-line {
        background-color: rgba(27, 223, 93, .3);
    }

    .drop-target {
        background: rgba(52, 152, 219, 0.1);
    }

    :global(.cms-line > svg) {
        min-width: 1.6rem;
    }

    :global(.drop-indicator) {
        position: fixed;
        height: 2px;
        background: #3498db;
        pointer-events: none;
        z-index: 1000;
    }

    :global(.drop-indicator::before) {
        content: '';
        position: absolute;
        left: -4px;
        top: -3px;
        width: 8px;
        height: 8px;
        background: #3498db;
        border-radius: 50%;
    }

    :global(.drop-indicator.depth-1) {
        background: #3498db;
    }
</style>
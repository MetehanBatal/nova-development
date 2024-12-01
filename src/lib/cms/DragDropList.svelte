<script>
    import { selectedInstance } from '../../stores/cms/selectedInstance';
    import { visibleIds } from '../../stores/cms/visibleIds';
    import { instances } from '../../stores/cms/instances';
    import { drawInstances, changeSelection, toggleExpand} from '../../stores/cms/functions';
    import { browser } from '$app/environment';
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';

    const dispatch = createEventDispatcher();

    export let items = [];
    export let pageComponents = [];
    export let nodeTags;
    export let canDrag = () => true;

    let draggedItem = null;
    let draggedIndex = -1;
    let listElement;
    let itemElements = [];
    let dropIndicator;
    let currentDropTarget = null;
    let isDragging = false;

    function normalizeOrders(items) {
        return items.map((item, index) => ({
            ...item,
            order: index * 2
        }));
    }

    function denormalizeOrders(items) {
        return items.map(item => ({
            ...item,
            order: Math.floor(item.order / 2)
        }));
    }

    function createDropIndicator() {
        dropIndicator = document.createElement('div');
        dropIndicator.className = 'drop-indicator';
        document.body.appendChild(dropIndicator);
    }

    function updateDropIndicator(targetItem, position) {
        if (!dropIndicator || !targetItem) return;

        const rect = targetItem.getBoundingClientRect();
        const parentRect = listElement.getBoundingClientRect();
        const offset = 12; // Base indentation for depth
        const index = parseInt(targetItem.dataset.index);
        const targetItemData = items[index];
        
        let newDepth = targetItemData.depth;
        if (position === 'before' && index > 0) {
            const previousItem = items[index - 1];
            if (previousItem && $visibleIds.some(id => previousItem.nestedInstanceIds.includes(id))) {
                newDepth = previousItem.depth + 1;
            }
        }

        dropIndicator.style.left = `${parentRect.left + (offset * newDepth)}px`;
        dropIndicator.style.width = `${parentRect.width - (offset * newDepth)}px`;
        dropIndicator.style.top = `${position === 'before' ? rect.top : rect.bottom}px`;
        dropIndicator.className = `drop-indicator depth-${newDepth}`;
        
        return newDepth;
    }

    function handleDragStart(e, index) {
        if (!browser || !canDrag(items[index])) return;
        
        isDragging = true;
        draggedItem = items[index];
        draggedIndex = index;
        
        createDropIndicator();
        
        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('mouseup', handleDragEnd);
        
        itemElements[draggedIndex].style.opacity = "0.8";
        
        e.preventDefault();
    }

    function calculateNewOrder(items, targetIndex, position) {
        const prevItem = position === 'before' ? 
            (targetIndex > 0 ? items[targetIndex - 1] : null) :
            items[targetIndex];
        const nextItem = position === 'before' ? 
            items[targetIndex] :
            (targetIndex < items.length - 1 ? items[targetIndex + 1] : null);

        if (!prevItem && !nextItem) return 0;
        if (!prevItem) return nextItem.order - 1;
        if (!nextItem) return prevItem.order + 1;

        return prevItem.order + Math.floor((nextItem.order - prevItem.order) / 2);
    }

    function getAllChildrenIds(instanceId) {
        const instance = items.find(item => item.instanceId === instanceId);
        if (!instance || !instance.nestedInstanceIds.length) return [];
        
        let allChildren = [...instance.nestedInstanceIds];
        instance.nestedInstanceIds.forEach(childId => {
            allChildren = [...allChildren, ...getAllChildrenIds(childId)];
        });
        
        return allChildren;
    }

    function getAllDescendantsWithOrder(item, items) {
        const descendants = [];
        
        function processItem(currentItem) {
            const children = items
                .filter(i => i.parentInstanceId === currentItem.instanceId)
                .sort((a, b) => a.order - b.order);
                
            children.forEach(child => {
                descendants.push(child);
                processItem(child);
            });
        }
        
        processItem(item);
        return descendants;
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

        // Get dragged item and its children
        const draggedItem = items[draggedIndex];
        if (!draggedItem) {
            console.error('Dragged item not found:', draggedIndex);
            return;
        }

        const draggedChildrenIds = getAllChildrenIds(draggedItem.instanceId);

        // Get visible items (excluding dragged item and its children)
        const visibleIndices = items.reduce((acc, item, index) => {
            if ($visibleIds.includes(item.instanceId) && 
                item.instanceId !== draggedItem.instanceId && 
                !draggedChildrenIds.includes(item.instanceId) &&
                itemElements[index]) {
                acc.push(index);
            }
            return acc;
        }, []);

        if (visibleIndices.length === 0) {
            console.log('No valid visible indices found');
            return;
        }

        // Find closest drop target
        let closestIndex = -1;
        let minDistance = Infinity;
        let position = 'before';

        for (const index of visibleIndices) {
            const element = itemElements[index];
            if (!element) {
                console.warn('Element reference missing for index:', index);
                continue;
            }

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

        if (closestIndex === -1) {
            console.log('No valid target found');
            return;
        }

        // Only proceed if target has changed
        if (currentDropTarget?.index !== closestIndex || currentDropTarget?.position !== position) {
            const targetItem = items[closestIndex];
            if (!targetItem) return;

            const newItems = [...items];

            // Check if we're moving within the same parent
            const isSameParentMove = draggedItem.parentInstanceId === targetItem.parentInstanceId;
            const currentParent = newItems.find(item => item.instanceId === draggedItem.parentInstanceId);

            // Get all items that need to move (parent and its children)
            const draggedItemWithChildren = [draggedItem];
            const processChildren = (parentId) => {
                const children = newItems.filter(item => item.parentInstanceId === parentId)
                    .sort((a, b) => a.order - b.order);
                children.forEach(child => {
                    draggedItemWithChildren.push(child);
                    if (child.nestedInstanceIds.length > 0) {
                        processChildren(child.instanceId);
                    }
                });
            };
            processChildren(draggedItem.instanceId);

            if (isSameParentMove && currentParent) {
                // Get final ordered list of siblings after reordering
                const finalOrderedChildren = currentParent.nestedInstanceIds
                    .map(id => newItems.find(item => item.instanceId === id))
                    .filter(Boolean);
                
                // Update all sibling relationships
                finalOrderedChildren.forEach((item, index) => {
                    if (index === 0) {
                        // First child should have null prevInstanceId
                        item.prevInstanceId = null;
                    } else {
                        item.prevInstanceId = finalOrderedChildren[index - 1].instanceId;
                    }

                    if (index === finalOrderedChildren.length - 1) {
                        // Last child should have null nextInstanceId
                        item.nextInstanceId = null;
                    } else {
                        item.nextInstanceId = finalOrderedChildren[index + 1].instanceId;
                    }
                });
            } else {
                // Handle move to different parent
                const oldParent = newItems.find(item => item.instanceId === draggedItem.parentInstanceId);
                const targetParent = position === 'after' && targetItem.nestedInstanceIds.length > 0 && 
                    $visibleIds.some(id => targetItem.nestedInstanceIds.includes(id))
                    ? targetItem 
                    : newItems.find(item => item.instanceId === targetItem.parentInstanceId);

                // Clean up old location
                if (oldParent) {
                    // Remove from old parent's nestedInstanceIds
                    oldParent.nestedInstanceIds = oldParent.nestedInstanceIds
                        .filter(id => id !== draggedItem.instanceId);

                    // Update old siblings
                    const oldSiblings = oldParent.nestedInstanceIds
                        .map(id => newItems.find(item => item.instanceId === id))
                        .filter(Boolean);

                    // Update remaining siblings' relationships
                    oldSiblings.forEach((item, index) => {
                        if (index === 0) {
                            item.prevInstanceId = null;
                        } else {
                            item.prevInstanceId = oldSiblings[index - 1].instanceId;
                        }

                        if (index === oldSiblings.length - 1) {
                            item.nextInstanceId = null;
                        } else {
                            item.nextInstanceId = oldSiblings[index + 1].instanceId;
                        }
                    });
                }

                // Set up new location
                if (targetParent) {
                    // Calculate new depth for the dragged item
                    const newParentDepth = targetParent.depth;
                    const depthDiff = (newParentDepth + 1) - draggedItem.depth;
                    
                    // Update depths
                    draggedItem.depth = newParentDepth + 1;
                    const allDescendants = getAllDescendantsWithOrder(draggedItem, newItems);
                    allDescendants.forEach(descendant => {
                        descendant.depth += depthDiff;
                    });

                    // Insert into new parent's nestedInstanceIds
                    const targetIndex = targetParent.nestedInstanceIds.indexOf(targetItem.instanceId);
                    const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
                    targetParent.nestedInstanceIds.splice(insertIndex, 0, draggedItem.instanceId);

                    // Update prev/next references for surrounding parents
                    if (position === 'before') {
                        const prevSibling = newItems.find(item => item.nextInstanceId === targetItem.instanceId);
                        
                        if (prevSibling) {
                            prevSibling.nextInstanceId = draggedItem.instanceId;
                            draggedItem.prevInstanceId = prevSibling.instanceId;
                        } else {
                            draggedItem.prevInstanceId = null;
                        }
                        
                        draggedItem.nextInstanceId = targetItem.instanceId;
                        targetItem.prevInstanceId = draggedItem.instanceId;
                    } else {
                        draggedItem.prevInstanceId = targetItem.instanceId;
                        draggedItem.nextInstanceId = targetItem.nextInstanceId;
                        
                        targetItem.nextInstanceId = draggedItem.instanceId;
                        
                        const nextSibling = newItems.find(item => item.instanceId === targetItem.nextInstanceId);
                        if (nextSibling) {
                            nextSibling.prevInstanceId = draggedItem.instanceId;
                        }
                    }

                    // Collect and sort all affected items for order recalculation
                    let itemsToReorder = [];
                    let currentOrder = 0;

                    // First, get all items above the insertion point (including hidden ones)
                    targetParent.nestedInstanceIds.slice(0, insertIndex).forEach(id => {
                        const item = newItems.find(i => i.instanceId === id);
                        if (item) {
                            itemsToReorder.push(item);
                            const descendants = getAllDescendantsWithOrder(item, newItems);
                            itemsToReorder.push(...descendants);
                        }
                    });

                    // Record the last order before moved items
                    currentOrder = itemsToReorder.length > 0 ? 
                        Math.max(...itemsToReorder.map(i => i.order)) : 
                        targetParent.order;

                    // Add moved item and its descendants
                    itemsToReorder.push(draggedItem);
                    itemsToReorder.push(...allDescendants);

                    // Add remaining items after the insertion point
                    targetParent.nestedInstanceIds.slice(insertIndex).forEach(id => {
                        const item = newItems.find(i => i.instanceId === id);
                        if (item && item.instanceId !== draggedItem.instanceId) {
                            itemsToReorder.push(item);
                            const descendants = getAllDescendantsWithOrder(item, newItems);
                            itemsToReorder.push(...descendants);
                        }
                    });

                    // Assign new orders
                    let orderCounter = currentOrder;
                    itemsToReorder.forEach(item => {
                        orderCounter += 2;
                        item.order = orderCounter;
                    });

                    // Update dragged item's parent relationship
                    draggedItem.parentInstanceId = targetParent.instanceId;
                }
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
            items = normalizeOrders(newItems);
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

    // Helper function to compare original and updated instances
    function getChangedProperties(originalInstance, updatedInstance) {
        const changes = {};
        const trackableProps = ['order', 'depth', 'parentInstanceId', 'prevInstanceId', 'nextInstanceId', 'nestedInstanceIds'];
        
        trackableProps.forEach(prop => {
            // For arrays (like nestedInstanceIds), check if content is different
            if (Array.isArray(originalInstance[prop])) {
                if (JSON.stringify(originalInstance[prop]) !== JSON.stringify(updatedInstance[prop])) {
                    changes[prop] = updatedInstance[prop];
                }
            } 
            // For regular properties, direct comparison
            else if (originalInstance[prop] !== updatedInstance[prop]) {
                changes[prop] = updatedInstance[prop];
            }
        });

        return Object.keys(changes).length > 0 ? changes : null;
    }

    function getAffectedInstances(originalItems, updatedItems) {
        const changedInstances = [];
        
        updatedItems.forEach(updatedItem => {
            const originalItem = originalItems.find(item => item.instanceId === updatedItem.instanceId);
            if (originalItem) {
                const changes = getChangedProperties(originalItem, updatedItem);
                if (changes) {
                    changedInstances.push({
                        instanceId: updatedItem.instanceId,
                        ...changes
                    });
                }
            }
        });

        return changedInstances;
    }

    function handleDragEnd() {
        if (!browser || draggedIndex === -1) return;
        
        isDragging = false;
        if (dropIndicator) {
            dropIndicator.remove();
            dropIndicator = null;
        }

        itemElements[draggedIndex].style.opacity = "";
        
        // Denormalize orders for the final items
        const finalItems = denormalizeOrders(items);
        const currentInstances = JSON.parse(JSON.stringify($instances));

        // Get affected instances after denormalizing orders
        const affectedInstances = getAffectedInstances([...currentInstances], [...finalItems]);
        
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
        
        dispatch('change', {
            affectedInstances,
            movedInstance: finalItems[draggedIndex],
            finalItems
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
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<ul bind:this={listElement} class="drag-drop-list navigator-holder">
    {#each items.sort((a, b) => a.order - b.order) as item, i (item.instanceId)}
        <li
            bind:this={itemElements[i]}
            data-index={i}
            data-depth={item.depth}
            data-expanded={items.filter((i) => i.parentInstanceId === item.instanceId).some(childId => $visibleIds.includes(childId))}
            class="drag-drop-item cms-line {$visibleIds.includes(item.instanceId) ? '' : 'hidden'} {item.componentId ? 'component-line' : ''}"
            class:selected={item.instanceId === $selectedInstance.instanceId}
            class:dragging={i === draggedIndex}
            on:click={(e) => {changeSelection(e, item.instanceId)} }
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

                {#if item.componentId?.length > 0}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.47885 1.69144C8.18037 1.52863 7.81963 1.52863 7.52115 1.69144L2.52115 4.41871C2.19989 4.59395 2 4.93066 2 5.29661V10.703C2 11.0689 2.19989 11.4056 2.52115 11.5809L7.52115 14.3081C7.81963 14.471 8.18037 14.471 8.47885 14.3081L8.5 14.2966V13.1575V11.5V8.29661L13 5.84206V8H14V5.29661C14 4.93066 13.8001 4.59395 13.4789 4.41871L8.47885 1.69144ZM3.54416 4.99979L8 2.56934L12.4558 4.99979L8 7.43025L3.54416 4.99979ZM3 5.84206L3 10.703L7.5 13.1575V8.29661L3 5.84206ZM13 9V11H15V12H13V14H12V12H10V11H12V9H13Z" fill="currentColor"/>
                    </svg>
                    <p>{pageComponents.find((comp) => comp.componentId === item.componentId)?.name}</p>
                {:else}
                    {@html nodeTags.find((tag) => tag.name === item.nodeName)?.icon}
                    <!-- <p>{item.instanceId}</p> -->
                    <p>{item.attributes.some((attr) => attr.name === 'class') ? item.attributes.find((attr) => attr.name === 'class').value.split(' ')[0].replace('-', ' ') : item.nodeName}</p>
                {/if}
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
        /* gap: 0.5rem; */
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
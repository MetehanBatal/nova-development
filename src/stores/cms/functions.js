import { page } from '$app/stores';
import { selectedInstance } from './selectedInstance';
import { selectedBreakpoint } from './selectedBreakpoint';
import { cmsMode } from './cmsMode';
import { visibleIds } from './visibleIds';
import { instances } from './instances';
import { styleSheet } from './styleSheet';  // Import styleSheet as a store
import { dev } from '$app/environment';

let selectedInstanceId = '';
let selectedInstanceClass = '';
let breakpoint = '';
let instanceMap;
let dVisibleIds;
let dCMSMode;
let order = 0;
let pageData;
let baseFrameURL = dev ? 'http://localhost:5174' : 'https://preview-preconvert.vercel.app';

cmsMode.subscribe((value) => {
    dCMSMode = value;
});

selectedBreakpoint.subscribe((value) => {
    breakpoint = value;
});

visibleIds.subscribe((value) => {
    dVisibleIds = value;
});

// Subscribing to selectedInstance to get its values
selectedInstance.subscribe((value) => {
    selectedInstanceId = value.instanceId;
    selectedInstanceClass = value.class;
});

// Subscribe to instances and keep a copy in memory for lookups
let currentInstances = [];
instances.subscribe((value) => {
    currentInstances = value;
});

// Subscribe to styleSheet and keep a copy in memory for lookups
let currentStyleSheet = [];
styleSheet.subscribe((value) => {
    currentStyleSheet = value;
});

const dbActions = async function (data, endpoint, action) {
    try {
        const response = await fetch(`http://localhost:3030/staging/${endpoint}/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to upsert instances');
        }

        const result = await response.json();

        return result;  // Return the parsed response

    } catch (error) {
        console.error('Error during upsert:', error);
        
        return { error };
    }
}

const generateRandomString = () => {
    function generateRandomSegment(length) {
        let result = '';
        const characters = 'abcdefgh0123456789';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
      }

    const segment1 = generateRandomSegment(8);
    const segment2 = generateRandomSegment(4);
    const segment3 = generateRandomSegment(4);
    const segment4 = generateRandomSegment(12);

    return `${segment1}-${segment2}-${segment3}-${segment4}`;
};

const generateRandomNumber = (digits) => {
    if (digits <= 0) return 0; // Invalid input, return 0

    const min = Math.pow(10, digits - 1); // Smallest number with the given digits
    const max = Math.pow(10, digits) - 1; // Largest number with the given digits

    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const handleElementAppend = async function (event, overwrites) {
    let currentInstances = [];
    
    // Subscribe to instances store to get the current value
    instances.subscribe(value => {
        currentInstances = value;
    })();

    const subsequentElement = event.detail.subsequentElement;
    let subsequentElementId = [];
    if (subsequentElement) {
        subsequentElementId.push(generateRandomString());
    }

    let newInstanceId = generateRandomString();
    let id = overwrites?.parentId ? overwrites.parentId : selectedInstanceId;

    // Find the current instance
    let currentInstance = currentInstances.find((i) => i.instanceId === id);
    let prevInstanceId = overwrites?.parentId ? '' : currentInstance.nestedInstanceIds.length > 0 
        ? currentInstance.nestedInstanceIds[currentInstance.nestedInstanceIds.length - 1] 
        : '';

    let schema = {
        instanceId: overwrites?.instanceId || newInstanceId,
        pageId: currentInstance.pageId,
        componentId: currentInstance.componentId,
        nodeName: event.detail.nodeName,
        prevInstanceId: prevInstanceId,
        nextInstanceId: '',
        parentInstanceId: overwrites?.parentId || currentInstance.instanceId,
        nestedInstanceIds: subsequentElementId || [],
        attributes: event.detail.attributes || [],
        content: event.detail.content || ''
    };

    let sibling = currentInstances.find((i) => i.instanceId === prevInstanceId);
    if (!overwrites) {
        currentInstance.nestedInstanceIds.push(newInstanceId);
    }
    if (sibling && prevInstanceId.length > 0) {
        sibling.nextInstanceId = newInstanceId;
    }

    // Add the new instance to the current instances array
    currentInstances.push(schema);

    // Update the instances store with the new data
    instances.set([...currentInstances]);

    let instancesToUpdate = [sibling, currentInstance, schema].filter(instance => instance !== undefined);

    let newVisibleIds = drawInstances();
    visibleIds.set(newVisibleIds);
    computeOrders();

    // Notify via postMessage
    postMessage('elementAppended', { instances: currentInstances });

    // Upsert instances in the database
    let updatedInstances = await dbActions(instancesToUpdate, 'instances', 'upsert');

    // If there is a subsequent element, recursively append it
    if (subsequentElement) {
        handleElementAppend(
            { detail: { nodeName: subsequentElement.nodeName, content: subsequentElement.content } },
            { instanceId: subsequentElementId[0], parentId: newInstanceId }
        );
    }
};

// Recursive function to collect all instances to delete
const getInstancesToDelete = (instanceId) => {
    let instance = currentInstances.find(i => i.instanceId === instanceId);
    if (!instance) return [];

    // Get all nested instances recursively
    let nestedInstances = instance.nestedInstanceIds.flatMap(id => getInstancesToDelete(id));

    return [instance, ...nestedInstances];
}

// Function to handle keydown events for deletion
const handleKeyDown = async function (event) {
    const activeElement = document.activeElement;
    const isInputField = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable;

    if (isInputField) {
        return; // Do not delete components if typing in an input or editable field
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedInstanceId.length < 1) return;

        // Get all instances to delete, including nested instances
        let instancesToDelete = getInstancesToDelete(selectedInstanceId);

        if (instancesToDelete.length === 0) return;

        // Remove instances from the main instances array
        currentInstances = currentInstances.filter(i => !instancesToDelete.some(delInstance => delInstance.instanceId === i.instanceId));

        // Update parent and sibling relationships if necessary
        let parentInstance = currentInstances.find(i => i.instanceId === instancesToDelete[0].parentInstanceId);
        if (parentInstance) {
            parentInstance.nestedInstanceIds = parentInstance.nestedInstanceIds.filter(id => id !== selectedInstanceId);
        }

        let prevInstance = currentInstances.find(i => i.instanceId === instancesToDelete[0].prevInstanceId);
        let nextInstance = currentInstances.find(i => i.instanceId === instancesToDelete[0].nextInstanceId);
        if (prevInstance) prevInstance.nextInstanceId = instancesToDelete[0].nextInstanceId;
        if (nextInstance) nextInstance.prevInstanceId = instancesToDelete[0].prevInstanceId;

        let instancesToUpdate = [parentInstance, prevInstance, nextInstance].filter(instance => instance !== undefined);

        // Update the selectedInstance store (clearing its values)
        selectedInstance.update(value => {
            return {
                instanceId: '',
                componentId: '',
                pageId: '',
                nodeName: '',
                breakpoint: 'desktop',
                class: '',
                styling: {},
                attributes: {},
                content: ''
            };
        });

        // Update the writable store with the new instances array
        instances.set([...currentInstances]);

        // Update the database for the deletion and sibling updates
        await dbActions(instancesToUpdate, 'instances', 'upsert');
        await dbActions(instancesToDelete, 'instances', 'delete');

        // Notify the canvas
        postMessage('elementDeleted', { instances: currentInstances });
    }
};


const compareInstances = () => {
    if (selectedInstanceId.length < 1) {
        return; }
    
    let currentInstance = instances.find((i) => i.instanceId === selectedInstanceId);
    const currentStylingString = JSON.stringify(selectedInstanceStyling);

    const exclusions = ['class', 'styling'];

    const differences = {};

    // Compare each key in $selectedInstance against currentInstance
    Object.keys($selectedInstance).forEach(key => {
        if (!exclusions.includes(key)) {
            if (JSON.stringify($selectedInstance[key]) !== JSON.stringify(currentInstance[key])) {
                differences[key] = {
                    oldValue: $selectedInstance[key],
                    newValue: currentInstance[key]
                };
            }
        }
    });

    // Log the differences
    if (Object.keys(differences).length) {
        console.log('Differences:', differences);
    } else {
        console.log('No differences found');
    }

    if (Object.keys(differences).includes('content')) {
        alterContent(currentInstance)
    }

    if (currentStylingString !== stylingHolder) {
        stylingHolder = currentStylingString;

        postMessage('stylingChanged', { styleSheet });

        alterStyling()
    }
    
    return differences;
}

// Function to alter styling
const alterStyling = () => {
    let styleToUpdate = currentStyleSheet.find((style) => style.name === selectedInstanceClass);
    if (styleToUpdate) {
        styleToUpdate.attributes = selectedInstanceStyling;
    } else {
        currentStyleSheet.push({
            "type": "class", // id
            "name": selectedInstanceClass,
            "breakpoint": breakpoint,
            "combo": [],
            "attributes": {}
        });
    }

    // Update the styleSheet store with the modified styles
    styleSheet.set([...currentStyleSheet]);

    let styleToUpload = currentStyleSheet.find((ss) => ss.name === selectedInstanceClass);
    // Optionally, perform further actions with styleToUpload
};

// Function to inject class
async function injectClass(data, classList, from) {
    if (!data || data === 'undefined') {
        return; }
    // Add class name to instance within the store
    let selectedInstanceToUpdate = currentInstances.find((i) => i.instanceId === selectedInstanceId);

    if (selectedInstanceToUpdate) {
        let hasClassAttr = selectedInstanceToUpdate.attributes.find((attr) => attr.name === 'class');
        if (hasClassAttr && hasClassAttr.value.includes(data)) {
            console.warn('Same class found.');
            return; }
        if (!hasClassAttr) {
            selectedInstanceToUpdate.attributes.push({ name: 'class', value: data });
        } else {
            selectedInstanceToUpdate.attributes.find((attr) => attr.name === 'class').value += ` ${data}`;
        }

        // Update the instances store after modifying the instance attributes
        instances.set([...currentInstances]);
        selectedInstanceClass = classList.length > 1 ? classList : data;

        const cssSchema = {
            "name": classList.length > 1 ? classList : data,
            breakpoint: breakpoint,
            "attributes": {},
            "combos": [],
            "type": "class"
        };

        // Initialize empty CSS data in styleSheet store
        currentStyleSheet.push(cssSchema);

        // Update the styleSheet store with the new class
        styleSheet.set([...currentStyleSheet]);

        // Update instance in DB
        await dbActions(selectedInstanceToUpdate, 'instances', 'upsert');
        
        // Notify iframe about the change
        postMessage('classChanged', { target: selectedInstanceId, className: data });

        // Update the stylesheet in DB
        await dbActions(cssSchema, 'style', 'upsert');
    }
}

// Function to remove class
async function removeClass(classToRemove) {
    // Find the instance in the current instances
    let selectedInstanceToUpdate = currentInstances.find((i) => i.instanceId === selectedInstanceId);

    if (selectedInstanceToUpdate) {
        // Find the class attribute
        let classAttr = selectedInstanceToUpdate.attributes.find((attr) => attr.name === 'class');
        
        if (classAttr) {
            // Split classes into array, remove the specified class, and rejoin
            let classes = classAttr.value.split(' ');
            classes = classes.filter(c => c !== classToRemove);
            
            if (classes.length === 0) {
                // If no classes left, remove the class attribute entirely
                selectedInstanceToUpdate.attributes = selectedInstanceToUpdate.attributes.filter(
                    attr => attr.name !== 'class'
                );
            } else {
                // Update the class attribute with remaining classes
                classAttr.value = classes.join(' ');
            }

            // Update the instances store
            instances.set([...currentInstances]);

            // Remove the class from styleSheet if it exists
            styleSheet.update(sheet => {
                return sheet.filter(style => style.name !== classToRemove);
            });

            // Update instance in DB
            await dbActions(selectedInstanceToUpdate, 'instances', 'upsert');

            // Notify iframe about the change
            postMessage('classChanged', { target: selectedInstanceId, className: classToRemove });
        }
    }
}

// Function to alter a styling property
const alterStylingProperty = async function (prop, value, from) {
    if (prop.length < 1 || value.length < 1) {
        return; }

    // If the element is brand new and doesn't have a class
    if (selectedInstanceClass?.length < 1) {
        // Generate a class name from the tag name and some random numbers
        let selectedInstanceToUpdate = currentInstances.find((i) => i.instanceId === selectedInstanceId);
        if (selectedInstanceToUpdate) {
            selectedInstanceClass = `${selectedInstanceToUpdate.nodeName.toLowerCase()}-${generateRandomNumber(6)}`;
            await injectClass(selectedInstanceClass, [], 'first alter'); // Ensure that the class is injected
        }
    }

    // Find matching CSS object within styleSheet and update its styling property
    let styleToUpdate = currentStyleSheet.find((ss) => ss.name === selectedInstanceClass && ss.breakpoint === breakpoint);
    if (styleToUpdate) {
        styleToUpdate.attributes[prop] = value;

        // Update the styleSheet store with the modified styles
        styleSheet.set([...currentStyleSheet]);

        postMessage('stylingChanged', { styleSheet: currentStyleSheet });

        // Update the stylesheet in DB
        await dbActions(styleToUpdate, 'style', 'upsert');
    } else {
        await injectClass(selectedInstanceClass, [], 'second alter');

        let diffBreakpoint = currentStyleSheet.find((ss) => ss.name === selectedInstanceClass && ss.breakpoint === breakpoint);
        if (diffBreakpoint) {
            diffBreakpoint.attributes[prop] = value;

            // Update the styleSheet store with the modified styles
            styleSheet.set([...currentStyleSheet]);

            postMessage('stylingChanged', { styleSheet: currentStyleSheet });

            // Update the stylesheet in DB
            await dbActions(diffBreakpoint, 'style', 'upsert');
        }
    }

    
};

const alterContent = async function (value) {
    // Find the instance to update
    let instanceToUpdate = currentInstances.find(i => i.instanceId === selectedInstanceId);
    if (instanceToUpdate) {
        // Update the content of the instance
        instanceToUpdate.content = value;

        // Update the instances store
        instances.set([...currentInstances]);

        // Notify the iframe or canvas about the content change
        postMessage('contentChanged', instanceToUpdate);

        // Update the instance in the database
        await dbActions(instanceToUpdate, 'instances', 'upsert');
    }
}

const postMessage = (action, data) => {
    document.querySelector('iframe[title="Main frame"]').contentWindow.postMessage({ action, data }, baseFrameURL);
}

// Draw Instances function
const drawInstances = () => {
    // Subscribe to get the current value of instances
    let currentInstances;
    instances.subscribe(value => {
        currentInstances = value;
    })();

    // Step 1: Create a map for quick lookup
    instanceMap = new Map();
    currentInstances.forEach(instance => {
        instanceMap.set(instance.instanceId, instance);
    });

    console.log('C: ', currentInstances);

    // Step 3: Compute depth for each instance and add it as a property
    const updatedInstances = currentInstances.map(instance => {
        const { instanceId, ...rest } = instance;

        return {
            ...rest,
            instanceId,
            id: instanceId,
            depth: computeDepth(instance)
        }
    });

    console.log('U: ', updatedInstances);

    // Step 4: Initialize visibleIds with root elements (depth === 1)
    dVisibleIds = updatedInstances
        .filter(instance => instance.depth === 1)
        .map(instance => instance.instanceId)
    
    console.log(dVisibleIds);

    // Update the store with the new instances array
    instances.set(updatedInstances);

    return dVisibleIds;
}


// Step 2: Function to compute depth (starting at 1 for root elements)
const computeDepth = (instance) => {
    let depth = 1; // Root elements start at depth 1
    let current = instance;
    while (current.parentInstanceId && instanceMap.has(current.parentInstanceId)) {
        depth += 1;
        current = instanceMap.get(current.parentInstanceId);
    }
    return depth;
}

const computeOrders = () => {
    let order = 0;

    // Get the current value of the `instances` store
    let currentInstances;
    instances.subscribe(value => {
        currentInstances = value;
    })();

    // Filter top-level instances
    let topLevelInstances = dCMSMode !== 'component' ?
                                    currentInstances.filter((i) => i.parentInstanceId === 'BODY') :
                                    currentInstances.filter(instance => !currentInstances.some(potential => potential.instanceId === instance.parentInstanceId));
    
    // Assign order to top-level instances and their children
    topLevelInstances.forEach((tInstance) => {
        assignOrder(tInstance, currentInstances);  // Make sure `assignOrder` works with currentInstances
    });

    console.log('Current Instances: ', currentInstances);

    // Sort instances by their `order` property
    const sortedInstances = currentInstances.sort((a, b) => a.order - b.order);

    // Update the store with the sorted instances
    instances.set(sortedInstances);

    console.log('Current Instances: ', sortedInstances);
};

const assignOrder = (instance, currentInstances) => {
    order += 1;
    instance.order = order;

    // If the instance has nestedInstanceIds, recursively assign order to each child instance
    if (instance.nestedInstanceIds && instance.nestedInstanceIds.length > 0) {
        instance.nestedInstanceIds.forEach((nId) => {
            let childInstance = '';
            console.log(nId, nId.startsWith('c-'));
            if (nId.startsWith('c-')) {
                childInstance = currentInstances.filter((inst) => inst.componentId === nId && inst.parentInstanceId === instance.instanceId)[0];
            } else {
                childInstance = currentInstances.find((inst) => inst.instanceId === nId);
            }

            console.log('Child Instance: ', childInstance);
            
            if (childInstance) {
                assignOrder(childInstance, currentInstances); // Recursively assign order to child
            }
        });
    }
};

// Step 5: Function to get all descendant IDs of a given ID
function getDescendantIds(id) {
    let descendants = [];
    const instance = instanceMap.get(id);
    if (instance && Array.isArray(instance.nestedInstanceIds)) {
        instance.nestedInstanceIds.forEach(childId => {
            descendants.push(childId);
            descendants = descendants.concat(getDescendantIds(childId));
        });
    }

    return descendants;
}

// Step 6: Function to toggle expansion
function toggleExpand(id) {
    const instance = instanceMap.get(id);
    if (!instance) return;

    // Determine if the element is currently expanded by checking if any children are visible
    const isExpanded = instance.nestedInstanceIds.some(childId => dVisibleIds.includes(childId));

    console.log('exp: ', isExpanded);

    if (isExpanded) {
        // Collapse: Remove all descendants
        const descendants = getDescendantIds(id);
        dVisibleIds = dVisibleIds.filter(vid => !descendants.includes(vid));
    } else {
        // Expand: Add direct children
        if (instance.nestedInstanceIds && instance.nestedInstanceIds.length > 0) {
            console.log(instance.nestedInstanceIds);
            dVisibleIds = [...dVisibleIds, ...instance.nestedInstanceIds];
        }
    }

    return dVisibleIds;
}

function changeSelection(event, instanceId) {
    if (event?.target?.closest('.dropdown-button') || event?.target?.closest('.cms-line-dropdown')) {
        return; }

    page.subscribe((value) => pageData = value);
    let instance = currentInstances.find((ins) => ins.instanceId === instanceId);

    let styleSheet = pageData.data.stylesRes.data.docs || [];
        selectedInstanceClass = instance.attributes.find((attr) => attr.name === 'class')?.value || '';
    
    // $blockerInProgress = true;
    selectedInstance.set({
        instanceId: instance.instanceId,
        nodeName: instance.nodeName,
        attributes: instance.attributes,
        componentId: instance.componentId,
        pageId: instance.pageId,
        breakpoint: breakpoint,
        class: selectedInstanceClass,
        styling: styleSheet.find((attr) => attr.name === selectedInstanceClass)?.attributes || {},
        content: instance.content
    });

    postMessage('selectionChanged', { instanceId: instance.instanceId })
    // dispatch('selectionChanged');
}

const alterTagName = async function(instanceId, value) {
    let currentInstance = currentInstances.find((i) => i.instanceId === instanceId);
        currentInstance.nodeName = value;

    instances.set([...currentInstances]);

    // Notify via postMessage
    postMessage('elementAppended', { instances: currentInstances });

    // Upsert instances in the database
    let updatedInstance = await dbActions(currentInstance, 'instances', 'upsert');
}

const alterAttribute = async function(attr, value) {
    if (!value) {
        return; }

    let currentInstance = currentInstances.find((i) => i.instanceId === selectedInstanceId);

    // Find the index of the attribute with the given name
    const index = currentInstance.attributes.findIndex(a => a.name === attr);
    if (index !== -1) {
        // Attribute exists, update its value
        currentInstance.attributes[index].value = value;
    } else {
        // Attribute doesn't exist, add a new one
        currentInstance.attributes.push({
            name: attr,
            value: value
        });
    }

    instances.set([...currentInstances]);

    // Notify via postMessage
    postMessage('elementAppended', { instances: currentInstances });

    // Upsert instances in the database
    let updatedInstance = await dbActions(currentInstance, 'instances', 'upsert');
}

export {
    handleElementAppend,
    getInstancesToDelete,
    compareInstances,
    handleKeyDown,
    postMessage,
    drawInstances,
    computeOrders,
    toggleExpand,
    changeSelection,
    alterStylingProperty,
    alterTagName,
    alterAttribute,
    alterContent,
    dbActions,
    injectClass,
    removeClass,
    generateRandomString
}
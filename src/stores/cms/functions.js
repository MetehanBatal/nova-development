import { page } from '$app/stores';
import { selectedInstance } from './selectedInstance';
import { selectedBreakpoint } from './selectedBreakpoint';
import { selectedCMSTabIndex } from './selectedCMSTabIndex';
import { cmsMode } from './cmsMode';
import { visibleIds } from './visibleIds';
import { instances } from './instances';
import { components } from './components';
import { variants } from './variants';
import { styleSheet } from './styleSheet';  // Import styleSheet as a store
import { dev } from '$app/environment';

let selectedInstanceId = '';
let layerInitReady = false;
let selectedComponent = {};
let selectedInstanceClass = '';
let breakpoint = '';
let instanceMap;
let dVisibleIds;
let dCMSMode;
let dVariants;
let order = 0;
let pageData;
let baseFrameURL = dev ? 'http://localhost:5174' : 'https://miracle-rebuild.vercel.app';

cmsMode.subscribe((value) => {
    dCMSMode = value;
});

selectedBreakpoint.subscribe((value) => {
    breakpoint = value;
});

visibleIds.subscribe((value) => {
    dVisibleIds = value;
});

variants.subscribe((value) => {
    dVariants = value;
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

const breakpointCascades = {
    mobile: ['mobile', 'tablet', 'desktop'],
    tablet: ['tablet', 'desktop'],
    desktop: ['desktop'],
    xl: ['xl', 'desktop'],
    xxl: ['xxl', 'xl', 'desktop']
};

const dbActions = async function (data, endpoint, action) {
    try {
        const response = await fetch(`https://preconvert.novus.studio/staging/${endpoint}/${action}`, {
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

const getStyleValueFromCascade = (styling, property, currentBreakpoint) => {
    if (!styling || !breakpointCascades[currentBreakpoint]) return null;

    // Check each breakpoint in the cascade order
    for (const breakpoint of breakpointCascades[currentBreakpoint]) {
        if (styling[breakpoint] && styling[breakpoint][property] !== undefined) {
            return styling[breakpoint][property];
        }
    }
    return null;
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
    
    let siblings = currentInstances.filter((i) => i.parentInstanceId === currentInstance.instanceId).sort((a,b) => a.order - b.order);
    console.log(siblings, currentInstance);
    let lastSiblingOrder = siblings.length > 0 ? siblings[siblings.length - 1].order : 0;

    let schema = {
        instanceId: overwrites?.instanceId || newInstanceId,
        pageId: currentInstance.pageId,
        componentId: currentInstance.componentId,
        nodeName: event.detail.nodeName,
        parentInstanceId: overwrites?.parentId || currentInstance.instanceId,
        attributes: event.detail.attributes || [],
        content: event.detail.content || '',
        order: siblings.length > 0 ? lastSiblingOrder + 1 : 0,
        depth: currentInstance.depth + 1
    };

    // Find and update instances with order >= schema.order
    // const instancesToReorder = currentInstances.filter(
    //     instance => instance.order >= schema.order && instance.instanceId !== schema.instanceId
    // );
    
    // instancesToReorder.forEach(instance => {
    //     instance.order += 1;
    // });

    // Add the new instance to the current instances array
    currentInstances.push(schema);

    // Update the instances store with the new data
    instances.set([...currentInstances]);

    // Prepare instances for backend update with only necessary properties
    const backendUpdates = [];

    // Add schema with all fields
    backendUpdates.push(schema);

    // Add reordered instances with only instanceId and order
    // instancesToReorder.forEach(instance => {
    //     backendUpdates.push({
    //         instanceId: instance.instanceId,
    //         order: instance.order
    //     });
    // });

    // let newVisibleIds = drawInstances();
    // visibleIds.set(newVisibleIds);

    // Notify via postMessage
    postMessage('elementAppended', { instance: schema });

    // Upsert instances in the database with minimal data
    let updatedInstances = await dbActions(backendUpdates, 'instances', 'upsert');

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
    let nestedInstances = currentInstances.filter((i) => i.parentInstanceId === instance.instanceId).map(({instanceId}) => instanceId).flatMap(id => getInstancesToDelete(id));

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

        const initialId = selectedInstanceId;

        // Get all instances to delete, including nested instances
        let instancesToDelete = getInstancesToDelete(selectedInstanceId);

        if (instancesToDelete.length === 0) return;

        // Get the order of the first instance to be deleted
        const deletedInstanceOrder = instancesToDelete[0].order;

        // Find instances that need order updates (those with higher order than the deleted instance)
        const instancesToReorder = currentInstances.filter(instance => 
            instance.order > deletedInstanceOrder && 
            instance.parentInstanceId === deletedInstanceOrder.parentInstanceId && 
            !instancesToDelete.some(delInstance => delInstance.instanceId === instance.instanceId)
        );

        // Decrease order by the number of instances being deleted at their level
        instancesToReorder.forEach(instance => {
            instance.order -= 1;
        });

        // Remove instances from the main instances array
        currentInstances = currentInstances.filter(i => 
            !instancesToDelete.some(delInstance => delInstance.instanceId === i.instanceId)
        );
        
        // Prepare minimal data for backend updates
        const backendUpdates = [];
        // Add reordered instances with only instanceId and order
        instancesToReorder.forEach(instance => {
            backendUpdates.push({
                instanceId: instance.instanceId,
                order: instance.order
            });
        });

        // Update the selectedInstance store (clearing its values)
        selectedInstance.update(value => ({
            instanceId: '',
            componentId: '',
            pageId: '',
            nodeName: '',
            breakpoint: 'desktop',
            class: '',
            styling: {"xxl": {}, "xl": {}, "desktop": {}, "tablet": {}, "mobile": {}, "landscape": {}},
            attributes: {},
            content: ''
        }));

        // Update the writable store with the new instances array
        instances.set([...currentInstances]);

        // Update the database for the relationship updates and reordering
        await dbActions(backendUpdates, 'instances', 'upsert');
        await dbActions(instancesToDelete, 'instances', 'delete');

        // Notify the canvas
        postMessage('elementDeleted', { instanceId: initialId });
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

async function injectClass(data, classList, from) {
    // Early return for invalid data
    if (!data || data === 'undefined') {
        return;
    }

    console.log('Class inj.:', data, classList);

    // Find the instance to update
    const selectedInstanceToUpdate = currentInstances.find((i) => i.instanceId === selectedInstanceId);
    if (!selectedInstanceToUpdate) {
        return;
    }

    // Create merged class string
    const mergedClasses = classList.length > 0 ? `${classList.join(' ')} ${data}` : data;

    // Check if class already exists in the stylesheet
    const classExistsInStylesheet = currentStyleSheet.some(style => 
        style.name === mergedClasses
    );

    // Handle class attribute manipulation
    const classAttr = selectedInstanceToUpdate.attributes.find(attr => attr.name === 'class');
    
    // If the class is already present on the element, return early
    if (classAttr && classList.includes(data)) {
        console.warn('Same class found.');
        return;
    }

    // Update or add class attribute
    if (!classAttr) {
        selectedInstanceToUpdate.attributes.push({ name: 'class', value: mergedClasses });
    } else if (classAttr.value !== mergedClasses) {
        classAttr.value = mergedClasses;
    }

    // Update instances store
    instances.set([...currentInstances]);
    // Update the selectedInstance store
    selectedInstance.update(current => ({
        ...current,
        attributes: selectedInstanceToUpdate.attributes,
        class: mergedClasses,
        styling: {
            "xxl": currentStyleSheet.find(attr =>  attr.name === data && attr.breakpoint === 'xxl')?.attributes || {},
            "xl": currentStyleSheet.find(attr =>  attr.name === data && attr.breakpoint === 'xl')?.attributes || {},
            "desktop": currentStyleSheet.find(attr =>  attr.name === data && attr.breakpoint === 'desktop')?.attributes || {},
            "mobile": currentStyleSheet.find(attr =>  attr.name === data && attr.breakpoint === 'mobile')?.attributes || {},
            "landscape": currentStyleSheet.find(attr =>  attr.name === data && attr.breakpoint === 'landscape')?.attributes || {},
        }
    }));

    selectedInstanceClass = mergedClasses;

    // Only create and store CSS schema if the class doesn't exist in stylesheet
    if (!classExistsInStylesheet) {
        const cssSchema = {
            name: mergedClasses,
            breakpoint: breakpoint,
            attributes: {},
            combos: [],
            type: "class"
        };

        currentStyleSheet.push(cssSchema);
        styleSheet.set([...currentStyleSheet]);

        // Update stylesheet in DB only if new class was added
        await dbActions(cssSchema, 'style', 'upsert');
    }

    // Update instance in DB
    await dbActions(selectedInstanceToUpdate, 'instances', 'upsert');

    console.log('Class list: ', classList);
    // Notify iframe about the change
    postMessage('classChanged', { 
        target: selectedInstanceId, 
        className: mergedClasses
    });
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

            // update the $selectedInstance 
            selectedInstance.update(current => ({
                ...current,
                attributes: selectedInstanceToUpdate.attributes,
                styling: {
                    "xxl": currentStyleSheet.find(attr =>  attr.name === classes.join(' ') && attr.breakpoint === 'xxl')?.attributes || {},
                    "xl": currentStyleSheet.find(attr =>  attr.name === classes.join(' ') && attr.breakpoint === 'xl')?.attributes || {},
                    "desktop": currentStyleSheet.find(attr =>  attr.name === classes.join(' ') && attr.breakpoint === 'desktop')?.attributes || {},
                    "mobile": currentStyleSheet.find(attr =>  attr.name === classes.join(' ') && attr.breakpoint === 'mobile')?.attributes || {},
                    "landscape": currentStyleSheet.find(attr =>  attr.name === classes.join(' ') && attr.breakpoint === 'landscape')?.attributes || {},
                }
            }));

            // Remove the class from styleSheet if it exists
            // styleSheet.update(sheet => {
            //     return sheet.filter(style => style.name !== classToRemove);
            // });

            // Update instance in DB
            await dbActions(selectedInstanceToUpdate, 'instances', 'upsert');

            // Notify iframe about the change
            postMessage('classChanged', { target: selectedInstanceId, className: classes.join(' ') });
        }
    }
}

// Function to alter a styling property
const alterStylingProperty = async function (prop, value, from) {
    // Early return for invalid inputs
    if (!prop?.length || !value?.length) return;
    
    console.log('Selected Class: ', selectedInstanceClass, prop, value, from);
    
    // Normalize class name
    selectedInstanceClass = selectedInstanceClass?.trim().replace(/\s+/g, ' ') || '';

    // Handle new elements without a class
    if (!selectedInstanceClass) {
        const selectedInstanceToUpdate = currentInstances.find(i => i.instanceId === selectedInstanceId);
        if (selectedInstanceToUpdate) {
            selectedInstanceClass = `${selectedInstanceToUpdate.nodeName.toLowerCase()}-${generateRandomNumber(6)}`;
            await injectClass(selectedInstanceClass, [], 'first alter');
        }
    }

    // Find or create style object
    let styleToUpdate = await getOrCreateStyle(selectedInstanceClass, breakpoint);
    console.log('STU: ', styleToUpdate);
    if (!styleToUpdate) return;

    // Update style properties
    styleToUpdate.attributes[prop] = value;
    console.log('sync changed');
    // Sync changes
    await syncStyleChanges(styleToUpdate);
    
    // Update selected instance
    updateSelectedInstance();
};

// Helper functions to break down the complexity
const getOrCreateStyle = async (className, breakpoint) => {
    if (!className) {
        await injectClass(className, [], 'second alter');
        return null;
    }

    // Check for existing style with matching class and breakpoint
    let styleToUpdate = currentStyleSheet.find(ss => 
        ss.name === className && ss.breakpoint === breakpoint
    );

    console.log('Style to update: ', styleToUpdate);

    // If no matching breakpoint found but class exists, create new breakpoint variation
    if (!styleToUpdate && currentStyleSheet.some(ss => ss.name === className)) {
        styleToUpdate = {
            name: className,
            breakpoint: breakpoint,
            attributes: {},
            combos: [],
            type: "class"
        };
        console.log('push new breakpoint: ', styleToUpdate);
        currentStyleSheet.push(styleToUpdate);
    }

    return styleToUpdate;
};

const syncStyleChanges = async (styleToUpdate) => {
    // Update stylesheet store
    styleSheet.set([...currentStyleSheet]);
    
    // Notify about styling changes
    postMessage('stylingChanged', { styleSheet: currentStyleSheet });
    
    // Persist changes to DB
    await dbActions(styleToUpdate, 'style', 'upsert');
};

const updateSelectedInstance = () => {
    selectedInstance.update(current => ({
        ...current,
        styling: {
            "xxl": currentStyleSheet.find(attr =>  attr.name === selectedInstanceClass && attr.breakpoint === 'xxl')?.attributes || {},
            "xl": currentStyleSheet.find(attr =>  attr.name === selectedInstanceClass && attr.breakpoint === 'xl')?.attributes || {},
            "desktop": currentStyleSheet.find(attr =>  attr.name === selectedInstanceClass && attr.breakpoint === 'desktop')?.attributes || {},
            "mobile": currentStyleSheet.find(attr =>  attr.name === selectedInstanceClass && attr.breakpoint === 'mobile')?.attributes || {},
            "landscape": currentStyleSheet.find(attr =>  attr.name === selectedInstanceClass && attr.breakpoint === 'landscape')?.attributes || {},
        }
    }));
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
    // Step 3: Compute depth for each instance and add it as a property
    // Step 4: Initialize visibleIds with root elements (depth === 1)
    console.log(currentInstances);
    dVisibleIds = currentInstances
        .filter(instance => instance.depth < 2)
        .map(instance => instance.instanceId)

    // Update the store with the new instances array
    visibleIds.set(dVisibleIds);

    return dVisibleIds;
}


// Step 5: Function to get all descendant IDs of a given ID
function getDescendantIds(id) {
    let descendants = [];
    const instance = currentInstances.find((ins) => ins.instanceId === id);
    if (instance) {
        currentInstances.filter((i) => i.parentInstanceId === instance.instanceId).forEach(({instanceId}) => {
            descendants.push(instanceId);
            descendants = descendants.concat(getDescendantIds(instanceId));
        });
    }

    return descendants;
}

// Step 6: Function to toggle expansion
function toggleExpand(id) {
    const instance = currentInstances.find((ins) => ins.instanceId === id);
    if (!instance) return;

    let children = currentInstances.filter((i) => i.parentInstanceId === instance.instanceId);

    // Determine if the element is currently expanded by checking if any children are visible
    const isExpanded = children.some(({instanceId}) => dVisibleIds.includes(instanceId));

    console.log(dVisibleIds, isExpanded);

    if (isExpanded) {
        // Collapse: Remove all descendants
        const descendants = getDescendantIds(id);
        dVisibleIds = dVisibleIds.filter(vid => !descendants.includes(vid));
    } else {
        // Expand: Add direct children
        if (currentInstances.some((i) => i.parentInstanceId === instance.instanceId)) {
            let childrenIds = children.map(({instanceId}) => instanceId);
            // console.log(childrenIds);
            dVisibleIds = [...dVisibleIds, ...childrenIds];
            // console.log(children, dVisibleIds);
        }
    }

    visibleIds.set(dVisibleIds);

    return dVisibleIds;
}

function toggleInstances(instanceIdToFind) {
    let instancesToBeVisible = [];
    // Helper function to find instance by ID
    function findInstanceById(instanceId) {
        return currentInstances.find(instance => instance.instanceId === instanceId);
    }

    // Helper function to traverse up the parent chain
    function traverseUpwards(startingInstance) {
        let currentInstance = startingInstance;

        while (currentInstance) {
            // If we found a visible ID, we can stop traversing
            if (dVisibleIds.includes(currentInstance.instanceId)) {
                return true;
            }

            // Find the parent instance
            const parentInstance = findInstanceById(currentInstance.parentInstanceId);
            
            // If parent exists and has nested instances, add them to visible array
            if (currentInstances.filter((i) => i.parentInstanceId === parentInstance.instanceId)?.length) {
                currentInstances.filter((i) => i.parentInstanceId === parentInstance.instanceId).forEach(({instanceId}) => {
                    instancesToBeVisible.push(instanceId);
                });
            }

            // Move up to the parent
            currentInstance = parentInstance;
        }

        return false; // No visible ID found in the chain
    }

    // Find the starting instance
    const targetInstance = findInstanceById(instanceIdToFind);
    
    // If instance not found, return false
    if (!targetInstance) {
        return false;
    }

    // Start traversing up from the target instance
    const found = traverseUpwards(targetInstance);
    
    // If we found a visible parent, update the visibleIds set
    if (found) {
        visibleIds.set([...instancesToBeVisible, ...dVisibleIds]);

        // console.log(instancesToBeVisible, dVisibleIds);
    }

    return found;
}

function changeSelection(event, instanceId) {
    if (event?.target?.closest('.dropdown-button') || event?.target?.closest('.cms-line-dropdown')) {
        return; }

    page.subscribe((value) => pageData = value);

    // Find selected instance
    let instance = currentInstances.find((ins) => ins.instanceId === instanceId);

    // get the current stylings
    // and the selected instance's class name
    let styleSheet = pageData.data.stylesRes?.data?.docs || [];
        selectedInstanceClass = instance.attributes?.find((attr) => attr.name === 'class')?.value || '';
    
    // $blockerInProgress = true;
    selectedInstance.set({
        instanceId: instance.instanceId,
        nodeName: instance.nodeName,
        attributes: instance.attributes,
        componentId: instance.componentId,
        pageId: instance.pageId,
        breakpoint: breakpoint,
        class: selectedInstanceClass,
        styling: {
            "xxl": styleSheet.find((attr) => attr.name === selectedInstanceClass && attr.breakpoint === 'xxl')?.attributes || {},
            "xl": styleSheet.find((attr) => attr.name === selectedInstanceClass && attr.breakpoint === 'xl')?.attributes || {},
            "desktop": styleSheet.find((attr) => attr.name === selectedInstanceClass && attr.breakpoint === 'desktop')?.attributes || {},
            "tablet": styleSheet.find((attr) => attr.name === selectedInstanceClass && attr.breakpoint === 'tablet')?.attributes || {},
            "mobile": styleSheet.find((attr) => attr.name === selectedInstanceClass && attr.breakpoint === 'mobile')?.attributes || {},
            "landscape": styleSheet.find((attr) => attr.name === selectedInstanceClass && attr.breakpoint === 'landscape')?.attributes || {},
        },
        content: instance.content
    });

    if (instance.componentId?.length > 0) {
        return; }
    postMessage('selectionChanged', { instanceId: instance.instanceId })
    // dispatch('selectionChanged');
}

const alterTagName = async function(instanceId, value) {
    let currentInstance = currentInstances.find((i) => i.instanceId === instanceId);
        currentInstance.nodeName = value;

    instances.set([...currentInstances]);

    // Notify via postMessage
    postMessage('elementTagChanged', { instanceId: currentInstance.instanceId, nodeName: value });

    // update the $selectedInstance 
    selectedInstance.update(current => ({
        ...current,
        nodeName: value
    }));

    // Upsert instances in the database
    let updatedInstance = await dbActions(currentInstance, 'instances', 'upsert');
}

const alterAttribute = async function(attr, value) {
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

    // update the $selectedInstance 
    selectedInstance.update(current => ({
        ...current,
        attributes: currentInstance.attributes || []
    }));

    // Notify via postMessage
    postMessage('elementAttributeAdded', { instanceId: currentInstance.instanceId, attribute: {name: attr,value: value} });

    // Upsert instances in the database
    let updatedInstance = await dbActions(currentInstance, 'instances', 'upsert');
}

const deleteAttribute = async function(attr) {
    if (!attr) {
        return; }

    let currentInstance = currentInstances.find((i) => i.instanceId === selectedInstanceId);

    // Find the index of the attribute with the given name
    const index = currentInstance.attributes.findIndex(a => a.name === attr);
    if (index !== -1) {
        // Remove the attribute at the found index
        currentInstance.attributes.splice(index, 1);
    }

    instances.set([...currentInstances]);

    // update the $selectedInstance 
    selectedInstance.update(current => ({
        ...current,
        attributes: currentInstance.attributes || []
    }));

    // Notify via postMessage
    postMessage('elementAttributeRemoved', { instanceId: currentInstance.instanceId, attribute: {name: attr} });

    // Upsert instances in the database
    let updatedInstance = await dbActions(currentInstance, 'instances', 'upsert');
}

function sanitizeComponentName(componentName) {
    // Remove special characters and replace with empty string
    // Keep alphanumeric characters and spaces
    let sanitized = componentName.replace(/[^a-zA-Z0-9\s]/g, '');
    
    // Remove extra spaces and trim
    sanitized = sanitized.replace(/\s+/g, ' ').trim();
    
    // Split into words
    const words = sanitized.split(' ');
    
    // Capitalize first letter of each word and join
    return words.map(word => {
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('');
}

function initLayers() {
    if (!layerInitReady) {
        return; }

    postMessage('componentFocused', {page: {pageId: 'component'}, components: [selectedComponent], instances: currentInstances.filter((i) => i.variantId === dVariants.selectedVariantId), styleSheet: currentStyleSheet});
}

async function focusOnComponent(componentId, overwrites) {
    try {
        const compReq = await fetch(`https://preconvert.novus.studio/staging/components/view?componentId=${componentId}`);
        const compRes = await compReq.json();

        const compVariantsReq = await fetch(`https://preconvert.novus.studio/staging/variants/view?componentId=${componentId}`);
        const compVariantsRes = await compVariantsReq.json();

        const selectedVariantId = overwrites ? overwrites.selectedVariantId : compVariantsRes.data[0].variantId;

        const compInstancesReq = await fetch(`https://preconvert.novus.studio/staging/instances/view?variantId=${selectedVariantId}`);
        const compInstancesRes = await compInstancesReq.json();

        selectedComponent = compRes.data;
        console.log('SEL COMP: ', selectedComponent);
        variants.set({
            selectedVariantId: selectedVariantId,
            variants: compVariantsRes.data
        })
        components.set([selectedComponent]);

        if (selectedComponent[0].type !== 'preset') {
            instances.set(compInstancesRes.data.instances.filter(((i) => i.pageId === 'COMPONENT')));

            layerInitReady = true;

            initLayers();

            drawInstances();

            // selectedCMSTabIndex.set(0);

            cmsMode.set('component');

            layerInitReady = false;
        } else {
            console.log('PRESET TO GO');
        }
    } catch (error) {
        console.error('Error fetching components:', error);
    }
}

export {
    handleElementAppend,
    getInstancesToDelete,
    getStyleValueFromCascade,
    compareInstances,
    handleKeyDown,
    postMessage,
    drawInstances,
    toggleExpand,
    changeSelection,
    alterStylingProperty,
    alterTagName,
    alterAttribute,
    deleteAttribute,
    alterContent,
    dbActions,
    injectClass,
    removeClass,
    toggleInstances,
    generateRandomString,
    focusOnComponent,
    initLayers,
    sanitizeComponentName,
    generateRandomNumber
}
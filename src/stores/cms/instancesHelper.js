// Helper functions for tree operations
export function findInstance(tree, instanceId) {
    if (tree.instanceId === instanceId) return tree;
    
    for (const child of (tree.children || [])) {
        const found = findInstance(child, instanceId);
        if (found) return found;
    }
    
    return null;
}

export function updateInstance(tree, instanceId, updates) {
    if (tree.instanceId === instanceId) {
        return { ...tree, ...updates };
    }
    
    return {
        ...tree,
        children: (tree.children || []).map(child => 
            updateInstance(child, instanceId, updates)
        )
    };
}

export function removeInstance(tree, instanceId) {
    return {
        ...tree,
        children: (tree.children || [])
            .filter(child => child.instanceId !== instanceId)
            .map(child => removeInstance(child, instanceId))
    };
}

export function insertInstance(tree, parentId, instance, index) {
    if (tree.instanceId === parentId) {
        const newChildren = [...(tree.children || [])];
        newChildren.splice(index, 0, instance);
        return {
            ...tree,
            children: newChildren.map((child, idx) => ({ ...child, order: idx }))
        };
    }
    
    return {
        ...tree,
        children: (tree.children || []).map(child => 
            insertInstance(child, parentId, instance, index)
        )
    };
}
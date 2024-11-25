<script>
    let items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
    let draggedItem = null;
    let dropPosition = null; // null, 'before', or 'after'
    let dropTargetItem = null;
  
    function handleDragStart(e, item) {
      draggedItem = item;
      e.target.classList.add('dragging');
    }
  
    function handleDragEnd(e) {
      e.target.classList.remove('dragging');
      draggedItem = null;
      dropPosition = null;
      dropTargetItem = null;
    }
  
    function handleDragOver(e) {
      e.preventDefault();
    }
  
    function handleDragEnter(e, item) {
      e.preventDefault();
      if (item === draggedItem) return;
      
      const rect = e.currentTarget.getBoundingClientRect();
      const midPoint = rect.top + rect.height / 2;
      dropPosition = e.clientY < midPoint ? 'before' : 'after';
      dropTargetItem = item;
    }
  
    function handleDragLeave(e) {
      // Only clear if we're actually leaving the list item
      if (!e.currentTarget.contains(e.relatedTarget)) {
        dropPosition = null;
        dropTargetItem = null;
      }
    }
  
    function handleDrop(e, targetItem) {
      e.preventDefault();
      if (!dropPosition || draggedItem === targetItem) return;
      
      const draggedIndex = items.indexOf(draggedItem);
      let targetIndex = items.indexOf(targetItem);

      console.log(draggedIndex, targetIndex);
      
    //   // Remove dragged item first
    //   items.splice(draggedIndex, 1);
      
    //   // If dropping after and we removed an item before the target, adjust the index
    //   if (dropPosition === 'after') {
    //     if (draggedIndex < targetIndex) {
    //       targetIndex--;
    //     }
    //     targetIndex++;
    //   } else if (draggedIndex < targetIndex) {
    //     targetIndex--;
    //   }
      
    //   // Insert at the new position
    //   items.splice(targetIndex, 0, draggedItem);
    //   items = [...items];
      
    //   // Reset states
    //   dropPosition = null;
    //   dropTargetItem = null;
    }
  </script>
  
  <ul class="list">
    {#each items as item (item)}
      <li
        draggable="true"
        on:dragstart={(e) => handleDragStart(e, item)}
        on:dragend={handleDragEnd}
        on:dragover={handleDragOver}
        on:dragenter={(e) => handleDragEnter(e, item)}
        on:dragleave={handleDragLeave}
        on:drop={(e) => handleDrop(e, item)}
        class:dragging={draggedItem === item}
        class:drop-target={dropTargetItem === item}
        data-drop-position={dropTargetItem === item ? dropPosition : null}
      >
        {item}
      </li>
    {/each}
  </ul>
  
  <style>
    .list {
      list-style: none;
      padding: 0;
      margin: 20px;
    }
  
    li {
      padding: 10px;
      margin: 5px 0;
      background-color: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: move;
      color: black;
      position: relative;
    }
  
    li.dragging {
      opacity: 0.5;
    }
  
    /* Drop target styles */
    li.drop-target {
      position: relative;
    }
  
    li.drop-target[data-drop-position="before"]::before,
    li.drop-target[data-drop-position="after"]::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #2196F3;
      z-index: 1;
    }
  
    li.drop-target[data-drop-position="before"]::before {
      top: -1px;
    }
  
    li.drop-target[data-drop-position="after"]::after {
      bottom: -1px;
    }
  </style>
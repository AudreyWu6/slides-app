import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ResizableBox ({ element, index, handleDeleteElement, handleEditElement, handleUpdateElement, containerHeight, containerWidth }) {
  const [isSelected, setIsSelected] = useState(false);
  const toggleSelect = () => {
    setIsSelected(prev => !prev);
  };
  // useState to track size and position
  const [style, setStyle] = useState({
    left: element.position.x + 'px',
    top: element.position.y + 'px',
    width: element.width + '%',
    height: element.height + '%',
  });
  // handle drag
  const startDrag = (e) => {
    e.preventDefault()
    const startPos = { x: e.pageX, y: e.pageY };
    let tempLeft = parseInt(style.left);
    let tempTop = parseInt(style.top);

    const onDragging = (e) => {
      const dx = e.pageX - startPos.x;
      const dy = e.pageY - startPos.y;
      let newLeft = tempLeft + dx;
      let newTop = tempTop + dy;

      // Calculate the right and bottom edges of the moving block
      const widthPx = parseFloat(style.width) * containerWidth / 100;
      const heightPx = parseFloat(style.height) * containerHeight / 100;

      // Check left and top boundaries
      if (newLeft < 0) newLeft = 0;
      if (newTop < 0) newTop = 0;
      if (newLeft + widthPx > containerWidth) newLeft = containerWidth - widthPx;
      if (newTop + heightPx > containerHeight) newTop = containerHeight - heightPx;

      // Update temporary left and top for next movement
      tempLeft = newLeft;
      tempTop = newTop;

      // Update the style with the new position
      setStyle(prevStyle => ({
        ...prevStyle,
        left: newLeft + 'px',
        top: newTop + 'px'
      }));

      // Update start positions for the next call
      startPos.x = e.pageX;
      startPos.y = e.pageY;
    };
    function stopDrag () {
      document.removeEventListener('mousemove', onDragging);
      document.removeEventListener('mouseup', stopDrag);
      handleUpdateElement(element.id, { position: { x: tempLeft, y: tempTop } });
    }

    document.addEventListener('mousemove', onDragging);
    document.addEventListener('mouseup', stopDrag);
  };

  // handle resize
  const startResize = (corner, e) => {
    e.stopPropagation(); // 阻止mousedown事件冒泡
    e.preventDefault()
    const startPos = { x: e.pageX, y: e.pageY };
    let tempWidth = parseFloat(style.width);
    let tempHeight = parseFloat(style.height);
    let tempLeft = parseFloat(style.left);
    let tempTop = parseFloat(style.top);

    const onResizing = (e) => {
      const dx = e.pageX - startPos.x;
      const dy = e.pageY - startPos.y;

      let newWidth = tempWidth;
      let newHeight = tempHeight;
      let newLeft = tempLeft;
      let newTop = tempTop;

      switch (corner) {
        case 'bottom-right':
          newWidth = tempWidth + dx / containerWidth * 100;
          newHeight = tempHeight + dy / containerHeight * 100;
          break;
        case 'bottom-left':
          newWidth = tempWidth - dx / containerWidth * 100;
          newHeight = tempHeight + dy / containerHeight * 100;
          newLeft = tempLeft + dx;
          break;
        case 'top-left':
          newWidth = tempWidth - dx / containerWidth * 100;
          newHeight = tempHeight - dy / containerHeight * 100;
          newLeft = tempLeft + dx;
          newTop = tempTop + dy;
          break;
        case 'top-right':
          newWidth = tempWidth + dx / containerWidth * 100;
          newHeight = tempHeight - dy / containerHeight * 100;
          newTop = tempTop + dy;
          break;
      }
      // Boundary checks for the new dimensions and position
      if (newLeft < 0) {
        newWidth += newLeft / containerWidth * 100;
        newWidth = Math.max(1, newWidth);
        newLeft = 0; // 重置左边距，防止元素超出边界
      }
      if (newTop < 0) {
        newHeight += newTop / containerHeight * 100;
        newHeight = Math.max(1, newHeight);
        newTop = 0;
      }
      const widthPx = newWidth * containerWidth / 100;
      const heightPx = newHeight * containerHeight / 100;
      if (newLeft + widthPx > containerWidth) {
        console.log('newLeft', newLeft, 'widthPx', widthPx, 'containerWidth', containerWidth)
        newWidth -= (newLeft + widthPx - containerWidth) / containerWidth * 100;
        newWidth = Math.max(1, newWidth);
        newLeft = containerWidth - newWidth * containerWidth / 100;
      }
      if (newTop + heightPx > containerHeight) {
        newHeight -= (newTop + heightPx - containerHeight) / containerHeight * 100;
        newHeight = Math.max(1, newHeight);
        newTop = containerHeight - newHeight * containerHeight / 100;
      }
      // fds
      if (newWidth < 1) {
        if (corner === 'top-left' || corner === 'bottom-left') newLeft -= (1 - newWidth) * containerWidth / 100;
        newWidth = 1
      }
      if (newHeight < 1) {
        if (corner === 'top-right' || corner === 'top-left') newTop -= (1 - newHeight) * containerHeight / 100;
        newHeight = 1
      }
      // Update temporary values for next movement
      tempWidth = newWidth;
      tempHeight = newHeight;
      tempLeft = newLeft;
      tempTop = newTop;

      setStyle(prevStyle => ({
        ...prevStyle,
        width: newWidth + '%',
        height: newHeight + '%',
        left: newLeft + 'px',
        top: newTop + 'px'
      }));

      startPos.x = e.pageX;
      startPos.y = e.pageY;
    };

    function stopResize () {
      document.removeEventListener('mousemove', onResizing);
      document.removeEventListener('mouseup', stopResize);
      handleUpdateElement(element.id, { position: { x: tempLeft, y: tempTop }, width: tempWidth, height: tempHeight });
    }

    document.addEventListener('mousemove', onResizing);
    document.addEventListener('mouseup', stopResize);
  };

  let content;

  switch (element.type) {
    case 'text':
      content = (
        <div style={{
          position: 'absolute',
          color: element.color,
          fontSize: `${element.fontSize}em`,
        }}>
          {element.text}
        </div>
      );
      break;
    case 'image':
      content = (
        <img src={element.url} alt={element.alt} style={{
          position: 'absolute',
        }} />
      );
      break;
    case 'video':
      content = (
        <video
          src={element.url}
          style={{
            position: 'absolute',
          }}
          autoPlay={element.autoPlay}
          muted
          loop
        />
      );
      break;
    case 'code':
      content = (
        <div
          style={{
            position: 'absolute',
          }}
        >
          <SyntaxHighlighter language={element.language} style={materialLight} customStyle={{ fontSize: `${element.fontSize}em` }}>
            {element.code}
          </SyntaxHighlighter>
        </div>
      );
      break;
    default:
      content = <div>Unsupported element type</div>;
  }

  return (
    <div key={index}
         onMouseDown={startDrag}
         onClick={toggleSelect}
         onContextMenu={(event) => {
           event.preventDefault();
           handleDeleteElement(element.id);
         }}
         onDoubleClick={(event) => {
           event.preventDefault();
           handleEditElement(element.id);
         }}
         style={{
           position: 'absolute',
           border: '1px solid grey',
           zIndex: index,
           ...style
         }}>
      {content}
      {/* handles */}
      {isSelected && (
        <>
        <div style={{ position: 'absolute', right: 0, bottom: 0, width: '5px', height: '5px', background: 'black' }}
             onMouseDown={(e) => startResize('bottom-right', e)}/>
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: '5px', height: '5px', background: 'black' }}
             onMouseDown={(e) => startResize('bottom-left', e)}/>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '5px', height: '5px', background: 'black' }}
             onMouseDown={(e) => startResize('top-left', e)}/>
        <div style={{ position: 'absolute', right: 0, top: 0, width: '5px', height: '5px', background: 'black' }}
             onMouseDown={(e) => startResize('top-right', e)}/>
        </>
      )}
    </div>
  );
}

export default ResizableBox;

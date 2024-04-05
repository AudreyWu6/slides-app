import React, { useState } from 'react';
import AddTextModal from './AddTextModal';
import Slide from './Slide';
import AddImageModal from './AddImageModal';
import AddVideoModal from './AddVideoModal';
import AddCodeBlockModal from './AddCodeBlockModal'; // 确保路径正确

function SlideEditor () {
  // 假设我们只处理一个幻灯片，我们可以直接将这个幻灯片的状态命名为slide
  const [slide, setSlide] = useState({
    id: 1,
    elements: [], // 幻灯片初始为空
  });

  const updateElements = (newElements) => {
    setSlide(prevSlide => ({
      ...prevSlide,
      elements: newElements,
    }));
  };

  // 删除元素的示例方法
  const deleteElement = (elementId) => {
    setSlide(prevSlide => ({
      ...prevSlide,
      elements: prevSlide.elements.filter(element => element.id !== elementId),
    }));
  };

  const handleAddElement = (elementData, elementType) => {
    const newElement = {
      id: Date.now(), // 为新元素生成唯一ID
      type: elementType, // 元素类型，如"text", "image"等
      ...elementData, // 元素具体数据
    };

    updateElements([...slide.elements, newElement]);
  };

  return (
      <div>
        {/* 可以放置一些顶部的工具栏或其他UI组件 */}
        <div className="toolbar">
          <AddTextModal onAddText={(textData) => handleAddElement(textData, 'text')}/>
          <AddImageModal onAddImage={(imageData) => handleAddElement(imageData, 'image')}/>
          <AddVideoModal onAddVideo={(videoData) => handleAddElement(videoData, 'video')}/>
          <AddCodeBlockModal onAddCodeBlock={(codeBlockData) => handleAddElement(codeBlockData, 'code')}/>
          {/* 其他操作按钮或组件 */}
        </div>

        {/* 幻灯片展示区 */}
        <Slide slide={slide} updateElements={updateElements} deleteElement={deleteElement}/>

        {/* 如果需要在幻灯片下方添加其他内容 */}
        <div className="additional-content">
          {/* 在这里添加其他内容 */}
        </div>
      </div>
  );
}

export default SlideEditor;

import React, { useState } from 'react';
import Slide from './Slide';
import ModalBtn from './OpenModalBtn';

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

  const deleteElement = (elementId) => {
    setSlide(prevSlide => ({
      ...prevSlide,
      elements: prevSlide.elements.filter(element => element.id !== elementId),
    }));
  };

  const handleAddElement = (elementData, elementType) => {
    const newElement = {
      id: Date.now(), // 为新元素生成唯一ID
      type: elementType,
      ...elementData,
    };
    updateElements([...slide.elements, newElement]);
  };

  const handleUpdateElement = (elementId, updatedData) => {
    const updatedElements = slide.elements.map((element) => {
      if (element.id === elementId) {
        // 对于匹配的ID，返回更新后的数据
        return { ...element, ...updatedData };
      }
      // 对于不匹配的ID，保留原有元素不变
      return element;
    });

    // 使用更新后的元素数组来更新状态
    updateElements(updatedElements);
  };

  return (
      <div>
        {/* toolbox */}
        <div className="toolbar">
          <ModalBtn type='text' update={(data) => handleAddElement(data, 'text')}></ModalBtn>
          <ModalBtn type='image' update={(data) => handleAddElement(data, 'image')}></ModalBtn>
          <ModalBtn type='video' update={(data) => handleAddElement(data, 'video')}></ModalBtn>
          <ModalBtn type='code' update={(data) => handleAddElement(data, 'code')}></ModalBtn>
        </div>

        {/* slide */}
        <Slide slide={slide} updateElements={updateElements} deleteElement={deleteElement} handleUpdateElement={handleUpdateElement}/>

        {/* other */}
        <div className="additional-content">
          {/* 在这里添加其他内容 */}
        </div>
      </div>
  );
}

export default SlideEditor;

import React, { useEffect, useState } from 'react';
import Slide from './Slide';
import ModalBtn from './OpenModalBtn';

function SlideEditor ({ slide: passedSlide, handleUpdateSlide }) {
  // console.log('slide passed', passedSlide)
  const initialState = {
    id: 1,
    elements: [],
  }
  const [slide, setSlide] = useState(passedSlide || initialState);
  // console.log('slide shown', slide)

  // 使用 useEffect 来监听 passedSlide 的变化
  useEffect(() => {
    setSlide(passedSlide || initialState);
  }, [passedSlide]);

  const updateElements = (newElements) => {
    setSlide(prevSlide => {
      const updatedSlide = { ...prevSlide, elements: newElements };
      handleUpdateSlide(updatedSlide); // 调用父组件的函数，传递更新后的 slide
      return updatedSlide;
    });
  };

  const deleteElement = (elementId) => {
    setSlide(prevSlide => {
      const updatedSlide = {
        ...prevSlide,
        elements: prevSlide.elements.filter(element => element.id !== elementId),
      };
      handleUpdateSlide(updatedSlide); // 同样更新父组件的 slide 数据
      return updatedSlide;
    });
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
        return { ...element, ...updatedData };
      }
      return element;
    });
    updateElements(updatedElements);
  };

  const handleDeleteElement = (elementId) => {
    deleteElement(elementId);
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
      <Slide slide={slide} handleDeleteElement={handleDeleteElement} handleUpdateElement={handleUpdateElement}/>

      {/* other */}
      <div className="additional-content">
        {/* 在这里添加其他内容 */}
      </div>
    </div>
  );
}

export default SlideEditor;

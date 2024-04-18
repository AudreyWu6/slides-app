import React, { useEffect, useState } from 'react';
import Slide from './Slide';
import ModalBtn from './OpenModalBtn';
import ColorBtn from './ColorBtn';
import SlideTransitionWrapper from './SlideTransitionWrapper';

function SlideEditor ({ slide: passedSlide, handleUpdateSlide, handleUpdateTheme, themeColor }) {
  const initialState = {
    id: 1,
    elements: [],
  }
  const [slide, setSlide] = useState(passedSlide || initialState);

  useEffect(() => {
    setSlide(passedSlide || initialState);
  }, [passedSlide]);

  const updateElements = (newElements) => {
    setSlide(prevSlide => {
      const updatedSlide = { ...prevSlide, elements: newElements };
      handleUpdateSlide(updatedSlide);
      return updatedSlide;
    });
  };

  const updateBackground = (color) => {
    setSlide(prevSlide => {
      const updatedSlide = { ...prevSlide, background: color };
      handleUpdateSlide(updatedSlide);
      return updatedSlide;
    });
  };

  const deleteElement = (elementId) => {
    setSlide(prevSlide => {
      const updatedSlide = {
        ...prevSlide,
        elements: prevSlide.elements.filter(element => element.id !== elementId),
      };
      handleUpdateSlide(updatedSlide);
      return updatedSlide;
    });
  };

  const handleAddElement = (elementData, elementType) => {
    const newElement = {
      id: Date.now(),
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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 690);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 690);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toolbarStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'row' : 'column',
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    width: isMobile ? '100%' : '300px',
  };

  const mainContentStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
  };
  return (
    <SlideTransitionWrapper keyProp={slide.id}>
    <div style={mainContentStyle}>
      <div style={toolbarStyle}>
        <ColorBtn updateBackground={updateBackground} updateTheme={handleUpdateTheme}></ColorBtn>
        <ModalBtn type='text' update={(data) => handleAddElement(data, 'text')}></ModalBtn>
        <ModalBtn type='image' update={(data) => handleAddElement(data, 'image')}></ModalBtn>
        <ModalBtn type='video' update={(data) => handleAddElement(data, 'video')}></ModalBtn>
        <ModalBtn type='code' update={(data) => handleAddElement(data, 'code')}></ModalBtn>
        <ModalBtn type='audio' update={(data) => handleAddElement(data, 'audio')}></ModalBtn>
      </div>
      <div>
      <Slide slide={slide} handleDeleteElement={handleDeleteElement} handleUpdateElement={handleUpdateElement} themeColor={themeColor}/>
      </div>
    </div>
    </SlideTransitionWrapper>
  );
}

export default SlideEditor;

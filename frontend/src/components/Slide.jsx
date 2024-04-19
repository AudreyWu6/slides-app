// import React, { useEffect, useState } from 'react';
import React, { useEffect, useState, useRef } from 'react';
import ElementModal from './ElementModal';
import ResizableBox from './ResizableBox';

function Slide ({ slide, handleDeleteElement, handleUpdateElement, themeColor }) {
  // State to control the modal for adding/editing elements
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [elementId, setElementId] = useState(null);
  const [dataType, setDataType] = useState(null);
  const backgroundColor = slide.background || themeColor
  // ******************************* add width ****************************** */
  const elementRef = useRef(null);
  const [height, setHeight] = useState('0');
  const [width, setWidth] = useState('0');
  useEffect(() => {
    function updateDimensions () {
      const viewportWidth = window.innerWidth; // Get the viewport width
      if (viewportWidth > 690) {
        const calculatedWidth = viewportWidth - 300;
        const newHeight = calculatedWidth * 0.75;
        setWidth(`${calculatedWidth}`);
        setHeight(`${newHeight}`);
      } else {
        const calculatedWidth = viewportWidth - 80;
        const newHeight = calculatedWidth * 0.75;
        setWidth(`${calculatedWidth}`);
        setHeight(`${newHeight}`);
      }
    }
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  // ******************************* add width ****************************** */
  const handleEditElement = (elementId) => {
    const elementToEdit = slide.elements.find(element => element.id === elementId);
    if (elementToEdit) {
      // console.log('Editing element with ID:', elementId);
      setInitialData({
        ...elementToEdit,
      });
      setElementId(elementId);
      setDataType(elementToEdit.type);
      setIsEditing(true);
      setModalOpen(true);
    }
  };

  useEffect(() => {
    // console.log(dataType);
  }, [dataType]);

  return (
    <div className="slide-container" ref={elementRef}
        style={{ border: '2px solid black', margin: '20px', position: 'relative', width: `${width}px`, height: `${height}px`, background: backgroundColor }}>
      {slide.elements.map((element, index) => {
        return (
          <ResizableBox
            key={element.id} // Assuming each element has a unique id
            element={element}
            index={index}
            handleDeleteElement={handleDeleteElement}
            handleEditElement={handleEditElement}
            handleUpdateElement={handleUpdateElement}
            containerHeight={parseInt(height)}
            containerWidth={parseInt((width))}
          />
        );
      })}
      <ElementModal
        type={dataType}
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        isEditing={isEditing}
        initialData={initialData}
        update={(data) => handleUpdateElement(elementId, data)}
      />
    </div>
  );
}

export default Slide;

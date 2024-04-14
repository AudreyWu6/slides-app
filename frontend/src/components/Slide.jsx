import React, { useEffect, useState, useRef } from 'react';
import ElementModal from './ElementModal';
import ResizableBox from './ResizableBox';

function Slide ({ slide, handleDeleteElement, handleUpdateElement, themeColor }) {
  console.log(slide.background, 'theme', themeColor);
  // State to control the modal for adding/editing elements
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [elementId, setElementId] = useState(null);
  const [dataType, setDataType] = useState(null);
  const backgroundColor = slide.background || themeColor
  // ******************************* add width ****************************** */
  const elementRef = useRef(null);
  const [height, setHeight] = useState('0px');
  useEffect(() => {
    function updateDimensions () {
      if (elementRef.current) {
        const width = elementRef.current.offsetWidth; // Get the width of the container
        const newHeight = width * 0.75; // Calculate height as 3/4 of the width
        setHeight(`${newHeight}px`); // Set the height state
      }
    }
    updateDimensions();
    // Add event listener to resize window
    window.addEventListener('resize', updateDimensions);
    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  // ******************************* add width ****************************** */
  const handleEditElement = (elementId) => {
    const elementToEdit = slide.elements.find(element => element.id === elementId);
    if (elementToEdit) {
      console.log('Editing element with ID:', elementId);
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
    console.log(dataType); // 在这里检查更新后的值
  }, [dataType]);

  return (
    <div className="slide-container" ref={elementRef}
         style={{ border: '2px solid black', margin: '20px', position: 'relative', width: 'calc(100vw - 180px)', height: `${height}`, background: backgroundColor }}>
      {slide.elements.map((element, index) => {
        return (
          <ResizableBox
            key={element.id} // Assuming each element has a unique id
            element={element}
            index={index}
            handleDeleteElement={handleDeleteElement}
            handleEditElement={handleEditElement}
            handleUpdateElement={handleUpdateElement}
            containerHeight={parseInt(`${height}`)}
            containerWidth={parseInt('calc(100vw - 160px)')}
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
      {/* Button or method to open the modal in add mode */}
    </div>
  );
}

export default Slide;

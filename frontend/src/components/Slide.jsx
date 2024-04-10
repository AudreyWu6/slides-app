import React, { useEffect, useState } from 'react';
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

  const handleEditElement = (elementId) => {
    // Find the element to edit
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
    <div className="slide-container"
         style={{ border: '2px solid black', margin: '20px', position: 'relative', width: '1200px', height: '800px', background: backgroundColor }}>
      {slide.elements.map((element, index) => {
        return (
          <ResizableBox
            key={element.id} // Assuming each element has a unique id
            element={element}
            index={index}
            handleDeleteElement={handleDeleteElement}
            handleEditElement={handleEditElement}
            handleUpdateElement={handleUpdateElement}
            containerHeight={parseInt('800px')}
            containerWidth={parseInt('1200px')}
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

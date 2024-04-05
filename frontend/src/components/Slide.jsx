import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ElementModal from './ElementModal';

function Slide ({ slide, updateElements, deleteElement, handleUpdateElement }) {
  // State to control the modal for adding/editing elements
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [elementId, setElementId] = useState(null);
  const [dataType, setDataType] = useState(null);

  const handleDeleteElement = (elementId) => {
    deleteElement(elementId);
  };

  const handleEditElement = (elementId) => {
    // Find the element to edit
    const elementToEdit = slide.elements.find(element => element.id === elementId);
    if (elementToEdit) {
      console.log('Editing element with ID:', elementId);
      // Set the initial data for the modal to the element's current properties
      setInitialData({
        ...elementToEdit,
        // Any transformations needed for the modal's expectations
      });
      console.log(initialData);
      setElementId(elementId);
      setDataType(elementToEdit.type);
      console.log(dataType);
      // Open the modal in edit mode
      setIsEditing(true);
      setModalOpen(true);
    }
  };

  useEffect(() => {
    console.log(dataType); // 在这里检查更新后的值
  }, [dataType]);

  return (
        <div className="slide-container" style={{ border: '2px solid black', margin: '20px', position: 'relative', width: '100%', height: '1000px' }}>
            {slide.elements.map((element, index) => {
              switch (element.type) {
                case 'text':
                  return (
                            <div
                                key={index}
                                onContextMenu={(event) => {
                                  event.preventDefault();
                                  handleDeleteElement(element.id);
                                }}
                                onDoubleClick={(event) => {
                                  event.preventDefault();
                                  handleEditElement(element.id)
                                }}
                                style={{
                                  position: 'absolute',
                                  left: `${element.position.x}%`,
                                  top: `${element.position.y}%`,
                                  width: `${element.width}%`,
                                  height: `${element.height}%`,
                                  zIndex: index,
                                  border: '1px solid grey',
                                  color: element.color,
                                  fontSize: `${element.fontSize}em`,
                                }}
                            >
                                {element.text}
                            </div>
                  );
                case 'image':
                  return (
                      <img
                          key={index}
                          onContextMenu={(event) => {
                            event.preventDefault();
                            handleDeleteElement(element.id);
                          }}
                          onDoubleClick={(event) => {
                            event.preventDefault();
                            handleEditElement(element.id)
                          }}
                          src={element.url}
                          alt={element.alt}
                          style={{
                            position: 'absolute',
                            left: `${element.position.x}%`,
                            top: `${element.position.y}%`,
                            width: `${element.width}%`,
                            height: `${element.height}%`,
                            zIndex: index,
                          }}
                      />
                  );
                case 'video':
                  return (
                      <video
                          key={index}
                          onContextMenu={(event) => {
                            event.preventDefault();
                            handleDeleteElement(element.id);
                          }}
                          onDoubleClick={(event) => {
                            event.preventDefault();
                            handleEditElement(element.id)
                          }}
                          src={element.url}
                          style={{
                            position: 'absolute',
                            left: `${element.position.x}%`,
                            top: `${element.position.y}%`,
                            width: `${element.width}%`,
                            height: `${element.height}%`,
                            zIndex: index,
                          }}
                          // controls显示播放控件
                          autoPlay={element.autoPlay}
                          muted // 必须设置muted才能自动播放
                          loop // 可选，如果你想视频循环播放
                      />
                  );
                case 'code':
                  return (
                      <div
                          key={index}
                          onContextMenu={(event) => {
                            event.preventDefault();
                            handleDeleteElement(element.id);
                          }}
                          onDoubleClick={(event) => {
                            event.preventDefault();
                            handleEditElement(element.id)
                          }}
                          style={{
                            position: 'absolute',
                            left: `${element.position.x}%`,
                            top: `${element.position.y}%`,
                            width: `${element.width}%`,
                            height: `${element.height}%`,
                            zIndex: index,
                          }}
                      >
                        <SyntaxHighlighter language={element.language} style={materialLight} customStyle={{ fontSize: `${element.fontSize}em` }}>
                          {element.code}
                        </SyntaxHighlighter>
                      </div>
                  );
                default:
                  return null;
              }
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

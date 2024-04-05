import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Slide ({ slide, updateElements, deleteElement }) {
  const handleDeleteElement = (elementId) => {
    deleteElement(elementId);
  };

  const handleEditElement = (elementId) => {
    console.log('Editing element with ID:', elementId);

  };
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
        </div>
  );
}

export default Slide;

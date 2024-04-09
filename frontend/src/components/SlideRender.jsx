import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function SlideRender ({ slide }) {
  // Function to render different types of elements based on their type
  const renderElement = (element) => {
    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={{
              position: 'absolute',
              left: `${element.position.x}%`,
              top: `${element.position.y}%`,
              zIndex: element.zIndex,
              fontSize: `${element.fontSize}em`,
              color: element.color,
              width: `${element.width}%`,
              height: `${element.height}%`,
            }}
          >
            {element.text}
          </div>
        );
      case 'image':
        return (
          <img
            key={element.id}
            src={element.url}
            alt={element.alt}
            style={{
              position: 'absolute',
              left: `${element.position.x}%`,
              top: `${element.position.y}%`,
              zIndex: element.zIndex,
              width: `${element.width}%`,
              height: `${element.height}%`,
            }}
          />
        );
      case 'video':
        return (
          <video
            key={element.id}
            src={element.url}
            style={{
              position: 'absolute',
              left: `${element.position.x}%`,
              top: `${element.position.y}%`,
              zIndex: element.zIndex,
              width: `${element.width}%`,
              height: `${element.height}%`,
            }}
            controls
          />
        );
      case 'code':
        return (
          <SyntaxHighlighter
            key={element.id}
            language={element.language || 'javascript'}
            style={dark}
            customStyle={{
              position: 'absolute',
              left: `${element.position.x}%`,
              top: `${element.position.y}%`,
              zIndex: element.zIndex,
              width: `${element.width}%`,
              height: `${element.height}%`,
              fontSize: `${element.fontSize || 1}em`,
            }}
          >
            {element.code}
          </SyntaxHighlighter>
        );
      default:
        return null;
    }
  };
  return (
    <div className="slide" style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {slide.elements.map(renderElement)}
    </div>
  );
}

export default SlideRender;

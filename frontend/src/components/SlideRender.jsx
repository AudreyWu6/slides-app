import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function SlideRender ({ slide, themeColor, width }) {
  // Function to render different types of elements based on their type
  const backgroundColor = slide.background || themeColor
  const containerWidth = width;
  const containerHeight = width * 0.75;
  const renderElement = (element) => {
    console.log('x', element.position.x);
    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={{
              position: 'absolute',
              left: `${element.position.x * containerWidth / 100}`,
              top: `${element.position.y * containerWidth / 100}`,
              zIndex: element.zIndex,
              fontSize: `${element.fontSize}em`,
              color: element.color,
              width: `${element.width}%`,
              height: `${element.height}%`,
              overflow: 'hidden',
              fontFamily: element.fontFamily,
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
              left: `${element.position.x * containerWidth / 100}%`,
              top: `${element.position.y * containerWidth / 100}%`,
              zIndex: element.zIndex,
              width: `${element.width}%`,
              height: `${element.height}%`,
              objectFit: 'contain',
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
              left: `${element.position.x / containerWidth * 100}%`,
              top: `${element.position.y / containerHeight * 100}%`,
              zIndex: element.zIndex,
              width: `${element.width}%`,
              height: `${element.height}%`,
              objectFit: 'contain',
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
              left: `${element.position.x / containerWidth * 100}%`,
              top: `${element.position.y / containerHeight * 100}%`,
              zIndex: element.zIndex,
              width: `${element.width}%`,
              height: `${element.height}%`,
              fontSize: `${element.fontSize || 1}em`,
              objectFit: 'contain',
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
    <div className="slide" style={{ position: 'relative', width: '100%', height: '100vh', background: backgroundColor }}>
      {slide.elements.map(renderElement)}
    </div>
  );
}

export default SlideRender;

import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

function SlideRender ({ slide, themeColor, parentFontSize }) {
  // Function to render different types of elements based on their type
  const backgroundColor = slide.background || themeColor
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [fontSize, setFontSize] = useState(parentFontSize);

  useEffect(() => {
    // 当窗口大小改变时，更新 windowWidth 的值
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    // 清理 effect
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // 根据窗口宽度计算新的字体大小
    const newFontSize = parentFontSize * windowWidth / 1000;
    setFontSize(newFontSize);
  }, [windowWidth]);
  // const containerWidth = width;
  // const containerHeight = width * 0.75;
  const renderElement = (element) => {
    // console.log('element: ', element.text);
    // console.log('element.position.x: ', element.position.x);
    // console.log('width: ', width);
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
              left: `${element.position.x}%`,
              top: `${element.position.y}%`,
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
              left: `${element.position.x}%`,
              top: `${element.position.y}%`,
              zIndex: element.zIndex,
              width: `${element.width}%`,
              height: `${element.height}%`,
              objectFit: 'contain',
            }}
            autoPlay={element.autoPlay}
            muted
            loop
          />
        );
      case 'code':
        return (
          <SyntaxHighlighter
            key={element.id}
            language={element.language || 'javascript'}
            style={materialLight}
            customStyle={{
              position: 'absolute',
              left: `${element.position.x}%`,
              top: `${element.position.y}%`,
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
      case 'audio':
        return (
          <audio
            key={element.id}
            src={element.url}
            style={{
              position: 'absolute',
              left: `${element.position.x}%`,
              top: `${element.position.y}%`,
              zIndex: element.zIndex,
              width: `${element.width}%`,
              height: `${element.height}%`,
              objectFit: 'contain',
            }}
            autoPlay={element.autoPlay}
            controls
          />
        );

      default:
        return null;
    }
  };
  return (
    <div className="slide" style={{ position: 'relative', width: '100%', height: '100%', background: backgroundColor, fontSize: `${fontSize}px` }}>
      {slide.elements.map(renderElement)}
    </div>
  );
}

export default SlideRender;

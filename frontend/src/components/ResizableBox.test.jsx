import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ResizableBox from './ResizableBox';

const element = {
  id: 1713432841331,
  type: 'text',
  text: '111 New Element for Slide 1',
  fontSize: '5',
  color: '',
  position: {
    x: 5,
    y: 5
  },
  zIndex: 0,
  width: '50',
  height: '50'
};
const containerHeight = 800;
const containerWidth = 1200;
describe('<ResizableBox>', () => {
  it('renders the element with correct initial styles', () => {
    render(
      <ResizableBox
        element={element}
        index={0}
        handleDeleteElement={() => {}}
        handleEditElement={() => {}}
        handleUpdateElement={() => {}}
        containerHeight={containerHeight}
        containerWidth={containerWidth}
      />
    );

    const box = screen.getByText('111 New Element for Slide 1');
    expect(box).toBeInTheDocument();
    const yInPx = (containerHeight * element.position.y) / 100;
    expect(box.parentElement).toHaveStyle(`top: ${yInPx}px`);
    const xInPx = (containerWidth * element.position.x) / 100;
    expect(box.parentElement).toHaveStyle(`left: ${xInPx}px`);
    expect(box.parentElement).toHaveStyle(`width: ${element.width}%`);
    expect(box.parentElement).toHaveStyle(`height: ${element.height}%`);
  });

  it('responds to drag events', () => {
    const handleUpdateElement = jest.fn((id, newProps) => {
      element.position.x = newProps.position.x;
      element.position.y = newProps.position.y;
    });

    render(
      <ResizableBox
        element={element}
        index={0}
        handleDeleteElement={() => {}}
        handleEditElement={() => {}}
        handleUpdateElement={handleUpdateElement}
        containerHeight={containerHeight}
        containerWidth={containerWidth}
      />
    );

    const box = screen.getByText('111 New Element for Slide 1');

    // const expectedNewX = element.position.x + 150;
    // const expectedNewY = element.position.y + 150;

    // Simulate dragging
    fireEvent.mouseDown(box, { clientX: 5, clientY: 5 });
    fireEvent.mouseMove(document, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(document);
    screen.debug()
    expect(handleUpdateElement).toHaveBeenCalledWith(element.id, expect.objectContaining({
      position: {
        x: expect.any(Number),
        y: expect.any(Number)
      }
    }));
  });
});

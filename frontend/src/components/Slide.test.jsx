import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Slide from './Slide';

// Mock data for the slides
const slide = {
  "id": 1713432839854,
  "elements": [
    {
      "id": 1713432841331,
      "type": "text",
      "text": "111 New Element for Slide 1",
      "fontSize": "5",
      "color": "",
      "position": {
        "x": 0,
        "y": 0
      },
      "zIndex": 0,
      "width": "50",
      "height": "50"
    },
    {
      "id": 1713432841332,
      "type": "image",
      "url": "http://example.com/image.png",
      "alt": "Example Image",
      "position": {
        "x": 0,
        "y": 0
      },
      "zIndex": 1,
      "width": "100",
      "height": "100"
    },
  ]
};

const width = 500;
const height = 500;

describe('<Slide>', () => {
  it('renders the text element within the slide', () => {
    render(<Slide slide={slide} dataType='text' width={width} height={height} />);
    expect(screen.getByText('111 New Element for Slide 1')).toBeInTheDocument();
  });

  it('renders the image element within the slide', () => {
    render(<Slide slide={slide} dataType='image' width={width} height={height} />);
    const image = screen.getByAltText('Example Image');
    expect(image).toBeInTheDocument();
  });

  it('renders with correct width and height', () => {
    render(<Slide slide={slide} dataType='image' width={width} height={height} />);
    const image = screen.getByAltText('Example Image');
    expect(image).toBeInTheDocument();
    const computedStyles = window.getComputedStyle(image);
    expect(computedStyles.width).toBe('100%');
    expect(computedStyles.height).toBe('100%');
  });


});

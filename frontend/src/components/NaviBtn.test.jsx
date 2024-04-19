import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import NaviBtn from './NaviBtn';

describe('<NaviBtn>', () => {
  const mockOnClick = jest.fn();

  it('renders the button with the correct children text', () => {
    render(
      <Router>
        <NaviBtn to="/test" onClick={mockOnClick}>
          Go to Test
        </NaviBtn>
      </Router>
    );
    expect(screen.getByRole('button', { name: /go to test/i })).toBeInTheDocument();
  });

  it('calls the onClick handler when clicked', () => {
    render(
      <Router>
        <NaviBtn to="/test" onClick={mockOnClick}>
          Go to Test
        </NaviBtn>
      </Router>
    );
    const button = screen.getByRole('button', { name: /go to test/i });
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('navigates to the correct route when clicked', () => {
    render(
      <Router>
        <NaviBtn to="/test" onClick={mockOnClick}>
          Go to Test
        </NaviBtn>
      </Router>
    );
    const button = screen.getByRole('button', { name: /go to test/i });
    fireEvent.click(button);
  });
});

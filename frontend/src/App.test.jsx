// npm install --save-dev @babel/preset-env @babel/preset-react @babel/plugin-proposal-class-properties
// npm install --save-dev @babel/plugin-proposal-private-property-in-object
// "test": "react-scripts test",
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Register/i); // random letter
  expect(linkElement).toBeInTheDocument();
});

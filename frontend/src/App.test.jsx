// npm install --save-dev @babel/preset-env @babel/preset-react @babel/plugin-proposal-class-properties
// npm install --save-dev @babel/plugin-proposal-private-property-in-object
// npm install --save-dev cypress
// "scripts": {
//   "start": "react-scripts start",
//   "build": "react-scripts build",
//   "test": "react-scripts test",
//   "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
//   "coverage": "npm run test -- --watchAll=false --coverage"
// }
// "scripts": {
//   "start": "react-scripts start",
//   "build": "react-scripts build",
//   "test": "react-scripts test --watchAll=false && npm run cypress:open",
//   "cypress:open": "cypress open",
//   "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
//   "coverage": "react-scripts test --watchAll=false --coverage"
// },
// "test": "react-scripts test --watchAll=false && npm run cypress:run",
// "test": "react-scripts test",
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Register/i); // random letter
  expect(linkElement).toBeInTheDocument();
});

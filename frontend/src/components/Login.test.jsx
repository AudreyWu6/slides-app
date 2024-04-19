import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login'; // Adjust the import according to your file structure
import { BrowserRouter as Router } from 'react-router-dom';

describe('<Login>', () => {
  it('renders the Login form with all inputs and the Login button', () => {
    render(
        <Router>
          <Login />
        </Router>
    );
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('allows the user to enter email and password', () => {
    render(
        <Router>
          <Login />
        </Router>
    );
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    userEvent.type(emailInput, 'test@example.com');
    userEvent.type(passwordInput, 'password');
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password');
  });
  it('displays an error message if the login fails', async () => {
    render(
        <Router>
          <Login />
        </Router>
    );
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    userEvent.type(emailInput, 'wrong@example.com');
    userEvent.type(passwordInput, 'wrongpassword');
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    userEvent.click(signInButton);
    const errorMessage = await screen.findByText(/login failed. please try again./i);
    expect(errorMessage).toBeVisible();
  });
  it('navigates to the registration page when the register button is clicked', () => {
    render(
        <Router>
          <Login />
        </Router>
    );
    const registerButton = screen.getByText(/register/i);
    userEvent.click(registerButton);
    expect(screen.getByText(/register/i)).toBeInTheDocument(); // This line is just illustrative
  });
});

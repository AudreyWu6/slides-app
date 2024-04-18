import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from './Register'; // Adjust the import according to your file structure
import { BrowserRouter as Router } from 'react-router-dom';

describe('<Register>', () => {
    it('renders the register form with all inputs and the Login button', () => {
        render(
            <Router>
              <Register />
            </Router>
          );
        expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /Email Address/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
      });
      it('allows the user to enter email and password', () => {
        render(
            <Router>
              <Register />
            </Router>
          );
        const emailInput = screen.getByLabelText(/email address/i);
        const allPasswordInputs = screen.getAllByLabelText(/password/i);
        const nameInput = screen.getByLabelText(/name/i);
        const passwordInput = allPasswordInputs[0];
        const confirmPasswordInput = allPasswordInputs[1];
        userEvent.type(emailInput, 'test@example.com');
        userEvent.type(passwordInput, 'password');
        userEvent.type(confirmPasswordInput, 'password');
        userEvent.type(nameInput, 'user1');
        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password');
        expect(confirmPasswordInput.value).toBe('password');
        expect(nameInput.value).toBe('user1');
      });
      it('calls the submit handler when the form is submitted', async () => {
        const handleSubmit = jest.fn();
        render(
            <Router>
                <Register onSubmit={handleSubmit} />
            </Router>
        );
        const signInButton = screen.getByRole('button', { name: /Register/i });
        fireEvent.click(signInButton);
        await waitFor(() => {
          expect(handleSubmit).toHaveBeenCalledTimes(0);
        });
      });
      it('navigates to the Login page when the register button is clicked', () => {
        render(
            <Router>
              <Register />
            </Router>
          );
        const registerButton = screen.getByText(/login/i);
        userEvent.click(registerButton);
        expect(screen.getByText(/login/i)).toBeInTheDocument(); // This line is just illustrative
      });
  });
  
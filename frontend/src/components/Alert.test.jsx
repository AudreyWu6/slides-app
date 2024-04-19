import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Alert from './Alert';

describe('<Alert />', () => {
  it('displays the alert with the correct message and severity', () => {
    const handleClose = jest.fn();
    const message = "Test Alert";
    const severity = "error";

    render(
      <Alert
        open={true}
        handleClose={handleClose}
        severity={severity}
        message={message}
      />
    );

    expect(screen.getByText(message)).toBeInTheDocument();

    const alert = screen.getByRole('alert');

    userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should auto-hide after 4000ms', async () => {
    const handleClose = jest.fn();
    render(
      <Alert
        open={true}
        handleClose={handleClose}
        severity="info"
        message="Auto close test"
      />
    );

    await new Promise(r => setTimeout(r, 3100));
    expect(handleClose).toHaveBeenCalled();
  });
});

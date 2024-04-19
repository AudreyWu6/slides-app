import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VersionHistoryBtn from './VersionHistoryBtn';
import { BrowserRouter as Router } from 'react-router-dom';

describe('<VersionHistoryBtn>', () => {
  const versions = [
    {
      "timestamp": "2024-04-19T00:22:33.329Z",
      "slides": [
        {
          "id": 1713486153329,
          "elements": [],
          "background": "linear-gradient(90deg, RGB(70, 150, 150) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)"
        },
        {
          "id": 1713486184639,
          "elements": []
        },
        {
          "id": 1713486424439,
          "elements": []
        }
      ],
      "theme": "rgba(128,128,128, 1)"
    },
    {
        "timestamp": "2024-04-19T00:42:46.501Z",
        "slides": [
          {
            "id": 1713486153329,
            "elements": [],
            "background": "rgb(132, 49, 176)"
          },
          {
            "id": 1713486184639,
            "elements": []
          },
          {
            "id": 1713486424439,
            "elements": []
          }
        ],
        "theme": "rgba(128,128,128, 1)"
      },]

  it('renders the button to show versions', () => {
    render(
      <Router>
        <VersionHistoryBtn versions={versions} onRestoreVersion={() => {}} />
      </Router>
    );
    expect(screen.getByText(/show versions/i)).toBeInTheDocument();
  });
  it('opens and displays the drawer with version entries on button click', () => {
    render(
      <Router>
        <VersionHistoryBtn versions={versions} onRestoreVersion={() => {}} />
      </Router>
    );
    fireEvent.click(screen.getByText(/show versions/i));
    expect(screen.getByText(/version history/i)).toBeInTheDocument();
    expect(screen.getAllByText(/restore/i).length).toBe(versions.length);
  });
  it('calls onRestoreVersion when a restore button is clicked', () => {
    const handleRestore = jest.fn();
    render(
      <Router>
        <VersionHistoryBtn versions={versions} onRestoreVersion={handleRestore} />
      </Router>
    );
    fireEvent.click(screen.getByText(/show versions/i));
    fireEvent.click(screen.getAllByText(/restore/i)[0]);
    expect(handleRestore).toHaveBeenCalledTimes(1);
  });
  it('closes the drawer when the close button is clicked', async () => {
    render(
      <Router>
        <VersionHistoryBtn versions={versions} onRestoreVersion={() => {}} />
      </Router>
    );
    fireEvent.click(screen.getByText(/show versions/i));
    fireEvent.click(screen.getByText(/close/i));
    await expect(screen.queryByText(/version history/i)).not.toBeInTheDocument();
  });
});

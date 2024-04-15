import React, { useState } from 'react';
import { Button } from '@mui/material';
const VersionHistoryBtn = ({ versions, onRestoreVersion }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Show Versions</Button>
      {isOpen && (
        <div style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: 'white', padding: '20px', border: '1px solid black' }}>
          <h4>Version History</h4>
          {versions.map((version, index) => (
            <div key={index}>
              <Button onClick={() => onRestoreVersion(version)}>
                {new Date(version.timestamp).toLocaleString()} - Restore
              </Button>
            </div>
          ))}
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </div>
      )}
    </>
  );
};

export default VersionHistoryBtn;

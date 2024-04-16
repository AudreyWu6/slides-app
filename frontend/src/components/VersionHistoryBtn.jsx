import React, { useState } from 'react';
import { Button, Drawer } from '@mui/material';
const VersionHistoryBtn = ({ versions = [], onRestoreVersion }) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen); // Sets the state of 'open' based on 'newOpen' value
  };
  return (
    <>
      <Button variant="contained" sx={{ ml: 1, width: '205px', marginBottom: '5px' }} onClick={toggleDrawer(true)}>Show Versions</Button>
      {open && (
        <Drawer open={open} onClose={toggleDrawer(false)}>
          <div role="presentation" style={{ top: '20px', left: '20px', backgroundColor: 'white', padding: '20px', border: '1px solid black' }}>
            <h4>Version History</h4>
            {versions.map((version, index) => (
              <div key={index}>
                <Button onClick={() => onRestoreVersion(version)}>
                  {new Date(version.timestamp).toLocaleString()} - Restore
                </Button>
              </div>
            ))}
            <Button onClick={toggleDrawer(false)}>Close</Button>
          </div>
        </Drawer>
      )}
    </>
  );
};

export default VersionHistoryBtn;

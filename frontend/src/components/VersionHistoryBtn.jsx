import React, { useState } from 'react';
import { Button, Drawer } from '@mui/material';
const VersionHistoryBtn = ({ versions = [], onRestoreVersion }) => {
  // const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  console.log('versions: ', versions);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen); // Sets the state of 'open' based on 'newOpen' value
  };
  // const handleClick = () => {
  //   setIsOpen(true);
  //   toggleDrawer(true);
  // };

  return (
    <>
      <Button variant="contained" sx={{ ml: 1 }} onClick={toggleDrawer(true)}>Show Versions</Button>
      {/* <Button variant="contained" sx={{ ml: 1 }} onClick={() => setIsOpen(true)}>Show Versions</Button> */}
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

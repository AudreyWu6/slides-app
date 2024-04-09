import React, { useState } from 'react'
import ColorPicker from 'react-best-gradient-color-picker'
import { Box, Button, Modal } from '@mui/material';

function ColorPick ({ updateBackground, updateTheme }) {
  const [color, setColor] = useState('rgba(255,255,255,1)');
  const handleColorChange = (color) => {
    setColor(color);
  };
  const handleApplyBackground = () => {
    updateBackground(color);
  };
  const handleApplyTheme = () => {
    updateTheme(color);
  };

  return (
    <div>
      <Box sx={{
        background: 'white',
        position: 'absolute',
        top: '200px',
        left: '10px',
        width: 'auto',
        padding: '10px',
      }}>
      <ColorPicker value={color} onChange={handleColorChange}/>
      <button onClick={handleApplyBackground}>Set color for slide</button>
      <button onClick={handleApplyTheme}>Set default color for slides</button>
      </Box>
    </div>
  );
}

export default function ColorBtn ({ updateBackground, updateTheme }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <>
      <Button onClick={handleOpen}>Change Background</Button>
      <Modal open={modalOpen} onClose={handleClose}>
      <ColorPick updateBackground={updateBackground} updateTheme={updateTheme}></ColorPick>
      </Modal>
    </>
  );
}

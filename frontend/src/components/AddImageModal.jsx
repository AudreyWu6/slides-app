import React, { useState } from 'react';
import { Button, Modal, Box, TextField, Typography } from '@mui/material';

function AddImageModal ({ onAddImage }) {
  const [open, setOpen] = useState(false);
  const [imageData, setImageData] = useState({
    url: '',
    alt: '',
    position: { x: 0, y: 0 },
    width: '50%',
    height: '50%',
    zIndex: 0,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = () => {
    onAddImage(imageData);
    handleClose();
  };

  return (
        <>
            <Button onClick={handleOpen}>Add image</Button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ background: 'white', padding: 4 }}>
                    <Typography variant="h6">Add image</Typography>
                    <TextField label="size (%)" onChange={(e) => setImageData({ ...imageData, width: e.target.value, height: e.target.value })} />
                    <TextField
                        fullWidth
                        label="image URL or Base64"
                        onChange={(e) => setImageData({ ...imageData, url: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="description"
                        onChange={(e) => setImageData({ ...imageData, alt: e.target.value })}
                    />
                    <Button onClick={handleSubmit}>创建</Button>
                </Box>
            </Modal>
        </>
  );
}

export default AddImageModal;

import React, { useState } from 'react';
import { Button, Modal, Box, TextField, Typography } from '@mui/material';

function TextModal ({ open, handleClose, update, isEditing = false, initialData = null }) {
  const initialState = {
    text: '',
    fontSize: '',
    color: '',
    position: { x: 0, y: 0 },
    width: '50%',
    height: '50%',
    zIndex: 0,
  };
  const [data, setData] = useState(initialData || initialState);

  const handleSubmit = () => {
    update(data);
    handleClose();
  };

  return (
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ background: 'white', padding: 4 }}>
                    <Typography variant="h6">{isEditing ? 'Edit text' : 'Add text'}</Typography>
                    <TextField
                        label="size (%)"
                        value={data.width}
                        onChange={(e) => setData({ ...data, width: e.target.value, height: e.target.value })}
                    />
                    <TextField
                        label="text"
                        value={data.text}
                        onChange={(e) => setData({ ...data, text: e.target.value })}
                    />
                    <TextField
                        label="font size (em)"
                        value={data.fontSize}
                        onChange={(e) => setData({ ...data, fontSize: e.target.value })}
                    />
                    <TextField
                        label="color (#HEX)"
                        value={data.color}
                        onChange={(e) => setData({ ...data, color: e.target.value })}
                    />
                    <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Create'}</Button>
                </Box>
            </Modal>
  );
}

export default TextModal;

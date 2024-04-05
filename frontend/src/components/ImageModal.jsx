import React, { useEffect, useState } from 'react';
import { Button, Modal, Box, TextField, Typography } from '@mui/material';

function ImageModal ({ open, handleClose, update, isEditing = false, initialData = null }) {
  const initialState = {
    url: '',
    alt: '',
    position: { x: 0, y: 0 },
    width: '50%',
    height: '50%',
    zIndex: 0,
  };
  const [data, setData] = useState(initialState);

  useEffect(() => {
    if (isEditing && initialData) {
      setData(initialData);
    } else {
      setData(initialState);
    }
  }, [isEditing, initialData]);

  const handleSubmit = () => {
    update(data)
    handleClose();
  };

  return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ background: 'white', padding: 4 }}>
                    <Typography variant="h6">Add image</Typography>
                    <TextField label="size (%)" value={data.width} onChange={(e) => setData({ ...data, width: e.target.value, height: e.target.value })} />
                    <TextField
                        fullWidth
                        label="image URL or Base64"
                        value={data.url}
                        onChange={(e) => setData({ ...data, url: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="description"
                        value={data.alt}
                        onChange={(e) => setData({ ...data, alt: e.target.value })}
                    />
                    <Button onClick={handleSubmit}>创建</Button>
                </Box>
            </Modal>
        </>
  );
}

export default ImageModal;

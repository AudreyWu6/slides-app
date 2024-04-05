import React, { useState } from 'react';
import { Button, Modal, Box, TextField, Typography } from '@mui/material';

function AddTextModal ({ onAddText }) {
  const [open, setOpen] = useState(false);
  const [textData, setTextData] = useState({
    text: '',
    fontSize: '',
    color: '',
    position: { x: 0, y: 0 },
    width: '50%',
    height: '50%',
    zIndex: 0,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = () => {
    onAddText(textData); // 将textData传递给父组件以处理文本的添加
    handleClose();
  };

  return (
        <>
            <Button onClick={handleOpen}>Add text</Button>
            <Modal open={open} onClose={handleClose}>
                <Box>
                    <Typography variant="h6">添加文本</Typography>
                    <TextField label="size (%)" onChange={(e) => setTextData({ ...textData, width: e.target.value, height: e.target.value })} />
                    <TextField label="text" onChange={(e) => setTextData({ ...textData, text: e.target.value })} />
                    <TextField label="font size (em)" onChange={(e) => setTextData({ ...textData, fontSize: e.target.value })} />
                    <TextField label="color (#HEX)" onChange={(e) => setTextData({ ...textData, color: e.target.value })} />
                    <Button onClick={handleSubmit}>create</Button>
                </Box>
            </Modal>
        </>
  );
}

export default AddTextModal;

import React, { useState } from 'react';
import { Button, Modal, Box, TextField, Typography, MenuItem, Select } from '@mui/material';

const AddCodeBlockModal = ({ onAddCodeBlock }) => {
  const [open, setOpen] = useState(false);
  const [codeBlockData, setCodeBlockData] = useState({
    code: '',
    language: 'javascript', // Default language
    fontSize: '1', // Default font size in em
    position: { x: 0, y: 0 },
    width: '50%',
    height: '50%',
    zIndex: 0,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = () => {
    onAddCodeBlock(codeBlockData);
    handleClose();
  };

  return (
        <>
            <Button onClick={handleOpen}>Add Code Block</Button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ background: 'white', padding: '20px' }}>
                    <Typography variant="h6">Add Code Block</Typography>
                    <Select
                        fullWidth
                        value={codeBlockData.language}
                        onChange={(e) => setCodeBlockData({ ...codeBlockData, language: e.target.value })}
                        displayEmpty
                    >
                        <MenuItem value="javascript">JavaScript</MenuItem>
                        <MenuItem value="python">Python</MenuItem>
                        <MenuItem value="c">C</MenuItem>
                    </Select>
                    <TextField
                        fullWidth
                        label="Font Size (em)"
                        value={codeBlockData.fontSize}
                        onChange={(e) => setCodeBlockData({ ...codeBlockData, fontSize: e.target.value })}
                    />
                    <TextField label="size (%)" onChange={(e) => setCodeBlockData({ ...codeBlockData, width: e.target.value, height: e.target.value })} />
                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        label="Code"
                        value={codeBlockData.code}
                        onChange={(e) => setCodeBlockData({ ...codeBlockData, code: e.target.value })}
                    />
                    <Button onClick={handleSubmit}>Create</Button>
                </Box>
            </Modal>
        </>
  );
};

export default AddCodeBlockModal;

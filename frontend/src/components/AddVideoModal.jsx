import React, { useState } from 'react';
import { Button, Modal, Box, TextField, Typography, Switch, FormControlLabel } from '@mui/material';

function AddVideoModal ({ onAddVideo }) {
  const [open, setOpen] = useState(false);
  const [videoData, setVideoData] = useState({
    url: '',
    autoPlay: false,
    position: { x: 0, y: 0 },
    width: '50%',
    height: '50%',
    zIndex: 0,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = () => {
    onAddVideo(videoData);
    handleClose();
  };

  return (
        <>
            <Button onClick={handleOpen}>Add video</Button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ background: 'white', padding: 4 }}>
                    <Typography variant="h6">Add video</Typography>
                    <TextField
                        fullWidth
                        label="video URL"
                        onChange={(e) => setVideoData({ ...videoData, url: e.target.value })}
                    />
                    <TextField label="size (%)" onChange={(e) => setVideoData({ ...videoData, width: e.target.value, height: e.target.value })} />
                    <FormControlLabel
                        control={<Switch checked={videoData.autoPlay} onChange={(e) => setVideoData({ ...videoData, autoPlay: e.target.checked })} />}
                        label="autoPlay"
                    />
                    <Button onClick={handleSubmit}>Create</Button>
                </Box>
            </Modal>
        </>
  );
}

export default AddVideoModal;

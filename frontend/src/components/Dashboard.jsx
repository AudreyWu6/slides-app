import React, { useState } from 'react';
import { Button, Modal, Box, TextField, CardMedia, Typography, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePresentations } from './PresentationContext'; // Adjust the import path as needed
import NaviBtn from './NaviBtn';
import SlideEditor from './SlideEditor';

function Dashboard () {
  const navigate = useNavigate();
  const { presentations, addPresentation } = usePresentations(); // Assuming addPresentation is a function provided by your context to add a new presentation
  const [open, setOpen] = useState(false);
  const [newPresentation, setNewPresentation] = useState({
    name: '',
    description: '',
    thumbnail: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewPresentation({ name: '', description: '', thumbnail: '' }); // Reset form on close
  };

  const createPresentation = () => {
    addPresentation({
      ...newPresentation,
      slides: [{ id: 1, content: '' }], // Default single empty slide
      thumbnail: newPresentation.thumbnail || '', // Use default if no thumbnail is specified
    });
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPresentation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Navigate to login or perform additional cleanup
    navigate('/login');
  };

  return (
    <div>
      <Typography variant="h4" style={{ display: 'flex', justifyContent: 'space-between' }} gutterBottom>
        Dashboard
        <div style={{ display: 'inline-flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <NaviBtn to="/login" onClick={handleLogout}>Logout</NaviBtn>
        </div>
      </Typography>
      <Button variant="contained" onClick={handleOpen}>
        New Presentation
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">Create a New Presentation</Typography>
          <TextField autoFocus margin="dense" name="name" label="Presentation Name" type="text" fullWidth variant="outlined" value={newPresentation.name} onChange={handleChange} />
          <TextField margin="dense" name="description" label="Description" type="text" fullWidth multiline variant="outlined" value={newPresentation.description} onChange={handleChange} />
          <TextField margin="dense" name="thumbnail" label="Thumbnail URL" type="text" fullWidth variant="outlined" value={newPresentation.thumbnail} onChange={handleChange} helperText="Leave blank for a default thumbnail." />
          <Button onClick={createPresentation} color="primary" variant="contained" sx={{ mt: 2 }}>Create</Button>
        </Box>
      </Modal>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {presentations.map((presentation) => (
          <Grid item key={presentation.id} xs={12} sm={6} md={4} lg={3} sx={{ minWidth: 100, maxWidth: 300 }} onClick={() => navigate(`/edit-presentation/${presentation.id}`)} style={{ cursor: 'pointer' }}>
            <Card sx={{ aspectRatio: '2 / 1' }} >
              { presentation.thumbnail ? (<CardMedia component="img" height="50" image={ presentation.thumbnail } alt="Thumbnail"/>) : (<Box sx={{ height: 50, bgcolor: 'grey.300' }} />)}
              <CardContent>
                <Typography variant="h5">{presentation.name}</Typography>
                {presentation.description && <Typography variant="body2">{presentation.description}</Typography>}
                <Typography variant="body1">Slides: {presentation.slides.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Dashboard;

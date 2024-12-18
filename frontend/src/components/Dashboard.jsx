import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, TextField, CardMedia, Typography, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePresentations } from './PresentationContext'; // Adjust the import path as needed
import NaviBtn from './NaviBtnDash';
import { apiRequestStore } from './apiStore';

const fetchPresentations = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await apiRequestStore('/store', token, 'GET', null);
    const presentations = response || [];
    return presentations;
  } catch (error) {
    console.error('Fetching presentations failed:', error);
    return [];
  }
};

const putToServer = async (pres) => {
  try {
    const token = localStorage.getItem('token');
    const body = { store: pres };
    await apiRequestStore('/store', token, 'PUT', body);
  } catch (error) {
    console.error('Fetching presentation failed:', error.message);
  }
};

// following function is to generate dashboard page:
function Dashboard () {
  const navigate = useNavigate();
  const { presentations, addPresentation, setAllPresentations, resetState } = usePresentations(); // Assuming addPresentation is a function provided by context to add a new presentation
  const [open, setOpen] = useState(false);
  const [newPresentation, setNewPresentation] = useState({
    name: '',
    description: '',
    thumbnail: '',
    // id: null,
  });

  useEffect(() => {
    const loadPresentations = async () => {
      const fetchedPresentations = await fetchPresentations();
      const presentationsData = Array.isArray(fetchedPresentations.store) ? fetchedPresentations.store : [];
      if (presentationsData) {
        setAllPresentations(presentationsData);
      } else {
        setAllPresentations([]);
      }
    };
    loadPresentations();
  }, []);

  useEffect(() => {
    const updateServer = async () => {
      if (presentations.length > 0) {
        try {
          await putToServer(presentations);
        } catch (error) {
          console.error('Failed to update presentations on the server:', error);
        }
      }
    };
    updateServer();
  }, [presentations]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewPresentation({ name: '', description: '', thumbnail: '' }); // Reset form on close
  };

  const createPresentation = () => {
    const timestamp = new Date().toISOString();
    const initialSlides = [{ id: Date.now(), elements: [] }];
    const initialVersion = {
      timestamp,
      slides: initialSlides,
    };
    const newPres = {
      ...newPresentation,
      id: Date.now(),
      versions: [initialVersion],
      thumbnail: newPresentation.thumbnail || '',
    };
    addPresentation(newPres);
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
    resetState();
    localStorage.removeItem('token');
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
          <TextField id = "name" autoFocus margin="dense" autoComplete="on" name="name" label="Presentation Name" type="text" fullWidth variant="outlined" value={newPresentation.name} onChange={handleChange} />
          <TextField id = "description" margin="dense" autoComplete="on" name="description" label="Description" type="text" fullWidth variant="outlined" value={newPresentation.description} onChange={handleChange} />
          <TextField id = "thumbnail" margin="dense" name="thumbnail" label="Thumbnail URL" type="text" fullWidth variant="outlined" value={newPresentation.thumbnail} onChange={handleChange} helperText="Leave blank for a default thumbnail." />
          <Button onClick={createPresentation} type="submit" color="primary" variant="contained" sx={{ mt: 2 }}>Create</Button>
        </Box>
      </Modal>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {presentations.map((presentation) => (
          <Grid item key={presentation.id} xs={12} sm={6} md={4} lg={3} sx={{ minWidth: 100, maxWidth: 300 }} onClick={() => navigate(`/edit-presentation/${presentation.id}/slide/1`)} style={{ cursor: 'pointer' }}>
            <Card sx={{ aspectRatio: '2 / 1' }} >
              { presentation.thumbnail ? (<CardMedia component="img" height="50" image={ presentation.thumbnail } alt="Thumbnail"/>) : (<Box sx={{ height: 50, bgcolor: 'grey.300' }} />)}
              <CardContent>
                <Typography variant="h5">{presentation.name}</Typography>
                {presentation.description && <Typography variant="body2">{presentation.description}</Typography>}
                <Typography variant="body1">Slides: {presentation.versions[presentation.versions.length - 1].slides.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Dashboard;

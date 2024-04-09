// components/EditPresentation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Modal, TextField, Typography, Dialog, DialogActions, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { usePresentations } from '../components/PresentationContext';
import SlideEditor from './SlideEditor';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const EditPresentation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { presentations, updatePresentation, deletePresentation } = usePresentations();
  const presentationIndex = presentations.findIndex(p => p.id === parseInt(id));
  const presentation = presentations[presentationIndex];

  const [editTitleOpen, setEditTitleOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [title, setTitle] = useState(presentation?.name || '');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (!presentation) {
      navigate('/dashboard'); // Redirect if the presentation is not found
    }
  }, [presentation, navigate]);

  const handleUpdateTitle = () => {
    const updatedPresentation = { ...presentation, title };
    updatePresentation(updatedPresentation);
    setEditTitleOpen(false);
  };

  const handleUpdateTheme = (color) => {
    const updatedPresentation = { ...presentation, theme: color };
    updatePresentation(updatedPresentation);
  };

  const handleAddSlide = () => {
    const newSlide = { id: Date.now(), elements: [] };
    const updatedPresentation = {
      ...presentation,
      slides: [...presentation.slides, newSlide]
    };
    updatePresentation(updatedPresentation);
  };

  const handleUpdateSlide = (passedSlide) => {
    console.log('handleSlideUpdate', passedSlide);
    const updatedSlides = presentation.slides.map(slide => {
      if (slide.id === passedSlide.id) {
        return passedSlide; // 将新内容合并到旧幻灯片对象中
      }
      return slide; // 对于未匹配的幻灯片，保持原样
    });
    const updatedPresentation = {
      ...presentation,
      slides: updatedSlides
    };
    updatePresentation(updatedPresentation);
  };

  const handleDeleteThisPresentation = () => {
    deletePresentation(presentation.id);
    setDeleteConfirmOpen(false);
    navigate('/dashboard');
  };

  const handleDeleteSlide = () => {
    if (presentation.slides.length === 1) {
      alert('Cannot delete the only slide. Please delete the entire presentation if needed.');
      return;
    }
    const updatedSlides = presentation.slides.filter((_, index) => index !== currentSlideIndex);
    const updatedPresentation = { ...presentation, slides: updatedSlides };
    updatePresentation(updatedPresentation);
    setCurrentSlideIndex(prevIndex => prevIndex > 0 ? prevIndex - 1 : 0);
  };

  const handlePreviousSlide = () => setCurrentSlideIndex(prevIndex => prevIndex - 1);
  const handleNextSlide = () => setCurrentSlideIndex(prevIndex => prevIndex + 1);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' && currentSlideIndex > 0) {
        handlePreviousSlide();
      } else if (event.key === 'ArrowRight' && currentSlideIndex < presentation.slides.length - 1) {
        handleNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, presentation?.slides.length]);

  if (!presentation) return <Typography>Loading...</Typography>;
  useEffect(() => {
    console.log('The current slide index is: ', currentSlideIndex);
  }, [currentSlideIndex]);

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" size="small" onClick={() => navigate('/dashboard')}>Back</Button>
        <Button onClick={() => setDeleteConfirmOpen(true)} size="small" variant="contained" color="error" startIcon={<DeleteIcon />}>Delete Presentation</Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
          {title}
          <IconButton
            sx={{ display: 'inline-block' }}
            onClick={() => setEditTitleOpen(true)}><EditIcon />
          </IconButton>
        </Typography>
      </Box>
      <Modal open={editTitleOpen} onClose={() => setEditTitleOpen(false)}>
        <Box sx={modalStyle}>
          <TextField fullWidth value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          <Button onClick={handleUpdateTitle} color="primary" variant="contained" sx={{ mt: 2 }}>Update</Button>
        </Box>
      </Modal>
      <Button onClick={handleAddSlide} size="small" variant="contained" sx={{ mt: 2 }}>Add New Slide</Button>
      <Button onClick={handleDeleteSlide} size="small" variant="contained" color="error" sx={{ mt: 2, ml: 2 }} startIcon={<DeleteIcon />}>Delete Slide
</Button>
      <Typography sx={{ mt: 2 }}>Slide {currentSlideIndex + 1}</Typography>
      <SlideEditor slide={presentation.slides[currentSlideIndex]} handleUpdateSlide={handleUpdateSlide} handleUpdateTheme={handleUpdateTheme} themeColor={presentation.theme}></SlideEditor>
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Are you sure you want to delete this presentation?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>No</Button>
          <Button onClick={handleDeleteThisPresentation} color="primary">Yes</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <div style={{ fontSize: '1em' }}>{ currentSlideIndex + 1 }</div>
        {presentation.slides.length >= 1 && <Button onClick={handleDeleteSlide} size="small" sx={{ ml: 2 }} variant="outlined" startIcon={<DeleteIcon />}>Delete</Button>}
        <div>
          {currentSlideIndex >= 1 && <IconButton onClick={handlePreviousSlide}><ArrowBackIcon /></IconButton>}
          {currentSlideIndex < presentation.slides.length - 1 && <IconButton onClick={handleNextSlide}><ArrowForwardIcon /></IconButton>}
        </div>
      </Box>
    </Box>
  );
};

export default EditPresentation;

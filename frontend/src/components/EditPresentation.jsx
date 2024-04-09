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
import { apiRequestStore } from './apiStore';
import SlideTransitionWrapper from './SlideTransitionWrapper';

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

const fetchPresentations = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await apiRequestStore('/store', token, 'GET', null);
    const presentations = response || [];
    console.log('presentationsData recieved from server: ', presentations);
    return presentations; // Ensure this is always an array
  } catch (error) {
    console.error('Fetching presentations failed:', error);
    return [];
  }
};

const putToServer = async (pres) => {
  try {
    const token = localStorage.getItem('token');
    const body = { store: pres };
    console.log('the body that given to server', body);
    const data = await apiRequestStore('/store', token, 'PUT', body);
    console.log('the response from server: ', data);
  } catch (error) {
    console.error('PUT presentation failed:', error.message);
  }
};

const EditPresentation = () => {
  const { id, slideNumber } = useParams();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();
  const { presentations, updatePresentation, deletePresentation } = usePresentations();
  const [editTitleOpen, setEditTitleOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [title, setTitle] = useState(selectedPresentation?.name || '');
  console.log('presentations', presentations);

  useEffect(() => {
    const index = parseInt(slideNumber, 10) - 1; // Convert slideNumber from string to integer and adjust for zero-based indexing
    setCurrentSlideIndex(index);
  }, [slideNumber]);

  const updateSlideInUrl = (index) => {
    const slideNumberForUrl = index + 1;
    navigate(`/edit-presentation/${id}/slide/${slideNumberForUrl}`, { replace: true });
  };

  useEffect(() => {
    const loadSlides = async () => {
      const fetchedPresentations = await fetchPresentations();
      const presentationsArray = fetchedPresentations.store.store;
      const presentationById = presentationsArray[id - 1];
      updatePresentation(presentationById);
      console.log('presentationById **** check', presentationById);
      setSelectedPresentation(presentationById);
      if (presentationById && presentationById.slides.length > currentSlideIndex) {
        const slideByIndex = presentationById.slides[currentSlideIndex];
        console.log('Found slide:', slideByIndex);
      } else {
        console.log('Slide or presentation not found');
        navigate('/dashboard');
      }
    };
    loadSlides();
  }, [id]);

  const previewPresentation = () => {
    const slideNumberForUrl = currentSlideIndex + 1;
    navigate(`/preview-presentation/${id}/slide/${slideNumberForUrl}`);
  };

  useEffect(() => {
    const updateServer = async () => {
      if (presentations.length > 0) {
        try {
          await putToServer(presentations);
          console.log('the body beforeput to server: ', presentations);
        } catch (error) {
          console.error('Failed to update presentations on the server:', error);
        }
      }
    };
    updateServer();
  }, [presentations]);

  const handleUpdateTitle = () => {
    const updatedPresentation = { ...selectedPresentation, name: title };
    updatePresentation(updatedPresentation);
    setEditTitleOpen(false);
    setSelectedPresentation(updatedPresentation); // Update the local state to reflect the change immediately
  };

  const handleReorderClick = () => {
    navigate(`/reorder-slides/${selectedPresentation.id}`);
  };

  const handleUpdateSlide = (passedSlide) => {
    console.log('handleSlideUpdate', passedSlide);
    const updatedSlides = selectedPresentation.slides.map(slide => {
      if (slide.id === passedSlide.id) {
        return passedSlide; // 将新内容合并到旧幻灯片对象中
      }
      return slide; // 对于未匹配的幻灯片，保持原样
    });
    const updatedPresentation = {
      ...selectedPresentation,
      slides: updatedSlides
    };
    updatePresentation(updatedPresentation);
    setSelectedPresentation(updatedPresentation);
  };

  const handleAddSlide = () => {
    const newSlide = { id: Date.now(), elements: [] };
    const updatedSlides = [...selectedPresentation.slides, newSlide];
    const updatedPresentation = {
      ...selectedPresentation,
      slides: updatedSlides
    };
    updatePresentation(updatedPresentation);
    setSelectedPresentation(updatedPresentation);
  };

  const handleDeleteSlide = () => {
    if (selectedPresentation.slides.length === 1) {
      alert('Cannot delete the only slide. Please delete the entire presentation if needed.');
      return;
    }
    const updatedSlides = selectedPresentation.slides.filter((_, index) => index !== currentSlideIndex);
    const updatedPresentation = { ...selectedPresentation, slides: updatedSlides };
    updatePresentation(updatedPresentation);
    setCurrentSlideIndex(prevIndex => prevIndex > 0 ? prevIndex - 1 : 0);
    setSelectedPresentation(updatedPresentation);
  };

  const handlePreviousSlide = () => {
    setCurrentSlideIndex(prevIndex => {
      const newIndex = (prevIndex - 1 + selectedPresentation.slides.length) % selectedPresentation.slides.length;
      updateSlideInUrl(newIndex);
      return newIndex;
    });
  };
  const handleNextSlide = () => {
    setCurrentSlideIndex(prevIndex => {
      const newIndex = (prevIndex + 1) % selectedPresentation.slides.length;
      updateSlideInUrl(newIndex);
      return newIndex;
    });
  };

  const handleBackClick = async () => {
    try {
      await putToServer(presentations);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  const handleDeleteThisPresentation = async () => {
    await deletePresentation(selectedPresentation.id);
    try {
      // await putToServer(presentations);
      setDeleteConfirmOpen(false);
      console.log('presentations: ', presentations);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
    // setDeleteConfirmOpen(false);
    // // setSelectedPresentation(null);
    // navigate('/dashboard');
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' && currentSlideIndex > 0) {
        handlePreviousSlide();
      } else if (event.key === 'ArrowRight' && currentSlideIndex < selectedPresentation.slides.length - 1) {
        handleNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, selectedPresentation?.slides.length]);

  if (!selectedPresentation) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" size="small" onClick={handleBackClick}>Back</Button>
        <div>
          <Button onClick={previewPresentation}>Preview</Button>
          <Button onClick={handleReorderClick}>Reorder Slides</Button>
          <Button onClick={() => setDeleteConfirmOpen(true)} size="small" variant="contained" color="error" startIcon={<DeleteIcon />}>Delete Presentation</Button>
        </div>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
          {selectedPresentation.name}
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
      <Button onClick={handleDeleteSlide} size="small" variant="contained" color="error" sx={{ mt: 2, ml: 2 }} startIcon={<DeleteIcon />}>Delete Slide</Button>
      <Typography sx={{ mt: 2 }}>Slide {currentSlideIndex + 1}</Typography>
      {selectedPresentation && selectedPresentation.slides.length > 0 && currentSlideIndex < selectedPresentation.slides.length && (
        <SlideTransitionWrapper keyProp={selectedPresentation.slides[currentSlideIndex].id}>
          <SlideEditor slide={selectedPresentation.slides[currentSlideIndex]} handleUpdateSlide={handleUpdateSlide} />
        </SlideTransitionWrapper>
      )}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Are you sure you want to delete this presentation?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>No</Button>
          <Button onClick={handleDeleteThisPresentation} color="primary">Yes</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <div style={{ fontSize: '1em' }}>{ currentSlideIndex + 1 }</div>
        {selectedPresentation.slides.length >= 1 && <Button onClick={handleDeleteSlide} size="small" sx={{ ml: 2 }} variant="outlined" startIcon={<DeleteIcon />}>Delete</Button>}
        <div>
          {currentSlideIndex >= 1 && <IconButton onClick={handlePreviousSlide}><ArrowBackIcon /></IconButton>}
          {currentSlideIndex < selectedPresentation.slides.length - 1 && <IconButton onClick={handleNextSlide}><ArrowForwardIcon /></IconButton>}
        </div>
      </Box>
      </Box>
  );
};

export default EditPresentation;

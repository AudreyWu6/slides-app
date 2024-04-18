// components/EditPresentation.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Dialog, DialogActions, DialogTitle, IconButton, Modal, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // npm install react-syntax-highlighter --save
// npm install react-router-dom
// npm install @mui/material @emotion/react @emotion/styled
// npm install @mui/icons-material
// npm install react-router-dom react-beautiful-dnd
// npm install react-best-gradient-color-picker 这是现在要下载的
// npm install react-syntax-highlighter --save
// npm install --save-dev babel-jest @babel/core @babel/preset-env @babel/preset-react
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { usePresentations } from './PresentationContext';
import SlideEditor from './SlideEditor';
import { apiRequestStore } from './apiStore';
import NaviBtn from './NaviBtnDash';
import VersionHistoryBtn from './VersionHistoryBtn';

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
    return presentations; // Ensure this is always an array
  } catch (error) {
    return [];
  }
};

const putToServer = async (pres) => {
  try {
    const token = localStorage.getItem('token');
    const body = { store: pres };
    await apiRequestStore('/store', token, 'PUT', body);
  } catch (error) {
    console.error('PUT presentation failed:', error.message);
  }
};

const EditPresentation = () => {
  const { id, slideNumber } = useParams();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();
  const { presentations, updatePresentation, deletePresentation, resetState } = usePresentations();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState('null');
  const [currentSlides, setCurrentSlides] = useState([]);
  const [currentTheme, setCurrentTheme] = useState('');
  const [title, setTitle] = useState(selectedPresentation?.name || '');
  const [deleteSignal, setDeleteSignal] = useState(false);
  const [currentVersionTimestamp, setCurrentVersionTimestamp] = useState(null);
  const [thumbnail, setThumbnail] = useState(selectedPresentation.thumbnail || '');

  useEffect(() => {
    let timeoutId = null;
    const updateTimestamp = () => {
      const newTimestamp = new Date().toISOString();
      setCurrentVersionTimestamp(newTimestamp); // 更新时间戳，标记新的版本
      console.log('saveat', newTimestamp);
      const updatedPresentation = NewVersionToPresentation(
        selectedPresentation,
        currentSlides,
        currentTheme,
        newTimestamp
      );
      updatePresentation(updatedPresentation);
      setSelectedPresentation(updatedPresentation);
    };

    timeoutId = setTimeout(updateTimestamp, 60000);

    // 清理函数
    return () => {
      clearTimeout(timeoutId);
    };
  }, [selectedPresentation, currentSlides, currentTheme, updatePresentation, setCurrentVersionTimestamp]);

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
      try {
        const fetchedPresentations = await fetchPresentations();
        const presentationsArray = fetchedPresentations.store;
        const presentationById = presentationsArray.find(p => p.id === parseInt(id, 10));

        if (presentationById) {
          const latestVersion = presentationById.versions[presentationById.versions.length - 1];
          console.log('latestVersion', latestVersion);
          setCurrentSlides(latestVersion.slides); // 设置当前版本的幻灯片信息
          setCurrentVersionTimestamp(latestVersion.timestamp); // 设置最新版本的时间戳
          if (latestVersion.theme) {
            setCurrentTheme(latestVersion.theme);
          }
          setSelectedPresentation(presentationById); // 设置完整的演示文稿信息
          setTitle(presentationById.name); // 设置演示文稿标题
          setThumbnail(presentationById.thumbnail);
        } else {
          console.error('Presentation not found');
        }
      } catch (error) {
        console.error('Failed to fetch presentations:', error);
      }
    };
    loadSlides();
  }, [id, fetchPresentations]);

  const previewPresentation = () => {
    const slideNumberForUrl = currentSlideIndex + 1;
    navigate(`/preview-presentation/${id}/slide/${slideNumberForUrl}`);
  };

  useEffect(() => {
    const updateServer = async () => {
      try {
        await putToServer(presentations);
        console.log('the body before put to server: ', presentations);
      } catch (error) {
        console.error('Failed to update presentations on the server:', error);
      }
      if (deleteSignal) {
        navigate('/dashboard');
      }
    };
    if (presentations && presentations.length > 0 && selectedPresentation !== null) {
      updateServer();
    } else if (presentations && presentations.length === 0 && deleteSignal) {
      updateServer();
    }
  }, [presentations, deleteSignal,]);

  const handleRestoreVersion = (version) => {
    setCurrentSlides(version.slides);
    setCurrentTheme(version.theme)
    const updatedPresentation = NewVersionToPresentation(selectedPresentation, version.slides, version.theme, '');
    updatePresentation(updatedPresentation);
    setSelectedPresentation(updatedPresentation);
  };

  const handleUpdateTitleThumbnail = () => {
    const updatedPresentation = { ...selectedPresentation, name: title, thumbnail };
    updatePresentation(updatedPresentation);
    setModalOpen(false);
    setSelectedPresentation(updatedPresentation); // Update the local state to reflect the change immediately
  };

  const handleUpdateTheme = (color) => {
    setCurrentTheme(color);
    const updatedPresentation = NewVersionToPresentation(selectedPresentation, currentSlides, color, currentVersionTimestamp);
    updatePresentation(updatedPresentation);
    setSelectedPresentation(updatedPresentation);
  };

  const handleReorderClick = () => {
    navigate(`/reorder-slides/${selectedPresentation.id}`);
  };

  const NewVersionToPresentation = (presentation, slides, theme, givenTimestamp) => {
    let newVersion;
    let existingVersion;

    // Check if a given timestamp is provided and find that version to update
    if (givenTimestamp) {
      existingVersion = presentation.versions.find(version => version.timestamp === givenTimestamp);
      if (existingVersion) {
        // If there's a matching version, update it
        newVersion = { ...existingVersion, slides, theme };
      } else {
        // No version matches the given timestamp, create a new version
        newVersion = {
          timestamp: new Date().toISOString(), // New unique timestamp
          slides,
          theme
        };
      }
    } else {
      // If no timestamp is given, create a new version
      const newTimestamp = new Date().toISOString();
      setCurrentVersionTimestamp(newTimestamp); // 更新时间戳，标记新的版本
      newVersion = {
        timestamp: newTimestamp, // New unique timestamp
        slides,
        theme
      };
    }

    // Construct the updated versions array
    const newVersions = existingVersion
      ? presentation.versions.map(version => version.timestamp === givenTimestamp ? newVersion : version)
      : [...presentation.versions, newVersion]; // Add as a new version if not updating an existing one

    return {
      id: presentation.id, // Maintain the same presentation ID
      name: presentation.name, // Maintain the same presentation name
      versions: newVersions // Updated versions list
    };
  };

  const updateSlide = (passedSlide) => {
    console.log('handleSlideUpdate', passedSlide);
    return currentSlides.map(slide => {
      if (slide.id === passedSlide.id) {
        return passedSlide;
      }
      return slide;
    });
  };

  const handleUpdateSlide = (passedSlide) => {
    const updatedSlides = updateSlide(passedSlide); // 获取更新后的幻灯片
    setCurrentSlides(updatedSlides); // 更新当前版本的幻灯片状态
    const updatedPresentation = NewVersionToPresentation(selectedPresentation, updatedSlides, currentTheme, currentVersionTimestamp);
    updatePresentation(updatedPresentation); // 更新全局状态
    setSelectedPresentation(updatedPresentation); // 更新本地状态以反映更改
  };

  const handleAddSlide = () => {
    const newSlide = { id: Date.now(), elements: [] };
    const updatedSlides = [...currentSlides, newSlide];
    setCurrentSlides(updatedSlides);
    const updatedPresentation = NewVersionToPresentation(selectedPresentation, updatedSlides, currentTheme, currentVersionTimestamp);
    updatePresentation(updatedPresentation);
    setSelectedPresentation(updatedPresentation);
  };

  const handleDeleteSlide = () => {
    if (currentSlides.length === 1) {
      alert('Cannot delete the only slide. Please delete the entire presentation if needed.');
      return;
    }
    const updatedSlides = currentSlides.filter((_, index) => index !== currentSlideIndex);
    setCurrentSlides(updatedSlides);
    const updatedPresentation = NewVersionToPresentation(selectedPresentation, updatedSlides, currentTheme, currentVersionTimestamp);
    updatePresentation(updatedPresentation);
    setSelectedPresentation(updatedPresentation);
    setCurrentSlideIndex(prevIndex => prevIndex > 0 ? prevIndex - 1 : 0);
  };

  const handlePreviousSlide = () => {
    setCurrentSlideIndex(prevIndex => {
      const newIndex = (prevIndex - 1 + currentSlides.length) % currentSlides.length;
      updateSlideInUrl(newIndex); // Ensure this function also expects the current index setup
      // setTransitionTrigger(true);
      return newIndex;
    });
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex(prevIndex => {
      const newIndex = (prevIndex + 1) % currentSlides.length;
      updateSlideInUrl(newIndex); // Ensure this function also expects the current index setup
      // setTransitionTrigger(true);
      return newIndex;
    });
  };

  const handleBackClick = async () => {
    try {
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  const handleDeleteThisPresentation = async () => {
    try {
      await deletePresentation(selectedPresentation.id);
      setDeleteSignal(prev => !prev); // Toggle to trigger the useEffect
      setDeleteConfirmOpen(false);
      console.log('presentations afetr delete presentation: ', presentations);
    } catch (error) {
      console.error('Failed to delete presentation:', error);
    }
  };
  const handleLogout = () => {
    resetState();
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' && currentSlideIndex > 0) {
        handlePreviousSlide();
      } else if (event.key === 'ArrowRight' && currentSlideIndex < currentSlides.length - 1) {
        handleNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, currentSlides.length]);

  if (!selectedPresentation) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" size="small" onClick={handleBackClick}>Back</Button>
        <div>
          <Button onClick={previewPresentation} variant="contained" sx={{ ml: 1, width: '205px', marginBottom: '5px' }}>Preview</Button>
          <Button onClick={handleReorderClick} variant="contained" sx={{ ml: 1, width: '205px', marginBottom: '5px' }}>Reorder Slides</Button>
          <Button data-cy="delete-presentation-button" onClick={() => setDeleteConfirmOpen(true)} variant="contained" color="error" sx={{ ml: 1, width: '205px', marginBottom: '5px' }}>Delete Presentation</Button>
          <VersionHistoryBtn versions={selectedPresentation.versions} onRestoreVersion={handleRestoreVersion}/>
          <NaviBtn to="/login" onClick={handleLogout}>Logout</NaviBtn>
        </div>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
          {selectedPresentation.name}
          <IconButton
            sx={{ display: 'inline-block' }}
            onClick={() => setModalOpen(true)}
            data-cy="edit-icon-button"><EditIcon />
          </IconButton>
        </Typography>
      </Box>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} data-cy="modal-element">
        <Box sx={modalStyle}>
          <TextField data-cy="modal-title-input" id="updateTitle" label="Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          <TextField data-cy="modal-thumbnail-input" id="updateThumbnail" label="Thumbnail URL" type="text" fullWidth margin="dense" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)}/>
          {thumbnail && <img src={thumbnail} alt="Thumbnail Preview" style={{ maxWidth: '100%', marginTop: 10 }} />}
          <Button data-cy="modal-save-btn" onClick={handleUpdateTitleThumbnail} color="primary" variant="contained" sx={{ mt: 2 }}>Update</Button>
        </Box>
      </Modal>
      <Button data-cy="add-new-slide-button" onClick={handleAddSlide} size="small" variant="contained" sx={{ mt: 2 }}>Add New Slide</Button>
      <Button onClick={handleDeleteSlide} size="small" variant="contained" color="error" sx={{ mt: 2, ml: 2 }} startIcon={<DeleteIcon />}>Delete Slide</Button>
      <Typography sx={{ mt: 2, display: 'flex', justifyContent: 'center', fontWeight: 700 }}>Slide {currentSlideIndex + 1}</Typography>
      {selectedPresentation && currentSlides.length > 0 && currentSlideIndex < currentSlides.length && (
        <SlideEditor slide={currentSlides[currentSlideIndex]} handleUpdateSlide={handleUpdateSlide} handleUpdateTheme={handleUpdateTheme} themeColor={currentTheme}/>
      )}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Are you sure you want to delete this presentation?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>No</Button>
          <Button data-cy="confirm-delete-button" onClick={handleDeleteThisPresentation} color="primary">Yes</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <div style={{ fontSize: '1em' }}>{currentSlideIndex + 1}</div>
        {currentSlides.length >= 1 &&
          <Button onClick={handleDeleteSlide} size="small" sx={{ ml: 2 }} variant="outlined"
                  startIcon={<DeleteIcon/>}>Delete</Button>}
          <div>
            {currentSlideIndex >= 1 && <IconButton data-cy="previous-slide-button" onClick={handlePreviousSlide}><ArrowBackIcon/></IconButton>}
            {currentSlideIndex < currentSlides.length - 1 && <IconButton data-cy="next-slide-button" onClick={handleNextSlide}><ArrowForwardIcon/></IconButton>}
          </div>
      </Box>
    </Box>
  );
};

export default EditPresentation;

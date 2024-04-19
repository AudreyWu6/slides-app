import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button } from '@mui/material';
// import { apiRequestStore } from './apiStore';
import SlideRender from './SlideRender';
import SlideTransitionWrapper from './SlideTransitionWrapper';
import NaviBtn from './NaviBtnDash';
import { usePresentations } from './PresentationContext';

// const fetchPresentations = async () => {
//   try {
//     const token = localStorage.getItem('token');
//     const response = await apiRequestStore('/store', token, 'GET', null);
//     const presentations = response || [];
//     // console.log('presentationsData recieved from server: ', presentations);
//     return presentations; // Ensure this is always an array
//   } catch (error) {
//     console.error('Fetching presentations failed:', error);
//     return [];
//   }
// };

const PreviewPresentation = () => {
  const { id, slideNumber } = useParams();
  const navigate = useNavigate();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const { presentations, resetState } = usePresentations();
  const [lastKey, setlastKey] = useState(0);
  // const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const index = parseInt(slideNumber, 10) - 1; // Convert slideNumber from string to integer and adjust for zero-based indexing
    setCurrentSlideIndex(index);
  }, [slideNumber]);

  useEffect(() => {
    const updateServer = async () => {
      if (presentations.length > 0) {
        try {
          console.log('presentations: ', presentations);
          const presentationById = presentations.find(p => p.id === parseInt(id));
          setSelectedPresentation(presentationById);
          const versionKeys = Object.keys(presentationById.versions);
          setlastKey(versionKeys[versionKeys.length - 1]);
        } catch (error) {
          console.error('Failed to update presentations on the server:', error);
        }
      } else {
        console.log('presentations in context:', presentations)
      }
    };
    updateServer();
  }, [presentations]);

  // useEffect(() => {
  //   const loadSlides = async () => {
  //     const fetchedPresentations = await fetchPresentations();
  //     const presentationsArray = fetchedPresentations.store;
  //     const presentationById = presentationsArray.find(p => p.id === parseInt(id));
  //     console.log('presentationById version', presentationById.versions);
  //     setSelectedPresentation(presentationById);
  //     const versionKeys = Object.keys(presentationById.versions);
  //     setlastKey(versionKeys[versionKeys.length - 1]);
  //     // console.log('preview', lastKey);
  //   };
  //   loadSlides();
  // }, [id, currentSlideIndex]);

  const updateSlideInUrl = (index) => {
    const slideNumberForUrl = index + 1;
    navigate(`/preview-presentation/${id}/slide/${slideNumberForUrl}`, { replace: true });
  };

  const goToPreviousSlide = () => {
    setCurrentSlideIndex(prevIndex => {
      const newIndex = (prevIndex - 1 + selectedPresentation.versions[lastKey].slides.length) % selectedPresentation.versions[lastKey].slides.length;
      updateSlideInUrl(newIndex);
      return newIndex;
    });
  };
  const goToNextSlide = () => {
    setCurrentSlideIndex(prevIndex => {
      const newIndex = (prevIndex + 1) % selectedPresentation.versions[lastKey].slides.length;
      console.log('in nexr slide: ', lastKey);
      updateSlideInUrl(newIndex);
      return newIndex;
    });
  };

  const goToEditPresentation = () => {
    navigate(`/edit-presentation/${selectedPresentation.id}/slide/1`);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' && currentSlideIndex > 0) {
        goToPreviousSlide();
      } else if (event.key === 'ArrowRight' && currentSlideIndex < selectedPresentation.versions[lastKey].slides.length - 1) {
        goToNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, selectedPresentation?.versions[lastKey].slides.length]);

  const handleLogout = () => {
    resetState();
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!selectedPresentation) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <NaviBtn to="/login" onClick={handleLogout}>Logout</NaviBtn>
      </div>
        <h3 style={{ textAlign: 'center' }}>Title: {selectedPresentation.name} slide {currentSlideIndex + 1}</h3>
        {selectedPresentation && (<SlideTransitionWrapper keyProp={selectedPresentation.versions[lastKey].slides[currentSlideIndex].id}>
          {selectedPresentation && (
            <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
              <SlideRender slide={selectedPresentation.versions[lastKey].slides[currentSlideIndex]} themeColor={selectedPresentation.versions[lastKey].theme} parentFontSize='16'/>
            </div>
          )}
        </SlideTransitionWrapper>)}
        <Button onClick={goToEditPresentation} variant='outlined' style={{ position: 'absolute', top: 0, left: 10 }}>
          Go Back to Edit
        </Button>
        {currentSlideIndex >= 1 && <ArrowBackIcon
          data-cy="previous-slide-button-preview"
          onClick={goToPreviousSlide}
          style={{
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '48px',
            cursor: 'pointer',
          }}
        />}
        {currentSlideIndex < selectedPresentation.versions[lastKey].slides.length - 1 && <ArrowForwardIcon
          data-cy="next-slide-button-preview"
          onClick={goToNextSlide}
          style={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '48px',
            cursor: 'pointer',
          }}
        />}
      </div>
    </div>
  );
};

export default PreviewPresentation;

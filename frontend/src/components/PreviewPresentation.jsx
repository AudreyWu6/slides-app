import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button } from '@mui/material';
import { apiRequestStore } from './apiStore';
import SlideRender from './SlideRender';
import SlideTransitionWrapper from './SlideTransitionWrapper';
import NaviBtn from './NaviBtnDash';
import { usePresentations } from './PresentationContext';

const fetchPresentations = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await apiRequestStore('/store', token, 'GET', null);
    const presentations = response || [];
    // console.log('presentationsData recieved from server: ', presentations);
    return presentations; // Ensure this is always an array
  } catch (error) {
    console.error('Fetching presentations failed:', error);
    return [];
  }
};

const PreviewPresentation = () => {
  const { id, slideNumber } = useParams();
  const navigate = useNavigate();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const { resetState } = usePresentations();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const index = parseInt(slideNumber, 10) - 1; // Convert slideNumber from string to integer and adjust for zero-based indexing
    setCurrentSlideIndex(index);
  }, [slideNumber]);

  useEffect(() => {
    const loadSlides = async () => {
      const fetchedPresentations = await fetchPresentations();
      const presentationsArray = fetchedPresentations.store;
      const presentationById = presentationsArray.find(p => p.id === parseInt(id));
      console.log('presentationById', presentationById);
      setSelectedPresentation(presentationById);
      if (presentationById && presentationById.slides.length > currentSlideIndex) {
        const slideByIndex = presentationById.slides[currentSlideIndex];
        console.log('Found slide:', slideByIndex);
      } else {
        console.log('Slide or presentation not found');
        navigate(`/edit-presentation/${id}/slide/1`);
      }
    };
    loadSlides();
  }, [id, currentSlideIndex]);

  const updateSlideInUrl = (index) => {
    const slideNumberForUrl = index + 1;
    navigate(`/preview-presentation/${id}/slide/${slideNumberForUrl}`, { replace: true });
  };

  useEffect(() => {
    // Handler to call on window resize
    function handleResize () {
      // Set window width to the innerWidth of the browser window
      setWindowWidth(window.innerWidth);
    }
    // Add event listener
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const goToPreviousSlide = () => {
    setCurrentSlideIndex(prevIndex => {
      const newIndex = (prevIndex - 1 + selectedPresentation.slides.length) % selectedPresentation.slides.length;
      updateSlideInUrl(newIndex);
      return newIndex;
    });
  };
  const goToNextSlide = () => {
    setCurrentSlideIndex(prevIndex => {
      const newIndex = (prevIndex + 1) % selectedPresentation.slides.length;
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
      } else if (event.key === 'ArrowRight' && currentSlideIndex < selectedPresentation.slides.length - 1) {
        goToNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, selectedPresentation?.slides.length]);

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
        <SlideTransitionWrapper keyProp={selectedPresentation.slides[currentSlideIndex].id}>
          {selectedPresentation && (
            <SlideRender slide={selectedPresentation.slides[currentSlideIndex]} themeColor={selectedPresentation.theme} width={windowWidth}/>
          )}
        </SlideTransitionWrapper>
        <Button onClick={goToEditPresentation} variant='outlined' style={{ position: 'absolute', top: 10, left: 10 }}>
          Go Back to Edit
        </Button>
        {currentSlideIndex >= 1 && <ArrowBackIcon
          onClick={goToPreviousSlide}
          style={{
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '48px',
            cursor: 'pointer',
            // visibility: currentSlideIndex > 0 ? 'visible' : 'hidden',
          }}
        />}
        {currentSlideIndex < selectedPresentation.slides.length - 1 && <ArrowForwardIcon
          onClick={goToNextSlide}
          style={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '48px',
            cursor: 'pointer',
            // visibility: currentSlideIndex < selectedPresentation.slides.length - 1 ? 'visible' : 'hidden',
          }}
        />}
      </div>
    </div>
  );
};

export default PreviewPresentation;

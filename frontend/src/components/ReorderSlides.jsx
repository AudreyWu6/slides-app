import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card } from '@mui/material';
import { usePresentations } from '../components/PresentationContext';
import { apiRequestStore } from './apiStore';
import NaviBtn from './NaviBtnDash';
import SlideRender from './SlideRender';

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
    await apiRequestStore('/store', token, 'PUT', body);
  } catch (error) {
    console.error('PUT presentation failed:', error.message);
  }
};

const ReorderSlides = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { presentations, reorderSlides, resetState } = usePresentations();
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [slides, setSlides] = useState([]);
  let lastKey = 0;

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(slides);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSlides(items);
    if (selectedPresentation) {
      reorderSlides(selectedPresentation.id, items);
    }
  };

  useEffect(() => {
    const loadSlides = async () => {
      const fetchedPresentations = await fetchPresentations();
      const presentationsArray = fetchedPresentations.store;
      const presentationById = presentationsArray.find(p => p.id === parseInt(id));
      setSelectedPresentation(presentationById);
      const versionKeys = Object.keys(presentationById.versions);
      lastKey = versionKeys[versionKeys.length - 1];
      console.log('presentationById: ', presentationById);
    };
    loadSlides();
  }, [id]);

  useEffect(() => {
    if (selectedPresentation) {
      setSlides(selectedPresentation.versions[lastKey].slides);
    }
  }, [selectedPresentation]);

  useEffect(() => {
    const updateServer = async () => {
      if (presentations.length > 0) {
        try {
          const presentationtemp = presentations.find(p => p.id === parseInt(id));
          console.log('presentationtemp before: ', presentationtemp);
          const newVersion = {
            timestamp: new Date().toISOString(), // New unique timestamp
            slides: presentationtemp.slides,
            theme: selectedPresentation.versions[lastKey].theme,
          };
          // versions: [...selectedPresentation.versions, newVersion]
          console.log('presentationtemp after change: ', newVersion);
          await putToServer(presentations);
          console.log('the body beforeput to server: ', presentations);
        } catch (error) {
          console.error('Failed to update presentations on the server:', error);
        }
      }
    };
    updateServer();
  }, [presentations]);

  const handleLogout = () => {
    resetState();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginRight: '15px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <NaviBtn to="/login" onClick={handleLogout}>Logout</NaviBtn>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <DragDropContext onDragEnd={onDragEnd} >
        <Droppable droppableId='droppable-slides' direction="horizontal">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              justifyContent: 'flex-start',
              gap: '8px',
              width: '100%',
              overflowX: 'auto',
              paddingBottom: '10px',
            }}
            >
              {slides.map((slide, index) => (
                <Draggable key={slide.id} draggableId={`slide-${slide.id}`} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        ...provided.draggableProps.style,
                        userSelect: 'none',
                        minHeight: '150px',
                        minWidth: '200px',
                        maxHeight: '225px',
                        maxWidth: '300px',
                        width: '100%',
                        height: 'auto',
                        margin: '0 0 8px 0',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        border: '1px solid lightgrey',
                        marginRight: '10px',
                        alignItems: 'flex-start',
                      }}
                    >
                      Slide {index + 1}:
                      <SlideRender slide={slide} themeColor={selectedPresentation.theme}/>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div>
        <Button onClick={() => navigate(`/edit-presentation/${id}/slide/1`)} style={{ marginTop: '10px' }}>Close</Button>
      </div>
    </div>
    </div>
  );
};

export default ReorderSlides;

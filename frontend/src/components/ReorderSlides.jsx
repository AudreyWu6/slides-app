import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card } from '@mui/material';
import { usePresentations } from '../components/PresentationContext';
import { apiRequestStore } from './apiStore';
import NaviBtn from './NaviBtn';

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
    };
    loadSlides();
  }, [id]);

  useEffect(() => {
    if (selectedPresentation) {
      setSlides(selectedPresentation.slides);
    }
  }, [selectedPresentation]);

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', }}>
      <DragDropContext onDragEnd={onDragEnd}>
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
                        minHeight: '100px',
                        minWidth: '200px',
                        maxHeight: '150px',
                        maxWidth: '300px',
                        width: '100%',
                        height: 'auto',
                        padding: '10px',
                        margin: '0 0 8px 0',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        border: '1px solid lightgrey',
                        marginRight: '10px',
                        alignItems: 'center',
                      }}
                    >
                      Slide {index + 1}:
                      {slide.elements && slide.elements.map((element, elementIndex) => {
                        // Render based on element type
                        switch (element.type) {
                          case 'text':
                            return (
                              <p key={element.id}>
                                {/* Text {elementIndex + 1}:  */}
                                {element.text}
                              </p>
                            );
                          case 'image':
                            return (
                              <img
                                key={element.id}
                                src={element.url}
                                alt={`Image ${elementIndex + 1}`}
                                style={{ width: element.width, height: element.height }}
                              />
                            );
                          case 'video':
                            return (
                              <video
                                key={element.id}
                                src={element.url}
                                style={{ width: element.width, height: element.height }}
                                controls
                              />
                            );
                          case 'code':
                            return (
                              <pre key={element.id}>
                                <code>
                                  {/* Code {elementIndex + 1}:  */}
                                  {element.text}
                                </code>
                              </pre>
                            );
                          default:
                            return null;
                        }
                      })}

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
        <Button onClick={() => navigate(`/edit-presentation/${id}/slide/1`)} style={{ marginTop: '20px' }}>Close</Button>
      </div>
    </div>
    </div>
  );
};

export default ReorderSlides;

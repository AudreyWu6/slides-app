import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card } from '@mui/material';
import { usePresentations } from '../components/PresentationContext';
import { apiRequestStore } from './apiStore';

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
    // updatePresentation(updatedPresentation);
    // putToServer(presentations.map(p => p.id === parseInt(id) ? updatedPresentation : p));
  } catch (error) {
    console.error('PUT presentation failed:', error.message);
  }
};

const ReorderSlides = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { presentations, reorderSlides } = usePresentations();
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

  const handleClose = async () => {
    if (selectedPresentation) {
      try {
        await putToServer([selectedPresentation]);
        navigate(`/edit-presentation/${id}/slide/1`);
        // console.log('id and selectedPresentation.id', id, selectedPresentation.id);
        // navigate(`/edit-presentation/${selectedPresentation.id}/slide/1`);
      } catch (error) {
        console.error('Failed to update server:', error);
      }
    } else {
      navigate(`/edit-presentation/${id}/slide/1`);
    }
  };

  useEffect(() => {
    const loadSlides = async () => {
      const fetchedPresentations = await fetchPresentations();
      const presentationsArray = fetchedPresentations.store;
      const presentationById = presentationsArray[id - 1];
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable-slides' direction="horizontal">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-around', // Evenly spaces the cards within the line and handles spacing between wrapped lines
              gap: '16px', // Adds space between the cards
              width: '100%',
            }}>
              {slides.map((slide, index) => (
                <Draggable key={slide.id} draggableId={`slide-${slide.id}`} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        ...provided.draggableProps.style,
                        backgroundColor: snapshot.isDragging ? 'lightgreen' : 'white',
                        userSelect: 'none',
                        minWidth: '50px',
                        minHeight: '150px',
                        maxWidth: '300px',
                        width: '100%', // This ensures that the card takes up the space it needs, respecting min and max width
                        height: 'auto', // Adjust based on content
                        padding: '10px',
                        margin: '0 0 8px 0',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        border: '1px solid lightgrey',
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
                            return null; // Handle unknown element type
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
      <Button onClick={handleClose} style={{ marginTop: '20px' }}>Close</Button>
    </div>
  );
};

export default ReorderSlides;

// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Button, Card } from '@mui/material';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { usePresentations } from '../components/PresentationContext';
// import { apiRequestStore } from './apiStore';

// // Assume apiRequestStore and other utility functions are defined elsewhere

// const ReorderSlides = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { presentations, updatePresentation, reorderSlides } = usePresentations();
//   const [currentPresentation, setCurrentPresentation] = useState();

//   useEffect(() => {
//     // Find the current presentation based on ID
//     const presentation = presentations.find(p => p.id === parseInt(id));
//     setCurrentPresentation(presentation);
//   }, [id, presentations]);

//   const onDragEnd = (result) => {
//     if (!result.destination) return;

//     const items = Array.from(currentPresentation.slides);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);

//     // Update the local state
//     const updatedPresentation = { ...currentPresentation, slides: items };
//     setCurrentPresentation(updatedPresentation);

//     // Update the global context
//     updatePresentation(updatedPresentation);

//     // Update the server
//     putToServer(presentations.map(p => p.id === parseInt(id) ? updatedPresentation : p));
//   };

//   const handleClose = () => {
//     navigate(`/edit-presentation/${id}/slide/1`);
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       <DragDropContext onDragEnd={onDragEnd}>
//         <Droppable droppableId='droppable-slides' direction="horizontal">
//           Droppable and Draggable components go here
//           {(provided) => (
//             <div {...provided.droppableProps} ref={provided.innerRef}
//             style={{
//               display: 'flex',
//               flexWrap: 'wrap',
//               justifyContent: 'space-around', // Evenly spaces the cards within the line and handles spacing between wrapped lines
//               gap: '16px', // Adds space between the cards
//               width: '100%',
//             }}>
//               {slides.map((slide, index) => (
//                 <Draggable key={slide.id} draggableId={`slide-${slide.id}`} index={index}>
//                   {(provided) => (
//                     <Card
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                       sx={{
//                         ...provided.draggableProps.style,
//                         userSelect: 'none',
//                         minWidth: '100px',
//                         minHeight: '200px',
//                         maxWidth: '300px',
//                         width: '100%', // This ensures that the card takes up the space it needs, respecting min and max width
//                         height: 'auto', // Adjust based on content
//                         padding: '10px',
//                         margin: '0 0 8px 0',
//                         backgroundColor: '#fff',
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         borderColor: '#ccc',
//                         borderWidth: '1px',
//                         borderStyle: 'solid',
//                       }}
//                     >
//                       Slide {index + 1}:
//                       {slide.elements && slide.elements.map((element, elementIndex) => {
//                         // Render based on element type
//                         switch (element.type) {
//                           case 'text':
//                             return (
//                               <p key={element.id}>
//                                 {/* Text {elementIndex + 1}:  */}
//                                 {element.text}
//                               </p>
//                             );
//                           case 'image':
//                             return (
//                               <img
//                                 key={element.id}
//                                 src={element.url}
//                                 alt={`Image ${elementIndex + 1}`}
//                                 style={{ width: element.width, height: element.height }}
//                               />
//                             );
//                           case 'video':
//                             return (
//                               <video
//                                 key={element.id}
//                                 src={element.url}
//                                 style={{ width: element.width, height: element.height }}
//                                 controls
//                               />
//                             );
//                           case 'code':
//                             return (
//                               <pre key={element.id}>
//                                 <code>
//                                   {/* Code {elementIndex + 1}:  */}
//                                   {element.text}
//                                 </code>
//                               </pre>
//                             );
//                           default:
//                             return null; // Handle unknown element type
//                         }
//                       })}

//                     </Card>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </DragDropContext>
//       <Button onClick={handleClose} style={{ marginTop: '20px' }}>Close</Button>
//     </div>
//   );
// };

// export default ReorderSlides;

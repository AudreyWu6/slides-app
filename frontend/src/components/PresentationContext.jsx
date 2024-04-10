import React, { createContext, useContext, useState } from 'react';

const PresentationContext = createContext();

export const usePresentations = () => useContext(PresentationContext);

export const PresentationProvider = ({ children }) => {
  const [presentations, setPresentations] = useState([]);

  const addPresentation = (presentation) => {
    setPresentations((prev) => [...prev, { ...presentation, id: prev.length + 1 }]);
  };

  // {presentations.map((presentation) => (
  //   <PresentationComponent key={presentation.id} {...presentation} />
  // ))}

  const updatePresentation = (updatedPresentation) => {
    // setPresentations((prev) =>
    //   prev.map((presentation) => presentation.id === updatedPresentation.id ? updatedPresentation : presentation)
    // );
    setPresentations((prev = []) =>
      prev.map((presentation) => presentation.id === updatedPresentation?.id ? updatedPresentation : presentation)
    );
  };

  // const deletePresentation = (id) => {
  //   setPresentations((prev) => prev.filter((presentation) => presentation.id !== id));
  // };
  const deletePresentation = (id) => {
    setPresentations((prev) => {
      // Find the index of the presentation to delete
      const indexToDelete = prev.findIndex(presentation => presentation.id === id);
      // Filter out the presentation to delete
      const filtered = prev.filter((presentation, index) => index !== indexToDelete);
      // Decrease the ID of presentations that come after the deleted one, if needed
      if (indexToDelete !== -1) {
        return filtered.map((presentation, index) => {
          if (index >= indexToDelete) {
            return { ...presentation, id: presentation.id - 1 };
          }
          return presentation;
        });
      }
      return filtered;
    });
  };

  // New function to reorder slides within a presentation
  const reorderSlides = (presentationId, newSlidesOrder) => {
    setPresentations((prevPresentations) =>
      prevPresentations.map((presentation) => {
        if (presentation.id === parseInt(presentationId, 10)) {
          return { ...presentation, slides: newSlidesOrder };
        }
        return presentation;
      })
    );
  };

  const setAllPresentations = (newPresentations) => {
    setPresentations(newPresentations);
  };

  const resetState = () => {
    setPresentations([]);
  };

  return (
    <PresentationContext.Provider value={{ presentations, addPresentation, updatePresentation, deletePresentation, reorderSlides, setAllPresentations, resetState, }}>
      {children}
    </PresentationContext.Provider>
  );
};

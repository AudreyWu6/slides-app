import React, { createContext, useContext, useState } from 'react';

const PresentationContext = createContext();

export const usePresentations = () => useContext(PresentationContext);

export const PresentationProvider = ({ children }) => {
  const [presentations, setPresentations] = useState([]);

  const addPresentation = (presentation) => {
    console.log('add', presentation);
    setPresentations((prev) => [...prev, { ...presentation, id: prev.length + 1 }]);
  };

  const updatePresentation = (updatedPresentation) => {
    // setPresentations((prev) =>
    //   prev.map((presentation) => presentation.id === updatedPresentation.id ? updatedPresentation : presentation)
    // );
    setPresentations((prev = []) =>
      prev.map((presentation) => presentation.id === updatedPresentation?.id ? updatedPresentation : presentation)
    );
  };

  const deletePresentation = (id) => {
    setPresentations((prev) => {
      // Find the index of the presentation to delete
      const indexToDelete = prev.findIndex(presentation => presentation.id === id);
      // Filter out the presentation to delete
      const filtered = prev.filter((presentation, index) => index !== indexToDelete);
      // Check if there are any presentations left
      if (filtered.length === 0) {
        return []; // Return an empty array if no presentations are left
      }
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

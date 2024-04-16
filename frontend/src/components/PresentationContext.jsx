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
    setPresentations((prev = []) =>
      prev.map((presentation) => presentation.id === updatedPresentation?.id ? updatedPresentation : presentation)
    );
  };

  const deletePresentation = (id) => {
    setPresentations((prev) => {
      const indexToDelete = prev.findIndex(presentation => presentation.id === id);
      const filtered = prev.filter((presentation, index) => index !== indexToDelete);
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

  const reorderSlides = (presentationId, newSlidesOrder) => {
    const newVersionTimestamp = new Date().toISOString(); // Generate new timestamp
    setPresentations(prevPresentations =>
      prevPresentations.map(presentation => {
        if (presentation.id === parseInt(presentationId, 10)) {
          const newVersion = {
            timestamp: newVersionTimestamp,
            slides: newSlidesOrder,
            theme: presentation.versions[presentation.versions.length - 1]?.theme || 'Default' // Copy theme from last version or default
          };
          return { ...presentation, versions: [...presentation.versions, newVersion] };
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

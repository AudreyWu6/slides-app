import React, { createContext, useContext, useState } from 'react';

const PresentationContext = createContext();

export const usePresentations = () => useContext(PresentationContext);

export const PresentationProvider = ({ children }) => {
  const [presentations, setPresentations] = useState([]);

  const addPresentation = (presentation) => {
    setPresentations((prev) => [...prev, { ...presentation, id: prev.length + 1 }]);
  };

  const updatePresentation = (updatedPresentation) => {
    setPresentations((prev) =>
      prev.map((presentation) => presentation.id === updatedPresentation.id ? updatedPresentation : presentation)
    );
  };

  const deletePresentation = (id) => {
    setPresentations((prev) => prev.filter((presentation) => presentation.id !== id));
  };

  return (
    <PresentationContext.Provider value={{ presentations, addPresentation, updatePresentation, deletePresentation }}>
      {children}
    </PresentationContext.Provider>
  );
};

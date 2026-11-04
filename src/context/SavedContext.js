import React, { createContext, useContext, useState } from 'react';

// Remembers which items the user has bookmarked, for every screen.
// For now it lives in memory (lost when the app closes).
// In Stage 3 it will be stored in Firestore instead.
const SavedContext = createContext({
  savedIds: [],
  isSaved: () => false,
  toggleSave: () => {},
});

export function SavedProvider({ children }) {
  const [savedIds, setSavedIds] = useState([]);

  const isSaved = (id) => savedIds.includes(id);

  const toggleSave = (id) => {
    setSavedIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    );
  };

  return (
    <SavedContext.Provider value={{ savedIds, isSaved, toggleSave }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  return useContext(SavedContext);
}

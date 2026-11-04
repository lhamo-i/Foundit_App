import React, { createContext, useContext, useState } from 'react';
import { SAMPLE_USER } from '../data/sampleClaims';

// Who is using the app, and are they campus staff?
// SAMPLE ONLY: in Stage 3 the user comes from Firebase and staff roles are
// assigned by an admin (never chosen by the user).
const SessionContext = createContext({
  user: SAMPLE_USER,
  isStaff: false,
  setIsStaff: () => {},
});

export function SessionProvider({ children }) {
  const [isStaff, setIsStaff] = useState(false);
  return (
    <SessionContext.Provider value={{ user: SAMPLE_USER, isStaff, setIsStaff }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

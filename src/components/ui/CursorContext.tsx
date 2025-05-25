"use client";
import React, { createContext, useState, useCallback } from "react";

// Cursor types
export type CursorType = "normal" | "pointinghand" | "openhand" | "closedhand";

// Context shape
interface CursorContextProps {
  cursorType: CursorType;
  setCursorType: (type: CursorType) => void;
}

// Default context
export const CursorContext = createContext<CursorContextProps>({
  cursorType: "normal",
  setCursorType: () => {},
});

// Provider component
export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cursorType, setCursorTypeState] = useState<CursorType>("normal");

  // Memoized setter to avoid unnecessary re-renders
  const setCursorType = useCallback((type: CursorType) => {
    setCursorTypeState(type);
  }, []);

  return (
    <CursorContext.Provider value={{ cursorType, setCursorType }}>
      {children}
    </CursorContext.Provider>
  );
};

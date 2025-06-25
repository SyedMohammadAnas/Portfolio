'use client'
import React, { useState } from 'react';
import { LockScreenContext } from './LockScreen';

// LockScreenProvider wraps the app and provides lock state context
const LockScreenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locked, setLocked] = useState(true);
  return (
    <LockScreenContext.Provider value={{ locked, setLocked }}>
      {children}
    </LockScreenContext.Provider>
  );
};

export default LockScreenProvider;

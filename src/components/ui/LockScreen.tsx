'use client'
// This component uses React hooks and must be a client component in Next.js App Router.
import React, { useEffect, useState, useContext } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';

// Define the context type for lock state
export interface LockScreenContextType {
  locked: boolean;
  setLocked: (locked: boolean) => void;
}

// Create context for lock state with correct type
export const LockScreenContext = React.createContext<LockScreenContextType>({
  locked: true,
  setLocked: () => {},
});

// LockScreen component props (if needed in future)

// Helper function to format date
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

// Helper function to format time in 24-hour format
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const DRAG_THRESHOLD = -20; // Pixels to drag up before unlocking

const LockScreen: React.FC = () => {
  // State for date and time
  const [now, setNow] = useState(new Date());
  // Use context for lock state
  const { locked, setLocked } = useContext(LockScreenContext);
  // Framer Motion controls for animation
  const controls = useAnimation();

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Handler for drag end
  const handleDragEnd = (_event: unknown, info: { point: { y: number } }) => {
    // If dragged up past threshold, unlock
    if (info.point.y < DRAG_THRESHOLD) {
      controls.start({
        y: '-100%',
        opacity: 0,
        transition: { duration: 0.5, ease: 'easeInOut' },
      });
      setTimeout(() => setLocked(false), 500);
    } else {
      // Snap back if not enough drag
      controls.start({ y: 0, transition: { type: 'spring', stiffness: 300 } });
    }
  };

  // If unlocked, render nothing (show main page)
  if (!locked) return null;

  return (
    // Fullscreen overlay with glass effect
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-xl bg-white/10 bg-opacity-60 select-none"
      initial={{ y: 0, opacity: 1 }}
      animate={controls}
      style={{ touchAction: 'none' }}
    >
      {/* Date at the top */}
      <div className="absolute top-12 w-full flex flex-col items-center">
        {/* Date with Roboto Mono font */}
        <span className="text-lg md:text-2xl text-white drop-shadow-sm mt-15 font-mono">
          {formatDate(now)}
        </span>
        {/* Time with Roboto Mono font */}
        <span className="text-5xl md:text-9xl font-bold text-white drop-shadow-lg mt-2 font-mono">
          {formatTime(now)}
        </span>
      </div>

      {/* Centered profile picture */}
      <div className="flex flex-col items-center justify-center  -mb-140 mt-32 md:mt-40">
        <div className="w-28 h-28 md:w-25 md:h-25 rounded-full overflow-hidden border-4 border-white/100 shadow-lg mb-4">
          <Image
            src="/profilePicture.png"
            alt="Profile Picture"
            width={144}
            height={144}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        {/* Name */}
        <span className="text-2xl md:text-xl font-medium text-white drop-shadow-md">
          Syed Mohammad Anas
        </span>
      </div>

      {/* Draggable handle at the bottom - only this is draggable */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-6 flex flex-col items-center cursor-grab"
        drag="y"
        dragConstraints={{ top: DRAG_THRESHOLD/100, bottom: 0 }}
        dragElastic={0.08}
        onDragEnd={handleDragEnd}
        style={{ touchAction: 'none' }}
      >
        {/* Visual handle bar */}
        <div className="w-24 h-2 rounded-full bg-white/100 mb-2" />
        <span className="text-xs font-bold text-white/100">Drag up</span>
      </motion.div>
    </motion.div>
  );
};

export default LockScreen;

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursor } from "./useCursor";

interface MacWindowModalProps {
  isOpen: boolean; // Controls visibility
  onClose: () => void; // Close handler for all three dots
  title: string; // Title displayed in the centered title bar
  width?: number; // Optional width in px (defaults to 620)
  height?: number; // Optional height in px (defaults to 360)
  initialPosition?: { x: number; y: number }; // Optional position for stacking
  customZIndex?: number; // Optional custom z-index for modal stacking
  children: React.ReactNode; // Modal body content
}

// Lightweight MacOS-like window modal with draggable behavior and title bar
const MacWindowModal: React.FC<MacWindowModalProps> = ({
  isOpen,
  onClose,
  title,
  width = 620,
  height = 360,
  initialPosition,
  customZIndex,
  children,
}) => {
  const setCursorType = useCursor(); // Custom cursor handler
  const containerRef = useRef<HTMLDivElement>(null); // For drag constraints
  const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });

  // Compute clamped initial position within viewport bounds
  const getInitialPosition = (): { x: number; y: number } => {
    const defaultX = (typeof window !== 'undefined') ? (window.innerWidth - width) / 2 : 0;
    const defaultY = (typeof window !== 'undefined') ? (window.innerHeight - height) / 2 : 0;
    if (!initialPosition) return { x: defaultX, y: defaultY };
    if (typeof window === 'undefined') return initialPosition;
    return {
      x: Math.max(0, Math.min(initialPosition.x, window.innerWidth - width)),
      y: Math.max(0, Math.min(initialPosition.y, window.innerHeight - height))
    };
  };

  // Update drag constraints when opened and on resize
  useEffect(() => {
    function updateConstraints() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setConstraints({
          left: -rect.left,
          top: -rect.top,
          right: (typeof window !== 'undefined') ? window.innerWidth - rect.right : 0,
          bottom: (typeof window !== 'undefined') ? window.innerHeight - rect.bottom : 0,
        });
      }
    }
    if (isOpen) {
      updateConstraints();
      window.addEventListener('resize', updateConstraints);
      return () => window.removeEventListener('resize', updateConstraints);
    }
  }, [isOpen]);

  // Prevent background scrolling while any modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Window container (no backdrop overlay) */}
          <motion.div
            className="absolute bg-white rounded-xl flex flex-col overflow-hidden pointer-events-auto"
            style={{
              width,
              height,
              left: getInitialPosition().x,
              top: getInitialPosition().y,
              zIndex: customZIndex || 121,
              boxShadow: "0 20px 60px 0 rgba(0, 0, 0, 0.4), 0 10px 30px 0 rgba(0, 0, 0, 0.3), 0 5px 15px 0 rgba(0, 0, 0, 0.2)"
            }}
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            drag
            dragConstraints={constraints}
            dragMomentum={false}
            ref={containerRef}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setCursorType("openhand")}
            onMouseLeave={() => setCursorType("normal")}
            onDragStart={() => setCursorType("closedhand")}
            onDragEnd={() => setCursorType("openhand")}
          >
            {/* Title bar with traffic-light buttons */}
            <div className="flex items-center h-8 px-4 border-b border-gray-200 bg-gray-50 relative select-none w-full">
              <div className="flex items-center gap-2">
                <button
                  aria-label="Close"
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/10 shadow hover:scale-110 transition-transform p-1 -m-1"
                  onMouseEnter={() => setCursorType("pointinghand")}
                  onMouseLeave={() => setCursorType("normal")}
                />
                <button
                  aria-label="Minimize"
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10 shadow hover:scale-110 transition-transform p-1 -m-1"
                  onMouseEnter={() => setCursorType("pointinghand")}
                  onMouseLeave={() => setCursorType("normal")}
                />
                <button
                  aria-label="Maximize"
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10 shadow hover:scale-110 transition-transform p-1 -m-1"
                  onMouseEnter={() => setCursorType("pointinghand")}
                  onMouseLeave={() => setCursorType("normal")}
                />
              </div>
              <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
                <span className="text-sm text-gray-700 font-semibold tracking-tight">{title}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 w-full h-full overflow-auto bg-transparent">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MacWindowModal;

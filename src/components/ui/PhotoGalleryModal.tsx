import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCursor } from "./useCursor"; // Import custom cursor hook

// Placeholder images (Unsplash or similar)
const IMAGES = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80",
];

interface PhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Optional custom initial position for the modal
  initialPosition?: { x: number; y: number };
}

/**
 * PhotoGalleryModal - MacOS-style modal with 3D coverflow slider
 * - MacOS window controls and centered title
 * - 3D coverflow slider using Framer Motion
 * - Closes on window controls or outside click
 */
const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({ isOpen, onClose, initialPosition }) => {
  // Current index in the slider
  const [current, setCurrent] = useState(2);
  const setCursorType = useCursor(); // Get cursor setter
  // State to track if carousel is being dragged
  const [isDragging, setIsDragging] = useState(false);

  // Calculate initial position for the modal
  const getInitialPosition = (): { x: number; y: number } => {
    const modalWidth = 700; // Modal width in pixels
    const modalHeight = 420; // Modal height in pixels

    if (initialPosition) {
      // Use custom position if provided
      return {
        x: Math.max(0, Math.min(initialPosition.x, window.innerWidth - modalWidth)),
        y: Math.max(0, Math.min(initialPosition.y, window.innerHeight - modalHeight))
      };
    }

    // Default to center position
    return {
      x: (window.innerWidth - modalWidth) / 2,
      y: (window.innerHeight - modalHeight) / 2
    };
  };
  // State to track if modal is being dragged
  const [isModalDragging, setIsModalDragging] = useState(false);
  // Ref for modal container to calculate drag constraints
  const modalContainerRef = useRef<HTMLDivElement>(null);
  // State for drag constraints
  const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });

  // Update drag constraints on mount and resize
  useEffect(() => {
    function updateConstraints() {
      if (modalContainerRef.current) {
        const modal = modalContainerRef.current;
        const modalRect = modal.getBoundingClientRect();
        setConstraints({
          left: -modalRect.left,
          top: -modalRect.top,
          right: window.innerWidth - modalRect.right,
          bottom: window.innerHeight - modalRect.bottom,
        });
      }
    }
    if (isOpen) {
      updateConstraints();
      window.addEventListener('resize', updateConstraints);
      return () => window.removeEventListener('resize', updateConstraints);
    }
  }, [isOpen]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay: covers the whole screen for visual effect */}
          <div
            className="fixed inset-0 bg-black/10 pointer-events-none"
            style={{ zIndex: 100 }}
          />
          {/* Modal window */}
          <motion.div
            className="absolute bg-white rounded-xl shadow-2xl w-[700px] max-w-[98vw] h-[420px] max-h-[90vh] flex flex-col items-center overflow-hidden pointer-events-auto"
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            style={{
              zIndex: 101,
              left: getInitialPosition().x,
              top: getInitialPosition().y
            }}
            drag
            dragConstraints={constraints}
            dragElastic={0}
            dragMomentum={false}
            ref={modalContainerRef}
            onClick={e => e.stopPropagation()}
            // Cursor logic for drag
            onMouseEnter={() => !isModalDragging && setCursorType("openhand")}
            onMouseLeave={() => { setCursorType("normal"); setIsModalDragging(false); }}
            onDragStart={() => { setCursorType("closedhand"); setIsModalDragging(true); }}
            onDragEnd={() => { setCursorType("openhand"); setIsModalDragging(false); }}
          >
            {/* MacOS-style title bar */}
            <div className="flex items-center h-8 px-4 border-b border-gray-200 bg-gray-50 relative select-none w-full">
              {/* Window controls: set cursor to pointinghand on hover */}
              <div className="flex items-center gap-2">
                <button
                  aria-label="Close"
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/10 shadow hover:scale-110 transition-transform"
                  style={{ boxShadow: '0 1px 2px #0002' }}
                  onMouseEnter={() => setCursorType("pointinghand")}
                  onMouseLeave={() => setCursorType("normal")}
                />
                <button
                  aria-label="Minimize"
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10 shadow hover:scale-110 transition-transform"
                  style={{ boxShadow: '0 1px 2px #0002' }}
                  onMouseEnter={() => setCursorType("pointinghand")}
                  onMouseLeave={() => setCursorType("normal")}
                />
                <button
                  aria-label="Maximize"
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10 shadow hover:scale-110 transition-transform"
                  style={{ boxShadow: '0 1px 2px #0002' }}
                  onMouseEnter={() => setCursorType("pointinghand")}
                  onMouseLeave={() => setCursorType("normal")}
                />
              </div>
              {/* Centered title */}
              <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
                <span className="text-sm text-gray-700 font-semibold tracking-tight">lifedump.photos</span>
              </div>
            </div>
            {/* 3D Coverflow Slider */}
            <div className="flex-1 w-full flex items-center justify-center relative overflow-visible">
              {/* Coverflow images, now draggable */}
              <motion.div
                className="relative flex items-center justify-center w-full h-[320px] select-none"
                style={{ perspective: 1200 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(event, info) => {
                  // Threshold for swipe (in px)
                  const threshold = 80;
                  if (info.offset.x < -threshold && current < IMAGES.length - 1) {
                    setCurrent(current + 1);
                  } else if (info.offset.x > threshold && current > 0) {
                    setCurrent(current - 1);
                  }
                  setCursorType("openhand");
                  setIsDragging(false);
                }}
                // Prevent text/image selection while dragging
                dragElastic={0.18}
                dragMomentum={false}
                // Cursor logic for drag - only when not dragging modal
                onMouseEnter={() => !isDragging && !isModalDragging && setCursorType("openhand")}
                onMouseLeave={() => { setCursorType("normal"); setIsDragging(false); }}
                onDragStart={() => {
                  if (!isModalDragging) {
                    setCursorType("closedhand");
                    setIsDragging(true);
                  }
                }}
              >
                {IMAGES.map((src, idx) => {
                  // Calculate position relative to current
                  const offset = idx - current;
                  // 3D transform: center is flat, sides are rotated
                  const rotateY = offset * 30;
                  const translateX = offset * 120;
                  const scale = Math.abs(offset) === 0 ? 1 : 0.85;
                  const zIndex = 100 - Math.abs(offset);
                  return (
                    <motion.div
                      // Use a combination of src and idx to guarantee unique keys, even for duplicate URLs
                      key={`${src}-${idx}`}
                      className="absolute top-1/2 left-1/2"
                      style={{
                        width: 200,
                        height: 280,
                        x: '-50%',
                        y: '-50%',
                        zIndex,
                        pointerEvents: offset === 0 ? 'auto' : 'none',
                      }}
                      animate={{
                        rotateY,
                        x: `calc(-50% + ${translateX}px)`,
                        scale,
                        filter: offset === 0 ? 'brightness(1)' : 'brightness(0.85)',
                        boxShadow: offset === 0 ? '0 8px 32px 0 rgba(0,0,0,0.18)' : '0 2px 8px 0 rgba(0,0,0,0.10)',
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      <Image
                        src={src}
                        alt={`Gallery ${idx + 1}`}
                        width={200}
                        height={280}
                        className="rounded-lg object-cover w-full h-full border border-gray-200 bg-white"
                        draggable={false}
                        style={{ userSelect: 'none', pointerEvents: 'auto' }}
                        unoptimized
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhotoGalleryModal;

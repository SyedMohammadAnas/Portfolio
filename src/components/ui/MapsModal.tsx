import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Map, Navigation, BookOpen, GraduationCap } from "lucide-react";
import { useCursor } from "./useCursor";

// Interface for maps modal props - matching other modals
interface MapsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Optional custom initial position for the modal
  initialPosition?: { x: number; y: number };
  // Optional custom z-index for modal stacking
  customZIndex?: number;
}

// Mock sidebar navigation items for native Maps app feel
const MAPS_NAVIGATION = [
  { id: 'search', name: 'Search', icon: Search, active: true },
  { id: 'guides', name: 'Guides', icon: BookOpen, active: false },
  { id: 'directions', name: 'Directions', icon: Navigation, active: false },
];

// MapsModal component - native Maps app with macOS window behavior
const MapsModal: React.FC<MapsModalProps> = ({
  isOpen,
  onClose,
  initialPosition,
  customZIndex
}) => {
  const setCursorType = useCursor();

  // Window behavior states - matching other modals
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });

  // Selected navigation state for sidebar
  const [selectedNav, setSelectedNav] = useState('search');

  // Calculate initial position for the modal - matching other modals
  const getInitialPosition = (): { x: number; y: number } => {
    const modalWidth = 900; // Maps modal width
    const modalHeight = 600; // Maps modal height

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

  // Update drag constraints on mount and resize - matching other modals
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

  // Prevent background scroll when modal is open - matching other modals
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  // Handle modal close - reset all states
  const handleClose = () => {
    setSelectedNav('search');
    onClose();
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          tabIndex={-1}
          ref={modalRef}
          style={{ zIndex: customZIndex || 101 }}
        >
          {/* Draggable modal container positioned at custom location - matching other modals */}
          <motion.div
            className="absolute rounded-lg shadow-2xl overflow-hidden border border-white/30 bg-white pointer-events-auto"
            style={{
              width: '1200px',
              height: '600px',
              left: getInitialPosition().x,
              top: getInitialPosition().y,
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)"
            }}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            drag
            dragConstraints={{
              left: -getInitialPosition().x,
              top: -getInitialPosition().y,
              right: window.innerWidth - getInitialPosition().x - 900,
              bottom: window.innerHeight - getInitialPosition().y - 600,
            }}
            dragElastic={0.1}
            dragMomentum={false}
            ref={modalContainerRef}
            onClick={e => e.stopPropagation()}
            // Cursor logic for drag - matching other modals
            onMouseEnter={() => !isDragging && setCursorType("openhand")}
            onMouseLeave={() => { setCursorType("normal"); setIsDragging(false); }}
            onDragStart={() => { setCursorType("closedhand"); setIsDragging(true); }}
            onDragEnd={() => { setCursorType("openhand"); setIsDragging(false); }}
          >
            {/* Layout: Sidebar (left) and Main map area (right) - similar to ExplorerModal */}
            <div className="flex flex-row w-full h-full">

              {/* Glassy left sidebar - maps navigation */}
              <div
                className="flex flex-col justify-start items-stretch w-50 h-full px-0 py-0 border-r border-white/40"
                style={{
                  background: "linear-gradient(to bottom, rgba(236,236,236,0.85) 60%, rgba(220,230,255,0.18) 100%)",
                  backdropFilter: "blur(18px) saturate(1.5)",
                  WebkitBackdropFilter: "blur(18px) saturate(1.5)",
                  boxShadow: "2px 0 24px 0 rgba(0,0,0,0.10) inset",
                  borderRight: "1.5px solid rgba(255,255,255,0.32)",
                }}
              >
                {/* Mac window controls at the top of sidebar - matching other modals */}
                <div className="flex items-center gap-3 mt-3 mb-6 px-4">
                  <button
                    aria-label="Close"
                    onClick={handleClose}
                    className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/10 shadow hover:scale-110 transition-transform p-1 -m-1"
                    style={{ boxShadow: '0 1px 2px #0002' }}
                    onMouseEnter={() => setCursorType("pointinghand")}
                    onMouseLeave={() => setCursorType("normal")}
                  />
                  <button
                    aria-label="Minimize"
                    onClick={handleClose}
                    className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10 shadow hover:scale-110 transition-transform p-1 -m-1"
                    style={{ boxShadow: '0 1px 2px #0002' }}
                    onMouseEnter={() => setCursorType("pointinghand")}
                    onMouseLeave={() => setCursorType("normal")}
                  />
                  <button
                    aria-label="Maximize"
                    onClick={handleClose}
                    className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10 shadow hover:scale-110 transition-transform p-1 -m-1"
                    style={{ boxShadow: '0 1px 2px #0002' }}
                    onMouseEnter={() => setCursorType("pointinghand")}
                    onMouseLeave={() => setCursorType("normal")}
                  />
                </div>

                {/* Maps app title */}
                <div className="px-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Map className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800 tracking-tight">Maps</h3>
                  </div>
                </div>

                {/* Maps navigation */}
                <div className="flex-1 px-4">
                  <div className="space-y-1">
                    {MAPS_NAVIGATION.map((item) => {
                      const IconComponent = item.icon;
                      const isSelected = selectedNav === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedNav(item.id)}
                          onMouseEnter={() => setCursorType("pointinghand")}
                          onMouseLeave={() => setCursorType("normal")}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                            isSelected
                              ? 'bg-blue-100 text-blue-800 shadow-sm'
                              : 'text-gray-700 hover:bg-white/50'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span className="flex-1 text-left font-medium">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* Main map area - right side */}
              <div className="flex-1 flex flex-col h-full bg-white">

                {/* Embedded MapTiler map */}
                <div className="flex-1 relative">
                  <iframe
                    src="https://api.maptiler.com/maps/019949c0-2a1f-7585-8a3d-3e544ab9af24/?key=bOUN4GVKBLVuhiFxSMfZ#16.4/12.82231/80.04215/59.7/59"
                    className="w-full h-full border-0"
                    title="Portfolio Location Map"
                    allowFullScreen
                    loading="lazy"
                    style={{
                      border: 'none',
                      outline: 'none'
                    }}
                  />

                  {/* Location info overlay */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 max-w-xs">
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-6 h-6 text-red-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-800">Currently residing in:</div>
                        <div className="text-xs text-gray-600">SRM Institute of Science and Technology,</div>
                        <div className="text-xs text-gray-600">Potheri, Chennai TN</div>
                        <div className="text-xs text-gray-600">603203</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MapsModal;

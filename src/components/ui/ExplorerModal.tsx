import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCursor } from "./useCursor"; // Import custom cursor hook

// Placeholder icons for random assignment
const ICONS = [
  "/media/Icons/appleFinder.avif",
  "/media/Icons/appleSafari.avif",
  "/media/Icons/appleMusic.avif",
  "/media/Icons/appleNotes.avif",
  "/media/Icons/appleReminders.avif",
  "/media/Icons/appleCalendar.avif",
  "/media/Icons/applePhotos.avif",
  "/media/Icons/appleContacts.avif",
  "/media/Icons/appleMails.avif",
  "/media/Icons/appleAppstore.avif",
  "/media/Icons/appleMaps.avif",
  "/media/Icons/appleFacetime.avif",
  "/media/Icons/appleTv.avif",
  "/media/Icons/appleSettings.avif",
  "/media/Icons/appleTrash.avif",
  "/media/IconsPNG/appleIcon.png",
  "/media/IconsPNG/appleHome.png",
  "/media/IconsPNG/appleReminders.png",
  "/media/IconsPNG/appleNotes.png",
  "/media/IconsPNG/appleMessages.png",
];

// Example project data for sidebar
const PROJECTS = [
  { id: 1, name: "Project 01", label: "AbsolutMess" },
  { id: 2, name: "Project 02", label: "Simplingo" },
  { id: 3, name: "Project 03", label: "Leafpress" },
];

// Example files/folders for the selected project
const EXPLORER_ITEMS = [
  { name: "Full case study.fig", type: "fig" },
  { name: "absolutmess.com", type: "link" },
  { name: "TL;DR.txt", type: "txt" },
];

// Utility function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Utility to generate random positions for icons
function getRandomPositions(count: number, width: number, height: number, iconSize = 90) {
  // width/height: container size, iconSize: icon box size
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    let tries = 0;
    let pos: { x: number; y: number };
    do {
      pos = {
        x: Math.random() * (width - iconSize),
        y: Math.random() * (height - iconSize),
      };
      tries++;
      // Avoid overlap (simple check, not perfect for many icons)
    } while (
      positions.some(
        (p) => Math.abs(p.x - pos.x) < iconSize && Math.abs(p.y - pos.y) < iconSize
      ) && tries < 20
    );
    positions.push(pos);
  }
  return positions;
}

interface ExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProjectId: number;
  onSelectProject: (id: number) => void;
  // Optional custom initial position for the modal
  initialPosition?: { x: number; y: number };
  // Optional custom z-index for modal stacking
  customZIndex?: number;
}

/**
 * ExplorerModal - MacOS Finder-like modal for project exploration
 * - Mac-style window controls (red/yellow/green) on the top left
 * - All three buttons close the modal
 * - Title/subtitle aligned as in reference
 * - Glassmorphic left panel
 * - Main area is solid white, with centered grid of files/folders
 * - Modal is smaller and draggable
 * - No background blur/overlay
 * - Supports custom initial positioning
 */
const ExplorerModal: React.FC<ExplorerModalProps> = ({
  isOpen,
  onClose,
  selectedProjectId,
  onSelectProject,
  initialPosition,
  customZIndex,
}) => {
  // Trap focus inside modal when open
  const modalRef = useRef<HTMLDivElement>(null);
  // Ref for modal container to calculate drag constraints
  const modalContainerRef = useRef<HTMLDivElement>(null);
  // State for drag constraints
  const [constraints, setConstraints] = React.useState({ left: 0, right: 0, top: 0, bottom: 0 });

  // State for randomized explorer items
  const [shuffledItems, setShuffledItems] = React.useState(EXPLORER_ITEMS);
  // State for random icon positions
  const [iconPositions, setIconPositions] = React.useState<{ x: number; y: number }[]>([]);
  // Ref for icon area size
  const iconAreaRef = React.useRef<HTMLDivElement>(null);

  const setCursorType = useCursor(); // Get cursor setter
  // State to track if modal is being dragged
  const [isDragging, setIsDragging] = React.useState(false);

  // Calculate initial position for the modal
  const getInitialPosition = (): { x: number; y: number } => {
    const modalWidth = 620; // Modal width in pixels
    const modalHeight = 350; // Modal height in pixels

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

  // Shuffle icons and generate random positions each time modal opens
  React.useEffect(() => {
    if (isOpen) {
      setShuffledItems(shuffleArray(EXPLORER_ITEMS));
      // Wait for next tick to get container size
      setTimeout(() => {
        const area = iconAreaRef.current;
        if (area) {
          const width = area.offsetWidth;
          const height = area.offsetHeight;
          setIconPositions(getRandomPositions(EXPLORER_ITEMS.length, width, height));
        }
      }, 10);
    }
  }, [isOpen]);

  // Only render modal if open
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          tabIndex={-1}
          ref={modalRef}
        >
          {/* Overlay: covers the whole screen for visual effect */}
          <div
            className="fixed inset-0 bg-black/10 pointer-events-none"
            style={{ zIndex: 100 }}
          />
          {/* Draggable modal container positioned at custom location */}
          <motion.div
            className="absolute rounded-lg shadow-2xl overflow-hidden border border-white/30 bg-white pointer-events-auto"
            style={{
              width: '620px',
              height: '350px',
              left: getInitialPosition().x,
              top: getInitialPosition().y,
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
              zIndex: customZIndex || 101 // Use custom z-index if provided, otherwise default to 101
            }}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            drag
            dragConstraints={constraints}
            dragElastic={0}
            dragMomentum={false}
            ref={modalContainerRef}
            onClick={e => e.stopPropagation()}
            // Cursor logic for drag
            onMouseEnter={() => !isDragging && setCursorType("openhand")}
            onMouseLeave={() => { setCursorType("normal"); setIsDragging(false); }}
            onDragStart={() => { setCursorType("closedhand"); setIsDragging(true); }}
            onDragEnd={() => { setCursorType("openhand"); setIsDragging(false); }}
          >
            {/* Layout: Sidebar (left) and Main (right) */}
            <div className="flex flex-row w-full h-full">
              {/* Glassy left sidebar - includes Mac controls and navigation */}
              <div
                className="flex flex-col justify-start items-stretch w-40 h-full px-0 py-0 border-r border-white/40"
                style={{
                  background: "linear-gradient(to bottom, rgba(236,236,236,0.85) 60%, rgba(220,230,255,0.18) 100%)",
                  backdropFilter: "blur(18px) saturate(1.5)",
                  WebkitBackdropFilter: "blur(18px) saturate(1.5)",
                  boxShadow: "2px 0 24px 0 rgba(0,0,0,0.10) inset",
                  borderRight: "1.5px solid rgba(255,255,255,0.32)",
                }}
              >
                {/* Mac window controls at the top of sidebar */}
                <div className="flex items-center gap-2 mt-3 mb-6 px-4">
                  {/* Window controls: set cursor to pointinghand on hover */}
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
                {/* Navigation sections with section headers and icons */}
                <div className="flex flex-col gap-4 justify-start h-full py-1">
                  {/* Section 1: Work/About/Resume/Trash */}
                  <div>
                    <div className="flex text-xs font-semibold text-grey-700 mb-0 pl-4 opacity-40">Myself</div>
                    <div className="flex flex-col gap-1">
                      {['Work', 'About Me', 'Resume', 'Trash'].map((item, idx) => (
                        <button
                          key={item}
                          className="flex items-center gap-2 px-4 py-1 rounded-md text-sm font-medium text-gray-800/90 hover:bg-white/30 transition-colors"
                          onMouseEnter={() => setCursorType("pointinghand")}
                          onMouseLeave={() => setCursorType("normal")}
                        >
                          {/* Placeholder icon (replace with real icons as needed) */}
                          <span className="text-[13px] text-gray-400">{['💼','👤','📄','🗑️'][idx]}</span>
                          <span>{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Section 2: Projects */}
                  <div>
                    <div className="text-xs font-semibold text-gray-700 mb-0 pl-4 opacity-60">My Projects</div>
                    <div className="flex flex-col gap-1">
                      {PROJECTS.map((proj) => (
                        <button
                          key={proj.id}
                          className={`flex items-center gap-2 px-3 py-1 mx-2 rounded-md text-sm font-medium transition-colors ${selectedProjectId === proj.id ? "bg-black/10 text-gray-900 shadow-inner" : "hover:bg-white/40 text-gray-800/90"}`}
                          onClick={() => onSelectProject(proj.id)}
                          onMouseEnter={() => setCursorType("pointinghand")}
                          onMouseLeave={() => setCursorType("normal")}
                        >
                          {/* Apple folder icon beside project name */}
                          <Image src="/media/Icons/appleFolder.avif" alt="Folder" width={15} height={15} className="object-contain mr-2" />
                          <span>{proj.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Main explorer area - toolbar, heading, and centered grid */}
              <div className="flex-1 flex flex-col bg-white h-full rounded-tr-lg rounded-br-lg">
                {/* Toolbar with blur, subtitle, and title */}
                <div className="flex flex-col items-start px-4 pt-2 pb-1 w-full" style={{backdropFilter:'blur(13.5px)', background:'rgba(252,252,252,0.8)', boxShadow:'0 1px 0 0 rgba(0,0,0,0.05), 0 0.5px 0 0 rgba(0,0,0,0.1)'}}>
                  <span className="text-xs text-gray-500 mb-0.5">Gen AI Language Modifier Tool</span>
                  <span className="font-bold text-gray-800 text-[13px]">{PROJECTS.find(p => p.id === selectedProjectId)?.label} (Project 0{selectedProjectId})</span>
                </div>
                {/* Centered grid of icons/files/folders */}
                <div ref={iconAreaRef} className="flex-1 relative w-full h-full min-h-[180px] min-w-[300px]">
                  {/* Absolutely position each icon at its random spot */}
                  {shuffledItems.map((item, idx) => {
                    const iconSrc = ICONS[idx % ICONS.length];
                    const pos = iconPositions[idx] || { x: 0, y: 0 };
                    const style = {
                      position: 'absolute' as const,
                      left: pos.x,
                      top: pos.y,
                      width: 90,
                      height: 90,
                    };
                    // If type is 'link', wrap in <a>
                    const isLink = item.type === 'link';
                    const linkHref = item.name === 'absolutmess.com' ? 'https://absolutmess.com' : undefined;
                    return isLink && linkHref ? (
                      <a
                        key={item.name}
                        href={linkHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={style}
                        className="flex flex-col items-center cursor-pointer group select-none"
                        onMouseEnter={() => setCursorType("pointinghand")}
                        onMouseLeave={() => setCursorType("normal")}
                      >
                        <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center border border-gray-200 shadow group-hover:scale-105 transition-transform">
                          <Image src={iconSrc} alt={item.name} width={40} height={40} className="object-contain" />
                        </div>
                        <span className="text-xs mt-2 text-gray-800/90 text-center w-full truncate drop-shadow-sm">
                          {item.name}
                        </span>
                      </a>
                    ) : (
                      <div
                        key={item.name}
                        style={style}
                        className="flex flex-col items-center cursor-pointer group select-none"
                        onMouseEnter={() => setCursorType("pointinghand")}
                        onMouseLeave={() => setCursorType("normal")}
                      >
                        <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center border border-gray-200 shadow group-hover:scale-105 transition-transform">
                          <Image src={iconSrc} alt={item.name} width={40} height={40} className="object-contain" />
                        </div>
                        <span className="text-xs mt-2 text-gray-800/90 text-center w-full truncate drop-shadow-sm">
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExplorerModal;

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCursor } from "./useCursor"; // Import custom cursor hook
// Import the real ExplorerModal
import ExplorerModal from "./ExplorerModal";
import StickyNote from "./StickyNote";
import PhotoGalleryModal from "./PhotoGalleryModal";

// ICONS DATA ARRAY - Only use .avif icons that exist in /public/media/Icons
const dockIcons = [
  { src: "/media/Icons/appleFinder.avif", alt: "Finder" },
  { src: "/media/Icons/appleSafari.avif", alt: "Safari" },
  { src: "/media/Icons/appleMusic.avif", alt: "Music" },
  { src: "/media/Icons/appleMessages.avif", alt: "Messages" },
  { src: "/media/Icons/appleNotes.avif", alt: "Notes" },
  { src: "/media/Icons/appleReminders.avif", alt: "Reminders" },
  { src: "/media/Icons/appleCalendar.avif", alt: "Calendar" },
  { src: "/media/Icons/applePhotos.avif", alt: "Photos" },
  { src: "/media/Icons/appleContacts.avif", alt: "Contacts" },
  { src: "/media/Icons/appleMails.avif", alt: "Mail" },
  { src: "/media/Icons/appleAppstore.avif", alt: "App Store" },
  { src: "/media/Icons/appleMaps.avif", alt: "Maps" },
  { src: "/media/Icons/appleFacetime.avif", alt: "FaceTime" },
  { src: "/media/Icons/appleTv.avif", alt: "Tv" },
  { src: "/media/Icons/appleSettings.avif", alt: "Settings" },
  { src: "/media/Icons/appleFolder.avif", alt: "Folder", divider: true },
  { src: "/media/Icons/appleTrash.avif", alt: "Trash" },
];

/**
 * Dock component replicating the MacBook dock visually and interactively.
 * - Uses only .avif icons from /public/media/Icons
 * - Framer-like icon rendering: object-fit: fill, object-position: center
 * - Responsive, glassy, and sharp
 */
const Dock: React.FC = () => {
  const setCursorType = useCursor(); // Get cursor setter
  // All hooks must be called before any return (React rules of hooks)
  const [explorerModalOpen, setExplorerModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(1);
  const [stickyNoteOpen, setStickyNoteOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  // State for random modal position
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  // Function to generate random position within viewport bounds
  const generateRandomPosition = () => {
    const modalWidth = 620; // ExplorerModal width
    const modalHeight = 350; // ExplorerModal height
    const padding = 50; // Minimum distance from edges for better UX

    const maxX = window.innerWidth - modalWidth - padding;
    const maxY = window.innerHeight - modalHeight - padding;
    const minX = padding;
    const minY = padding;

    return {
      x: Math.floor(Math.random() * (maxX - minX + 1)) + minX,
      y: Math.floor(Math.random() * (maxY - minY + 1)) + minY
    };
  };

  // Handler to change selected project
  const handleSelectProject = (id: number) => setSelectedProjectId(id);

  // Handler to open explorer modal with random position
  const handleOpenExplorer = () => {
    setModalPosition(generateRandomPosition());
    setExplorerModalOpen(true);
  };

  return (
    <>
      {/* Render ExplorerModal if open, pass all required props */}
      <ExplorerModal
        isOpen={explorerModalOpen}
        onClose={() => setExplorerModalOpen(false)}
        selectedProjectId={selectedProjectId}
        onSelectProject={handleSelectProject}
        initialPosition={modalPosition}
      />
      {/* Render StickyNote if open */}
      {stickyNoteOpen && (
        <>
          {/* Overlay to close sticky note on outside click */}
          <div
            className="fixed inset-0 z-20 bg-transparent cursor-pointer"
            onClick={() => setStickyNoteOpen(false)}
            aria-label="Close sticky note by clicking outside"
          />
          <StickyNote onClose={() => setStickyNoteOpen(false)} />
        </>
      )}
      {/* Render PhotoGalleryModal if open */}
      <PhotoGalleryModal isOpen={galleryOpen} onClose={() => setGalleryOpen(false)} />
      <div
        className="fixed left-1/2 bottom-0 -translate-x-1/2 z-50 flex items-end px-4 py-8"
        style={{ minWidth: 340, maxWidth: '96vw' }}
      >
        {/* Dock background */}
        <div
          className="flex items-end gap-2 w-full px-4 py-2 rounded-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] bg-black/40 backdrop-blur-xl"
          style={{
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45), 0 1.5px 0 0 rgba(255,255,255,0.18) inset',
            borderRadius: 22,
          }}
        >
          {/* ICONS ROW */}
          {dockIcons.map((icon) => {
            // Insert divider before the first icon with divider: true
            const showDivider = icon.divider === true;
            // Check if this is the Finder icon
            const isFinder = icon.alt === "Finder";
            // Check if this is the Notes icon
            const isNotes = icon.alt === "Notes";
            // Check if this is the Photos icon
            const isPhotos = icon.alt === "Photos";
            return (
              <React.Fragment key={icon.alt}>
                {showDivider && (
                  // Framer-like divider (vertical line)
                  <div
                    className="mx-2 h-10 w-px bg-white/30 rounded-full self-center"
                    aria-hidden="true"
                  />
                )}
                {/* Wrapper for icon and tooltip, using group for hover state */}
                <div className="relative flex flex-col items-center group">
                  {/* Tooltip: shows on hover, absolutely positioned above the icon */}
                  <span
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-7 px-3 py-1 rounded-md bg-white/80 text-xs text-black shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap select-none"
                    aria-hidden="true"
                  >
                    {icon.alt}
                  </span>
                  {/* Animated icon */}
                  <motion.div
                    whileHover={{ scale: 1.3, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18, duration: 0.3 }}
                    className="flex flex-col items-center cursor-pointer select-none"
                    style={{ width: 50, height: 50, minWidth: 44, minHeight: 44 }}
                    onClick={
                      isFinder
                        ? () => handleOpenExplorer()
                        : isNotes
                        ? () => setStickyNoteOpen(true)
                        : isPhotos
                        ? () => setGalleryOpen(true)
                        : undefined
                    }
                    // Set custom cursor on hover
                    onMouseEnter={() => setCursorType("pointinghand")}
                    onMouseLeave={() => setCursorType("normal")}
                  >
                    {/* ICON IMAGE - Now using Next.js <Image /> for optimization and linter compliance */}
                    <div className="w-full h-full flex items-center justify-center rounded-xl overflow-hidden" style={{ background: 'transparent' }}>
                      <Image
                        src={icon.src}
                        alt={icon.alt}
                        width={50}
                        height={50}
                        className="block w-full h-full object-fill object-center"
                        draggable={false}
                        style={{ userSelect: 'none', imageRendering: 'auto', borderRadius: 'inherit' }}
                        // Next.js Image optimization for AVIF icons
                        quality={100}
                        priority
                      />
                    </div>
                  </motion.div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Dock;

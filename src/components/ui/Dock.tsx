import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCursor } from "./useCursor"; // Import custom cursor hook
// Import the real ExplorerModal
import ExplorerModal from "./ExplorerModal";
import StickyNote from "./StickyNote";
import PhotoGalleryModal from "./PhotoGalleryModal";
// Import the new SpotifyEmbed component
import SpotifyEmbed from "./SpotifyEmbed";
// Import the new VisitingCardModal component
import VisitingCardModal from "./VisitingCardModal";
// Import the new EmailModal component
import EmailModal from "./EmailModal";
// Import the new MapsModal component
import MapsModal from "./MapsModal";
// Import responsive positioning utilities
import { pxToVw, pxToVh } from "./useResponsivePositioning";
// Import mobile detection hook
import { useMobileDetection } from "./useMobileDetection";

// DESKTOP ICONS DATA ARRAY - Only use .avif icons that exist in /public/media/Icons
const dockIcons = [
  { src: "/media/Icons/appleFinder.avif", alt: "Finder" },
  { src: "/media/Icons/appleSafari.avif", alt: "Safari" },
  { src: "/media/Icons/appleMusic.avif", alt: "Music" },
  { src: "/media/Icons/appleMessages.avif", alt: "Messages" },
  { src: "/media/Icons/appleNotes.avif", alt: "Notes" },
  { src: "/media/IconsPNG/githubLogo2.png", alt: "GitHub" },
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

// MOBILE ICONS DATA ARRAY - Only 4 icons for mobile view
const mobileDockIcons = [
  { src: "/media/Icons/appleFinder.avif", alt: "Finder" },
  { src: "/media/Icons/applePhotos.avif", alt: "Photos" },
  { src: "/media/Icons/appleMails.avif", alt: "Mail" },
  { src: "/media/IconsPNG/githubLogo2.png", alt: "GitHub" },
];

/**
 * Dock component replicating the MacBook dock visually and interactively.
 * - Uses only .avif icons from /public/media/Icons
 * - Framer-like icon rendering: object-fit: fill, object-position: center
 * - Responsive, glassy, and sharp
 */
const Dock: React.FC = () => {
  const setCursorType = useCursor(); // Get cursor setter
  const isMobile = useMobileDetection(); // Get mobile detection state
  // All hooks must be called before any return (React rules of hooks)
  const [explorerModalOpen, setExplorerModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(1);
  const [stickyNoteOpen, setStickyNoteOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  // State for Spotify embed visibility
  const [spotifyEmbedOpen, setSpotifyEmbedOpen] = useState(false);
  // State for visiting card modal visibility
  const [visitingCardOpen, setVisitingCardOpen] = useState(false);
  // State for email modal visibility
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  // State for maps modal visibility
  const [mapsModalOpen, setMapsModalOpen] = useState(false);
  // State for random modal positions
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [galleryPosition, setGalleryPosition] = useState({ x: 0, y: 0 });
  // State for email modal position
  const [emailPosition, setEmailPosition] = useState({ x: 0, y: 0 });
  // State for maps modal position
  const [mapsPosition, setMapsPosition] = useState({ x: 0, y: 0 });

  // Function to generate random position within viewport bounds
  const generateRandomPosition = (modalWidth: number, modalHeight: number) => {
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
    // Only open if not already open
    if (!explorerModalOpen) {
      setModalPosition(generateRandomPosition(620, 350)); // ExplorerModal dimensions
      setExplorerModalOpen(true);
    }
  };

  // Handler to open photo gallery modal with random position
  const handleOpenGallery = () => {
    setGalleryPosition(generateRandomPosition(700, 420)); // PhotoGalleryModal dimensions
    setGalleryOpen(true);
  };

  // Handler to toggle Spotify embed
  const handleToggleSpotify = () => {
    setSpotifyEmbedOpen(!spotifyEmbedOpen);
  };

  // Handler to toggle visiting card modal
  const handleToggleVisitingCard = () => {
    setVisitingCardOpen(!visitingCardOpen);
  };

  // Handler to toggle email modal
  const handleToggleEmailModal = () => {
    if (!emailModalOpen) {
      setEmailPosition(generateRandomPosition(800, 500)); // EmailModal dimensions
      setEmailModalOpen(true);
    } else {
      setEmailModalOpen(false);
    }
  };

  // Handler to toggle maps modal
  const handleToggleMapsModal = () => {
    if (!mapsModalOpen) {
      setMapsPosition(generateRandomPosition(900, 600)); // MapsModal dimensions
      setMapsModalOpen(true);
    } else {
      setMapsModalOpen(false);
    }
  };

  // Handler to toggle sticky note
  const handleToggleStickyNote = () => {
    setStickyNoteOpen(!stickyNoteOpen);
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
        <StickyNote onClose={() => setStickyNoteOpen(false)} />
      )}
      {/* Render PhotoGalleryModal if open */}
      <PhotoGalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        initialPosition={galleryPosition}
      />

      {/* Render SpotifyEmbed component */}
      <SpotifyEmbed
        isOpen={spotifyEmbedOpen}
        onClose={() => setSpotifyEmbedOpen(false)}
      />

      {/* Render VisitingCardModal component */}
      <VisitingCardModal
        isOpen={visitingCardOpen}
        onClose={() => setVisitingCardOpen(false)}
      />

      {/* Render EmailModal component */}
      <EmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        initialPosition={emailPosition}
      />

      {/* Render MapsModal component */}
      <MapsModal
        isOpen={mapsModalOpen}
        onClose={() => setMapsModalOpen(false)}
        initialPosition={mapsPosition}
      />

      <div
        className="fixed left-1/2 bottom-0 -translate-x-1/2 z-50 flex items-end"
        style={{
          // Mobile: extend to screen edges with smaller gap, Desktop: fixed width
          minWidth: isMobile ? 'calc(100vw - 20px)' : pxToVw(380),
          maxWidth: isMobile ? 'calc(100vw - 20px)' : '96vw',
          padding: isMobile
            ? '8px 4px' // Fixed pixel values for mobile
            : `${pxToVh(32)} ${pxToVw(16)}`, // Convert py-8 px-4 to responsive units
        }}
      >
        {/* Dock background */}
        <div
          className={`w-full rounded-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] bg-black/40 backdrop-blur-xl ${
            isMobile ? 'grid grid-cols-4 items-center' : 'flex items-end'
          }`}
          style={{
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45), 0 1.5px 0 0 rgba(255,255,255,0.18) inset',
            borderRadius: 22,
            padding: isMobile
              ? '4px 2px' // Fixed pixel values - minimal padding for mobile
              : `${pxToVh(7)} ${pxToVw(7)}`, // Increased padding from py-2 px-4 to py-3 px-5 for better icon spacing
            gap: isMobile ? '2px' : pxToVw(1), // Fixed pixel gap for mobile - very small
          }}
        >
          {/* ICONS ROW */}
          {(isMobile ? mobileDockIcons : dockIcons).map((icon) => {
            // Insert divider before the first icon with divider: true (only for desktop icons)
            const showDivider = !isMobile && (icon as any).divider === true;
            // Check if this is the Finder icon
            const isFinder = icon.alt === "Finder";
            // Check if this is the Notes icon
            const isNotes = icon.alt === "Notes";
            // Check if this is the Photos icon
            const isPhotos = icon.alt === "Photos";
            // Check if this is the GitHub icon
            const isGitHub = icon.alt === "GitHub";
            // Check if this is the Music icon
            const isMusic = icon.alt === "Music";
            // Check if this is the Contacts icon
            const isContacts = icon.alt === "Contacts";
            // Check if this is the Mail icon
            const isMail = icon.alt === "Mail";
            // Check if this is the Maps icon
            const isMaps = icon.alt === "Maps";
            // Determine if the white dot should be shown for this icon
            const showWhiteDot =
              (isFinder && explorerModalOpen) ||
              (isNotes && stickyNoteOpen) ||
              (isPhotos && galleryOpen) ||
              (isMusic && spotifyEmbedOpen) ||
              (isContacts && visitingCardOpen) ||
              (isMail && emailModalOpen) ||
              (isMaps && mapsModalOpen);
            return (
              <React.Fragment key={icon.alt}>
                {showDivider && (
                  // Framer-like divider (vertical line)
                  <div
                    className="h-10 w-px bg-white/30 rounded-full self-center"
                    style={{
                      margin: `0 ${pxToVw(8)}`, // Convert mx-2 (8px) to viewport width units
                      height: pxToVh(40), // Convert h-10 (40px) to viewport height units
                    }}
                    aria-hidden="true"
                  />
                )}
                {/* Wrapper for icon and tooltip, using group for hover state */}
                <div className="relative flex flex-col items-center group">
                  {/* Tooltip: shows on hover, absolutely positioned above the icon */}
                  <span
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full rounded-md bg-white/80 text-xs text-black shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap select-none"
                    style={{
                      marginBottom: pxToVh(28), // Convert mb-7 (28px) to viewport height units
                      padding: `${pxToVh(4)} ${pxToVw(12)}`, // Convert py-1 px-3 to responsive units
                    }}
                    aria-hidden="true"
                  >
                    {icon.alt}
                  </span>
                  {/* Animated icon */}
                  <motion.div
                    whileHover={{
                      scale: isMobile ? 1.15 : 1.3, // Reduced scale for mobile
                      y: isMobile ? -10 : -20 // Reduced vertical movement for mobile
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 18, duration: 0.3 }}
                    className="flex flex-col items-center cursor-pointer select-none"
                    style={{
                      width: isMobile ? '80px' : pxToVw(56), // Fixed 80px for mobile - much larger
                      height: isMobile ? '80px' : pxToVh(56), // Fixed 80px for mobile - much larger
                      minWidth: isMobile ? '70px' : pxToVw(48), // Fixed minimum for mobile
                      minHeight: isMobile ? '70px' : pxToVh(48) // Fixed minimum for mobile
                    }}
                    onClick={
                      isFinder
                        ? () => handleOpenExplorer()
                        : isNotes
                        ? () => handleToggleStickyNote()
                        : isPhotos
                        ? () => handleOpenGallery()
                        : isGitHub
                        ? () => window.open("https://github.com/SyedMohammadAnas", "_blank")
                        : isMusic
                        ? () => handleToggleSpotify()
                        : isContacts
                        ? () => handleToggleVisitingCard()
                        : isMail
                        ? () => handleToggleEmailModal()
                        : isMaps
                        ? () => handleToggleMapsModal()
                        : undefined
                    }
                    // Set custom cursor on hover
                    onMouseEnter={() => setCursorType("pointinghand")}
                    onMouseLeave={() => setCursorType("normal")}
                  >
                    {/* ICON CONTAINER - Adjusted for better proportions and aspect ratio preservation */}
                    <div
                      className="w-full h-full flex items-center justify-center rounded-xl overflow-hidden"
                      style={{
                        background: 'transparent',
                        width: isMobile ? '80px' : pxToVw(56), // Fixed 80px for mobile
                        height: isMobile ? '80px' : pxToVh(56), // Fixed 80px for mobile
                      }}
                    >
                      <Image
                        src={icon.src}
                        alt={icon.alt}
                        width={isMobile ? 80 : 56}
                        height={isMobile ? 80 : 56}
                        className="block w-full h-full object-contain object-center" // Changed from object-fill to object-contain
                        draggable={false}
                        style={{
                          userSelect: 'none',
                          imageRendering: 'auto',
                          borderRadius: 'inherit',
                          width: isMobile ? '80px' : pxToVw(56), // Fixed 80px for mobile
                          height: isMobile ? '80px' : pxToVh(56), // Fixed 80px for mobile
                        }}
                        // Next.js Image optimization for AVIF icons
                        quality={100}
                        priority
                      />
                    </div>
                  </motion.div>
                  {/* White dot indicator for open modal (Finder, Notes, Photos, Music/Spotify, Contacts) */}
                  {showWhiteDot && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white shadow"
                      style={{
                        zIndex: 11,
                        bottom: pxToVh(-8), // Convert -bottom-2 (-8px) to viewport height units
                        marginBottom: pxToVh(4), // Convert mb-1 (4px) to viewport height units
                        width: pxToVw(6), // Convert w-1.5 (6px) to viewport width units
                        height: pxToVh(6), // Convert h-1.5 (6px) to viewport height units
                      }}
                      aria-label="Open indicator"
                    />
                  )}
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

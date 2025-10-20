'use client';
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import MenuBar from "@/components/ui/MenuBar";
import React, { useState } from "react";
import Dock from "@/components/ui/Dock";
import Image from "next/image";
import ExplorerModal from "@/components/ui/ExplorerModal";
// Import the Starfield animated background
import { useCursor } from "@/components/ui/useCursor"; // Import custom cursor hook
// Import the GridBackground component
import GridBackground from "@/components/ui/GridBackground";
// Import the TextModifier component for interactive text effects
import TextModifier from "@/components/ui/TextModifier";
// Import responsive positioning hook
import { useResponsivePositioning, pxToVw, pxToVh } from "@/components/ui/useResponsivePositioning";
// Import mobile detection hook
import { useMobileDetection } from "@/components/ui/useMobileDetection";

// Interface for modal state management
interface ModalState {
  id: string; // Unique identifier for each modal
  projectId: number; // Which project this modal represents
  position: { x: number; y: number }; // Modal position
  isOpen: boolean; // Whether this modal is open
  zIndex: number; // For proper stacking
}

// Main portfolio desktop page for Syed Mohammad Anas
export default function Home() {
  // Get responsive positioning values
  const { scale } = useResponsivePositioning();
  // Get mobile detection state
  const isMobile = useMobileDetection();

  // State for folder/trash positions and z-index
  // Reference positions for 1920x1080 resolution - wrapped in useMemo to prevent recreation
  // Hide all items on mobile view
  const referenceItems = React.useMemo(() => {
    if (isMobile) {
      return []; // Return empty array for mobile - no folder icons
    }
    return [
      { id: 1, label: "Project 02", icon: "/media/Icons/appleFolder.avif", x: -450, y: 0, z: 1, type: 'folder', projectId: 2 },
      { id: 2, label: "Project 01", icon: "/media/Icons/appleFolder.avif", x: -270, y: 120, z: 1, type: 'folder', projectId: 1 },
      { id: 3, label: "Project 03", icon: "/media/Icons/appleFolder.avif", x: -500, y: 270, z: 1, type: 'folder', projectId: 3 },
      { id: 4, label: "Don't Look", icon: "/media/Icons/appleTrash.avif", x: -10, y: 360, z: 1, type: 'trash' },
      // PDF file that opens resume in new tab when clicked
      { id: 5, label: "SyedResume.pdf", icon: "/media/Icons/paperLogo.avif", x: -1600, y: -57, z: 1, type: 'file' },
      { id: 6, label: "About Me", icon: "/media/Icons/appleFolder.avif", x: -1400, y: 0, z: 1, type: 'folder' },
    ];
  }, [isMobile]);

  // Apply scaling to items based on current viewport
  const [items, setItems] = useState(() =>
    referenceItems.map(item => ({
      ...item,
      x: item.x * scale,
      y: item.y * scale,
    }))
  );

  // Track which folder is hovered for custom hover effect
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Update items when scale changes (viewport resize)
  React.useEffect(() => {
    setItems(referenceItems.map(item => ({
      ...item,
      x: item.x * scale,
      y: item.y * scale,
    })));
  }, [scale, referenceItems]);

  // State for multiple ExplorerModals - array of modal states
  const [modals, setModals] = useState<ModalState[]>([]);

  // State for currently selected project in each modal
  const [selectedProjectIds, setSelectedProjectIds] = useState<{ [modalId: string]: number }>({});

  // Track which items are currently being dragged to prevent click events
  const [draggedItems, setDraggedItems] = useState<Set<number>>(new Set());

  const setCursorType = useCursor(); // Get cursor setter

  // Disable custom cursor on mobile
  React.useEffect(() => {
    if (isMobile) {
      setCursorType("normal"); // Keep normal cursor on mobile
    }
  }, [isMobile, setCursorType]);

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

  // Function to create a new modal
  const createModal = (projectId: number) => {
    const modalId = `modal-${projectId}-${Date.now()}`; // Unique ID
    const newModal: ModalState = {
      id: modalId,
      projectId,
      position: generateRandomPosition(),
      isOpen: true,
      zIndex: 100 + modals.length // Stack modals properly
    };

    setModals(prev => [...prev, newModal]);
    setSelectedProjectIds(prev => ({ ...prev, [modalId]: projectId }));
  };

  // Function to close a specific modal
  const closeModal = (modalId: string) => {
    setModals(prev => prev.filter(modal => modal.id !== modalId));
    setSelectedProjectIds(prev => {
      const newState = { ...prev };
      delete newState[modalId];
      return newState;
    });
  };

  // Function to bring modal to front (update z-index)
  const bringModalToFront = (modalId: string) => {
    setModals(prev => {
      const maxZIndex = Math.max(...prev.map(m => m.zIndex));
      return prev.map(modal =>
        modal.id === modalId
          ? { ...modal, zIndex: maxZIndex + 1 }
          : modal
      );
    });
  };

  // Handler for drag start - mark item as being dragged
  const handleDragStart = (id: number) => {
    setDraggedItems(prev => new Set(prev).add(id)); // Add item to dragged set
    setItems((prev) => prev.map(item => item.id === id ? { ...item, z: 10 } : { ...item, z: 1 }));
  };

  // Handler for drag end - remove item from dragged set after a small delay
  const handleDragEnd = (
    id: number,
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setItems((prev) => prev.map(item =>
      item.id === id ? { ...item, x: item.x + info.offset.x, y: item.y + info.offset.y, z: 1 } : item
    ));

    // Remove item from dragged set after a small delay to prevent immediate clicks
    setTimeout(() => {
      setDraggedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 100); // 100ms delay to prevent accidental clicks after drag
  };

  // Handler for folder click - now supports multiple modals and PDF files
  const handleFolderClick = (item: typeof items[number]) => {
    // Prevent click if item is currently being dragged
    if (draggedItems.has(item.id)) {
      return;
    }

    if (item.type === 'folder' && item.projectId) {
      // Check if a modal for this project already exists
      const existingModal = modals.find(modal => modal.projectId === item.projectId);

      if (existingModal) {
        // If modal exists, bring it to front
        bringModalToFront(existingModal.id);
      } else {
        // If no modal exists, create a new one
        createModal(item.projectId);
      }
    } else if (item.type === 'file' && item.label === "SyedResume.pdf") {
      // Open the PDF file in a new tab
      const pdfUrl = "https://docs.google.com/document/d/13hupz9yVdmgTIzqTdMkv8YybdTJGkZnJ/edit?usp=sharing&ouid=101811674702433936195&rtpof=true&sd=true";
      window.open(pdfUrl, '_blank');
    }
  };

  // Handler for project selection within a modal
  const handleProjectSelection = (modalId: string, projectId: number) => {
    setSelectedProjectIds(prev => ({ ...prev, [modalId]: projectId }));
  };

  return (
    <>
      {/* MacOS-style Menu Bar */}
      <MenuBar />

      {/* Background for the entire screen */}
      <div className="fixed inset-0 w-full h-full bg-[#EDE8D0] -z-20" aria-hidden="true" />

      {/* Mobile Background Image - only show on mobile */}
      {isMobile && (
        <div
          className="fixed inset-0 w-full h-full -z-10 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/mobileBackground.png)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Grid Background Layer (on top of beige background) - hide on mobile */}
      {!isMobile && <GridBackground />}


      <div className="flex flex-col items-center justify-center w-full h-full relative">
        {/* --- Animated Starfield Background Layer --- */}

        {/* Centered Portfolio Title with TextModifier Effects, lifted up */}
        <div
          className="fixed inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
          style={{
            marginTop: isMobile ? pxToVh(-36) : pxToVh(-72), // Reduced negative margin on mobile
          }}
        >
          {/* Welcome text - smaller and positioned above, also lifted */}
          <div style={{ marginTop: isMobile ? pxToVh(34) : pxToVh(68) }}> {/* Reduced margin on mobile */}
            {isMobile ? (
              // Simple text for mobile - no special effects
              <div
                className="font-light tracking-wide text-4xl text-white"
              >
                welcome to my
              </div>
            ) : (
              // TextModifier with special effects for desktop
              <TextModifier
                text="welcome to my"
                className="font-light tracking-wide text-5xl"
                baseWeight={400}
                maxWeight={900}
                maxScale={1.3}
                maxOffset={5}
                animationSpeed={0.2}
                proximityRadius={100}
              />
            )}
          </div>

          {/* Main PORTFOLIO text - larger and more prominent, also lifted */}
          <div className="flex items-center justify-center">
            {isMobile ? (
              // Simple text for mobile - no special effects
              <div
                className="font-extrabold tracking-wider text-6xl text-white"
              >
                PORTFOLIO.
              </div>
            ) : (
              // TextModifier with special effects for desktop
              <TextModifier
                text="PORTFOLIO."
                className="font-extrabold tracking-wider text-8xl"
                baseWeight={400}
                maxWeight={900}
                maxScale={1.3}
                maxOffset={15}
                animationSpeed={0.2}
                proximityRadius={150}
              />
            )}
          </div>
        </div>

                {/* Folders and Files (right side) */}
        <div
          className="absolute flex flex-col items-center z-10"
          style={{
            right: isMobile ? pxToVw(16) : pxToVw(32), // Closer to edge on mobile
            top: isMobile ? pxToVh(48) : pxToVh(96),   // Higher positioning on mobile
            gap: isMobile ? pxToVh(16) : pxToVh(32),   // Smaller gap on mobile
          }}
        >
          {/* Draggable folders and trash */}
          {items.map((item) => (
            <motion.div
              key={item.id}
              drag
              dragMomentum={false}
              style={{
                x: item.x,
                y: item.y,
                zIndex: item.z,
                position: 'relative',
                marginBottom: pxToVh(16), // Convert mb-4 (16px) to viewport height units
              }}
              onDragStart={() => handleDragStart(item.id)}
              onDragEnd={(event, info) => handleDragEnd(item.id, event, info)}
              onMouseEnter={() => { setHoveredId(item.id); setCursorType("pointinghand"); }}
              onMouseLeave={() => { setHoveredId(null); setCursorType("normal"); }}
              className="flex flex-col items-center select-none"
              onClick={() => handleFolderClick(item)}
            >
              {/* All items (folders and trash) rendered the same way */}
              {/* Animated highlight background on hover */}
              <AnimatePresence>
                {hoveredId === item.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center z-0 pointer-events-none"
                    style={{
                      width: pxToVw(80),
                      height: pxToVh(80)
                    }}
                  >
                    <div
                      className="bg-gray-300 border border-gray-400"
                      style={{
                        width: pxToVw(80), // Convert w-20 (80px) to viewport width units
                        height: pxToVh(64), // Convert h-16 (64px) to viewport height units
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Folder/trash icon */}
              <Image
                src={item.icon}
                alt={item.label}
                width={isMobile ? 40 : 64}
                height={isMobile ? 35 : 56}
                className="object-contain z-10 pointer-events-none"
                style={{
                  width: isMobile ? pxToVw(40) : pxToVw(64), // Smaller icons on mobile
                  height: isMobile ? pxToVh(35) : pxToVh(56), // Smaller icons on mobile
                }}
              />
                              {/* Animated blue label highlight on hover */}
                <div className="relative z-10 flex flex-col items-center w-full">
                  <AnimatePresence>
                    {hoveredId === item.id && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0.7 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0.7 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-1/2 -translate-x-1/2 top-1 w-full bg-[#007aff] shadow"
                        style={{
                          height: pxToVh(24), // Convert height: 24 to viewport height units
                          zIndex: 1,
                          padding: `0 ${pxToVw(4)}`, // Convert px-1 (4px) to viewport width units
                        }}
                      />
                    )}
                  </AnimatePresence>
                  <span
                    className={`text-center select-none rounded-sm z-10 drop-shadow-sm ${
                      isMobile ? 'text-xs' : 'text-sm'
                    } ${hoveredId === item.id ? 'text-white' : 'text-black'}`}
                    style={{
                      textShadow: hoveredId === item.id ? '0 1px 2px #007aff, 0 0px 8px #0002' : '0 1px 2px #fff, 0 0px 8px #0002',
                      position: 'relative',
                      marginTop: pxToVh(4), // Convert mt-1 (4px) to viewport height units
                      padding: `0 ${pxToVw(4)}`, // Convert px-1 (4px) to viewport width units
                    }}
                  >
                    {item.label}
                  </span>
                </div>
            </motion.div>
          ))}
        </div>


        {/* Dock (bottom center) */}
        <Dock />

        {/* Multiple Explorer Modals - render all open modals */}
        {modals.map((modal) => (
          <ExplorerModal
            key={modal.id}
            isOpen={modal.isOpen}
            onClose={() => closeModal(modal.id)}
            selectedProjectId={selectedProjectIds[modal.id] || modal.projectId}
            onSelectProject={(projectId) => handleProjectSelection(modal.id, projectId)}
            initialPosition={modal.position}
            customZIndex={modal.zIndex}
          />
        ))}
      </div>
    </>
  );
}

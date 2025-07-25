'use client';
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import MenuBar from "@/components/ui/MenuBar";
import React, { useState } from "react";
import Dock from "@/components/ui/Dock";
import Image from "next/image";
import ExplorerModal from "@/components/ui/ExplorerModal";
// Import the Starfield animated background
import Starfield from "@/components/ui/Starfield";
import { useCursor } from "@/components/ui/useCursor"; // Import custom cursor hook

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
  // State for folder/trash positions and z-index
  const [items, setItems] = useState([
    { id: 1, label: "Project 02 (Simplingo)", icon: "/media/Icons/appleFolder.avif", x: -350, y: 0, z: 1, type: 'folder', projectId: 2 },
    { id: 2, label: "Project 01 (AbsolutMess)", icon: "/media/Icons/appleFolder.avif", x: -120, y: 120, z: 1, type: 'folder', projectId: 1 },
    { id: 3, label: "Project 03 (Leafpress)", icon: "/media/Icons/appleFolder.avif", x: -220, y: 240, z: 1, type: 'folder', projectId: 3 },
    { id: 4, label: "Don't Look", icon: "/media/Icons/appleTrash.avif", x: 0, y: 360, z: 1, type: 'trash' },
  ]);

  // Track which folder is hovered for custom hover effect
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // State for multiple ExplorerModals - array of modal states
  const [modals, setModals] = useState<ModalState[]>([]);

  // State for currently selected project in each modal
  const [selectedProjectIds, setSelectedProjectIds] = useState<{ [modalId: string]: number }>({});

  const setCursorType = useCursor(); // Get cursor setter

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

  // Handler for drag start
  const handleDragStart = (id: number) => {
    setItems((prev) => prev.map(item => item.id === id ? { ...item, z: 10 } : { ...item, z: 1 }));
  };

  // Handler for drag end
  const handleDragEnd = (
    id: number,
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setItems((prev) => prev.map(item =>
      item.id === id ? { ...item, x: item.x + info.offset.x, y: item.y + info.offset.y, z: 1 } : item
    ));
  };

  // Handler for folder click - now supports multiple modals
  const handleFolderClick = (item: typeof items[number]) => {
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
      <div className="flex flex-col items-center justify-center w-full h-full relative">
        {/* --- Animated Starfield Background Layer --- */}
        <Starfield />
        {/* --- Background Image: covers entire viewport, sits behind all content --- */}
        <div
          className="portfolio-bg"
          aria-hidden="true"
        />
        {/* Folders and Files (right side) */}
        <div className="absolute right-8 top-24 flex flex-col items-center gap-8 z-10">
          {/* Draggable folders and trash */}
          {items.map((item) => (
            <motion.div
              key={item.id}
              drag
              dragMomentum={false}
              style={{ x: item.x, y: item.y, zIndex: item.z, position: 'relative' }}
              onDragStart={() => handleDragStart(item.id)}
              onDragEnd={(event, info) => handleDragEnd(item.id, event, info)}
              onMouseEnter={() => { setHoveredId(item.id); setCursorType("pointinghand"); }}
              onMouseLeave={() => { setHoveredId(null); setCursorType("normal"); }}
              className="mb-4 flex flex-col items-center select-none"
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
                    style={{ width: 80, height: 80 }}
                  >
                    <div className="w-20 h-16 bg-white/15 border border-white/30" />
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Folder/trash icon */}
              <Image src={item.icon} alt={item.label} width={64} height={56} className="w-16 h-14 object-contain z-10 pointer-events-none" />
              {/* Animated blue label highlight on hover */}
              <div className="relative z-10 flex flex-col items-center w-full">
                <AnimatePresence>
                  {hoveredId === item.id && (
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0.7 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0.7 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 -translate-x-1/2 top-0 w-full h-full px-1 bg-[#007aff] shadow"
                      style={{ height: 18, zIndex: 1 }}
                    />
                  )}
                </AnimatePresence>
                <span
                  className={`text-xs mt-1 text-center select-none px-1 rounded-sm z-10 text-white drop-shadow-sm`}
                  style={{textShadow: hoveredId === item.id ? '0 1px 2px #007aff, 0 0px 8px #0002' : '0 1px 2px #fff, 0 0px 8px #0002', position: 'relative'}}
                >
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Center Welcome Message */}
        {/* Centered absolutely in the viewport, above all other elements */}
        {/* Small welcome text with blend mode for color inversion and strong text shadow fallback */}
        <div
            className="fixed inset-0 flex flex-col items-center justify-center text-3xl text-white drop-shadow mb-60 font-medium font-sans"
            style={{textShadow: '0 2px 16px #000, 0 1px 0 #fff' , zIndex: 2 }}
          >
            welcome to my
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

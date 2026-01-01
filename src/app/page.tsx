'use client';
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import MenuBar from "@/components/ui/MenuBar";
import React, { useState } from "react";
import Dock from "@/components/ui/Dock";
import Image from "next/image";
import ExplorerModal from "@/components/ui/ExplorerModal";
import MacWindowModal from "@/components/ui/MacWindowModal";
// Import the Starfield animated background
import { useCursor } from "@/components/ui/useCursor"; // Import custom cursor hook
// Import the TextModifier component for interactive text effects
import TextModifier from "@/components/ui/TextModifier";
// Import responsive positioning hook
import { useResponsivePositioning, pxToVw, pxToVh } from "@/components/ui/useResponsivePositioning";
// Import mobile detection hook
import { useMobileDetection } from "@/components/ui/useMobileDetection";
// Import images to get intrinsic sizes for exact-fit modals
// Using direct imports to access width/height metadata
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Next.js image import types
import aboutMeImg1 from "../../public/SyedMohammadAnas/aboutMeModal1.png";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Next.js image import types
import aboutMeImg2 from "../../public/SyedMohammadAnas/aboutMeModal2.png";

// Interface for modal state management
interface ModalState {
  id: string; // Unique identifier for each modal
  projectId: number; // Which project this modal represents
  position: { x: number; y: number }; // Modal position
  isOpen: boolean; // Whether this modal is open
  zIndex: number; // For proper stacking
  // Flag to indicate if this modal should display certificates instead of project files
  isCertificates?: boolean;
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
      { id: 1, label: "Project 2", icon: "/media/Icons/appleFolder.avif", x: -450, y: 0, z: 1, type: 'folder', projectId: 2 },
      { id: 2, label: "Project 01", icon: "/media/Icons/appleFolder.avif", x: -270, y: 120, z: 1, type: 'folder', projectId: 1 },
      { id: 3, label: "Project 03", icon: "/media/Icons/appleFolder.avif", x: -500, y: 270, z: 1, type: 'folder', projectId: 3 },
      { id: 4, label: "Don't Look", icon: "/media/Icons/appleTrash.avif", x: -10, y: 360, z: 1, type: 'trash' },
      // PDF file that opens resume in new tab when clicked
      { id: 5, label: "SyedResume.pdf", icon: "/media/Icons/paperLogo.avif", x: -1600, y: -57, z: 1, type: 'file' },
      { id: 6, label: "About Me", icon: "/media/Icons/appleFolder.avif", x: -1400, y: 0, z: 1, type: 'folder' },
      // Hackathon Certificates folder - displays certificates in organized grid view
      { id: 7, label: "Hackathon Certificates", icon: "/media/Icons/appleFolder.avif", x: -1550, y: 120, z: 1, type: 'folder', isCertificates: true },
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
  const createModal = (projectId: number, isCertificates?: boolean) => {
    const modalId = `modal-${projectId}-${Date.now()}`; // Unique ID
    const newModal: ModalState = {
      id: modalId,
      projectId,
      position: generateRandomPosition(),
      isOpen: true,
      zIndex: 100 + modals.length, // Stack modals properly
      isCertificates: isCertificates,
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

    // Check for Hackathon Certificates folder first (special case)
    if (item.type === 'folder' && item.label === 'Hackathon Certificates') {
      // Check if a modal for certificates already exists
      const existingModal = modals.find(modal => modal.isCertificates);

      if (existingModal) {
        // If modal exists, bring it to front
        bringModalToFront(existingModal.id);
      } else {
        // If no modal exists, create a new one with certificates flag
        // Using projectId 999 for certificates to distinguish from regular projects
        createModal(999, true);
      }
    } else if (item.type === 'folder' && item.label === 'About Me') {
      // Open the three About Me modals on desktop as well
      setAboutModalOneOpen(true);
      setAboutModalTwoOpen(true);
      setAboutModalTextOpen(true);
    } else if (item.type === 'folder' && item.projectId) {
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
    } else if (item.type === 'folder' && item.label === 'Hackathon Certificates') {
      // Open the Hackathon Certificates modal
      createModal(0, true); // Create a new modal with isCertificates set to true
    }
  };

  // Handler for project selection within a modal
  const handleProjectSelection = (modalId: string, projectId: number) => {
    setSelectedProjectIds(prev => ({ ...prev, [modalId]: projectId }));
  };

  // MOBILE-ONLY: open resume link in a new tab
  // Keeping the URL consistent with desktop file behavior for "SyedResume.pdf"
  const openResumeInNewTab = () => {
    const pdfUrl = "https://docs.google.com/document/d/13hupz9yVdmgTIzqTdMkv8YybdTJGkZnJ/edit?usp=sharing&ouid=101811674702433936195&rtpof=true&sd=true";
    window.open(pdfUrl, '_blank');
  };

  // -------------------------
  // ABOUT ME: Three lightweight Mac-style modals (two images + one text)
  // -------------------------
  const [aboutModalOneOpen, setAboutModalOneOpen] = useState(false);
  const [aboutModalTwoOpen, setAboutModalTwoOpen] = useState(false);
  const [aboutModalTextOpen, setAboutModalTextOpen] = useState(false);

  // Z-index management for About Me modals
  const [aboutModalOneZIndex, setAboutModalOneZIndex] = useState(121);
  const [aboutModalTwoZIndex, setAboutModalTwoZIndex] = useState(122);
  const [aboutModalTextZIndex, setAboutModalTextZIndex] = useState(123);

  // Function to bring About Me modal to front
  const bringAboutModalToFront = (modalType: 'one' | 'two' | 'text') => {
    const maxZ = Math.max(aboutModalOneZIndex, aboutModalTwoZIndex, aboutModalTextZIndex);
    if (modalType === 'one' && aboutModalOneZIndex < maxZ) {
      setAboutModalOneZIndex(maxZ + 1);
    } else if (modalType === 'two' && aboutModalTwoZIndex < maxZ) {
      setAboutModalTwoZIndex(maxZ + 1);
    } else if (modalType === 'text' && aboutModalTextZIndex < maxZ) {
      setAboutModalTextZIndex(maxZ + 1);
    }
  };

  // Track viewport to fit image modals inside
  const [viewport, setViewport] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  React.useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Fit an image into the viewport while keeping aspect ratio and adding safe margins
  const getFittedSize = (origW: number, origH: number) => {
    const vw = viewport.w || (typeof window !== 'undefined' ? window.innerWidth : 0);
    const vh = viewport.h || (typeof window !== 'undefined' ? window.innerHeight : 0);
    // Safe margins (account for menu/dock on mobile a bit more)
    const marginW = isMobile ? 24 : 48;
    const marginH = isMobile ? 200 : 140;
    // Tight visual caps so windows feel small like the reference
    const capW = isMobile ? vw * 0.72 : vw * 0.34;
    const capH = isMobile ? vh * 0.40 : vh * 0.36;
    const maxW = Math.max(160, Math.min(vw - marginW, capW));
    const maxH = Math.max(140, Math.min(vh - marginH, capH));
    const scale = Math.min(maxW / origW, maxH / origH, 1); // never upscale
    const w = Math.floor(origW * scale);
    const h = Math.floor(origH * scale);
    return { w, h };
  };

  // Compute sizes for both images using intrinsic metadata
  const aboutImg1Size = React.useMemo(() => getFittedSize(aboutMeImg1.width-52, aboutMeImg1.height), [viewport, isMobile]);
  const aboutImg2Size = React.useMemo(() => getFittedSize(aboutMeImg2.width-133, aboutMeImg2.height), [viewport, isMobile]);

  // Utility: compute window-centered positions with small offsets so windows are visible together
  const getCenteredPosition = (width: number, height: number, offsetX = 0, offsetY = 0) => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
    const x = Math.max(0, (vw - width) / 2 + offsetX);
    const y = Math.max(0, (vh - height) / 2 + offsetY);
    return { x, y };
  };

  // Open all three About Me modals with staggered positions
  const handleOpenAboutMe = () => {
    setAboutModalOneOpen(true);
    setAboutModalTwoOpen(true);
    setAboutModalTextOpen(true);
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
            backgroundImage: 'url(/backgroundImages/mobileBackground2.png)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Desktop/PC Background Image - only show on desktop */}
      {!isMobile && (
        <div
          className="fixed inset-0 w-full h-full -z-10 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/backgroundImages/pcBackground.jpg)',
          }}
          aria-hidden="true"
        />
      )}


      <div className="flex flex-col items-center justify-center w-full h-full relative">
        {/* --- Animated Starfield Background Layer --- */}

        {/* Centered Portfolio Title with TextModifier Effects, lifted up - hidden on mobile */}
        {!isMobile && (
          <div
            className="fixed inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
            style={{
              marginTop: pxToVh(-72)
            }}
          >
            {/* Welcome text - smaller and positioned above, also lifted */}
            <div style={{ marginTop: pxToVh(68) }}>
              <TextModifier
                text="welcome to my"
                className="font-light tracking-wide text-6xl text-white"
                baseWeight={400}
                maxWeight={900}
                maxScale={1.3}
                maxOffset={5}
                animationSpeed={0.2}
                proximityRadius={100}
              />
            </div>

            {/* Main PORTFOLIO text - larger and more prominent, also lifted */}
            <div className="flex items-center justify-center">
              <TextModifier
                text="PORTFOLIO."
                className="font-extrabold tracking-wider text-9xl text-white"
                baseWeight={400}
                maxWeight={900}
                maxScale={1.3}
                maxOffset={15}
                animationSpeed={0.2}
                proximityRadius={150}
              />
            </div>
          </div>
        )}

        {/* MOBILE-ONLY: Two standalone icons (About Me and SyedResume) rendered on-screen, not in Dock */}
        {isMobile && (
          <div
            className="fixed left-7 top-10 z-30 flex flex-row items-center gap-5 select-none"
            aria-label="Mobile quick icons"
          >
            {/* About Me (folder icon) */}
            <button
              type="button"
              className="flex flex-col items-center active:opacity-80 focus:outline-none"
              aria-label="About Me"
              onClick={handleOpenAboutMe}
            >
              <div
                className="w-[80px] h-[80px] flex items-center justify-center rounded-xl overflow-hidden"
                style={{ width: '80px', height: '80px' }}
              >
                <Image
                  src="/media/Icons/appleFolder.avif"
                  alt="About Me"
                  width={80}
                  height={80}
                  className="block w-full h-full object-contain object-center"
                  quality={100}
                  priority
                  style={{ width: '80px', height: '80px' }}
                />
              </div>
              <span className="mt-1 text-sm font-bold text-black drop-shadow-sm">About Me</span>
            </button>

            {/* SyedResume (file icon) */}
            <button
              type="button"
              onClick={openResumeInNewTab}
              className="flex flex-col items-center active:opacity-80 focus:outline-none"
              aria-label="Open Syed Resume"
            >
              <div
                className="w-[80px] h-[80px] flex items-center justify-center rounded-xl overflow-hidden"
                style={{ width: '80px', height: '80px' }}
              >
                <Image
                  src="/media/Icons/paperLogo.avif"
                  alt="Syed Resume"
                  width={80}
                  height={80}
                  className="block w-full h-full object-contain object-center"
                  quality={100}
                  priority
                  style={{ width: '80px', height: '80px' }}
                />
              </div>
              <span className="mt-1 text-sm font-bold text-black drop-shadow-sm">SyedResume.pdf</span>
            </button>
          </div>
        )}

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
                      className="bg-blue-200/30 border border-blue-300/50"
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
                    className={`text-center select-none rounded-sm z-10 drop-shadow-lg font-bold ${
                      isMobile ? 'text-xs' : 'text-sm'
                    } ${hoveredId === item.id ? 'text-white' : 'text-white'}`}
                    style={{
                      textShadow: hoveredId === item.id ? '0 2px 4px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.9)' : '0 2px 4px rgba(0, 0, 0, 0.7), 0 1px 2px rgba(0, 0, 0, 0.8)',
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
          <div
            key={modal.id}
            onMouseDown={() => bringModalToFront(modal.id)}
            onClick={() => bringModalToFront(modal.id)}
          >
            <ExplorerModal
              isOpen={modal.isOpen}
              onClose={() => closeModal(modal.id)}
              selectedProjectId={selectedProjectIds[modal.id] || modal.projectId}
              onSelectProject={(projectId) => handleProjectSelection(modal.id, projectId)}
              initialPosition={modal.position}
              customZIndex={modal.zIndex}
              isCertificates={modal.isCertificates}
            />
          </div>
        ))}

        {/* ABOUT ME: Modal 1 - Image with title "This is" */}
        <div
          onMouseDown={() => bringAboutModalToFront('one')}
          onClick={() => bringAboutModalToFront('one')}
        >
          <MacWindowModal
            isOpen={aboutModalOneOpen}
            onClose={() => setAboutModalOneOpen(false)}
            title="This is"
            width={aboutImg1Size.w}
            height={aboutImg1Size.h}
            initialPosition={getCenteredPosition(aboutImg1Size.w, aboutImg1Size.h, -260, -60)}
            customZIndex={aboutModalOneZIndex}
          >
            {/* Image content: no extra padding/background; window should hug the image */}
            <div className="w-full h-full flex items-center justify-center bg-transparent">
              <Image
                src="/SyedMohammadAnas/aboutMeModal1.png"
                alt="About Me Photo 1"
                width={aboutImg1Size.w}
                height={aboutImg1Size.h}
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </MacWindowModal>
        </div>

        {/* ABOUT ME: Modal 2 - Image with title "Syed Mohammad Anas" */}
        <div
          onMouseDown={() => bringAboutModalToFront('two')}
          onClick={() => bringAboutModalToFront('two')}
        >
          <MacWindowModal
            isOpen={aboutModalTwoOpen}
            onClose={() => setAboutModalTwoOpen(false)}
            title="Syed Mohammad Anas"
            width={aboutImg2Size.w}
            height={aboutImg2Size.h}
            initialPosition={getCenteredPosition(aboutImg2Size.w, aboutImg2Size.h, 60, -60)}
            customZIndex={aboutModalTwoZIndex}
          >
            <div className="w-full h-full flex items-center justify-center bg-transparent">
              <Image
                src="/SyedMohammadAnas/aboutMeModal2.png"
                alt="About Me Photo 2"
                width={aboutImg2Size.w}
                height={aboutImg2Size.h}
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </MacWindowModal>
        </div>

        {/* ABOUT ME: Modal 3 - Text file style with title "aboutMe.txt" */}
        <div
          onMouseDown={() => bringAboutModalToFront('text')}
          onClick={() => bringAboutModalToFront('text')}
        >
          <MacWindowModal
            isOpen={aboutModalTextOpen}
            onClose={() => setAboutModalTextOpen(false)}
            title="aboutMe.txt"
            width={260}
            height={360}
            initialPosition={getCenteredPosition(560, 360, 140, 80)}
            customZIndex={aboutModalTextZIndex}
          >
            {/* Simple text-style content */}
            <div className="w-full h-full p-4 text-sm leading-6 text-gray-800 font-medium bg-white">
              <p>
                Hi, I&apos;m <b><u>Syed Mohammad Anas</u></b> — a frontend-focused developer who loves
                crafting smooth, delightful user experiences with <b>Next.js</b>, <b>TypeScript</b>,
                <b>Tailwind</b>, and <b>Framer Motion</b>. I enjoy building responsive, pixel-sharp
                interfaces, paying attention to <b>micro-interactions</b>, <b>performance</b>, and
                <b> accessibility</b>. Outside of code, I explore <b>design</b>, <b>visuals</b>, and <b>quality of
                life details</b> that inspire creative UI.
              </p>
            </div>
          </MacWindowModal>
        </div>
      </div>
    </>
  );
}

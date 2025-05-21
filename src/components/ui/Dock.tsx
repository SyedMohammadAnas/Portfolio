import React from "react";
import { motion } from "framer-motion";

// ICONS DATA ARRAY - Only use icons that exist in /public/media
const dockIcons = [
  { src: "/media/appleSafari.png", alt: "Safari" },
  { src: "/media/appleMusic.png", alt: "Music" },
  { src: "/media/appleMessages.png", alt: "Messages" },
  { src: "/media/appleNotes.png", alt: "Notes" },
  { src: "/media/appleReminders.png", alt: "Reminders" },
  { src: "/media/appleMails.png", alt: "Mail" },
  { src: "/media/appleAppstore.png", alt: "App Store" },
  { src: "/media/appleHome.png", alt: "Home" },
  { src: "/media/appleMaps.png", alt: "Maps" },
  { src: "/media/appleFacetime.png", alt: "FaceTime" },
  // Optionally add folder and trash if you want them in the dock
  { src: "/media/appleFolder.png", alt: "Folder", divider: true },
  { src: "/media/appleTrash.png", alt: "Trash" },
];

/**
 * Dock component replicating the MacBook dock visually and interactively.
 * - Dark glassy background, white border, strong shadow
 * - Rectangular with rounded corners
 * - Vertical divider before folder/trash
 * - Scale + lift animation on hover
 * - Responsive and extensible
 */
const Dock: React.FC = () => {
  return (
    <div
      className="fixed left-1/2 bottom-0 -translate-x-1/2 z-50 flex items-end px-4 py-2"
      style={{ minWidth: 340, maxWidth: '96vw' }}
    >
      {/* Dock background */}
      <div
        className="flex items-end gap-2 w-full px-4 py-2 rounded-2xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] bg-black/40 backdrop-blur-xl"
        style={{
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45), 0 1.5px 0 0 rgba(255,255,255,0.18) inset',
          borderBottomLeftRadius: 22,
          borderBottomRightRadius: 22,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
        }}
      >
        {/* ICONS ROW */}
        {dockIcons.map((icon) => {
          // Insert divider before the first icon with divider: true
          const showDivider = icon.divider === true;
          return (
            <React.Fragment key={icon.alt}>
              {showDivider && (
                <div
                  className="mx-2 h-10 w-px bg-white/30 rounded-full self-center"
                  aria-hidden="true"
                />
              )}
              <motion.div
                // Framer Motion: scale and lift on hover, slow and smooth
                whileHover={{ scale: 1.45, y: -18 }}
                transition={{ type: "spring", stiffness: 170, damping: 18, duration: 0.5 }}
                className="flex flex-col items-center cursor-pointer select-none"
                style={{ minWidth: 44 }}
              >
                {/* ICON IMAGE */}
                <img
                  src={icon.src}
                  alt={icon.alt}
                  className="w-11 h-11 object-contain drop-shadow-lg transition-all"
                  draggable={false}
                  style={{ userSelect: 'none' }}
                />
                {/* ICON LABEL (hidden by default) */}
                {/* <span className="text-xs mt-1 text-gray-200 drop-shadow">{icon.alt}</span> */}
              </motion.div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;

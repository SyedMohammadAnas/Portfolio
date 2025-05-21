import React from "react";
import { motion } from "framer-motion";

// ICONS DATA ARRAY - Only use .avif icons that exist in /public/media/Icons
const dockIcons = [
  { src: "/media/Icons/appleFinder.avif", alt: "Finder" },
  { src: "/media/Icons/appleSafari.avif", alt: "Safari" },
  { src: "/media/Icons/appleMusic.avif", alt: "Music" },
  { src: "/media/Icons/appleMessages.avif", alt: "Messages" },
  { src: "/media/Icons/appleNotes.avif", alt: "Notes" },
  { src: "/media/Icons/appleReminders.avif", alt: "Reminders" },
  { src: "/media/Icons/appleMails.avif", alt: "Mail" },
  { src: "/media/Icons/appleAppstore.avif", alt: "App Store" },
  { src: "/media/Icons/appleMaps.avif", alt: "Maps" },
  { src: "/media/Icons/appleFacetime.avif", alt: "FaceTime" },
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
  return (
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
          return (
            <React.Fragment key={icon.alt}>
              {showDivider && (
                // Framer-like divider (vertical line)
                <div
                  className="mx-2 h-10 w-px bg-white/30 rounded-full self-center"
                  aria-hidden="true"
                />
              )}
              <motion.div
                // Framer Motion: scale and lift on hover, but avoid upscaling beyond native resolution
                whileHover={{ scale: 1.3, y: -20 }}
                transition={{ type: "spring", stiffness: 200, damping: 18, duration: 0.3 }}
                className="flex flex-col items-center cursor-pointer select-none"
                style={{ width: 50, height: 50, minWidth: 44, minHeight: 44 }}
              >
                {/* ICON IMAGE - Framer-like rendering for sharpness */}
                <div className="w-full h-full flex items-center justify-center rounded-xl overflow-hidden" style={{ background: 'transparent' }}>
                  <img
                    src={icon.src}
                    alt={icon.alt}
                    width={50}
                    height={50}
                    className="block w-full h-full object-fill object-center"
                    draggable={false}
                    style={{ userSelect: 'none', imageRendering: 'auto', borderRadius: 'inherit' }}
                  />
                </div>
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

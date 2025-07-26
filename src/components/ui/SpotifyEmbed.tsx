import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursor } from "./useCursor"; // Import custom cursor hook

// Interface for SpotifyEmbed component props
interface SpotifyEmbedProps {
  isOpen: boolean; // Controls visibility of the embed
  onClose: () => void; // Function to close the embed
}

/**
 * SpotifyEmbed component that displays a Spotify track embed
 * - Positioned above the dock with glassy styling
 * - Smooth animations for entrance/exit
 * - Responsive design with updated dimensions
 * - Custom cursor integration
 */
const SpotifyEmbed: React.FC<SpotifyEmbedProps> = ({ isOpen, onClose }) => {
  const setCursorType = useCursor(); // Get cursor setter

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed left-105 bottom-32 z-40"
          style={{
            width: '60%',
            maxWidth: '350px',
            minWidth: '300px',
            transform: 'translateX(-35%)'
          }}
        >
          {/* Close button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="w-6 h-6 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xs hover:bg-black/80 transition-colors duration-200"
              onMouseEnter={() => setCursorType("pointinghand")}
              onMouseLeave={() => setCursorType("normal")}
              aria-label="Close Spotify embed"
            >
              ×
            </button>
          </div>

          {/* Spotify Embed Container */}
          <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] overflow-hidden">
            <iframe
              data-testid="embed-iframe"
              style={{ borderRadius: '12px' }}
              src="https://open.spotify.com/embed/track/6J9FgTr3z44Bw6ABeVL415?utm_source=generator&theme=0"
              width="100%"
              height="152"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block"
              title="Spotify Track Embed"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpotifyEmbed;

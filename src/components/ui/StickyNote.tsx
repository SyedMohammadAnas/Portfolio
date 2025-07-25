import React, { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useCursor } from "./useCursor";

/**
 * StickyNote - A sticky note styled To-Do list for the desktop UI.
 * - Animated in with Framer Motion
 * - Uses Card for styling
 * - MacBook-style top bar with close dots and title
 * - Accepts onClose prop for closing
 * - Draggable within viewport, with custom drag cursor
 */
const StickyNote: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // Ref for the sticky note element
  const noteRef = useRef<HTMLDivElement>(null);
  // State for drag constraints
  const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  // Custom cursor setter
  const setCursorType = useCursor();
  // Track drag state
  const [isDragging, setIsDragging] = useState(false);

  // Update drag constraints to keep note within viewport
  useEffect(() => {
    function updateConstraints() {
      if (noteRef.current) {
        const note = noteRef.current;
        const rect = note.getBoundingClientRect();
        setConstraints({
          left: -rect.left,
          top: -rect.top,
          right: window.innerWidth - rect.right,
          bottom: window.innerHeight - rect.bottom,
        });
      }
    }
    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  return (
    <motion.div
      ref={noteRef}
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="absolute left-8 top-16 z-30"
      drag
      dragConstraints={constraints}
      dragMomentum={false}
      dragElastic={0}
      // Cursor logic for drag/hover
      onMouseEnter={() => !isDragging && setCursorType("openhand")}
      onMouseLeave={() => { setCursorType("normal"); setIsDragging(false); }}
      onDragStart={() => { setCursorType("closedhand"); setIsDragging(true); }}
      onDragEnd={() => { setCursorType("openhand"); setIsDragging(false); }}
    >
      {/* Card container for the sticky note */}
      <Card className="bg-yellow-200 border-yellow-300 shadow-lg rounded-sm w-80 p-0 font-mono overflow-hidden">
        {/* MacBook-style top bar */}
        <div className="flex items-center h-7 px-3 border-b border-white-300 bg-gradient-to-b from-yellow-100/80 to-yellow-200/60 relative select-none">
          {/* Three colored dots, all close the sticky note */}
          <div className="flex items-center gap-1">
            <button
              aria-label="Close"
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/10 shadow hover:scale-110 transition-transform"
              style={{ boxShadow: '0 1px 2px #0002' }}
            />
            <button
              aria-label="Minimize"
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10 shadow hover:scale-110 transition-transform"
              style={{ boxShadow: '0 1px 2px #0002' }}
            />
            <button
              aria-label="Maximize"
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10 shadow hover:scale-110 transition-transform"
              style={{ boxShadow: '0 1px 2px #0002' }}
            />
          </div>
          {/* Centered title */}
          <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
            <span className="text-xs text-gray-700 font-semibold tracking-tight">to-do.txt</span>
          </div>
        </div>
        {/* Sticky note content */}
        <div className="p-4">
          <div className="font-bold text-base mb-2">To do:</div>
          <ul className="text-sm space-y-1">
            <li>Land my dream job</li>
            <li className="line-through">Drink water</li>
            <li>Move to the US</li>
            <li>Finish uni without losing my mind</li>
            <li>Build that banger spotify playlist</li>
            <li>World domination</li>
            <li className="line-through">Get really good at making pasta</li>
            <li>Travel somewhere new every year</li>
          </ul>
        </div>
      </Card>
    </motion.div>
  );
};

export default StickyNote;

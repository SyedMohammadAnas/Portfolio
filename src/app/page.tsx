'use client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FileText, Trash2, User, Music, Globe, Info } from "lucide-react";
import MenuBar from "@/components/MenuBar";
import React, { useState } from "react";
import Dock from "@/components/ui/Dock";
import StickyNote from "@/components/ui/StickyNote";

// Main portfolio desktop page for Syed Mohammad Anas
export default function Home() {
  // State for folder/trash positions and z-index
  const [items, setItems] = useState([
    { id: 1, label: "Project 02 (Simplingo)", icon: "/media/Icons/appleFolder.avif", x: -350, y: 0, z: 1, type: 'folder' },
    { id: 2, label: "Project 01 (AbsolutMess)", icon: "/media/Icons/appleFolder.avif", x: -120, y: 120, z: 1, type: 'folder' },
    { id: 3, label: "Project 03 (Leafpress)", icon: "/media/Icons/appleFolder.avif", x: -220, y: 240, z: 1, type: 'folder' },
    { id: 4, label: "Don't Look", icon: "/media/Icons/appleTrash.avif", x: 0, y: 360, z: 1, isTrash: true, type: 'trash' },
  ]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  // Track which folder is hovered for custom hover effect
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  // Handler for drag start
  const handleDragStart = (id: number) => {
    setDraggingId(id);
    setItems((prev) => prev.map(item => item.id === id ? { ...item, z: 10 } : { ...item, z: 1 }));
  };
  // Handler for drag end
  const handleDragEnd = (id: number, event: any, info: any) => {
    setDraggingId(null);
    setItems((prev) => prev.map(item =>
      item.id === id ? { ...item, x: item.x + info.offset.x, y: item.y + info.offset.y, z: 1 } : item
    ));
  };

  return (
    <>
      {/* MacOS-style Menu Bar */}
      <MenuBar />
      <div className="flex flex-col items-center justify-center w-full h-full relative">
        {/* --- Background Image: covers entire viewport, sits behind all content --- */}
        <div
          className="portfolio-bg"
          aria-hidden="true"
        />
        {/* Sticky Note (To-Do) extracted as a component */}
        <StickyNote />

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
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="mb-4 flex flex-col items-center cursor-pointer group select-none"
            >
              {/* Custom MacOS-style hover effect for folders */}
              {item.type === 'folder' ? (
                <>
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
                  {/* Folder icon */}
                  <img src={item.icon} alt={item.label} className="w-16 h-14 object-contain z-10 pointer-events-none" />
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
                </>
              ) : (
                // Trash rendered as MacOS trash icon with label
                <>
                  <img src={item.icon} alt={item.label} className="w-14 h-16 object-contain z-10" />
                  <span className="text-xs mt-1 text-center text-black drop-shadow-sm select-none" style={{textShadow: '0 1px 2px #fff, 0 0px 8px #0002'}}>{item.label}</span>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* About Me and Resume (left side) */}
        <div className="absolute left-8 bottom-32 flex flex-col items-center gap-8 z-10">
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-white/90 border-gray-200 shadow-md rounded-xl w-32 flex flex-col items-center p-3">
              <User className="text-gray-700 w-10 h-10 mb-1" />
              <span className="text-xs mt-1 text-center">About Me</span>
            </Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-white/90 border-gray-200 shadow-md rounded-xl w-32 flex flex-col items-center p-3">
              <FileText className="text-gray-700 w-10 h-10 mb-1" />
              <span className="text-xs mt-1 text-center">Resume.pdf</span>
            </Card>
          </motion.div>
        </div>

        {/* Center Welcome Message */}
        {/* Centered absolutely in the viewport, above all other elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="fixed inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
        >
          {/* Small welcome text with blend mode for color inversion and strong text shadow fallback */}
          <div
            className="text-3xl text-white drop-shadow- mb-7.5 font-medium font-sans"
            style={{ mixBlendMode: 'difference', textShadow: '0 2px 16px #000, 0 1px 0 #fff' , zIndex: 2 }}
          >
            welcome to my
          </div>
          {/* Large, Cormorant Garamond Light Italic 'portfolio.' with blend mode and strong text shadow fallback */}
          <div
            className="text-[120px] text-white font-bold font-cormorant-garamond -mt-10 -mb-6"
            style={{ mixBlendMode: 'difference', textShadow: '0 4px 32px #000, 0 2px 0 #fff', zIndex: 2 }}
          >
            Portfolio.
          </div>
        </motion.div>

        {/* Dock (bottom center) */}
        <Dock />
      </div>
    </>
  );
}

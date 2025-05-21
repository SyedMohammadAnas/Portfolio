'use client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FileText, Trash2, User, Music, Globe, Info } from "lucide-react";
import MenuBar from "@/components/MenuBar";
import React, { useState } from "react";
import Dock from "@/components/ui/Dock";

// Main portfolio desktop page for Syed Mohammad Anas
export default function Home() {
  // State for folder/trash positions and z-index
  const [items, setItems] = useState([
    { id: 1, label: "Project 02 (Simplingo)", icon: "/media/appleFolder.png", x: 0, y: 0, z: 1, type: 'folder' },
    { id: 2, label: "Project 01 (AbsolutMess)", icon: "/media/appleFolder.png", x: 0, y: 120, z: 1, type: 'folder' },
    { id: 3, label: "Project 03 (Leafpress)", icon: "/media/appleFolder.png", x: 0, y: 240, z: 1, type: 'folder' },
    { id: 4, label: "Don't Look", icon: "/media/appleTrash.png", x: 0, y: 360, z: 1, isTrash: true, type: 'trash' },
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
        {/* Sticky Note (To-Do) */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="absolute left-8 top-8 z-10"
        >
          <Card className="bg-yellow-100/90 border-yellow-300 shadow-lg rounded-xl w-64 p-4 font-mono">
            <div className="font-bold text-base mb-2">To do:</div>
            <ul className="text-sm space-y-1">
              <li>Land my dream UX job</li>
              <li>Drink water</li>
              <li className="line-through text-gray-400">Move to the US</li>
              <li>Finish grad school without losing my mind</li>
              <li>Build that banger spotify playlist</li>
              <li>World domination</li>
              <li className="line-through text-gray-400">Get really good at making pasta</li>
              <li>Travel somewhere new every year</li>
            </ul>
          </Card>
        </motion.div>

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
                        <div className="w-20 h-16 bg-black/15 border border-black/10" />
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
                      className={`text-xs mt-1 text-center select-none px-1 rounded-sm z-10 ${hoveredId === item.id ? 'text-white' : 'text-black drop-shadow-sm'}`}
                      style={hoveredId === item.id ? {textShadow: '0 1px 2px #007aff, 0 0px 8px #0002', position: 'relative'} : {textShadow: '0 1px 2px #fff, 0 0px 8px #0002', position: 'relative'}}
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
          {/* Small welcome text */}
          <div className="text-4xl font-medium font-sans">welcome to my</div>
          {/* Large, Cormorant Garamond Light Italic 'portfolio.' with negative margin to reduce gap */}
          <div className="text-[150px] font-bold font-cormorant-garamond -mt-10 -mb-5">Portfolio.</div>
        </motion.div>

        {/* Dock (bottom center) */}
        <Dock />
      </div>
    </>
  );
}

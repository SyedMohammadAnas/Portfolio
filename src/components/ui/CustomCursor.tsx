"use client";
import React, { useEffect, useState, useContext } from "react";
import { CursorContext } from "./CursorContext";
import { useMobileDetection } from "./useMobileDetection";

// Cursor SVG paths
const cursorSVGs = {
  normal: "/media/customCursor/cursor.svg",
  pointinghand: "/media/customCursor/pointinghand.svg",
  openhand: "/media/customCursor/openhand.svg",
  closedhand: "/media/customCursor/closedhand.svg",
};

// CustomCursor component tracks mouse and renders the correct SVG
const CustomCursor: React.FC = () => {
  // Get cursor type from context
  const { cursorType } = useContext(CursorContext);
  // Mouse position state
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Choose SVG based on cursorType
  const svgSrc = cursorSVGs[cursorType] || cursorSVGs.normal;

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        pointerEvents: "none",
        zIndex: 99999,
        // Offset so the tip of the SVG arrow aligns with the pointer
        // Adjust these values if you change the SVG or its size
        transform: "translate(-8px, -5px)",
        width: 40,
        height: 40,
        userSelect: "none",
      }}
      aria-hidden="true"
    >
      {/* Render the SVG as an <img> for performance */}
      <img
        src={svgSrc}
        alt="custom cursor"
        draggable={false}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
};

export default CustomCursor;

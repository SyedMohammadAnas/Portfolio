import React, { useEffect, useState } from "react";
import { Wifi, BatteryFull, Sun } from "lucide-react";
import Image from "next/image";
// Import responsive positioning utilities
import { pxToVw, pxToVh } from "./useResponsivePositioning";
// Import mobile detection hook
import { useMobileDetection } from "./useMobileDetection";

// MenuBar component mimicking MacOS menu bar
const MenuBar: React.FC = () => {
  // State for live clock
  const [time, setTime] = useState<string>("");
  // Get mobile detection state
  const isMobile = useMobileDetection();

  useEffect(() => {
    // Function to update time in HH:MM AM/PM format
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      setTime(now.toLocaleTimeString([], options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      // Glassmorphism: semi-transparent, blurred, bordered, and shadowed
      className="fixed top-0 left-0 w-full flex items-center justify-between bg-white/20 backdrop-blur-lg shadow-md z-50 text-xs select-none"
      style={{
        fontFamily: 'var(--font-xanh-mono), monospace',
        height: isMobile ? pxToVh(24) : pxToVh(28), // Smaller height on mobile
        padding: `0 ${isMobile ? pxToVw(8) : pxToVw(16)}`, // Smaller padding on mobile
      }}
    >
      {/* Left: Apple Icon and Portfolio Title */}
      <div
        className="flex items-center font-bold text-black"
        style={{ gap: isMobile ? pxToVw(4) : pxToVw(8) }} // Smaller gap on mobile
      >
        {/* Apple icon on the far left */}
        <Image
          src="/media/IconsPNG/appleIcon.png"
          alt="Apple Icon"
          width={isMobile ? 16 : 20}
          height={isMobile ? 20 : 24}
          className="mr-2"
          style={{
            width: isMobile ? pxToVw(12) : pxToVw(16), // Smaller icon on mobile
            height: isMobile ? pxToVh(16) : pxToVh(20), // Smaller icon on mobile
          }}
        />
        {/* Portfolio title */}
        <span className={`font-bold text-black underline font-mono ${
          isMobile ? 'text-xs' : 'text-sm'
        }`}>
          {isMobile ? 'Anas\'s Portfolio' : 'Syed Mohammad Anas\'s Portfolio'}
        </span>
      </div>

      {/* Center: Navigation Links */}


      {/* Right: System Icons and Time */}
      <div
        className="flex items-center text-black"
        style={{ gap: isMobile ? pxToVw(6) : pxToVw(12) }} // Smaller gap on mobile
      >
        {/* System icons (WiFi, Sun, Battery) - hide some on mobile */}
        {!isMobile && (
          <Wifi
            className="text-black"
            style={{
              width: pxToVw(20), // Convert w-5 (20px) to viewport width units
              height: pxToVh(20), // Convert h-5 (20px) to viewport height units
            }}
          />
        )}
        <Sun
          className="text-black"
          style={{
            width: isMobile ? pxToVw(16) : pxToVw(20), // Smaller on mobile
            height: isMobile ? pxToVh(16) : pxToVh(20), // Smaller on mobile
          }}
        />
        <BatteryFull
          className="text-black"
          style={{
            width: isMobile ? pxToVw(16) : pxToVw(20), // Smaller on mobile
            height: isMobile ? pxToVh(16) : pxToVh(20), // Smaller on mobile
          }}
        />
        {/* Date and Time - simplified on mobile */}
        {!isMobile && (
          <span
            className="text-black font-mono text-black"
            style={{ marginLeft: pxToVw(8) }} // Convert ml-2 (8px) to viewport width units
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
        )}
        <span
          className={`font-mono text-black ${isMobile ? 'text-xs' : ''}`}
          style={{ marginLeft: isMobile ? pxToVw(2) : pxToVw(4) }} // Smaller margin on mobile
        >
          {time}
        </span>
      </div>
    </div>
  );
};

export default MenuBar;

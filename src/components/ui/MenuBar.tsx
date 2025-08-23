import React, { useEffect, useState } from "react";
import { Wifi, BatteryFull, Sun } from "lucide-react";
import Image from "next/image";
// Import responsive positioning utilities
import { pxToVw, pxToVh } from "./useResponsivePositioning";

// MenuBar component mimicking MacOS menu bar
const MenuBar: React.FC = () => {
  // State for live clock
  const [time, setTime] = useState<string>("");

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
        height: pxToVh(28), // Convert h-7 (28px) to viewport height units
        padding: `0 ${pxToVw(16)}`, // Convert px-4 (16px) to viewport width units
      }}
    >
      {/* Left: Apple Icon and Portfolio Title */}
      <div
        className="flex items-center font-bold text-black"
        style={{ gap: pxToVw(8) }} // Convert gap-2 (8px) to viewport width units
      >
        {/* Apple icon on the far left */}
        <Image
          src="/media/IconsPNG/appleIcon.png"
          alt="Apple Icon"
          width={20}
          height={24}
          className="mr-2"
          style={{
            width: pxToVw(16), // Convert w-4 (16px) to viewport width units
            height: pxToVh(20), // Convert h-5 (20px) to viewport height units
          }}
        />
        {/* Portfolio title */}
        <span className="font-bold text-black text-sm underline font-mono">Syed Mohammad Anas&apos;s Portfolio</span>
      </div>

      {/* Center: Navigation Links */}


      {/* Right: System Icons and Time */}
      <div
        className="flex items-center text-black"
        style={{ gap: pxToVw(12) }} // Convert gap-3 (12px) to viewport width units
      >
        {/* System icons (WiFi, Sun, Battery) */}
        <Wifi
          className="text-black"
          style={{
            width: pxToVw(20), // Convert w-5 (20px) to viewport width units
            height: pxToVh(20), // Convert h-5 (20px) to viewport height units
          }}
        />
        <Sun
          className="text-black"
          style={{
            width: pxToVw(20), // Convert w-5 (20px) to viewport width units
            height: pxToVh(20), // Convert h-5 (20px) to viewport height units
          }}
        />
        <BatteryFull
          className="text-black"
          style={{
            width: pxToVw(20), // Convert w-5 (20px) to viewport width units
            height: pxToVh(20), // Convert h-5 (20px) to viewport height units
          }}
        />
        {/* Date and Time */}
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
        <span
          className="font-mono text-black"
          style={{ marginLeft: pxToVw(4) }} // Convert ml-1 (4px) to viewport width units
        >
          {time}
        </span>
      </div>
    </div>
  );
};

export default MenuBar;

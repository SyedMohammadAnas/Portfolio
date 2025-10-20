import React, { useEffect, useState } from "react";
import { Wifi, BatteryLow, Sun } from "lucide-react";
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
      {/* Left: Portfolio Title Only on Mobile */}
      <div className="flex items-center font-bold text-black">
        {isMobile ? (
          // Mobile: Only show "Syed Anas's Portfolio" text
          <span className="font-bold text-black underline font-mono text-xs">
            Syed Anas&apos;s Portfolio
          </span>
        ) : (
          // Desktop: Show Apple icon + full title
          <div
            className="flex items-center"
            style={{ gap: pxToVw(8) }}
          >
            <Image
              src="/media/IconsPNG/appleIcon.png"
              alt="Apple Icon"
              width={20}
              height={24}
              className="mr-2"
              style={{
                width: pxToVw(16),
                height: pxToVh(20),
              }}
            />
            <span className="font-bold text-black underline font-mono text-sm">
              Syed Mohammad Anas&apos;s Portfolio
            </span>
          </div>
        )}
      </div>

      {/* Center: Navigation Links */}


      {/* Right: System Icons and Time */}
      <div
        className="flex items-center text-black"
        style={{ gap: isMobile ? pxToVw(6) : pxToVw(12) }} // Smaller gap on mobile
      >
        {/* Mobile: Only WiFi, Battery, and Time */}
        {isMobile ? (
          <>
            {/* WiFi Icon */}
            <Wifi
              className="text-black"
              style={{
                width: pxToVw(80),
                height: pxToVh(80),
              }}
            />
            {/* Battery Icon */}
            <BatteryLow
              className="text-black"
              style={{
                width: pxToVw(80),
                height: pxToVh(80),
              }}
            />
            {/* Time Only */}
            <span
              className="font-mono text-black text-md"
              style={{ marginLeft: pxToVw(2) }}
            >
              {time}
            </span>
          </>
        ) : (
          /* Desktop: Full system icons and date */
          <>
            <Wifi
              className="text-black"
              style={{
                width: pxToVw(20),
                height: pxToVh(20),
              }}
            />
            <Sun
              className="text-black"
              style={{
                width: pxToVw(20),
                height: pxToVh(20),
              }}
            />
            <BatteryLow
              className="text-black"
              style={{
                width: pxToVw(20),
                height: pxToVh(20),
              }}
            />
            <span
              className="text-black font-mono text-black"
              style={{ marginLeft: pxToVw(8) }}
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span
              className="font-mono text-black"
              style={{ marginLeft: pxToVw(4) }}
            >
              {time}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuBar;

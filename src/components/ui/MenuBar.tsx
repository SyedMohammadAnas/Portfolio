import React, { useEffect, useState } from "react";
import { Wifi, BatteryFull, Sun } from "lucide-react";
import Image from "next/image";

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
      className="fixed top-0 left-0 w-full h-7 flex items-center justify-between px-4 bg-white/20 backdrop-blur-lg  shadow-md z-50 text-xs select-none"
      style={{ fontFamily: 'var(--font-xanh-mono), monospace' }}
    >
      {/* Left: Apple Icon and Portfolio Title */}
      <div className="flex items-center gap-2 font-bold text-black">
        {/* Apple icon on the far left */}
        <Image
          src="/media/IconsPNG/appleIcon.png"
          alt="Apple Icon"
          width={20}
          height={24}
          className="w-4 h-5 mr-2"
        />
        {/* Portfolio title */}
        <span className="font-bold text-black text-sm underline font-mono">Syed Mohammad Anas&apos;s Portfolio</span>
      </div>

      {/* Center: Navigation Links */}


      {/* Right: System Icons and Time */}
      <div className="flex items-center gap-3 text-black">
        {/* System icons (WiFi, Sun, Battery) */}
        <Wifi className="text-black w-5 h-5" />
        <Sun className="text-black w-5 h-5" />
        <BatteryFull className="text-black w-5 h-5" />
        {/* Date and Time */}
        <span className="text-black ml-2 font-mono text-black">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span className="ml-1 font-mono text-black">{time}</span>
      </div>
    </div>
  );
};

export default MenuBar;

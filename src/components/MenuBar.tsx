import React, { useEffect, useState } from "react";
import { Wifi, BatteryFull, Sun } from "lucide-react";

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
      className="fixed top-0 left-0 w-full h-7 flex items-center justify-between px-4 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 text-xs select-none"
      style={{ fontFamily: 'var(--font-xanh-mono), monospace' }}
    >
      {/* Left: Apple Icon and Portfolio Title */}
      <div className="flex items-center gap-2 font-bold text-black">
        {/* Apple icon on the far left */}
        <img
          src="/media/iconsPNG/appleIcon.png" // Path relative to public folder
          alt="Apple Icon"
          className="w-5 h-6 mr-2" // Adjust size and spacing as needed
        />
        {/* Portfolio title */}
        <span className="font-bold text-sm underline font-mono">Syed Mohammad Anas's Portfolio</span>
            <div className="flex gap-2 text-gray-700 font-mono font-light">
                <a href="#contact" className="hover:underline hover:text-blue-500">Contact</a>
                <a href="#resume" className="hover:underline hover:text-blue-500">Resume</a>
            </div>
      </div>

      {/* Center: Navigation Links */}


      {/* Right: System Icons and Time */}
      <div className="flex items-center gap-3 text-gray-700">
        {/* System icons (WiFi, Sun, Battery) */}
        <Wifi className="w-5 h-5" />
        <Sun className="w-5 h-5" />
        <BatteryFull className="w-5 h-5" />
        {/* Date and Time */}
        <span className="ml-2 font-mono font-bold text-black">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span className="ml-1 font-mono font-bold text-black">{time}</span>
      </div>
    </div>
  );
};

export default MenuBar;

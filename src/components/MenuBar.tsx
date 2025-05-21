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
      className="fixed top-0 left-0 w-full h-10 flex items-center justify-between px-4 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 text-xs select-none"
      style={{ fontFamily: 'var(--font-xanh-mono), monospace' }}
    >
      {/* Left: Portfolio Title */}
      <div className="flex items-center gap-2 font-semibold text-black">
        <span className="font-bold">Inika Jhamvar's Portfolio</span>
      </div>

      {/* Center: Navigation Links */}
      <div className="flex items-center gap-6 text-gray-700">
        <a href="#contact" className="hover:underline">Contact</a>
        <a href="#resume" className="hover:underline">Resume</a>
      </div>

      {/* Right: System Icons and Time */}
      <div className="flex items-center gap-3 text-gray-700">
        {/* System icons (WiFi, Sun, Battery) */}
        <Wifi className="w-4 h-4" />
        <Sun className="w-4 h-4" />
        <BatteryFull className="w-4 h-4" />
        {/* Date and Time */}
        <span className="ml-2 font-mono">
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </span>
        <span className="ml-1 font-mono">{time}</span>
      </div>
    </div>
  );
};

export default MenuBar;

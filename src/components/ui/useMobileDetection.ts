import { useState, useEffect } from 'react';

/**
 * Custom React hook to detect mobile viewport
 * Returns true when screen width is less than 768px (mobile breakpoint)
 * Handles window resize events and orientation changes
 */
export const useMobileDetection = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Function to check and update mobile state
    const checkIsMobile = () => {
      // Set mobile breakpoint at 768px to cover iPhone 14 Pro Max (430px) and similar devices
      const mobileBreakpoint = 768;
      const currentWidth = window.innerWidth;
      setIsMobile(currentWidth < mobileBreakpoint);
    };

    // Initial check
    checkIsMobile();

    // Listen for window resize events
    window.addEventListener('resize', checkIsMobile);

    // Listen for orientation changes (important for mobile devices)
    window.addEventListener('orientationchange', () => {
      // Small delay to allow orientation change to complete
      setTimeout(checkIsMobile, 100);
    });

    // Cleanup event listeners
    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('orientationchange', checkIsMobile);
    };
  }, []);

  return isMobile;
};

export default useMobileDetection;

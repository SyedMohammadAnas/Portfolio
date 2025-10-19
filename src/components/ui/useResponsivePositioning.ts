import { useState, useEffect } from 'react';

// Reference resolution for the design (1920x1080)
const REFERENCE_WIDTH = 1920;
const REFERENCE_HEIGHT = 1080;

// Mobile reference resolution (iPhone 14 Pro Max: 430x932)
const MOBILE_REFERENCE_WIDTH = 430;
const MOBILE_REFERENCE_HEIGHT = 932;

// Interface for responsive positioning values
interface ResponsivePositioning {
  scaleX: number;
  scaleY: number;
  scale: number; // Average scale for consistent scaling
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * Custom hook for responsive positioning that maintains the exact visual appearance
 * at 1920x1080 resolution while scaling proportionally for other screen sizes
 */
export const useResponsivePositioning = (): ResponsivePositioning => {
  const [positioning, setPositioning] = useState<ResponsivePositioning>({
    scaleX: 1,
    scaleY: 1,
    scale: 1,
    viewportWidth: REFERENCE_WIDTH,
    viewportHeight: REFERENCE_HEIGHT,
  });

  useEffect(() => {
    // Function to calculate and update scaling factors
    const updateScaling = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      // Check if we're in mobile viewport (< 768px)
      const isMobile = currentWidth < 768;

      // Use appropriate reference resolution based on viewport
      const refWidth = isMobile ? MOBILE_REFERENCE_WIDTH : REFERENCE_WIDTH;
      const refHeight = isMobile ? MOBILE_REFERENCE_HEIGHT : REFERENCE_HEIGHT;

      // Calculate scaling factors relative to appropriate reference resolution
      const scaleX = currentWidth / refWidth;
      const scaleY = currentHeight / refHeight;

      // Use the smaller scale to ensure everything fits within viewport
      const scale = Math.min(scaleX, scaleY);

      setPositioning({
        scaleX,
        scaleY,
        scale,
        viewportWidth: currentWidth,
        viewportHeight: currentHeight,
      });
    };

    // Initial calculation
    updateScaling();

    // Update on window resize
    window.addEventListener('resize', updateScaling);

    // Update on orientation change (for mobile devices)
    window.addEventListener('orientationchange', updateScaling);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('resize', updateScaling);
      window.removeEventListener('orientationchange', updateScaling);
    };
  }, []);

  return positioning;
};

/**
 * Utility function to scale a value based on the current scaling factor
 * @param value - The original value to scale
 * @param scale - The scaling factor to apply
 * @returns The scaled value
 */
export const scaleValue = (value: number, scale: number): number => {
  return value * scale;
};

/**
 * Utility function to convert a pixel value to viewport width units
 * @param pixels - The pixel value to convert
 * @param isMobile - Whether to use mobile reference resolution
 * @returns The value in viewport width units (vw)
 */
export const pxToVw = (pixels: number, isMobile: boolean = false): string => {
  const refWidth = isMobile ? MOBILE_REFERENCE_WIDTH : REFERENCE_WIDTH;
  return `${(pixels / refWidth) * 100}vw`;
};

/**
 * Utility function to convert a pixel value to viewport height units
 * @param pixels - The pixel value to convert
 * @param isMobile - Whether to use mobile reference resolution
 * @returns The value in viewport height units (vh)
 */
export const pxToVh = (pixels: number, isMobile: boolean = false): string => {
  const refHeight = isMobile ? MOBILE_REFERENCE_HEIGHT : REFERENCE_HEIGHT;
  return `${(pixels / refHeight) * 100}vh`;
};

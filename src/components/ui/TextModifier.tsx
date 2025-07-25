'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

/**
 * TextModifier Component
 *
 * Dynamically scales the BOLDNESS of EACH LETTER in the Text based on cursor proximity.
 * Uses cosine-based magnification curves for smooth, natural scaling.
 * Animates transitions with requestAnimationFrame and lerp.
 * Adjusts layout responsively.
 * Extreme weight to normal (from thick to thin) based on cursor proximity.
 * Maintains and changes states of each letter in the text like position and scale.
 *
 * FIXED: Eliminated jittering by using refs instead of state for animation values
 * and updating DOM directly without triggering React re-renders.
 */

interface LetterState {
  currentWeight: number;
  targetWeight: number;
  currentScale: number;
  targetScale: number;
  currentX: number;
  targetX: number;
  currentY: number;
  targetY: number;
}

interface TextModifierProps {
  text: string;
  className?: string;
  baseWeight?: number;
  maxWeight?: number;
  maxScale?: number;
  maxOffset?: number;
  animationSpeed?: number;
  proximityRadius?: number;
}

/**
 * Optimized linear interpolation function with better damping to prevent oscillation
 * @param start - Starting value
 * @param end - Ending value
 * @param factor - Interpolation factor (0-1)
 * @returns Interpolated value
 */
const lerp = (start: number, end: number, factor: number): number => {
  // Add stronger damping to prevent oscillation
  const dampedFactor = factor * 0.85; // 15% damping instead of 5%
  return start + (end - start) * dampedFactor;
};

/**
 * Cosine-based magnification curve for natural falloff
 * @param distance - Distance from cursor
 * @param radius - Maximum radius of effect
 * @returns Magnification factor (0-1)
 */
const cosineMagnification = (distance: number, radius: number): number => {
  if (distance >= radius) return 0;
  const normalizedDistance = distance / radius;
  return Math.cos(normalizedDistance * Math.PI * 0.5);
};

export default function TextModifier({
  text,
  className = '',
  baseWeight = 400,
  maxWeight = 900,
  maxScale = 1.2,
  maxOffset = 10,
  animationSpeed = 0.1,
  proximityRadius = 150
}: TextModifierProps) {
  // Track if component is mounted on client to prevent hydration issues
  const [isMounted, setIsMounted] = useState(false);

  // Reference to the container element
  const containerRef = useRef<HTMLDivElement>(null);

  // Use ref for cursor position to avoid re-renders and animation loop restarts
  const cursorPosRef = useRef({ x: 0, y: 0 });

  // Track previous cursor position to detect movement
  const prevCursorPosRef = useRef({ x: 0, y: 0 });

  // Track if cursor is moving to adjust animation behavior
  const isCursorMovingRef = useRef(false);

  // Store animation values in refs to avoid re-renders and eliminate jittering
  const letterStatesRef = useRef<LetterState[]>([]);

  // Refs for letter elements to avoid state updates
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Animation frame reference
  const animationRef = useRef<number | undefined>(undefined);

  // Flag to prevent multiple animation loops
  const isAnimatingRef = useRef(false);

  /**
   * Set mounted state after component mounts on client with delay to prevent hydration mismatch
   */
  useEffect(() => {
    // Add a small delay to ensure hydration is complete before switching to interactive mode
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100); // 100ms delay to allow hydration to complete

    return () => clearTimeout(timer);
  }, []);

  /**
   * Initialize letter states when text changes
   */
  useEffect(() => {
    const newLetterStates: LetterState[] = text.split('').map(() => ({
      currentWeight: baseWeight,
      targetWeight: baseWeight,
      currentScale: 1,
      targetScale: 1,
      currentX: 0,
      targetX: 0,
      currentY: 0,
      targetY: 0
    }));

    letterStatesRef.current = newLetterStates;

    // Initialize letter refs array
    letterRefs.current = new Array(text.length).fill(null);
  }, [text, baseWeight]);

  /**
   * Handle mouse move events to track cursor position and movement
   */
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (containerRef.current && isMounted) {
      // Store previous position
      prevCursorPosRef.current = { ...cursorPosRef.current };

      // Update current position with viewport coordinates
      cursorPosRef.current = {
        x: event.clientX,
        y: event.clientY
      };

      // Detect if cursor is moving (with small threshold to prevent micro-movements)
      const movementThreshold = 2; // Increased from 1px to 2px for more stability
      const deltaX = Math.abs(cursorPosRef.current.x - prevCursorPosRef.current.x);
      const deltaY = Math.abs(cursorPosRef.current.y - prevCursorPosRef.current.y);

      isCursorMovingRef.current = deltaX > movementThreshold || deltaY > movementThreshold;
    }
  }, [isMounted]);

  /**
   * Set up mouse event listeners only after mounting
   */
  useEffect(() => {
    if (!isMounted) return;

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove, isMounted]);

  /**
   * Optimized animation loop using requestAnimationFrame with direct DOM updates
   * This eliminates jittering by avoiding React re-renders
   */
  useEffect(() => {
    if (!isMounted || isAnimatingRef.current) return;

    isAnimatingRef.current = true;

    const animate = () => {
      // Update letter states in refs (no React state updates)
      letterStatesRef.current = letterStatesRef.current.map((state, index) => {
        const element = letterRefs.current[index];
        if (!element) return state;

        // Get letter position in viewport coordinates
        const rect = element.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2;
        const letterCenterY = rect.top + rect.height / 2;

        // Calculate distance from cursor using viewport coordinates
        const distance = Math.sqrt(
          Math.pow(cursorPosRef.current.x - letterCenterX, 2) +
          Math.pow(cursorPosRef.current.y - letterCenterY, 2)
        );

        // Calculate magnification factor using cosine curve
        const magnification = cosineMagnification(distance, proximityRadius);

        // Calculate target values based on proximity
        const targetWeight = lerp(baseWeight, maxWeight, magnification);
        const targetScale = lerp(1, maxScale, magnification);
        const targetX = lerp(0, maxOffset * (cursorPosRef.current.x > letterCenterX ? 1 : -1), magnification);
        const targetY = lerp(0, maxOffset * (cursorPosRef.current.y > letterCenterY ? 1 : -1), magnification);

        // Adjust animation speed based on cursor movement
        const currentAnimationSpeed = isCursorMovingRef.current ? animationSpeed : animationSpeed * 0.2;

        // Smoothly interpolate current values to targets
        const newCurrentWeight = lerp(state.currentWeight, targetWeight, currentAnimationSpeed);
        const newCurrentScale = lerp(state.currentScale, targetScale, currentAnimationSpeed);
        const newCurrentX = lerp(state.currentX, targetX, currentAnimationSpeed);
        const newCurrentY = lerp(state.currentY, targetY, currentAnimationSpeed);

        // Update DOM directly to avoid React re-renders and eliminate jittering
        const roundedWeight = Math.round(newCurrentWeight);
        const roundedScale = Math.round(newCurrentScale * 100) / 100; // Round to 2 decimal places
        const roundedX = Math.round(newCurrentX);
        const roundedY = Math.round(newCurrentY);

        // Apply transforms directly to DOM element
        element.style.fontWeight = roundedWeight.toString();
        element.style.transform = `translate3d(${roundedX}px, ${roundedY}px, 0) scale(${roundedScale})`;
        element.style.zIndex = Math.round(roundedScale * 10).toString();

        return {
          ...state,
          currentWeight: newCurrentWeight,
          targetWeight,
          currentScale: newCurrentScale,
          targetScale,
          currentX: newCurrentX,
          targetX,
          currentY: newCurrentY,
          targetY
        };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      isAnimatingRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [baseWeight, maxWeight, maxScale, maxOffset, animationSpeed, proximityRadius, isMounted]);

  /**
   * Set letter element reference without causing re-renders
   */
  const setLetterRef = useCallback((element: HTMLSpanElement | null, index: number) => {
    letterRefs.current[index] = element;
  }, []);

  /**
   * Memoize the letters array to prevent unnecessary re-renders
   */
  const letters = useMemo(() => {
    // Always render static version initially to prevent hydration mismatch
    const shouldRenderStatic = !isMounted;

    if (shouldRenderStatic) {
      // Return static version for SSR and initial client render
      return text.split('').map((letter, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            fontWeight: baseWeight,
            transform: 'translate3d(0px, 0px, 0) scale(1)',
            position: 'relative',
            willChange: 'transform, font-weight' // Optimize for animations
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ));
    }

    // Interactive version after hydration is complete
    return text.split('').map((letter, index) => {
      return (
        <span
          key={index}
          ref={(element) => setLetterRef(element, index)}
          style={{
            display: 'inline-block',
            fontWeight: baseWeight,
            transform: 'translate3d(0px, 0px, 0) scale(1)',
            transition: 'none', // Disable CSS transitions for manual animation
            willChange: 'transform, font-weight', // Optimize for animations
            position: 'relative',
            zIndex: 1
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      );
    });
  }, [text, isMounted, baseWeight, setLetterRef]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      style={{
        fontFamily: 'inherit',
        lineHeight: '1.2',
        whiteSpace: 'nowrap'
      }}
    >
      {letters}
    </div>
  );
}

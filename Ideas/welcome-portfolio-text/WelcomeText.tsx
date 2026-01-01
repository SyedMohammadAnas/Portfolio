'use client';

import React from 'react';
import TextModifier from '../../src/components/ui/TextModifier';
import { pxToVh } from '../../src/components/ui/useResponsivePositioning';

interface WelcomeTextProps {
  /** Whether to show on mobile devices */
  showOnMobile?: boolean;
  /** Custom top margin adjustment */
  topMarginAdjustment?: number;
  /** Welcome text content */
  welcomeText?: string;
  /** Main title text content */
  titleText?: string;
  /** Base font weight for text effects */
  baseWeight?: number;
  /** Maximum font weight for hover effects */
  maxWeight?: number;
  /** Maximum scale for hover effects */
  maxScale?: number;
  /** Maximum offset for hover effects */
  maxOffset?: number;
  /** Animation speed for text effects */
  animationSpeed?: number;
  /** Proximity radius for text effects */
  proximityRadius?: number;
}

export default function WelcomeText({
  showOnMobile = false,
  topMarginAdjustment = -72,
  welcomeText = "welcome to my",
  titleText = "PORTFOLIO.",
  baseWeight = 400,
  maxWeight = 900,
  maxScale = 1.3,
  maxOffset = 5,
  animationSpeed = 0.2,
  proximityRadius = 100,
}: WelcomeTextProps) {
  // Don't render on mobile unless explicitly requested
  const isMobile = typeof window !== 'undefined' &&
    window.innerWidth < 768; // Simple mobile detection

  if (isMobile && !showOnMobile) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
      style={{
        marginTop: pxToVh(topMarginAdjustment)
      }}
    >
      {/* Welcome text - smaller and positioned above */}
      <div
        style={{
          marginTop: pxToVh(68),
          textShadow: '0 3px 6px rgba(0,0,0,0.9), 0 0px 12px #000'
        }}
        className="font-light tracking-wide text-6xl text-white"
      >
        <TextModifier
          text={welcomeText}
          baseWeight={baseWeight}
          maxWeight={maxWeight}
          maxScale={maxScale}
          maxOffset={maxOffset}
          animationSpeed={animationSpeed}
          proximityRadius={proximityRadius}
        />
      </div>

      {/* Main title text - larger and more prominent */}
      <div className="flex items-center justify-center">
        <div
          style={{
            textShadow: '0 3px 6px rgba(0,0,0,0.9), 0 0px 12px #000'
          }}
        >
          <TextModifier
            text={titleText}
            className="font-extrabold tracking-wider text-9xl text-white"
            baseWeight={baseWeight}
            maxWeight={maxWeight}
            maxScale={maxScale}
            maxOffset={maxOffset * 3} // Increased offset for title
            animationSpeed={animationSpeed}
            proximityRadius={proximityRadius * 1.5} // Larger radius for title
          />
        </div>
      </div>
    </div>
  );
}

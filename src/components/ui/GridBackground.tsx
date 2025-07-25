'use client';

import React from 'react';

/**
 * GridBackground Component
 *
 * Creates a subtle grid pattern with light grey lines as a background element.
 * This component is designed to be positioned absolutely and cover the full viewport
 * to provide a grid background for the portfolio interface.
 */
const GridBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(200, 200, 200, 0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(200, 200, 200, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '35px 35px',
        backgroundPosition: '0 0'
      }}
    />
  );
};

export default GridBackground;

import React, { useRef, useEffect } from "react";

// Star type definition
interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

/**
 * Starfield component
 * Renders a full-viewport canvas with animated stars (tiny dots) that float and move around.
 * Stars are repelled from the mouse position for an interactive effect.
 */
const Starfield: React.FC = () => {
  // Reference to the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Mouse position state (ref for performance)
  const mouse = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  // Number of stars to render
  const STAR_COUNT = 200;
  // Maximum velocity for stars
  const MAX_VEL = 0.25;
  // Repulsion radius for mouse interaction
  const MOUSE_RADIUS = 100;
  // Repulsion strength
  const MOUSE_FORCE = 2;

  // Initialize and animate stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to fill viewport
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Create initial stars
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * MAX_VEL,
      vy: (Math.random() - 0.5) * MAX_VEL,
      radius: 0.7 + Math.random() * 0.8,
    }));

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Use 'const' for star as it is not reassigned in the loop (ESLint prefer-const)
      for (const star of stars) {
        // Move star
        star.x += star.vx;
        star.y += star.vy;

        // Bounce off edges
        if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
        if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

        // Mouse repulsion
        if (mouse.current.active) {
          const dx = star.x - mouse.current.x;
          const dy = star.y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS) {
            // Repel star from mouse
            const angle = Math.atan2(dy, dx);
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * MOUSE_FORCE;
            star.vx += Math.cos(angle) * force;
            star.vy += Math.sin(angle) * force;
            // Clamp velocity
            star.vx = Math.max(-MAX_VEL, Math.min(MAX_VEL, star.vx));
            star.vy = Math.max(-MAX_VEL, Math.min(MAX_VEL, star.vy));
          }
        }

        // Draw star (as a small white dot)
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 0.85;
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.active = true;
    };
    const handleMouseLeave = () => {
      mouse.current.active = false;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Render the canvas, absolutely positioned and pointer-events-none
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

export default Starfield;

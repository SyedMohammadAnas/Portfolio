import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

/**
 * StickyNote - A sticky note styled To-Do list for the desktop UI.
 * - Animated in with Framer Motion
 * - Uses Card for styling
 * - No props for now (static content)
 */
const StickyNote: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: -40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.2 }}
    className="absolute left-8 top-16 z-10"
  >
    <Card className="bg-yellow-200 border-yellow-300 shadow-lg rounded-sm w-80 p-4 font-mono">
      <div className="font-bold text-base mb-2">To do:</div>
      <ul className="text-sm space-y-1">
        <li>Land my dream UX job</li>
        <li>Drink water</li>
        <li className="line-through">Move to the US</li>
        <li>Finish grad school without losing my mind</li>
        <li>Build that banger spotify playlist</li>
        <li>World domination</li>
        <li className="line-through">Get really good at making pasta</li>
        <li>Travel somewhere new every year</li>
      </ul>
    </Card>
  </motion.div>
);

export default StickyNote;

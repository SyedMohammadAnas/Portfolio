"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";
import { X } from "lucide-react";

// Interface for the visiting card modal props
interface VisitingCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Visiting Card Modal Component with 3D Effects
export default function VisitingCardModal({ isOpen, onClose }: VisitingCardModalProps) {
  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay - no blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* 3D Card Container */}
            <CardContainer
              className="w-full max-w-2xl"
              containerClassName="py-0"
            >
              <CardBody className="relative w-full h-auto max-w-2xl">
                {/* Main visiting card image with 3D effects */}
                <CardItem
                  translateZ="50"
                  className="w-full h-auto"
                >
                  <Image
                    src="/others/VisitingCard.png"
                    alt="Syed Mohammad Anas - Visiting Card"
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-2xl shadow-2xl"
                    priority
                  />
                </CardItem>

                {/* Close button - positioned inside the card at top right */}
                <CardItem
                  translateZ="100"
                  className="absolute top-4 right-4 z-60"
                >
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200 shadow-lg"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-gray-800" />
                  </button>
                </CardItem>
              </CardBody>
            </CardContainer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import React, { useState, useEffect } from "react";

interface FlashcardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
  isFlippedExternal?: boolean; // Allow controlling the flip state externally (optional)
  onFlipChange?: (flipped: boolean) => void;
}

export function Flashcard({
  frontContent,
  backContent,
  className = "",
  isFlippedExternal,
  onFlipChange,
}: FlashcardProps) {
  const [isFlippedInternal, setIsFlippedInternal] = useState(false);

  // Sync with external control if provided
  const isFlipped = isFlippedExternal !== undefined ? isFlippedExternal : isFlippedInternal;

  const handleFlip = () => {
    const nextFlipped = !isFlipped;
    if (isFlippedExternal === undefined) {
      setIsFlippedInternal(nextFlipped);
    }
    if (onFlipChange) {
      onFlipChange(nextFlipped);
    }
  };

  return (
    <div
      onClick={handleFlip}
      className={`relative cursor-pointer focus:outline-hidden select-none ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleFlip();
        }
      }}
      style={{
        perspective: "1000px",
        WebkitPerspective: "1000px",
      }}
    >
      <div
        className="w-full h-full duration-500 ease-out"
        style={{
          position: "relative",
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          {frontContent}
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
}

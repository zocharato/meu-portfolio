"use client";

import { useState } from "react";

interface BubbleTextProps {
  text: string;
  className?: string;
}

export function BubbleText({ text, className = "" }: BubbleTextProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <h2 onMouseLeave={() => setHoveredIndex(null)} className={className}>
      {text.split("").map((char, idx) => {
        const distance =
          hoveredIndex !== null ? Math.abs(hoveredIndex - idx) : null;

        let letterClass = "";

        if (distance === 0) {
         letterClass = "scale-110 font-bold text-indigo-50";
        } else if (distance === 1) {
         letterClass = "scale-105 font-medium text-indigo-200";
        } else if (distance === 2) {
        letterClass = "font-normal text-indigo-300";
        } else {
        letterClass = "font-light text-indigo-400";
        }

        return (
          <span
            key={idx}
            onMouseEnter={() => setHoveredIndex(idx)}
            className={`inline-block transition-all duration-300 ease-in-out ${letterClass}`}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </h2>
  );
}
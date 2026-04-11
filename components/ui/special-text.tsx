"use client";

import { useEffect, useState } from "react";

interface SpecialTextProps {
  children: string;
  speed?: number;
  className?: string;
}

const RANDOM_CHARS = "_!X$0-+*#";

function getRandomChar() {
  return RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
}

export function SpecialText({
  children,
  speed = 40,
  className = "",
}: SpecialTextProps) {
  const text = children;
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let frame = 0;

    const interval = setInterval(() => {
      let output = "";

      for (let i = 0; i < text.length; i++) {
        if (i < frame) {
          output += text[i];
        } else {
          output += getRandomChar();
        }
      }

      setDisplayText(output);

      if (frame >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
      }

      frame += 1;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className={className}>{displayText}</span>;
}
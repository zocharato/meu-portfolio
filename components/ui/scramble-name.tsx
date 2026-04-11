'use client';

import { useEffect, useRef } from 'react';

class TextScramble {
  el: HTMLElement;
  chars: string;
  queue: Array<{
    from: string;
    to: string;
    start: number;
    end: number;
    char?: string;
  }>;
  frame: number;
  frameRequest: number;
  resolve: (() => void) | null;

  constructor(el: HTMLElement) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.queue = [];
    this.frame = 0;
    this.frameRequest = 0;
    this.resolve = null;
    this.update = this.update.bind(this);
  }

  setText(newText: string) {
    const oldText = this.el.textContent || '';
    const length = Math.max(oldText.length, newText.length);

    const promise = new Promise<void>((resolve) => {
      this.resolve = resolve;
    });

    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 60);
      const end = start + Math.floor(Math.random() * 60) + 30;

      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();

    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }

        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      if (this.resolve) this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  destroy() {
    cancelAnimationFrame(this.frameRequest);
  }
}

type ScrambleNameProps = {
  text: string;
};

export default function ScrambleName({ text }: ScrambleNameProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const scrambleRef = useRef<TextScramble | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    scrambleRef.current = new TextScramble(ref.current);
    scrambleRef.current.setText(text);

    const interval = setInterval(() => {
      scrambleRef.current?.setText(text);
    }, 20000);

    return () => {
      clearInterval(interval);
      scrambleRef.current?.destroy();
    };
  }, [text]);

  return (
    <>
      <h1
        ref={ref}
        style={{
          fontSize: '56px',
          lineHeight: 1.02,
          fontWeight: 600,
          margin: 0,
          color: 'white',
        }}
      >
        {text}
      </h1>

      <style>{`
        .scramble-char {
          color: #cbd5ff;
          opacity: 0.85;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.15),
            0 0 18px rgba(147, 197, 253, 0.18);
        }
      `}</style>
    </>
  );
}
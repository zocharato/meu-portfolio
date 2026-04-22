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
  frameRequest: number | null;
  resolve: (() => void) | null;
  lastFrameTime: number;
  isRunning: boolean;

  constructor(el: HTMLElement) {
    this.el = el;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    this.queue = [];
    this.frame = 0;
    this.frameRequest = null;
    this.resolve = null;
    this.lastFrameTime = 0;
    this.isRunning = false;
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
      const start = Math.floor(Math.random() * 14);
      const end = start + Math.floor(Math.random() * 10) + 6;

      this.queue.push({ from, to, start, end });
    }

    if (this.frameRequest !== null) {
      cancelAnimationFrame(this.frameRequest);
    }

    this.frame = 0;
    this.lastFrameTime = 0;
    this.isRunning = true;
    this.frameRequest = requestAnimationFrame(this.update);

    return promise;
  }

  update(time = 0) {
    if (!this.isRunning) return;

    if (document.hidden) {
      this.frameRequest = requestAnimationFrame(this.update);
      return;
    }

    if (time - this.lastFrameTime < 50) {
      this.frameRequest = requestAnimationFrame(this.update);
      return;
    }

    this.lastFrameTime = time;

    let output = '';
    let complete = 0;

    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.1) {
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
      this.isRunning = false;
      this.el.textContent = this.queue.map((item) => item.to).join('');
      if (this.resolve) this.resolve();
      this.frameRequest = null;
      return;
    }

    this.frame++;
    this.frameRequest = requestAnimationFrame(this.update);
  }

  destroy() {
    this.isRunning = false;
    if (this.frameRequest !== null) {
      cancelAnimationFrame(this.frameRequest);
      this.frameRequest = null;
    }
  }
}

type ScrambleNameProps = {
  text: string;
};

export default function ScrambleName({ text }: ScrambleNameProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const scrambleRef = useRef<TextScramble | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    scrambleRef.current = new TextScramble(ref.current);
    scrambleRef.current.setText(text);

    const scheduleNext = () => {
      timeoutRef.current = setTimeout(() => {
        scrambleRef.current?.setText(text).then(() => {
          scheduleNext();
        });
      }, 25000);
    };

    scheduleNext();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      scrambleRef.current?.destroy();
    };
  }, [text]);

  return (
    <>
      <h1
        ref={ref}
        style={{
          fontSize: 'clamp(2.4rem, 7vw, 56px)',
          lineHeight: 1.04,
          fontWeight: 600,
          margin: 0,
          color: 'white',
          maxWidth: '100%',
          letterSpacing: '-0.03em',
          display: 'inline-block',
          minHeight: '2.2em',
        }}
      >
        {text}
      </h1>

      <style>{`
        .scramble-char {
          display: inline-block;
          width: 0.62em;
          text-align: center;
          color: #ffffff;
          opacity: 0.9;
          text-shadow:
            0 0 6px rgba(255, 255, 255, 0.22),
            0 0 12px rgba(255, 255, 255, 0.12);
        }
      `}</style>
    </>
  );
}
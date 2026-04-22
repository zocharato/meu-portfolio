'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

const hobbies = [
  {
    id: 1,
    title: 'Corinthians',
    cat: 'Paixão',
    img: '/hobbies/corinthians.jpg',
  },
  {
    id: 2,
    title: 'Tenis',
    cat: 'Esporte',
    img: '/hobbies/tenis.png',
  },
  {
    id: 3,
    title: 'Cozinhar',
    cat: 'Interesse',
    img: '/hobbies/cozinhar.jpg',
  },
  {
    id: 4,
    title: 'Motos',
    cat: 'Paixão',
    img: '/hobbies/motos.jpg',
  },
  {
    id: 5,
    title: 'Fórmula 1',
    cat: 'Paixão',
    img: '/hobbies/f1.jpg',
  },
];

export default function HobbiesWheel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isPaused || !isInView) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % hobbies.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [isPaused, isInView]);

  const orderedCards = useMemo(() => {
    return hobbies
      .map((item, index) => {
        let offset = index - activeIndex;

        if (offset < -Math.floor(hobbies.length / 2)) offset += hobbies.length;
        if (offset > Math.floor(hobbies.length / 2)) offset -= hobbies.length;

        return {
          ...item,
          offset,
        };
      })
      .filter((card) => Math.abs(card.offset) <= 1);
  }, [activeIndex]);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + hobbies.length) % hobbies.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % hobbies.length);
  };

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        width: '100%',
        minHeight: '620px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '20px 0 10px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1180px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '560px',
        }}
      >
        <button
          onClick={goPrev}
          aria-label="Voltar hobby"
          style={{
            position: 'absolute',
            left: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(12,12,14,0.82)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            transition: 'transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
            boxShadow: '0 14px 30px rgba(0,0,0,0.22)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
            e.currentTarget.style.background = 'rgba(24,24,28,0.92)';
            e.currentTarget.style.boxShadow = '0 18px 40px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            e.currentTarget.style.background = 'rgba(12,12,14,0.82)';
            e.currentTarget.style.boxShadow = '0 14px 30px rgba(0,0,0,0.22)';
          }}
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={goNext}
          aria-label="Avançar hobby"
          style={{
            position: 'absolute',
            right: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(12,12,14,0.82)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            transition: 'transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
            boxShadow: '0 14px 30px rgba(0,0,0,0.22)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
            e.currentTarget.style.background = 'rgba(24,24,28,0.92)';
            e.currentTarget.style.boxShadow = '0 18px 40px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            e.currentTarget.style.background = 'rgba(12,12,14,0.82)';
            e.currentTarget.style.boxShadow = '0 14px 30px rgba(0,0,0,0.22)';
          }}
        >
          <ChevronRight size={18} />
        </button>

        <div
          style={{
            width: '100%',
            maxWidth: '980px',
            height: '560px',
            position: 'relative',
            perspective: '1000px',
            overflow: 'visible',
          }}
        >
          {orderedCards.map((card) => {
            const isActive = card.offset === 0;
            const distance = Math.abs(card.offset);

            const translateX = card.offset * 225;
            const translateY = distance * 26 + (isActive ? 0 : 22);
            const rotateZ = card.offset * 6;
            const rotateY = card.offset * -8;
            const scale = isActive ? 1 : 0.88;
            const opacity = isActive ? 1 : 0.45;
            const zIndex = 100 - distance;

            return (
              <div
                key={card.id}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: '260px',
                  height: '360px',
                  transform: `translate3d(-50%, -50%, 0) translate3d(${translateX}px, ${translateY}px, 0) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${scale})`,
                  transformStyle: 'preserve-3d',
                  transition:
                    'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease',
                  zIndex,
                  opacity,
                  pointerEvents: isActive ? 'auto' : 'none',
                  willChange: 'transform, opacity',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    borderRadius: '28px',
                    border: isActive
                      ? '1px solid rgba(255,255,255,0.18)'
                      : '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(12,12,14,0.9)',
                    boxShadow: isActive
                      ? '0 28px 70px rgba(0,0,0,0.42)'
                      : '0 14px 30px rgba(0,0,0,0.18)',
                    transition: 'border 0.35s ease, box-shadow 0.35s ease',
                  }}
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease',
                      transform: isActive ? 'scale(1.04)' : 'scale(1)',
                      filter: isActive ? 'saturate(1.02)' : 'brightness(0.78) saturate(0.88)',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: isActive
                        ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.34) 42%, rgba(0,0,0,0.04) 100%)'
                        : 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 42%, rgba(0,0,0,0.14) 100%)',
                      transition: 'background 0.35s ease',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#f4f4f5',
                          background: isActive
                            ? 'rgba(18,18,18,0.78)'
                            : 'rgba(18,18,18,0.62)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          padding: '6px 10px',
                          borderRadius: '999px',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {card.cat}
                      </span>

                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '999px',
                          background: 'rgba(255,255,255,0.92)',
                          color: '#111',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: isActive ? 1 : 0,
                          transform: isActive
                            ? 'translateY(0px) rotate(0deg)'
                            : 'translateY(8px) rotate(-20deg)',
                          transition: 'all 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                      >
                        <ArrowUpRight size={15} />
                      </div>
                    </div>

                    <div
                      style={{
                        transform: isActive ? 'translateY(0px)' : 'translateY(8px)',
                        transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '34px',
                          lineHeight: 1,
                          fontWeight: 800,
                          color: '#fff',
                          letterSpacing: '-0.03em',
                          opacity: isActive ? 1 : 0.92,
                          transition: 'opacity 0.25s ease',
                        }}
                      >
                        {card.title}
                      </h3>

                      <div
                        style={{
                          marginTop: '12px',
                          width: isActive ? '100%' : '0%',
                          height: '2px',
                          background: 'rgba(255,255,255,0.95)',
                          transition: 'width 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
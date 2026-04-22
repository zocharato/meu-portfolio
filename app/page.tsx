'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import ScrambleName from '@/components/ui/scramble-name';
import SkillsOrbit from '@/components/ui/skills-orbit';
import HobbiesWheel from '@/components/ui/hobbies-wheel';
import GetInTouch from '@/components/ui/get-in-touch';
import AboutTabs from '@/components/ui/about-tabs';
import { PillBase } from '@/components/ui/3d-adaptive-navigation-bar';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const FPS = 30;
    const FRAME_DURATION = 1000 / FPS;

    let animationFrameId = 0;
    let time = 0;
    let lastFrameTime = 0;
    let resizeRaf = 0;

    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    let noiseCanvas: HTMLCanvasElement | null = null;
    let gridCanvas: HTMLCanvasElement | null = null;
    let scanlineCanvas: HTMLCanvasElement | null = null;
    let tubeCanvas: HTMLCanvasElement | null = null;

    const createOffscreenCanvas = (width: number, height: number) => {
      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      return off;
    };

    const buildStaticTextures = () => {
      const w = viewportWidth;
      const h = viewportHeight;

      noiseCanvas = createOffscreenCanvas(w, h);
      gridCanvas = createOffscreenCanvas(w, h);
      scanlineCanvas = createOffscreenCanvas(w, h);
      tubeCanvas = createOffscreenCanvas(w, h);

      const noiseCtx = noiseCanvas.getContext('2d');
      const gridCtx = gridCanvas.getContext('2d');
      const scanCtx = scanlineCanvas.getContext('2d');
      const tubeCtx = tubeCanvas.getContext('2d');

      if (!noiseCtx || !gridCtx || !scanCtx || !tubeCtx) return;

      for (let i = 0; i < 2600; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const alpha = Math.random() * 0.05;
        const size = Math.random() > 0.94 ? 1.5 : 1;
        noiseCtx.fillStyle = `rgba(255,255,255,${alpha})`;
        noiseCtx.fillRect(x, y, size, size);
      }

      gridCtx.save();
      gridCtx.strokeStyle = 'rgba(255,255,255,0.018)';
      gridCtx.lineWidth = 1;

      for (let x = 0; x < w; x += 6) {
        gridCtx.beginPath();
        gridCtx.moveTo(x, 0);
        gridCtx.lineTo(x, h);
        gridCtx.stroke();
      }

      for (let y = 0; y < h; y += 6) {
        gridCtx.beginPath();
        gridCtx.moveTo(0, y);
        gridCtx.lineTo(w, y);
        gridCtx.stroke();
      }

      gridCtx.restore();

      scanCtx.save();
      scanCtx.strokeStyle = 'rgba(255,255,255,0.02)';
      scanCtx.lineWidth = 1;

      for (let y = 0; y < h; y += 4) {
        scanCtx.beginPath();
        scanCtx.moveTo(0, y);
        scanCtx.lineTo(w, y);
        scanCtx.stroke();
      }

      scanCtx.restore();

      tubeCtx.save();
      tubeCtx.globalCompositeOperation = 'overlay';

      for (let i = 0; i < 120; i++) {
        const y = h * 0.42 + Math.random() * h * 0.22;
        const alpha = Math.random() * 0.025;
        tubeCtx.fillStyle = `rgba(255,255,255,${alpha})`;
        tubeCtx.fillRect(0, y, w, 1);
      }

      tubeCtx.restore();
    };

    const resizeCanvas = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.1);

      canvas.width = Math.floor(viewportWidth * dpr);
      canvas.height = Math.floor(viewportHeight * dpr);
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      buildStaticTextures();
    };

    const handleResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resizeCanvas);
    };

    resizeCanvas();

    const drawWaveLayer = ({
      amplitude,
      frequency,
      speed,
      offset,
      opacity,
      hue,
      blur,
      yOffset,
    }: {
      amplitude: number;
      frequency: number;
      speed: number;
      offset: number;
      opacity: number;
      hue: number;
      blur: number;
      yOffset: number;
    }) => {
      const w = viewportWidth;
      const h = viewportHeight;
      const centerY = h * yOffset;
      const phase = time * speed + offset;

      ctx.save();
      ctx.filter = `blur(${blur}px)`;

      const gradient = ctx.createLinearGradient(
        0,
        centerY - amplitude * 3,
        0,
        centerY + amplitude * 3
      );
      gradient.addColorStop(0, `hsla(${hue}, 100%, 55%, 0)`);
      gradient.addColorStop(0.2, `hsla(${hue}, 100%, 58%, ${opacity * 0.35})`);
      gradient.addColorStop(0.5, `hsla(${hue}, 100%, 62%, ${opacity})`);
      gradient.addColorStop(0.8, `hsla(${hue}, 100%, 58%, ${opacity * 0.35})`);
      gradient.addColorStop(1, `hsla(${hue}, 100%, 55%, 0)`);

      ctx.beginPath();

      for (let x = -80; x <= w + 80; x += 4) {
        const y1 = Math.sin(x * frequency + phase) * amplitude;
        const y2 = Math.sin(x * frequency * 1.7 + phase * 1.2) * amplitude * 0.4;
        const y3 = Math.sin(x * frequency * 0.58 + phase * 0.75) * amplitude * 0.33;
        const y = centerY + y1 + y2 + y3;

        if (x === -80) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.lineTo(w + 80, h);
      ctx.lineTo(-80, h);
      ctx.closePath();

      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    };

    const drawChromaticBands = () => {
      const w = viewportWidth;
      const h = viewportHeight;

      const hueA = (time * 0.6) % 360;
      const hueB = (hueA + 110) % 360;
      const hueC = (hueA + 220) % 360;

      drawWaveLayer({
        amplitude: 34,
        frequency: 0.0044,
        speed: 0.018,
        offset: 0,
        opacity: 0.12,
        hue: hueA,
        blur: 8,
        yOffset: 0.52,
      });

      drawWaveLayer({
        amplitude: 30,
        frequency: 0.0036,
        speed: 0.014,
        offset: Math.PI / 2,
        opacity: 0.1,
        hue: hueB,
        blur: 14,
        yOffset: 0.525,
      });

      drawWaveLayer({
        amplitude: 26,
        frequency: 0.0051,
        speed: 0.021,
        offset: Math.PI,
        opacity: 0.09,
        hue: hueC,
        blur: 18,
        yOffset: 0.53,
      });

      drawWaveLayer({
        amplitude: 42,
        frequency: 0.0028,
        speed: 0.01,
        offset: Math.PI * 1.5,
        opacity: 0.06,
        hue: (hueA + 45) % 360,
        blur: 28,
        yOffset: 0.535,
      });

      const glow = ctx.createLinearGradient(0, h * 0.43, 0, h * 0.7);
      glow.addColorStop(0, 'rgba(255,255,255,0)');
      glow.addColorStop(0.5, 'rgba(255,255,255,0.035)');
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    };

    const drawWarmTopGlow = () => {
      const w = viewportWidth;
      const h = viewportHeight;

      const topGlow = ctx.createRadialGradient(
        w / 2,
        h * 0.12,
        0,
        w / 2,
        h * 0.12,
        w * 0.45
      );
      topGlow.addColorStop(0, 'rgba(255,170,60,0.14)');
      topGlow.addColorStop(0.18, 'rgba(255,150,35,0.07)');
      topGlow.addColorStop(0.38, 'rgba(120,60,0,0.03)');
      topGlow.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = topGlow;
      ctx.fillRect(0, 0, w, h);
    };

    const drawDustAndBurn = () => {
      const w = viewportWidth;
      const h = viewportHeight;

      if (Math.random() < 0.05) {
        for (let i = 0; i < 4; i++) {
          const x = Math.random() * w;
          const y = Math.random() * h;
          const size = Math.random() * 2 + 0.5;

          ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.18})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (Math.random() < 0.01) {
        const x = Math.random() * w;
        ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.14 + 0.05})`;
        ctx.lineWidth = Math.random() * 1.5 + 0.4;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + (Math.random() - 0.5) * 18, h);
        ctx.stroke();
      }
    };

    const animate = (now = 0) => {
      animationFrameId = requestAnimationFrame(animate);

      if (document.hidden) {
        lastFrameTime = now;
        return;
      }

      if (now - lastFrameTime < FRAME_DURATION) return;
      lastFrameTime = now;

      time += 1;

      const w = viewportWidth;
      const h = viewportHeight;

      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(1, 2, 8, 0.985)';
      ctx.fillRect(0, 0, w, h);

      const ambient = ctx.createRadialGradient(
        w / 2,
        h * 0.55,
        0,
        w / 2,
        h * 0.55,
        w * 0.58
      );
      ambient.addColorStop(0, 'rgba(50, 70, 180, 0.05)');
      ambient.addColorStop(0.35, 'rgba(95, 40, 170, 0.04)');
      ambient.addColorStop(0.7, 'rgba(12, 15, 35, 0.02)');
      ambient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, w, h);

      drawWarmTopGlow();
      drawChromaticBands();

      if (tubeCanvas) ctx.drawImage(tubeCanvas, 0, 0);

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.025;
      ctx.translate(-2, 0);
      drawWaveLayer({
        amplitude: 24,
        frequency: 0.0048,
        speed: 0.016,
        offset: time * 0.01,
        opacity: 0.06,
        hue: 0,
        blur: 20,
        yOffset: 0.53,
      });
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.03;
      ctx.translate(2, 0);
      drawWaveLayer({
        amplitude: 24,
        frequency: 0.0048,
        speed: 0.016,
        offset: time * 0.01 + 1.2,
        opacity: 0.06,
        hue: 220,
        blur: 20,
        yOffset: 0.53,
      });
      ctx.restore();

      if (scanlineCanvas) ctx.drawImage(scanlineCanvas, 0, 0);
      if (gridCanvas) ctx.drawImage(gridCanvas, 0, 0);
      if (noiseCanvas) ctx.drawImage(noiseCanvas, 0, 0);

      drawDustAndBurn();

      const flicker = Math.sin(time * 0.22) * 0.006 + Math.random() * 0.004;
      ctx.fillStyle = `rgba(255,255,255,${flicker})`;
      ctx.fillRect(0, 0, w, h);

      const vignette = ctx.createRadialGradient(
        w / 2,
        h / 2,
        w * 0.12,
        w / 2,
        h / 2,
        w * 0.74
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(0.55, 'rgba(0,0,0,0.24)');
      vignette.addColorStop(0.82, 'rgba(0,0,0,0.52)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.86)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);
    };

    animate();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const sectionStyle: CSSProperties = {
    minHeight: '100vh',
    padding: '120px 24px 80px',
    scrollMarginTop: '100px',
    position: 'relative',
    zIndex: 1,
    color: 'white',
  };

  const cardStyle: CSSProperties = {
    background: 'rgba(24,24,27,0.72)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
  };

  return (
    <main
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#000',
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <PillBase />

        <section
          id="home"
          style={{
            ...sectionStyle,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '1180px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                ...cardStyle,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '440px',
                maxWidth: '320px',
              }}
            >
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <img
                  src="/fotofrente.jpg"
                  alt="Minha foto"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                  }}
                />
              </div>

              <div
                style={{
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  background: 'rgba(0,0,0,0.25)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', color: '#e4e4e7' }}>
                    Engenharia de Software
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#a1a1aa',
                      marginTop: '4px',
                    }}
                  >
                    IBMEC
                  </div>
                </div>

                <a
                  href="/curriculo-gustavo.pdf"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#18181b',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '9px 14px',
                    fontSize: '13px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.08)',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#27272a';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#18181b';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Baixar CV
                </a>
              </div>
            </div>

            <div>
              <p
                style={{
                  fontSize: '13px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#c7d2fe',
                  marginBottom: '12px',
                }}
              >
                Portfólio pessoal
              </p>

              <ScrambleName text="Gustavo Zocharato Ferreira" />

              <p
                style={{
                  marginTop: '16px',
                  fontSize: '20px',
                  color: '#d4d4d8',
                }}
              >
                Engenharia de Software | IBMEC
              </p>
            </div>
          </div>
        </section>

        <section id="sobre" style={sectionStyle}>
          <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
            <p
              style={{
                color: '#c7d2fe',
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '10px',
              }}
            >
              Sobre
            </p>

            <h2
              style={{
                fontSize: '42px',
                marginTop: '10px',
                marginBottom: '28px',
              }}
            >
              Sobre
            </h2>

            <AboutTabs />
          </div>
        </section>

        <section id="habilidades" style={sectionStyle}>
          <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
            <p
              style={{
                color: '#c7d2fe',
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              Habilidades
            </p>

            <h2
              style={{
                fontSize: '42px',
                marginTop: '10px',
                marginBottom: '28px',
              }}
            >
              Habilidades
            </h2>

            <SkillsOrbit />
          </div>
        </section>

        <section id="hobbies" style={sectionStyle}>
          <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
            <p
              style={{
                color: '#c7d2fe',
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              Hobbies
            </p>
            <h2
              style={{
                fontSize: '42px',
                marginTop: '10px',
                marginBottom: '28px',
              }}
            >
              Hobbies
            </h2>

            <HobbiesWheel />
          </div>
        </section>

        <section id="contato" style={sectionStyle}>
          <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
            <p
              style={{
                color: '#c7d2fe',
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              Contato
            </p>

            <h2
              style={{
                fontSize: '42px',
                marginTop: '10px',
                marginBottom: '28px',
              }}
            >
              Contato
            </h2>

            <GetInTouch />
          </div>
        </section>
      </div>
    </main>
  );
}
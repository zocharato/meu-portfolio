'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface RotatingEarthProps {
  width?: number;
  height?: number;
  className?: string;
}

type DotData = {
  lng: number;
  lat: number;
};

export default function RotatingEarth({
  width = 700,
  height = 460,
  className = '',
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const FPS = 30;
    const FRAME_DURATION = 1000 / FPS;

    let animationFrameId = 0;
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastFrameTime = 0;

    let containerWidth = Math.min(width, window.innerWidth - 40);
    let containerHeight = Math.min(height, window.innerHeight - 100);
    let baseRadius = Math.min(containerWidth, containerHeight) / 2.65;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

    const projection = d3
      .geoOrthographic()
      .scale(baseRadius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(context);
    const graticule = d3.geoGraticule();

    const rotation: [number, number] = [0, 0];
    let autoRotate = true;
    const rotationSpeed = 0.22;
    let landFeatures: any = null;
    const allDots: DotData[] = [];

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point;
      let inside = false;

      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }

      return inside;
    };

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry;

      if (geometry.type === 'Polygon') {
        const coordinates = geometry.coordinates;
        if (!pointInPolygon(point, coordinates[0])) return false;

        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) return false;
        }

        return true;
      }

      if (geometry.type === 'MultiPolygon') {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false;

            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true;
                break;
              }
            }

            if (!inHole) return true;
          }
        }
      }

      return false;
    };

    const generateDotsInPolygon = (feature: any, dotSpacing = 18) => {
      const dots: [number, number][] = [];
      const bounds = d3.geoBounds(feature);
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;

      const stepSize = dotSpacing * 0.085;

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat];
          if (pointInFeature(point, feature)) {
            dots.push(point);
          }
        }
      }

      return dots;
    };

    const updateCanvasSize = () => {
      containerWidth = Math.min(width, window.innerWidth - 40);
      containerHeight = Math.min(height, window.innerHeight - 100);
      baseRadius = Math.min(containerWidth, containerHeight) / 2.65;

      canvas.width = Math.floor(containerWidth * dpr);
      canvas.height = Math.floor(containerHeight * dpr);
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);

      projection
        .scale(baseRadius)
        .translate([containerWidth / 2, containerHeight / 2])
        .rotate(rotation);
    };

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight);

      const currentScale = projection.scale();
      const scaleFactor = currentScale / baseRadius;
      const cx = containerWidth / 2;
      const cy = containerHeight / 2;

      context.beginPath();
      context.arc(cx, cy, currentScale, 0, 2 * Math.PI);
      context.fillStyle = '#000000';
      context.fill();
      context.strokeStyle = '#ffffff';
      context.lineWidth = 1.4 * scaleFactor;
      context.stroke();

      if (!landFeatures) return;

      context.save();

      context.beginPath();
      path(graticule());
      context.strokeStyle = '#ffffff';
      context.lineWidth = 0.7 * scaleFactor;
      context.globalAlpha = 0.16;
      context.stroke();

      context.beginPath();
      landFeatures.features.forEach((feature: any) => {
        path(feature);
      });
      context.strokeStyle = '#ffffff';
      context.lineWidth = 0.85 * scaleFactor;
      context.globalAlpha = 0.88;
      context.stroke();

      context.globalAlpha = 1;
      context.fillStyle = '#9ca3af';

      const dotSize = Math.max(0.9, 1.05 * scaleFactor);

      for (let i = 0; i < allDots.length; i++) {
        const dot = allDots[i];
        const projected = projection([dot.lng, dot.lat]);

        if (!projected) continue;

        const [x, y] = projected;

        if (
          x >= 0 &&
          x <= containerWidth &&
          y >= 0 &&
          y <= containerHeight
        ) {
          const dx = x - cx;
          const dy = y - cy;

          if (dx * dx + dy * dy <= currentScale * currentScale) {
            context.fillRect(x - dotSize / 2, y - dotSize / 2, dotSize, dotSize);
          }
        }
      }

      context.restore();
    };

    const loadWorldData = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json'
        );

        if (!response.ok) {
          throw new Error('Failed to load land data');
        }

        landFeatures = await response.json();

        allDots.length = 0;
        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 18);
          for (let i = 0; i < dots.length; i++) {
            const [lng, lat] = dots[i];
            allDots.push({ lng, lat });
          }
        });

        render();
      } catch {
        setError('Não foi possível carregar a animação do globo.');
      }
    };

    const animate = (now = 0) => {
      animationFrameId = requestAnimationFrame(animate);

      if (document.hidden || !landFeatures) {
        lastFrameTime = now;
        return;
      }

      if (now - lastFrameTime < FRAME_DURATION) return;
      lastFrameTime = now;

      if (autoRotate) {
        rotation[0] += rotationSpeed;
        projection.rotate(rotation);
        render();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      autoRotate = false;
      canvas.setPointerCapture?.(event.pointerId);

      const startX = event.clientX;
      const startY = event.clientY;
      const startRotation: [number, number] = [rotation[0], rotation[1]];

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const sensitivity = 0.45;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        rotation[0] = startRotation[0] + dx * sensitivity;
        rotation[1] = startRotation[1] - dy * sensitivity;
        rotation[1] = Math.max(-90, Math.min(90, rotation[1]));

        projection.rotate(rotation);
        render();
      };

      const handlePointerUp = () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);

        setTimeout(() => {
          autoRotate = true;
        }, 60);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const zoomFactor = event.deltaY > 0 ? 0.92 : 1.08;
      const newRadius = Math.max(
        baseRadius * 0.55,
        Math.min(baseRadius * 2.2, projection.scale() * zoomFactor)
      );

      projection.scale(newRadius);
      render();
    };

    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateCanvasSize();
        render();
      }, 120);
    };

    updateCanvasSize();
    loadWorldData();
    animationFrameId = requestAnimationFrame(animate);

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
    };
  }, [width, height]);

  if (error) {
    return (
      <div
        className={className}
        style={{
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(24,24,27,0.72)',
          padding: '28px',
          color: '#a1a1aa',
          textAlign: 'center',
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div className={className} style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '24px',
          display: 'block',
          margin: '0 auto',
          background: 'transparent',
          touchAction: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '16px',
          bottom: '16px',
          fontSize: '12px',
          color: '#a1a1aa',
          background: 'rgba(10,10,12,0.75)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '8px 10px',
        }}
      >
        Arraste para girar • Scroll para zoom
      </div>
    </div>
  );
}
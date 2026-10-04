import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
}

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
}

const STAR_DENSITY = 1 / 9000; // bintang per piksel

/**
 * Starfield ringan di canvas: tiga lapis bintang berkedip pelan + komet sesekali.
 * Jika pengguna meminta reduced motion, canvas digambar sekali tanpa animasi.
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: Star[] = [];
    let comets: Comet[] = [];
    let width = 0;
    let height = 0;
    let rafId = 0;
    let nextCometAt = 2500;
    let startTime = performance.now();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(260, Math.max(70, Math.round(width * height * STAR_DENSITY)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.1 + 0.35,
        baseAlpha: Math.random() * 0.45 + 0.25,
        twinkleSpeed: Math.random() * 0.0009 + 0.0003,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const spawnComet = () => {
      const fromLeft = Math.random() > 0.35;
      const speed = Math.random() * 0.22 + 0.16;
      const angle = (Math.random() * 12 + 18) * (Math.PI / 180);
      comets.push({
        x: fromLeft ? -80 : width + 80,
        y: Math.random() * height * 0.55,
        vx: (fromLeft ? 1 : -1) * Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 5200,
        length: Math.random() * 90 + 90,
      });
    };

    const drawStars = (time: number) => {
      for (const s of stars) {
        const alpha = reducedMotion
          ? s.baseAlpha + 0.2
          : s.baseAlpha + Math.sin(time * s.twinkleSpeed + s.phase) * 0.3;
        ctx.globalAlpha = Math.max(0.08, Math.min(1, alpha));
        ctx.fillStyle = '#E6F4FF';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const drawComets = (delta: number) => {
      comets = comets.filter((c) => c.life < c.maxLife && c.x > -260 && c.x < width + 260);
      for (const c of comets) {
        c.life += delta;
        c.x += c.vx * delta;
        c.y += c.vy * delta;

        const tailX = c.x - c.vx * c.length * 4;
        const tailY = c.y - c.vy * c.length * 4;
        const fade = 1 - c.life / c.maxLife;

        const grad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
        grad.addColorStop(0, `rgba(190, 245, 255, ${0.85 * fade})`);
        grad.addColorStop(0.4, `rgba(34, 211, 238, ${0.35 * fade})`);
        grad.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.fillStyle = `rgba(230, 250, 255, ${0.9 * fade})`;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let lastTime = performance.now();
    const frame = (now: number) => {
      const delta = Math.min(now - lastTime, 60);
      lastTime = now;
      ctx.clearRect(0, 0, width, height);
      drawStars(now - startTime);

      nextCometAt -= delta;
      if (nextCometAt <= 0) {
        spawnComet();
        nextCometAt = Math.random() * 9000 + 7000;
      }
      drawComets(delta);
      rafId = requestAnimationFrame(frame);
    };

    resize();

    if (reducedMotion) {
      ctx.clearRect(0, 0, width, height);
      drawStars(0);
    } else {
      startTime = performance.now();
      lastTime = startTime;
      rafId = requestAnimationFrame(frame);
    }

    const onResize = () => {
      resize();
      if (reducedMotion) {
        ctx.clearRect(0, 0, width, height);
        drawStars(0);
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-70"
    />
  );
}

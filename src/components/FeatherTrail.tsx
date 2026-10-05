import { useEffect, useRef } from "react";

type Feather = { x: number; y: number; a: number; vx: number; vy: number; s: number; born: number; life: number; hue: number; spin: number; burst: boolean };
type Dust = { x: number; y: number; vx: number; vy: number; born: number; life: number; hue: number };

const HUES = [354, 335, 315, 300, 285, 265];

/** Abstract cosmic feather-ribbon trail. intensity: 0..1.5, target: logo center for subtle orbiting. */
export function FeatherTrail({ intensityRef, targetRef }: { intensityRef: React.MutableRefObject<number>; targetRef: React.MutableRefObject<{ x: number; y: number; r: number } | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (reduce || touch) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);

    const feathers: Feather[] = [];
    const dust: Dust[] = [];
    let last = { x: 0, y: 0, t: 0 };
    let lastSpawn = 0;
    let sweep = 0;
    let burstUntil = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const dx = e.clientX - last.x, dy = e.clientY - last.y;
      const dist = Math.hypot(dx, dy);
      const dt = Math.max(1, now - last.t);
      const speed = dist / dt;
      sweep = sweep * 0.9 + dist;
      if (sweep > 1400 && now > burstUntil + 6000 && Math.random() < 0.5) burstUntil = now + 450;
      const gap = speed > 1.2 ? 35 : 60;
      if (dist > 2 && now - lastSpawn > gap) {
        lastSpawn = now;
        const ang = Math.atan2(dy, dx);
        const burst = now < burstUntil;
        const count = burst ? 2 : 1;
        for (let i = 0; i < count; i++) {
          const side = (Math.random() - 0.5) * 0.6;
          feathers.push({
            x: e.clientX - Math.cos(ang) * 6, y: e.clientY - Math.sin(ang) * 6,
            a: ang + Math.PI + (Math.random() - 0.5) * 0.6,
            vx: Math.cos(ang + Math.PI / 2) * side + (burst ? Math.cos(ang + Math.PI / 2) * Math.sin(now / 90) * 1.2 : 0),
            vy: Math.sin(ang + Math.PI / 2) * side + 0.05,
            s: (speed > 1.2 ? 9 : 6) + Math.random() * 7,
            born: now, life: 700 + Math.random() * 500,
            hue: HUES[(Math.random() * HUES.length) | 0]!, spin: (Math.random() - 0.5) * 0.004, burst,
          });
        }
        while (feathers.length > 36) feathers.shift();
      }
      last = { x: e.clientX, y: e.clientY, t: now };
    };
    addEventListener("pointermove", onMove);

    const drawFeather = (f: Feather, p: number, k: number) => {
      const alpha = (1 - p) * 0.8 * k;
      const s = f.s * (1 - p * 0.45);
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.a);
      const g = ctx.createLinearGradient(-s, 0, s * 1.6, 0);
      g.addColorStop(0, `oklch(0.95 0.04 ${f.hue} / ${alpha})`);
      g.addColorStop(0.4, `oklch(0.72 0.22 ${f.hue} / ${alpha})`);
      g.addColorStop(1, `oklch(0.4 0.18 ${f.hue - 30} / 0)`);
      ctx.fillStyle = g;
      ctx.shadowColor = `oklch(0.7 0.24 ${f.hue} / ${alpha})`;
      ctx.shadowBlur = 8 * k;
      ctx.beginPath();
      ctx.moveTo(-s, 0);
      ctx.quadraticCurveTo(0, -s * 0.55, s * 1.8, -s * 0.15);
      ctx.quadraticCurveTo(s * 0.4, s * 0.05, -s, 0);
      ctx.fill();
      ctx.restore();
    };

    const loop = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      const k = intensityRef.current;
      const tgt = targetRef.current;
      for (let i = feathers.length - 1; i >= 0; i--) {
        const f = feathers[i]!;
        const p = (now - f.born) / f.life;
        if (p >= 1) {
          const n = 2 + ((Math.random() * 3) | 0);
          for (let j = 0; j < n && dust.length < 80; j++)
            dust.push({ x: f.x, y: f.y, vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6 - 0.1, born: now, life: 400 + Math.random() * 300, hue: f.hue });
          feathers.splice(i, 1);
          continue;
        }
        if (tgt) {
          const dx = tgt.x - f.x, dy = tgt.y - f.y, d = Math.hypot(dx, dy);
          if (d < tgt.r * 1.6 && d > 20) { f.vx += (dx / d) * 0.02 - (dy / d) * 0.03; f.vy += (dy / d) * 0.02 + (dx / d) * 0.03; }
        }
        f.x += f.vx; f.y += f.vy; f.a += f.spin * 16;
        if (k > 0) drawFeather(f, p, k);
      }
      for (let i = dust.length - 1; i >= 0; i--) {
        const d = dust[i]!;
        const p = (now - d.born) / d.life;
        if (p >= 1) { dust.splice(i, 1); continue; }
        d.x += d.vx; d.y += d.vy;
        ctx.fillStyle = `oklch(0.9 0.1 ${d.hue} / ${(1 - p) * 0.8 * k})`;
        ctx.beginPath(); ctx.arc(d.x, d.y, 1.1, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", onMove); removeEventListener("resize", resize); };
  }, [intensityRef, targetRef]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-40 h-full w-full" />;
}

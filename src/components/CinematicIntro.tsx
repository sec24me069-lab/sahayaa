import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import universe from "@/assets/universe.jpg";
import blackhole from "@/assets/blackhole.jpg";
import horizon from "@/assets/horizon.jpg";
import flamingo from "@/assets/flamingo.png";
import { FeatherTrail } from "./FeatherTrail";

const DURATION = 15;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ss = (a: number, b: number, t: number) => { const x = clamp((t - a) / (b - a)); return x * x * (3 - 2 * x); };
const win = (inA: number, inB: number, outA: number, outB: number, t: number) => ss(inA, inB, t) * (1 - ss(outA, outB, t));

const FRAGMENTS = [
  { w: "SCHEMES", x: -34, y: -14, r: -12, z: 1.1 },
  { w: "ELIGIBILITY", x: -22, y: 18, r: -8, z: 1.3 },
  { w: "DOCUMENTS", x: 22, y: -26, r: 6, z: 0.9 },
  { w: "APPLICATION", x: 4, y: -18, r: 9, z: 0.8 },
  { w: "DEPARTMENTS", x: 28, y: 2, r: -10, z: 1.0 },
  { w: "GUIDANCE", x: 32, y: 22, r: -4, z: 1.15 },
  { w: "SUPPORT", x: -6, y: 4, r: 5, z: 0.7 },
  { w: "REPORTS", x: 8, y: 24, r: 7, z: 1.0 },
];
const LETTERS = "SAHAAYA".split("");

export function CinematicIntro() {
  const navigate = useNavigate();
  const [t, setT] = useState(0);
  const [showChrome, setShowChrome] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const startRef = useRef(0);
  const rafRef = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const [par, setPar] = useState({ x: 0, y: 0 });
  const intensity = useRef(1);
  const target = useRef<{ x: number; y: number; r: number } | null>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const chromeTimer = useRef<number>(0);
  const reduce = useRef(false);

  const play = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();
    setLeaving(false);
    const tick = () => {
      const el = (performance.now() - startRef.current) / 1000;
      setT(Math.min(el, DURATION));
      setPar((p) => ({ x: p.x + (mouse.current.x - p.x) * 0.05, y: p.y + (mouse.current.y - p.y) * 0.05 }));
      if (el < DURATION) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    play();
    const onMove = (e: PointerEvent) => {
      if (fine && !reduce.current) mouse.current = { x: e.clientX / innerWidth - 0.5, y: e.clientY / innerHeight - 0.5 };
      setShowChrome(true);
      clearTimeout(chromeTimer.current);
      chromeTimer.current = window.setTimeout(() => setShowChrome(false), 2200);
    };
    addEventListener("pointermove", onMove);
    addEventListener("pointerdown", onMove);
    return () => { cancelAnimationFrame(rafRef.current); removeEventListener("pointermove", onMove); removeEventListener("pointerdown", onMove); clearTimeout(chromeTimer.current); };
  }, [play]);

  // feather trail intensity + logo target
  intensity.current = t > 5 && t < 8 ? 1.35 : t > 10.5 ? 0.6 : 1;
  useEffect(() => {
    if (t > 6 && logoRef.current) {
      const r = logoRef.current.getBoundingClientRect();
      target.current = { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 };
    } else target.current = null;
  }, [t > 6]); // eslint-disable-line react-hooks/exhaustive-deps

  const done = t >= 13;
  const rm = reduce.current;
  const enter = () => { setLeaving(true); setTimeout(() => navigate({ to: "/home" }), 1100); };

  // layer values
  const uni = win(0, 1.2, 2.6, 3.6, t);
  const bh = win(2, 3.2, 5.6, 7, t);
  const hz = ss(6.5, 9, t);
  const cardsIn = win(0.9, 1.6, 3, 3.9, t);
  const pull = ss(2, 3.8, t);
  const sDraw = ss(3.6, 5.4, t);
  const sOp = win(3.6, 4.2, 6, 7, t);
  const logoReveal = ss(5, 7, t);
  const settle = ss(8, 9.5, t);
  const ring = ss(8, 9.5, t);
  const beam = win(9, 9.6, 11, 12.5, t);
  const sweepX = ss(9.6, 11, t);
  const glowCenter = ss(13, 15, t);
  const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
  const px = (d: number) => `translate3d(${par.x * d}px, ${par.y * d}px, 0)`;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background font-display" aria-label="SAHAAYA brand introduction">
      <div className="absolute inset-0 transition-transform duration-1000 ease-in" style={{ transform: leaving ? "scale(4)" : undefined, opacity: leaving ? 0 : 1, transition: "transform 1.1s cubic-bezier(.7,0,.3,1), opacity 1.1s ease-in" }}>
        {/* Scene 1 — universe */}
        <img src={universe} alt="" className="absolute inset-[-4%] h-[108%] w-[108%] object-cover" style={{ opacity: uni, transform: `${px(-14)} scale(${rm ? 1 : 1 + t * 0.012})` }} />
        {/* Scene 3–5 — black hole */}
        <img src={blackhole} alt="" className="absolute inset-[-4%] h-[108%] w-[108%] object-cover" style={{ opacity: bh, transform: `${px(-20)} scale(${rm ? 1.05 : 1.25 - ss(2, 6, t) * 0.15}) rotate(${rm ? 0 : (t - 2) * -0.6}deg)` }} />
        {/* Scene 8+ — horizon */}
        <img src={horizon} alt="" className="absolute inset-[-4%] h-[108%] w-[108%] object-cover" style={{ opacity: hz, transform: `${px(-10)} scale(${rm ? 1 : lerp(1.12, 1, ss(6.5, 12, t))})` }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 35%, var(--cosmic-black) 100%)", opacity: 0.85 }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, oklch(0.9 0.08 350 / 0.5), transparent 45%)", opacity: glowCenter * 0.7 }} />

        {/* Scene 2–3 — fragments */}
        {cardsIn > 0 && FRAGMENTS.map((f, i) => {
          const k = rm ? 0 : clamp(pull * (1 + i * 0.06));
          const x = lerp(f.x, 0, k), y = lerp(f.y, -2, k);
          const drift = rm ? 0 : Math.sin(t * 0.9 + i) * 1.2;
          return (
            <div key={f.w} className="glass-fragment absolute left-1/2 top-1/2 rounded-md px-4 py-2 text-[11px] font-medium tracking-[0.25em] sm:text-sm"
              style={{ opacity: cardsIn * (1 - k * 0.8), transform: `translate(-50%,-50%) translate(${x}vw, ${y + drift}vh) rotate(${f.r + k * 140}deg) scale(${f.z * (1 - k * 0.85)})`, filter: f.z > 1.2 ? "blur(0.6px)" : undefined }}>
              {f.w}
            </div>
          );
        })}

        {/* Scene 4–5 — the cosmic S */}
        {sOp > 0 && (
          <svg viewBox="0 0 400 400" className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2" style={{ opacity: sOp }} aria-hidden>
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--cosmic-rose)" />
                <stop offset=".35" stopColor="var(--cosmic-pink)" />
                <stop offset=".75" stopColor="var(--cosmic-violet)" />
                <stop offset="1" stopColor="var(--cosmic-deep)" />
              </linearGradient>
              <filter id="glow"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            {[0, 1, 2].map((i) => (
              <path key={i} d="M268 70 C 210 30, 140 70, 175 130 C 205 180, 290 200, 255 280 C 225 345, 130 330, 110 290"
                fill="none" stroke="url(#sg)" strokeLinecap="round" strokeWidth={14 - i * 4} filter="url(#glow)" opacity={1 - i * 0.25}
                pathLength={1} strokeDasharray="1" strokeDashoffset={1 - sDraw} transform={`translate(${i * 6 - 6} ${i * 3})`} />
            ))}
          </svg>
        )}

        {/* Scene 6–11 — flamingo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ transform: px(3) }}>
          <div ref={logoRef} className="relative" style={{ transform: `translateY(${lerp(0, -4, ss(9, 11, t))}vh) scale(${lerp(1.08, 0.82, settle)})` }}>
            {/* orbital ring */}
            <div className="absolute left-1/2 top-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full border" style={{ opacity: ring * 0.6, borderColor: "oklch(0.8 0.15 340 / 0.5)", boxShadow: "0 0 30px oklch(0.68 0.24 354 / 0.25), inset 0 0 30px oklch(0.66 0.24 305 / 0.15)", transform: `translate(-50%,-50%) scale(${lerp(0.85, 1, ring)})` }} />
            <div className={done && !rm ? "animate-breathe" : undefined}>
              <div className="relative overflow-hidden" style={{
                width: "min(46vmin, 420px)", aspectRatio: "1",
                opacity: logoReveal,
                clipPath: rm ? undefined : `inset(0 0 ${(1 - logoReveal) * 100}% 0)`,
                filter: `drop-shadow(0 0 ${lerp(30, 14, settle)}px oklch(0.68 0.24 354 / 0.55))`,
                transform: `scale(${lerp(0.9, 1, logoReveal)})`,
              }}>
                <img src={flamingo} alt="SAHAAYA flamingo brandmark" width={1024} height={1024} className="h-full w-full object-contain" />
                {t > 7 && <div className="animate-shine pointer-events-none absolute inset-y-[-20%] left-0 w-1/4" style={{ background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.35), transparent)", mixBlendMode: "overlay" }} />}
              </div>
            </div>
          </div>

          {/* beam */}
          <div className="pointer-events-none absolute left-1/2 top-[60%] h-[40vh] w-px -translate-x-1/2" style={{ opacity: beam, background: "linear-gradient(to bottom, var(--cosmic-rose), oklch(0.68 0.24 354 / 0))", boxShadow: "0 0 18px var(--cosmic-pink)" }} />

          {/* wordmark */}
          <div className="relative mt-[2vh]" style={{ opacity: ss(9.5, 10, t) }}>
            <h1 className="flex select-none text-[11vw] font-extralight tracking-[0.32em] sm:text-7xl md:text-8xl" aria-label="SAHAAYA">
              {LETTERS.map((l, i) => {
                const at = (i + 0.5) / LETTERS.length;
                const k = rm ? ss(9.6, 11, t) : clamp((sweepX - at + 0.12) / 0.12);
                return (
                  <span key={i} aria-hidden className="wordmark inline-block" style={{ opacity: k, transform: `translateY(${(1 - k) * 10}px)`, filter: `blur(${(1 - k) * 6}px)` }}>{l}</span>
                );
              })}
            </h1>
            {/* light sweep */}
            <div className="pointer-events-none absolute -bottom-2 h-px" style={{ left: 0, width: `${sweepX * 100}%`, opacity: win(9.5, 9.8, 10.9, 11.6, t), background: "linear-gradient(90deg, transparent, var(--cosmic-rose))", boxShadow: "0 0 14px var(--cosmic-pink)" }} />
          </div>

          {/* enter */}
          <button onClick={enter} className="cosmic-pill mt-10 rounded-full px-8 py-2.5 text-xs tracking-[0.5em] transition-all duration-700 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ opacity: ss(13, 14, t), pointerEvents: done ? "auto" : "none" }}>
            ENTER
          </button>
        </div>
      </div>

      <FeatherTrail intensityRef={intensity} targetRef={target} />

      {/* chrome */}
      <button onClick={() => navigate({ to: "/home" })} className="absolute right-6 top-5 z-50 text-[10px] tracking-[0.3em] text-muted-foreground transition-opacity duration-700 hover:text-foreground"
        style={{ opacity: !done && showChrome ? 0.6 : 0, pointerEvents: done ? "none" : "auto" }}>
        SKIP INTRO
      </button>
      <button onClick={play} className="absolute bottom-6 right-6 z-50 text-[11px] tracking-[0.3em] text-muted-foreground transition-opacity duration-1000 hover:text-foreground"
        style={{ opacity: done ? 0.7 : 0, pointerEvents: done ? "auto" : "none" }}>
        ↻ REPLAY
      </button>
    </main>
  );
}

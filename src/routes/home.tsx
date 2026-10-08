import { createFileRoute, Link } from "@tanstack/react-router";
import horizon from "@/assets/horizon.jpg";
import { SchemeFinder } from "@/components/SchemeFinder";
import { SchemeDiscovery } from "@/components/SchemeDiscovery";
import flamingo from "@/assets/flamingo.png";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "SAHAAYA — Find the support you're entitled to" },
      { name: "description", content: "SAHAAYA helps you discover government schemes and civic support, understand eligibility, and get guided to apply." },
      { property: "og:title", content: "SAHAAYA — Find the support you're entitled to" },
      { property: "og:description", content: "Discover schemes, understand eligibility, and get guided to apply." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const STEPS = [
  { n: "01", t: "Tell us about you", d: "Answer a few simple questions about your age, location, income and family — in your own language." },
  { n: "02", t: "See what fits", d: "SAHAAYA matches you with schemes and services you're likely eligible for, and explains why in plain words." },
  { n: "03", t: "Get guided through", d: "Know exactly which documents to gather, which office handles it, and what happens next." },
];

function Home() {
  return (
    <main className="min-h-screen bg-background font-display animate-in fade-in duration-1000">
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <img src={horizon} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, var(--background))" }} />
        <img src={flamingo} alt="SAHAAYA flamingo" width={1024} height={1024} className="animate-breathe relative w-28 sm:w-36" style={{ filter: "drop-shadow(var(--glow-pink))" }} />
        <h1 className="wordmark relative mt-5 -mr-[0.4em] text-4xl font-extralight tracking-[0.4em] sm:text-6xl">SAHAAYA</h1>
        <p className="relative mt-6 max-w-xl text-lg font-light text-muted-foreground sm:text-xl">
          Find the support you're entitled to — and the way to get it.
        </p>
        <a href="#finder" className="cosmic-pill relative mt-10 rounded-full px-8 py-3 text-xs tracking-[0.35em] transition-transform hover:scale-105">FIND MY SCHEMES</a>
      </section>

      {/* How it works */}
      <section id="how" className="relative mx-auto max-w-6xl px-6 py-28">
        <p className="text-xs tracking-[0.4em] text-primary">HOW IT WORKS</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-light leading-tight sm:text-5xl">From scattered information to one clear path.</h2>
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-card p-8 sm:p-10">
              <span className="wordmark text-5xl font-extralight">{s.n}</span>
              <h3 className="mt-6 text-xl font-medium">{s.t}</h3>
              <p className="mt-3 font-light leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <SchemeFinder />

      <SchemeDiscovery />

      <footer className="flex flex-col items-center gap-4 border-t px-6 py-12 text-xs tracking-[0.3em] text-muted-foreground sm:flex-row sm:justify-between">
        <span className="wordmark">SAHAAYA</span>
        <Link to="/" className="hover:text-foreground">↻ REPLAY INTRO</Link>
      </footer>
    </main>
  );
}

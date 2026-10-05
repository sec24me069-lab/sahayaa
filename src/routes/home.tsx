import { createFileRoute, Link } from "@tanstack/react-router";
import horizon from "@/assets/horizon.jpg";
import universe from "@/assets/universe.jpg";
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

const SCHEMES = [
  { t: "Education", d: "Scholarships, fee waivers and learning support for students of every age.", c: "128 schemes" },
  { t: "Health", d: "Insurance cover, free treatment and maternal & child care programmes.", c: "94 schemes" },
  { t: "Housing", d: "Home construction aid, rental support and basic amenities.", c: "41 schemes" },
  { t: "Livelihood", d: "Skill training, self-employment loans and job guarantees.", c: "76 schemes" },
  { t: "Agriculture", d: "Crop insurance, farm inputs, income support for farmers.", c: "63 schemes" },
  { t: "Social security", d: "Pensions for seniors, widows and persons with disabilities.", c: "52 schemes" },
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
        <a href="#schemes" className="cosmic-pill relative mt-10 rounded-full px-8 py-3 text-xs tracking-[0.35em] transition-transform hover:scale-105">EXPLORE SCHEMES</a>
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

      {/* Scheme discovery */}
      <section id="schemes" className="relative overflow-hidden py-28">
        <img src={universe} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, var(--background), transparent 20%, transparent 80%, var(--background))" }} />
        <div className="relative mx-auto max-w-6xl px-6">
          <p className="text-xs tracking-[0.4em] text-primary">SCHEME DISCOVERY</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-light leading-tight sm:text-5xl">Every kind of support, in one place.</h2>
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SCHEMES.map((s) => (
              <article key={s.t} className="cosmic-card group rounded-2xl p-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">{s.t}</h3>
                  <span className="text-xs tracking-widest text-muted-foreground">{s.c}</span>
                </div>
                <p className="mt-4 font-light leading-relaxed text-muted-foreground">{s.d}</p>
                <span className="mt-6 inline-block text-xs tracking-[0.3em] text-primary opacity-70 transition-opacity group-hover:opacity-100">VIEW SCHEMES →</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="flex flex-col items-center gap-4 border-t px-6 py-12 text-xs tracking-[0.3em] text-muted-foreground sm:flex-row sm:justify-between">
        <span className="wordmark">SAHAAYA</span>
        <Link to="/" className="hover:text-foreground">↻ REPLAY INTRO</Link>
      </footer>
    </main>
  );
}

import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
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

function Home() {
  const { lang, t } = useI18n();
  const steps = [1, 2, 3].map((n) => ({ n: `0${n}`, t: t(`step${n}t`), d: t(`step${n}d`) }));
  return (
    <main className="min-h-screen bg-background font-display animate-in fade-in duration-1000">
      <div className="absolute inset-x-0 top-5 z-20 flex flex-wrap items-center justify-center gap-3 px-4 sm:justify-end sm:px-8">
        <Link to="/dashboard" className="cosmic-pill rounded-full px-4 py-2 text-xs tracking-[0.2em]">MY APPLICATIONS</Link>
        <LanguageSwitcher />
      </div>
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <img src={horizon} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, var(--background))" }} />
        <img src={flamingo} alt="SAHAAYA flamingo" width={1024} height={1024} className="animate-breathe relative w-28 sm:w-36" style={{ filter: "drop-shadow(var(--glow-pink))" }} />
        <h1 className="wordmark relative mt-5 -mr-[0.4em] text-4xl font-extralight tracking-[0.4em] sm:text-6xl">SAHAAYA</h1>
        <p className="relative mt-6 max-w-xl text-lg font-light text-muted-foreground sm:text-xl">
          {t("tagline")}
        </p>
        <Button asChild variant="ghost" className="h-auto"><a href="#finder" className="cosmic-pill relative mt-10 rounded-full px-8 py-3 text-xs tracking-[0.35em] transition-transform hover:scale-105">{t("findMine")}</a></Button>
      </section>

      {/* How it works */}
      <section id="how" className="relative mx-auto max-w-6xl px-6 py-28">
        <p className="text-xs tracking-[0.4em] text-primary">{t("howLabel")}</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-light leading-tight sm:text-5xl">{t("howTitle")}</h2>
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="bg-card p-8 sm:p-10">
              <span className="wordmark text-5xl font-extralight">{s.n}</span>
              <h3 className="mt-6 text-xl font-medium">{s.t}</h3>
              <p className="mt-3 font-light leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <SchemeFinder key={lang} />

      <SchemeDiscovery />

      <footer className="flex flex-col items-center gap-4 border-t px-6 py-12 text-xs tracking-[0.3em] text-muted-foreground sm:flex-row sm:justify-between">
        <span className="wordmark">SAHAAYA</span>
        <Link to="/" className="hover:text-foreground">{t("replay")}</Link>
      </footer>
    </main>
  );
}

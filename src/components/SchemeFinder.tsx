import { LANG_NAMES, localizeScheme, useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { getRecommendations } from "@/lib/recommend.functions";
import { getScheme } from "@/lib/schemes";
import { logEvent } from "@/lib/activity";

type Item = { slug: string; match: "strong" | "possible"; reasons: string[]; check: string };

const field = "w-full rounded-xl border bg-card px-4 py-3 font-light text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

export function SchemeFinder() {
  const { lang, t } = useI18n();
  const run = useServerFn(getRecommendations);
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [needs, setNeeds] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<Item[] | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true); setError(""); setItems(null);
    logEvent("assessment_started");
    try {
      const r = await run({ data: { location: location.trim(), age: Number(age), needs: `${needs.trim()}\nPlease answer in ${LANG_NAMES[lang]}.` } });
      if (r.ok) { setItems(r.items); logEvent("assessment_completed"); logEvent("matches_generated", r.items.length); } else setError(r.error);
    } catch {
      setError(t("checkDetails"));
    } finally { setLoading(false); }
  };

  return (
    <section id="finder" className="relative mx-auto max-w-6xl px-6 py-28">
      <p className="text-xs tracking-[0.4em] text-primary">{t("finderLabel")}</p>
      <h2 className="mt-4 max-w-2xl text-3xl font-light leading-tight sm:text-5xl">{t("finderTitle")}</h2>
      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <form onSubmit={submit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs tracking-[0.25em] text-muted-foreground">{t("fLocation")}</span>
            <input required minLength={2} value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t("fLocationPh")} className={field} />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs tracking-[0.25em] text-muted-foreground">{t("fAge")}</span>
            <input required type="number" min={0} max={120} value={age} onChange={(e) => setAge(e.target.value)} placeholder={t("fAgePh")} className={field} />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs tracking-[0.25em] text-muted-foreground">{t("fNeeds")}</span>
            <textarea required minLength={3} rows={4} value={needs} onChange={(e) => setNeeds(e.target.value)} placeholder={t("fNeedsPh")} maxLength={540} className={field} />
          </label>
          <Button type="submit" variant="ghost" disabled={loading} className="cosmic-pill h-auto w-full whitespace-normal rounded-full px-8 py-3 text-xs tracking-[0.35em] transition-transform hover:scale-[1.02] disabled:opacity-60">
            {loading ? t("finding") : t("recommend")}
          </Button>
          <p className="text-xs font-light text-muted-foreground">{t("aiNote")}</p>
        </form>

        <div aria-live="polite" className="min-h-[200px]">
          {loading && (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl border bg-card" />)}
            </div>
          )}
          {error && <p className="rounded-2xl border border-destructive/50 p-6 text-destructive">{error}</p>}
          {items && items.length === 0 && <p className="rounded-2xl border p-6 text-muted-foreground">{t("noMatches")}</p>}
          {items && items.length > 0 && (
            <ul className="space-y-4">
              {items.map((it) => {
                const record = getScheme(it.slug);
                 if (!record) return null;
                 const s = localizeScheme(record, lang);
                return (
                  <li key={it.slug} className="cosmic-card rounded-2xl p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-medium">{s.name}</h3>
                      <span className={`rounded-full border px-3 py-1 text-[10px] tracking-[0.25em] ${it.match === "strong" ? "border-primary text-primary" : "text-muted-foreground"}`}>
                        {it.match === "strong" ? t("strong") : t("possible")}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5 text-sm font-light text-muted-foreground">
                      {it.reasons.map((r, i) => <li key={i} className="flex gap-2"><span className="text-primary">✓</span>{r}</li>)}
                    </ul>
                    {it.check && <p className="mt-3 text-sm font-light text-accent">{t("confirm")} {it.check}</p>}
                    <Link to="/schemes/$slug" params={{ slug: s.slug }} className="mt-4 inline-block text-xs tracking-[0.3em] text-primary">{t("viewDetails")}</Link>
                  </li>
                );
              })}
            </ul>
          )}
          {!loading && !error && !items && (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed p-10 text-center font-light text-muted-foreground">
              {t("resultsHere")}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

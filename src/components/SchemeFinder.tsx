import { localizeScheme, useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CATEGORIES, getScheme, type Category } from "@/lib/schemes";
import { logEvent } from "@/lib/activity";
import { FORM, STATES, matchSchemes, missingText, reasonText, type Match, type Profile } from "@/lib/match";

const field = "w-full rounded-xl border bg-card px-4 py-3 font-light text-foreground focus:border-primary focus:outline-none";
const EMPTY: Profile = { state: "", age: null, gender: "", occupation: "", income: "", area: "", disability: "", needs: [] };

export function SchemeFinder() {
  const { lang, t } = useI18n();
  const f = FORM[lang];
  const [p, setP] = useState<Profile>(EMPTY);
  const [items, setItems] = useState<Match[] | null>(null);
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((x) => ({ ...x, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    logEvent("assessment_started");
    const r = matchSchemes(p);
    setItems(r);
    logEvent("assessment_completed");
    logEvent("matches_generated", r.length);
  };

  const sel = (k: keyof Profile, opts: string[], label: string) => (
    <label className="block">
      <span className="mb-2 block text-xs tracking-[0.25em] text-muted-foreground">{label}</span>
      <select value={p[k] as string} onChange={(e) => set(k, e.target.value as never)} className={field}>
        <option value="">{f.unknown}</option>
        {opts.map((o) => <option key={o} value={o}>{f[o] ?? o}</option>)}
      </select>
    </label>
  );

  return (
    <section id="finder" className="relative mx-auto max-w-6xl px-6 py-28">
      <p className="text-xs tracking-[0.4em] text-primary">{t("finderLabel")}</p>
      <h2 className="mt-4 max-w-2xl text-3xl font-light leading-tight sm:text-5xl">{t("finderTitle")}</h2>
      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs tracking-[0.25em] text-muted-foreground">{f.state}</span>
              <select value={p.state} onChange={(e) => set("state", e.target.value)} className={field}>
                <option value="">{f.unknown}</option>
                {STATES.map((s) => <option key={s} value={s}>{s === "Other" ? f.Other : t(`loc:${s}`) === `loc:${s}` ? s : t(`loc:${s}`)}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs tracking-[0.25em] text-muted-foreground">{f.age}</span>
              <input type="number" min={0} max={120} value={p.age ?? ""} onChange={(e) => set("age", e.target.value === "" ? null : Number(e.target.value))} className={field} />
            </label>
            {sel("gender", ["female", "male", "other"], f.gender)}
            {sel("occupation", ["student", "farmer", "worker", "street_vendor", "business", "unemployed", "retired", "homemaker"], f.occupation)}
            {sel("income", ["bpl", "under_2_5l", "under_9l", "above_9l"], f.income)}
            {sel("area", ["rural", "urban"], f.area)}
            {sel("disability", ["yes", "no"], f.disability)}
          </div>
          <fieldset>
            <legend className="mb-2 text-xs tracking-[0.25em] text-muted-foreground">{f.needs}</legend>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const on = p.needs.includes(c);
                return (
                  <button type="button" key={c} aria-pressed={on} onClick={() => set("needs", on ? p.needs.filter((x) => x !== c) : [...p.needs, c as Category])}
                    className={`rounded-full border px-3 py-1.5 text-xs ${on ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{t(`cat:${c}`)}</button>
                );
              })}
            </div>
          </fieldset>
          <Button type="submit" variant="ghost" className="cosmic-pill h-auto w-full whitespace-normal rounded-full px-8 py-3 text-xs tracking-[0.35em]">{f.find}</Button>
          <p className="text-xs font-light text-muted-foreground">{f.note}</p>
        </form>

        <div aria-live="polite" className="min-h-[200px]">
          {items && items.length === 0 && <p className="rounded-2xl border p-6 text-muted-foreground">{f.none}</p>}
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
                    <p className="mt-3 text-[10px] tracking-[0.25em] text-muted-foreground">{f.why.toUpperCase()}</p>
                    <ul className="mt-2 space-y-1.5 text-sm font-light text-muted-foreground">
                      {it.reasons.map((r) => <li key={r} className="flex gap-2"><span className="text-primary">✓</span>{reasonText(r, lang)}</li>)}
                    </ul>
                    {it.missing.length > 0 && <p className="mt-3 text-sm font-light text-accent">{f.missing.replace("{x}", it.missing.map((m) => missingText(m, lang)).join(", "))}</p>}
                    <Link to="/schemes/$slug" params={{ slug: s.slug }} className="mt-4 inline-block text-xs tracking-[0.3em] text-primary">{t("viewDetails")}</Link>
                  </li>
                );
              })}
            </ul>
          )}
          {!items && (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed p-10 text-center font-light text-muted-foreground">{t("resultsHere")}</div>
          )}
        </div>
      </div>
    </section>
  );
}

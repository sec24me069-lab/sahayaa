import { localizeScheme, useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import universe from "@/assets/universe.jpg";
import { AUDIENCES, CATEGORIES, LOCATIONS, SCHEMES, filterSchemes } from "@/lib/schemes";

const select = "rounded-full border bg-card px-4 py-2 text-sm font-light text-foreground focus:border-primary focus:outline-none";

export function SchemeDiscovery() {
  const { lang, t } = useI18n();
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [audience, setAudience] = useState("");
  const list = useMemo(() => filterSchemes(SCHEMES, { category, location, audience }), [category, location, audience]);
  const active = category || location || audience;

  return (
    <section id="schemes" className="relative overflow-hidden py-28">
      <img src={universe} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, var(--background), transparent 20%, transparent 80%, var(--background))" }} />
      <div className="relative mx-auto max-w-6xl px-6">
        <p className="text-xs tracking-[0.4em] text-primary">{t("discLabel")}</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-light leading-tight sm:text-5xl">{t("discTitle")}</h2>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <select aria-label={t("allCategories")} value={category} onChange={(e) => setCategory(e.target.value)} className={select}>
            <option value="">{t("allCategories")}</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{t(`cat:${c}`)}</option>)}
          </select>
          <select aria-label={t("dLocation")} value={location} onChange={(e) => setLocation(e.target.value)} className={select}>
            <option value="">{t("anyLocation")}</option>
            {LOCATIONS.map((l) => <option key={l} value={l}>{l === "All India" ? t("nationwide") : t(`loc:${l}`)}</option>)}
          </select>
          <select aria-label={t("eligibility")} value={audience} onChange={(e) => setAudience(e.target.value)} className={select}>
            <option value="">{t("anyone")}</option>
            {AUDIENCES.map((a) => <option key={a} value={a}>{t(`aud:${a}`)}</option>)}
          </select>
          {active && (
            <Button type="button" variant="ghost" onClick={() => { setCategory(""); setLocation(""); setAudience(""); }} className="text-xs tracking-[0.25em] text-muted-foreground hover:text-foreground">{t("clear")}</Button>
          )}
          <span className="ml-auto text-xs tracking-widest text-muted-foreground">{list.length} {t("schemesCount")}</span>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((record) => {
            const s = localizeScheme(record, lang);
            return (
            <Link key={s.slug} to="/schemes/$slug" params={{ slug: s.slug }} className="cosmic-card group block rounded-2xl p-7">
              <div className="flex items-center justify-between text-[10px] tracking-[0.25em] text-muted-foreground">
                <span className="text-primary">{t(`cat:${s.category}`)}</span>
                <span>{t(`loc:${s.location}`)}</span>
              </div>
              <h3 className="mt-4 text-xl font-medium">{s.name}</h3>
              <p className="mt-3 font-light leading-relaxed text-muted-foreground">{s.summary}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {s.audiences.map((a) => <span key={a} className="rounded-full border px-2.5 py-0.5 text-[11px] font-light text-muted-foreground">{t(`aud:${a}`)}</span>)}
              </div>
              <span className="mt-6 inline-block text-xs tracking-[0.3em] text-primary opacity-70 transition-opacity group-hover:opacity-100">{t("viewDetails")}</span>
            </Link>
          ); })}
          {list.length === 0 && <p className="col-span-full rounded-2xl border p-8 text-center text-muted-foreground">{t("noFilterMatch")}</p>}
        </div>
      </div>
    </section>
  );
}

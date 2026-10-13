import { useState } from "react";
import { SCHEMES } from "@/lib/schemes";
import { STATUSES, STATUS_LABEL } from "@/lib/activity";

type App = { scheme_slug: string; status: string };

/** Digital twin: every region where SAHAAYA has schemes, with live application status per scheme. */
export function Twin({ apps }: { apps: App[] }) {
  const [sel, setSel] = useState<string>("All India");
  const regions = Array.from(new Set(SCHEMES.map((s) => s.location)));
  const inRegion = (loc: string) => SCHEMES.filter((s) => s.location === loc);
  const appsFor = (slug: string) => apps.filter((a) => a.scheme_slug === slug);
  const total = (r: string) => inRegion(r).reduce((n, s) => n + appsFor(s.slug).length, 0);
  const max = Math.max(1, ...regions.map(total));
  return (
    <section className="mt-10 rounded-2xl border bg-card p-6">
      <p className="text-xs tracking-[0.3em] text-primary">DIGITAL TWIN</p>
      <h2 className="mt-2 text-xl font-light">Schemes and applications by region</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {regions.map((r) => {
          const n = total(r);
          return (
            <button key={r} onClick={() => setSel(r)} aria-pressed={sel === r}
              className={`rounded-xl border p-4 text-left transition-colors ${sel === r ? "border-primary" : ""}`}
              style={{ background: `color-mix(in oklch, var(--primary) ${Math.round((n / max) * 45)}%, transparent)` }}>
              <p className="text-sm font-medium">{r}</p>
              <p className="mt-1 text-xs text-muted-foreground">{inRegion(r).length} schemes · {n} applications</p>
            </button>
          );
        })}
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[10px] tracking-widest text-muted-foreground"><th className="py-2">SCHEME</th>{STATUSES.map((s) => <th key={s} className="px-2">{STATUS_LABEL[s].toUpperCase()}</th>)}</tr></thead>
          <tbody>
            {inRegion(sel).map((s) => (
              <tr key={s.slug} className="border-t">
                <td className="py-2">{s.name}</td>
                {STATUSES.map((st) => <td key={st} className="px-2">{appsFor(s.slug).filter((a) => a.status === st).length}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

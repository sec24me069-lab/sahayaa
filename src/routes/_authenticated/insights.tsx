import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { SCHEMES, CATEGORIES, getScheme } from "@/lib/schemes";
import { STATUSES, STATUS_LABEL } from "@/lib/activity";
import { AppNav } from "@/components/AppNav";
import { StaffOnly } from "./officials";
import { Twin } from "@/components/DigitalTwin";

export const Route = createFileRoute("/_authenticated/insights")({
  head: () => ({
    meta: [
      { title: "SAHAAYA Insights" },
      { name: "description", content: "Platform activity, data quality and application analytics for SAHAAYA staff." },
      { property: "og:title", content: "SAHAAYA Insights" },
      { property: "og:description", content: "Activity, data quality and application analytics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <main className="min-h-screen bg-background font-display"><AppNav /><StaffOnly><Insights /></StaffOnly></main>,
});

type Data = {
  events: { event_type: string; match_count: number | null }[];
  apps: { scheme_slug: string; status: string; application_documents: { done: boolean }[] }[];
};

function Insights() {
  const [d, setD] = useState<Data | null>(null);
  useEffect(() => {
    Promise.all([
      supabase.from("activity_events").select("event_type,match_count"),
      supabase.from("applications").select("scheme_slug,status,application_documents(done)"),
    ]).then(([e, a]) => setD({ events: e.data ?? [], apps: (a.data ?? []) as Data["apps"] }));
  }, []);
  if (!d) return <p className="p-12 text-muted-foreground">Loading…</p>;

  const verified = SCHEMES.filter((s) => s.verifiedOn).length;
  const count = (t: string) => d.events.filter((e) => e.event_type === t).length;
  const matches = d.events.filter((e) => e.event_type === "matches_generated").reduce((n, e) => n + (e.match_count ?? 0), 0);
  const checklistsDone = d.apps.filter((a) => a.application_documents.length > 0 && a.application_documents.every((x) => x.done)).length;
  const byStatus = STATUSES.map((s) => ({ name: STATUS_LABEL[s], value: d.apps.filter((a) => a.status === s).length }));
  const byCategory = CATEGORIES.map((c) => ({ name: c, value: d.apps.filter((a) => getScheme(a.scheme_slug)?.category === c).length }));

  const kpis: [string, number][] = [
    ["Support records", SCHEMES.length], ["Verified records", verified], ["Awaiting verification", SCHEMES.length - verified],
    ["Assessments started", count("assessment_started")], ["Assessments completed", count("assessment_completed")],
    ["Preliminary matches", matches], ["Recorded applications", d.apps.length], ["Checklists completed", checklistsDone],
  ];

  const exportCsv = () => {
    const rows = [["metric", "value"], ...kpis.map(([k, v]) => [k, String(v)]), ...byStatus.map((s) => [`status: ${s.name}`, String(s.value)])];
    const url = URL.createObjectURL(new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" }));
    Object.assign(document.createElement("a"), { href: url, download: "sahaaya-insights.csv" }).click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end gap-4">
        <div className="mr-auto"><p className="text-xs tracking-[0.4em] text-primary">SAHAAYA INSIGHTS</p><h1 className="mt-2 text-3xl font-light">Platform overview</h1></div>
        <button onClick={exportCsv} className="cosmic-pill rounded-full px-5 py-2 text-xs tracking-widest">EXPORT CSV</button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">All figures come from activity recorded in SAHAAYA since tracking began.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map(([k, v]) => <div key={k} className="rounded-2xl border bg-card p-5"><p className="text-[10px] tracking-widest text-muted-foreground">{k.toUpperCase()}</p><p className="mt-2 text-3xl font-light">{v}</p></div>)}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Chart title="Applications by status" data={byStatus} />
        <Chart title="Applications by category" data={byCategory} />
      </div>
      <Twin apps={d.apps} />
      <div>
      </div>
    </div>
  );
}

function Chart({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-xs tracking-widest text-muted-foreground">{title.toUpperCase()}</p>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} interval={0} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} width={24} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
            <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getScheme } from "@/lib/schemes";
import { STATUSES, STATUS_LABEL, type AppStatus } from "@/lib/activity";
import { useAuth } from "@/hooks/useAuth";
import { AppNav } from "@/components/AppNav";
import { MessageThread } from "@/components/MessageThread";

export const Route = createFileRoute("/_authenticated/officials")({
  head: () => ({
    meta: [
      { title: "Officials desk — SAHAAYA" },
      { name: "description", content: "Review applicant records, pending documents and reply to applicants." },
      { property: "og:title", content: "Officials desk — SAHAAYA" },
      { property: "og:description", content: "Review applications and message applicants." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Officials,
});

type Row = { id: string; scheme_slug: string; status: AppStatus; applicant_email: string | null; updated_at: string; application_documents: { done: boolean }[] };

export function StaffOnly({ children }: { children: React.ReactNode }) {
  const { isStaff, loading } = useAuth();
  if (loading) return <p className="p-12 text-muted-foreground">Loading…</p>;
  if (!isStaff) return <p className="mx-auto max-w-xl p-12 text-center text-muted-foreground">This area is for SAHAAYA officials. Ask an administrator to give your account the official role.</p>;
  return <>{children}</>;
}

function Officials() {
  return <main className="min-h-screen bg-background font-display"><AppNav /><StaffOnly><Desk /></StaffOnly></main>;
}

function Desk() {
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [open, setOpen] = useState<string | null>(null);
  const load = async () => {
    const { data } = await supabase.from("applications").select("id,scheme_slug,status,applicant_email,updated_at,application_documents(done)").order("updated_at", { ascending: false });
    setRows((data ?? []) as Row[]);
  };
  useEffect(() => { load(); }, []);
  const setStatus = async (id: string, status: AppStatus) => { await supabase.from("applications").update({ status, updated_at: new Date().toISOString() }).eq("id", id); load(); };
  const list = rows.filter((r) => !filter || r.status === filter);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-light">Officials desk</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {["", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full border px-3 py-1 text-xs ${filter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            {s ? STATUS_LABEL[s as AppStatus] : "All"} ({s ? rows.filter((r) => r.status === s).length : rows.length})
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-3">
        {list.length === 0 && <p className="rounded-2xl border p-8 text-center text-muted-foreground">No applications.</p>}
        {list.map((r) => {
          const pending = r.application_documents.filter((d) => !d.done).length;
          return (
            <article key={r.id} className="rounded-2xl border bg-card p-5">
              <div className="flex flex-wrap items-center gap-3">
                <div className="mr-auto">
                  <p className="font-medium">{getScheme(r.scheme_slug)?.name ?? r.scheme_slug}</p>
                  <p className="text-xs text-muted-foreground">{r.applicant_email ?? "Applicant"} · {pending} pending document{pending === 1 ? "" : "s"}</p>
                </div>
                <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value as AppStatus)} aria-label="Status" className="rounded-full border bg-card px-3 py-1 text-xs">
                  {STATUSES.map((st) => <option key={st} value={st}>{STATUS_LABEL[st]}</option>)}
                </select>
                <button onClick={() => setOpen(open === r.id ? null : r.id)} className="text-xs tracking-widest text-primary">{open === r.id ? "CLOSE" : "CHAT"}</button>
              </div>
              {open === r.id && <div className="mt-4"><MessageThread applicationId={r.id} asOfficial /></div>}
            </article>
          );
        })}
      </div>
    </div>
  );
}

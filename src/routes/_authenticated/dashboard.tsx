import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SCHEMES, getScheme } from "@/lib/schemes";
import { localizeScheme, useI18n } from "@/lib/i18n";
import { STATUSES, STATUS_LABEL, type AppStatus } from "@/lib/activity";
import { AppNav } from "@/components/AppNav";
import { MessageThread } from "@/components/MessageThread";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "My applications — SAHAAYA" },
      { name: "description", content: "Track schemes you applied for, pending documents and messages with officials." },
      { property: "og:title", content: "My applications — SAHAAYA" },
      { property: "og:description", content: "Your applied schemes, pending documents and official messages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

type Doc = { id: string; name: string; done: boolean };
type App = { id: string; scheme_slug: string; status: AppStatus; created_at: string; application_documents: Doc[] };

function Dashboard() {
  const { lang } = useI18n();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("applications").select("id,scheme_slug,status,created_at,application_documents(id,name,done)").order("created_at", { ascending: false });
    const { data: u } = await supabase.auth.getUser();
    setApps(((data ?? []) as App[]).filter(() => true));
    void u; setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    const s = getScheme(slug); if (!s) return;
    const { data: u } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("applications").insert({ scheme_slug: s.slug, user_id: u.user!.id, applicant_email: u.user!.email }).select("id").single();
    if (error || !data) return;
    await supabase.from("application_documents").insert(s.documents.map((name) => ({ application_id: data.id, name })));
    setSlug(""); load();
  };
  const toggle = async (d: Doc) => { await supabase.from("application_documents").update({ done: !d.done }).eq("id", d.id); load(); };
  const setStatus = async (id: string, status: AppStatus) => { await supabase.from("applications").update({ status, updated_at: new Date().toISOString() }).eq("id", id); load(); };
  const remove = async (id: string) => { await supabase.from("applications").delete().eq("id", id); load(); };

  const pending = apps.flatMap((a) => a.application_documents.filter((d) => !d.done).map((d) => ({ ...d, scheme: a.scheme_slug })));

  return (
    <main className="min-h-screen bg-background font-display">
      <AppNav />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-light">My applications</h1>
        <p className="mt-2 text-sm text-muted-foreground">Status here is what you record — SAHAAYA is not connected to government application systems.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Applied schemes" value={apps.length} />
          <Stat label="Pending documents" value={pending.length} />
          <Stat label="Approved" value={apps.filter((a) => a.status === "approved").length} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <select value={slug} onChange={(e) => setSlug(e.target.value)} aria-label="Scheme" className="flex-1 rounded-full border bg-card px-4 py-2 text-sm">
            <option value="">Add a scheme you're applying for…</option>
            {SCHEMES.filter((s) => !apps.some((a) => a.scheme_slug === s.slug)).map((s) => <option key={s.slug} value={s.slug}>{localizeScheme(s, lang).name}</option>)}
          </select>
          <Button onClick={add} disabled={!slug}>Add</Button>
        </div>

        {pending.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xs tracking-[0.3em] text-primary">PENDING DOCUMENTS</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {pending.map((d) => <li key={d.id} className="rounded-full border px-3 py-1 text-xs text-muted-foreground">{d.name} · {getScheme(d.scheme)?.name}</li>)}
            </ul>
          </section>
        )}

        <section className="mt-10 space-y-4">
          {loading && <p className="text-muted-foreground">Loading…</p>}
          {!loading && apps.length === 0 && <p className="rounded-2xl border p-8 text-center text-muted-foreground">No applications yet. Add a scheme above, or <Link to="/home" className="text-primary">find schemes</Link>.</p>}
          {apps.map((a) => {
            const s = getScheme(a.scheme_slug);
            const done = a.application_documents.filter((d) => d.done).length;
            return (
              <article key={a.id} className="cosmic-card rounded-2xl p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Link to="/schemes/$slug" params={{ slug: a.scheme_slug }} className="mr-auto text-lg font-medium hover:text-primary">{s ? localizeScheme(s, lang).name : a.scheme_slug}</Link>
                  <select value={a.status} onChange={(e) => setStatus(a.id, e.target.value as AppStatus)} aria-label="Status" className="rounded-full border bg-card px-3 py-1 text-xs">
                    {STATUSES.map((st) => <option key={st} value={st}>{STATUS_LABEL[st]}</option>)}
                  </select>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Documents {done}/{a.application_documents.length}</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {a.application_documents.map((d) => (
                    <li key={d.id}><label className="flex cursor-pointer items-center gap-2 text-sm">
                      <input type="checkbox" checked={d.done} onChange={() => toggle(d)} className="accent-primary" />
                      <span className={d.done ? "text-muted-foreground line-through" : ""}>{d.name}</span>
                    </label></li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-4 text-xs tracking-widest">
                  <button onClick={() => setOpen(open === a.id ? null : a.id)} className="text-primary">{open === a.id ? "HIDE MESSAGES" : "MESSAGE AN OFFICIAL"}</button>
                  <button onClick={() => remove(a.id)} className="text-muted-foreground hover:text-destructive">REMOVE</button>
                </div>
                {open === a.id && <div className="mt-4"><MessageThread applicationId={a.id} asOfficial={false} /></div>}
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border bg-card p-5"><p className="text-xs tracking-widest text-muted-foreground">{label.toUpperCase()}</p><p className="mt-2 text-3xl font-light">{value}</p></div>;
}

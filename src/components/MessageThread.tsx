import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Msg = { id: string; body: string; from_official: boolean; created_at: string };

export function MessageThread({ applicationId, asOfficial }: { applicationId: string; asOfficial: boolean }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    supabase.from("application_messages").select("id,body,from_official,created_at").eq("application_id", applicationId).order("created_at")
      .then(({ data }) => { if (alive) setMsgs(data ?? []); });
    const ch = supabase.channel(`msgs-${applicationId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "application_messages", filter: `application_id=eq.${applicationId}` },
        (p) => setMsgs((m) => (m.some((x) => x.id === (p.new as Msg).id) ? m : [...m, p.new as Msg])))
      .subscribe();
    return () => { alive = false; supabase.removeChannel(ch); };
  }, [applicationId]);

  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [msgs.length]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim(); if (!body) return;
    const { data: u } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("application_messages")
      .insert({ application_id: applicationId, body, from_official: asOfficial, sender_id: u.user!.id }).select("id,body,from_official,created_at").single();
    if (error) { setErr("Message could not be sent."); return; }
    setErr(""); setText("");
    setMsgs((m) => (m.some((x) => x.id === data.id) ? m : [...m, data]));
  };

  return (
    <div className="rounded-xl border">
      <div className="max-h-64 space-y-2 overflow-y-auto p-4">
        {msgs.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
        {msgs.map((m) => {
          const mine = m.from_official === asOfficial;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                <p className="text-[10px] tracking-widest opacity-70">{m.from_official ? "OFFICIAL" : "APPLICANT"}</p>
                <p className="whitespace-pre-wrap">{m.body}</p>
              </div>
            </div>
          );
        })}
        <div ref={end} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t p-3">
        <input value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} placeholder={asOfficial ? "Reply to applicant…" : "Message an official…"}
          className="flex-1 rounded-full border bg-card px-4 py-2 text-sm focus:border-primary focus:outline-none" />
        <Button type="submit" size="sm" disabled={!text.trim()}>Send</Button>
      </form>
      {err && <p className="px-4 pb-3 text-xs text-destructive">{err}</p>}
    </div>
  );
}

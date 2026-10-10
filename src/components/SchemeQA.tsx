import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { askAboutScheme } from "@/lib/ask.functions";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = ["Am I eligible?", "What documents do I need?", "How do I apply, step by step?", "How much will I receive?"];

export function SchemeQA({ slug, name }: { slug: string; name: string }) {
  const ask = useServerFn(askAboutScheme);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const send = async (question: string) => {
    const text = question.trim();
    if (text.length < 2 || loading) return;
    const history = msgs;
    setMsgs([...history, { role: "user", content: text }]);
    setQ(""); setError(""); setLoading(true);
    try {
      const r = await ask({ data: { slug, question: text, history } });
      if (r.ok) setMsgs((m) => [...m, { role: "assistant", content: r.answer }]);
      else setError(r.error);
    } catch {
      setError("We couldn't answer right now. Please try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <section className="mt-14 rounded-2xl border bg-card p-6 sm:p-8">
      <p className="text-xs tracking-[0.4em] text-primary">ASK SAHAAYA</p>
      <h2 className="mt-3 text-2xl font-light">Questions about {name}?</h2>

      {msgs.length > 0 && (
        <ul aria-live="polite" className="mt-6 space-y-4">
          {msgs.map((m, i) => (
            <li key={i} className={m.role === "user" ? "flex justify-end" : ""}>
              <div className={m.role === "user" ? "max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground" : "whitespace-pre-wrap font-light leading-relaxed"}>
                {m.content}
              </div>
            </li>
          ))}
          {loading && <li className="animate-pulse text-sm text-muted-foreground">Thinking…</li>}
        </ul>
      )}
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {msgs.length === 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => send(s)} disabled={loading} className="rounded-full border px-4 py-1.5 text-sm font-light text-muted-foreground transition-colors hover:border-primary hover:text-foreground disabled:opacity-50">
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); send(q); }} className="mt-6 flex gap-2">
        <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} maxLength={500} placeholder="Type your question…" aria-label="Your question"
          className="min-w-0 flex-1 rounded-full border bg-background px-5 py-3 font-light text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
        <button disabled={loading || q.trim().length < 2} className="cosmic-pill shrink-0 rounded-full px-6 py-3 text-xs tracking-[0.3em] disabled:opacity-50">ASK</button>
      </form>
      <p className="mt-3 text-xs font-light text-muted-foreground">AI-powered answers based on this page. Confirm with the official source before applying.</p>
    </section>
  );
}

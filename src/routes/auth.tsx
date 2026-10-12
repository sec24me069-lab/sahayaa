import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const safe = (p?: string) => (p && p.startsWith("/") && !p.startsWith("//") ? p : "/dashboard");

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: typeof s["redirect"] === "string" ? (s["redirect"] as string) : undefined }),
  head: () => ({
    meta: [
      { title: "Sign in — SAHAAYA" },
      { name: "description", content: "Sign in to SAHAAYA to track your scheme applications and documents." },
      { property: "og:title", content: "Sign in — SAHAAYA" },
      { property: "og:description", content: "Track your scheme applications, documents and messages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: safe(redirect), replace: true }); });
    const { data: sub } = supabase.auth.onAuthStateChange((e) => { if (e === "SIGNED_IN") navigate({ to: safe(redirect), replace: true }); });
    return () => sub.subscription.unsubscribe();
  }, [redirect, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg("");
    const res = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + safe(redirect) } });
    setBusy(false);
    if (res.error) setMsg(res.error.message);
    else if (mode === "up" && !res.data.session) setMsg("Check your email to confirm your account, then sign in.");
  };

  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) setMsg(r.error.message ?? "Google sign-in failed");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 font-display">
      <div className="cosmic-card w-full max-w-sm rounded-2xl p-8">
        <Link to="/home" className="wordmark text-xs tracking-[0.4em]">SAHAAYA</Link>
        <h1 className="mt-6 text-2xl font-light">{mode === "in" ? "Sign in" : "Create account"}</h1>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" disabled={busy} className="w-full">{busy ? "…" : mode === "in" ? "Sign in" : "Sign up"}</Button>
        </form>
        <Button type="button" variant="outline" onClick={google} className="mt-3 w-full">Continue with Google</Button>
        {msg && <p className="mt-4 text-sm text-muted-foreground">{msg}</p>}
        <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-6 text-xs text-muted-foreground hover:text-foreground">
          {mode === "in" ? "New here? Create an account" : "Have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}

import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const link = "text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground [&.active]:text-primary";

export function AppNav() {
  const { user, isStaff } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const signOut = async () => {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { redirect: undefined }, replace: true });
  };
  return (
    <header className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b px-6 py-4">
      <Link to="/home" className="wordmark mr-auto text-sm tracking-[0.4em]">SAHAAYA</Link>
      <Link to="/dashboard" className={link}>MY APPLICATIONS</Link>
      {isStaff && <Link to="/officials" className={link}>OFFICIALS</Link>}
      {isStaff && <Link to="/insights" className={link}>INSIGHTS</Link>}
      {user && <button onClick={signOut} className={link}>SIGN OUT</button>}
    </header>
  );
}

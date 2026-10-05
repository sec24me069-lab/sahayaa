import { createFileRoute, Link } from "@tanstack/react-router";
import horizon from "@/assets/horizon.jpg";
import flamingo from "@/assets/flamingo.png";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "SAHAAYA — Home" },
      { name: "description", content: "Welcome to SAHAAYA." },
      { property: "og:title", content: "SAHAAYA — Home" },
      { property: "og:description", content: "Welcome to SAHAAYA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-background font-display animate-in fade-in duration-1000">
      <img src={horizon} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <img src={flamingo} alt="SAHAAYA" width={1024} height={1024} className="relative w-28" />
      <h1 className="wordmark relative mt-4 text-3xl font-extralight tracking-[0.4em]">SAHAAYA</h1>
      <Link to="/" className="relative mt-10 text-[11px] tracking-[0.3em] text-muted-foreground hover:text-foreground">↻ REPLAY INTRO</Link>
    </main>
  );
}

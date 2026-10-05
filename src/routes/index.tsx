import { createFileRoute } from "@tanstack/react-router";
import { CinematicIntro } from "@/components/CinematicIntro";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAHAAYA — The Birth of an Identity" },
      { name: "description", content: "A cinematic brand reveal of SAHAAYA, an AI-powered civic support platform." },
      { property: "og:title", content: "SAHAAYA — The Birth of an Identity" },
      { property: "og:description", content: "A cinematic brand reveal of SAHAAYA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CinematicIntro,
});

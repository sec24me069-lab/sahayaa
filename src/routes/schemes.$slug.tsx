import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getScheme } from "@/lib/schemes";
import { SchemeQA } from "@/components/SchemeQA";

export const Route = createFileRoute("/schemes/$slug")({
  loader: ({ params }) => {
    const scheme = getScheme(params.slug);
    if (!scheme) throw notFound();
    return { scheme };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Scheme not found — SAHAAYA" }, { name: "robots", content: "noindex" }] };
    const s = loaderData.scheme;
    return {
      meta: [
        { title: `${s.name} — SAHAAYA` },
        { name: "description", content: s.summary },
        { property: "og:title", content: `${s.name} — SAHAAYA` },
        { property: "og:description", content: s.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: SchemeNotFound,
  component: SchemePage,
});

function SchemeNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background font-display">
      <p className="text-muted-foreground">We couldn't find that scheme.</p>
      <Link to="/home" className="text-xs tracking-[0.3em] text-primary">← ALL SCHEMES</Link>
    </main>
  );
}

function Block({ n, title, items, ordered }: { n: string; title: string; items: string[]; ordered?: boolean }) {
  return (
    <section className="border-t py-10 md:grid md:grid-cols-[200px_1fr] md:gap-10">
      <div className="mb-5 md:mb-0">
        <span className="wordmark text-3xl font-extralight">{n}</span>
        <h2 className="mt-2 text-xs tracking-[0.35em] text-muted-foreground">{title}</h2>
      </div>
      <ol className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex gap-4 font-light leading-relaxed">
            <span className="mt-0.5 shrink-0 text-sm text-primary">{ordered ? `${i + 1}.` : "◆"}</span>
            <span>{it}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SchemePage() {
  const { scheme: s } = Route.useLoaderData();
  const age = s.minAge != null && s.maxAge != null ? `${s.minAge}–${s.maxAge} years` : s.minAge != null ? `${s.minAge}+ years` : s.maxAge != null ? `Up to ${s.maxAge} years` : "Any age";
  return (
    <main className="min-h-screen bg-background font-display">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link to="/home" hash="schemes" className="text-xs tracking-[0.3em] text-muted-foreground hover:text-foreground">← ALL SCHEMES</Link>
        <p className="mt-12 text-xs tracking-[0.4em] text-primary">{s.category.toUpperCase()}</p>
        <h1 className="mt-4 text-4xl font-light leading-tight sm:text-6xl">{s.name}</h1>
        <p className="mt-6 max-w-2xl text-lg font-light text-muted-foreground">{s.summary}</p>

        <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border sm:grid-cols-3">
          {[["LOCATION", s.location], ["AGE", age], ["FOR", s.audiences.join(", ")]].map(([k, v]) => (
            <div key={k} className="bg-card p-5">
              <dt className="text-[10px] tracking-[0.3em] text-muted-foreground">{k}</dt>
              <dd className="mt-2 font-light">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14">
          <Block n="01" title="ELIGIBILITY" items={s.eligibility} />
          <Block n="02" title="BENEFITS" items={s.benefits} />
          <Block n="03" title="DOCUMENTS" items={s.documents} />
          <Block n="04" title="HOW TO APPLY" items={s.steps} ordered />
        </div>

        <SchemeQA key={s.slug} slug={s.slug} name={s.name} />

        <div className="mt-10 rounded-2xl border p-5 text-sm font-light">
          <p>
            <span className="text-[10px] tracking-[0.3em] text-muted-foreground">SOURCE </span>
            <a href={s.source} target="_blank" rel="noopener noreferrer" className="break-all text-primary underline-offset-4 hover:underline">{s.source.replace(/^https?:\/\//, "")}</a>
          </p>
          <p className="mt-2">
            <span className="text-[10px] tracking-[0.3em] text-muted-foreground">LAST VERIFIED </span>
            {s.verifiedOn ? new Date(s.verifiedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : <span className="text-accent">Not yet verified against the official source</span>}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6 border-t pt-10">
          <Link to="/home" hash="finder" className="cosmic-pill rounded-full px-7 py-3 text-xs tracking-[0.35em]">CHECK WHAT ELSE FITS ME</Link>
          <p className="text-xs font-light text-muted-foreground">Details are a summary. Confirm with the official scheme office before applying.</p>
        </div>
      </div>
    </main>
  );
}

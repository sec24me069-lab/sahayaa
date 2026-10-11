import { Button } from "@/components/ui/button";
import { LANGS, useI18n } from "@/lib/i18n";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div role="group" aria-label={t("language")} className={`cosmic-pill flex rounded-full p-1 text-sm ${className}`}>
      {LANGS.map((l) => (
        <Button type="button" variant="ghost" key={l.code} onClick={() => setLang(l.code)} aria-pressed={lang === l.code}
          className={`h-auto rounded-full px-3.5 py-1.5 font-light transition-colors ${lang === l.code ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          {l.label}
        </Button>
      ))}
    </div>
  );
}

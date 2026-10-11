import { describe, expect, it } from "vitest";
import { localizeScheme } from "@/lib/i18n";
import { SCHEMES } from "@/lib/schemes";

describe("Scheme source integrity", () => {
  it("does not manufacture official sources when changing language", () => {
    for (const scheme of SCHEMES) {
      for (const lang of ["ta", "hi"] as const) {
        expect(localizeScheme(scheme, lang).source).toBe(scheme.source);
      }
    }
  });

  it("does not turn unverified summaries into verified documents", () => {
    for (const scheme of SCHEMES) {
      expect(scheme.verifiedOn).toBeNull();
      expect(localizeScheme(scheme, "ta").verifiedOn).toBeNull();
      expect(localizeScheme(scheme, "hi").verifiedOn).toBeNull();
    }
  });
});
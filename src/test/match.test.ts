import { describe, expect, it } from "vitest";
import { matchSchemes, type Profile } from "@/lib/match";

const base: Profile = { state: "", age: null, gender: "", occupation: "", income: "", area: "", disability: "", needs: [] };
const slugs = (p: Partial<Profile>) => matchSchemes({ ...base, ...p }).map((m) => m.slug);

describe("scheme matching", () => {
  it("Tamil Nadu girl student gets Pudhumai Penn and not other states' schemes", () => {
    const r = slugs({ state: "Tamil Nadu", age: 19, gender: "female", occupation: "student", income: "under_2_5l", needs: ["Education"] });
    expect(r).toContain("tn-pudhumai-penn");
    expect(r).toContain("nsp-post-matric");
    expect(r).not.toContain("mh-ladki-bahin");
    expect(r).not.toContain("kerala-vidyajyothi");
    expect(r).not.toContain("pm-kisan");
  });
  it("a male student never gets women-only schemes", () => {
    const r = slugs({ state: "Tamil Nadu", age: 19, gender: "male", occupation: "student" });
    expect(r).not.toContain("tn-pudhumai-penn");
    expect(r).not.toContain("pmmvy");
  });
  it("low-income woman in Maharashtra gets Ladki Bahin", () => {
    expect(slugs({ state: "Maharashtra", age: 35, gender: "female", income: "under_2_5l", occupation: "homemaker" })).toContain("mh-ladki-bahin");
  });
  it("unemployed rural adult gets MGNREGA, not farmer schemes", () => {
    const r = slugs({ state: "Bihar", age: 30, occupation: "unemployed", area: "rural", income: "bpl" });
    expect(r).toContain("mgnrega");
    expect(r).not.toContain("pm-kisan");
  });
  it("high-income urban professional gets no income-tested schemes", () => {
    const r = slugs({ state: "Delhi", age: 40, gender: "male", occupation: "worker", income: "above_9l", area: "urban", disability: "no" });
    for (const s of ["pmay-u", "ignoaps", "nsp-post-matric", "ayushman-bharat"]) expect(r).not.toContain(s);
  });
  it("missing answers give possible matches with the missing info listed, never strong", () => {
    const m = matchSchemes({ ...base, needs: ["Agriculture"] }).find((x) => x.slug === "pm-kisan");
    expect(m?.match).toBe("possible");
    expect(m?.missing).toContain("occupation");
  });
});

import { createOpenAI } from "@ai-sdk/openai";
import { streamText, Output } from "ai";
import { z } from "zod";
import { SCHEMES } from "./schemes";

export const RecommendationSchema = z.object({
  recommendations: z.array(
    z.object({
      slug: z.string(),
      match: z.enum(["strong", "possible"]),
      reasons: z.array(z.string()),
      check: z.string().describe("One thing the visitor should confirm, or empty string"),
    }),
  ),
});

export type Profile = { location: string; age: number; needs: string };

export async function recommendSchemes(profile: Profile) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI is not configured.");
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  const catalog = SCHEMES.map((s) => ({
    slug: s.slug, name: s.name, category: s.category, location: s.location,
    age: [s.minAge ?? null, s.maxAge ?? null], audiences: s.audiences, eligibility: s.eligibility,
  }));
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions:
      "You are SAHAAYA, a civic support guide for India. Recommend only schemes from the catalog that fit the visitor. " +
      "Exclude schemes whose age range or state clearly excludes them (state schemes only match visitors in that state). " +
      "Return at most 5, best first. Each reason must be short, plain language, and tie a visitor detail to a specific eligibility rule. " +
      "Use 'possible' when key facts (income, land, etc.) are unknown and say what to confirm in 'check'.",
    messages: [{ role: "user", content: `Catalog:\n${JSON.stringify(catalog)}\n\nVisitor:\n${JSON.stringify(profile)}` }],
    output: Output.object({ schema: RecommendationSchema }),
    providerOptions: {
      openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] },
    },
  });
  const out = await result.output;
  const valid = new Set(SCHEMES.map((s) => s.slug));
  return out.recommendations.filter((r) => valid.has(r.slug));
}

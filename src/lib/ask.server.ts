import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getScheme } from "./schemes";

type Msg = { role: "user" | "assistant"; content: string };

export async function answerSchemeQuestion(input: { slug: string; question: string; history: Msg[] }) {
  const scheme = getScheme(input.slug);
  if (!scheme) throw new Error("unknown-scheme");
  const apiKey = process.env['LOVABLE_API_KEY'];
  if (!apiKey) throw new Error("AI is not configured.");
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  const { source, verifiedOn, ...details } = scheme;
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions:
      "You are SAHAAYA, a friendly civic support guide. Answer questions about ONE government scheme using ONLY the scheme details provided. " +
      "Explain eligibility, benefits, documents and application steps in plain, simple language a first-time applicant understands. " +
      "Keep answers under 150 words; use short lines starting with \"• \" when listing. Plain text only: no markdown, no asterisks, no links syntax. " +
      "If the details don't cover the question, say so honestly and suggest checking the official source. Never invent amounts, dates or rules. " +
      "Answer in the same language the visitor writes in.\n\n" +
      `Scheme details:\n${JSON.stringify(details)}\nOfficial source: ${source}`,
    messages: [...input.history.slice(-8), { role: "user", content: input.question }],
    providerOptions: {
      openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] },
    },
  });
  const text = (await result.text).trim();
  if (!text) throw new Error("empty");
  return text;
}

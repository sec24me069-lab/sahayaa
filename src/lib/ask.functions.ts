import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const askAboutScheme = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      slug: z.string().min(1).max(80),
      question: z.string().min(2).max(500),
      history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) })).max(10),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { answerSchemeQuestion } = await import("./ask.server");
    try {
      return { ok: true as const, answer: await answerSchemeQuestion(data) };
    } catch (e) {
      console.error(e);
      const status = (e as { statusCode?: number }).statusCode;
      const error =
        status === 429 ? "Too many questions right now — please try again in a minute."
        : status === 402 ? "AI credits have run out for this app."
        : (e as Error).message === "unknown-scheme" ? "This scheme couldn't be found."
        : "We couldn't answer right now. Please try again.";
      return { ok: false as const, error };
    }
  });

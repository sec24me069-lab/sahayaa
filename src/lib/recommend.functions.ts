import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getRecommendations = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ location: z.string().min(2).max(60), age: z.number().int().min(0).max(120), needs: z.string().min(3).max(600) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { recommendSchemes } = await import("./recommend.server");
    try {
      return { ok: true as const, items: await recommendSchemes(data) };
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      const msg =
        status === 429 ? "Too many requests right now — please try again in a minute."
        : status === 402 ? "AI credits have run out for this app."
        : "We couldn't get recommendations right now. Please try again.";
      console.error(e);
      return { ok: false as const, error: msg };
    }
  });

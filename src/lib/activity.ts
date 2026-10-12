import { supabase } from "@/integrations/supabase/client";

type EventType = "assessment_started" | "assessment_completed" | "matches_generated";

/** Fire-and-forget usage event for SAHAAYA Insights. Never blocks the visitor. */
export function logEvent(event_type: EventType, match_count?: number) {
  supabase.auth.getUser().then(({ data }) =>
    supabase.from("activity_events").insert({ event_type, match_count: match_count ?? null, user_id: data.user?.id ?? null }),
  ).catch(() => {});
}

export const STATUSES = ["planning", "submitted", "under_review", "approved", "rejected"] as const;
export type AppStatus = (typeof STATUSES)[number];
export const STATUS_LABEL: Record<AppStatus, string> = {
  planning: "Planning", submitted: "Submitted", under_review: "Under review", approved: "Approved", rejected: "Rejected",
};

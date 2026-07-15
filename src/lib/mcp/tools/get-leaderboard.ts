import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_leaderboard",
  title: "Get leaderboard",
  description: "Top learners by XP (respects each user's leaderboard visibility).",
  inputSchema: {
    limit: z.number().int().min(1).max(50).default(10).describe("How many rows to return (1-50)."),
    scope: z.enum(["all_time", "weekly"]).default("all_time").describe("Leaderboard window."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, scope }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const fn = scope === "weekly" ? "get_weekly_leaderboard" : "get_leaderboard";
    const { data, error } = await sb.rpc(fn, { _limit: limit });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { rows: data },
    };
  },
});
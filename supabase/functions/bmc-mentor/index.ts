import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DAILY_LIMIT = 3;

async function hashInput(str: string): Promise<string> {
  const data = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const { bmc, lang } = await req.json();

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Authenticate using getClaims for JWT verification
    const anonClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const feedbackType = "bmc";
    const inputStr = JSON.stringify({ bmc });
    const inputHash = await hashInput(inputStr);

    // Check cache
    const { data: cached } = await supabase
      .from("ai_feedback_cache")
      .select("response")
      .eq("user_id", userId)
      .eq("feedback_type", feedbackType)
      .eq("input_hash", inputHash)
      .eq("lang", lang || "en")
      .maybeSingle();

    if (cached) {
      return new Response(JSON.stringify({ ...cached.response, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limit
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("ai_rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("requested_at", todayStart.toISOString());

    if ((count ?? 0) >= DAILY_LIMIT) {
      const errMsg = lang === "bg"
        ? `Достигнахте дневния лимит от ${DAILY_LIMIT} AI заявки. Опитайте утре.`
        : `Daily limit of ${DAILY_LIMIT} AI requests reached. Try again tomorrow.`;
      return new Response(JSON.stringify({ error: errMsg, rateLimited: true, remaining: 0 }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const langLabel = lang === "bg" ? "Bulgarian" : "English";

    const systemPrompt = `You are an expert startup mentor and Business Model Canvas evaluator for 11th grade business students.

CRITICAL: Respond ENTIRELY in ${langLabel}. Do not mix languages. All text must be in ${langLabel}.

Keep responses concise (under 200 words for text fields).

Evaluation criteria:
1. Market Clarity (0-25)
2. Value Proposition Strength (0-25)
3. Revenue Model Feasibility (0-25)
4. Innovation Potential (0-25)

Provide: overall score, brief assessment (2-3 sentences), specific feedback per block, and 3-5 suggestions.`;

    const userPrompt = `Analyze this Business Model Canvas:

Customer Segments: ${bmc.bmc_customer_segments || "(empty)"}
Value Proposition: ${bmc.bmc_value_proposition || "(empty)"}
Channels: ${bmc.bmc_channels || "(empty)"}
Customer Relationships: ${bmc.bmc_customer_relationships || "(empty)"}
Revenue Streams: ${bmc.bmc_revenue_streams || "(empty)"}
Key Resources: ${bmc.bmc_key_resources || "(empty)"}
Key Activities: ${bmc.bmc_key_activities || "(empty)"}
Key Partners: ${bmc.bmc_key_partners || "(empty)"}
Cost Structure: ${bmc.bmc_cost_structure || "(empty)"}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        max_tokens: 600,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_bmc_feedback",
              description: "Provide structured feedback for a Business Model Canvas",
              parameters: {
                type: "object",
                properties: {
                  overall_score: { type: "number" },
                  market_clarity: { type: "number" },
                  value_strength: { type: "number" },
                  revenue_feasibility: { type: "number" },
                  innovation_potential: { type: "number" },
                  overall_assessment: { type: "string" },
                  block_feedback: {
                    type: "object",
                    properties: {
                      customer_segments: { type: "string" },
                      value_proposition: { type: "string" },
                      channels: { type: "string" },
                      customer_relationships: { type: "string" },
                      revenue_streams: { type: "string" },
                      key_resources: { type: "string" },
                      key_activities: { type: "string" },
                      key_partners: { type: "string" },
                      cost_structure: { type: "string" },
                    },
                    additionalProperties: false,
                  },
                  suggestions: { type: "array", items: { type: "string" } },
                },
                required: ["overall_score", "market_clarity", "value_strength", "revenue_feasibility", "innovation_potential", "overall_assessment", "block_feedback", "suggestions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_bmc_feedback" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No structured feedback returned" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const feedback = JSON.parse(toolCall.function.arguments);
    const remaining = DAILY_LIMIT - (count ?? 0) - 1;

    // Record rate limit
    await supabase.from("ai_rate_limits").insert({ user_id: user.id, feedback_type: feedbackType });

    // Cache
    await supabase.from("ai_feedback_cache").upsert({
      user_id: user.id,
      feedback_type: feedbackType,
      input_hash: inputHash,
      lang: lang || "en",
      response: feedback,
    }, { onConflict: "user_id,feedback_type,input_hash,lang" });

    return new Response(JSON.stringify({ ...feedback, remaining, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("bmc-mentor error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

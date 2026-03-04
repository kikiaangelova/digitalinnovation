import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { bmc, lang } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langLabel = lang === "bg" ? "Bulgarian" : "English";

    const systemPrompt = `You are an expert startup mentor and Business Model Canvas evaluator for 11th grade business students.

CRITICAL: Respond ENTIRELY in ${langLabel}. Do not mix languages. All text in your output must be in ${langLabel}.

You will receive the 9 blocks of a Business Model Canvas. Analyze them and return structured feedback using the tool provided.

Keep your language simple and suitable for high school students. Be encouraging but honest.

Evaluation criteria:
1. Market Clarity (0-25): How well-defined are customer segments and channels?
2. Value Proposition Strength (0-25): Is the value proposition clear, unique, and compelling?
3. Revenue Model Feasibility (0-25): Is the revenue model realistic and sustainable?
4. Innovation Potential (0-25): How innovative and differentiated is the overall concept?

Provide:
- An overall score (sum of 4 criteria, 0-100)
- A brief overall assessment (2-3 sentences) in ${langLabel}
- Specific feedback for each BMC block that has content, in ${langLabel}
- 3-5 actionable improvement suggestions in ${langLabel}
- Scores for each of the 4 criteria`;

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
        model: "google/gemini-3-flash-preview",
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
                  overall_score: { type: "number", description: "Total score 0-100" },
                  market_clarity: { type: "number", description: "Score 0-25" },
                  value_strength: { type: "number", description: "Score 0-25" },
                  revenue_feasibility: { type: "number", description: "Score 0-25" },
                  innovation_potential: { type: "number", description: "Score 0-25" },
                  overall_assessment: { type: "string", description: "2-3 sentence overall assessment" },
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
                  suggestions: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 actionable improvement suggestions",
                  },
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
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
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
    return new Response(JSON.stringify(feedback), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("bmc-mentor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

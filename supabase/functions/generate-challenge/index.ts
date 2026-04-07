import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: authError } = await createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    ).auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { type, lang = "en" } = await req.json();
    if (!["daily", "weekly", "crisis", "strategic"].includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid challenge type" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check for existing active challenge of this type today/this week
    const now = new Date();
    let activeFrom: string;
    let activeUntil: string;

    if (type === "daily" || type === "crisis") {
      activeFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      activeUntil = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
    } else {
      // Weekly/strategic: use current week
      const dayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
      monday.setHours(0, 0, 0, 0);
      activeFrom = monday.toISOString();
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 7);
      activeUntil = sunday.toISOString();
    }

    // Check existing challenge
    const { data: existing } = await supabase
      .from("challenges")
      .select("id")
      .eq("type", type)
      .gte("active_from", activeFrom)
      .lt("active_from", activeUntil)
      .limit(1)
      .maybeSingle();

    if (existing) {
      // Check if user already responded
      const { data: response } = await supabase
        .from("challenge_responses")
        .select("id")
        .eq("user_id", user.id)
        .eq("challenge_id", existing.id)
        .maybeSingle();

      if (response) {
        return new Response(JSON.stringify({ already_completed: true, challenge_id: existing.id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Return existing challenge
      const { data: challenge } = await supabase
        .from("challenges")
        .select("*")
        .eq("id", existing.id)
        .single();

      return new Response(JSON.stringify({ challenge, is_new: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate new challenge via AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const typeConfig: Record<string, { xp: number; timeLimit: number | null; prompt: string }> = {
      daily: {
        xp: 10,
        timeLimit: null,
        prompt: "Create a quick 1-2 minute business decision challenge. It should be a simple scenario where a startup founder faces a choice with trade-offs. Include real uncertainty — no option should be obviously correct.",
      },
      weekly: {
        xp: 25,
        timeLimit: null,
        prompt: "Create a complex strategic business challenge that requires deeper analysis. The scenario should involve multiple stakeholders, market dynamics, and competing priorities. It should take 5-10 minutes to think through.",
      },
      crisis: {
        xp: 20,
        timeLimit: 120,
        prompt: "Create an urgent crisis scenario for a startup. The founder has limited information and must decide quickly. Include time pressure elements and incomplete data. Make it feel intense but realistic.",
      },
      strategic: {
        xp: 30,
        timeLimit: null,
        prompt: "Create a long-term strategic decision for a growing company. The choice should have lasting consequences that affect future business trajectory. Include market trends, competitive landscape, and resource constraints.",
      },
    };

    const config = typeConfig[type];
    const systemPrompt = `You are a business simulation challenge generator for a digital innovation learning platform.
Generate challenges that feel like a game, not a lecture. Include uncertainty, trade-offs, and realistic business dynamics.
Always respond using the tool provided.`;

    const userPrompt = `${config.prompt}

Generate the challenge in ${lang === "bg" ? "Bulgarian" : "English"}.
The challenge should have exactly 4 decision options, each with different trade-offs.
One option should be slightly better than others, but none should be obviously wrong.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
        tools: [{
          type: "function",
          function: {
            name: "create_challenge",
            description: "Create a business challenge scenario",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "Short catchy title (max 60 chars)" },
                scenario: { type: "string", description: "The scenario description (2-4 paragraphs)" },
                options: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      label: { type: "string", description: "Short option label" },
                      description: { type: "string", description: "What this option entails" },
                      risk: { type: "string", description: "The risk/trade-off of this option" },
                    },
                    required: ["label", "description", "risk"],
                  },
                  minItems: 4,
                  maxItems: 4,
                },
                best_option_index: { type: "integer", description: "Index (0-3) of the best option" },
                reasoning: { type: "string", description: "Why the best option is preferred, acknowledging trade-offs" },
                difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
              },
              required: ["title", "scenario", "options", "best_option_index", "reasoning", "difficulty"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_challenge" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again later" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const generated = JSON.parse(toolCall.function.arguments);

    // Save challenge
    const { data: challenge, error: insertError } = await supabase
      .from("challenges")
      .insert({
        type,
        title: generated.title,
        scenario: generated.scenario,
        options: generated.options,
        correct_reasoning: generated.reasoning,
        difficulty: generated.difficulty,
        xp_reward: config.xp,
        time_limit_seconds: config.timeLimit,
        active_from: activeFrom,
        active_until: activeUntil,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Don't expose correct answer to client
    const sanitized = { ...challenge, correct_reasoning: undefined };

    return new Response(JSON.stringify({ challenge: sanitized, is_new: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-challenge error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

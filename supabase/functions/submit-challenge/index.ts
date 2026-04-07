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

    const { challenge_id, selected_option, time_taken_seconds, lang = "en" } = await req.json();

    // Get challenge
    const { data: challenge, error: challengeError } = await supabase
      .from("challenges")
      .select("*")
      .eq("id", challenge_id)
      .single();

    if (challengeError || !challenge) {
      return new Response(JSON.stringify({ error: "Challenge not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check duplicate
    const { data: existing } = await supabase
      .from("challenge_responses")
      .select("id")
      .eq("user_id", user.id)
      .eq("challenge_id", challenge_id)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ error: "Already responded", duplicate: true }), {
        status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate personalized feedback via AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const options = challenge.options as { label: string; description: string; risk: string }[];
    const selectedOpt = options[selected_option];

    let feedback = challenge.correct_reasoning || "Good decision!";

    if (LOVABLE_API_KEY) {
      try {
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-lite",
            messages: [
              {
                role: "system",
                content: `You give brief, encouraging feedback on business decisions. Be constructive, mention trade-offs. 2-3 sentences max. Respond in ${lang === "bg" ? "Bulgarian" : "English"}.`,
              },
              {
                role: "user",
                content: `Scenario: ${challenge.scenario}\n\nUser chose: "${selectedOpt?.label}" - ${selectedOpt?.description}\n\nBest reasoning: ${challenge.correct_reasoning}\n\nGive feedback on their choice.`,
              },
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          feedback = aiData.choices?.[0]?.message?.content || feedback;
        }
      } catch {
        // fallback to stored reasoning
      }
    }

    // Award XP
    const xpEarned = challenge.xp_reward;
    const contextId = `challenge-${challenge_id}`;

    // Insert response
    const { error: insertError } = await supabase
      .from("challenge_responses")
      .insert({
        user_id: user.id,
        challenge_id,
        selected_option,
        ai_feedback: feedback,
        xp_earned: xpEarned,
        time_taken_seconds,
      });

    if (insertError) throw insertError;

    // Add XP via ledger + profile
    await supabase.from("xp_ledger").insert({
      user_id: user.id,
      action: `challenge_${challenge.type}`,
      xp: xpEarned,
      context_id: contextId,
    });

    await supabase.rpc("add_user_xp", { _user_id: user.id, _xp: xpEarned });

    return new Response(JSON.stringify({
      feedback,
      xp_earned: xpEarned,
      correct_reasoning: challenge.correct_reasoning,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("submit-challenge error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

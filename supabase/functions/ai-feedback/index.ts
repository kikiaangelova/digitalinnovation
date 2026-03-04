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
    const { type, data, lang } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Get user from auth using getClaims
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
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

    const langLabel = lang === "bg" ? "Bulgarian" : "English";
    const feedbackType = type || "startup_project";

    // Build input string for hashing
    const inputStr = JSON.stringify({ type: feedbackType, data });
    const inputHash = await hashInput(inputStr);

    // Check cache first
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

    // Check rate limit (3 per day)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("ai_rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("requested_at", todayStart.toISOString());

    if ((count ?? 0) >= DAILY_LIMIT) {
      const errMsg = lang === "bg"
        ? `Достигнахте дневния лимит от ${DAILY_LIMIT} AI заявки. Опитайте утре.`
        : `Daily limit of ${DAILY_LIMIT} AI requests reached. Try again tomorrow.`;
      return new Response(JSON.stringify({ error: errMsg, rateLimited: true, remaining: 0 }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an AI mentor for a digital innovation course designed for 11th grade business students.

CRITICAL: Respond ENTIRELY in ${langLabel}. Do not mix languages.

Guidelines:
- Keep explanations simple and suitable for high school students
- Be constructive, encouraging, and specific
- Keep responses UNDER 200 words total

Structure your response with these sections:
- **${lang === "bg" ? "Обобщение" : "Summary"}**: 1-2 sentence overview
- **${lang === "bg" ? "Силни страни" : "Strengths"}**: What's done well (2-3 points)
- **${lang === "bg" ? "Области за подобрение" : "Areas for Improvement"}**: What needs work (2-3 points)
- **${lang === "bg" ? "Следващи стъпки" : "Next Steps"}**: Concrete actions to take (2-3 points)`;

    let userPrompt = "";

    if (feedbackType === "startup_project") {
      userPrompt = `Review this student's startup project:\n\nProblem: ${data.problem || "(empty)"}\nCustomer: ${data.customer || "(empty)"}\nValue Proposition: ${data.value_proposition || "(empty)"}\nBusiness Model: ${data.business_model || "(empty)"}\nGrowth Strategy: ${data.growth_strategy || "(empty)"}\nFinal Pitch: ${data.final_pitch || "(empty)"}`;
    } else if (feedbackType === "simulator") {
      userPrompt = `Review this student's simulator performance:\n\nWeek reached: ${data.current_week}/6\nUsers: ${data.kpis?.users}\nRevenue: $${data.kpis?.revenue}\nSatisfaction: ${data.kpis?.satisfaction}%\nGrowth Rate: ${data.kpis?.growthRate}%\nGrade: ${data.grade || "In progress"}\n\nDecisions made: ${JSON.stringify(data.decisions || [])}`;
    } else if (feedbackType === "case_submission") {
      userPrompt = `Review this student's case study submission:\n\nCase: ${data.case_title}\nScore: ${data.total_score}/${data.max_score}\n\nProvide feedback on how they can improve.`;
    } else {
      throw new Error("Invalid feedback type");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        max_tokens: 400,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: lang === "bg" ? "Достигнат лимит на заявки. Опитайте по-късно." : "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: lang === "bg" ? "AI кредитите са изчерпани." : "AI credits exhausted. Please contact admin." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const result = await response.json();
    const feedback = result.choices?.[0]?.message?.content || (lang === "bg" ? "Не може да се генерира обратна връзка." : "Unable to generate feedback.");
    const remaining = DAILY_LIMIT - (count ?? 0) - 1;

    // Record rate limit entry
    await supabase.from("ai_rate_limits").insert({ user_id: user.id, feedback_type: feedbackType });

    // Cache the response
    await supabase.from("ai_feedback_cache").upsert({
      user_id: user.id,
      feedback_type: feedbackType,
      input_hash: inputHash,
      lang: lang || "en",
      response: { feedback },
    }, { onConflict: "user_id,feedback_type,input_hash,lang" });

    return new Response(JSON.stringify({ feedback, remaining, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-feedback error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

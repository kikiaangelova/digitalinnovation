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

    // Check rate limit (3 per day) — insert first to prevent TOCTOU race
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Reserve a slot atomically by inserting first
    await supabase.from("ai_rate_limits").insert({ user_id: userId, feedback_type: feedbackType });

    // Now count including the just-inserted record
    const { count } = await supabase
      .from("ai_rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("requested_at", todayStart.toISOString());

    if ((count ?? 0) > DAILY_LIMIT) {
      // Over limit — delete the just-inserted record and reject
      const { data: latest } = await supabase
        .from("ai_rate_limits")
        .select("id")
        .eq("user_id", userId)
        .eq("feedback_type", feedbackType)
        .order("requested_at", { ascending: false })
        .limit(1)
        .single();
      if (latest) await supabase.from("ai_rate_limits").delete().eq("id", latest.id);

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
    let mentorSystemPrompt = systemPrompt;

    if (feedbackType === "case_answer") {
      // Mentor-style Socratic feedback for individual case answers
      const difficulty = data.difficulty || "intermediate";
      const confidenceLevel = data.confidence_level || 5;
      const difficultyInstructions = difficulty === "beginner"
        ? "The student is a beginner. Provide more guidance, simpler language, and concrete examples. Be encouraging."
        : difficulty === "advanced"
        ? "The student is advanced. Use more strategic, probing questions. Challenge assumptions. Push for deeper analysis."
        : "The student is at intermediate level. Balance guidance with strategic questioning.";

      // Confidence calibration instructions
      let confidenceInstructions = "";
      if (confidenceLevel <= 3) {
        confidenceInstructions = `CONFIDENCE CALIBRATION: The student rated their confidence ${confidenceLevel}/10 (low).
- They are uncertain — this is GOOD. Acknowledge their intellectual humility.
- Focus on BUILDING their confidence by highlighting what they got right.
- Provide more scaffolding and concrete next steps.
- Use phrases like "You're on the right track because..." and "Your instinct about X is solid."
- Help them see what they already understand but may not realize.`;
      } else if (confidenceLevel <= 6) {
        confidenceInstructions = `CONFIDENCE CALIBRATION: The student rated their confidence ${confidenceLevel}/10 (moderate).
- Balanced approach: validate strengths while probing assumptions.
- Ask them to justify their reasoning — "What evidence supports this?"
- Encourage them to consider one alternative perspective.`;
      } else if (confidenceLevel <= 8) {
        confidenceInstructions = `CONFIDENCE CALIBRATION: The student rated their confidence ${confidenceLevel}/10 (high).
- Gently challenge assumptions they may be overlooking.
- Ask "What could go wrong with this approach?" or "What are you assuming?"
- Push for edge cases and counterarguments.
- If their answer IS strong, confirm it — but still challenge one assumption.`;
      } else {
        confidenceInstructions = `CONFIDENCE CALIBRATION: The student rated their confidence ${confidenceLevel}/10 (very high).
- HIGH ALERT for overconfidence. Stress-test their reasoning hard.
- Ask "What data would change your mind?" and "What's the strongest counterargument?"
- Point out any gaps, missing evidence, or unstated assumptions firmly.
- If the answer is genuinely excellent, acknowledge it but warn against certainty bias.
- Use phrases like "Consider what you might be missing..." and "Playing devil's advocate..."`;
      }

      mentorSystemPrompt = `You are a Socratic mentor for a university-level digital innovation course, using the MIT/Harvard case method.

CRITICAL RULES:
- NEVER give direct answers, solutions, or solve the case
- NEVER say an answer is "right" or "wrong" — instead discuss trade-offs
- Guide thinking through questions and hints
- Acknowledge that multiple valid approaches exist
- Evaluate the QUALITY OF REASONING, not whether they found "the correct answer"
- Respond ENTIRELY in ${langLabel}

${difficultyInstructions}

${confidenceInstructions}

UNCERTAINTY MINDSET:
- Cases deliberately include incomplete data, conflicting signals, and ambiguity
- Praise students who acknowledge uncertainty and state assumptions
- Challenge students who present conclusions as if data is complete
- Encourage risk/reward thinking and scenario analysis

Structure your response with EXACTLY these 4 sections:
- **${lang === "bg" ? "Силни страни" : "Strengths"}**: What shows good strategic reasoning (2-3 points). Highlight if they acknowledge trade-offs or uncertainty.
- **${lang === "bg" ? "Пропуски" : "Gaps"}**: What trade-offs or risks were not considered? What assumptions were not stated? (2-3 points)
- **${lang === "bg" ? "Стратегическа насока" : "Strategic Hint"}**: A thought-provoking "what if" question that challenges their assumptions (NOT an answer)
- **${lang === "bg" ? "Следваща стъпка" : "Next Step"}**: One concrete action — e.g., "consider the pessimistic scenario" or "state your top 2 assumptions"

Also include a brief **${lang === "bg" ? "Калибрация на увереността" : "Confidence Calibration"}** note at the end: tell the student whether their self-assessed confidence seems aligned with their answer quality — are they overconfident, underconfident, or well-calibrated?

Keep response UNDER 250 words. Be a thinking partner, not a solution generator.`;

      userPrompt = `Case: ${data.case_title || "Digital Innovation Case"}
Question: ${data.question_prompt || "(no question)"}
Question type: ${data.question_type || "long_answer"}
Student's confidence: ${confidenceLevel}/10
Student's answer: ${data.student_answer || "(empty)"}
${data.question_context ? `\nContext/Exhibits provided: ${data.question_context}` : ""}`;
    } else if (feedbackType === "startup_project") {
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
          { role: "system", content: mentorSystemPrompt },
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
    const remaining = DAILY_LIMIT - (count ?? 0);

    // Cache the response
    await supabase.from("ai_feedback_cache").upsert({
      user_id: userId,
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

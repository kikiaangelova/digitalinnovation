import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SECTION_MAX = 25; // each section out of 25, total 100

async function gradeSection(
  apiKey: string,
  sectionName: string,
  prompt: string,
  answer: string,
  lang: string
): Promise<{ score: number; strengths: string; gaps: string; hint: string }> {
  const systemPrompt = lang === "bg"
    ? `Ти си изпитващ преподавател по дигитални иновации и предприемачество. Оцени отговора на студента за секция "${sectionName}" по скала 0-${SECTION_MAX}. Оценявай: разбиране на проблема, стратегическо мислене, иновативност и яснота. Отговори САМО с JSON: {"score": <число>, "strengths": "<силни страни, 1-2 изречения>", "gaps": "<пропуски, 1-2 изречения>", "hint": "<насока за подобрение, 1 изречение>"}`
    : `You are a Digital Innovation & Entrepreneurship exam evaluator. Grade the student's answer for section "${sectionName}" on a scale of 0-${SECTION_MAX}. Evaluate: problem understanding, strategic thinking, innovation, and clarity. Reply ONLY with JSON: {"score": <number>, "strengths": "<1-2 sentences>", "gaps": "<1-2 sentences>", "hint": "<1 sentence improvement direction>"}`;

  const userPrompt = `Section: ${sectionName}\nQuestion: ${prompt}\nStudent answer: ${answer}\nMax points: ${SECTION_MAX}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const result = await resp.json();
    const content = result.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        score: Math.min(SECTION_MAX, Math.max(0, Math.round(parsed.score))),
        strengths: parsed.strengths || "",
        gaps: parsed.gaps || "",
        hint: parsed.hint || "",
      };
    }
  } catch (e) {
    clearTimeout(timeoutId);
    console.error(`Grade section ${sectionName} error:`, e);
  }
  return { score: 0, strengths: "", gaps: "", hint: "" };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const { answers, lang } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

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

    const l = lang === "bg" ? "bg" : "en";

    const sections = [
      {
        key: "case_analysis",
        name: l === "bg" ? "Анализ на казус" : "Case Analysis",
        prompt: l === "bg"
          ? "Анализирайте следния бизнес проблем: Традиционна компания за доставки губи пазарен дял заради дигитални конкуренти. Идентифицирайте основния проблем, анализирайте пазарната среда и предложете стратегическа посока за дигитална трансформация."
          : "Analyze the following business problem: A traditional delivery company is losing market share to digital competitors. Identify the core problem, analyze the market environment, and propose a strategic direction for digital transformation.",
      },
      {
        key: "startup_concept",
        name: l === "bg" ? "Стартъп концепция" : "Startup Concept",
        prompt: l === "bg"
          ? "Дефинирайте стартъп идея, която решава реален проблем. Опишете: 1) Проблемът, 2) Целевият клиент, 3) Вашето ценностно предложение, 4) Как ще печелите пари."
          : "Define a startup idea that solves a real problem. Describe: 1) The problem, 2) Target customer, 3) Your value proposition, 4) How you will make money.",
      },
      {
        key: "strategic_decision",
        name: l === "bg" ? "Стратегическо решение" : "Strategic Decision",
        prompt: l === "bg"
          ? "Вашият стартъп има 50,000 лв бюджет и трябва да избере между: A) Инвестиране в маркетинг за бърз растеж, B) Подобряване на продукта за по-висока задоволеност, C) Наемане на нов екип. Обосновете решението си, анализирайте рисковете и очакваните резултати."
          : "Your startup has a €50,000 budget and must choose between: A) Investing in marketing for rapid growth, B) Improving the product for higher satisfaction, C) Hiring a new team. Justify your decision, analyze risks, and expected outcomes.",
      },
      {
        key: "reflection",
        name: l === "bg" ? "Рефлексия" : "Reflection",
        prompt: l === "bg"
          ? "Какво научихте по време на курса? Как се промени начинът ви на мислене за иновации и бизнес? Какви умения развихте и как ще ги приложите в бъдеще?"
          : "What did you learn during the course? How has your thinking about innovation and business changed? What skills did you develop and how will you apply them in the future?",
      },
    ];

    // Grade all 4 sections in parallel
    const results = await Promise.all(
      sections.map((s) =>
        gradeSection(LOVABLE_API_KEY, s.name, s.prompt, answers[s.key] || "", l)
      )
    );

    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const passed = totalScore >= 70;

    const feedback: Record<string, any> = {};
    sections.forEach((s, i) => {
      feedback[s.key] = results[i];
    });

    // Upsert result
    const { error: upsertError } = await supabase
      .from("final_exam_results")
      .upsert({
        user_id: userId,
        case_analysis_answer: answers.case_analysis || "",
        startup_concept_answer: answers.startup_concept || "",
        strategic_decision_answer: answers.strategic_decision || "",
        reflection_answer: answers.reflection || "",
        case_analysis_score: results[0].score,
        startup_concept_score: results[1].score,
        strategic_decision_score: results[2].score,
        reflection_score: results[3].score,
        total_score: totalScore,
        max_score: 100,
        ai_feedback: feedback,
        passed,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (upsertError) {
      console.error("Upsert error:", upsertError);
    }

    // Award XP if passed (one-time via award-xp pattern)
    if (passed) {
      // Award XP through the xp ledger directly
      const { data: existing } = await supabase
        .from("xp_ledger")
        .select("id")
        .eq("user_id", userId)
        .eq("action", "final_exam_pass")
        .maybeSingle();

      if (!existing) {
        const xpAmount = 150;
        await supabase.from("xp_ledger").insert({
          user_id: userId,
          action: "final_exam_pass",
          xp: xpAmount,
          context_id: "final_exam",
        });
        await supabase.rpc("add_user_xp", { _user_id: userId, _xp: xpAmount });
      }
    }

    return new Response(
      JSON.stringify({ totalScore, passed, feedback, sections: sections.map((s) => s.prompt) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("grade-final-exam error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

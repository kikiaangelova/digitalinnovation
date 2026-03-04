import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, data, lang } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langLabel = lang === "bg" ? "Bulgarian" : "English";

    const systemPrompt = `You are an AI mentor for a digital innovation course designed for 11th grade business students.

CRITICAL: Respond ENTIRELY in ${langLabel}. Do not mix languages.

Guidelines:
- Keep explanations simple and suitable for high school students
- Be constructive, encouraging, and specific
- Ask critical thinking questions
- Keep responses under 250 words

Structure your response with these sections:
- **${lang === "bg" ? "Обобщение" : "Summary"}**: 1-2 sentence overview
- **${lang === "bg" ? "Силни страни" : "Strengths"}**: What's done well (2-3 points)
- **${lang === "bg" ? "Области за подобрение" : "Areas for Improvement"}**: What needs work (2-3 points)
- **${lang === "bg" ? "Следващи стъпки" : "Next Steps"}**: Concrete actions to take (2-3 points)`;

    let userPrompt = "";

    if (type === "startup_project") {
      userPrompt = `Review this student's startup project:\n\nProblem: ${data.problem || "(empty)"}\nCustomer: ${data.customer || "(empty)"}\nValue Proposition: ${data.value_proposition || "(empty)"}\nBusiness Model: ${data.business_model || "(empty)"}\nGrowth Strategy: ${data.growth_strategy || "(empty)"}\nFinal Pitch: ${data.final_pitch || "(empty)"}`;
    } else if (type === "simulator") {
      userPrompt = `Review this student's simulator performance:\n\nWeek reached: ${data.current_week}/6\nUsers: ${data.kpis?.users}\nRevenue: $${data.kpis?.revenue}\nSatisfaction: ${data.kpis?.satisfaction}%\nGrowth Rate: ${data.kpis?.growthRate}%\nGrade: ${data.grade || "In progress"}\n\nDecisions made: ${JSON.stringify(data.decisions || [])}`;
    } else if (type === "case_submission") {
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
        model: "google/gemini-3-flash-preview",
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

    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-feedback error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

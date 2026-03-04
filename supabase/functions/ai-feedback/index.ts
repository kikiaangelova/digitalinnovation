import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "You are an AI mentor for a digital innovation course. Provide constructive, encouraging feedback. Be specific, ask critical thinking questions, and suggest improvements. Keep responses under 200 words. Respond in the same language as the student's content.";
    let userPrompt = "";

    if (type === "startup_project") {
      userPrompt = `Review this student's startup project and provide feedback:\n\nProblem: ${data.problem}\nCustomer: ${data.customer}\nValue Proposition: ${data.value_proposition}\nBusiness Model: ${data.business_model}\nGrowth Strategy: ${data.growth_strategy}\nFinal Pitch: ${data.final_pitch}`;
    } else if (type === "simulator") {
      userPrompt = `Review this student's simulator performance:\n\nWeek reached: ${data.current_week}/6\nUsers: ${data.kpis?.users}\nRevenue: $${data.kpis?.revenue}\nSatisfaction: ${data.kpis?.satisfaction}%\nGrowth Rate: ${data.kpis?.growthRate}%\nGrade: ${data.grade || 'In progress'}\n\nDecisions made: ${JSON.stringify(data.decisions || [])}`;
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
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please contact admin." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const result = await response.json();
    const feedback = result.choices?.[0]?.message?.content || "Unable to generate feedback.";

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

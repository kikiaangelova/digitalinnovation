import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify user with getClaims for JWT verification
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const anonClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader!.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;

    // Use service role to access correct_answer
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { submission_id, source, lang } = await req.json();
    // source: 'assessment' | 'case'
    const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

    if (!submission_id) {
      return new Response(JSON.stringify({ error: "Missing submission_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify submission belongs to user
    const { data: sub, error: subErr } = await adminClient
      .from("submissions")
      .select("id, user_id, assessment_id, case_study_id, is_draft")
      .eq("id", submission_id)
      .single();

    if (subErr || !sub || sub.user_id !== userId) {
      return new Response(JSON.stringify({ error: "Submission not found or unauthorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch questions with correct_answer (server-side only)
    let questions: any[] = [];
    if (source === "assessment" && sub.assessment_id) {
      const { data } = await adminClient
        .from("assessment_questions")
        .select("id, type, points, correct_answer")
        .eq("assessment_id", sub.assessment_id);
      questions = data || [];
    } else {
      // Case-based: get step IDs first
      const { data: steps } = await adminClient
        .from("case_steps")
        .select("id")
        .eq("case_study_id", sub.case_study_id);
      if (steps && steps.length > 0) {
        const stepIds = steps.map((s: any) => s.id);
        const { data } = await adminClient
          .from("questions")
          .select("id, type, points, correct_answer")
          .in("case_step_id", stepIds);
        questions = data || [];
      }
    }

    // Fetch student responses
    const { data: responses } = await adminClient
      .from("responses")
      .select("question_id, answer")
      .eq("submission_id", submission_id);

    const answersMap: Record<string, any> = {};
    (responses || []).forEach((r: any) => {
      answersMap[r.question_id] = r.answer;
    });

    // Grade
    let totalScore = 0;
    let maxScore = 0;

    for (const q of questions) {
      maxScore += q.points;
      if (q.type === "multiple_choice" && q.correct_answer) {
        const userAns = answersMap[q.id];
        const isCorrect = userAns === q.correct_answer;
        const score = isCorrect ? q.points : 0;
        totalScore += score;

        await adminClient
          .from("responses")
          .update({
            score,
            feedback: isCorrect
              ? t("Correct!", "Правилно!")
              : `${t("Incorrect. The correct answer is:", "Неправилно. Верният отговор е:")} ${q.correct_answer}`,
            auto_graded: true,
          })
          .eq("submission_id", submission_id)
          .eq("question_id", q.id);
      }
    }

    // Mark submission as submitted
    await adminClient.from("submissions").update({
      is_draft: false,
      submitted_at: new Date().toISOString(),
      total_score: totalScore,
      max_score: maxScore,
    }).eq("id", submission_id);

    // Track course_progress for the completed case/assessment
    const moduleType = source === "assessment" ? "assessment" : "case_study";
    const moduleId = source === "assessment" ? sub.assessment_id : sub.case_study_id;
    if (moduleId) {
      const { data: existing } = await adminClient
        .from("course_progress")
        .select("id")
        .eq("user_id", userId)
        .eq("module", moduleType)
        .eq("module_id", moduleId)
        .maybeSingle();

      if (existing) {
        await adminClient.from("course_progress").update({
          status: "completed",
          completed_at: new Date().toISOString(),
          score: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : null,
        }).eq("id", existing.id);
      } else {
        await adminClient.from("course_progress").insert({
          user_id: userId,
          module: moduleType,
          module_id: moduleId,
          status: "completed",
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          score: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : null,
        });
      }
    }

    return new Response(
      JSON.stringify({ total_score: totalScore, max_score: maxScore }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("grade-submission error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

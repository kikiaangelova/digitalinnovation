import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_REQUEST_TIMEOUT_MS = 6000;
const MAX_CONCURRENT_GRADES = 3;
const EDGE_SAFE_BUDGET_MS = 22000;

function xpFromPercent(pct: number): number {
  // Base: 100 XP for completion, bonus 30 for high quality (>70%)
  if (pct >= 70) return 130; // 100 base + 30 bonus
  return 100; // base completion XP
}

async function aiGradeQuestion(
  apiKey: string,
  prompt: string,
  answer: string,
  points: number,
  rubric: string | null,
  modelAnswer: string | null,
  lang: string
): Promise<{ score: number; feedback: string }> {
  const systemPrompt = lang === 'bg'
    ? `Ти си преподавател по бизнес иновации. Оцени отговора на студента по скала от 0 до ${points} точки. Бъди справедлив и конструктивен. Отговори САМО с JSON: {"score": <число>, "feedback": "<кратка обратна връзка на български, 1-3 изречения>"}`
    : `You are a business innovation instructor. Grade the student's answer on a scale of 0 to ${points} points. Be fair and constructive. Reply ONLY with JSON: {"score": <number>, "feedback": "<brief feedback in English, 1-3 sentences>"}`;

  const userPrompt = [
    `Question: ${prompt}`,
    modelAnswer ? `Model answer: ${modelAnswer}` : '',
    rubric ? `Rubric: ${rubric}` : '',
    `Student answer: ${answer}`,
    `Max points: ${points}`,
  ].filter(Boolean).join('\n\n');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS);

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "grade_answer",
            description: "Return the grade and feedback for a student answer.",
            parameters: {
              type: "object",
              properties: {
                score: { type: "number", description: `Score from 0 to ${points}` },
                feedback: { type: "string", description: "Brief constructive feedback" },
              },
              required: ["score", "feedback"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "grade_answer" } },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!resp.ok) {
      console.error("AI grading failed:", resp.status, await resp.text());
      return { score: Math.round(points * 0.5), feedback: lang === 'bg' ? 'Автоматична оценка не е налична. Даден е частичен резултат.' : 'AI grading unavailable. Partial credit awarded.' };
    }

    const data = await resp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return {
        score: Math.max(0, Math.min(points, Math.round(Number(parsed.score)))),
        feedback: String(parsed.feedback || ''),
      };
    }

    const content = data.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        score: Math.max(0, Math.min(points, Math.round(Number(parsed.score)))),
        feedback: String(parsed.feedback || ''),
      };
    }

    return { score: Math.round(points * 0.5), feedback: lang === 'bg' ? 'Частичен резултат.' : 'Partial credit awarded.' };
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    if (isAbort) {
      console.warn("AI grading timeout; falling back to partial credit.");
    } else {
      console.error("AI grade error:", err);
    }
    return { score: Math.round(points * 0.5), feedback: lang === 'bg' ? 'Частичен резултат.' : 'Partial credit awarded.' };
  }
}

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
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    // Use service role client to verify user via token
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await adminClient.auth.getUser(token);
    if (userError || !userData?.user) {
      console.error("Auth error:", userError?.message);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const { submission_id, source, lang } = await req.json();
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
      console.error("Submission lookup error:", subErr?.message, "userId:", userId, "sub.user_id:", sub?.user_id);
      return new Response(JSON.stringify({ error: "Submission not found or unauthorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch questions with correct_answer, model_answer, rubric
    let questions: any[] = [];
    if (source === "assessment" && sub.assessment_id) {
      const { data } = await adminClient
        .from("assessment_questions")
        .select("id, type, points, correct_answer, model_answer, rubric, prompt")
        .eq("assessment_id", sub.assessment_id);
      questions = data || [];
    } else {
      const { data: steps } = await adminClient
        .from("case_steps")
        .select("id")
        .eq("case_study_id", sub.case_study_id);
      if (steps && steps.length > 0) {
        const stepIds = steps.map((s: any) => s.id);
        const { data } = await adminClient
          .from("questions")
          .select("id, type, points, correct_answer, model_answer, rubric, prompt")
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

    // Grade with bounded concurrency + global time budget to avoid gateway timeout
    const gradingStartedAt = Date.now();

    const gradeOneQuestion = async (q: any) => {
      const userAns = answersMap[q.id];
      let score = 0;
      let feedback = t("No answer provided.", "Не е предоставен отговор.");

      if (q.type === "multiple_choice" && q.correct_answer) {
        const isCorrect = userAns === q.correct_answer;
        score = isCorrect ? q.points : 0;
        feedback = isCorrect
          ? t("Correct!", "Правилно!")
          : `${t("Incorrect. The correct answer is:", "Неправилно. Верният отговор е:")} ${q.correct_answer}`;
      } else if (userAns && lovableApiKey) {
        const elapsed = Date.now() - gradingStartedAt;
        const outOfTime = elapsed > EDGE_SAFE_BUDGET_MS;
        const answerText = typeof userAns === "string" ? userAns : JSON.stringify(userAns);

        if (!outOfTime && answerText.trim().length > 0) {
          const result = await aiGradeQuestion(lovableApiKey, q.prompt || "", answerText, q.points, q.rubric, q.model_answer, lang || "en");
          score = result.score;
          feedback = result.feedback;
        } else {
          score = Math.round(q.points * 0.5);
          feedback = t("Partial credit awarded to avoid timeout.", "Даден е частичен резултат за избягване на таймаут.");
        }
      } else if (userAns) {
        score = Math.round(q.points * 0.5);
        feedback = t("Partial credit awarded. AI grading unavailable.", "Даден е частичен резултат.");
      }

      await adminClient
        .from("responses")
        .update({ score, feedback, auto_graded: true })
        .eq("submission_id", submission_id)
        .eq("question_id", q.id);

      return { points: q.points, score };
    };

    const results: Array<{ points: number; score: number }> = [];
    for (let i = 0; i < questions.length; i += MAX_CONCURRENT_GRADES) {
      const batch = questions.slice(i, i + MAX_CONCURRENT_GRADES);
      const batchResults = await Promise.all(batch.map(gradeOneQuestion));
      results.push(...batchResults);
    }

    for (const r of results) {
      maxScore += r.points;
      totalScore += r.score;
    }

    const scorePercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const xpAwarded = xpFromPercent(scorePercent);

    // Mark submission as submitted
    await adminClient.from("submissions").update({
      is_draft: false,
      submitted_at: new Date().toISOString(),
      total_score: totalScore,
      max_score: maxScore,
    }).eq("id", submission_id);

    // Track course_progress
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

      const progressData = {
        status: "completed",
        completed_at: new Date().toISOString(),
        score: scorePercent,
        metadata: { xp_awarded: xpAwarded, total_score: totalScore, max_score: maxScore },
      };

      if (existing) {
        await adminClient.from("course_progress").update(progressData).eq("id", existing.id);
      } else {
        await adminClient.from("course_progress").insert({
          user_id: userId,
          module: moduleType,
          module_id: moduleId,
          started_at: new Date().toISOString(),
          ...progressData,
        });
      }

      // Award XP to profile
      const { error: xpError } = await adminClient.rpc("add_user_xp", { _user_id: userId, _xp: xpAwarded });
      if (xpError) {
        console.error("XP award error:", xpError.message);
      }

      // Update case_sessions completion status
      if (source !== "assessment" && sub.case_study_id) {
        await adminClient
          .from("case_sessions")
          .upsert({
            user_id: userId,
            case_id: sub.case_study_id,
            completion_status: "completed",
            xp_earned: xpAwarded,
            last_saved: new Date().toISOString(),
          }, { onConflict: "user_id,case_id" });
      }
    }

    console.log(`Graded submission ${submission_id}: ${totalScore}/${maxScore} (${scorePercent}%) → ${xpAwarded} XP for user ${userId}`);

    return new Response(
      JSON.stringify({ total_score: totalScore, max_score: maxScore, score_percent: scorePercent, xp_awarded: xpAwarded }),
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

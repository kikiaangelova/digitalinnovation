import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // 1. Validate JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Verify admin role using service role
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roleData } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Parse requested scope
    const body = await req.json().catch(() => ({}));
    const scope = body.scope || "all";

    const result: Record<string, any> = {};

    // Fetch data using service role (bypasses RLS)
    if (["all", "dashboard", "teacher", "analytics"].includes(scope)) {
      const [profiles, casesRes, subsRes] = await Promise.all([
        admin.from("profiles").select("user_id, full_name, display_name, total_xp, created_at, skills_tags, interests, cohort_id, links_json, updated_at, avatar_url, avatar_style, school_name, class_name, institution, onboarding_completed"),
        admin.from("case_studies").select("id, title, topic, difficulty, published, created_at").order("created_at", { ascending: false }),
        admin.from("submissions").select("id, case_study_id, user_id, is_draft, total_score, max_score, submitted_at, created_at").eq("is_draft", false).order("submitted_at", { ascending: false }),
      ]);
      result.profiles = profiles.data || [];
      result.cases = casesRes.data || [];
      result.submissions = subsRes.data || [];
    }

    if (["all", "dashboard"].includes(scope)) {
      const [sessionsRes] = await Promise.all([
        admin.from("case_sessions").select("user_id, case_id, xp_earned, current_step, completion_status, last_saved"),
      ]);
      result.case_sessions = sessionsRes.data || [];
    }

    if (["all", "analytics"].includes(scope)) {
      const [startupsRes, simRes, cpRes, qrRes] = await Promise.all([
        admin.from("startup_projects").select("id, user_id, created_at, is_submitted, submitted_at"),
        admin.from("simulator_progress").select("id, user_id, is_complete, current_week, created_at, grade"),
        admin.from("course_progress").select("id, user_id, module, status, completed_at, score, created_at"),
        admin.from("quiz_results").select("id, user_id, score, category, xp_earned, created_at").eq("quiz_type", "dictionary"),
      ]);
      result.startups = startupsRes.data || [];
      result.sim_progress = simRes.data || [];
      result.course_progress = cpRes.data || [];
      result.quiz_results = qrRes.data || [];
    }

    if (["all", "teacher"].includes(scope)) {
      const [projRes, simRes, fbRes, modRespRes, modRes] = await Promise.all([
        admin.from("startup_projects").select("*").order("created_at", { ascending: false }),
        admin.from("simulator_progress").select("*"),
        admin.from("teacher_feedback").select("*").order("created_at", { ascending: false }),
        admin.from("learning_module_responses").select("*"),
        admin.from("learning_modules").select("id, slug, title_en, title_bg"),
      ]);
      result.projects = projRes.data || [];
      result.sim_progress_full = simRes.data || [];
      result.feedbacks = fbRes.data || [];
      result.module_responses = modRespRes.data || [];
      result.modules = modRes.data || [];
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-data error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// XP reward configuration
const XP_CONFIG: Record<string, { xp: number; daily_cap?: number }> = {
  // Case studies
  case_open: { xp: 5 },
  case_question_answer: { xp: 10, daily_cap: 200 },
  case_complete: { xp: 100 },
  case_high_quality: { xp: 30 },
  // Startup builder
  startup_problem: { xp: 40 },
  startup_customer: { xp: 40 },
  startup_value_proposition: { xp: 40 },
  startup_digital_product: { xp: 50 },
  startup_business_model: { xp: 50 },
  startup_growth_strategy: { xp: 50 },
  startup_final_pitch: { xp: 120 },
  // Simulator
  sim_scenario_complete: { xp: 50, daily_cap: 100 },
  sim_high_performance: { xp: 50, daily_cap: 100 },
  // Dictionary
  dict_view_term: { xp: 2, daily_cap: 20 },
  dict_quiz_correct: { xp: 10, daily_cap: 50 },
  dict_quiz_complete: { xp: 10 }, // overridden by validated metadata.xp_override
  dict_quiz_bonus: { xp: 10 },
  dict_weekly_challenge: { xp: 15, daily_cap: 15 },
  // Startup notes from case
  case_startup_notes: { xp: 50 },
  // Theory modules
  theory_complete: { xp: 10 },
  theory_quiz_pass: { xp: 15 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await adminClient.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const { action, context_id, metadata } = await req.json();

    if (!action || !XP_CONFIG[action]) {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const config = XP_CONFIG[action];
    let xpToAward = config.xp;

    // Allow only validated XP overrides for adaptive dictionary quizzes
    if (action === 'dict_quiz_complete') {
      const override = Number(metadata?.xp_override);
      const allowed = new Set([10, 20, 30, 50]);
      if (!allowed.has(override)) {
        return new Response(JSON.stringify({ error: 'Invalid xp_override for dict_quiz_complete' }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      xpToAward = override;
    }

    if (action === 'dict_quiz_bonus') {
      const bonusType = String(metadata?.bonus_type || '');
      if (!['first_high_score', 'improved_retry'].includes(bonusType)) {
        return new Response(JSON.stringify({ error: 'Invalid bonus_type for dict_quiz_bonus' }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      xpToAward = 10;
    }

    // Check daily cap for capped actions
    if (config.daily_cap) {
      const today = new Date().toISOString().split('T')[0];
      const { count } = await adminClient
        .from('xp_ledger')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('action', action)
        .gte('created_at', `${today}T00:00:00Z`);

      const dailyXpUsed = (count || 0) * xpToAward;
      if (dailyXpUsed >= config.daily_cap) {
        return new Response(JSON.stringify({ 
          xp_awarded: 0, 
          message: "Daily XP cap reached for this action",
          capped: true 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Deduplication: for one-time actions, check if already awarded
    const oneTimeActions = [
      'case_open', 'case_complete', 'case_high_quality',
      'startup_problem', 'startup_customer', 'startup_value_proposition',
      'startup_digital_product', 'startup_business_model', 'startup_growth_strategy',
      'startup_final_pitch', 'case_startup_notes',
      'theory_complete', 'theory_quiz_pass',
    ];

    // context_id-scoped dedup: actions that require a context_id and deduplicate per context
    const contextDedupActions = [
      'case_question_answer', 'sim_scenario_complete', 'sim_high_performance',
      'dict_quiz_complete', 'dict_quiz_bonus',
    ];

    // Require context_id for all dedup and context-scoped actions
    if ((oneTimeActions.includes(action) || contextDedupActions.includes(action)) && !context_id) {
      return new Response(JSON.stringify({ error: "context_id required for this action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if ((oneTimeActions.includes(action) || contextDedupActions.includes(action)) && context_id) {
      const { count } = await adminClient
        .from('xp_ledger')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('action', action)
        .eq('context_id', context_id);

      if ((count || 0) > 0) {
        return new Response(JSON.stringify({ 
          xp_awarded: 0, 
          message: "XP already awarded for this action",
          duplicate: true 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Record in ledger
    await adminClient.from('xp_ledger').insert({
      user_id: userId,
      action,
      xp: config.xp,
      context_id: context_id || null,
      metadata: metadata || null,
    });

    // Award XP to profile
    const { error: xpError } = await adminClient.rpc("add_user_xp", { _user_id: userId, _xp: config.xp });
    if (xpError) {
      console.error("XP award error:", xpError.message);
    }

    console.log(`Awarded ${config.xp} XP to ${userId} for ${action} (context: ${context_id || 'none'})`);

    return new Response(JSON.stringify({ 
      xp_awarded: config.xp, 
      action,
      context_id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("award-xp error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

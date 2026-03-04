export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assessment_questions: {
        Row: {
          assessment_id: string
          competency_id: string | null
          correct_answer: string | null
          created_at: string
          id: string
          model_answer: string | null
          options: Json | null
          points: number
          prompt: string
          question_order: number
          rubric: string | null
          type: string
        }
        Insert: {
          assessment_id: string
          competency_id?: string | null
          correct_answer?: string | null
          created_at?: string
          id?: string
          model_answer?: string | null
          options?: Json | null
          points?: number
          prompt: string
          question_order?: number
          rubric?: string | null
          type?: string
        }
        Update: {
          assessment_id?: string
          competency_id?: string | null
          correct_answer?: string | null
          created_at?: string
          id?: string
          model_answer?: string | null
          options?: Json | null
          points?: number
          prompt?: string
          question_order?: number
          rubric?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_questions_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          published: boolean
          settings_json: Json | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          published?: boolean
          settings_json?: Json | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          published?: boolean
          settings_json?: Json | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      assignments: {
        Row: {
          assessment_id: string | null
          assignment_type: string
          case_study_id: string | null
          cohort_id: string
          created_at: string
          created_by: string | null
          due_at: string | null
          id: string
        }
        Insert: {
          assessment_id?: string | null
          assignment_type?: string
          case_study_id?: string | null
          cohort_id: string
          created_at?: string
          created_by?: string | null
          due_at?: string | null
          id?: string
        }
        Update: {
          assessment_id?: string | null
          assignment_type?: string
          case_study_id?: string | null
          cohort_id?: string
          created_at?: string
          created_by?: string | null
          due_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      case_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          case_study_id: string
          cohort_id: string | null
          due_date: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          case_study_id: string
          cohort_id?: string | null
          due_date?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          case_study_id?: string
          cohort_id?: string | null
          due_date?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_assignments_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_assignments_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      case_steps: {
        Row: {
          case_study_id: string
          created_at: string
          exhibit_text: string | null
          id: string
          narrative: string | null
          step_order: number
          title: string
        }
        Insert: {
          case_study_id: string
          created_at?: string
          exhibit_text?: string | null
          id?: string
          narrative?: string | null
          step_order: number
          title: string
        }
        Update: {
          case_study_id?: string
          created_at?: string
          exhibit_text?: string | null
          id?: string
          narrative?: string | null
          step_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_steps_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      case_studies: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["case_difficulty"]
          est_minutes: number | null
          id: string
          outcomes: string[] | null
          published: boolean
          reading_button_label: string | null
          reading_title: string | null
          reading_url: string | null
          title: string
          topic: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["case_difficulty"]
          est_minutes?: number | null
          id?: string
          outcomes?: string[] | null
          published?: boolean
          reading_button_label?: string | null
          reading_title?: string | null
          reading_url?: string | null
          title: string
          topic?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["case_difficulty"]
          est_minutes?: number | null
          id?: string
          outcomes?: string[] | null
          published?: boolean
          reading_button_label?: string | null
          reading_title?: string | null
          reading_url?: string | null
          title?: string
          topic?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cohort_members: {
        Row: {
          cohort_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          cohort_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          cohort_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cohort_members_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      cohorts: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      competencies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      course_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          metadata: Json | null
          module: string
          module_id: string | null
          score: number | null
          started_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          module: string
          module_id?: string | null
          score?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          module?: string
          module_id?: string | null
          score?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      peer_reviews: {
        Row: {
          collaboration_score: number | null
          comments: string | null
          created_at: string
          id: string
          participation_score: number | null
          quality_score: number | null
          reviewee_user_id: string
          reviewer_user_id: string
          submission_id: string
        }
        Insert: {
          collaboration_score?: number | null
          comments?: string | null
          created_at?: string
          id?: string
          participation_score?: number | null
          quality_score?: number | null
          reviewee_user_id: string
          reviewer_user_id: string
          submission_id: string
        }
        Update: {
          collaboration_score?: number | null
          comments?: string | null
          created_at?: string
          id?: string
          participation_score?: number | null
          quality_score?: number | null
          reviewee_user_id?: string
          reviewer_user_id?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "peer_reviews_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cohort_id: string | null
          created_at: string
          full_name: string | null
          id: string
          interests: string[] | null
          links_json: Json | null
          profile_visible: boolean | null
          skills_tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cohort_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          interests?: string[] | null
          links_json?: Json | null
          profile_visible?: boolean | null
          skills_tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cohort_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          interests?: string[] | null
          links_json?: Json | null
          profile_visible?: boolean | null
          skills_tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          case_step_id: string
          competency_id: string | null
          correct_answer: string | null
          created_at: string
          id: string
          model_answer: string | null
          options: Json | null
          points: number
          prompt: string
          question_order: number
          rubric: string | null
          type: Database["public"]["Enums"]["question_type"]
        }
        Insert: {
          case_step_id: string
          competency_id?: string | null
          correct_answer?: string | null
          created_at?: string
          id?: string
          model_answer?: string | null
          options?: Json | null
          points?: number
          prompt: string
          question_order: number
          rubric?: string | null
          type: Database["public"]["Enums"]["question_type"]
        }
        Update: {
          case_step_id?: string
          competency_id?: string | null
          correct_answer?: string | null
          created_at?: string
          id?: string
          model_answer?: string | null
          options?: Json | null
          points?: number
          prompt?: string
          question_order?: number
          rubric?: string | null
          type?: Database["public"]["Enums"]["question_type"]
        }
        Relationships: [
          {
            foreignKeyName: "questions_case_step_id_fkey"
            columns: ["case_step_id"]
            isOneToOne: false
            referencedRelation: "case_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
        ]
      }
      responses: {
        Row: {
          answer: Json | null
          auto_graded: boolean | null
          created_at: string
          feedback: string | null
          id: string
          question_id: string
          score: number | null
          submission_id: string
          updated_at: string
        }
        Insert: {
          answer?: Json | null
          auto_graded?: boolean | null
          created_at?: string
          feedback?: string | null
          id?: string
          question_id: string
          score?: number | null
          submission_id: string
          updated_at?: string
        }
        Update: {
          answer?: Json | null
          auto_graded?: boolean | null
          created_at?: string
          feedback?: string | null
          id?: string
          question_id?: string
          score?: number | null
          submission_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      simulator_progress: {
        Row: {
          created_at: string
          current_week: number
          decisions: Json
          grade: string | null
          id: string
          is_complete: boolean
          kpis: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_week?: number
          decisions?: Json
          grade?: string | null
          id?: string
          is_complete?: boolean
          kpis?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_week?: number
          decisions?: Json
          grade?: string | null
          id?: string
          is_complete?: boolean
          kpis?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      startup_project_versions: {
        Row: {
          business_model: string
          created_at: string
          customer: string
          digital_product: string
          final_pitch: string
          growth_strategy: string
          id: string
          industry: string
          problem: string
          project_id: string
          user_id: string
          value_proposition: string
          version_number: number
        }
        Insert: {
          business_model?: string
          created_at?: string
          customer?: string
          digital_product?: string
          final_pitch?: string
          growth_strategy?: string
          id?: string
          industry?: string
          problem?: string
          project_id: string
          user_id: string
          value_proposition?: string
          version_number?: number
        }
        Update: {
          business_model?: string
          created_at?: string
          customer?: string
          digital_product?: string
          final_pitch?: string
          growth_strategy?: string
          id?: string
          industry?: string
          problem?: string
          project_id?: string
          user_id?: string
          value_proposition?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "startup_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      startup_projects: {
        Row: {
          bmc_channels: string
          bmc_cost_structure: string
          bmc_customer_relationships: string
          bmc_customer_segments: string
          bmc_key_activities: string
          bmc_key_partners: string
          bmc_key_resources: string
          bmc_revenue_streams: string
          bmc_value_proposition: string
          business_model: string
          created_at: string
          customer: string
          digital_product: string
          final_pitch: string
          growth_strategy: string
          id: string
          industry: string
          is_submitted: boolean
          problem: string
          submitted_at: string | null
          updated_at: string
          user_id: string
          value_proposition: string
        }
        Insert: {
          bmc_channels?: string
          bmc_cost_structure?: string
          bmc_customer_relationships?: string
          bmc_customer_segments?: string
          bmc_key_activities?: string
          bmc_key_partners?: string
          bmc_key_resources?: string
          bmc_revenue_streams?: string
          bmc_value_proposition?: string
          business_model?: string
          created_at?: string
          customer?: string
          digital_product?: string
          final_pitch?: string
          growth_strategy?: string
          id?: string
          industry?: string
          is_submitted?: boolean
          problem?: string
          submitted_at?: string | null
          updated_at?: string
          user_id: string
          value_proposition?: string
        }
        Update: {
          bmc_channels?: string
          bmc_cost_structure?: string
          bmc_customer_relationships?: string
          bmc_customer_segments?: string
          bmc_key_activities?: string
          bmc_key_partners?: string
          bmc_key_resources?: string
          bmc_revenue_streams?: string
          bmc_value_proposition?: string
          business_model?: string
          created_at?: string
          customer?: string
          digital_product?: string
          final_pitch?: string
          growth_strategy?: string
          id?: string
          industry?: string
          is_submitted?: boolean
          problem?: string
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
          value_proposition?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          assessment_id: string | null
          case_study_id: string
          created_at: string
          id: string
          is_draft: boolean
          max_score: number | null
          started_at: string | null
          submitted_at: string | null
          team_id: string | null
          total_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_id?: string | null
          case_study_id: string
          created_at?: string
          id?: string
          is_draft?: boolean
          max_score?: number | null
          started_at?: string | null
          submitted_at?: string | null
          team_id?: string | null
          total_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_id?: string | null
          case_study_id?: string
          created_at?: string
          id?: string
          is_draft?: boolean
          max_score?: number | null
          started_at?: string | null
          submitted_at?: string | null
          team_id?: string | null
          total_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_feedback: {
        Row: {
          comment: string
          created_at: string
          id: string
          student_id: string
          target_id: string
          target_type: string
          teacher_id: string
        }
        Insert: {
          comment?: string
          created_at?: string
          id?: string
          student_id: string
          target_id: string
          target_type: string
          teacher_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          student_id?: string
          target_id?: string
          target_type?: string
          teacher_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          cohort_id: string | null
          created_at: string
          created_by: string | null
          id: string
          join_code: string | null
          name: string
        }
        Insert: {
          cohort_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          join_code?: string | null
          name: string
        }
        Update: {
          cohort_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          join_code?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "student"
      case_difficulty: "beginner" | "intermediate" | "advanced"
      question_type:
        | "multiple_choice"
        | "ranking"
        | "numeric_allocation"
        | "short_answer"
        | "long_answer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "student"],
      case_difficulty: ["beginner", "intermediate", "advanced"],
      question_type: [
        "multiple_choice",
        "ranking",
        "numeric_allocation",
        "short_answer",
        "long_answer",
      ],
    },
  },
} as const

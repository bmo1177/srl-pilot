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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admins: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      duaas: {
        Row: {
          author_name: string | null
          created_at: string
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          text: string
        }
        Insert: {
          author_name?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          text: string
        }
        Update: {
          author_name?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          text?: string
        }
        Relationships: []
      }
      metric_history: {
        Row: {
          adaptability: number | null
          collaboration: number | null
          consistency: number | null
          id: string
          problem_solving: number | null
          recorded_at: string | null
          srl_score: number | null
          student_id: string
          technical_skills: number | null
        }
        Insert: {
          adaptability?: number | null
          collaboration?: number | null
          consistency?: number | null
          id?: string
          problem_solving?: number | null
          recorded_at?: string | null
          srl_score?: number | null
          student_id: string
          technical_skills?: number | null
        }
        Update: {
          adaptability?: number | null
          collaboration?: number | null
          consistency?: number | null
          id?: string
          problem_solving?: number | null
          recorded_at?: string | null
          srl_score?: number | null
          student_id?: string
          technical_skills?: number | null
        }
        Relationships: []
      }
      participants: {
        Row: {
          avatar: string | null
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      reflections: {
        Row: {
          ayah_number: number
          ayah_text: string
          created_at: string
          id: string
          is_featured: boolean | null
          participant_id: string | null
          reflection_text: string
          symbolic_title: string
        }
        Insert: {
          ayah_number: number
          ayah_text: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          participant_id?: string | null
          reflection_text: string
          symbolic_title: string
        }
        Update: {
          ayah_number?: number
          ayah_text?: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          participant_id?: string | null
          reflection_text?: string
          symbolic_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reflections_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          message: string | null
          selected_members: string[] | null
          status: string | null
          student_id: string | null
          team_id: string | null
          team_name: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          message?: string | null
          selected_members?: string[] | null
          status?: string | null
          student_id?: string | null
          team_id?: string | null
          team_name?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          message?: string | null
          selected_members?: string[] | null
          status?: string | null
          student_id?: string | null
          team_id?: string | null
          team_name?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "student_analytics"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "requests_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_analytics"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "requests_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      requests_backup: {
        Row: {
          created_at: string | null
          id: string | null
          message: string | null
          status: string | null
          student_id: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          message?: string | null
          status?: string | null
          student_id?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          message?: string | null
          status?: string | null
          student_id?: string | null
          type?: string | null
        }
        Relationships: []
      }
      research_observations: {
        Row: {
          confidence_level: number | null
          content: string
          created_at: string
          id: string
          observation_type: string
          observer_id: string | null
          student_id: string | null
          tags: string[] | null
          team_id: string | null
        }
        Insert: {
          confidence_level?: number | null
          content: string
          created_at?: string
          id?: string
          observation_type: string
          observer_id?: string | null
          student_id?: string | null
          tags?: string[] | null
          team_id?: string | null
        }
        Update: {
          confidence_level?: number | null
          content?: string
          created_at?: string
          id?: string
          observation_type?: string
          observer_id?: string | null
          student_id?: string | null
          tags?: string[] | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_observations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "research_observations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "research_observations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "student_analytics"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "research_observations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_analytics"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "research_observations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      student_action_plans: {
        Row: {
          created_at: string | null
          deadline: string | null
          description: string | null
          id: string
          owner: string | null
          status: string | null
          student_id: string
          task_title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          owner?: string | null
          status?: string | null
          student_id: string
          task_title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          owner?: string | null
          status?: string | null
          student_id?: string
          task_title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      student_metrics: {
        Row: {
          adaptability: number | null
          collaboration: number | null
          consistency: number | null
          created_at: string | null
          id: string
          problem_solving: number | null
          srl_score: number | null
          student_id: string
          technical_skills: number | null
          updated_at: string | null
        }
        Insert: {
          adaptability?: number | null
          collaboration?: number | null
          consistency?: number | null
          created_at?: string | null
          id?: string
          problem_solving?: number | null
          srl_score?: number | null
          student_id: string
          technical_skills?: number | null
          updated_at?: string | null
        }
        Update: {
          adaptability?: number | null
          collaboration?: number | null
          consistency?: number | null
          created_at?: string | null
          id?: string
          problem_solving?: number | null
          srl_score?: number | null
          student_id?: string
          technical_skills?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      student_metrics_snapshots: {
        Row: {
          academic_year: string
          created_at: string
          id: string
          metrics: Json
          notes: string | null
          role: Database["public"]["Enums"]["student_role"] | null
          student_id: string
          team_id: string | null
          week_number: number
        }
        Insert: {
          academic_year: string
          created_at?: string
          id?: string
          metrics: Json
          notes?: string | null
          role?: Database["public"]["Enums"]["student_role"] | null
          student_id: string
          team_id?: string | null
          week_number: number
        }
        Update: {
          academic_year?: string
          created_at?: string
          id?: string
          metrics?: Json
          notes?: string | null
          role?: Database["public"]["Enums"]["student_role"] | null
          student_id?: string
          team_id?: string | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_metrics_snapshots_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_metrics_snapshots_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_metrics_snapshots_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "student_analytics"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "student_metrics_snapshots_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_analytics"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "student_metrics_snapshots_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      student_reflections: {
        Row: {
          created_at: string | null
          id: string
          milestone: string | null
          reflection_text: string
          student_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          milestone?: string | null
          reflection_text: string
          student_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          milestone?: string | null
          reflection_text?: string
          student_id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          archived: boolean | null
          created_at: string | null
          email: string | null
          email_personal: string | null
          id: string
          metrics: Json | null
          metrics_history: Json[] | null
          name: string
          observation_notes: string | null
          role: string | null
          srl_score: number | null
          status: Database["public"]["Enums"]["student_status"] | null
          university_email: string | null
          updated_at: string | null
        }
        Insert: {
          archived?: boolean | null
          created_at?: string | null
          email?: string | null
          email_personal?: string | null
          id?: string
          metrics?: Json | null
          metrics_history?: Json[] | null
          name: string
          observation_notes?: string | null
          role?: string | null
          srl_score?: number | null
          status?: Database["public"]["Enums"]["student_status"] | null
          university_email?: string | null
          updated_at?: string | null
        }
        Update: {
          archived?: boolean | null
          created_at?: string | null
          email?: string | null
          email_personal?: string | null
          id?: string
          metrics?: Json | null
          metrics_history?: Json[] | null
          name?: string
          observation_notes?: string | null
          role?: string | null
          srl_score?: number | null
          status?: Database["public"]["Enums"]["student_status"] | null
          university_email?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      students_backup: {
        Row: {
          created_at: string | null
          email: string | null
          id: string | null
          metrics: Json | null
          name: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string | null
          metrics?: Json | null
          name?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string | null
          metrics?: Json | null
          name?: string | null
          role?: string | null
        }
        Relationships: []
      }
      team_analytics: {
        Row: {
          academic_year: string
          active_members: number | null
          avg_adaptability: number | null
          avg_collaboration: number | null
          avg_planning: number | null
          avg_srl_score: number | null
          avg_team_support: number | null
          created_at: string
          id: string
          performance_trend: string | null
          team_id: string
          team_size: number | null
          week_number: number
        }
        Insert: {
          academic_year: string
          active_members?: number | null
          avg_adaptability?: number | null
          avg_collaboration?: number | null
          avg_planning?: number | null
          avg_srl_score?: number | null
          avg_team_support?: number | null
          created_at?: string
          id?: string
          performance_trend?: string | null
          team_id: string
          team_size?: number | null
          week_number: number
        }
        Update: {
          academic_year?: string
          active_members?: number | null
          avg_adaptability?: number | null
          avg_collaboration?: number | null
          avg_planning?: number | null
          avg_srl_score?: number | null
          avg_team_support?: number | null
          created_at?: string
          id?: string
          performance_trend?: string | null
          team_id?: string
          team_size?: number | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "team_analytics_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "student_analytics"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_analytics_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_analytics"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_analytics_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          assigned_at: string | null
          id: string
          role: string | null
          student_id: string | null
          team_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          role?: string | null
          student_id?: string | null
          team_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          id?: string
          role?: string | null
          student_id?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "student_analytics"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_performance_analytics"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members_backup: {
        Row: {
          assigned_at: string | null
          id: string | null
          role: string | null
          student_id: string | null
          team_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          id?: string | null
          role?: string | null
          student_id?: string | null
          team_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          id?: string | null
          role?: string | null
          student_id?: string | null
          team_id?: string | null
        }
        Relationships: []
      }
      team_metrics: {
        Row: {
          avg_srl_score: number | null
          created_at: string | null
          id: string
          synergy_score: number | null
          team_id: string
          updated_at: string | null
        }
        Insert: {
          avg_srl_score?: number | null
          created_at?: string | null
          id?: string
          synergy_score?: number | null
          team_id: string
          updated_at?: string | null
        }
        Update: {
          avg_srl_score?: number | null
          created_at?: string | null
          id?: string
          synergy_score?: number | null
          team_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          archived: boolean | null
          created_at: string | null
          id: string
          leader_id: string | null
          logo_url: string | null
          name: string
          performance_metrics: Json | null
          project_description: string | null
          research_focus: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          archived?: boolean | null
          created_at?: string | null
          id?: string
          leader_id?: string | null
          logo_url?: string | null
          name: string
          performance_metrics?: Json | null
          project_description?: string | null
          research_focus?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          archived?: boolean | null
          created_at?: string | null
          id?: string
          leader_id?: string | null
          logo_url?: string | null
          name?: string
          performance_metrics?: Json | null
          project_description?: string | null
          research_focus?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "student_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      teams_backup: {
        Row: {
          created_at: string | null
          id: string | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          name?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      student_analytics: {
        Row: {
          created_at: string | null
          email: string | null
          email_personal: string | null
          id: string | null
          metrics: Json | null
          name: string | null
          observation_notes: string | null
          role: string | null
          srl_score: number | null
          status: Database["public"]["Enums"]["student_status"] | null
          team_id: string | null
          team_name: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      team_performance_analytics: {
        Row: {
          avg_adaptability: number | null
          avg_collaboration: number | null
          avg_planning: number | null
          avg_srl_score: number | null
          avg_team_support: number | null
          created_at: string | null
          leader_id: string | null
          leader_name: string | null
          project_description: string | null
          research_focus: string | null
          team_id: string | null
          team_name: string | null
          team_roles: string[] | null
          team_size: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "student_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      delete_duplicate_students: { Args: never; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin:
        | { Args: { user_id: string }; Returns: boolean }
        | { Args: never; Returns: boolean }
      is_user_admin: { Args: { _user_id: string }; Returns: boolean }
      mark_duplicate_students: {
        Args: never
        Returns: {
          duplicate_count: number
          email: string
          id: string
          name: string
        }[]
      }
      record_weekly_metrics_snapshot: {
        Args: {
          p_academic_year?: string
          p_student_id: string
          p_week_number: number
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      student_role: "leader" | "developer" | "designer" | "researcher" | "free"
      student_status:
        | "active"
        | "team_assigned"
        | "inactive"
        | "graduated"
        | "busy"
        | "free"
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
      app_role: ["admin", "moderator", "user"],
      student_role: ["leader", "developer", "designer", "researcher", "free"],
      student_status: [
        "active",
        "team_assigned",
        "inactive",
        "graduated",
        "busy",
        "free",
      ],
    },
  },
} as const

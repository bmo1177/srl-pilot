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
        Relationships: [
          {
            foreignKeyName: "metric_history_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
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
          created_at: string
          id: string
          logo_url: string | null
          message: string | null
          selected_members: Json | null
          status: string
          student_id: string
          team_id: string | null
          team_name: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          message?: string | null
          selected_members?: Json | null
          status?: string
          student_id: string
          team_id?: string | null
          team_name?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          message?: string | null
          selected_members?: Json | null
          status?: string
          student_id?: string
          team_id?: string | null
          team_name?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
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
        Relationships: [
          {
            foreignKeyName: "student_action_plans_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "student_metrics_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
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
        Relationships: [
          {
            foreignKeyName: "student_reflections_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          archived: boolean | null
          created_at: string
          id: string
          name: string
          personal_email: string | null
          status: string
          university_email: string
          updated_at: string
        }
        Insert: {
          archived?: boolean | null
          created_at?: string
          id?: string
          name: string
          personal_email?: string | null
          status?: string
          university_email?: string
          updated_at?: string
        }
        Update: {
          archived?: boolean | null
          created_at?: string
          id?: string
          name?: string
          personal_email?: string | null
          status?: string
          university_email?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          role: string | null
          student_id: string
          team_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string | null
          student_id: string
          team_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string | null
          student_id?: string
          team_id?: string
        }
        Relationships: [
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
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "team_metrics_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          charter: string | null
          created_at: string
          id: string
          leader_id: string | null
          logo_url: string | null
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          charter?: string | null
          created_at?: string
          id?: string
          leader_id?: string | null
          logo_url?: string | null
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          charter?: string | null
          created_at?: string
          id?: string
          leader_id?: string | null
          logo_url?: string | null
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
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
      is_admin: { Args: { user_id: string }; Returns: boolean }
      is_user_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    },
  },
} as const

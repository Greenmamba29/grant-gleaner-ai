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
      api_configs: {
        Row: {
          api_name: string
          created_at: string
          endpoint: string | null
          id: string
          is_active: boolean | null
          last_sync: string | null
          settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          api_name: string
          created_at?: string
          endpoint?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          api_name?: string
          created_at?: string
          endpoint?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          content_sections: Json | null
          created_at: string
          id: string
          notes: string | null
          opportunity_scored_id: string
          status: Database["public"]["Enums"]["application_status"]
          submitted_at: string | null
          team_members: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content_sections?: Json | null
          created_at?: string
          id?: string
          notes?: string | null
          opportunity_scored_id: string
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string | null
          team_members?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content_sections?: Json | null
          created_at?: string
          id?: string
          notes?: string | null
          opportunity_scored_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string | null
          team_members?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_scored_id_fkey"
            columns: ["opportunity_scored_id"]
            isOneToOne: false
            referencedRelation: "opportunities_scored"
            referencedColumns: ["id"]
          },
        ]
      }
      company_profiles: {
        Row: {
          active_proposal_count: number | null
          cost_share_capacity: number | null
          created_at: string
          geographic_priorities: string[] | null
          id: string
          keywords: string[] | null
          name: string
          sectors: string[] | null
          team_credentials: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active_proposal_count?: number | null
          cost_share_capacity?: number | null
          created_at?: string
          geographic_priorities?: string[] | null
          id?: string
          keywords?: string[] | null
          name: string
          sectors?: string[] | null
          team_credentials?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active_proposal_count?: number | null
          cost_share_capacity?: number | null
          created_at?: string
          geographic_priorities?: string[] | null
          id?: string
          keywords?: string[] | null
          name?: string
          sectors?: string[] | null
          team_credentials?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunities_raw: {
        Row: {
          agency: string | null
          amount_max: number | null
          amount_min: number | null
          amount_text: string | null
          created_at: string
          deadline: string | null
          description: string | null
          eligibility: string | null
          external_id: string | null
          id: string
          is_processed: boolean | null
          raw_data: Json | null
          source: string
          source_url: string | null
          title: string
        }
        Insert: {
          agency?: string | null
          amount_max?: number | null
          amount_min?: number | null
          amount_text?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          eligibility?: string | null
          external_id?: string | null
          id?: string
          is_processed?: boolean | null
          raw_data?: Json | null
          source: string
          source_url?: string | null
          title: string
        }
        Update: {
          agency?: string | null
          amount_max?: number | null
          amount_min?: number | null
          amount_text?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          eligibility?: string | null
          external_id?: string | null
          id?: string
          is_processed?: boolean | null
          raw_data?: Json | null
          source?: string
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
      opportunities_scored: {
        Row: {
          bonus_points: number | null
          capacity_penalty: number | null
          created_at: string
          decision: Database["public"]["Enums"]["opportunity_decision"]
          hitl_status: Database["public"]["Enums"]["hitl_status"]
          id: string
          match_reasons: string[] | null
          opportunity_raw_id: string
          resource_efficiency_score: number | null
          risks: string[] | null
          scoring_details: Json | null
          snoozed_until: string | null
          strategic_fit_score: number | null
          strategic_value_score: number | null
          total_score: number | null
          updated_at: string
          user_id: string
          win_probability_score: number | null
        }
        Insert: {
          bonus_points?: number | null
          capacity_penalty?: number | null
          created_at?: string
          decision?: Database["public"]["Enums"]["opportunity_decision"]
          hitl_status?: Database["public"]["Enums"]["hitl_status"]
          id?: string
          match_reasons?: string[] | null
          opportunity_raw_id: string
          resource_efficiency_score?: number | null
          risks?: string[] | null
          scoring_details?: Json | null
          snoozed_until?: string | null
          strategic_fit_score?: number | null
          strategic_value_score?: number | null
          total_score?: number | null
          updated_at?: string
          user_id: string
          win_probability_score?: number | null
        }
        Update: {
          bonus_points?: number | null
          capacity_penalty?: number | null
          created_at?: string
          decision?: Database["public"]["Enums"]["opportunity_decision"]
          hitl_status?: Database["public"]["Enums"]["hitl_status"]
          id?: string
          match_reasons?: string[] | null
          opportunity_raw_id?: string
          resource_efficiency_score?: number | null
          risks?: string[] | null
          scoring_details?: Json | null
          snoozed_until?: string | null
          strategic_fit_score?: number | null
          strategic_value_score?: number | null
          total_score?: number | null
          updated_at?: string
          user_id?: string
          win_probability_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_scored_opportunity_raw_id_fkey"
            columns: ["opportunity_raw_id"]
            isOneToOne: false
            referencedRelation: "opportunities_raw"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      search_history: {
        Row: {
          created_at: string
          filters: Json | null
          id: string
          query: string
          results_count: number | null
          source: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          filters?: Json | null
          id?: string
          query: string
          results_count?: number | null
          source?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          filters?: Json | null
          id?: string
          query?: string
          results_count?: number | null
          source?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      team_candidates: {
        Row: {
          created_at: string
          credentials: string[] | null
          email: string | null
          id: string
          linkedin_url: string | null
          match_score: number | null
          name: string
          notes: string | null
          organization: string | null
          raw_data: Json | null
          skills: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          credentials?: string[] | null
          email?: string | null
          id?: string
          linkedin_url?: string | null
          match_score?: number | null
          name: string
          notes?: string | null
          organization?: string | null
          raw_data?: Json | null
          skills?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          credentials?: string[] | null
          email?: string | null
          id?: string
          linkedin_url?: string | null
          match_score?: number | null
          name?: string
          notes?: string | null
          organization?: string | null
          raw_data?: Json | null
          skills?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      app_role: "admin" | "user"
      application_status:
        | "draft"
        | "in_progress"
        | "submitted"
        | "awarded"
        | "rejected"
      hitl_status: "pending" | "approved" | "rejected" | "snoozed"
      opportunity_decision:
        | "priority_a"
        | "priority_b"
        | "conditional"
        | "no_go"
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
      app_role: ["admin", "user"],
      application_status: [
        "draft",
        "in_progress",
        "submitted",
        "awarded",
        "rejected",
      ],
      hitl_status: ["pending", "approved", "rejected", "snoozed"],
      opportunity_decision: [
        "priority_a",
        "priority_b",
        "conditional",
        "no_go",
      ],
    },
  },
} as const

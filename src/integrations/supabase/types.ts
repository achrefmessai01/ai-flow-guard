export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      litellm_logs: {
        Row: {
          api_base: string | null
          call_type: string | null
          completion_tokens: number | null
          completionstarttime: string | null
          created_at: string | null
          custom_llm_provider: string | null
          end_user: string | null
          endtime: string | null
          id: number
          latency_sec: number | null
          model: string | null
          model_group: string | null
          model_id: string | null
          performance_cost_analysis: Json | null
          prompt: string | null
          prompt_length: number | null
          prompt_tokens: number | null
          proxy_messages: string | null
          proxy_model: string | null
          proxy_prompt: string | null
          request_id: string | null
          response_choices: string | null
          response_created: string | null
          response_id: string | null
          response_length: number | null
          response_model: string | null
          response_object: string | null
          response_text: string | null
          response_usage: string | null
          security_analysis: Json | null
          session_id: string | null
          spend: number | null
          starttime: string | null
          status: string | null
          team_id: string | null
          total_tokens: number | null
          user_id: string | null
        }
        Insert: {
          api_base?: string | null
          call_type?: string | null
          completion_tokens?: number | null
          completionstarttime?: string | null
          created_at?: string | null
          custom_llm_provider?: string | null
          end_user?: string | null
          endtime?: string | null
          id?: number
          latency_sec?: number | null
          model?: string | null
          model_group?: string | null
          model_id?: string | null
          performance_cost_analysis?: Json | null
          prompt?: string | null
          prompt_length?: number | null
          prompt_tokens?: number | null
          proxy_messages?: string | null
          proxy_model?: string | null
          proxy_prompt?: string | null
          request_id?: string | null
          response_choices?: string | null
          response_created?: string | null
          response_id?: string | null
          response_length?: number | null
          response_model?: string | null
          response_object?: string | null
          response_text?: string | null
          response_usage?: string | null
          security_analysis?: Json | null
          session_id?: string | null
          spend?: number | null
          starttime?: string | null
          status?: string | null
          team_id?: string | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Update: {
          api_base?: string | null
          call_type?: string | null
          completion_tokens?: number | null
          completionstarttime?: string | null
          created_at?: string | null
          custom_llm_provider?: string | null
          end_user?: string | null
          endtime?: string | null
          id?: number
          latency_sec?: number | null
          model?: string | null
          model_group?: string | null
          model_id?: string | null
          performance_cost_analysis?: Json | null
          prompt?: string | null
          prompt_length?: number | null
          prompt_tokens?: number | null
          proxy_messages?: string | null
          proxy_model?: string | null
          proxy_prompt?: string | null
          request_id?: string | null
          response_choices?: string | null
          response_created?: string | null
          response_id?: string | null
          response_length?: number | null
          response_model?: string | null
          response_object?: string | null
          response_text?: string | null
          response_usage?: string | null
          security_analysis?: Json | null
          session_id?: string | null
          spend?: number | null
          starttime?: string | null
          status?: string | null
          team_id?: string | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

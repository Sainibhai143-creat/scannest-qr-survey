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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      appliances: {
        Row: {
          ac: number
          fans: number
          geyser: number
          id: string
          lights: number
          microwave: number
          others: string[]
          refrigerator: number
          survey_id: string
          washing_machine: number
        }
        Insert: {
          ac?: number
          fans?: number
          geyser?: number
          id?: string
          lights?: number
          microwave?: number
          others?: string[]
          refrigerator?: number
          survey_id: string
          washing_machine?: number
        }
        Update: {
          ac?: number
          fans?: number
          geyser?: number
          id?: string
          lights?: number
          microwave?: number
          others?: string[]
          refrigerator?: number
          survey_id?: string
          washing_machine?: number
        }
        Relationships: [
          {
            foreignKeyName: "appliances_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      qr_tokens: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          survey_id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          survey_id: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          survey_id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_tokens_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          address: string
          created_at: string
          created_by: string
          disability_details: string | null
          family_female: number
          family_male: number
          family_total: number
          full_name: string
          gov_department: string | null
          gov_designation: string | null
          gov_employee_id: string | null
          has_disability: boolean
          has_health_insurance: boolean
          health_insurance_provider: string | null
          house_number: string
          id: string
          income_source: Database["public"]["Enums"]["income_source"]
          login_email: string
          login_id: string
          login_name: string
          login_password: string
          ownership: Database["public"]["Enums"]["ownership_type"]
          phone_number: string
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          created_by: string
          disability_details?: string | null
          family_female?: number
          family_male?: number
          family_total?: number
          full_name: string
          gov_department?: string | null
          gov_designation?: string | null
          gov_employee_id?: string | null
          has_disability?: boolean
          has_health_insurance?: boolean
          health_insurance_provider?: string | null
          house_number: string
          id?: string
          income_source: Database["public"]["Enums"]["income_source"]
          login_email: string
          login_id: string
          login_name: string
          login_password: string
          ownership: Database["public"]["Enums"]["ownership_type"]
          phone_number: string
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          created_by?: string
          disability_details?: string | null
          family_female?: number
          family_male?: number
          family_total?: number
          full_name?: string
          gov_department?: string | null
          gov_designation?: string | null
          gov_employee_id?: string | null
          has_disability?: boolean
          has_health_insurance?: boolean
          health_insurance_provider?: string | null
          house_number?: string
          id?: string
          income_source?: Database["public"]["Enums"]["income_source"]
          login_email?: string
          login_id?: string
          login_name?: string
          login_password?: string
          ownership?: Database["public"]["Enums"]["ownership_type"]
          phone_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id: string
          model_year: number
          registration_number: string
          survey_id: string
          type: string
        }
        Insert: {
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id?: string
          model_year: number
          registration_number: string
          survey_id: string
          type: string
        }
        Update: {
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          id?: string
          model_year?: number
          registration_number?: string
          survey_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      fuel_type: "petrol" | "diesel" | "electric" | "cng"
      income_source: "business" | "privateJob" | "governmentJob"
      ownership_type: "owner" | "resident"
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
      fuel_type: ["petrol", "diesel", "electric", "cng"],
      income_source: ["business", "privateJob", "governmentJob"],
      ownership_type: ["owner", "resident"],
    },
  },
} as const

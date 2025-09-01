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
      catalogue_items: {
        Row: {
          artist_creator: string | null
          description: string | null
          id: number
          images: string[] | null
          item_type: string | null
          location: string | null
          purchase_info: Json | null
          qr_code_id: number | null
          tags: string[] | null
          title: string | null
          year: number | null
        }
        Insert: {
          artist_creator?: string | null
          description?: string | null
          id?: number
          images?: string[] | null
          item_type?: string | null
          location?: string | null
          purchase_info?: Json | null
          qr_code_id?: number | null
          tags?: string[] | null
          title?: string | null
          year?: number | null
        }
        Update: {
          artist_creator?: string | null
          description?: string | null
          id?: number
          images?: string[] | null
          item_type?: string | null
          location?: string | null
          purchase_info?: Json | null
          qr_code_id?: number | null
          tags?: string[] | null
          title?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "catalogue_items_qr_code_id_fkey"
            columns: ["qr_code_id"]
            isOneToOne: true
            referencedRelation: "qr_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_files: {
        Row: {
          category: string | null
          content: string
          id: string
          slug: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          id?: string
          slug: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      phones: {
        Row: {
          created_at: string
          id: number
          phone_hash: string
          user_profile_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          phone_hash: string
          user_profile_id: number
        }
        Update: {
          created_at?: string
          id?: number
          phone_hash?: string
          user_profile_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "phones_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_actions: {
        Row: {
          action_data: Json
          action_type: string
          created_at: string | null
          id: number
          max_scans: number | null
          priority: number | null
          qr_code_id: number | null
          requires_auth: boolean | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          action_data: Json
          action_type: string
          created_at?: string | null
          id?: number
          max_scans?: number | null
          priority?: number | null
          qr_code_id?: number | null
          requires_auth?: boolean | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          action_data?: Json
          action_type?: string
          created_at?: string | null
          id?: number
          max_scans?: number | null
          priority?: number | null
          qr_code_id?: number | null
          requires_auth?: boolean | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_actions_qr_code_id_fkey"
            columns: ["qr_code_id"]
            isOneToOne: false
            referencedRelation: "qr_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_codes: {
        Row: {
          base58_id: string
          category: string
          code: string
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          last_scanned_at: string | null
          metadata: Json | null
          name: string | null
          scan_count: number | null
          updated_at: string | null
        }
        Insert: {
          base58_id: string
          category: string
          code: string
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          last_scanned_at?: string | null
          metadata?: Json | null
          name?: string | null
          scan_count?: number | null
          updated_at?: string | null
        }
        Update: {
          base58_id?: string
          category?: string
          code?: string
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          last_scanned_at?: string | null
          metadata?: Json | null
          name?: string | null
          scan_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      qr_scans: {
        Row: {
          action_taken: string | null
          id: number
          ip_address: unknown | null
          qr_code_id: number | null
          scanned_at: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_taken?: string | null
          id?: number
          ip_address?: unknown | null
          qr_code_id?: number | null
          scanned_at?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_taken?: string | null
          id?: number
          ip_address?: unknown | null
          qr_code_id?: number | null
          scanned_at?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_scans_qr_code_id_fkey"
            columns: ["qr_code_id"]
            isOneToOne: false
            referencedRelation: "qr_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          bio: string | null
          created_at: string
          first_name: string
          id: number
          is_admin: boolean
          last_name: string | null
          phone_number: string | null
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          first_name: string
          id?: number
          is_admin?: boolean
          last_name?: string | null
          phone_number?: string | null
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          first_name?: string
          id?: number
          is_admin?: boolean
          last_name?: string | null
          phone_number?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { p_uid: string }
        Returns: boolean
      }
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

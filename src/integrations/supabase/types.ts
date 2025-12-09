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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          clock_in: string | null
          clock_out: string | null
          created_at: string | null
          date: string
          id: string
          notes: string | null
          overtime_hours: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          overtime_hours?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          overtime_hours?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_details: {
        Row: {
          account_holder_name: string | null
          account_number: string | null
          bank_name: string | null
          branch_name: string | null
          created_at: string | null
          iban: string | null
          id: string
          swift_code: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_holder_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          branch_name?: string | null
          created_at?: string | null
          iban?: string | null
          id?: string
          swift_code?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_holder_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          branch_name?: string | null
          created_at?: string | null
          iban?: string | null
          id?: string
          swift_code?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          description: string
          expense_date: string
          id: string
          receipt_url: string | null
          receipts: string[] | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          description: string
          expense_date?: string
          id?: string
          receipt_url?: string | null
          receipts?: string[] | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string
          expense_date?: string
          id?: string
          receipt_url?: string | null
          receipts?: string[] | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_balances: {
        Row: {
          created_at: string | null
          id: string
          leave_type: string
          total_days: number
          updated_at: string | null
          used_days: number
          user_id: string
          year: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          leave_type: string
          total_days?: number
          updated_at?: string | null
          used_days?: number
          user_id: string
          year?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          leave_type?: string
          total_days?: number
          updated_at?: string | null
          used_days?: number
          user_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          attachments: string[] | null
          created_at: string | null
          days_count: number
          end_date: string
          id: string
          leave_type: string
          reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          start_date: string
          status: string | null
          team_overlap_warning: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string | null
          days_count: number
          end_date: string
          id?: string
          leave_type: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date: string
          status?: string | null
          team_overlap_warning?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attachments?: string[] | null
          created_at?: string | null
          days_count?: number
          end_date?: string
          id?: string
          leave_type?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date?: string
          status?: string | null
          team_overlap_warning?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payslips: {
        Row: {
          absence_deduction: number | null
          basic_salary: number
          created_at: string | null
          food_allowance: number | null
          gross_salary: number
          housing_allowance: number | null
          id: string
          late_deduction: number | null
          loan_deduction: number | null
          month: number
          net_salary: number
          notes: string | null
          other_allowances: number | null
          other_deductions: number | null
          overtime_amount: number | null
          overtime_hours: number | null
          paid_at: string | null
          phone_allowance: number | null
          status: string | null
          total_deductions: number
          transportation_allowance: number | null
          updated_at: string | null
          user_id: string
          year: number
        }
        Insert: {
          absence_deduction?: number | null
          basic_salary?: number
          created_at?: string | null
          food_allowance?: number | null
          gross_salary?: number
          housing_allowance?: number | null
          id?: string
          late_deduction?: number | null
          loan_deduction?: number | null
          month: number
          net_salary?: number
          notes?: string | null
          other_allowances?: number | null
          other_deductions?: number | null
          overtime_amount?: number | null
          overtime_hours?: number | null
          paid_at?: string | null
          phone_allowance?: number | null
          status?: string | null
          total_deductions?: number
          transportation_allowance?: number | null
          updated_at?: string | null
          user_id: string
          year: number
        }
        Update: {
          absence_deduction?: number | null
          basic_salary?: number
          created_at?: string | null
          food_allowance?: number | null
          gross_salary?: number
          housing_allowance?: number | null
          id?: string
          late_deduction?: number | null
          loan_deduction?: number | null
          month?: number
          net_salary?: number
          notes?: string | null
          other_allowances?: number | null
          other_deductions?: number | null
          overtime_amount?: number | null
          overtime_hours?: number | null
          paid_at?: string | null
          phone_allowance?: number | null
          status?: string | null
          total_deductions?: number
          transportation_allowance?: number | null
          updated_at?: string | null
          user_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "payslips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          position: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          position?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          position?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      salary_components: {
        Row: {
          basic_salary: number
          created_at: string | null
          food_allowance: number | null
          housing_allowance: number | null
          id: string
          other_allowances: number | null
          phone_allowance: number | null
          transportation_allowance: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          basic_salary?: number
          created_at?: string | null
          food_allowance?: number | null
          housing_allowance?: number | null
          id?: string
          other_allowances?: number | null
          phone_allowance?: number | null
          transportation_allowance?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          basic_salary?: number
          created_at?: string | null
          food_allowance?: number | null
          housing_allowance?: number | null
          id?: string
          other_allowances?: number | null
          phone_allowance?: number | null
          transportation_allowance?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salary_components_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
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
          role?: Database["public"]["Enums"]["app_role"]
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
      check_team_leave_overlap: {
        Args: { p_end_date: string; p_start_date: string; p_user_id: string }
        Returns: {
          overlap_count: number
          overlapping_employees: string[]
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_level: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "ceo" | "admin_hr" | "bdm" | "manager" | "employee"
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
      app_role: ["ceo", "admin_hr", "bdm", "manager", "employee"],
    },
  },
} as const

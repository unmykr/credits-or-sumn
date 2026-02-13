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
      complaints: {
        Row: {
          admin_id: string | null
          admin_response: string | null
          created_at: string | null
          description: string
          id: string
          is_priority: boolean | null
          reason: Database["public"]["Enums"]["complaint_reason"]
          status: Database["public"]["Enums"]["complaint_status"] | null
          student_id: string
          teacher_name: string
          updated_at: string | null
        }
        Insert: {
          admin_id?: string | null
          admin_response?: string | null
          created_at?: string | null
          description: string
          id?: string
          is_priority?: boolean | null
          reason: Database["public"]["Enums"]["complaint_reason"]
          status?: Database["public"]["Enums"]["complaint_status"] | null
          student_id: string
          teacher_name: string
          updated_at?: string | null
        }
        Update: {
          admin_id?: string | null
          admin_response?: string | null
          created_at?: string | null
          description?: string
          id?: string
          is_priority?: boolean | null
          reason?: Database["public"]["Enums"]["complaint_reason"]
          status?: Database["public"]["Enums"]["complaint_status"] | null
          student_id?: string
          teacher_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "complaints_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      grade_disputes: {
        Row: {
          admin_response: string | null
          created_at: string | null
          grade_id: string
          id: string
          reason: string
          status: Database["public"]["Enums"]["complaint_status"] | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          admin_response?: string | null
          created_at?: string | null
          grade_id: string
          id?: string
          reason: string
          status?: Database["public"]["Enums"]["complaint_status"] | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          admin_response?: string | null
          created_at?: string | null
          grade_id?: string
          id?: string
          reason?: string
          status?: Database["public"]["Enums"]["complaint_status"] | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grade_disputes_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "student_grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grade_disputes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      login_attempts: {
        Row: {
          attempt_time: string | null
          id: string
          identifier: string
          ip_address: string | null
          success: boolean | null
        }
        Insert: {
          attempt_time?: string | null
          id?: string
          identifier: string
          ip_address?: string | null
          success?: boolean | null
        }
        Update: {
          attempt_time?: string | null
          id?: string
          identifier?: string
          ip_address?: string | null
          success?: boolean | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
          subject: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id: string
          sender_id: string
          subject: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          sender_id?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          division: Database["public"]["Enums"]["division"] | null
          full_name: string
          full_name_ar: string | null
          grade_level: Database["public"]["Enums"]["grade_level"] | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          student_code: string | null
          student_pin: string | null
          totp_enabled: boolean | null
          totp_secret: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          division?: Database["public"]["Enums"]["division"] | null
          full_name: string
          full_name_ar?: string | null
          grade_level?: Database["public"]["Enums"]["grade_level"] | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          student_code?: string | null
          student_pin?: string | null
          totp_enabled?: boolean | null
          totp_secret?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          division?: Database["public"]["Enums"]["division"] | null
          full_name?: string
          full_name_ar?: string | null
          grade_level?: Database["public"]["Enums"]["grade_level"] | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          student_code?: string | null
          student_pin?: string | null
          totp_enabled?: boolean | null
          totp_secret?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      student_grades: {
        Row: {
          created_at: string | null
          grade: number
          grade_type: string | null
          id: string
          max_grade: number | null
          notes: string | null
          student_id: string
          subject_id: string
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          grade: number
          grade_type?: string | null
          id?: string
          max_grade?: number | null
          notes?: string | null
          student_id: string
          subject_id: string
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          grade?: number
          grade_type?: string | null
          id?: string
          max_grade?: number | null
          notes?: string | null
          student_id?: string
          subject_id?: string
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_grades_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_grades_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          created_at: string | null
          id: string
          name: string
          name_ar: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          name_ar: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          name_ar?: string
        }
        Relationships: []
      }
      teacher_assignments: {
        Row: {
          created_at: string | null
          division: Database["public"]["Enums"]["division"]
          grade_level: Database["public"]["Enums"]["grade_level"]
          id: string
          subject_id: string
          teacher_id: string
        }
        Insert: {
          created_at?: string | null
          division: Database["public"]["Enums"]["division"]
          grade_level: Database["public"]["Enums"]["grade_level"]
          id?: string
          subject_id: string
          teacher_id: string
        }
        Update: {
          created_at?: string | null
          division?: Database["public"]["Enums"]["division"]
          grade_level?: Database["public"]["Enums"]["grade_level"]
          id?: string
          subject_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_assignments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_assignments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_profile_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      complaint_reason:
        | "verbal_abuse"
        | "physical_abuse"
        | "disrespectful_behavior"
        | "sexual_harassment"
        | "unfair_grading"
        | "humiliation_in_class"
        | "yelling_or_threats"
        | "inappropriate_language"
        | "ignoring_students"
        | "refusing_to_explain"
        | "poor_teaching_methods"
        | "not_following_curriculum"
        | "late_or_absent_frequently"
        | "misuse_of_authority"
        | "privacy_violation"
        | "unprofessional_behavior"
        | "academic_dishonesty"
        | "retaliation_against_students"
        | "unclear_exam_rules"
        | "lost_or_altered_grades"
        | "lack_of_communication"
        | "other"
      complaint_status: "pending" | "under_review" | "resolved" | "dismissed"
      division: "A" | "B" | "C" | "D"
      grade_level:
        | "grade_10_science"
        | "grade_10_literary"
        | "grade_11_science"
        | "grade_11_literary"
        | "grade_12_science"
        | "grade_12_literary"
      user_role: "student" | "teacher" | "admin"
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
      complaint_reason: [
        "verbal_abuse",
        "physical_abuse",
        "disrespectful_behavior",
        "sexual_harassment",
        "unfair_grading",
        "humiliation_in_class",
        "yelling_or_threats",
        "inappropriate_language",
        "ignoring_students",
        "refusing_to_explain",
        "poor_teaching_methods",
        "not_following_curriculum",
        "late_or_absent_frequently",
        "misuse_of_authority",
        "privacy_violation",
        "unprofessional_behavior",
        "academic_dishonesty",
        "retaliation_against_students",
        "unclear_exam_rules",
        "lost_or_altered_grades",
        "lack_of_communication",
        "other",
      ],
      complaint_status: ["pending", "under_review", "resolved", "dismissed"],
      division: ["A", "B", "C", "D"],
      grade_level: [
        "grade_10_science",
        "grade_10_literary",
        "grade_11_science",
        "grade_11_literary",
        "grade_12_science",
        "grade_12_literary",
      ],
      user_role: ["student", "teacher", "admin"],
    },
  },
} as const

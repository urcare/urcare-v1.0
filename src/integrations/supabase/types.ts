export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string | null
          created_by: string | null
          date_time: string
          doctor_id: string
          duration_minutes: number | null
          id: string
          notes: string | null
          patient_id: string
          prescription_id: string | null
          reason: string | null
          status: Database["public"]["Enums"]["appointment_status"]
          type: Database["public"]["Enums"]["appointment_type"]
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date_time: string
          doctor_id: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          prescription_id?: string | null
          reason?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          type?: Database["public"]["Enums"]["appointment_type"]
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date_time?: string
          doctor_id?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          prescription_id?: string | null
          reason?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          type?: Database["public"]["Enums"]["appointment_type"]
        }
        Relationships: [
          {
            foreignKeyName: "appointments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          created_at: string | null
          department: string
          id: string
          license_number: string
          profile_id: string
          specialization: string
        }
        Insert: {
          created_at?: string | null
          department: string
          id?: string
          license_number: string
          profile_id: string
          specialization: string
        }
        Update: {
          created_at?: string | null
          department?: string
          id?: string
          license_number?: string
          profile_id?: string
          specialization?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      family_connections: {
        Row: {
          created_at: string | null
          family_member_id: string
          id: string
          is_primary_caregiver: boolean | null
          permissions: Json | null
          relationship: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          family_member_id: string
          id?: string
          is_primary_caregiver?: boolean | null
          permissions?: Json | null
          relationship: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          family_member_id?: string
          id?: string
          is_primary_caregiver?: boolean | null
          permissions?: Json | null
          relationship?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_connections_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_metrics: {
        Row: {
          created_at: string | null
          id: string
          metric_type: string
          notes: string | null
          recorded_at: string | null
          unit: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_type: string
          notes?: string | null
          recorded_at?: string | null
          unit: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_type?: string
          notes?: string | null
          recorded_at?: string | null
          unit?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "health_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          description: string | null
          doctor_id: string | null
          file_type: string | null
          file_url: string | null
          id: string
          is_critical: boolean | null
          patient_id: string
          tags: string[] | null
          title: string
          type: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          description?: string | null
          doctor_id?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_critical?: boolean | null
          patient_id: string
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          description?: string | null
          doctor_id?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_critical?: boolean | null
          patient_id?: string
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_new_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_new_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_new_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          doctor_id: string | null
          dosage: string
          duration: string | null
          end_date: string | null
          frequency: string
          id: string
          instructions: string | null
          is_active: boolean | null
          medication_name: string
          patient_id: string
          refills_remaining: number | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          doctor_id?: string | null
          dosage: string
          duration?: string | null
          end_date?: string | null
          frequency: string
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          medication_name: string
          patient_id: string
          refills_remaining?: number | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          doctor_id?: string | null
          dosage?: string
          duration?: string | null
          end_date?: string | null
          frequency?: string
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          medication_name?: string
          patient_id?: string
          refills_remaining?: number | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medications_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medications_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          priority: string | null
          scheduled_for: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          priority?: string | null
          scheduled_for?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: string | null
          scheduled_for?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          created_at: string | null
          dob: string
          emergency_contact: string | null
          gender: Database["public"]["Enums"]["gender_type"]
          guardian_id: string | null
          id: string
          mrn: string
          profile_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          dob: string
          emergency_contact?: string | null
          gender: Database["public"]["Enums"]["gender_type"]
          guardian_id?: string | null
          id?: string
          mrn: string
          profile_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          dob?: string
          emergency_contact?: string | null
          gender?: Database["public"]["Enums"]["gender_type"]
          guardian_id?: string | null
          id?: string
          mrn?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string
          doctor_id: string
          id: string
          medications: Json
          notes: string | null
          patient_id: string
          status: Database["public"]["Enums"]["prescription_status"]
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date?: string
          doctor_id: string
          id?: string
          medications: Json
          notes?: string | null
          patient_id: string
          status?: Database["public"]["Enums"]["prescription_status"]
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string
          doctor_id?: string
          id?: string
          medications?: Json
          notes?: string | null
          patient_id?: string
          status?: Database["public"]["Enums"]["prescription_status"]
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_onboarding: {
        Row: {
          age: number | null
          created_at: string | null
          full_name: string | null
          gender: string | null
          health_goals: string[] | null
          height_cm: number | null
          id: string
          medical_conditions: string[] | null
          medications: string[] | null
          profile_photo_url: string | null
          records_uploaded: boolean | null
          sleep_quality: string | null
          stress_level: string | null
          updated_at: string | null
          user_id: string
          wearable_connected: boolean | null
          weight_kg: number | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          full_name?: string | null
          gender?: string | null
          health_goals?: string[] | null
          height_cm?: number | null
          id?: string
          medical_conditions?: string[] | null
          medications?: string[] | null
          profile_photo_url?: string | null
          records_uploaded?: boolean | null
          sleep_quality?: string | null
          stress_level?: string | null
          updated_at?: string | null
          user_id: string
          wearable_connected?: boolean | null
          weight_kg?: number | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          full_name?: string | null
          gender?: string | null
          health_goals?: string[] | null
          height_cm?: number | null
          id?: string
          medical_conditions?: string[] | null
          medications?: string[] | null
          profile_photo_url?: string | null
          records_uploaded?: boolean | null
          sleep_quality?: string | null
          stress_level?: string | null
          updated_at?: string | null
          user_id?: string
          wearable_connected?: boolean | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: string | null
          created_at: string | null
          date_of_birth: string | null
          emergency_contact: string | null
          full_name: string | null
          gender: string | null
          guardian_id: string | null
          health_id: string | null
          id: string
          phone: string | null
          preferences: Json | null
          role: string
          status: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          full_name?: string | null
          gender?: string | null
          guardian_id?: string | null
          health_id?: string | null
          id: string
          phone?: string | null
          preferences?: Json | null
          role?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          full_name?: string | null
          gender?: string | null
          guardian_id?: string | null
          health_id?: string | null
          id?: string
          phone?: string | null
          preferences?: Json | null
          role?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_doctor_id: {
        Args: { auth_user_id: string }
        Returns: string
      }
      get_patient_id: {
        Args: { auth_user_id: string }
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      is_doctor: {
        Args: { auth_user_id: string }
        Returns: boolean
      }
      is_patient: {
        Args: { auth_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      appointment_status: "scheduled" | "completed" | "cancelled" | "no_show"
      appointment_type: "regular" | "follow_up" | "emergency" | "consultation"
      gender_type: "male" | "female" | "other" | "prefer_not_to_say"
      medical_record_type:
        | "lab_result"
        | "imaging"
        | "diagnosis"
        | "treatment_plan"
        | "surgery"
        | "discharge"
      prescription_status: "active" | "completed" | "cancelled"
      user_role:
        | "Patient"
        | "Doctor"
        | "Nurse"
        | "Admin"
        | "Pharmacy"
        | "Lab"
        | "Reception"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: ["scheduled", "completed", "cancelled", "no_show"],
      appointment_type: ["regular", "follow_up", "emergency", "consultation"],
      gender_type: ["male", "female", "other", "prefer_not_to_say"],
      medical_record_type: [
        "lab_result",
        "imaging",
        "diagnosis",
        "treatment_plan",
        "surgery",
        "discharge",
      ],
      prescription_status: ["active", "completed", "cancelled"],
      user_role: [
        "Patient",
        "Doctor",
        "Nurse",
        "Admin",
        "Pharmacy",
        "Lab",
        "Reception",
      ],
    },
  },
} as const

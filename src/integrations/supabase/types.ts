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
          id: string
          notes: string | null
          patient_id: string
          status: Database["public"]["Enums"]["appointment_status"]
          type: Database["public"]["Enums"]["appointment_type"]
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date_time: string
          doctor_id: string
          id?: string
          notes?: string | null
          patient_id: string
          status?: Database["public"]["Enums"]["appointment_status"]
          type?: Database["public"]["Enums"]["appointment_type"]
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date_time?: string
          doctor_id?: string
          id?: string
          notes?: string | null
          patient_id?: string
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
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
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
      medical_records: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string
          doctor_id: string
          file_url: string | null
          id: string
          notes: string | null
          patient_id: string
          type: Database["public"]["Enums"]["medical_record_type"]
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date?: string
          doctor_id: string
          file_url?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          type: Database["public"]["Enums"]["medical_record_type"]
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string
          doctor_id?: string
          file_url?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          type?: Database["public"]["Enums"]["medical_record_type"]
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
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

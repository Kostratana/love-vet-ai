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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_type: string
          conversation_id: string | null
          created_at: string
          id: string
          intake_id: string | null
          notes: string
          owner_email_sent: boolean
          pet_id: string | null
          requested_at: string
          slot_id: string | null
          status: string
          updated_at: string
          user_id: string
          veterinarian_id: string | null
        }
        Insert: {
          appointment_type?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          intake_id?: string | null
          notes?: string
          owner_email_sent?: boolean
          pet_id?: string | null
          requested_at: string
          slot_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
          veterinarian_id?: string | null
        }
        Update: {
          appointment_type?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          intake_id?: string | null
          notes?: string
          owner_email_sent?: boolean
          pet_id?: string | null
          requested_at?: string
          slot_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          veterinarian_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_intake_id_fkey"
            columns: ["intake_id"]
            isOneToOne: false
            referencedRelation: "veterinary_intakes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "vet_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_veterinarian_id_fkey"
            columns: ["veterinarian_id"]
            isOneToOne: false
            referencedRelation: "veterinarians"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_staff_requests: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: string
          intake_id: string | null
          pet_id: string | null
          status: string
          summary: string
          symptoms: string[]
          triage_id: string | null
          updated_at: string
          urgency: string
          user_id: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          intake_id?: string | null
          pet_id?: string | null
          status?: string
          summary?: string
          symptoms?: string[]
          triage_id?: string | null
          updated_at?: string
          urgency?: string
          user_id: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          intake_id?: string | null
          pet_id?: string | null
          status?: string
          summary?: string
          symptoms?: string[]
          triage_id?: string | null
          updated_at?: string
          urgency?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinic_staff_requests_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinic_staff_requests_intake_id_fkey"
            columns: ["intake_id"]
            isOneToOne: false
            referencedRelation: "veterinary_intakes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinic_staff_requests_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinic_staff_requests_triage_id_fkey"
            columns: ["triage_id"]
            isOneToOne: false
            referencedRelation: "triage_results"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_messages: {
        Row: {
          attachments: Json
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          attachments?: Json
          content?: string
          conversation_id: string
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          attachments?: Json
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          pet_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pet_id?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pet_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_documents: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string | null
          embedding: string | null
          id: string
          title: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          created_by?: string | null
          embedding?: string | null
          id?: string
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          embedding?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      pets: {
        Row: {
          age: string | null
          breed: string | null
          created_at: string
          id: string
          name: string
          photo_path: string | null
          sex: string | null
          species: string
          user_id: string
        }
        Insert: {
          age?: string | null
          breed?: string | null
          created_at?: string
          id?: string
          name: string
          photo_path?: string | null
          sex?: string | null
          species: string
          user_id: string
        }
        Update: {
          age?: string | null
          breed?: string | null
          created_at?: string
          id?: string
          name?: string
          photo_path?: string | null
          sex?: string | null
          species?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          location: string
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string
          first_name?: string
          id: string
          last_name?: string
          location?: string
          phone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          location?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      triage_results: {
        Row: {
          confidence: number
          conversation_id: string | null
          created_at: string
          id: string
          intake_id: string | null
          request_type: string
          short_summary: string
          suggested_destination: string
          symptoms: string[]
          urgency: string
          user_id: string
        }
        Insert: {
          confidence?: number
          conversation_id?: string | null
          created_at?: string
          id?: string
          intake_id?: string | null
          request_type: string
          short_summary?: string
          suggested_destination: string
          symptoms?: string[]
          urgency: string
          user_id: string
        }
        Update: {
          confidence?: number
          conversation_id?: string | null
          created_at?: string
          id?: string
          intake_id?: string | null
          request_type?: string
          short_summary?: string
          suggested_destination?: string
          symptoms?: string[]
          urgency?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "triage_results_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "triage_results_intake_id_fkey"
            columns: ["intake_id"]
            isOneToOne: false
            referencedRelation: "veterinary_intakes"
            referencedColumns: ["id"]
          },
        ]
      }
      uploaded_files: {
        Row: {
          analysis: string | null
          analysis_model: string | null
          analysis_status: string
          conversation_id: string | null
          created_at: string
          id: string
          intake_id: string | null
          kind: string
          mime_type: string
          ocr_text: string | null
          pet_id: string | null
          size_bytes: number
          storage_path: string
          transcription: string | null
          user_id: string
        }
        Insert: {
          analysis?: string | null
          analysis_model?: string | null
          analysis_status?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          intake_id?: string | null
          kind: string
          mime_type: string
          ocr_text?: string | null
          pet_id?: string | null
          size_bytes: number
          storage_path: string
          transcription?: string | null
          user_id: string
        }
        Update: {
          analysis?: string | null
          analysis_model?: string | null
          analysis_status?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          intake_id?: string | null
          kind?: string
          mime_type?: string
          ocr_text?: string | null
          pet_id?: string | null
          size_bytes?: number
          storage_path?: string
          transcription?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploaded_files_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uploaded_files_intake_id_fkey"
            columns: ["intake_id"]
            isOneToOne: false
            referencedRelation: "veterinary_intakes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uploaded_files_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
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
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vet_slots: {
        Row: {
          booked: boolean
          duration_min: number
          id: string
          is_demo: boolean
          starts_at: string
          veterinarian_id: string
        }
        Insert: {
          booked?: boolean
          duration_min?: number
          id?: string
          is_demo?: boolean
          starts_at: string
          veterinarian_id: string
        }
        Update: {
          booked?: boolean
          duration_min?: number
          id?: string
          is_demo?: boolean
          starts_at?: string
          veterinarian_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vet_slots_veterinarian_id_fkey"
            columns: ["veterinarian_id"]
            isOneToOne: false
            referencedRelation: "veterinarians"
            referencedColumns: ["id"]
          },
        ]
      }
      veterinarians: {
        Row: {
          active: boolean
          appointment_types: string[]
          availability: string
          bio: string
          created_at: string
          id: string
          initials: string
          interests: string[]
          is_demo: boolean
          languages: string[]
          name: string
          slug: string
          specialty: string
          species: string[]
          title: string
          years_experience: number
        }
        Insert: {
          active?: boolean
          appointment_types?: string[]
          availability?: string
          bio?: string
          created_at?: string
          id?: string
          initials?: string
          interests?: string[]
          is_demo?: boolean
          languages?: string[]
          name: string
          slug: string
          specialty: string
          species?: string[]
          title: string
          years_experience?: number
        }
        Update: {
          active?: boolean
          appointment_types?: string[]
          availability?: string
          bio?: string
          created_at?: string
          id?: string
          initials?: string
          interests?: string[]
          is_demo?: boolean
          languages?: string[]
          name?: string
          slug?: string
          specialty?: string
          species?: string[]
          title?: string
          years_experience?: number
        }
        Relationships: []
      }
      veterinary_intakes: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: string
          pet_id: string | null
          status: string
          summary: string
          symptoms: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          pet_id?: string | null
          status?: string
          summary?: string
          symptoms?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          pet_id?: string | null
          status?: string
          summary?: string
          symptoms?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "veterinary_intakes_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veterinary_intakes_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      book_slot: {
        Args: {
          _appointment_type: string
          _conversation_id: string
          _intake_id: string
          _notes: string
          _pet_id: string
          _slot_id: string
        }
        Returns: string
      }
      ensure_demo_slots: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      match_knowledge: {
        Args: {
          match_count?: number
          min_similarity?: number
          query_embedding: string
        }
        Returns: {
          category: string
          content: string
          id: string
          similarity: number
          title: string
        }[]
      }
    }
    Enums: {
      app_role: "owner" | "staff" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["owner", "staff", "admin"],
    },
  },
} as const

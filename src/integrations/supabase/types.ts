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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      amazon_links: {
        Row: {
          affiliate_url: string | null
          amazon_url: string | null
          author: string | null
          book_catalog_id: string | null
          created_at: string
          created_by: string | null
          edition: string | null
          grade: string | null
          id: string
          isbn: string | null
          note: string | null
          program: string | null
          school_year: string | null
          status: Database["public"]["Enums"]["amazon_link_status"]
          subject: string | null
          title: string
          updated_at: string
        }
        Insert: {
          affiliate_url?: string | null
          amazon_url?: string | null
          author?: string | null
          book_catalog_id?: string | null
          created_at?: string
          created_by?: string | null
          edition?: string | null
          grade?: string | null
          id?: string
          isbn?: string | null
          note?: string | null
          program?: string | null
          school_year?: string | null
          status?: Database["public"]["Enums"]["amazon_link_status"]
          subject?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          affiliate_url?: string | null
          amazon_url?: string | null
          author?: string | null
          book_catalog_id?: string | null
          created_at?: string
          created_by?: string | null
          edition?: string | null
          grade?: string | null
          id?: string
          isbn?: string | null
          note?: string | null
          program?: string | null
          school_year?: string | null
          status?: Database["public"]["Enums"]["amazon_link_status"]
          subject?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "amazon_links_book_catalog_id_fkey"
            columns: ["book_catalog_id"]
            isOneToOne: false
            referencedRelation: "book_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      book_catalog: {
        Row: {
          academic_year: string
          author: string | null
          column_m_raw: string | null
          created_at: string
          external_book_id: string | null
          former_class_source: string | null
          grade: string
          id: string
          is_sellable: boolean
          isbn: string | null
          previous_year: string | null
          previous_year_book_id: string | null
          program: string
          publisher: string | null
          purchasable_from_former_families: boolean | null
          reusable_status: string | null
          reuse_check_status: string | null
          reuse_match_type: string | null
          reuse_notes: string | null
          school_year: string
          subject: string | null
          title: string
          updated_at: string
        }
        Insert: {
          academic_year?: string
          author?: string | null
          column_m_raw?: string | null
          created_at?: string
          external_book_id?: string | null
          former_class_source?: string | null
          grade: string
          id?: string
          is_sellable?: boolean
          isbn?: string | null
          previous_year?: string | null
          previous_year_book_id?: string | null
          program: string
          publisher?: string | null
          purchasable_from_former_families?: boolean | null
          reusable_status?: string | null
          reuse_check_status?: string | null
          reuse_match_type?: string | null
          reuse_notes?: string | null
          school_year: string
          subject?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          academic_year?: string
          author?: string | null
          column_m_raw?: string | null
          created_at?: string
          external_book_id?: string | null
          former_class_source?: string | null
          grade?: string
          id?: string
          is_sellable?: boolean
          isbn?: string | null
          previous_year?: string | null
          previous_year_book_id?: string | null
          program?: string
          publisher?: string | null
          purchasable_from_former_families?: boolean | null
          reusable_status?: string | null
          reuse_check_status?: string | null
          reuse_match_type?: string | null
          reuse_notes?: string | null
          school_year?: string
          subject?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      book_import_rows: {
        Row: {
          author: string | null
          class_year: string | null
          column_m_raw: string | null
          created_at: string
          edition: string | null
          former_class_source: string | null
          id: string
          import_id: string
          import_status: string
          isbn: string | null
          lookup_status: string | null
          matched_previous_isbn: string | null
          notes: string | null
          previous_year_book_id: string | null
          programme: string | null
          publication_year: string | null
          publisher: string | null
          purchasable_from_former_families: boolean | null
          raw_data: Json | null
          required_optional: string | null
          reuse_check_status: string | null
          reuse_match_type: string | null
          reuse_notes: string | null
          row_number: number
          subject: string | null
          title: string | null
          updated_at: string
          validation_status: string | null
          warning_message: string | null
        }
        Insert: {
          author?: string | null
          class_year?: string | null
          column_m_raw?: string | null
          created_at?: string
          edition?: string | null
          former_class_source?: string | null
          id?: string
          import_id: string
          import_status?: string
          isbn?: string | null
          lookup_status?: string | null
          matched_previous_isbn?: string | null
          notes?: string | null
          previous_year_book_id?: string | null
          programme?: string | null
          publication_year?: string | null
          publisher?: string | null
          purchasable_from_former_families?: boolean | null
          raw_data?: Json | null
          required_optional?: string | null
          reuse_check_status?: string | null
          reuse_match_type?: string | null
          reuse_notes?: string | null
          row_number: number
          subject?: string | null
          title?: string | null
          updated_at?: string
          validation_status?: string | null
          warning_message?: string | null
        }
        Update: {
          author?: string | null
          class_year?: string | null
          column_m_raw?: string | null
          created_at?: string
          edition?: string | null
          former_class_source?: string | null
          id?: string
          import_id?: string
          import_status?: string
          isbn?: string | null
          lookup_status?: string | null
          matched_previous_isbn?: string | null
          notes?: string | null
          previous_year_book_id?: string | null
          programme?: string | null
          publication_year?: string | null
          publisher?: string | null
          purchasable_from_former_families?: boolean | null
          raw_data?: Json | null
          required_optional?: string | null
          reuse_check_status?: string | null
          reuse_match_type?: string | null
          reuse_notes?: string | null
          row_number?: number
          subject?: string | null
          title?: string | null
          updated_at?: string
          validation_status?: string | null
          warning_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_import_rows_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "book_imports"
            referencedColumns: ["id"]
          },
        ]
      }
      book_imports: {
        Row: {
          academic_year: string
          created_at: string
          failed_rows: number
          file_name: string
          id: string
          imported_rows: number
          notes: string | null
          school_year: string | null
          skipped_rows: number
          status: string
          total_rows: number
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          academic_year?: string
          created_at?: string
          failed_rows?: number
          file_name: string
          id?: string
          imported_rows?: number
          notes?: string | null
          school_year?: string | null
          skipped_rows?: number
          status?: string
          total_rows?: number
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          academic_year?: string
          created_at?: string
          failed_rows?: number
          file_name?: string
          id?: string
          imported_rows?: number
          notes?: string | null
          school_year?: string | null
          skipped_rows?: number
          status?: string
          total_rows?: number
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      bought_books: {
        Row: {
          acquisition_type: string
          book_id: string | null
          class_year: string | null
          created_at: string
          date_bought: string
          id: string
          isbn: string | null
          listing_id: string | null
          notes: string | null
          price_paid: number | null
          program: string | null
          seller_id: string | null
          seller_name: string | null
          source: string
          status: string
          subject: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          acquisition_type?: string
          book_id?: string | null
          class_year?: string | null
          created_at?: string
          date_bought?: string
          id?: string
          isbn?: string | null
          listing_id?: string | null
          notes?: string | null
          price_paid?: number | null
          program?: string | null
          seller_id?: string | null
          seller_name?: string | null
          source?: string
          status?: string
          subject?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          acquisition_type?: string
          book_id?: string | null
          class_year?: string | null
          created_at?: string
          date_bought?: string
          id?: string
          isbn?: string | null
          listing_id?: string | null
          notes?: string | null
          price_paid?: number | null
          program?: string | null
          seller_id?: string | null
          seller_name?: string | null
          source?: string
          status?: string
          subject?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bought_books_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          listing_id: string
          seller_id: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          listing_id: string
          seller_id: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          listing_id?: string
          seller_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          admin_review_note: string | null
          book_id: string | null
          class_year: string | null
          condition: Database["public"]["Enums"]["listing_condition"]
          created_at: string
          id: string
          images: string[]
          isbn: string | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          notes: string | null
          price: number
          program: string | null
          school_year: string
          seller_id: string
          status: Database["public"]["Enums"]["listing_status"]
          subject: string | null
          title: string
          updated_at: string
        }
        Insert: {
          admin_review_note?: string | null
          book_id?: string | null
          class_year?: string | null
          condition?: Database["public"]["Enums"]["listing_condition"]
          created_at?: string
          id?: string
          images?: string[]
          isbn?: string | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          notes?: string | null
          price: number
          program?: string | null
          school_year?: string
          seller_id: string
          status?: Database["public"]["Enums"]["listing_status"]
          subject?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          admin_review_note?: string | null
          book_id?: string | null
          class_year?: string | null
          condition?: Database["public"]["Enums"]["listing_condition"]
          created_at?: string
          id?: string
          images?: string[]
          isbn?: string | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          notes?: string | null
          price?: number
          program?: string | null
          school_year?: string
          seller_id?: string
          status?: Database["public"]["Enums"]["listing_status"]
          subject?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          listing_id: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          listing_id?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          listing_id?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_status: string
          admin_notes: string | null
          avatar_url: string | null
          bio: string | null
          block_reason: string | null
          blocked_at: string | null
          blocked_by: string | null
          class_year: string | null
          completed_transactions: number | null
          created_at: string
          first_name: string
          id: string
          is_from_dis: boolean | null
          last_name: string
          no_show_count: number | null
          previous_grade: string | null
          previous_program: string | null
          rating_average: number | null
          rating_count: number | null
          school: string | null
          suspension_until: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_status?: string
          admin_notes?: string | null
          avatar_url?: string | null
          bio?: string | null
          block_reason?: string | null
          blocked_at?: string | null
          blocked_by?: string | null
          class_year?: string | null
          completed_transactions?: number | null
          created_at?: string
          first_name?: string
          id?: string
          is_from_dis?: boolean | null
          last_name?: string
          no_show_count?: number | null
          previous_grade?: string | null
          previous_program?: string | null
          rating_average?: number | null
          rating_count?: number | null
          school?: string | null
          suspension_until?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_status?: string
          admin_notes?: string | null
          avatar_url?: string | null
          bio?: string | null
          block_reason?: string | null
          blocked_at?: string | null
          blocked_by?: string | null
          class_year?: string | null
          completed_transactions?: number | null
          created_at?: string
          first_name?: string
          id?: string
          is_from_dis?: boolean | null
          last_name?: string
          no_show_count?: number | null
          previous_grade?: string | null
          previous_program?: string | null
          rating_average?: number | null
          rating_count?: number | null
          school?: string | null
          suspension_until?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles_private: {
        Row: {
          created_at: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          admin_notes: string | null
          created_at: string
          description: string | null
          id: string
          reason: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          target_id: string
          target_type: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          id?: string
          reason: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          target_id: string
          target_type: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          id?: string
          reason?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          target_id?: string
          target_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          book_title: string
          buyer_confirmed_at: string | null
          buyer_id: string
          completed_at: string | null
          created_at: string
          id: string
          listing_id: string
          seller_confirmed_at: string | null
          seller_id: string
          status: string
          updated_at: string
        }
        Insert: {
          book_title: string
          buyer_confirmed_at?: string | null
          buyer_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          listing_id: string
          seller_confirmed_at?: string | null
          seller_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          book_title?: string
          buyer_confirmed_at?: string | null
          buyer_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          seller_confirmed_at?: string | null
          seller_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_moderation_log: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          id: string
          internal_note: string | null
          reason: string | null
          suspension_until: string | null
          user_id: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          id?: string
          internal_note?: string | null
          reason?: string | null
          suspension_until?: string | null
          user_id: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          id?: string
          internal_note?: string | null
          reason?: string | null
          suspension_until?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_ratings: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rated_user_id: string
          rater_id: string
          rating_type: string
          score: number
          transaction_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rated_user_id: string
          rater_id: string
          rating_type: string
          score: number
          transaction_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rated_user_id?: string
          rater_id?: string
          rating_type?: string
          score?: number
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_ratings_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
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
          role: Database["public"]["Enums"]["app_role"]
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
      wanted_books: {
        Row: {
          book_id: string
          class_year: string | null
          created_at: string
          id: string
          isbn: string | null
          note: string | null
          program: string | null
          subject: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          class_year?: string | null
          created_at?: string
          id?: string
          isbn?: string | null
          note?: string | null
          program?: string | null
          subject?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          class_year?: string | null
          created_at?: string
          id?: string
          isbn?: string | null
          note?: string | null
          program?: string | null
          subject?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_delete_listing_with_reason: {
        Args: { _listing_id: string; _reason: string }
        Returns: undefined
      }
      admin_moderate_user: {
        Args: {
          _action: string
          _internal_note?: string
          _reason: string
          _suspension_until?: string
          _user_id: string
        }
        Returns: undefined
      }
      admin_request_listing_correction: {
        Args: { _listing_id: string; _note: string }
        Returns: undefined
      }
      current_user_is_admin: { Args: never; Returns: boolean }
      get_active_listing_cards: {
        Args: { _book_ids: string[] }
        Returns: {
          book_id: string
          class_year: string
          condition: string
          created_at: string
          id: string
          images: string[]
          isbn: string
          listing_type: string
          notes: string
          price: number
          seller_completed_exchanges: number
          seller_display_name: string
          seller_id: string
          seller_rating: number
          status: string
          subject: string
          title: string
        }[]
      }
      seller_resubmit_listing: {
        Args: { _listing_id: string }
        Returns: undefined
      }
    }
    Enums: {
      amazon_link_status: "coming_soon" | "available" | "not_available"
      app_role: "admin" | "moderator" | "user"
      listing_condition: "new" | "like_new" | "good" | "fair" | "poor"
      listing_status:
        | "active"
        | "sold"
        | "reserved"
        | "archived"
        | "pending_review"
        | "needs_correction"
      listing_type: "sale" | "exchange" | "donation"
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
      amazon_link_status: ["coming_soon", "available", "not_available"],
      app_role: ["admin", "moderator", "user"],
      listing_condition: ["new", "like_new", "good", "fair", "poor"],
      listing_status: [
        "active",
        "sold",
        "reserved",
        "archived",
        "pending_review",
        "needs_correction",
      ],
      listing_type: ["sale", "exchange", "donation"],
    },
  },
} as const

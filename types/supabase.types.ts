export type Json = { [key: string]: any } | any

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      tbl_document_versions: {
        Row: {
          document_id: string
          document_version: number
          file_type: string | null
          is_active: boolean
          org_id: string
          page_count: number | null
          source_path: string
          source_type: string
          thumbnail_image: string | null
          token: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          document_id: string
          document_version?: number
          file_type?: string | null
          is_active?: boolean
          org_id?: string
          page_count?: number | null
          source_path: string
          source_type?: string
          thumbnail_image?: string | null
          token?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          document_id?: string
          document_version?: number
          file_type?: string | null
          is_active?: boolean
          org_id?: string
          page_count?: number | null
          source_path?: string
          source_type?: string
          thumbnail_image?: string | null
          token?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_tbl_document_versions_document_id_org_id_fkey"
            columns: ["document_id", "org_id"]
            isOneToOne: false
            referencedRelation: "tbl_documents"
            referencedColumns: ["document_id", "org_id"]
          },
          {
            foreignKeyName: "public_tbl_document_versions_document_id_org_id_fkey"
            columns: ["document_id", "org_id"]
            isOneToOne: false
            referencedRelation: "view_documents"
            referencedColumns: ["document_id", "org_id"]
          },
        ]
      }
      tbl_documents: {
        Row: {
          created_at: string
          custom_image: string | null
          document_id: string
          document_name: string
          is_enabled: boolean
          org_id: string
        }
        Insert: {
          created_at?: string
          custom_image?: string | null
          document_id?: string
          document_name: string
          is_enabled?: boolean
          org_id: string
        }
        Update: {
          created_at?: string
          custom_image?: string | null
          document_id?: string
          document_name?: string
          is_enabled?: boolean
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tbl_documents_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "tbl_org"
            referencedColumns: ["org_id"]
          },
        ]
      }
      tbl_links: {
        Row: {
          created_at: string | null
          document_id: string
          expiration_date: string | null
          is_active: boolean
          is_domain_restricted: boolean
          is_download_allowed: boolean
          is_email_required: boolean
          is_expiration_enabled: boolean
          is_password_required: boolean
          is_verification_required: boolean
          is_watermarked: boolean
          link_id: string
          link_name: string
          link_password: string | null
          org_id: string
          restricted_domains: string | null
        }
        Insert: {
          created_at?: string | null
          document_id: string
          expiration_date?: string | null
          is_active?: boolean
          is_domain_restricted?: boolean
          is_download_allowed?: boolean
          is_email_required?: boolean
          is_expiration_enabled?: boolean
          is_password_required?: boolean
          is_verification_required?: boolean
          is_watermarked?: boolean
          link_id?: string
          link_name: string
          link_password?: string | null
          org_id: string
          restricted_domains?: string | null
        }
        Update: {
          created_at?: string | null
          document_id?: string
          expiration_date?: string | null
          is_active?: boolean
          is_domain_restricted?: boolean
          is_download_allowed?: boolean
          is_email_required?: boolean
          is_expiration_enabled?: boolean
          is_password_required?: boolean
          is_verification_required?: boolean
          is_watermarked?: boolean
          link_id?: string
          link_name?: string
          link_password?: string | null
          org_id?: string
          restricted_domains?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_tbl_links_document_id_org_id_fkey"
            columns: ["document_id", "org_id"]
            isOneToOne: false
            referencedRelation: "tbl_documents"
            referencedColumns: ["document_id", "org_id"]
          },
          {
            foreignKeyName: "public_tbl_links_document_id_org_id_fkey"
            columns: ["document_id", "org_id"]
            isOneToOne: false
            referencedRelation: "view_documents"
            referencedColumns: ["document_id", "org_id"]
          },
        ]
      }
      tbl_org: {
        Row: {
          created_at: string | null
          org_id: string
          org_image: string | null
          org_name: string | null
          org_plan: string | null
          stripe_customer_id: string | null
          stripe_metadata: Json | null
        }
        Insert: {
          created_at?: string | null
          org_id?: string
          org_image?: string | null
          org_name?: string | null
          org_plan?: string | null
          stripe_customer_id?: string | null
          stripe_metadata?: Json | null
        }
        Update: {
          created_at?: string | null
          org_id?: string
          org_image?: string | null
          org_name?: string | null
          org_plan?: string | null
          stripe_customer_id?: string | null
          stripe_metadata?: Json | null
        }
        Relationships: []
      }
      tbl_org_members: {
        Row: {
          created_at: string | null
          email: string
          invited_at: string | null
          invited_by: string | null
          is_active: boolean
          is_owner: boolean | null
          member_color: Database["public"]["Enums"]["enum_colors"]
          member_image: string | null
          member_name: string | null
          org_id: string
          role: Database["public"]["Enums"]["enum_member_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean
          is_owner?: boolean | null
          member_color?: Database["public"]["Enums"]["enum_colors"]
          member_image?: string | null
          member_name?: string | null
          org_id: string
          role?: Database["public"]["Enums"]["enum_member_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean
          is_owner?: boolean | null
          member_color?: Database["public"]["Enums"]["enum_colors"]
          member_image?: string | null
          member_name?: string | null
          org_id?: string
          role?: Database["public"]["Enums"]["enum_member_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_org_members_fkey_auth_users"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_org_members_fkey_tbl_org"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "tbl_org"
            referencedColumns: ["org_id"]
          },
        ]
      }
      tbl_view_logs: {
        Row: {
          document_id: string
          end_time: number
          link_id: string
          org_id: string
          page_num: number
          start_time: number
          view_id: string
          view_log_seq: number
        }
        Insert: {
          document_id: string
          end_time: number
          link_id: string
          org_id: string
          page_num?: number
          start_time: number
          view_id?: string
          view_log_seq?: number
        }
        Update: {
          document_id?: string
          end_time?: number
          link_id?: string
          org_id?: string
          page_num?: number
          start_time?: number
          view_id?: string
          view_log_seq?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_tbl_view_logs_view_id_link_id_document_id_org_id_fkey"
            columns: ["view_id", "link_id", "document_id", "org_id"]
            isOneToOne: false
            referencedRelation: "tbl_views"
            referencedColumns: ["view_id", "link_id", "document_id", "org_id"]
          },
          {
            foreignKeyName: "public_tbl_view_logs_view_id_link_id_document_id_org_id_fkey"
            columns: ["view_id", "link_id", "document_id", "org_id"]
            isOneToOne: false
            referencedRelation: "view_logs"
            referencedColumns: ["view_id", "link_id", "document_id", "org_id"]
          },
        ]
      }
      tbl_views: {
        Row: {
          document_id: string
          document_version: number | null
          geo: Json | null
          ip: string | null
          is_authorized: boolean
          link_id: string
          org_id: string
          ua: Json | null
          view_id: string
          viewed_at: string
          viewer: string
        }
        Insert: {
          document_id: string
          document_version?: number | null
          geo?: Json | null
          ip?: string | null
          is_authorized?: boolean
          link_id: string
          org_id: string
          ua?: Json | null
          view_id: string
          viewed_at?: string
          viewer?: string
        }
        Update: {
          document_id?: string
          document_version?: number | null
          geo?: Json | null
          ip?: string | null
          is_authorized?: boolean
          link_id?: string
          org_id?: string
          ua?: Json | null
          view_id?: string
          viewed_at?: string
          viewer?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_tbl_views_link_id_document_id_org_id_fkey"
            columns: ["link_id", "document_id", "org_id"]
            isOneToOne: false
            referencedRelation: "tbl_links"
            referencedColumns: ["link_id", "document_id", "org_id"]
          },
        ]
      }
    }
    Views: {
      view_documents: {
        Row: {
          active_links_count: number | null
          created_at: string | null
          custom_image: string | null
          document_id: string | null
          document_name: string | null
          document_version: number | null
          file_type: string | null
          is_active: boolean | null
          is_enabled: boolean | null
          org_id: string | null
          page_count: number | null
          source_path: string | null
          source_type: string | null
          thumbnail_image: string | null
          token: string | null
          total_links_count: number | null
          total_views_count: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_documents_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "tbl_org"
            referencedColumns: ["org_id"]
          },
        ]
      }
      view_logs: {
        Row: {
          completion: number | null
          document_id: string | null
          document_version: number | null
          duration: number | null
          geo: Json | null
          ip: string | null
          is_authorized: boolean | null
          link_id: string | null
          link_name: string | null
          org_id: string | null
          page_count: number | null
          ua: Json | null
          view_id: string | null
          view_logs: Json | null
          viewed_at: string | null
          viewer: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_tbl_views_link_id_document_id_org_id_fkey"
            columns: ["link_id", "document_id", "org_id"]
            isOneToOne: false
            referencedRelation: "tbl_links"
            referencedColumns: ["link_id", "document_id", "org_id"]
          },
        ]
      }
    }
    Functions: {
      authorize_viewer: {
        Args: {
          view_id_input: string
        }
        Returns: Json
      }
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
      gen_document_id: {
        Args: {
          size?: number
          alphabet?: string
        }
        Returns: string
      }
      gen_links_id: {
        Args: {
          alphabet?: string
        }
        Returns: string
      }
      get_document:
        | {
            Args: {
              document_id_input: string
            }
            Returns: Json
          }
        | {
            Args: {
              document_id_input: string
              org_id_input?: string
            }
            Returns: Json
          }
        | {
            Args: {
              document_id_input: string
              org_id_input?: string
            }
            Returns: Json
          }
      get_link_props: {
        Args: {
          link_id_input: string
        }
        Returns: Json
      }
      get_org: {
        Args: {
          org_id_input?: string
        }
        Returns: Json
      }
      list_org_from_user: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      upsert_document: {
        Args: {
          org_id_input: string
          document_id_input?: string
          document_name_input?: string
          source_path_input?: string
          source_type_input?: string
          file_type_input?: string
        }
        Returns: Json
      }
    }
    Enums: {
      enum_colors:
        | "#B4876E"
        | "#A5B337"
        | "#06CF9C"
        | "#25D366"
        | "#02A698"
        | "#7D9EF1"
        | "#007BFC"
        | "#5E47DE"
        | "#7F66FF"
        | "#9333EA"
        | "#FA6533"
        | "#C4532D"
        | "#DC2626"
        | "#FF2E74"
        | "#DB2777"
      enum_member_role: "admin" | "member"
      pricing_plans: "Free" | "Pro" | "Enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never



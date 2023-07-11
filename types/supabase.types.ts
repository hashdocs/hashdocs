export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
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
          created_at: string | null
          document_id: string
          document_version: number
          is_enabled: boolean
          page_count: number | null
        }
        Insert: {
          created_at?: string | null
          document_id: string
          document_version?: number
          is_enabled?: boolean
          page_count?: number | null
        }
        Update: {
          created_at?: string | null
          document_id?: string
          document_version?: number
          is_enabled?: boolean
          page_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_document_versions_document_id_fkey"
            columns: ["document_id"]
            referencedRelation: "tbl_documents"
            referencedColumns: ["document_id"]
          }
        ]
      }
      tbl_documents: {
        Row: {
          created_at: string
          created_by: string | null
          document_id: string
          document_name: string
          document_seq: number
          image: string | null
          is_enabled: boolean
          org_id: string | null
          source_path: string
          source_type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          document_id?: string
          document_name: string
          document_seq?: number
          image?: string | null
          is_enabled?: boolean
          org_id?: string | null
          source_path: string
          source_type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          document_id?: string
          document_name?: string
          document_seq?: number
          image?: string | null
          is_enabled?: boolean
          org_id?: string | null
          source_path?: string
          source_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tbl_documents_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_documents_org_id_fkey"
            columns: ["org_id"]
            referencedRelation: "tbl_org"
            referencedColumns: ["org_id"]
          }
        ]
      }
      tbl_feedback: {
        Row: {
          created_at: string | null
          feedback_seq: number
          feedback_text: string | null
          org_id: string | null
          pathname: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback_seq?: number
          feedback_text?: string | null
          org_id?: string | null
          pathname?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback_seq?: number
          feedback_text?: string | null
          org_id?: string | null
          pathname?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_feedback_org_id_fkey"
            columns: ["org_id"]
            referencedRelation: "tbl_org"
            referencedColumns: ["org_id"]
          },
          {
            foreignKeyName: "tbl_feedback_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tbl_links: {
        Row: {
          created_at: string | null
          created_by: string | null
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
          link_seq: number
          restricted_domains: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
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
          link_seq?: number
          restricted_domains?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
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
          link_seq?: number
          restricted_domains?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_links_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_links_document_id_fkey"
            columns: ["document_id"]
            referencedRelation: "tbl_documents"
            referencedColumns: ["document_id"]
          }
        ]
      }
      tbl_org: {
        Row: {
          billing_cycle_end: string | null
          billing_cycle_start: string | null
          created_at: string | null
          org_id: string
          org_name: string | null
          stripe_customer_id: string | null
          stripe_price_plan: string | null
          stripe_product_plan: Database["public"]["Enums"]["pricing_plans"]
          subscription_status: string | null
        }
        Insert: {
          billing_cycle_end?: string | null
          billing_cycle_start?: string | null
          created_at?: string | null
          org_id?: string
          org_name?: string | null
          stripe_customer_id?: string | null
          stripe_price_plan?: string | null
          stripe_product_plan?: Database["public"]["Enums"]["pricing_plans"]
          subscription_status?: string | null
        }
        Update: {
          billing_cycle_end?: string | null
          billing_cycle_start?: string | null
          created_at?: string | null
          org_id?: string
          org_name?: string | null
          stripe_customer_id?: string | null
          stripe_price_plan?: string | null
          stripe_product_plan?: Database["public"]["Enums"]["pricing_plans"]
          subscription_status?: string | null
        }
        Relationships: []
      }
      tbl_org_members: {
        Row: {
          org_id: string
          org_member_seq: number
          user_id: string
          user_role: Database["public"]["Enums"]["org_role"]
        }
        Insert: {
          org_id: string
          org_member_seq?: number
          user_id: string
          user_role?: Database["public"]["Enums"]["org_role"]
        }
        Update: {
          org_id?: string
          org_member_seq?: number
          user_id?: string
          user_role?: Database["public"]["Enums"]["org_role"]
        }
        Relationships: [
          {
            foreignKeyName: "tbl_org_members_org_id_fkey"
            columns: ["org_id"]
            referencedRelation: "tbl_org"
            referencedColumns: ["org_id"]
          },
          {
            foreignKeyName: "tbl_org_members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tbl_view_logs: {
        Row: {
          end_time: number | null
          page_num: number
          start_time: number | null
          view_id: string | null
          view_log_seq: number
        }
        Insert: {
          end_time?: number | null
          page_num?: number
          start_time?: number | null
          view_id?: string | null
          view_log_seq?: number
        }
        Update: {
          end_time?: number | null
          page_num?: number
          start_time?: number | null
          view_id?: string | null
          view_log_seq?: number
        }
        Relationships: []
      }
      tbl_views: {
        Row: {
          document_version: number | null
          geo: string | null
          ip: string | null
          is_authorized: boolean
          link_id: string | null
          ua: Json | null
          view_id: string | null
          view_seq: number
          viewed_at: string
          viewer: string
        }
        Insert: {
          document_version?: number | null
          geo?: string | null
          ip?: string | null
          is_authorized?: boolean
          link_id?: string | null
          ua?: Json | null
          view_id?: string | null
          view_seq?: number
          viewed_at?: string
          viewer?: string
        }
        Update: {
          document_version?: number | null
          geo?: string | null
          ip?: string | null
          is_authorized?: boolean
          link_id?: string | null
          ua?: Json | null
          view_id?: string | null
          view_seq?: number
          viewed_at?: string
          viewer?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authorize_viewer: {
        Args: {
          view_id_input: string
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
      gen_view_id: {
        Args: {
          link_id_input: string
        }
        Returns: string
      }
      get_documents: {
        Args: {
          document_id_input?: string
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
      get_views: {
        Args: {
          document_id_input?: string
        }
        Returns: Json
      }
      list_org_from_user: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      upsert_document: {
        Args: {
          document_id_input?: string
          document_name_input?: string
          source_path_input?: string
          source_type_input?: string
        }
        Returns: Json
      }
    }
    Enums: {
      org_role: "OWNER"
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
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
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


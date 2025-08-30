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
      blog_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          excerpt: string | null
          id: string
          published: boolean | null
          published_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          address: string
          created_at: string
          department_name: string
          email: string
          id: string
          office_hours: string
          phone: string
          program_name: string
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          department_name?: string
          email: string
          id?: string
          office_hours: string
          phone: string
          program_name?: string
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          department_name?: string
          email?: string
          id?: string
          office_hours?: string
          phone?: string
          program_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean | null
          subject?: string | null
        }
        Relationships: []
      }
      faculty_members: {
        Row: {
          created_at: string
          display_order: number | null
          email: string
          id: string
          name: string
          office: string
          phone: string
          position: string
          specialization: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          email: string
          id?: string
          name: string
          office: string
          phone: string
          position: string
          specialization: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          email?: string
          id?: string
          name?: string
          office?: string
          phone?: string
          position?: string
          specialization?: string
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          batch_year: number | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_approved: boolean
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          batch_year?: number | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_approved?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          batch_year?: number | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_approved?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_materials: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          uploader_id: string;
          file_name: string;
          file_path: string;
          file_url: string;
          file_type: string;
          file_size: number;
          title: string;
          category: string | null;
          description: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          uploader_id: string;
          file_name: string;
          file_path: string;
          file_url: string;
          file_type: string;
          file_size: number;
          title: string;
          category?: string | null;
          description?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          uploader_id?: string;
          file_name?: string;
          file_path?: string;
          file_url?: string;
          file_type?: string;
          file_size?: number;
          title?: string;
          category?: string | null;
          description?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "study_materials_uploader_id_fkey";
            columns: ["uploader_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      // New tables
      galleries: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          description: string | null;
          cover_image_url: string | null;
          is_public: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          description?: string | null;
          cover_image_url?: string | null;
          is_public?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          description?: string | null;
          cover_image_url?: string | null;
          is_public?: boolean;
        };
        Relationships: [];
      };
      photos: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          gallery_id: string;
          image_url: string;
          caption: string | null;
          order_index: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          gallery_id: string;
          image_url: string;
          caption?: string | null;
          order_index?: number | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          gallery_id?: string;
          image_url?: string;
          caption?: string | null;
          order_index?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "photos_gallery_id_fkey";
            columns: ["gallery_id"];
            isOneToOne: false;
            referencedRelation: "galleries";
            referencedColumns: ["id"];
          },
        ];
      };
      batchmates: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          graduation_year: number;
          email: string;
          phone: string | null;
          social_links: Json | null;
          profile_picture_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          graduation_year: number;
          email: string;
          phone?: string | null;
          social_links?: Json | null;
          profile_picture_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          graduation_year?: number;
          email?: string;
          phone?: string | null;
          social_links?: Json | null;
          profile_picture_url?: string | null;
        };
        Relationships: [];
      };
      social_accounts: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          platform: string;
          url: string;
          icon_name: string | null;
          display_order: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          platform: string;
          url: string;
          icon_name?: string | null;
          display_order?: number | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          platform?: string;
          url?: string;
          icon_name?: string | null;
          display_order?: number | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: "admin" | "student";
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
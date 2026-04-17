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
    PostgrestVersion: '13.0.4'
  }
  public: {
    Tables: {
      artists: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          name: string
          slug: string
          update_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          slug: string
          update_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          update_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      song_comments: {
        Row: {
          content: string
          createdAt: string
          id: string
          isDeleted: boolean
          song_id: string
          updatedAt: string
          user_id: string
        }
        Insert: {
          content: string
          createdAt?: string
          id?: string
          isDeleted?: boolean
          song_id: string
          updatedAt?: string
          user_id: string
        }
        Update: {
          content?: string
          createdAt?: string
          id?: string
          isDeleted?: boolean
          song_id?: string
          updatedAt?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'song_comments_song_fk'
            columns: ['song_id']
            isOneToOne: false
            referencedRelation: 'songs'
            referencedColumns: ['id']
          }
        ]
      }
      song_favorites: {
        Row: {
          createdAt: string
          id: string
          song_id: string
          user_id: string
        }
        Insert: {
          createdAt?: string
          id?: string
          song_id: string
          user_id: string
        }
        Update: {
          createdAt?: string
          id?: string
          song_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'song_favorites_song_fk'
            columns: ['song_id']
            isOneToOne: false
            referencedRelation: 'songs'
            referencedColumns: ['id']
          }
        ]
      }
      song_likes: {
        Row: {
          createdAt: string
          id: string
          song_id: string
          user_id: string
        }
        Insert: {
          createdAt?: string
          id?: string
          song_id: string
          user_id: string
        }
        Update: {
          createdAt?: string
          id?: string
          song_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'song_likes_song_fk'
            columns: ['song_id']
            isOneToOne: false
            referencedRelation: 'songs'
            referencedColumns: ['id']
          }
        ]
      }
      song_visits: {
        Row: {
          id: string
          ip_hash: string | null
          song_id: string
          user_id: string | null
          visitedAt: string
        }
        Insert: {
          id?: string
          ip_hash?: string | null
          song_id: string
          user_id?: string | null
          visitedAt?: string
        }
        Update: {
          id?: string
          ip_hash?: string | null
          song_id?: string
          user_id?: string | null
          visitedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: 'song_visits_song_fk'
            columns: ['song_id']
            isOneToOne: false
            referencedRelation: 'songs'
            referencedColumns: ['id']
          }
        ]
      }
      songs: {
        Row: {
          artist: string | null
          chords: string | null
          coverArt: string | null
          createdAt: string | null
          id: string
          isPublished: boolean | null
          key: string | null
          lyrics: string | null
          slug: string | null
          title: string | null
          updatedAt: string | null
          video: string | null
        }
        Insert: {
          artist?: string | null
          chords?: string | null
          coverArt?: string | null
          createdAt?: string | null
          id?: string
          isPublished?: boolean | null
          key?: string | null
          lyrics?: string | null
          slug?: string | null
          title?: string | null
          updatedAt?: string | null
          video?: string | null
        }
        Update: {
          artist?: string | null
          chords?: string | null
          coverArt?: string | null
          createdAt?: string | null
          id?: string
          isPublished?: boolean | null
          key?: string | null
          lyrics?: string | null
          slug?: string | null
          title?: string | null
          updatedAt?: string | null
          video?: string | null
        }
        Relationships: []
      }
      songs_2: {
        Row: {
          artist_id: string | null
          chords: string | null
          coverArt: string | null
          createdAt: string | null
          id: string
          isPublished: boolean | null
          key: string | null
          lyrics: string | null
          slug: string | null
          title: string | null
          updatedAt: string | null
          video: string | null
        }
        Insert: {
          artist_id?: string | null
          chords?: string | null
          coverArt?: string | null
          createdAt?: string | null
          id?: string
          isPublished?: boolean | null
          key?: string | null
          lyrics?: string | null
          slug?: string | null
          title?: string | null
          updatedAt?: string | null
          video?: string | null
        }
        Update: {
          artist_id?: string | null
          chords?: string | null
          coverArt?: string | null
          createdAt?: string | null
          id?: string
          isPublished?: boolean | null
          key?: string | null
          lyrics?: string | null
          slug?: string | null
          title?: string | null
          updatedAt?: string | null
          video?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'songs_2_artist_id_fkey'
            columns: ['artist_id']
            isOneToOne: false
            referencedRelation: 'artists'
            referencedColumns: ['id']
          }
        ]
      }
      songs_artists: {
        Row: {
          artist_id: string
          id: string
          song_id: string
        }
        Insert: {
          artist_id: string
          id?: string
          song_id: string
        }
        Update: {
          artist_id?: string
          id?: string
          song_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'songs_artists_artist_id_fkey'
            columns: ['artist_id']
            isOneToOne: false
            referencedRelation: 'artists'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'songs_artists_song_id_fkey'
            columns: ['song_id']
            isOneToOne: false
            referencedRelation: 'songs_2'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'songs_artists_song_id_fkey'
            columns: ['song_id']
            isOneToOne: false
            referencedRelation: 'songs_with_counts'
            referencedColumns: ['id']
          }
        ]
      }
      songs_requests: {
        Row: {
          adminNote: string | null
          artist: string
          id: string
          requestedAt: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          adminNote?: string | null
          artist: string
          id?: string
          requestedAt?: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          adminNote?: string | null
          artist?: string
          id?: string
          requestedAt?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          role_id: string
          user_id: string
        }
        Insert: {
          role_id: string
          user_id: string
        }
        Update: {
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_roles_role_id_fkey'
            columns: ['role_id']
            isOneToOne: false
            referencedRelation: 'roles'
            referencedColumns: ['id']
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          createdAt: string | null
          email: string
          isAdmin: boolean
          name: string | null
          role: string
          uid: string
        }
        Insert: {
          avatar_url?: string | null
          createdAt?: string | null
          email: string
          isAdmin?: boolean
          name?: string | null
          role?: string
          uid: string
        }
        Update: {
          avatar_url?: string | null
          createdAt?: string | null
          email?: string
          isAdmin?: boolean
          name?: string | null
          role?: string
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: 'users_role_fkey'
            columns: ['role']
            isOneToOne: false
            referencedRelation: 'roles'
            referencedColumns: ['name']
          }
        ]
      }
    }
    Views: {
      songs_with_counts: {
        Row: {
          artist_id: string | null
          chords: string | null
          comment_count: number | null
          coverArt: string | null
          createdAt: string | null
          favorite_count: number | null
          id: string | null
          isPublished: boolean | null
          like_count: number | null
          lyrics: string | null
          slug: string | null
          title: string | null
          updatedAt: string | null
          video: string | null
          visit_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'songs_2_artist_id_fkey'
            columns: ['artist_id']
            isOneToOne: false
            referencedRelation: 'artists'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Functions: {
      increment_song_counter: {
        Args: { field_name: string; increment_value: number; song_id: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      toggle_song_favorite: {
        Args: { p_song_id: string; p_user_id: string }
        Returns: Json
      }
      toggle_song_like: {
        Args: { p_song_id: string; p_user_id: string }
        Returns: Json
      }
      unaccent: { Args: { '': string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {}
  }
} as const

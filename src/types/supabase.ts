export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          name: string
          description: string
          phase: string
          duration: string
          difficulty: string
          prerequisites: string | null
          thumbnail: string | null
          status: string
          created_at: string
          updated_at: string
          created_by_id: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          phase: string
          duration: string
          difficulty: string
          prerequisites?: string | null
          thumbnail?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          created_by_id: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          phase?: string
          duration?: string
          difficulty?: string
          prerequisites?: string | null
          thumbnail?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          created_by_id?: string
          slug?: string
        }
      }
      // Add other table types as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 
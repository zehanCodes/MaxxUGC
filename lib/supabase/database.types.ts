// Hand-authored to match supabase/migrations/0001_init.sql.
// Regenerate with `supabase gen types typescript` once the project is linked
// to a Supabase instance and has more than the Phase 1 foundation schema.

export type UserRole = "creator" | "editor" | "admin"
export type AccountStatus = "active" | "suspended"

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: UserRole
          account_status: AccountStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: UserRole
          account_status?: AccountStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: UserRole
          account_status?: AccountStatus
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

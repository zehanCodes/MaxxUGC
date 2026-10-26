// Hand-authored to match supabase/migrations/.
// Regenerate with `supabase gen types typescript` once the project is linked
// to a Supabase instance and has more than the Phase 1 foundation schema.

export type UserRole = "creator" | "editor" | "admin"
export type AccountStatus = "active" | "suspended"
export type CampaignStatus = "active" | "paused" | "completed" | "archived"

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
      campaigns: {
        Row: {
          id: string
          creator_id: string
          name: string
          brand_name: string
          brand_logo_path: string | null
          description: string | null
          start_date: string | null
          end_date: string | null
          deliverable_quota: number | null
          guidelines: string | null
          default_instructions: string | null
          status: CampaignStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          name: string
          brand_name: string
          brand_logo_path?: string | null
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          deliverable_quota?: number | null
          guidelines?: string | null
          default_instructions?: string | null
          status?: CampaignStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          name?: string
          brand_name?: string
          brand_logo_path?: string | null
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          deliverable_quota?: number | null
          guidelines?: string | null
          default_instructions?: string | null
          status?: CampaignStatus
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

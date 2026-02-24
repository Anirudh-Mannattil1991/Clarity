import { createClient } from "@supabase/supabase-js";
import { ClaritySession } from "@/types/clarity";

export interface Database {
  public: {
    Tables: {
      clarity_sessions: {
        Row: ClaritySession;
        Insert: Omit<ClaritySession, 'id' | 'created_at'>;
        Update: Partial<Omit<ClaritySession, 'id' | 'created_at'>>;
      };
    };
  };
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

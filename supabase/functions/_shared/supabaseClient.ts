import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.26.0';
import type { Database } from '../../../types/supabase.types.ts';

export const supabase = createClient<Database>(
  // Supabase API URL - env var exported by default.
  Deno.env.get('SUPABASE_URL')!,
  // Supabase API ANON KEY - env var exported by default.
  Deno.env.get('SUPABASE_ANON_KEY')!,
  {
    auth: {
      persistSession: false,
    },
  }
);

export const supabaseAdmin = createClient<Database>(
  // Supabase API URL - env var exported by default.
  Deno.env.get('SUPABASE_URL')!,
  // Supabase API ANON KEY - env var exported by default.
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  {
    auth: {
      persistSession: false,
    },
  }
);

export type InsertPayload = {
  type: 'INSERT';
  table: string;
  schema: string;
  record: Record<string, any>;
  old_record: null;
};

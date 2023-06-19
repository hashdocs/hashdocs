import { createClient } from "supabase";
import type { Database } from "../../../types/supabase.types.ts";

export const supabase = createClient<Database>(
  // Supabase API URL - env var exported by default.
  Deno.env.get("SUPABASE_URL")!,
  // Supabase API ANON KEY - env var exported by default.
  Deno.env.get("SUPABASE_ANON_KEY")!
);

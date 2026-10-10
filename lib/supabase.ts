import { createClient } from "@supabase/supabase-js";

// Shares the main prospera-website Supabase project — same data, same
// tables. This project only ever gets the anon/publishable key (safe for
// client-side code, governed by RLS). The service-role key stays in
// prospera-website only — this project never needs it, since anything
// requiring elevated access belongs in the main site's API, not here.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
let client: SupabaseClient | null = null;
export function getSupabase() {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url?.startsWith("https://") || !key) return null;
  if(!client) client=createClient(url,key,{auth:{storageKey:"prospera-rent-auth",persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  return client;
}

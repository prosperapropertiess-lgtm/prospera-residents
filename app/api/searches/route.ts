import { createClient } from "@supabase/supabase-js";
import { validateProfile } from "@/lib/search";
async function authenticated(request: Request) {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const token=request.headers.get("authorization")?.replace(/^Bearer /,"");
  if(!url || !key || !token) return null;
  const db=createClient(url,key,{global:{headers:{Authorization:`Bearer ${token}`}},auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error}=await db.auth.getUser(token);
  if(error || !data.user?.email_confirmed_at) return null;
  return {db,user:data.user};
}
export async function GET(request: Request) {
  try { const auth=await authenticated(request); if(!auth) return Response.json({error:"Please confirm your email to manage your search."},{status:401});
    const {data,error}=await auth.db.from("rent_searches").select("preferences,status,confirmed_at").eq("user_id",auth.user.id).maybeSingle();
    if(error) return Response.json({error:"Saved searches are unavailable right now. Your draft is still on this device."},{status:503});
    return Response.json({search:data},{headers:{"Cache-Control":"no-store"}});
  } catch { return Response.json({error:"Saved searches couldn’t be loaded."},{status:503}); }
}
export async function POST(request: Request) {
  if(request.headers.get("origin") && request.headers.get("origin")!==new URL(request.url).origin) return Response.json({error:"Submit from this website."},{status:403});
  try { const auth=await authenticated(request); if(!auth) return Response.json({error:"Please confirm your email before saving."},{status:401});
    const text=await request.text(); if(text.length>10000) return Response.json({error:"Please shorten your notes."},{status:400});
    const body=JSON.parse(text);
    if(!validateProfile(body.preferences) || !["active","paused","closed"].includes(body.status) || typeof body.source!=="string" || body.source.length>200) return Response.json({error:"Check your preferences before saving."},{status:400});
    const {data,error}=await auth.db.from("rent_searches").upsert({user_id:auth.user.id,preferences:body.preferences,status:body.status,source:body.source,confirmed_at:new Date().toISOString()},{onConflict:"user_id"}).select("status,confirmed_at").single();
    if(error || !data) return Response.json({error:"Your search wasn’t saved. Please try again; your draft is still on this device."},{status:503});
    return Response.json({saved:true,...data},{headers:{"Cache-Control":"no-store"}});
  } catch { return Response.json({error:"Your search wasn’t saved. Your draft is still on this device."},{status:503}); }
}

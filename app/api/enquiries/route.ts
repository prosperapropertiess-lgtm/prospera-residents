import { randomUUID } from "node:crypto";
import { fetchInventory } from "@/lib/inventory";
export async function POST(request: Request) {
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error:"Please submit from this website." },{ status:403 });
  try {
    const text = await request.text();
    if (text.length > 9000) return Response.json({ error:"Your message is too long." },{ status:400 });
    const b = JSON.parse(text);
    if (!b || typeof b !== "object" || typeof b.name !== "string" || !b.name.trim() || b.name.length > 100 || typeof b.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) || b.email.length > 254 || typeof b.message !== "string" || !b.message.trim() || b.message.length > 3000 || (b.phone && (typeof b.phone !== "string" || b.phone.length > 40)) || b.website || !["question","viewing"].includes(b.kind)) return Response.json({ error:"Check your name, email and message, then try again." },{ status:400 });
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if(!url || !key) return Response.json({error:"Online requests are unavailable. Please contact the team by phone or email."},{status:503});
    let property = ""; let city = null;
    if (b.propertyId) { const inventory = await fetchInventory(); const p = inventory.properties.find(x => x.id === b.propertyId); if (inventory.error || !p || !p.available) return Response.json({error:"We couldn’t confirm this home’s current listing. Please contact the team directly."},{status:409}); property = `${p.title} (${p.id})`; city=p.city; }
    const id=randomUUID();
    const result = await fetch(`${url}/rest/v1/leads`, { method:"POST",headers:{apikey:key,Authorization:`Bearer ${key}`,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({id,name:b.name.trim(),email:b.email.trim().toLowerCase(),phone:b.phone || null,city,message:`${b.kind === "viewing" ? "VIEWING REQUEST — appointment not confirmed" : "RENTER QUESTION"}\n${property ? `Home: ${property}\n` : ""}${b.message.trim()}`,type:"tenant",property:property || null,source:"prospera-rent"}),signal:AbortSignal.timeout(10000) });
    if (!result.ok) return Response.json({error:"Your request wasn’t saved. Please try again or contact the team directly."},{status:503});
    return Response.json({id},{status:201});
  } catch { return Response.json({error:"Your request couldn’t be completed. Your inputs are still here."},{status:400}); }
}

export type Property = {
  id: string; slug: string; title: string; address: string; city: string;
  price: number | null; bedrooms: number | null; bathrooms: number | null;
  images: string[]; available: boolean; status: string; property_type: string | null;
  available_date: string | null; parking: boolean | null; parking_type: string | null;
  laundry_type: string | null; utilities_included: boolean | null; utilities_list: string[];
  description: string; heating_type: string | null; ac: boolean | null; outdoor_space: string | null;
  storage: boolean | null; wheelchair_accessible: boolean | null; is_managed: boolean | null;
  lease_term: string | null; floor_plan_url: string | null; virtual_tour_url: string | null;
};
export type Inventory = { properties: Property[]; error?: string };
export const cities = ["London", "Strathroy", "St. Thomas"];
export const propertyTypes = ["apartment", "house", "condo", "townhouse", "duplex", "triplex", "other"];
export const features = ["Parking", "In-unit laundry", "Outdoor space", "Step-free access"];
const publicFields = "id,slug,title,address,city,price,bedrooms,bathrooms,images,available,status,property_type,available_date,parking,parking_type,laundry_type,utilities_included,utilities_list,description,heating_type,ac,outdoor_space,storage,wheelchair_accessible,is_managed,lease_term,floor_plan_url,virtual_tour_url";
export function safeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password ? url.href : null; } catch { return null; }
}
export function normalizeProperty(row: Record<string, unknown>): Property {
  const str = (key: string) => typeof row[key] === "string" ? row[key] as string : null;
  const num = (key: string) => typeof row[key] === "number" && Number.isFinite(row[key]) ? row[key] as number : null;
  const bool = (key: string) => typeof row[key] === "boolean" ? row[key] as boolean : null;
  return {
    id: str("id") || "", slug: str("slug") || str("id") || "", title: str("title") || str("address") || "Rental home",
    address: str("address") || "Address to confirm", city: str("city") || "Location to confirm",
    price: num("price"), bedrooms: num("bedrooms"), bathrooms: num("bathrooms"),
    images: Array.isArray(row.images) ? row.images.map(safeUrl).filter((x): x is string => !!x) : [],
    available: row.available === true && row.status === "published", status: str("status") || "unknown",
    property_type: str("property_type"), available_date: str("available_date"), parking: bool("parking"),
    parking_type: str("parking_type"), laundry_type: str("laundry_type"), utilities_included: bool("utilities_included"),
    utilities_list: Array.isArray(row.utilities_list) ? row.utilities_list.filter((x): x is string => typeof x === "string") : [],
    description: str("description") || "", heating_type: str("heating_type"), ac: bool("ac"), outdoor_space: str("outdoor_space"),
    storage: bool("storage"), wheelchair_accessible: bool("wheelchair_accessible"), is_managed: bool("is_managed"),
    lease_term: str("lease_term"), floor_plan_url: safeUrl(row.floor_plan_url), virtual_tour_url: safeUrl(row.virtual_tour_url),
  };
}
export async function fetchInventory(): Promise<Inventory> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url?.startsWith("https://") || !key) return { properties: [], error: "Homes can’t be loaded right now." };
  try {
    const query = new URLSearchParams({ select: publicFields, status: "in.(published,rented)", is_managed: "eq.true", order: "created_at.desc", limit: "200" });
    const response = await fetch(`${url}/rest/v1/properties?${query}`, { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Inventory unavailable");
    const rows: unknown = await response.json();
    if (!Array.isArray(rows)) throw new Error("Invalid inventory");
    return { properties: rows.filter((r): r is Record<string, unknown> => !!r && typeof r === "object" && typeof r.id === "string").map(normalizeProperty) };
  } catch { return { properties: [], error: "We couldn’t load current availability. Please try again or ask our team." }; }
}
export function money(value: number | null) { return value === null ? "Rent to confirm" : new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(value); }
export function dateLabel(value: string | null) { if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Move-in date to confirm"; return new Date(`${value}T12:00:00Z`).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }); }
export function utilitiesLabel(p: Property) { return p.utilities_list.length ? `${p.utilities_list.join(", ")} included` : p.utilities_included === true ? "Utilities included · details to confirm" : p.utilities_included === false ? "Utilities extra · costs to confirm" : "Utility arrangements to confirm"; }
export function hasFeature(p: Property, feature: string) {
  return feature === "Parking" ? p.parking === true : feature === "In-unit laundry" ? p.laundry_type === "in-unit" : feature === "Outdoor space" ? !!p.outdoor_space && p.outdoor_space !== "none" : feature === "Step-free access" ? p.wheelchair_accessible === true : false;
}
export type Filters = { city?: string; budget?: string; beds?: string; type?: string; date?: string; features?: string[] };
export function filterProperties(properties: Property[], f: Filters) {
  return properties.filter(p => p.available && (!f.city || p.city === f.city) && (!f.budget || (p.price !== null && p.price <= Number(f.budget))) && (!f.beds || (p.bedrooms !== null && (f.beds === "4+" ? p.bedrooms >= 4 : p.bedrooms === Number(f.beds)))) && (!f.type || p.property_type === f.type) && (!f.date || (!!p.available_date && p.available_date <= f.date)) && (!f.features?.length || f.features.every(x => hasFeature(p,x))));
}

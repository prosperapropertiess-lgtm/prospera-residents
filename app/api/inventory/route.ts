import { fetchInventory } from "@/lib/inventory";
export async function GET() {
  const inventory = await fetchInventory();
  return Response.json(inventory, { status: inventory.error ? 503 : 200, headers: { "Cache-Control": "no-store" } });
}

import { Suspense } from "react";
import { fetchInventory } from "@/lib/inventory";
import { PropertyDetail } from "@/components/property-detail";
async function Content({params}: {params: Promise<{slug:string}>}) { const {slug}=await params; const inventory=await fetchInventory(); return <PropertyDetail slug={slug} initialInventory={inventory} />; }
export default function PropertyPage(props: {params: Promise<{slug:string}>}) { return <Suspense fallback={<main id="main" className="container page-content"><div className="page-intro"><h1>Loading the home…</h1></div></main>}><Content {...props} /></Suspense>; }

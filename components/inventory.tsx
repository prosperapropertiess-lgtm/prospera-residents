"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cities, dateLabel, features, filterProperties, money, propertyTypes, utilitiesLabel, type Filters, type Inventory, type Property } from "@/lib/inventory";
import { Arrow } from "./site-shell";

export function useInventory(initial?: Inventory) {
  const [data, setData] = useState<Inventory | null>(initial ?? null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (initial && attempt === 0) return;
    const controller = new AbortController();
    fetch("/api/inventory", { signal: controller.signal }).then(r => r.json()).then(setData).catch(e => { if (e.name !== "AbortError") setData({ properties: [], error: "Current homes couldn’t be loaded. Please try again." }); });
    return () => controller.abort();
  }, [attempt, initial]);
  return { data, retry: () => { setData(null); setAttempt(x => x + 1); } };
}
export function PropertyCard({ property: p, query = "" }: { property: Property; query?: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  return <Link className="property-card" onClick={() => { if(window.location.pathname === "/listings") { try { sessionStorage.setItem(`prospera-scroll:${query}`,String(window.scrollY)); } catch {} } }} href={`/listings/${encodeURIComponent(p.slug)}${query ? `?from=${encodeURIComponent(query)}` : ""}`}><div className="property-photo">{p.images[0] && !imageFailed ? <Image src={p.images[0]} alt={p.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw" unoptimized onError={() => setImageFailed(true)} /> : <div className="photo-missing"><span aria-hidden="true">⌂</span>Photography to follow</div>}<span className="photo-status">{p.available ? "Available" : "Leased"}</span><span className="photo-arrow"><Arrow diagonal /></span></div><div className="property-copy"><div className="property-topline"><span>{p.city}</span><span>{p.property_type || "Rental home"}</span></div><h3>{p.title}</h3><div className="property-price">{money(p.price)}{p.price !== null && <small> / month</small>}</div><p className="utility-label">{utilitiesLabel(p)}</p><p className="property-facts">{p.bedrooms === 0 ? "Studio" : `${p.bedrooms ?? "?"} bed`}<span />{p.bathrooms ?? "?"} bath<span />{p.parking === true ? "Parking listed" : p.parking === false ? "No parking listed" : "Parking to confirm"}</p><div className="property-bottom"><span>{dateLabel(p.available_date)}</span><span>{p.laundry_type === "in-unit" ? "In-unit laundry" : p.outdoor_space && p.outdoor_space !== "none" ? p.outdoor_space : "View details"}</span></div></div></Link>;
}
function LoadingHomes() { return <div role="status" aria-label="Loading current homes" className="loading-grid"><div className="loading-block" /><div className="loading-block" /><div className="loading-block" /><span className="visually-hidden">Loading current homes…</span></div>; }
export function HomeInventory() {
  const { data, retry } = useInventory();
  if (!data) return <LoadingHomes />;
  const available = data.properties.filter(p => p.available).slice(0,3);
  if (data.error || !available.length) return <div className="empty-state"><div><p className="eyebrow">YOUR NEXT STEP STILL STARTS HERE</p><h3>{data.error ? "Let’s check what’s available." : "No available homes to show today."}</h3><p>{data.error || "Our inventory is small and changes over time. You can start with your preferences, explore a useful guide, or ask our team about your plans."}</p>{data.error && <button className="text-link" onClick={retry}>Try loading homes again <Arrow /></button>}</div><Link className="button secondary" href="/alerts">Start my search <Arrow /></Link></div>;
  return <div className={`property-grid count-${available.length}`}>{available.map(p => <PropertyCard key={p.id} property={p} />)}</div>;
}
export function ListingsExplorer() {
  const { data, retry } = useInventory();
  const [filters, setFilters] = useState<Filters>({});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const read = () => { const q = new URLSearchParams(window.location.search); setFilters({ city:q.get("city") || "", budget:q.get("budget") || "", beds:q.get("beds") || "", type:q.get("type") || "", date:q.get("date") || "", features:q.getAll("feature") }); setReady(true); };
    read(); window.addEventListener("popstate", read); return () => window.removeEventListener("popstate", read);
  }, []);
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) { if (Array.isArray(value)) value.forEach(v => query.append("feature",v)); else if (value) query.set(key,value); }
  function update(next: Filters) { setFilters(next); const q = new URLSearchParams(); for (const [k,v] of Object.entries(next)) { if (Array.isArray(v)) v.forEach(x => q.append("feature",x)); else if(v) q.set(k,v); } window.history.replaceState(null,"",`/listings${q.size ? `?${q}` : ""}`); }
  const homes = data ? filterProperties(data.properties, filters) : [];
  const queryString=query.toString();
  useEffect(() => { if(!data || !ready) return; try { const saved=sessionStorage.getItem(`prospera-scroll:${queryString}`); if(saved) { window.scrollTo({top:Number(saved),behavior:"instant"}); sessionStorage.removeItem(`prospera-scroll:${queryString}`); } } catch {} }, [data,ready,queryString]);
  return <><form className="filter-bar" onSubmit={e => e.preventDefault()}><label className="field">Location<select value={filters.city || ""} onChange={e => update({...filters,city:e.target.value})}><option value="">All service areas</option>{cities.map(c => <option key={c}>{c}</option>)}</select></label><label className="field">Maximum base rent<input aria-label="Maximum base rent" type="number" min="0" step="50" placeholder="No maximum" value={filters.budget || ""} onChange={e => update({...filters,budget:e.target.value})} /></label><label className="field">Bedrooms<select value={filters.beds || ""} onChange={e => update({...filters,beds:e.target.value})}><option value="">Any</option><option value="0">Studio</option>{["1","2","3","4+"].map(v => <option key={v}>{v}</option>)}</select></label><details className="more-filters"><summary>More filters <span>+</span></summary><div className="filter-details"><label className="field">Home type<select value={filters.type || ""} onChange={e => update({...filters,type:e.target.value})}><option value="">Any type</option>{propertyTypes.map(t => <option key={t}>{t}</option>)}</select></label><label className="field">Available on or before<input type="date" value={filters.date || ""} onChange={e => update({...filters,date:e.target.value})} /></label><p className="fine-print">An earlier listing date does not confirm the home can be held for a future move.</p>{features.map(f => <label className="check-row" key={f}><input type="checkbox" checked={filters.features?.includes(f) || false} onChange={e => update({...filters,features:e.target.checked ? [...filters.features || [],f] : filters.features?.filter(x => x !== f)})} />{f}</label>)}</div></details></form><div className="results-heading" aria-live="polite"><p>{!data || !ready ? "Checking current homes…" : data.error ? "Availability could not be checked" : `${homes.length} available ${homes.length === 1 ? "home" : "homes"}`}</p><button className="text-link" onClick={() => update({})}>Clear filters</button></div>{!data || !ready ? <LoadingHomes /> : data.error ? <div className="empty-state"><div><h3>We couldn’t check availability.</h3><p>{data.error} Your filters are still here.</p></div><button className="button secondary" onClick={retry}>Try again <Arrow /></button></div> : homes.length ? <div className="property-grid">{homes.map(p => <PropertyCard key={p.id} property={p} query={query.toString()} />)}</div> : <div className="empty-state"><div><h3>Nothing fits these filters today.</h3><p>Your budget and essentials haven’t changed. You can adjust a filter, keep your preferences, or speak with our team.</p><button className="text-link" onClick={() => update({...filters,features:[]})}>Try without feature filters <Arrow /></button></div><Link href={`/alerts?${query}`} className="button">Keep my preferences <Arrow /></Link></div>}<div className="notice inventory-note">Availability is taken from Prospera’s published listings. Please confirm the date and details with the team before travelling. A listing is not a reservation.</div></>;
}

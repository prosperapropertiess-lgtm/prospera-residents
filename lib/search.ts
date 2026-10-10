import { cities, features, hasFeature, propertyTypes, type Property } from "./inventory";
export type SearchProfile = {
  timing: string; moveFrom: string; moveTo: string; flexible: boolean; cities: string[]; areas: string;
  budget: string; beds: string; types: string[]; required: string[]; preferred: string[];
  stage: string; name: string; notes: string; alerts: boolean; newsletter: boolean; frequency: string;
};
export const emptyProfile: SearchProfile = {timing:"",moveFrom:"",moveTo:"",flexible:false,cities:[],areas:"",budget:"",beds:"",types:[],required:[],preferred:[],stage:"planning",name:"",notes:"",alerts:false,newsletter:false,frequency:"weekly"};
export function isISODate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed=new Date(`${value}T12:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0,10)===value;
}
export function validateProfile(value: unknown): value is SearchProfile {
  if(!value || typeof value !== "object") return false;
  const v = value as SearchProfile;
  const strings = ["timing","moveFrom","moveTo","areas","budget","beds","stage","name","notes","frequency"] as const;
  if(strings.some(k => typeof v[k] !== "string")) return false;
  if(!["soon","1-3","3-6","unsure","dates"].includes(v.timing) || !["ready","browsing","planning"].includes(v.stage) || !["weekly","monthly"].includes(v.frequency)) return false;
  if(!v.name.trim() || v.name.length>100 || v.areas.length>300 || v.notes.length>1200 || !/^\d{1,6}$/.test(v.budget) || Number(v.budget)<=0 || !["any","0","1","2","3","4+"].includes(v.beds)) return false;
  if(["flexible","alerts","newsletter"].some(k => typeof v[k as keyof SearchProfile] !== "boolean")) return false;
  if(!Array.isArray(v.cities) || !v.cities.length || v.cities.length>3 || v.cities.some(x=>!cities.includes(x))) return false;
  if(!Array.isArray(v.types) || v.types.length>7 || v.types.some(x=>!propertyTypes.includes(x))) return false;
  if([v.required,v.preferred].some(list=>!Array.isArray(list) || list.length>4 || list.some(x=>!features.includes(x)))) return false;
  if(v.required.some(x=>v.preferred.includes(x))) return false;
  if(v.timing!=="unsure" && (!isISODate(v.moveFrom) || !isISODate(v.moveTo) || v.moveFrom>v.moveTo)) return false;
  return true;
}
export function timingWindow(timing: string, now = new Date()) {
  const day = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const addMonths=(count:number)=>{const d=new Date(now);const original=d.getDate();d.setDate(1);d.setMonth(d.getMonth()+count);d.setDate(Math.min(original,new Date(d.getFullYear(),d.getMonth()+1,0).getDate()));return d;};
  let from=new Date(now),to=new Date(now);
  if(timing === "soon") to=addMonths(1);
  else if(timing === "1-3") {from=addMonths(1);to=addMonths(3);}
  else if(timing === "3-6") {from=addMonths(3);to=addMonths(6);}
  else return {moveFrom:"",moveTo:""};
  return {moveFrom:day(from),moveTo:day(to)};
}
export function matchingHomes(properties: Property[], profile: SearchProfile, today=new Date().toLocaleDateString("en-CA",{timeZone:"America/Toronto"})) {
  return properties.filter(p => {
    // A still-published available home with a past start date is available now,
    // but an early start never implies it can be held for a future search window.
    const date=p.available_date && isISODate(p.available_date) ? (p.available_date<today?today:p.available_date) : null;
    return p.available && profile.cities.includes(p.city) && p.price !== null && p.price <= Number(profile.budget) && (profile.beds === "any" || (p.bedrooms !== null && (profile.beds === "4+" ? p.bedrooms>=4 : p.bedrooms === Number(profile.beds)))) && (!profile.types.length || profile.types.includes(p.property_type || "")) && profile.required.every(f=>hasFeature(p,f)) && (profile.timing === "unsure" || (!!date && (profile.flexible ? date <= profile.moveTo : date>=profile.moveFrom && date<=profile.moveTo)));
  }).sort((a,b)=>profile.preferred.filter(f=>hasFeature(b,f)).length-profile.preferred.filter(f=>hasFeature(a,f)).length);
}

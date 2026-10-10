import type { Metadata } from "next";
import { SearchFlow } from "@/components/search-flow";
export const metadata: Metadata = {title:"Find my next home",robots:{index:false,follow:true}};
export default function Alerts(){return <main id="main"><SearchFlow /></main>;}

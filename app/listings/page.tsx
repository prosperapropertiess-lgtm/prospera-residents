import type { Metadata } from "next";
import { ListingsExplorer } from "@/components/inventory";
export const metadata: Metadata = { title: "Available homes" };
export default function Listings() { return <main id="main" className="container page-content"><div className="page-intro"><p className="eyebrow">SPACE FOR YOUR EVERYDAY</p><h1>Find a place<br /><span>that feels like you.</span></h1><p>Explore Prospera’s published homes in London, Strathroy and St. Thomas. Start with what matters to you.</p></div><ListingsExplorer /></main>; }

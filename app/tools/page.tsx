import type { Metadata } from "next";
import { Suspense } from "react";
import { MovingTools } from "@/components/moving-tools";
export const metadata:Metadata={title:"Practical moving tools"};
export default function Tools(){return <main id="main" className="container page-content"><div className="page-intro"><p className="eyebrow">A LITTLE STRUCTURE. A CLEARER MOVE.</p><h1>Make a plan.<br /><span>Leave room for life.</span></h1><p>A monthly cost worksheet and practical checklists. Yours to use, keep and share—wherever you find a home.</p></div><Suspense fallback={<p role="status">Getting your tools ready…</p>}><MovingTools /></Suspense></main>;}

import type { Metadata } from "next";
import Link from "next/link";
import { GuideLibrary } from "@/components/guide-library";
import { Arrow } from "@/components/site-shell";
export const metadata:Metadata={title:"The renter guide"};
export default function Guide(){return <main id="main" className="container page-content"><div className="page-intro guide-intro"><div><p className="eyebrow">A LITTLE KNOWLEDGE GOES A LONG WAY</p><h1>Your next move.<br /><span>A clearer picture.</span></h1><p>Practical guides for finding, choosing and settling into a home. Useful wherever you end up renting.</p></div><Link href="/tools" className="guide-tool-callout"><span className="eyebrow">MAKE IT PRACTICAL</span><h3>Good plans<br />start on paper.</h3><p>Cost worksheet and moving checklists.</p><Arrow diagonal /></Link></div><GuideLibrary /><div className="resource-footnote"><p>Prepared by Prospera Rent · Editorial review: October 10, 2026</p><p>For questions about your rights or agreement, use the current official resources linked in each guide.</p></div></main>;}

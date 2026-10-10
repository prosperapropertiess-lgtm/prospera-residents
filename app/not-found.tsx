import Link from "next/link";
import { Arrow } from "@/components/site-shell";
export default function NotFound(){return <main id="main" className="container page-content"><div className="page-intro"><p className="eyebrow">A SMALL DETOUR / 404</p><h1>Let’s get you<br /><span>back on your way.</span></h1><p>That page isn’t here. Your next move still has a starting point.</p></div><div className="link-row"><Link href="/rent" className="button">Back to Prospera Rent <Arrow /></Link><Link href="/listings" className="button secondary">Available homes</Link></div></main>;}

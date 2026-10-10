"use client";
import Link from "next/link";
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main" className="container page-content"><div className="page-intro"><p className="eyebrow">LET’S TRY THAT AGAIN</p><h1>This page hit<br /><span>a small interruption.</span></h1><p>We couldn’t finish loading it. Try again, or contact the team if you need a hand.</p></div><div className="link-row"><button className="button" onClick={reset}>Try again</button><Link href="/help" className="button secondary">Get help</Link></div></main>;}

"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

const links = [["How we help", "/rent#how-it-works"], ["Available homes", "/listings"], ["Renter guide", "/guide"], ["Get help", "/help"]];
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{diagonal ? <path d="M5 19 19 5M5 5h14v14" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}</svg>;
}
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const scroll = () => setCompact(window.scrollY > 24);
    scroll(); window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  return <header className={`site-header ${compact ? "compact" : ""}`}><div className="header-inner">
    <Link href="/rent" className="brand" aria-label="Prospera Rent home" onClick={() => setOpen(false)}><Image src="/logo.png" alt="" width={48} height={46} priority /><span>prospera<span className="brand-rent">rent</span><small>BY PROSPERA PROPERTIES</small></span></Link>
    <Suspense fallback={<DesktopLinks />}><ActiveLinks /></Suspense>
    <Link href="/alerts" className="button small header-cta">Find my next home <Arrow /></Link>
    <button ref={menuButton} className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}<span aria-hidden="true">{open ? "×" : "☰"}</span></button>
  </div>{open && <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation" onKeyDown={e => { if (e.key === "Escape") { setOpen(false); menuButton.current?.focus(); } }}>{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}<Arrow /></Link>)}<Link href="/alerts" onClick={() => setOpen(false)}>Find my next home <Arrow /></Link><Link href="/tenants" onClick={() => setOpen(false)}>Already renting with us?</Link></nav>}</header>;
}
function DesktopLinks({path}: {path?: string}) {
  return <nav aria-label="Main navigation" className="desktop-nav">{links.map(([label,href]) => <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>{label}</Link>)}</nav>;
}
function ActiveLinks() { const path=usePathname(); return <DesktopLinks path={path} />; }
export function SiteFooter() {
  return <footer className="site-footer"><div className="container"><div className="resident-strip"><span>Already at home with Prospera?</span><Link href="/tenants">Resident help <Arrow /></Link></div><div className="footer-main"><div><Link href="/rent" className="footer-wordmark">prospera<span>rent</span></Link><p>A little local knowledge.<br />A more considered move.</p><span className="eyebrow">LONDON · STRATHROY · ST. THOMAS</span></div><div><h3>Your next move</h3><Link href="/alerts">Find my next home</Link><Link href="/listings">Available homes</Link><Link href="/guide">Renter guide</Link><Link href="/tools">Moving tools</Link></div><div><h3>Let’s talk</h3><a href="tel:+15196971227">(519) 697-1227</a><a href="mailto:hello@prosperaproperties.co">hello@prosperaproperties.co</a><Link href="/help">Contact the team</Link><a href="https://www.prosperaproperties.co/landlords">For property owners ↗</a></div></div><div className="footer-bottom"><p>© 2026 Prospera Properties.</p><p>We manage and lease homes for property owners. Search coverage is limited to Prospera’s published inventory.</p><a href="https://www.prosperaproperties.co/privacy">Privacy</a></div></div></footer>;
}

"use client";
import Link from "next/link";
import { useState } from "react";
import { guides, guideTasks } from "@/lib/guides";
import { Arrow } from "./site-shell";
export function GuideLibrary(){
  const [task,setTask]=useState("All guides");
  const filtered=guides.filter(g=>task==="All guides"||g.task===task||(task==="Moving again"&&g.slug==="living-and-moving-again"));
  return <><div className="guide-task-nav" role="group" aria-label="Choose a renter task">{["All guides",...guideTasks].map(t=><button key={t} aria-pressed={task===t} onClick={()=>setTask(t)}>{t}</button>)}</div><div className="guide-library" aria-live="polite">{filtered.map((guide,i)=><Link key={guide.slug} href={`/guide/${guide.slug}`} className={`guide-library-entry ${i===0?"featured-guide":""}`}><div className="guide-cover" aria-hidden="true"><span>THE RENTER GUIDE</span><strong>{guide.task==="Budgeting for the move"?"$":guide.task==="Moving in"?"⌂":guide.task==="Choosing an area"?"↗":"+"}</strong><span>PROSPERA RENT / 0{guides.indexOf(guide)+1}</span></div><div className="guide-entry-copy"><p className="eyebrow">{guide.task} · {guide.minutes} MIN READ</p><h2>{guide.title}</h2><p>{guide.intro}</p><span className="text-link">Read the guide <Arrow /></span></div></Link>)}</div></>;
}

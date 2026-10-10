"use client";
import Image from "next/image";
import { useRef, useState } from "react";
export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const startX = useRef(0);
  const available = images.filter(x => !failed.includes(x));
  const active = available.length ? index % available.length : 0;
  function next(delta: number) { setIndex(i => (i + delta + available.length) % available.length); }
  if (!available.length) return <div className="gallery-empty"><span aria-hidden="true">⌂</span><h2>Photography to follow.</h2><p>Ask the team for current photos before planning a viewing.</p></div>;
  return <><div className="gallery-layout"><button ref={trigger} className="gallery-main" onClick={() => { setIndex(0); dialog.current?.showModal(); }} aria-label={`Open gallery for ${title}`}><Image src={available[0]} alt={`${title}, photo 1`} fill unoptimized priority sizes="(max-width: 640px) 100vw, 70vw" onError={() => setFailed(x => [...x,available[0]])} /><span className="gallery-count">View {available.length} {available.length === 1 ? "photo" : "photos"} ↗</span></button>{available[1] && <button className="gallery-side" aria-label="Open photo 2" onClick={() => { setIndex(1); dialog.current?.showModal(); }}><Image src={available[1]} alt={`${title}, photo 2`} fill sizes="30vw" unoptimized onError={() => setFailed(x => [...x,available[1]])} /></button>}</div><dialog ref={dialog} className="gallery-dialog" onClose={() => trigger.current?.focus()} onKeyDown={e => { if(e.key === "ArrowLeft") next(-1); if(e.key === "ArrowRight") next(1); }}><div className="gallery-dialog-top"><span>{active+1} / {available.length}</span><button autoFocus onClick={() => dialog.current?.close()}>Close ×</button></div><div className="gallery-full-image" onTouchStart={e => { startX.current = e.touches[0].clientX; }} onTouchEnd={e => { const d = e.changedTouches[0].clientX - startX.current; if(Math.abs(d)>60) next(d>0?-1:1); }}><Image key={available[active]} src={available[active]} alt={`${title}, photo ${active+1}`} fill sizes="95vw" unoptimized onError={() => setFailed(x => [...x,available[active]])} /></div><div className="gallery-controls"><button onClick={() => next(-1)} aria-label="Previous photo">← Previous</button><button onClick={() => next(1)} aria-label="Next photo">Next →</button></div></dialog></>;
}

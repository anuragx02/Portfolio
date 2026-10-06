import React from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, LayoutGrid, List, X } from 'lucide-react';
import { DISCIPLINES, projects, type Project } from './projects';

const PAGE = 5;
const MORE = 8;
const num = (n: number) => String(n).padStart(2, '0');
const hue = (s: string) => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 40;

const tilt = (e: React.PointerEvent<HTMLElement>) => {
  if (e.pointerType !== 'mouse') return;
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  el.style.setProperty('--tx', `${((0.5 - y) * 14).toFixed(2)}deg`);
  el.style.setProperty('--ty', `${((x - 0.5) * 18).toFixed(2)}deg`);
  el.style.setProperty('--gx', `${(x * 100).toFixed(0)}%`); el.style.setProperty('--gy', `${(y * 100).toFixed(0)}%`);
};
const untilt = (e: React.PointerEvent<HTMLElement>) => { const s = e.currentTarget.style; s.setProperty('--tx', '0deg'); s.setProperty('--ty', '0deg'); };

export function WorkTile() {
  const [filter, setFilter] = React.useState<string>('ALL');
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [shown, setShown] = React.useState(PAGE);
  const [q, setQ] = React.useState('');
  const [open, setOpen] = React.useState<Project | null>(null);
  const list = projects.filter((p) => (filter === 'ALL' || p.discipline === filter) && (!q || (p.title + p.summary).toLowerCase().includes(q.toLowerCase())));
  const vis = list.slice(0, shown);
  const placeholderOnly = projects.every((p) => p.placeholder);
  return (
    <div className="t t-work" id="work">
      <p className="kicker"><b>01</b> / WORK INDEX · {projects.length} {projects.length === 1 ? 'PROJECT' : 'PROJECTS'}</p>
      <h2 className="th">Process, <em>not just</em> output</h2>
      <div className="wtools">
        <div className="chips2" role="tablist" aria-label="Filter by discipline">
          {['ALL', ...DISCIPLINES].map((d) => (
            <button key={d} className={filter === d ? 'on' : ''} onClick={() => { setFilter(d); setShown(PAGE); }}>{d}</button>
          ))}
        </div>
        <div className="wright">
          {projects.length > 20 && <input className="wsearch" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search projects" />}
          <div className="vt">
            <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')} aria-label="Grid view"><LayoutGrid size={14} /></button>
            <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')} aria-label="List view"><List size={14} /></button>
          </div>
        </div>
      </div>
      {vis.length === 0 && <p className="note">Nothing in this filter yet.</p>}
      <div className={`wgrid v-${view}`}>
        {vis.map((p, i) => (
          <button key={p.id} className={`wcard ${p.featured && view === 'grid' && filter === 'ALL' ? 'feat' : ''}`} onClick={() => setOpen(p)} onPointerMove={tilt} onPointerLeave={untilt} style={{ ['--h' as string]: hue(p.id) } as React.CSSProperties}>
            <span className="wcover">
              {p.cover ? <img src={p.cover} alt="" loading="lazy" /> : <i className="wart" />}
              {p.placeholder && <em className="ph">PLACEHOLDER</em>}
              <b className="wn">{num(i + 1)}</b>
            </span>
            <span className="wmeta"><small>{p.discipline}{p.year ? ` · ${p.year}` : ''}</small><strong>{p.title}</strong><span>{p.summary}</span></span>
          </button>
        ))}
        {list.length > shown && (
          <button className="wmore" onClick={() => setShown(shown + MORE)}>+ {list.length - shown} more · load</button>
        )}
      </div>
      {placeholderOnly && <p className="note wnote">These are tagged placeholders. Real projects replace them as we build them together.</p>}
      {open && <Storyboard p={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Storyboard({ p, onClose }: { p: Project; onClose: () => void }) {
  const [i, setI] = React.useState(0);
  const [flip, setFlip] = React.useState(false);
  React.useEffect(() => setFlip(false), [i]);
  const ref = React.useRef<HTMLDivElement>(null);
  const n = p.panels.length;
  React.useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    document.body.style.overflow = 'hidden';
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setI((v) => Math.min(n - 1, v + 1));
      if (e.key === 'ArrowLeft') setI((v) => Math.max(0, v - 1));
    };
    window.addEventListener('keydown', k);
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; prev?.focus(); };
  }, [n, onClose]);
  const pn = p.panels[i];
  return createPortal(
    <div className="sb" role="dialog" aria-modal="true" aria-label={`${p.title} storyboard`} onClick={onClose}>
      <div className="sb-in" ref={ref} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        <button className="sb-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <p className="kicker"><b>{p.discipline.toUpperCase()}</b> {p.placeholder && <em className="ph">PLACEHOLDER</em>}</p>
        <h3>{p.title}</h3>
        <div className="sb-strip" style={{ ['--i' as string]: i } as React.CSSProperties}>
          {p.panels.map((x, k) => (
            <button key={k} className={`sb-p ${k === i ? 'on' : ''} ${k === i && flip ? 'flip' : ''} s${k % 4}`} onClick={() => (k === i ? setFlip((f) => !f) : setI(k))} aria-label={`Panel ${k + 1}${k === i ? ', press to flip' : ''}`}>
              <span className="face front">
                {x.image ? <img src={x.image} alt="" loading="lazy" /> : <i className="wart" style={{ ['--h' as string]: k * 14 } as React.CSSProperties} />}
                <b>{num(k + 1)}</b>
              </span>
              <span className="face back"><small>{num(k + 1)} · {p.discipline}</small><strong>{x.caption}</strong>{x.prompt && <code>{x.prompt}</code>}</span>
            </button>
          ))}
        </div>
        <div className="sb-cap">
          <span className="bubble">{pn.caption}</span><span className="m">Tap the highlighted panel to flip it</span>
          {pn.prompt && <code>{pn.prompt}</code>}
        </div>
        <div className="sb-nav">
          <button className="btn btn-ghost" disabled={i === 0} onClick={() => setI(i - 1)}><ArrowLeft size={14} /> Prev</button>
          <span className="m">{num(i + 1)} / {num(n)}</span>
          <button className="btn btn-ghost" disabled={i === n - 1} onClick={() => setI(i + 1)}>Next <ArrowRight size={14} /></button>
        </div>
      </div>
    </div>,
    document.body
  );
}

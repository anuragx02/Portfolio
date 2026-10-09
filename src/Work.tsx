import React from 'react';
import { FilmPlayer } from './FilmPlayer';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, LayoutGrid, List, X } from 'lucide-react';
import { DISCIPLINES, projects, projectSubtype, type Project } from './projects';

const PAGE = 8;
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
  const [subtype, setSubtype] = React.useState('ALL');
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [shown, setShown] = React.useState(projects.length);
  const [q, setQ] = React.useState('');
  const [open, setOpen] = React.useState<Project | null>(null);
  const list = projects.filter((p) => (filter === 'ALL' || p.discipline === filter) && (subtype === 'ALL' || projectSubtype[p.id] === subtype) && (!q || (p.title + p.summary).toLowerCase().includes(q.toLowerCase())));
  const subtypes = [...new Set(projects.filter(p=>p.discipline===filter).map(p=>projectSubtype[p.id]).filter(Boolean))];
  const ordered = filter === 'ALL' ? DISCIPLINES.flatMap(d=>list.filter(p=>p.discipline===d)) : list;
  const vis = ordered.slice(0, shown);
  const placeholderOnly = projects.every((p) => p.placeholder);
  return (
    <div className="t t-work" id="work">
      <p className="kicker"><b>01</b> / WORK INDEX · {projects.length} {projects.length === 1 ? 'PROJECT' : 'PROJECTS'}</p>
      <h2 className="th">Browse by <em>type</em></h2>
      <div className="wtools">
        <div className="chips2" role="group" aria-label="Filter by media type">
          {['ALL', ...DISCIPLINES.filter(d=>projects.some(p=>p.discipline===d))].map((d) => (
            <button key={d} className={filter === d ? 'on' : ''} aria-pressed={filter === d} onClick={() => { setFilter(d); setSubtype('ALL'); setShown(projects.length); }}>{d}</button>
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
      {filter !== 'ALL' && subtypes.length > 0 && <div className="chips2" role="group" aria-label="Filter by subtype" style={{marginBottom:18}}>{['ALL',...subtypes].map(s=><button key={s} className={subtype===s?'on':''} aria-pressed={subtype===s} onClick={()=>{setSubtype(s);setShown(projects.length);}}>{s==='ALL'?'All '+filter.toLowerCase():s}</button>)}</div>}
      {vis.length === 0 && <p className="note">Nothing in this filter yet.</p>}
      <div className={`wgrid v-${view}`}>
        {vis.map((p, i) => (
          <React.Fragment key={p.id}>{filter==='ALL' && (i===0 || vis[i-1].discipline!==p.discipline) && <h3 style={{gridColumn:'1 / -1',fontSize:24,margin:'18px 0 0'}}>{p.discipline}</h3>}<div className="project-entry"><button className={`wcard ${false ? 'feat' : ''}`} onClick={() => ['stepwell-carousel', 'light-mood-lab'].includes(p.id) && p.link ? window.open(p.link, '_blank', 'noopener,noreferrer') : p.readerIssue ? window.dispatchEvent(new CustomEvent('open-cover-stories', { detail: p.readerIssue })) : setOpen(p)} onPointerMove={tilt} onPointerLeave={untilt} style={{ ['--h' as string]: hue(p.id) } as React.CSSProperties}>
            <span className="wcover">
              {p.cover ? <img src={p.cover} alt="" loading="lazy" style={p.podcastEmbed?{objectFit:"contain",background:"#16191c"}:undefined} /> : <i className="wart" />}
              {p.placeholder && <em className="ph">PLACEHOLDER</em>}
              <b className="wn">{num(i + 1)}</b>
            </span>
            <span className="wmeta"><small>{p.discipline} · {projectSubtype[p.id]}{p.year ? ` · ${p.year}` : ''}</small><strong>{p.title}</strong><span>{p.summary}</span></span>
          </button>
          <div className="project-links">{p.link && <a href={p.link}>{p.podcastEmbed?"Listen on Spotify ↗":"Live project ↗"}</a>}{['sookha','tola'].includes(p.id) && <a href={`/brands/${p.id}/case-study.html`}>Case study ↗</a>}{p.id === 'mewform' && <a href="/brands/mewform/#/case-study">Case study ↗</a>}</div></div></React.Fragment>
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
    document.querySelectorAll('video').forEach((v) => v.pause());
    document.body.style.overflow = 'hidden';
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const items = ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],video[controls],[tabindex="0"]');
        if (items?.length) {
          const first = items[0], last = items[items.length - 1];
          if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && (document.activeElement === last || document.activeElement === ref.current)) { e.preventDefault(); first.focus(); }
        }
      }
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
        {p.link && <p><a className="btn btn-ghost sb-link" href={p.link} target="_blank" rel="noreferrer">{p.podcastEmbed?'Listen on Spotify':'Open the full concept site'} <ArrowUpRight size={14} /></a></p>}
        {p.film && <><p className="film-project-note">Independent cinematic concept · {p.film.duration} · Made in Google Flow</p><FilmPlayer film={p.film} /><p className="film-sequence-label">THE SEQUENCE / FOUR SCENES</p></>}
        {p.podcastEmbed && <><iframe src={p.podcastEmbed} title="Spotify player: Your Brain is a Prediction Machine" width="100%" height="352" style={{border:0,borderRadius:12,marginBottom:20}} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" /><p className="film-project-note">AI-generated audio · ChatGPT source document and artwork · NotebookLM audio · Published by Anurag on Spotify for Creators</p></>}
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

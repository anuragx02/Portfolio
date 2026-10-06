import React from 'react';
import ReactDOM from 'react-dom/client';
import { ArrowDown, ArrowUpRight, Check, Copy, Mail, MousePointerClick, Move3d, Play } from 'lucide-react';
import './styles.css';
import { profile, skills, tools } from './data';
import { WorkTile } from './Work';
import { DenoiseTile } from './Denoise';
const THEME = (new URLSearchParams(location.search).get('theme') || 'chrome');
document.documentElement.dataset.theme = THEME;

const Orbit3D = React.lazy(() => import('./Orbit3D'));

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
const num = (n: number) => String(n).padStart(2, '0');

function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`hdr ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap hdr-in">
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="brand-dot" /> {profile.name}
        </button>
        <nav aria-label="Primary">
          <button onClick={() => go('work')}>Work</button>
          <button onClick={() => go('orbit')}>Skills</button>
          <button onClick={() => go('toolkit')}>Toolkit</button>
          <button onClick={() => go('contact')}>Contact</button>
        </nav>
        <button className="pill" onClick={() => go('contact')}>Hire me <ArrowUpRight size={14} /></button>
      </div>
    </header>
  );
}

function Hero() {
  const ref = React.useRef<HTMLElement>(null);
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${x * 100}%`); el.style.setProperty('--my', `${y * 100}%`);
    el.style.setProperty('--px', String((x * 2 - 1).toFixed(3))); el.style.setProperty('--py', String((y * 2 - 1).toFixed(3)));
    el.style.setProperty('--rx', `${(0.5 - y) * 9}deg`); el.style.setProperty('--ry', `${(x - 0.5) * 12}deg`);
  };
  return (
    <section id="top" className="hero" ref={ref} onPointerMove={onMove}>
      <div className="hero-bg" aria-hidden="true"><HeroVideo /><i className="blob b1" /><i className="blob b2" /><i className="grid" /></div>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="kicker"><span className="live" /> AI CREATIVE · CONTENT · DIGITAL EXPERIENCES</p>
          <h1>
            <span className="h-line">Anurag</span>
            <span className="h-line h-out">makes with</span>
            <span className="h-line h-ai">AI<em>.</em></span>
          </h1>
          <p className="lede">I create AI-powered images, videos, social content and digital experiences.</p>
          <div className="badge-ph"><b>Fellowship badge</b> · add program name and batch <em className="ph">PLACEHOLDER</em></div>
          <div className="cta">
            <button className="btn btn-solid" onClick={() => go('work')}>See the work <ArrowDown size={16} /></button>
            <button className="btn btn-ghost" onClick={() => go('contact')}><Mail size={16} /> Hire me</button>
          </div>
        </div>
        <div className="lumen" aria-hidden="true">
          <div className="lumen-core"><i className="lc-sheen" /><i className="lc-ring r1" /><i className="lc-ring r2" /><i className="lc-ring r3" /></div>
          <div className="tag t1">AI VIDEO</div>
          <div className="tag t2">AI IMAGES</div>
          <div className="tag t3">WEBSITES</div>
        </div>
      </div>
      <div className="wrap reel-wrap">
        <div className="reel" role="img" aria-label="Showreel placeholder">
          <em className="ph">PLACEHOLDER</em>
          <span className="reel-play"><Play size={26} /></span>
          <b>Showreel goes here</b>
          <small>A 30-60s cut of your best AI video work (MP4 or embed)</small>
          <span className="tc">00:00:00:00</span>
        </div>
      </div>
    </section>
  );
}

/* Hero video slot. Leave HERO_VIDEO empty until Anurag's own clip exists.
   Put the file in /public (e.g. '/hero.mp4') and optionally a poster. Nothing loads while empty. */
const HERO_VIDEO = '';
const HERO_POSTER = '';
function HeroVideo() {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    if (!HERO_VIDEO) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const save = (navigator as any).connection?.saveData;
    if (reduce || save) return;
    const el = ref.current?.parentElement; if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '200px' });
    io.observe(el); return () => io.disconnect();
  }, []);
  React.useEffect(() => {
    const v = ref.current; if (!v) return;
    on ? v.play().catch(() => {}) : v.pause();
  }, [on]);
  if (!HERO_VIDEO) return <div className="hero-video" data-empty="true" />;
  return (
    <div className="hero-video">
      <video ref={ref} src={on ? HERO_VIDEO : undefined} poster={HERO_POSTER || undefined} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
    </div>
  );
}

function canUse3D() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if ((navigator.hardwareConcurrency ?? 8) <= 2) return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

function Orbit() {
  const [selected, setSelected] = React.useState<number | null>(null);
  const [near, setNear] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [ok] = React.useState(canUse3D);
  const stage = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = stage.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setNear(true); setActive(e.isIntersecting); }, { rootMargin: '300px' });
    io.observe(el); return () => io.disconnect();
  }, []);
  const items = skills.map((s) => ({ id: s.id, title: s.title }));
  const cur = selected !== null ? skills[selected] : null;
  return (
    <div className="t t-orbit" id="orbit">
      <div>
        <SecHead n="03" label="SKILLS ORBIT" title={<>Five ways I <em>make</em> things</>} note={ok ? 'Drag to spin. Click a card to open it.' : 'Pick a discipline.'} />
        <div className="orbit">
          <div className="stage" ref={stage}>
            {ok && near ? (
              <React.Suspense fallback={<div className="stage-load">Loading 3D…</div>}>
                <Orbit3D items={items} selected={selected} onSelect={setSelected} active={active} />
              </React.Suspense>
            ) : (
              <div className="stage-load">{ok ? 'Loading 3D…' : '3D is off on this device. Use the list.'}</div>
            )}
            {ok && <span className="hint"><Move3d size={14} /> drag <MousePointerClick size={14} /> click</span>}
          </div>
          <div className="panel">
            {cur ? (
              <>
                <p className="panel-n">/ {num((selected ?? 0) + 1)}</p>
                <h3>{cur.title}</h3>
                <p className="panel-d">{cur.shortDesc}</p>
                <ul className="chips">{cur.toolsUsed.map((t) => <li key={t}>{t}</li>)}</ul>
                <button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>
              </>
            ) : (
              <>
                <p className="panel-n">/ 00</p>
                <h3>Choose a card</h3>
                <p className="panel-d">Each card is one discipline from my toolkit: what I make and which tools I use for it.</p>
              </>
            )}
            <ol className="pick" aria-label="Disciplines">
              {skills.map((s, i) => (
                <li key={s.id}><button className={selected === i ? 'on' : ''} onClick={() => setSelected(selected === i ? null : i)}><span>{num(i + 1)}</span>{s.title}</button></li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toolkit() {
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div className="t t-tool" id="toolkit">
      <div>
        <SecHead n="04" label="AI TOOLKIT" title={<>The <em>stack</em></>} note="Workflow tools I use." />
        <div className="tools">
          {tools.map((t) => (
            <article key={t.name} className="tool" onPointerMove={onMove}>
              <span>{t.category}</span>
              <h3>{t.name}</h3>
              <p>{t.usage}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function Contact() {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
  };
  return (
    <div className="t t-contact" id="contact">
      <div>
        <p className="kicker"><span className="live" /> 05 / HIRE ME</p>
        <h2 className="big">Let&apos;s make something <em>unreal.</em></h2>
        <p className="lede">Have an idea, project or opportunity? Email me directly.</p>
        <div className="mail">
          <a className="btn btn-solid glitch" data-t="Hire me" href={`mailto:${profile.email}?subject=Hiring%20inquiry`}><Mail size={16} /> Hire me</a>
          <a className="addr" href={`mailto:${profile.email}`}>{profile.email}</a>
          <button className="btn btn-ghost" onClick={copy}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy'}</button>
        </div>
        <div className="soc">
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
          <a href={profile.x} target="_blank" rel="noreferrer"><XIcon /> X <ArrowUpRight size={14} /></a>
        </div>
      </div>
    </div>
  );
}

function SecHead({ n, label, title, note }: { n: string; label: string; title: React.ReactNode; note?: string }) {
  return (
    <div className="sechead">
      <p className="kicker"><b>{n}</b> / {label}</p>
      <h2>{title}</h2>
      {note && <p className="note">{note}</p>}
    </div>
  );
}

function Progress() {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    const on = () => { const d = document.documentElement; setP(d.scrollTop / Math.max(1, d.scrollHeight - d.clientHeight)); };
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return <div className="progress" style={{ transform: `scaleX(${p})` }} />;
}

function App() {
  React.useEffect(() => {
    /* Scroll-depth: tiles drift in depth as they cross the viewport. Desktop pointer devices only. */
    const mq = matchMedia('(min-width: 900px) and (not (pointer: coarse)) and (prefers-reduced-motion: no-preference)');
    if (!mq.matches) return;
    document.documentElement.classList.add('depth');
    let raf = 0;
    type T = { el: HTMLElement; cur: number; tgt: number };
    const tiles: T[] = Array.from(document.querySelectorAll<HTMLElement>('.dash > .t')).map((el) => ({ el, cur: 0, tgt: 0 }));
    const root = document.documentElement;
    let sy = scrollY, syT = scrollY;
    const measure = () => {
      /* read phase: all layout reads first, no writes in between */
      const h = innerHeight;
      syT = scrollY;
      for (const t of tiles) {
        const r = t.el.getBoundingClientRect();
        t.tgt = Math.max(-1, Math.min(1, (r.top + r.height / 2 - h / 2) / (h / 2 + Math.min(r.height, h) / 2)));
      }
    };
    let last = 0;
    const tick = (now = performance.now()) => {
      raf = 0;
      const dt = last ? Math.min(64, now - last) : 16; last = now;
      /* ease toward the scroll-driven target (frame-rate independent enough at ~60fps) */
      const k = 1 - Math.exp(-dt / 85);
      let moving = false;
      sy += (syT - sy) * k;
      if (Math.abs(syT - sy) > 0.4) moving = true; else sy = syT;
      root.style.setProperty('--sy', sy.toFixed(1));
      for (const t of tiles) {
        const diff = t.tgt - t.cur;
        if (Math.abs(diff) > 0.0008) { t.cur += diff * k; moving = true; } else t.cur = t.tgt;
        t.el.style.setProperty('--d', t.cur.toFixed(4));
      }
      if (moving) raf = requestAnimationFrame(tick); else last = 0;
    };
    const on = () => { measure(); if (!raf) raf = requestAnimationFrame(tick); };
    measure(); sy = syT; tiles.forEach((t) => (t.cur = t.tgt)); tick();
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); root.classList.remove('depth'); if (raf) cancelAnimationFrame(raf); };
  }, []);
  React.useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.1 });
    document.querySelectorAll('.sechead').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return (
    <>
      <Progress />
      <Header />
      <main>
        <Hero />
        <div className="wrap dash">
          <WorkTile />
          <DenoiseTile />
          <Orbit />
          <Toolkit />
          <Contact />
        </div>
      </main>
      <footer className="ftr"><div className="wrap"><span>© 2026 {profile.name}</span><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button></div></footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

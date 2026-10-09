import React from 'react';
import ReactDOM from 'react-dom/client';
import { ArrowDown, ArrowUpRight, Check, Copy, Mail, MousePointerClick, Move3d, Play } from 'lucide-react';
import './styles.css';
import { profile, skills, toolGroups } from './data';
import { WorkTile } from './Work';
import { FilmPlayer } from './FilmPlayer';
import { bmwFilm } from './projects';
import { FeaturedMedia, About, Evidence } from './FeaturedMedia';
import { CoverStories } from './CoverStories';
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
  const [menu, setMenu] = React.useState(false);
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
        <button className="menu-toggle pill" aria-expanded={menu} aria-controls="primary-nav" onClick={() => setMenu(!menu)}>Menu</button>
        <nav id="primary-nav" className={menu ? "is-open" : ""} aria-label="Primary" onClick={() => setMenu(false)}>
          <button onClick={() => go('about')}>About</button>
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
    const el = ref.current; if (!el || e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${x * 100}%`); el.style.setProperty('--my', `${y * 100}%`);
    el.style.setProperty('--px', String((x * 2 - 1).toFixed(3))); el.style.setProperty('--py', String((y * 2 - 1).toFixed(3)));
    el.style.setProperty('--rx', `${(0.5 - y) * 4}deg`); el.style.setProperty('--ry', `${(x - 0.5) * 5}deg`);
  };
  return (
    <section id="top" className="hero" ref={ref} onPointerMove={onMove} onPointerLeave={() => { const el=ref.current; if(el) for(const key of ["--px","--py","--rx","--ry"]) el.style.setProperty(key,key.includes("r") ? "0deg" : "0"); }}> 
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
          <div className="cta">
            <button className="btn btn-solid" onClick={() => go('work')}>See the work <ArrowDown size={16} /></button>
            <button className="btn btn-ghost" onClick={() => go('contact')}><Mail size={16} /> Hire me</button>
          </div>
        </div>
        <div className="lumen" aria-hidden="true"><div className="cinema-atmosphere"><i className="cinema-beam beam-one" /><i className="cinema-beam beam-two" />{Array.from({length:12},(_,i)=><i className="cinema-dust" key={i} style={{left:`${8+(i*19)%84}%`,top:`${12+(i*31)%78}%`,animationDelay:`-${i*2.7}s`,animationDuration:`${22+i%4*5}s`}} />)}</div>
          <div className="lumen-core"><img className="lc-portrait" src="/portrait-choice-c.jpg" alt="Portrait of Anurag Dutta" /><i className="lc-sheen" /><i className="lc-ring r1" /><i className="lc-ring r2" /><i className="lc-ring r3" /></div>
          <div className="tag t1">AI VIDEO</div>
          <div className="tag t2">AI IMAGES</div>
          <div className="tag t3">WEBSITES</div>
        </div>
      </div>
      <div className="wrap reel-wrap"><FeaturedMedia /></div>
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
        <SecHead n="05" label="SKILLS ORBIT" title={<>Five ways I <em>make</em> things</>} note={ok ? 'Drag to spin. Click a card to open it.' : 'Pick a discipline.'} />
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
        <SecHead n="05" label="AI TOOLKIT" title={<>The <em>stack</em></>} note="The tools behind the work." />
        <div className="stack">
          {toolGroups.map((g, gi) => (
            <section key={g.id} className="sgrp" onPointerMove={onMove}>
              <header><span>{String(gi + 1).padStart(2, '0')}</span><h3>{g.label}</h3><p>{g.note}</p></header>
              <ul className="tags">
                {g.tools.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function Contact() {
  const [copied, setCopied] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (!r.ok) throw new Error('send failed');
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
  };
  return (
    <div className="t t-contact" id="contact">
      <div>
        <p className="kicker"><span className="live" /> 06 / HIRE ME</p>
        <h2 className="big">Let&apos;s make something <em>unreal.</em></h2>
        <p className="lede">Have an idea, project or opportunity? Send a message - it lands straight in my inbox.</p>
        <form className="cform" onSubmit={send}>
          <div className="cf-row">
            <input name="name" type="text" required placeholder="Your name" autoComplete="name" aria-label="Your name" />
            <input name="email" type="email" required placeholder="Your email" autoComplete="email" aria-label="Your email" />
          </div>
          <input name="subject" type="text" required placeholder="Subject" aria-label="Subject" />
          <textarea name="message" required rows={5} placeholder="Message" aria-label="Message" />
          <input type="text" name="_honey" className="cf-honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <input type="hidden" name="_captcha" value="false" />
          <div className="cf-foot">
            <button className="btn btn-solid glitch" data-t="Send" type="submit" disabled={status === 'sending'}><Mail size={16} /> {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent' : 'Send'}</button>
            <a className="addr" href={`mailto:${profile.email}`}>{profile.email}</a>
            <button type="button" className="btn btn-ghost" onClick={copy}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy'}</button>
          </div>
          {status === 'sent' && <p className="note cf-ok">Thanks - your message is on its way.</p>}
          {status === 'error' && <p className="note cf-err">That didn&apos;t go through. Email me directly at {profile.email}.</p>}
        </form>
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
    /* Background-only parallax: no moving content or layout reads on scroll. */
    const root=document.documentElement;
    if(CSS.supports("animation-timeline: scroll()")) return;
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');
    let raf=0;
    const update=()=>{raf=0;const range=Math.max(1,root.scrollHeight-innerHeight);const p=reduce.matches?0:Math.min(1,scrollY/range);root.style.setProperty('--scene-progress',p.toFixed(4));};
    const on=()=>{if(!raf)raf=requestAnimationFrame(update);};
    update();addEventListener('scroll',on,{passive:true});addEventListener('resize',on);reduce.addEventListener('change',on);
    return()=>{removeEventListener('scroll',on);removeEventListener('resize',on);reduce.removeEventListener('change',on);if(raf)cancelAnimationFrame(raf);};
  }, []);
  React.useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.1 });
    document.querySelectorAll('.sechead').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return (
    <>
      <div className="site-scene" aria-hidden="true"><i className="scene-layer scene-haze" /><i className="scene-layer scene-orbit" /><i className="scene-layer scene-plane" /><i className="scene-layer scene-grain" /><i className="scene-layer scene-rim" /></div><Progress />
      <Header />
      <main>
        <Hero />
        <div className="wrap dash">
          <About />
          <Evidence />
          <WorkTile />
          <CoverStories />
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

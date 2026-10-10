import {Exhibition} from './Exhibition';
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

function canUse3D(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches || (navigator as any).connection?.saveData)return false;
 try{const c=document.createElement('canvas');return !!(c.getContext('webgl2')||c.getContext('webgl'))}catch{return false}
}

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
          <button onClick={() => go('orbit')}>Process</button>
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
          <div className="lumen-core"><img className="lc-portrait" src="/1-portrait-corner-clean.png" width="896" height="1200" fetchPriority="high" decoding="async" alt="Portrait of Anurag Dutta" /><i className="lc-sheen" /><i className="lc-ring r1" /><i className="lc-ring r2" /><i className="lc-ring r3" /></div>
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

function Orbit() {
  const [selected, setSelected] = React.useState<number | null>(null);
  const [hovered,setHovered]=React.useState<number|null>(null);
  const [near, setNear] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [ok] = React.useState(canUse3D);
  const stage = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = stage.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setNear(true); setActive(e.isIntersecting); }, { rootMargin: '300px' });
    io.observe(el); return () => io.disconnect();
  }, []);
  const steps=[
    ['Find the question','The stepwell carousel begins with one question: why does a well need stairs? A clear idea gives the work a direction.'],
    ['Look for evidence','The brand case studies separate sourced context from assumptions. Tola changed direction when the first gap was already served.'],
    ['Set the visual direction','Cover Stories uses one finished editorial scene per issue. The reference is inspiration; the setting, words and composition belong to this collection.'],
    ['Review and revise','A real Tola revision: the generic ergonomic-and-light claim became a load-label concept. The new idea still needs testing, not a claim of proven success.'],
    ['Make the output usable','The work ends in a format people can explore: a swipeable carousel, film player, concept site or podcast. The source, artwork and audio steps remain distinct.'],
  ];
  const items = steps.map(([title],i) => ({ id: String(i), title }));
  const shown=hovered ?? selected;
  const cur = shown !== null ? steps[shown] : null;
  return (
    <div className="t t-orbit" id="orbit">
      <div>
        <SecHead n="06" label="PROCESS / BEHIND THE WORK" title={<>From question to <em>output</em></>} note={ok ? 'Drag to spin. Click a card to open it.' : 'Pick a step to look closer.'} />
        <div className="orbit">
          <div className="stage" ref={stage}>
            {ok && near ? (
              <React.Suspense fallback={<div className="stage-load">Loading 3D…</div>}>
                <Orbit3D items={items} selected={selected} onSelect={setSelected} onHover={setHovered} active={active} />
              </React.Suspense>
            ) : (
              <div className="stage-load">{ok ? 'Loading 3D…' : '3D is off on this device. Use the list.'}</div>
            )}
            {ok && <span className="hint"><Move3d size={14} /> drag <MousePointerClick size={14} /> click</span>}
          </div>
          <div className="panel">
            {cur ? (
              <>
                <p className="panel-n">/ {num((shown ?? 0) + 1)}</p>
                <h3>{cur[0]}</h3>
                <p className="panel-d">{cur[1]}</p>
                
                <button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>
              </>
            ) : (
              <>
                <p className="panel-n">/ 00</p>
                <h3>Choose a card</h3>
                <p className="panel-d">Each card is one step from question to output. These examples come from the actual projects.</p>
              </>
            )}
            <ol className="pick" aria-label="Process steps">
              {steps.map(([title], i) => (
                <li key={title}><button className={selected === i ? 'on' : ''} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(i)} onBlur={()=>setHovered(null)} onClick={() => setSelected(selected === i ? null : i)}><span>{num(i + 1)}</span>{title}</button></li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <div className="process-example"><p className="kicker">ONE DOCUMENTED REVISION / TOLA</p><p><strong>Before:</strong> 'Ergonomic and light' as the gap. <strong>After:</strong> a printed load-label concept, with the unresolved tests kept visible.</p><a href="/brands/tola/case-study.html">Read the reasoning ↗</a></div>
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
        <SecHead n="07" label="AI TOOLKIT" title={<>The <em>stack</em></>} note="A working reference of tools for making and exploring. Not every tool is used in every project." />
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
    let frame=0;const update=()=>{frame=0;const d=document.documentElement;setP(d.scrollTop/Math.max(1,d.scrollHeight-d.clientHeight));};const on=()=>{if(!frame)frame=requestAnimationFrame(update);};
    update();window.addEventListener('scroll',on,{passive:true});return()=>{window.removeEventListener('scroll',on);if(frame)cancelAnimationFrame(frame);};
  }, []);
  return <div className="progress" style={{ transform: `scaleX(${p})` }} />;
}

function App() {
  React.useEffect(()=>{const gallery=document.querySelector('.featured-media');if(!gallery)return;const io=new IntersectionObserver(([e])=>gallery.classList.toggle('gallery-offscreen',!e.isIntersecting),{rootMargin:'100px'});io.observe(gallery);return()=>io.disconnect();},[]);

  React.useEffect(() => {
    const mq=matchMedia('(min-width:900px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
    let dispose=()=>{};
    const setup=()=>{
      dispose(); if(!mq.matches)return;
      const halo=document.createElement('div');halo.className='cursor-halo';halo.setAttribute('aria-hidden','true');document.body.appendChild(halo);
      const root=document.documentElement;const scene=document.querySelector('.site-scene');
      const light=document.createElement('canvas');light.className='forest-light';light.width=400;light.height=400;light.setAttribute('aria-hidden','true');scene?.after(light);
      const ctx=light.getContext('2d');let ready=false;let w=innerWidth,h=innerHeight;
      const planes=[...document.querySelectorAll<HTMLElement>('.site-scene .scene-layer')].map((el,i)=>({el,travel:[26,60,100,145,135][i],image:new Image(),bitmap:document.createElement('canvas')}));
      const raster=()=>{if(!planes.every(p=>p.image.naturalWidth))return;w=innerWidth;h=innerHeight;for(const p of planes){p.bitmap.width=Math.ceil(w*1.08);p.bitmap.height=Math.ceil(h*1.14);const c=p.bitmap.getContext('2d');if(c){c.filter='brightness(2.25) saturate(1.12)';c.drawImage(p.image,0,0,p.bitmap.width,p.bitmap.height);}}ready=true;};
      Promise.all(planes.map(p=>new Promise<void>(resolve=>{const url=getComputedStyle(p.el).backgroundImage.slice(5,-2);p.image.onload=()=>resolve();p.image.onerror=()=>resolve();p.image.src=url;}))).then(()=>{if(planes.every(p=>p.image.naturalWidth)){if('requestIdleCallback' in window)window.requestIdleCallback(()=>raster(),{timeout:1500});else setTimeout(raster,150);}});
      const draw=(cx:number,cy:number)=>{if(!ready||!ctx)return;ctx.clearRect(0,0,400,400);const g=ctx.createLinearGradient(0,0,0,400);g.addColorStop(0,'#172c39');g.addColorStop(1,'#0b1823');ctx.fillStyle=g;ctx.fillRect(0,0,400,400);const progress=scrollY/Math.max(1,root.scrollHeight-innerHeight);for(const p of planes){ctx.drawImage(p.bitmap,w*-.04-cx+200,h*-.07-p.travel*progress-cy+200);}ctx.globalCompositeOperation='destination-in';const mask=ctx.createRadialGradient(200,200,0,200,200,200);mask.addColorStop(0,'#000');mask.addColorStop(.25,'rgba(0,0,0,.95)');mask.addColorStop(.55,'rgba(0,0,0,.5)');mask.addColorStop(1,'transparent');ctx.fillStyle=mask;ctx.fillRect(0,0,400,400);ctx.globalCompositeOperation='source-over';light.style.transform=`translate3d(${cx-200}px,${cy-200}px,0)`;};
      let idleTimer=0;let raf=0,x=0,y=0,tx=0,ty=0,started=false,active:HTMLElement|null=null;
      const tick=()=>{raf=0;x+=(tx-x)*.28;y+=(ty-y)*.28;halo.style.transform=`translate3d(${x}px,${y}px,0)`;draw(x,y);if(started)root.classList.add('flashlight-ready');if(Math.abs(tx-x)+Math.abs(ty-y)>.2)raf=requestAnimationFrame(tick);};
      const reset=()=>{if(active){active.style.removeProperty('--mag-x');active.style.removeProperty('--mag-y');active=null;}};
      const move=(e:PointerEvent)=>{if(e.pointerType!=='mouse')return;tx=e.clientX;ty=e.clientY;if(!started){x=tx;y=ty;started=true;}halo.classList.add('visible');light?.classList.add('lit');root.classList.remove('effects-idle');clearTimeout(idleTimer);idleTimer=window.setTimeout(()=>root.classList.add('effects-idle'),1200);root.classList.toggle('flashlight-form',!!(e.target as Element).closest('input,textarea,select,[contenteditable=true]')); 
        const target=(e.target as Element).closest<HTMLElement>('a,button');halo.classList.toggle('over-link',!!target);
        const magnetic=(e.target as Element).closest<HTMLElement>('.btn,.hdr .pill');if(active!==magnetic)reset();
        if(magnetic){active=magnetic;const r=magnetic.getBoundingClientRect();active.style.setProperty('--mag-x',`${Math.max(-4,Math.min(4,(tx-r.left-r.width/2)*.06))}px`);active.style.setProperty('--mag-y',`${Math.max(-3,Math.min(3,(ty-r.top-r.height/2)*.08))}px`);}
        if(!raf)raf=requestAnimationFrame(tick);
      };
      const leave=()=>{halo.classList.remove('visible');light?.classList.remove('lit');root.classList.remove('flashlight-ready','flashlight-form');root.classList.add('effects-idle');started=false;reset();};
      const visibility=()=>{root.classList.toggle('effects-idle',document.hidden);if(document.hidden)leave();};
      document.addEventListener('visibilitychange',visibility);window.addEventListener('resize',raster);
      document.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',leave);window.addEventListener('blur',leave);
      dispose=()=>{document.removeEventListener('visibilitychange',visibility);window.removeEventListener('resize',raster);document.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);window.removeEventListener('blur',leave);if(raf)cancelAnimationFrame(raf);clearTimeout(idleTimer);reset();halo.remove();light?.remove();root.classList.remove('flashlight-ready','flashlight-form');};
    };
    setup();mq.addEventListener('change',setup);return()=>{dispose();mq.removeEventListener('change',setup);};
  }, []);

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
          <WorkTile ids={['bmw-cinematic']} sectionId="work" n="01" label="VIDEOS / PRODUCT FILM" heading="Film and motion" />
          <WorkTile ids={['stepwell-carousel']} sectionId="visual-stories" n="02" label="IMAGES / CAROUSEL" heading="Images and visual stories" />
          <CoverStories />
          <Exhibition />
          <WorkTile ids={['sookha','tola','saanjh','mewform']} sectionId="brands" n="03" label="WEBSITES / D2C BRAND CONCEPTS" heading="Research, strategy and case studies"><Evidence embedded /></WorkTile>
          <WorkTile ids={['brain-explained']} sectionId="audio" n="04" label="AUDIO / PODCAST" heading="Sound and conversation" />
          <WorkTile ids={['light-mood-lab']} sectionId="creative-lab" n="05" label="WEB / INTERACTIVE STUDY" heading="Creative lab" />
          <Orbit />
          <Toolkit />
          <Contact />
          <About />
        </div>
      </main>
      <footer className="ftr"><div className="wrap"><span>© 2026 {profile.name}</span><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button></div></footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

import React from 'react';
import { Shuffle } from 'lucide-react';

const W = 320, H = 200, STEPS = 30;
function rng(seed: number) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

const PIECES = [
  { src: '/covers/issue-02.jpg', title: 'Issue 02 · The Lane That Kept My Name' },
  { src: '/covers/issue-05.jpg', title: 'Issue 05 · Half My Heart' },
  { src: '/covers/issue-09.jpg', title: 'Issue 09 · Kite Season' },
  { src: '/covers/issue-10.jpg', title: 'Issue 10 · Rooftop Radio' },
];

export function DenoiseTile() {
  const cv = React.useRef<HTMLCanvasElement>(null);
  const wrap = React.useRef<HTMLDivElement>(null);
  const reduce = React.useMemo(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const [step, setStep] = React.useState(reduce ? STEPS : 0);
  const [piece, setPiece] = React.useState(0);
  const played = React.useRef(false);
  const [clean, setClean] = React.useState<ImageData | null>(null);
  const noise = React.useMemo(() => {
    const nr = rng(4812 + piece * 99); const n = new Uint8ClampedArray(W * H);
    for (let i = 0; i < n.length; i++) n[i] = nr() * 255;
    return n;
  }, [piece]);
  React.useEffect(() => {
    let dead = false;
    const im = new Image();
    im.onload = () => {
      if (dead) return;
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const g = c.getContext('2d')!;
      const s = Math.max(W / im.width, H / im.height);
      const w = im.width * s, h = im.height * s;
      g.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
      setClean(g.getImageData(0, 0, W, H));
    };
    im.src = PIECES[piece].src;
    return () => { dead = true; };
  }, [piece]);
  React.useEffect(() => {
    const c = cv.current; if (!c || !clean) return; const g = c.getContext('2d')!;
    const out = g.createImageData(W, H); const a = 1 - step / STEPS; const k = a * a;
    for (let i = 0, p = 0; i < W * H; i++, p += 4) {
      const nv = noise[i];
      out.data[p] = clean.data[p] * (1 - k) + nv * k * 0.8;
      out.data[p + 1] = clean.data[p + 1] * (1 - k) + nv * k;
      out.data[p + 2] = clean.data[p + 2] * (1 - k) + nv * k * 0.85;
      out.data[p + 3] = 255;
    }
    g.putImageData(out, 0, 0);
  }, [step, clean, noise]);
  React.useEffect(() => {
    const el = wrap.current; if (!el || reduce) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || played.current) return; played.current = true;
      const t0 = performance.now();
      const tick = (t: number) => { const f = Math.min(1, (t - t0) / 3200); setStep(Math.round(f * 18)); if (f < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, [reduce]);
  return (
    <div className="t t-den" ref={wrap}>
      <p className="kicker"><b>03</b> / PROCESS</p>
      <h2 className="th">Watch a piece <em>form</em></h2>
      <div className="den-view"><canvas ref={cv} width={W} height={H} role="img" aria-label={`${PIECES[piece].title} clearing from noise as the step slider moves`} /></div>
      <div className="den-ctl">
        <label htmlFor="den-r" className="m">Step {String(step).padStart(2, '0')} / {STEPS} · {PIECES[piece].title}</label>
        <input id="den-r" type="range" min={0} max={STEPS} value={step} onChange={(e) => setStep(+e.target.value)} />
        <button className="btn btn-ghost" onClick={() => { setPiece((p) => (p + 1) % PIECES.length); setStep(0); played.current = true; }}><Shuffle size={14} /> Next piece</button>
      </div>
      <p className="note den-note">A visual simulation: finished Cover Stories images blend from random noise to the final artwork. These are not saved diffusion or generation steps.</p>
    </div>
  );
}

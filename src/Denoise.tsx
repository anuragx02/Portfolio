import React from 'react';
import { Shuffle } from 'lucide-react';

const W = 320, H = 200, STEPS = 30;
function rng(seed: number) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

export function DenoiseTile() {
  const cv = React.useRef<HTMLCanvasElement>(null);
  const wrap = React.useRef<HTMLDivElement>(null);
  const reduce = React.useMemo(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const [step, setStep] = React.useState(reduce ? STEPS : 0);
  const [seed, setSeed] = React.useState(4812);
  const played = React.useRef(false);
  const data = React.useMemo(() => {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d')!; const r = rng(seed);
    g.fillStyle = '#04100d'; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 9; i++) {
      const x = r() * W, y = r() * H, rad = 40 + r() * 110, hh = 150 + r() * 40, l = 40 + r() * 25;
      const gr = g.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, `hsla(${hh},85%,${l}%,.9)`); gr.addColorStop(1, `hsla(${hh},85%,${l}%,0)`);
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
    }
    g.strokeStyle = 'rgba(234,246,241,.5)'; g.lineWidth = 1.2;
    for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(W / 2, H / 2, 30 + i * 22, 14 + i * 10, r() * 3, 0, 6.28); g.stroke(); }
    const clean = g.getImageData(0, 0, W, H);
    const nr = rng(seed + 99); const noise = new Uint8ClampedArray(W * H);
    for (let i = 0; i < noise.length; i++) noise[i] = nr() * 255;
    return { clean, noise };
  }, [seed]);
  React.useEffect(() => {
    const c = cv.current; if (!c) return; const g = c.getContext('2d')!;
    const out = g.createImageData(W, H); const a = 1 - step / STEPS; const k = a * a;
    for (let i = 0, p = 0; i < W * H; i++, p += 4) {
      const nv = data.noise[i];
      out.data[p] = data.clean.data[p] * (1 - k) + nv * k * 0.8;
      out.data[p + 1] = data.clean.data[p + 1] * (1 - k) + nv * k;
      out.data[p + 2] = data.clean.data[p + 2] * (1 - k) + nv * k * 0.85;
      out.data[p + 3] = 255;
    }
    g.putImageData(out, 0, 0);
  }, [step, data]);
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
      <p className="kicker"><b>02</b> / PROCESS</p>
      <h2 className="th">Watch a piece <em>form</em></h2>
      <div className="den-view"><canvas ref={cv} width={W} height={H} role="img" aria-label="Placeholder artwork clearing from noise as the step slider moves" /><em className="ph">PLACEHOLDER ART</em></div>
      <div className="den-ctl">
        <label htmlFor="den-r" className="m">Step {String(step).padStart(2, '0')} / {STEPS} · seed {seed}</label>
        <input id="den-r" type="range" min={0} max={STEPS} value={step} onChange={(e) => setStep(+e.target.value)} />
        <button className="btn btn-ghost" onClick={() => { setSeed((s) => (s * 7 + 13) % 99991); setStep(0); }}><Shuffle size={14} /> New seed</button>
      </div>
      <p className="note den-note">Placeholder. The real version shows one of my generated pieces clearing from noise, with its prompt.</p>
    </div>
  );
}

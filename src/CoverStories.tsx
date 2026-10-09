import React from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

type Issue = { n: number; title: string; line: string };
const ISSUES: Issue[] = [
  { n: 1, title: 'What the Dark Kept Warm', line: 'An anatomy of slow mornings.' },
  { n: 2, title: 'The Lane That Kept My Name', line: 'Home was a direction, not a door.' },
  { n: 3, title: 'Last Bus Home', line: 'A field guide to missing it on purpose.' },
  { n: 4, title: "Everyone's Asleep", line: 'Notes from the unslept hours.' },
  { n: 5, title: 'Half My Heart', line: 'A love story in two cups.' },
  { n: 6, title: 'The Last Frame', line: "A filmmaker's desk, 2:14 AM." },
  { n: 7, title: 'The Tiffin Tales', line: 'Every tier is a letter from home.' },
  { n: 8, title: 'Dilli Ke Dhaabe', line: 'A midnight field guide.' },
  { n: 9, title: 'Kite Season', line: 'A complete guide to aerial diplomacy.' },
  { n: 10, title: 'Rooftop Radio', line: 'The only station the whole mohalla trusts.' },
];
/* hand-set leans, by chance not scheme */
const LEANS = [-2.6, 1.9, -1.3, 2.7, -2.1, 1.2, -1.7, 2.3, -1.5, 2.0];
const DIPS = [7, 2, 9, 4, 8, 3, 10, 5, 8, 2];
const num = (n: number) => String(n).padStart(2, '0');
const img = (n: number) => `/covers/issue-${num(n)}.jpg`;
const thumb = (n: number) => `/covers/issue-${num(n)}-thumb.jpg`;

export function CoverStories() {
  const [open, setOpen] = React.useState<number | null>(() => {
    const v = +(new URLSearchParams(location.search).get('issue') || 0);
    return v >= 1 && v <= ISSUES.length ? v - 1 : null;
  });
  React.useEffect(() => {
    const openReader = (e: Event) => {
      const n = Number((e as CustomEvent<number>).detail);
      if (n >= 1 && n <= ISSUES.length) setOpen(n - 1);
    };
    window.addEventListener('open-cover-stories', openReader);
    return () => window.removeEventListener('open-cover-stories', openReader);
  }, []);
  return (
    <div className="t t-covers" id="covers">
      <p className="kicker"><b>02</b> / COVER STORIES · {ISSUES.length} ISSUES</p>
      <h2 className="th">A magazine that <em>never prints</em></h2>
      <p className="note cs-note">Ten fictional issues from a city that only exists at night. Open one.</p>
      <div className="cs-stand" role="list" aria-label="Cover Stories issues">
        <i className="cs-glow" aria-hidden="true" />
        <div className="cs-row">
          {ISSUES.map((s, i) => (
            <button
              key={s.n}
              role="listitem"
              className="cs-issue"
              style={{ ['--r' as string]: `${LEANS[i]}deg`, ['--y' as string]: `${DIPS[i]}px` } as React.CSSProperties}
              onClick={() => setOpen(i)}
              aria-label={`Issue ${num(s.n)}: ${s.title}`}
            >
              <img src={thumb(s.n)} alt="" loading="lazy" />
              <b>{num(s.n)}</b>
            </button>
          ))}
        </div>
        <div className="cs-plank" aria-hidden="true" />
        <div className="cs-meta"><span>TEN ISSUES · ONE NIGHT CITY</span><span>PRINTED NOWHERE · READ HERE</span></div>
      </div>
      {open !== null && <Reader i={open} setI={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Reader({ i, setI, onClose }: { i: number; setI: (v: number) => void; onClose: () => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const n = ISSUES.length;
  const cur = ISSUES[i];
  React.useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    document.querySelectorAll('video').forEach((v) => v.pause());
    document.body.style.overflow = 'hidden';
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setI(Math.min(n - 1, i + 1));
      if (e.key === 'ArrowLeft') setI(Math.max(0, i - 1));
    };
    window.addEventListener('keydown', k);
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; prev?.focus(); };
  }, [i, n, setI, onClose]);
  return createPortal(
    <div className="csr" role="dialog" aria-modal="true" aria-label={`Cover Stories issue ${num(cur.n)}: ${cur.title}`} onClick={onClose}>
      <div className="csr-in" ref={ref} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        <button className="sb-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <figure className="csr-cover">
          <img src={img(cur.n)} alt={`Cover Stories issue ${num(cur.n)}, ${cur.title}`} />
        </figure>
        <div className="csr-side">
          <p className="kicker"><b>ISSUE {num(cur.n)}</b> / {num(n)}</p>
          <h3>{cur.title}</h3>
          <p className="csr-line"><em>{cur.line}</em></p>
          <div className="csr-nav">
            <button className="btn btn-ghost" disabled={i === 0} onClick={() => setI(i - 1)}><ArrowLeft size={14} /> Prev</button>
            <span className="m">{num(i + 1)} / {num(n)}</span>
            <button className="btn btn-ghost" disabled={i === n - 1} onClick={() => setI(i + 1)}>Next <ArrowRight size={14} /></button>
          </div>
          <ol className="csr-all" aria-label="All issues">
            {ISSUES.map((s, k) => (
              <li key={s.n}><button className={k === i ? 'on' : ''} onClick={() => setI(k)}><span>{num(s.n)}</span>{s.title}</button></li>
            ))}
          </ol>
        </div>
      </div>
    </div>,
    document.body
  );
}

import React from 'react';
import { Play } from 'lucide-react';

export type Film = { src: string; embedUrl?: string; poster: string; title: string; duration: string };

// All hosting lives in the data record. Moving a film to a CDN changes only src.
export function FilmPlayer({ film, preview = false }: { film: Film; preview?: boolean }) {
  const frame = React.useRef<HTMLDivElement>(null);
  const video = React.useRef<HTMLVideoElement>(null);
  const [near, setNear] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [embedStarted, setEmbedStarted] = React.useState(false);
  React.useEffect(() => {
    if (film.embedUrl) return;
    const el = frame.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setNear(true);
      const v = video.current;
      if (!entry.isIntersecting) { v?.pause(); return; }
      const saveData = (navigator as Navigator & { connection?: { saveData: boolean } }).connection?.saveData;
      if (preview && !saveData && !matchMedia('(prefers-reduced-motion: reduce)').matches && matchMedia('(pointer: fine)').matches) {
        v?.play().catch(() => {});
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [preview, near]);
  const play = () => { setNear(true); video.current?.play().catch(() => {}); };
  if (film.embedUrl) return <div className="film-player" ref={frame}>
    {embedStarted ? <iframe src={film.embedUrl} title={film.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <><img src={film.poster} alt="" /><button className="film-start" onClick={() => setEmbedStarted(true)} aria-label={`Play ${film.title}`}><Play size={24} fill="currentColor" /><span>Play film</span></button></>}
  </div>;
  return <div className="film-player" ref={frame}>
    <video ref={video} src={near ? film.src : undefined} poster={film.poster}
      controls playsInline muted preload="metadata" loop={preview}
      aria-label={film.title} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
    {!playing && <button className="film-start" onClick={play} aria-label={`Play ${film.title}`}><Play size={24} fill="currentColor" /><span>Play film</span></button>}
  </div>;
}

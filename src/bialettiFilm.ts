import type { Film } from './FilmPlayer';
import type { Project } from './projects';
import type { ProjectLink } from './timeFilm';
export const bialettiFilm: Film = {
  src: '/films/1-bialetti-i-made-you-one.mp4',
  poster: '/films/3-bialetti-poster.jpg',
  title: 'I Made You One', duration: '1:30', portrait: true, soundOn: true,
};
export const bialettiProject: Project & { links?: ProjectLink[] } = {
  id: 'bialetti-i-made-you-one', title: 'I Made You One', discipline: 'Videos', year: '2026',
  summary: 'One morning. Two cups. A small act of care. An independent concept film featuring the Bialetti Moka Express. Made for coffee. Meant for two.',
  cover: bialettiFilm.poster, film: bialettiFilm,
  tools: ['Google Flow', 'ElevenLabs', 'Edits'],
  links: [{ label: 'Original post on X', href: 'https://x.com/anuragx0202/status/2118255686396293121', external: true }],
  panels: [],
};

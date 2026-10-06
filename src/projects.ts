/* One list drives the whole Work module. Add a project = add one object.
   Leave `placeholder` off (or false) for real projects. Placeholders show a PLACEHOLDER tag. */
export type Discipline = 'AI Images' | 'AI Video' | 'Social' | 'Websites' | 'Creative AI';
export const DISCIPLINES: Discipline[] = ['AI Images', 'AI Video', 'Social', 'Websites', 'Creative AI'];

export type Panel = { caption: string; prompt?: string; image?: string };
export type Project = {
  id: string; title: string; discipline: Discipline; year?: string; summary: string;
  cover?: string; featured?: boolean; placeholder?: boolean; panels: Panel[]; tools?: string[];
};

const ph = (n: number, discipline: Discipline, featured = false): Project => ({
  id: `ph-${n}`, title: 'Project title', discipline, featured, placeholder: true,
  summary: 'One line on what this piece had to do.',
  panels: [
    { caption: 'The brief: what it had to do.' },
    { caption: 'First prompt and first result.', prompt: 'Prompt goes here' },
    { caption: 'What went wrong, and the fix.' },
    { caption: 'Final piece and what I learned.' },
  ],
});

/* REAL PROJECTS: add them here (they replace the placeholders automatically). */
export const realProjects: Project[] = [];

export const placeholderProjects: Project[] = [
  ph(1, 'AI Video', true), ph(2, 'AI Images'), ph(3, 'Social'), ph(4, 'Websites'), ph(5, 'Creative AI'),
];

export const projects: Project[] = realProjects.length ? realProjects : placeholderProjects;

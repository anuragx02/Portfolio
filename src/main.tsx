import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  Brain,
  Check,
  Clapperboard,
  Copy,
  ExternalLink,
  Globe2,
  Image,
  Laptop,
  Mail,
  MonitorPlay,
  Palette,
  Pause,
  Play,
  Power,
  Smartphone,
  Sparkles,
  Tv,
  Volume2,
  VolumeX,
} from 'lucide-react';
import './styles.css';
import { profile, skills, tools } from './data';

type IconProps = { className?: string };

function XIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.012 2c-5.508 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.237a9.982 9.982 0 0 0 4.779 1.221h.005c5.505 0 9.984-4.479 9.986-9.986.001-2.666-1.034-5.172-2.92-7.058A9.923 9.923 0 0 0 12.012 2Zm0 1.664c4.59 0 8.324 3.733 8.325 8.322 0 4.59-3.734 8.325-8.324 8.325a8.31 8.31 0 0 1-4.227-1.151l-.303-.18-3.136.741.748-3.056-.197-.314a8.29 8.29 0 0 1-1.211-4.367c0-4.588 3.733-8.32 8.325-8.32Zm4.568 11.257c-.251-.126-1.485-.733-1.715-.817-.23-.084-.398-.126-.566.126-.167.251-.649.817-.796.984-.146.167-.293.188-.544.063-.251-.126-1.06-.391-2.02-1.247-.746-.665-1.25-1.487-1.396-1.738-.146-.251-.016-.387.11-.512.113-.112.251-.293.376-.439.126-.146.167-.251.251-.418.084-.167.042-.314-.021-.439-.063-.126-.566-1.362-.776-1.864-.204-.488-.412-.422-.566-.43-.146-.008-.314-.01-.481-.01-.167 0-.439.063-.669.314-.23.251-.879.858-.879 2.094 0 1.236.9 2.43 1.025 2.597.126.167 1.77 2.703 4.29 3.791.6.259 1.068.413 1.433.529.602.191 1.15.164 1.583.099.483-.072 1.485-.607 1.694-1.193.209-.586.209-1.088.146-1.193-.063-.105-.209-.167-.46-.293Z" />
    </svg>
  );
}

const skillIcons = [Palette, Clapperboard, Smartphone, Globe2, Brain];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function Header() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = [
    ['Work', 'portfolio'],
    ['Skills', 'skills'],
    ['Tools', 'tools'],
    ['Connect', 'connect'],
  ];

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="container header-inner">
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          {profile.name.toUpperCase()}
        </button>
        <nav className="nav-links" aria-label="Primary navigation">
          {nav.map(([label, id]) => (
            <button key={id} onClick={() => scrollToSection(id)}>
              {label}
            </button>
          ))}
        </nav>
        <button className="connect-pill" onClick={() => scrollToSection('connect')}>
          Hire me
        </button>
      </div>
    </header>
  );
}

function Hero() {
  const [activeChip, setActiveChip] = React.useState<string | null>(null);
  const chips = [
    ['ai-video', 'AI VIDEO', 'AI generation + editing + storytelling', Clapperboard],
    ['ai-images', 'AI IMAGES', 'Generative visuals + creative editing', Image],
    ['carousels', 'CAROUSELS', 'Social media visual content', Smartphone],
    ['websites', 'WEBSITES', 'Interactive AI-assisted websites', Laptop],
    ['creative-ai', 'CREATIVE AI', 'Prompting + ideation + AI workflows', Brain],
  ];

  return (
    <section id="hero" className="hero section-dark">
      <div className="hero-bg">
        <div className="dot-grid" />
        <div className="line-grid" />
        <div className="glow glow-one" />
        <div className="glow glow-two" />
      </div>
      <div className="container hero-grid">
        <div className="hero-copy reveal">
          <div className="doodle doodle-ai">
            <Sparkles size={20} />
            <span>made with AI ✦</span>
          </div>
          <div className="eyebrow">
            <Sparkles size={14} />
            AI CREATIVE • CONTENT • DIGITAL EXPERIENCES
          </div>
          <div className="hero-title">
            <Sparkles className="title-spark" size={20} />
            <h1>Hi, I&apos;m <span>Anurag.</span></h1>
            <h2>
              An <span className="gradient-word">AI</span> <span className="underlined-word">Content Creator.</span>
            </h2>
          </div>
          <div className="fellowship-card">
            <span className="fellowship-logo">IF</span>
            <span><strong>AI Creator Fellowship</strong> · India Future AI</span>
            <ExternalLink size={14} />
          </div>
          <p>I create AI-powered images, videos, social content and digital experiences.</p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => scrollToSection('portfolio')}>
              See the work <ArrowDown size={16} />
            </button>
            <button className="secondary-btn" onClick={() => scrollToSection('connect')}>
              <Mail size={16} /> Hire me
            </button>
          </div>
        </div>
        <div className="hero-portrait reveal">
          <div className="portrait-ring">
            <div className="portrait-placeholder" aria-label="Portrait placeholder" />
          </div>
          {chips.map(([id, label, tooltip, Icon], index) => (
            <button
              key={id as string}
              className={`floating-chip chip-${index + 1}`}
              onMouseEnter={() => setActiveChip(id as string)}
              onMouseLeave={() => setActiveChip(null)}
            >
              <Icon size={14} />
              <span>{label as string}</span>
              {activeChip === id && <em>{tooltip as string}</em>}
            </button>
          ))}
        </div>
      </div>
      <div className="container reel-wrap reveal">
        <div className="reel-frame" role="img" aria-label="Showreel placeholder">
          <span className="ph-tag">PLACEHOLDER</span>
          <span className="reel-play"><Play size={28} /></span>
          <strong>Showreel goes here</strong>
          <small>Drop in a 30-60s cut of your best AI video work (MP4 or embed)</small>
        </div>
      </div>
      <button className="explore-work" onClick={() => scrollToSection('portfolio')}>
        <span>SCROLL</span>
        <span className="scroll-circle"><ArrowDown size={14} /></span>
      </button>
    </section>
  );
}

function SkillsSection() {
  const [active, setActive] = React.useState<string | null>(null);
  return (
    <section id="skills" className="section section-alt">
      <div className="container">
        <SectionHeader kicker="02 / CAPABILITIES" title="What I Do" note="100% AI creative workflow ⚡" />
        <div className="skills-grid">
          {skills.map((skill, index) => {
            const Icon = skillIcons[index] ?? Sparkles;
            const isActive = active === skill.id;
            return (
              <article
                key={skill.id}
                className={`skill-card ${isActive ? 'active' : ''}`}
                onMouseEnter={() => setActive(skill.id)}
                onMouseLeave={() => setActive(null)}
              >
                <div className="skill-top">
                  <span className="skill-emoji">{skill.icon}</span>
                  {isActive && <Sparkles className="sparkle-small" size={14} />}
                </div>
                <h3>{skill.title}</h3>
                <p>{skill.shortDesc}</p>
                <div className="tool-list">
                  {skill.toolsUsed.map((tool) => <span key={tool}>{tool}</span>)}
                </div>
                <Icon className="card-watermark" size={80} />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ToolsSection() {
  return (
    <section id="tools" className="section section-dark tools-section">
      <div className="container">
        <SectionHeader kicker="03 / AI TOOLKIT" title="Tools I Use" note="workflow stack ✦" centered />
        <div className="tools-grid">
          {tools.map((tool) => (
            <article key={tool.name} className="tool-card">
              <div>
                <span>{tool.category}</span>
                <h3>{tool.name}</h3>
              </div>
              <p>{tool.usage}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const caseStudies = [
  { n: '01', title: 'Case study title', kind: 'AI video' },
  { n: '02', title: 'Case study title', kind: 'AI images' },
  { n: '03', title: 'Case study title', kind: 'Social content' },
  { n: '04', title: 'Case study title', kind: 'Interactive build' },
];

function WorkSection() {
  return (
    <section id="portfolio" className="section section-dark work-section">
      <div className="container">
        <SectionHeader kicker="01 / SELECTED WORK" title="Process, not just output" note="Each piece shows the brief, the prompts, the iterations and the result." />
        <div className="work-grid">
          {caseStudies.map((c) => (
            <article key={c.n} className="work-card">
              <div className="work-media"><span className="ph-tag">PLACEHOLDER</span><MonitorPlay size={30} /></div>
              <div className="work-body">
                <span className="work-num">{c.n} · {c.kind}</span>
                <h3>{c.title}</h3>
                <ul>
                  <li><b>Brief</b> What the piece had to do</li>
                  <li><b>Process</b> Prompt iterations, tools, before / after</li>
                  <li><b>Result</b> Final piece and what you learned</li>
                </ul>
              </div>
            </article>
          ))}
        </div>
        <div className="build-card">
          <span className="ph-tag">PLACEHOLDER</span>
          <h3>Something I built</h3>
          <p>One interactive piece you made, with a short note on how it works.</p>
        </div>
      </div>
    </section>
  );
}

function PlaceholderSection({ id, title }: { id: string; title: string }) {
  return (
    <section id={id} className="section section-dark placeholder-section">
      <div className="container narrow">
        <SectionHeader kicker="COMING SOON" title={title} note="Content will be added later." />
      </div>
    </section>
  );
}

function ContactSection() {
  const [copied, setCopied] = React.useState(false);
  const copyEmail = async () => {
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  const socials = [
    ['LinkedIn', profile.linkedin, <ExternalLink className="sky" size={16} />],
    ['GitHub', profile.github, <ExternalLink className="emerald" size={16} />],
    ['X', profile.x, <XIcon />],
  ];

  return (
    <section id="connect" className="section contact-section">
      <div className="contact-glow" />
      <div className="container narrow">
        <div className="contact-heading">
          <span>04 / HIRE ME</span>
          <h2>Let&apos;s create something interesting.</h2>
          <p>Have an idea, project or opportunity? Email me directly.</p>
          <a className="primary-btn hire-btn" href={`mailto:${profile.email}?subject=Hiring%20inquiry`}><Mail size={16} /> Hire me</a>
        </div>
        <div className="email-card">
          <Sparkles className="email-spark" size={20} />
          <div className="email-left">
            <div className="email-icon"><Mail size={20} /></div>
            <div>
              <span>EMAIL ME DIRECTLY</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </div>
          </div>
          <button className={copied ? 'copied' : ''} onClick={copyEmail}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="socials-block">
          <span>FIND ME ON SOCIAL MEDIA</span>
          <div>
            {socials.map(([name, url, icon]) => (
              <a key={name as string} href={url as string} target="_blank" rel="noreferrer">
                {icon}<span>{name}</span><ExternalLink size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container footer-inner">
        <span>© 2026 {profile.name}. All rights reserved.</span>
        <div>
          <span>AI Creative • Visual Storyteller</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top"><ArrowUp size={14} /></button>
        </div>
      </div>
    </footer>
  );
}

function SectionHeader({ kicker, title, note, centered = false }: { kicker: string; title: string; note?: string; centered?: boolean }) {
  return (
    <div className={`section-heading ${centered ? 'centered' : ''}`}>
      <div>
        <span>{kicker}</span>
        <h2>{title}</h2>
      </div>
      {note && <p>{note}</p>}
    </div>
  );
}

function App() {
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal, section > .container').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <WorkSection />
        <SkillsSection />
        <ToolsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

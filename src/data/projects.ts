export type ProjectLinks = {
  live?: string;
  repo?: string;
};

export type Project = {
  slug: string;
  index: string;
  year: string;
  role: string;
  stack: string[];
  links: ProjectLinks;
  statusKey?: "inDevelopment";
  image: string;
};

export const projects: Project[] = [
  {
    slug: "saas-barber",
    index: "01",
    year: "2025 — Ongoing",
    role: "Full Stack & Product Design",
    stack: ["Next.js", "Supabase", "TypeScript"],
    links: {},
    statusKey: "inDevelopment",
    image: "/work/saas-barber.jpg",
  },
  {
    slug: "handoff",
    index: "02",
    year: "2025",
    role: "Creator — Design & Development",
    stack: ["Figma Plugin API", "TypeScript"],
    links: { repo: "https://github.com/Jitterkkk/handoff-diff-tool" },
    image: "/work/handoff.jpg",
  },
  {
    slug: "promo-agent",
    index: "03",
    year: "2025",
    role: "Solo Developer",
    stack: ["Python", "Groq", "Supabase", "Redis"],
    links: {},
    image: "/work/promo-agent.jpg",
  },
  {
    slug: "anhanga-radar",
    index: "04",
    year: "2025",
    role: "Solo Developer",
    stack: ["Python", "Tkinter", "Groq NLP"],
    links: { repo: "https://github.com/Jitterkkk/anhanga-radar" },
    image: "/work/anhanga-radar.jpg",
  },
  {
    slug: "advocacia-argenton",
    index: "05",
    year: "2025",
    role: "Design & Development",
    stack: ["Web", "Vercel"],
    links: { live: "https://landingpage-advocacia-ten.vercel.app" },
    image: "/work/advocacia-argenton.jpg",
  },
];

export type Project = {
  slug: string;
  index: string;
  tab: string;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  platform: string;
  categories: string[];
};

export const projects: Project[] = [
  {
    slug: "viled",
    index: "01",
    tab: "CODE DE VIE",
    title: "CODE DE VIE",
    subtitle: "E-commerce ecosystem",
    year: "2026",
    role: "Senior product designer",
    platform: "Web / iOS / Android",
    categories: ["Product design", "E-commerce", "React Native"],
  },
  {
    slug: "pdp-guard",
    index: "02",
    tab: "PDP GUARD",
    title: "PDP GUARD",
    subtitle: "E-commerce quality platform",
    year: "2026",
    role: "Founder / Product designer / Art director",
    platform: "Web / SaaS",
    categories: ["Product design", "Product building"],
  },
  {
    slug: "viled-design-system",
    index: "03",
    tab: "DESIGN SYSTEM",
    title: "DESIGN SYSTEMS",
    subtitle: "Cross-platform design infrastructure",
    year: "2025—26",
    role: "Product designer",
    platform: "Web / iOS / Android",
    categories: ["Design system", "Infrastructure"],
  },
];

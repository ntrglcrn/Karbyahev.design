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
    tab: "VILED",
    title: "VILED",
    subtitle: "E-commerce ecosystem",
    year: "2025—26",
    role: "Product designer",
    platform: "Web / iOS / Android",
    categories: ["Product design", "E-commerce"],
  },
  {
    slug: "pdp-guard",
    index: "02",
    tab: "PDP GUARD",
    title: "PDP GUARD",
    subtitle: "E-commerce quality platform",
    year: "2026",
    role: "Product design / Product building",
    platform: "Web / SaaS",
    categories: ["Product design", "Product building"],
  },
  {
    slug: "viled-design-system",
    index: "03",
    tab: "DESIGN SYSTEM",
    title: "VILED DESIGN SYSTEM",
    subtitle: "Cross-platform design infrastructure",
    year: "2025—26",
    role: "Product design",
    platform: "Web / iOS / Android",
    categories: ["Design system", "Infrastructure"],
  },
  {
    slug: "mobile-commerce",
    index: "04",
    tab: "MOBILE",
    title: "MOBILE COMMERCE",
    subtitle: "Luxury e-commerce mobile experience",
    year: "2025—26",
    role: "Product design",
    platform: "iOS / Android",
    categories: ["Product design", "Mobile commerce"],
  },
];

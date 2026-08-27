import Hero from "@/components/hero";
import ProjectPreview, { type Project } from "@/components/project-preview";

const projects: Project[] = [
  {
    index: "01",
    title: "VILED",
    subtitle: "E-commerce ecosystem",
    year: "2025—26",
    role: "Product designer",
    platform: "Web / iOS / Android",
    categories: ["Product design", "E-commerce"],
  },
  {
    index: "02",
    title: "PDP GUARD",
    subtitle: "E-commerce quality platform",
    year: "2026",
    role: "Product design / Product building",
    platform: "Web / SaaS",
    categories: ["Product design", "Product building"],
    layout: "technical",
  },
  {
    index: "03",
    title: "VILED DESIGN SYSTEM",
    subtitle: "Cross-platform design infrastructure",
    year: "2025—26",
    role: "Product design",
    platform: "Web / iOS / Android",
    categories: ["Design system", "Infrastructure"],
    layout: "system",
  },
  {
    index: "04",
    title: "MOBILE COMMERCE",
    subtitle: "Luxury e-commerce mobile experience",
    year: "2025—26",
    role: "Product design",
    platform: "iOS / Android",
    categories: ["Product design", "Mobile commerce"],
    layout: "media",
  },
];

export default function SelectedWork() {
  const [leadProject, ...futureProjects] = projects;

  return (
    <>
      <Hero><ProjectPreview project={leadProject} /></Hero>
      {futureProjects.map((project) => <ProjectPreview project={project} key={project.index} />)}
    </>
  );
}

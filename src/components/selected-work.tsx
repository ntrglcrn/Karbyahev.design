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

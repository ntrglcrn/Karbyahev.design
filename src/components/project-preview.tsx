export type Project = {
  index: string;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  platform: string;
  categories: string[];
};

export default function ProjectPreview({ project, media }: { project: Project; media?: ReactNode }) {
  const titleId = `project-${project.index}-title`;

  return (
    <article
      className="sticky top-0 z-20 flex h-[100svh] flex-col bg-[#f5f3ed] px-[var(--page-gutter)] pb-6 pt-5 text-[#1500e1] motion-reduce:static motion-reduce:h-auto motion-reduce:min-h-[100svh] sm:pb-8 sm:pt-6"
      aria-labelledby={titleId}
    >
      <div className="grid grid-cols-2 border-t border-current pt-2 text-xs font-medium uppercase tracking-[0.18em] md:grid-cols-12">
        <span className="md:col-span-1">{project.index}</span>
        <span className="text-right md:col-start-12">{project.year}</span>
      </div>
      <div className="mt-[clamp(1.5rem,4vw,4rem)] md:grid md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-8">
          <h2 id={titleId} className="[font-family:var(--font-arizona)] text-[clamp(4.5rem,14vw,13rem)] font-normal leading-[0.78] tracking-[-0.08em]">{project.title}</h2>
          <p className="mt-3 text-xl tracking-[-0.04em] sm:text-2xl">{project.subtitle}</p>
        </div>
        <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] md:col-start-10 md:mt-3">Role — {project.role}</p>
      </div>
      <div className="mt-8 md:grid md:grid-cols-12 md:gap-x-6 md:mt-10">
        <div className="h-[clamp(250px,32svh,320px)] bg-[#d8d6d0] md:col-span-12 md:h-[clamp(360px,48svh,620px)]" aria-hidden={!media}>
          {media}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-current pt-2 text-xs font-medium uppercase tracking-[0.18em] md:grid-cols-12">
        {project.categories.map((category) => <span className="md:col-span-3" key={category}>{category}</span>)}
        <span className="text-right md:col-span-3 md:text-left">{project.platform}</span>
      </div>
    </article>
  );
}
import type { ReactNode } from "react";

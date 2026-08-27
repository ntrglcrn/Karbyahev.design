import type { ReactNode } from "react";

export type Project = {
  index: string;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  platform: string;
  categories: string[];
  layout?: "technical" | "system" | "media";
};

export default function ProjectPreview({ project, media }: { project: Project; media?: ReactNode }) {
  const titleId = `project-${project.index}-title`;
  const mediaFirst = project.layout === "media";
  const titleSize = project.layout === "technical"
    ? "text-[clamp(4rem,9vw,9rem)]"
    : project.layout === "system"
      ? "text-[clamp(3.25rem,7vw,7rem)]"
      : mediaFirst
        ? "text-[clamp(3.5rem,8vw,8rem)]"
        : "text-[clamp(4.5rem,14vw,13rem)]";

  return (
    <article
      className="sticky top-0 z-20 flex min-h-[100svh] flex-col bg-[#f5f3ed] px-[var(--page-gutter)] pb-6 pt-5 text-[#1500e1] motion-reduce:static sm:pb-8 sm:pt-6 md:h-[100svh]"
      aria-labelledby={titleId}
    >
      <div className="order-0 grid grid-cols-2 border-t border-current pt-2 text-xs font-medium uppercase tracking-[0.18em] md:grid-cols-12">
        <span className="md:col-span-1">{project.index}</span>
        <span className="text-right md:col-start-12">{project.year}</span>
      </div>
      <div className={`${mediaFirst || project.layout === "technical" ? "mt-6 md:mt-8" : "mt-[clamp(1.5rem,4vw,4rem)]"} ${mediaFirst ? "order-2" : "order-1"} md:grid md:grid-cols-12 md:gap-x-6`}>
        <div className={`md:col-span-8 ${project.layout === "system" ? "md:col-start-2" : ""}`}>
          <h2 id={titleId} className={`[font-family:var(--font-arizona)] ${titleSize} font-normal leading-[0.78] tracking-[-0.08em]`}>{project.title}</h2>
          <p className="mt-3 text-xl tracking-[-0.04em] sm:text-2xl">{project.subtitle}</p>
        </div>
        <p className={`mt-5 text-xs font-medium uppercase tracking-[0.18em] md:mt-3 ${project.layout === "technical" ? "md:col-start-9 md:col-span-3" : "md:col-start-10"}`}>Role — {project.role}</p>
      </div>
      <div className={`min-h-[250px] flex-1 bg-[#d8d6d0] md:min-h-0 ${mediaFirst ? "order-1 mt-6 md:mt-8" : "order-2 mt-6 md:mt-8"} ${project.layout === "system" ? "md:ml-[8.333%]" : ""}`} aria-hidden={!media}>
        {media}
      </div>
      <div className="order-3 mt-3 grid grid-cols-2 gap-3 border-t border-current pt-2 text-xs font-medium uppercase tracking-[0.18em] md:grid-cols-12">
        {project.categories.map((category) => <span className="md:col-span-3" key={category}>{category}</span>)}
        <span className="text-right md:col-span-3 md:text-left">{project.platform}</span>
      </div>
    </article>
  );
}

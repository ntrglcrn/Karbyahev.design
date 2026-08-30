import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/components/project-data";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-surface-file px-page-gutter py-stack-lg text-ink-on-light">
      <nav className="type-label-eyebrow border-top-hairline flex justify-between border-current pt-stack-sm uppercase">
        <Link className="focus-ring" href="/">← Project files</Link>
        <span>{project.index} / {String(projects.length).padStart(2, "0")}</span>
      </nav>
      <article className="flex min-h-[calc(100svh-5rem)] flex-col justify-between pt-[14svh]">
        <div>
          <p className="type-label-eyebrow uppercase">{project.categories.join(" · ")}</p>
          <h1 className="type-display-case measure-display mt-stack">{project.title}</h1>
          <p className="type-body-intro mt-stack-lg">{project.subtitle}</p>
        </div>
        <dl className="type-label-metadata border-top-hairline grid grid-cols-2 gap-grid border-current py-stack-md uppercase md:grid-cols-3">
          <div><dt className="opacity-subdued">Year</dt><dd className="mt-stack-xs">{project.year}</dd></div>
          <div><dt className="opacity-subdued">Role</dt><dd className="mt-stack-xs">{project.role}</dd></div>
          <div><dt className="opacity-subdued">Platform</dt><dd className="mt-stack-xs">{project.platform}</dd></div>
        </dl>
      </article>
    </main>
  );
}

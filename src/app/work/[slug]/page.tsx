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
    <main className="min-h-screen bg-[#f5f3ed] px-[var(--page-gutter)] py-6 text-[#1500e1]">
      <nav className="flex justify-between border-t border-current pt-2 text-xs font-semibold uppercase tracking-[.18em]">
        <Link className="focus-visible:outline-2 focus-visible:outline-offset-4" href="/">← Project files</Link>
        <span>{project.index} / {String(projects.length).padStart(2, "0")}</span>
      </nav>
      <article className="flex min-h-[calc(100svh-5rem)] flex-col justify-between pt-[14svh]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em]">{project.categories.join(" · ")}</p>
          <h1 className="mt-5 max-w-[12ch] text-[clamp(4rem,13vw,13rem)] leading-[.78]">{project.title}</h1>
          <p className="mt-6 text-[clamp(1.25rem,2vw,2rem)] tracking-[-.04em]">{project.subtitle}</p>
        </div>
        <dl className="grid grid-cols-2 gap-4 border-t border-current py-4 text-xs uppercase tracking-[.14em] md:grid-cols-3">
          <div><dt className="opacity-55">Year</dt><dd className="mt-1">{project.year}</dd></div>
          <div><dt className="opacity-55">Role</dt><dd className="mt-1">{project.role}</dd></div>
          <div><dt className="opacity-55">Platform</dt><dd className="mt-1">{project.platform}</dd></div>
        </dl>
      </article>
    </main>
  );
}

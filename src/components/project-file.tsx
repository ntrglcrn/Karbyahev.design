"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Project } from "./project-data";
import styles from "./project-file.module.css";

export default function ProjectFile({ project, order, total }: { project: Project; order: number; total: number }) {
  const titleId = `project-${project.index}-title`;
  const item = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = item.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.dataset.visible = "true";
      observer.disconnect();
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <article ref={item} className={styles.item} data-tab={order % 4} style={{ zIndex: order + 1 }} aria-labelledby={titleId}>
      <Link
        className={`${styles.folder} focus-ring`}
        data-tone={order % 3}
        href={`/work/${project.slug}`}
        prefetch={false}
        aria-label={`Open ${project.title} case study`}
      >
        <span className={`${styles.tab} type-label-tab`}>{project.tab}</span>
        <span className={styles.body}>
          <span className={`${styles.topline} type-label-metadata`}>
            <span>{project.index} / {String(total).padStart(2, "0")}</span>
            <span className={styles.open}>Open case <span aria-hidden="true">↗</span></span>
          </span>

          <span className={styles.content}>
            <span className={`${styles.discipline} type-label-metadata`}>{project.categories.join(" · ")}</span>
            <h2 className={`${styles.title} type-display-project`} id={titleId}>{project.title}</h2>
            <span className={`${styles.subtitle} type-body-lead`}>{project.subtitle}</span>
          </span>

          <span className={styles.sheet} aria-hidden="true">
            <span className={styles.sheetBar}><i /><i /><i /></span>
            <span className={styles.sheetGrid}>
              <i /><i /><i /><i /><i /><i />
            </span>
            <span className={styles.sheetFooter}><i /><i /></span>
          </span>

          <span className={`${styles.meta} type-label-metadata`}>
            <span><small className="type-caption-metadata opacity-subdued">Year</small>{project.year}</span>
            <span><small className="type-caption-metadata opacity-subdued">Role</small>{project.role}</span>
            <span><small className="type-caption-metadata opacity-subdued">Platform</small>{project.platform}</span>
          </span>
        </span>
      </Link>
    </article>
  );
}

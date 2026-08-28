import ProjectFile from "./project-file";
import { projects } from "./project-data";
import styles from "./project-file.module.css";

export default function SelectedWork() {
  return (
    <section className={styles.section} aria-labelledby="selected-work-title">
      <header className={styles.heading}>
        <span id="selected-work-title">Selected work</span>
        <span>01—{String(projects.length).padStart(2, "0")}</span>
      </header>
      <div className={styles.stack}>
        {projects.map((project, order) => (
          <ProjectFile key={project.slug} order={order} project={project} total={projects.length} />
        ))}
      </div>
    </section>
  );
}

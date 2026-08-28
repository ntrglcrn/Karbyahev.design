import styles from "./hero-collaborators.module.css";

const collaborators = [
  ["Alexandr", styles.design],
  ["Sabina", styles.product],
  ["Zhaniya", styles.engineering],
  ["Dias", styles.founder],
] as const;

export default function HeroCollaborators() {
  return (
    <div className={styles.layer} aria-hidden="true">
      <div className={styles.stage}>
        {collaborators.map(([name, className]) => (
          <div className={`${styles.cursor} ${className}`} key={name}>
            <svg viewBox="0 0 18 22" fill="none" aria-hidden="true">
              <path d="M1.25 1.25 16.1 12.1l-7.15 1.28-3.88 6.2L1.25 1.25Z" fill="currentColor" stroke="#1500e1" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
            <span className={styles.label}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

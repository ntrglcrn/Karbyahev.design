"use client";

import { useEffect, useRef } from "react";
import HeroCollaborators from "./hero-collaborators";
import styles from "./final-scene.module.css";

const stages = ["DESIGN", "PRODUCT", "BUILD", "SHIP"];
const stageStarts = [-.1, .1, .3, .5];

const pauseAtCenter = (progress: number) => {
  if (progress < .42) return .5 * (1 - (1 - progress / .42) ** 3);
  if (progress <= .58) return .5;
  return .5 + .5 * ((progress - .58) / .42) ** 3;
};

export default function FinalScene() {
  const scene = useRef<HTMLElement>(null);
  const cta = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const element = scene.current;
    const link = cta.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || !link || reduceMotion.matches) return;

    let frame = 0;
    let target = 0;
    let current = 0;
    const render = () => {
      current += (target - current) * .1;
      if (Math.abs(target - current) < .0001) current = target;
      element.style.setProperty("--progress", current.toFixed(4));
      stageStarts.forEach((start, index) => {
        const local = Math.min(Math.max((current - start) / .2, 0), 1);
        element.style.setProperty(`--stage-${index}`, pauseAtCenter(local).toFixed(4));
      });
      element.dataset.final = String(current > .77);
      frame = current === target ? 0 : requestAnimationFrame(render);
    };
    const update = () => {
      const rect = element.getBoundingClientRect();
      target = Math.min(Math.max(-rect.top / Math.max(rect.height - innerHeight, 1), 0), 1);
      if (!frame) frame = requestAnimationFrame(render);
    };
    const pointer = (event: PointerEvent) => {
      const rect = link.getBoundingClientRect();
      link.style.setProperty("--x", `${((event.clientX - rect.left) / rect.width - .5) * 1.4}rem`);
      link.style.setProperty("--y", `${((event.clientY - rect.top) / rect.height - .5) * .7}rem`);
    };
    const reset = () => { link.style.setProperty("--x", "0rem"); link.style.setProperty("--y", "0rem"); };

    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    link.addEventListener("pointermove", pointer, { passive: true });
    link.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      link.removeEventListener("pointermove", pointer);
      link.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <footer ref={scene} className={styles.scene}>
      <div className={styles.sticky}>
        <div className={styles.sequence} role="img" aria-label="Design, product, build, ship">
          {stages.map((stage, index) => (
            <span key={stage} className={`${styles.word} type-display-sequence`} data-stage={index} aria-hidden="true">
              {stage}
            </span>
          ))}
        </div>

        <div className={styles.finale}>
          <div className={styles.ctaStage}>
            <HeroCollaborators />
            <a ref={cta} className={`${styles.cta} type-display-cta focus-ring`} href="https://t.me/ntrglcrn">
              <span>LET’S BUILD</span>
              <span>SOMETHING.</span>
            </a>
          </div>
          <nav className={styles.contacts} aria-label="Contact links">
            <a className="focus-ring" href="mailto:alexandrkarb@gmail.com"><small className="type-caption-metadata">Email</small><span className="type-link-contact">alexandrkarb@gmail.com ↗</span></a>
            <a className="focus-ring" href="https://instagram.com/ntrglcrnn"><small className="type-caption-metadata">Instagram</small><span className="type-link-contact">@ntrglcrnn ↗</span></a>
            <a className="focus-ring" href="https://t.me/ntrglcrn"><small className="type-caption-metadata">Telegram</small><span className="type-link-contact">@ntrglcrn ↗</span></a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

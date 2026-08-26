"use client";

import { useEffect, useRef } from "react";

const lines = [
  { text: "Product", shift: -0.16, lift: 10 },
  { text: "Designer", shift: 0.23, lift: -6 },
  { text: "Building", shift: -0.1, lift: 5 },
  { text: "Digital", shift: 0.18, lift: -8 },
  { text: "Commerce", shift: -0.06, lift: 4 },
];

export default function Hero() {
  const hero = useRef<HTMLElement>(null);
  const text = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let current = 0;
    let target = 0;

    const render = () => {
      const section = hero.current;
      if (!section) return;

      if (reduceMotion.matches) {
        text.current.forEach((line) => {
          if (line) line.style.transform = "";
        });
        return;
      }

      current += (target - current) * 0.12;
      const scale = window.innerWidth < 640 ? 0.22 : window.innerWidth < 1024 ? 0.55 : 1;

      lines.forEach(({ shift, lift }, index) => {
        const line = text.current[index];
        if (line) line.style.transform = `translate3d(${current * shift * window.innerWidth * scale}px, ${current * lift}px, 0)`;
      });

      frame = Math.abs(target - current) > 0.001 ? requestAnimationFrame(render) : 0;
    };

    const update = () => {
      const section = hero.current;
      if (!section) return;
      target = Math.min(Math.max(window.scrollY / Math.max(section.offsetHeight - window.innerHeight, 1), 0), 1);
      if (!frame) frame = requestAnimationFrame(render);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section ref={hero} className="container flex min-h-[150svh] items-center overflow-clip py-12">
      <div className="w-full">
        <p className="mb-8 text-xs font-medium uppercase tracking-[0.18em] text-accent sm:mb-12">
          Almaty — Product Design
        </p>
        <h1
          className="flex flex-col text-[clamp(4rem,10vw,10rem)] leading-[0.82] tracking-[-0.075em]"
          aria-label="Product Designer Building Digital Commerce"
        >
          {lines.map(({ text: line }, index) => (
            <span
              className="block w-max max-w-none whitespace-nowrap will-change-transform"
              key={line}
              ref={(element) => { text.current[index] = element; }}
            >
              {line}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}

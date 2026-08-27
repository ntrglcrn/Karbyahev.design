"use client";

import { useEffect, useRef } from "react";

const lines = [
  { text: "Product", initialClass: "ml-0", travelX: -0.015 },
  { text: "Designer", initialClass: "ml-[5%] md:ml-[10%] lg:ml-[18%]", travelX: -0.09 },
  { text: "Building", initialClass: "ml-[1%] md:ml-0 lg:-ml-[8%]", travelX: 0.16 },
  { text: "Digital", initialClass: "ml-[8%] md:ml-[15%] lg:ml-[28%]", travelX: -0.2, travelY: -5, scaleDelta: 0.006 },
  { text: "Commerce", initialClass: "ml-0 md:-ml-[4%] lg:-ml-[14%]", travelX: 0.075, travelY: 3 },
];

export default function Hero() {
  const hero = useRef<HTMLElement>(null);
  const text = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let target = 0;
    let current = 0;

    const clearTransforms = () => {
      text.current.forEach((line) => {
        if (line) line.style.transform = "";
      });
    };

    const render = () => {
      if (reduceMotion.matches) {
        clearTransforms();
        frame = 0;
        return;
      }

      current += (target - current) * 0.12;
      const travelScale = window.innerWidth < 640 ? 0.28 : window.innerWidth < 1024 ? 0.62 : 1;
      const progress = current * (2 - current);

      lines.forEach(({ travelX, travelY = 0, scaleDelta = 0 }, index) => {
        const line = text.current[index];
        if (line) {
          line.style.transform = `translate3d(${progress * travelX * window.innerWidth * travelScale}px, ${progress * travelY}px, 0) scale(${1 + progress * scaleDelta})`;
        }
      });

      frame = Math.abs(target - current) > 0.001 ? requestAnimationFrame(render) : 0;
    };

    const update = () => {
      const section = hero.current;
      if (!section) return;
      if (reduceMotion.matches) {
        clearTransforms();
        return;
      }
      const rect = section.getBoundingClientRect();
      target = Math.min(Math.max(-rect.top / Math.max(rect.height - window.innerHeight, 1), 0), 1);
      if (!frame) frame = requestAnimationFrame(render);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    reduceMotion.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      reduceMotion.removeEventListener("change", update);
    };
  }, []);

  return (
    <section ref={hero} className="relative h-[180svh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-x-clip py-12">
        <div className="container w-full -translate-y-[3svh]">
          <p className="mb-8 text-xs font-medium uppercase tracking-[0.18em] text-accent sm:mb-12">
            Almaty — Product Design
          </p>
          <h1
            className="flex flex-col text-[clamp(3.55rem,17vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.075em] md:text-[clamp(4.8rem,11.3vw,10.8rem)] md:leading-[0.84]"
            aria-label="Product Designer Building Digital Commerce"
          >
            {lines.map(({ text: line, initialClass, travelX, travelY, scaleDelta }, index) => (
              <span
                className={`block w-max max-w-none whitespace-nowrap ${initialClass} ${travelX || travelY || scaleDelta ? "will-change-transform" : ""}`}
                key={line}
                ref={(element) => { text.current[index] = element; }}
              >
                {line}
              </span>
            ))}
          </h1>
        </div>
      </div>
    </section>
  );
}

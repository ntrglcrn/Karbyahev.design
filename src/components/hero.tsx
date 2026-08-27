"use client";

import { useEffect, useRef } from "react";

const lines = [
  { text: "PRODUCT", initialClass: "ml-0", travelX: -0.015 },
  { text: "DESIGNER", initialClass: "ml-[5%] md:ml-[10%] lg:ml-[18%]", travelX: -0.09 },
  { text: "BUILDING", initialClass: "ml-[1%] md:ml-0 lg:ml-0", travelX: 0.16 },
  { text: "DIGITAL", initialClass: "ml-[8%] md:ml-[15%] lg:ml-[28%]", travelX: -0.2, travelY: -5, scaleDelta: 0.006 },
  { text: "COMMERCE", initialClass: "ml-0 md:-ml-[4%] lg:ml-0", travelX: 0.075, travelY: 3 },
  { text: "& SAAS", initialClass: "ml-[8%] md:ml-[15%] lg:ml-[28%]", travelX: 0.11, travelY: 2, scaleDelta: 0.002 },

];

const dotField = {
  desktop: { step: 14, dotSize: 1.4, baseAlpha: 0.12, maxAlpha: 0.55, frameTime: 32 },
  mobile: { step: 18, dotSize: 1.2, baseAlpha: 0.09, maxAlpha: 0.42, frameTime: 42 },
  cleanZoneStrength: 0.3,
};

const fields = [
  { x: 0.14, y: 0.22, radius: 0.5, speed: 0.00012, phase: 0.4, intensity: 1 },
  { x: 0.8, y: 0.72, radius: 0.42, speed: 0.00016, phase: 2.1, intensity: 1.2 },
  { x: 0.62, y: 0.14, radius: 0.32, speed: 0.0001, phase: 4.3, intensity: 0.9 },
];

export default function Hero() {
  const hero = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const composition = useRef<HTMLDivElement>(null);
  const project = useRef<HTMLElement>(null);
  const text = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fieldX = new Float32Array(fields.length);
    const fieldY = new Float32Array(fields.length);
    const fieldRadiusSquared = new Float32Array(fields.length);
    let frame = 0;
    let target = 0;
    let current = 0;
    let width = 0;
    let height = 0;
    let step = dotField.desktop.step;
    let dotSize = dotField.desktop.dotSize;
    let baseAlpha = dotField.desktop.baseAlpha;
    let maxAlpha = dotField.desktop.maxAlpha;
    let frameTime = dotField.desktop.frameTime;
    let grid = new Float32Array();
    let isVisible = false;
    let lastDraw = 0;
    let foreground = "#fff";
    let accent = "#c8ff00";
    let mobile = false;
    let fieldCount = fields.length;

    const clearTransforms = () => {
      text.current.forEach((line) => {
        if (line) line.style.transform = "";
      });
      if (composition.current) composition.current.style.transform = "";
      if (project.current) project.current.style.transform = "";
      if (canvas.current) canvas.current.style.opacity = "";
    };

    const dotAlpha = (x: number, y: number, time: number, scrollProgress: number) => {
      const lowPhase = time * 0.00008 + scrollProgress * 0.08;
      const warpedX = x
        + Math.sin(y * 0.008 + lowPhase) * 34
        + Math.cos((x + y) * 0.004 - lowPhase * 0.73) * 22;
      const warpedY = y
        + Math.cos(x * 0.007 - lowPhase * 0.89) * 30
        + Math.sin((x - y) * 0.0045 + lowPhase * 0.61) * 18;
      let influence = 0;

      for (let index = 0; index < fieldCount; index += 1) {
        const field = fields[index];
        const distanceX = warpedX - fieldX[index];
        const distanceY = warpedY - fieldY[index];
        const falloff = 1 - (distanceX * distanceX + distanceY * distanceY) / fieldRadiusSquared[index];
        if (falloff > 0) influence += falloff * falloff * field.intensity;
      }

      const edge = 0.88 + 0.12
        * Math.sin(warpedX * 0.032 + warpedY * 0.021 + time * 0.00017)
        * Math.cos(warpedY * 0.027 - warpedX * 0.016 - time * 0.00011);
      const activity = Math.min(1, influence * edge);
      const cleanX = (warpedX - width * 0.52) / (width * (mobile ? 0.52 : 0.42));
      const cleanY = (warpedY - height * 0.49) / (height * (mobile ? 0.4 : 0.36));
      const cleanShape = Math.max(0.84, 1 + 0.1 * Math.sin(warpedX * 0.011 - warpedY * 0.009 + time * 0.00005));
      const cleanDistance = Math.min(1, (cleanX * cleanX + cleanY * cleanY) / cleanShape);
      const cleanFalloff = cleanDistance * cleanDistance * (3 - 2 * cleanDistance);

      return (baseAlpha + activity * (maxAlpha - baseAlpha)) * (1 - dotField.cleanZoneStrength + dotField.cleanZoneStrength * cleanFalloff);
    };

    const drawDotField = (time: number, scrollProgress: number) => {
      const element = canvas.current;
      const context = element?.getContext("2d");
      if (!context || !width || !height) return;

      for (let index = 0; index < fieldCount; index += 1) {
        const field = fields[index];
        const phase = time * field.speed + field.phase + scrollProgress * 0.2;
        fieldX[index] = width * (field.x + Math.sin(phase) * 0.22);
        fieldY[index] = height * (field.y + Math.cos(phase * 0.83) * 0.2);
      }

      context.clearRect(0, 0, width, height);
      context.fillStyle = foreground;
      for (let index = 0; index < grid.length; index += 2) {
        const x = grid[index];
        const y = grid[index + 1];
        const alpha = dotAlpha(x, y, time, scrollProgress);
        if (alpha > maxAlpha * 0.72 && Math.sin(x * 0.19 + y * 0.11) > 0.985) {
          context.fillStyle = accent;
          context.globalAlpha = alpha * 0.55;
          context.fillRect(x, y, dotSize, dotSize);
          context.fillStyle = foreground;
        } else {
          context.globalAlpha = alpha;
          context.fillRect(x, y, dotSize, dotSize);
        }
      }
      context.globalAlpha = 1;
    };

    const resizeCanvas = () => {
      const element = canvas.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      mobile = window.innerWidth < 640;
      fieldCount = mobile ? 2 : fields.length;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);

      width = Math.round(rect.width);
      height = Math.round(rect.height);
      step = mobile ? dotField.mobile.step : Math.max(dotField.desktop.step, Math.sqrt((width * height) / 12000));
      dotSize = mobile ? dotField.mobile.dotSize : dotField.desktop.dotSize;
      baseAlpha = mobile ? dotField.mobile.baseAlpha : dotField.desktop.baseAlpha;
      maxAlpha = mobile ? dotField.mobile.maxAlpha : dotField.desktop.maxAlpha;
      frameTime = mobile ? dotField.mobile.frameTime : dotField.desktop.frameTime;
      const styles = getComputedStyle(document.documentElement);
      foreground = styles.getPropertyValue("--foreground").trim() || foreground;
      accent = styles.getPropertyValue("--accent").trim() || accent;
      const shortestSide = Math.min(width, height);
      fields.forEach((field, index) => {
        const radius = field.radius * shortestSide;
        fieldRadiusSquared[index] = radius * radius;
      });
      element.width = Math.round(width * dpr);
      element.height = Math.round(height * dpr);
      const context = element.getContext("2d");
      context?.setTransform(dpr, 0, 0, dpr, 0, 0);

      const columns = Math.ceil(width / step);
      const rows = Math.ceil(height / step);
      grid = new Float32Array(columns * rows * 2);
      let index = 0;
      for (let y = step / 2; y < height; y += step) {
        for (let x = step / 2; x < width; x += step) {
          grid[index] = x;
          grid[index + 1] = y;
          index += 2;
        }
      }
      grid = grid.slice(0, index);
      drawDotField(0, 0);
    };

    const schedule = () => {
      if (isVisible && !document.hidden && !reduceMotion.matches && !frame) frame = requestAnimationFrame(render);
    };

    const render = (time: number) => {
      if (reduceMotion.matches || !isVisible || document.hidden) {
        frame = 0;
        return;
      }

      current += (target - current) * 0.12;
      const travelScale = window.innerWidth < 640 ? 0.28 : window.innerWidth < 1024 ? 0.62 : 1;
      const progress = current * (2 - current);
      const handoff = Math.min(Math.max((progress - 0.68) / 0.32, 0), 1);

      lines.forEach(({ travelX, travelY = 0, scaleDelta = 0 }, index) => {
        const line = text.current[index];
        if (line) {
          line.style.transform = `translate3d(${progress * travelX * window.innerWidth * travelScale}px, ${progress * travelY}px, 0) scale(${1 + progress * scaleDelta})`;
        }
      });

      if (composition.current) composition.current.style.transform = `translate3d(0, ${-handoff * 10}svh, 0)`;
      if (project.current) project.current.style.transform = `translate3d(0, ${(1 - handoff) * 100}%, 0)`;
      if (canvas.current) canvas.current.style.opacity = `${1 - handoff * 0.65}`;

      if (time - lastDraw >= frameTime) {
        drawDotField(time, progress);
        lastDraw = time;
      }
      frame = requestAnimationFrame(render);
    };

    const update = () => {
      const section = hero.current;
      if (!section) return;
      if (reduceMotion.matches) {
        clearTransforms();
        drawDotField(0, 0);
        return;
      }
      const rect = section.getBoundingClientRect();
      target = Math.min(Math.max(-rect.top / Math.max(rect.height - window.innerHeight, 1), 0), 1);
      schedule();
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) schedule();
    });
    const handleVisibility = () => {
      if (document.hidden) cancelAnimationFrame(frame);
      frame = 0;
      if (!document.hidden) schedule();
    };
    const handleResize = () => {
      resizeCanvas();
      update();
    };

    resizeCanvas();
    update();
    if (hero.current) observer.observe(hero.current);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);
    reduceMotion.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      reduceMotion.removeEventListener("change", update);
    };
  }, []);

  return (
    <section ref={hero} className="relative h-[250svh] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden py-12 motion-reduce:static motion-reduce:h-auto motion-reduce:min-h-[100svh] motion-reduce:flex-col motion-reduce:items-stretch">
        <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
        <div ref={composition} className="container relative z-10 w-full -translate-y-[3svh] will-change-transform motion-reduce:py-12">
          <p className="mb-8 text-xs font-medium uppercase tracking-[0.18em] text-accent sm:mb-12">
            ALEXANDR KARBYSHEV
          </p>
          <h1
            className="flex flex-col text-[clamp(3.55rem,17vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.075em] md:text-[clamp(4.8rem,11.3vw,10.8rem)] md:leading-[0.84]"
            aria-label="Product Designer Building Digital Commerce and SaaS"
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
        <article
          ref={project}
          className="absolute inset-0 z-20 flex h-full translate-y-full flex-col bg-[#f5f3ed] px-[var(--page-gutter)] pb-6 pt-5 text-[#1500e1] will-change-transform motion-reduce:static motion-reduce:h-auto motion-reduce:translate-y-0 sm:pb-8 sm:pt-6"
          aria-labelledby="viled-title"
        >
          <div className="grid grid-cols-2 border-t border-current pt-2 text-xs font-medium uppercase tracking-[0.18em] md:grid-cols-12">
            <span className="md:col-span-1">01</span>
            <span className="text-right md:col-start-12">2025—26</span>
          </div>
          <div className="mt-[clamp(1.5rem,4vw,4rem)] md:grid md:grid-cols-12 md:gap-x-6">
            <div className="md:col-span-8">
              <h2 id="viled-title" className="font-[var(--font-arizona)] text-[clamp(4.5rem,14vw,13rem)] font-bold leading-[0.78] tracking-[-0.08em]">VILED</h2>
              <p className="mt-3 text-xl tracking-[-0.04em] sm:text-2xl">E-commerce ecosystem</p>
            </div>
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] md:col-start-10 md:mt-3">Role — Product designer</p>
          </div>
          <div className="mt-auto pt-8 md:grid md:grid-cols-12 md:gap-x-6">
            <div className="aspect-[16/8.5] min-h-[30svh] bg-[#d8d6d0] md:col-span-12 md:min-h-[46svh]" aria-label="Viled project media placeholder" role="img" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-current pt-2 text-xs font-medium uppercase tracking-[0.18em] md:grid-cols-12">
            <span className="md:col-span-3">Product design</span>
            <span className="md:col-span-3">E-commerce</span>
            <span className="text-right md:col-span-3 md:text-left">Web / iOS / Android</span>
          </div>
        </article>
      </div>
    </section>
  );
}

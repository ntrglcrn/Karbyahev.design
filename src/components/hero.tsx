"use client";

import { useEffect, useRef } from "react";

const lines = [
  { text: "Product", initialClass: "ml-0", travelX: -0.015 },
  { text: "Designer", initialClass: "ml-[5%] md:ml-[10%] lg:ml-[18%]", travelX: -0.09 },
  { text: "Building", initialClass: "ml-[1%] md:ml-0 lg:-ml-[8%]", travelX: 0.16 },
  { text: "Digital", initialClass: "ml-[8%] md:ml-[15%] lg:ml-[28%]", travelX: -0.2, travelY: -5, scaleDelta: 0.006 },
  { text: "Commerce", initialClass: "ml-0 md:-ml-[4%] lg:-ml-[14%]", travelX: 0.075, travelY: 3 },
  { text: "& SaaS", initialClass: "ml-[8%] md:ml-[15%] lg:ml-[28%]", travelX: 0.11, travelY: 2, scaleDelta: 0.002 },

];

const dotField = {
  desktop: { step: 16, dotSize: 1.25, baseAlpha: 0.075, maxAlpha: 0.28, frameTime: 42 },
  mobile: { step: 20, dotSize: 1, baseAlpha: 0.055, maxAlpha: 0.21, frameTime: 50 },
  cleanZoneStrength: 0.45,
};

const fields = [
  { x: 0.14, y: 0.22, radius: 0.48, speed: 0.00006, phase: 0.4, intensity: 0.8 },
  { x: 0.8, y: 0.72, radius: 0.38, speed: 0.00008, phase: 2.1, intensity: 1 },
  { x: 0.62, y: 0.14, radius: 0.28, speed: 0.00005, phase: 4.3, intensity: 0.7 },
];

export default function Hero() {
  const hero = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const text = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fieldX = new Float32Array(fields.length);
    const fieldY = new Float32Array(fields.length);
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

    const clearTransforms = () => {
      text.current.forEach((line) => {
        if (line) line.style.transform = "";
      });
    };

    const dotAlpha = (x: number, y: number, time: number, scrollProgress: number) => {
      let influence = 0;
      const fieldCount = window.innerWidth < 640 ? 2 : fields.length;

      for (let index = 0; index < fieldCount; index += 1) {
        const field = fields[index];
        const radius = field.radius * Math.min(width, height);
        const distanceX = x - fieldX[index];
        const distanceY = y - fieldY[index];
        const falloff = 1 - (distanceX * distanceX + distanceY * distanceY) / (radius * radius);
        if (falloff > 0) influence += falloff * falloff * field.intensity;
      }

      const modulation = 0.78 + 0.22 * Math.sin(x * 0.018 + y * 0.013 + time * 0.00012 + scrollProgress * 0.6);
      const activity = Math.min(1, influence * modulation);
      const cleanX = (x - width * 0.52) / (width * (window.innerWidth < 640 ? 0.52 : 0.42));
      const cleanY = (y - height * 0.49) / (height * (window.innerWidth < 640 ? 0.4 : 0.36));
      const cleanDistance = Math.min(1, Math.sqrt(cleanX * cleanX + cleanY * cleanY));
      const cleanFalloff = cleanDistance * cleanDistance * (3 - 2 * cleanDistance);

      return (baseAlpha + activity * (maxAlpha - baseAlpha)) * (1 - dotField.cleanZoneStrength + dotField.cleanZoneStrength * cleanFalloff);
    };

    const drawDotField = (time: number, scrollProgress: number) => {
      const element = canvas.current;
      const context = element?.getContext("2d");
      if (!context || !width || !height) return;

      const fieldCount = window.innerWidth < 640 ? 2 : fields.length;
      for (let index = 0; index < fieldCount; index += 1) {
        const field = fields[index];
        const phase = time * field.speed + field.phase + scrollProgress * 0.2;
        fieldX[index] = width * (field.x + Math.sin(phase) * 0.16);
        fieldY[index] = height * (field.y + Math.cos(phase * 0.83) * 0.14);
      }

      context.clearRect(0, 0, width, height);
      context.fillStyle = foreground;
      for (let index = 0; index < grid.length; index += 2) {
        context.globalAlpha = dotAlpha(grid[index], grid[index + 1], time, scrollProgress);
        context.fillRect(grid[index], grid[index + 1], dotSize, dotSize);
      }

      context.fillStyle = accent;
      for (let index = 0; index < grid.length; index += 2) {
        const x = grid[index];
        const y = grid[index + 1];
        const alpha = dotAlpha(x, y, time, scrollProgress);
        if (alpha > maxAlpha * 0.7 && Math.sin(x * 0.19 + y * 0.11) > 0.985) {
          context.globalAlpha = alpha * 0.65;
          context.fillRect(x, y, dotSize, dotSize);
        }
      }
      context.globalAlpha = 1;
    };

    const resizeCanvas = () => {
      const element = canvas.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const mobile = window.innerWidth < 640;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);

      width = Math.round(rect.width);
      height = Math.round(rect.height);
      step = mobile ? dotField.mobile.step : dotField.desktop.step;
      dotSize = mobile ? dotField.mobile.dotSize : dotField.desktop.dotSize;
      baseAlpha = mobile ? dotField.mobile.baseAlpha : dotField.desktop.baseAlpha;
      maxAlpha = mobile ? dotField.mobile.maxAlpha : dotField.desktop.maxAlpha;
      frameTime = mobile ? dotField.mobile.frameTime : dotField.desktop.frameTime;
      const styles = getComputedStyle(document.documentElement);
      foreground = styles.getPropertyValue("--foreground").trim() || foreground;
      accent = styles.getPropertyValue("--accent").trim() || accent;
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

      lines.forEach(({ travelX, travelY = 0, scaleDelta = 0 }, index) => {
        const line = text.current[index];
        if (line) {
          line.style.transform = `translate3d(${progress * travelX * window.innerWidth * travelScale}px, ${progress * travelY}px, 0) scale(${1 + progress * scaleDelta})`;
        }
      });

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
    <section ref={hero} className="relative h-[180svh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-x-clip py-12">
        <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
        <div className="container relative z-10 w-full -translate-y-[3svh]">
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
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import HeroCollaborators from "./hero-collaborators";

const lines = [
  { text: "PRODUCT", initialClass: "ml-0", travelX: -0.015, pointerX: 2, pointerY: -1 },
  { text: "DESIGNER", initialClass: "ml-[5%] md:ml-[10%] lg:ml-[18%]", travelX: -0.09, pointerX: 8, pointerY: 4 },
  { text: "BUILDING", initialClass: "ml-[1%] md:ml-0 lg:ml-0", travelX: 0.16, pointerX: -10, pointerY: 5 },
  { text: "DIGITAL", initialClass: "ml-[8%] md:ml-[15%] lg:ml-[28%]", travelX: -0.2, travelY: -5, scaleDelta: 0.006, pointerX: 6, pointerY: -4 },
  { text: "COMMERCE", initialClass: "ml-0 md:-ml-[4%] lg:ml-0", travelX: 0.075, travelY: 3, pointerX: -7, pointerY: 3 },
  { text: "& SAAS", initialClass: "ml-[8%] md:ml-[15%] lg:ml-[28%]", travelX: 0.11, travelY: 2, scaleDelta: 0.002, pointerX: 9, pointerY: -3 },

];

const dotField = {
  desktop: { step: 14, dotSize: 1.9, baseAlpha: 0.26, maxAlpha: 0.84, frameTime: 32 },
  mobile: { step: 18, dotSize: 1.2, baseAlpha: 0.09, maxAlpha: 0.42, frameTime: 42 },
  cleanZoneStrength: 0.1,
};

const fields = [
  { x: 0.14, y: 0.22, radius: 0.5, speed: 0.00052, phase: 0.4, intensity: 1 },
  { x: 0.8, y: 0.72, radius: 0.42, speed: 0.00056, phase: 2.1, intensity: 1.2 },
  { x: 0.62, y: 0.14, radius: 0.32, speed: 0.0005, phase: 4.3, intensity: 0.9 },
];

export default function Hero() {
  const hero = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const composition = useRef<HTMLDivElement>(null);
  const collaborators = useRef<HTMLDivElement>(null);
  const pointerLabel = useRef<HTMLSpanElement>(null);
  const text = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
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
    let pointerTargetX = 0;
    let pointerTargetY = 0;
    let pointerCurrentX = 0;
    let pointerCurrentY = 0;
    let pointerStrength = 0;
    let pointerActive = false;
    let pointerEnabled = false;

    const resetPointer = () => {
      pointerActive = false;
      pointerTargetX = 0;
      pointerTargetY = 0;
    };

    const updatePointerAvailability = () => {
      pointerEnabled = !mobile && !coarsePointer.matches && !reduceMotion.matches;
      if (!pointerEnabled) resetPointer();
    };

    const clearTransforms = () => {
      text.current.forEach((line) => {
        if (line) line.style.transform = "";
      });
      if (composition.current) composition.current.style.transform = "";
      if (canvas.current) canvas.current.style.opacity = "";
      if (collaborators.current) collaborators.current.style.opacity = "";
      if (pointerLabel.current) pointerLabel.current.style.opacity = "";
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
      const pointerX = width * (pointerCurrentX + 1) * 0.5;
      const pointerY = height * (pointerCurrentY + 1) * 0.5;
      const pointerRadius = 220;
      const pointerRadiusSquared = pointerRadius * pointerRadius;
      for (let index = 0; index < grid.length; index += 2) {
        const x = grid[index];
        const y = grid[index + 1];
        let renderX = x;
        let renderY = y;
        let pointerInfluence = 0;
        const pointerDeltaX = x - pointerX;
        const pointerDeltaY = y - pointerY;
        const pointerDistanceSquared = pointerDeltaX * pointerDeltaX + pointerDeltaY * pointerDeltaY;
        if (pointerStrength && pointerDistanceSquared < pointerRadiusSquared) {
          pointerInfluence = (1 - pointerDistanceSquared / pointerRadiusSquared) ** 2 * pointerStrength;
          const inverseDistance = 1 / Math.sqrt(pointerDistanceSquared || 1);
          const asymmetry = Math.sin(x * 0.021 + y * 0.017 + time * 0.001) * 0.22;
          renderX += (pointerDeltaX * inverseDistance + pointerCurrentX * (0.24 + asymmetry)) * pointerInfluence * 9;
          renderY += (pointerDeltaY * inverseDistance + pointerCurrentY * (0.24 - asymmetry)) * pointerInfluence * 9;
        }
        const alpha = dotAlpha(x, y, time, scrollProgress) * (1 + pointerInfluence * 0.2);
        if (alpha > maxAlpha * 0.72 && Math.sin(x * 0.19 + y * 0.11) > 0.985 - pointerInfluence * 0.012) {
          context.fillStyle = accent;
          context.globalAlpha = alpha * 0.55;
          context.fillRect(renderX, renderY, dotSize, dotSize);
          context.fillStyle = foreground;
        } else {
          context.globalAlpha = alpha;
          context.fillRect(renderX, renderY, dotSize, dotSize);
        }
      }
      context.globalAlpha = 1;
    };

    const resizeCanvas = () => {
      const element = canvas.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      mobile = window.innerWidth < 640;
      updatePointerAvailability();
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

      current += (target - current) * 0.16;
      pointerCurrentX += (pointerTargetX - pointerCurrentX) * 0.08;
      pointerCurrentY += (pointerTargetY - pointerCurrentY) * 0.08;
      pointerStrength += ((pointerActive ? 1 : 0) - pointerStrength) * 0.08;
      const travelScale = window.innerWidth < 640 ? 0.22 : window.innerWidth < 1024 ? 0.62 : 1;
      const progress = current * (2 - current);
      const handoff = Math.min(Math.max((current - 0.62) / 0.38, 0), 1);

      lines.forEach(({ travelX, travelY = 0, scaleDelta = 0, pointerX = 0, pointerY = 0 }, index) => {
        const line = text.current[index];
        if (line) {
          line.style.transform = `translate3d(${progress * travelX * window.innerWidth * travelScale + pointerCurrentX * pointerX * pointerStrength}px, ${progress * travelY + pointerCurrentY * pointerY * pointerStrength}px, 0) scale(${1 + progress * scaleDelta})`;
        }
      });

      if (composition.current) composition.current.style.transform = `translate3d(0, ${-handoff * (mobile ? 4 : 10)}svh, 0)`;
      if (canvas.current) canvas.current.style.opacity = `${1 - handoff * 0.65}`;
      if (collaborators.current) collaborators.current.style.opacity = `${1 - handoff}`;
      if (pointerLabel.current) {
        const labelX = width * (pointerCurrentX + 1) * 0.5 + 48;
        const labelY = height * (pointerCurrentY + 1) * 0.5 + 48;
        pointerLabel.current.style.transform = `translate3d(${labelX}px, ${labelY}px, 0)`;
        pointerLabel.current.style.opacity = `${pointerStrength}`;
      }

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
      resetPointer();
      frame = 0;
      if (!document.hidden) schedule();
    };
    const handleResize = () => {
      resizeCanvas();
      update();
    };
    const handleMotionChange = () => {
      updatePointerAvailability();
      update();
    };
    const handlePointerMove = (event: PointerEvent) => {
      const element = canvas.current;
      if (!pointerEnabled || !element) return;
      const rect = element.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        resetPointer();
        return;
      }
      pointerTargetX = Math.min(Math.max((event.clientX - rect.left) / rect.width * 2 - 1, -1), 1);
      pointerTargetY = Math.min(Math.max((event.clientY - rect.top) / rect.height * 2 - 1, -1), 1);
      pointerActive = true;
      schedule();
    };

    resizeCanvas();
    update();
    const section = hero.current;
    if (section) observer.observe(section);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("blur", resetPointer);
    document.addEventListener("visibilitychange", handleVisibility);
    reduceMotion.addEventListener("change", handleMotionChange);
    coarsePointer.addEventListener("change", handleResize);
    section?.addEventListener("pointermove", handlePointerMove, { passive: true });
    section?.addEventListener("pointerleave", resetPointer);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("blur", resetPointer);
      document.removeEventListener("visibilitychange", handleVisibility);
      reduceMotion.removeEventListener("change", handleMotionChange);
      coarsePointer.removeEventListener("change", handleResize);
      section?.removeEventListener("pointermove", handlePointerMove);
      section?.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  return (
    <section ref={hero} className="relative motion-reduce:h-auto">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden py-12 motion-reduce:static motion-reduce:h-auto motion-reduce:min-h-[100svh] motion-reduce:flex-col motion-reduce:items-stretch">
        <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
        <div ref={collaborators} className="absolute inset-0 z-20">
          <HeroCollaborators />
        </div>
        <span ref={pointerLabel} className="pointer-events-none absolute left-0 top-0 z-20 whitespace-nowrap rounded-full border border-[rgb(255_255_255_/_0.28)] bg-foreground px-[18px] pt-[6px] pb-[9px] text-[27px] font-semibold leading-none tracking-[0.035em] text-background opacity-0 shadow-[0_2px_6px_rgb(21_0_225_/_0.1)] will-change-transform" aria-hidden="true">
          Guest
        </span>
        <div ref={composition} className="container relative z-10 w-full -translate-y-[3svh] will-change-transform motion-reduce:py-12">
          <p className="mb-8 text-xs font-medium uppercase tracking-[0.18em] text-accent sm:mb-12">
            ALEXANDR KARBYSHEV
          </p>
          <h1
            className="flex flex-col text-[clamp(3.55rem,17vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.075em] md:text-[clamp(4.8rem,11.3vw,10.8rem)] md:leading-[0.84] min-[192rem]:origin-left min-[192rem]:scale-x-150 min-[192rem]:text-[clamp(10.8rem,18vw,24rem)]"
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
      <div className="h-[48svh] sm:h-[120svh] lg:h-[167svh] motion-reduce:hidden" aria-hidden="true" />
    </section>
  );
}

---
name: performance-check
description: Assess performance risk for karbyshev.design changes that affect canvas, scroll animation, sticky scenes, client components, fonts, or visual assets.
---

# Performance check

Use only for performance-sensitive work, not copy or one-line styling changes.
Read the changed code and, as relevant, `src/components/hero.tsx`,
`src/components/final-scene.tsx`, `src/app/layout.tsx`, and `next.config.ts`.

Check the smallest relevant risks: client-component boundary, RAF lifetime,
scroll/listener cleanup, DOM/layout reads per frame, animation properties,
canvas density/DPR, hydration, font loading, image dimensions/format, LCP/CLS,
and mobile GPU cost. Prefer a targeted browser check; reserve full profiling for
a substantial animation or asset addition.

Do not introduce a library or a custom performance framework for this check.
Use `$verify-change` for the proportionate repository command.

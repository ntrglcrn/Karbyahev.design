---
name: motion
description: Implement or revise karbyshev.design scroll, canvas, CSS, hover, or state animation while preserving its native motion stack, reduced-motion behavior, and frame budget.
---

# Motion system

This project uses no GSAP, Lenis, Framer Motion, or Three.js. Reuse native CSS
transitions/keyframes and React effects with `requestAnimationFrame`, passive
scroll listeners, `IntersectionObserver`, and `matchMedia`.

Read the narrow source of truth first:

- Hero canvas, scroll handoff, and pointer field: `src/components/hero.tsx`.
- Collaborator cursor choreography: `src/components/hero-collaborators.module.css`.
- Sticky project-preview reveal: `src/components/project-file.tsx` and
  `project-file.module.css`.
- Footer sequence and CTA pointer response: `src/components/final-scene.tsx`
  and `final-scene.module.css`.

## Constraints

- Motion communicates state or narrative; use one existing pattern before
  adding another abstraction.
- Animate `transform` and `opacity`; keep scroll listeners passive and cancel
  RAF/listeners on cleanup.
- Gate fine-pointer effects with pointer media queries where appropriate.
- Keep `prefers-reduced-motion` as a coherent static/reflowed experience, not
  merely a disabled visual layer.
- Preserve sticky scroll distance and mobile scaling only when they carry the
  story; do not add scroll hijacking.

Run `$responsive-qa` and `$performance-check` for meaningful motion changes.

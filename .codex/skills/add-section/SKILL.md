---
name: add-section
description: Add a focused homepage or case-study section to karbyshev.design using the existing component, token, responsive, and narrative conventions.
---

# Add a section

Read `src/app/page.tsx`, `src/app/globals.css`, and the neighboring component
before adding a homepage section. For case work, use `$case-study` instead.

## Conventions

- Place reusable homepage sections in `src/components/` and compose them in
  `src/app/page.tsx`; keep only local styling in a colocated CSS module when
  Tailwind utilities cannot express the component clearly.
- Use `--background`, `--foreground`, `--muted`, `--border`, `--accent`, and
  `--page-gutter`; use `.container` for full-width content with the standard
  gutter. The display face is `--font-arizona`; body text stays sans-serif.
- Favor fluid `clamp()` sizing and `svh` for scene height. Existing major
  breakpoints cluster around 48rem and 64rem; do not add a breakpoint without
  a composition reason.
- Give the section one narrative job. Do not add generic cards or decoration.

Apply `$portfolio-vision` before choosing art direction. Use `$motion` only if
motion communicates the section’s job, then run `$responsive-qa` and
`$verify-change`.

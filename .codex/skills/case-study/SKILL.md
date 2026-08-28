---
name: case-study
description: Create or expand karbyshev.design project case studies, including project metadata, case-page structure, narrative evidence, and next-case handoffs.
---

# Case studies

Read `src/components/project-data.ts` and `src/app/work/[slug]/page.tsx` first.
Read `src/components/project-file.tsx` and its CSS when the work-preview or
handoff changes. Reuse `Project` and `projects`; `generateStaticParams()` is
derived from that data.

## Workflow

1. State the case’s product claim and Alexander’s ownership.
2. Shape content as `context → tension → evidence → decision → exploration →
   system → shipped product → impact`; omit stages with no honest evidence.
3. Add or evolve metadata and page sections with the existing route/data
   pattern; never invent impact metrics or confidential detail.
4. Give each case its own appropriate expression while preserving the global
   type, color, and navigation system. PDP Guard should demonstrate problem
   discovery through building and validation, not only interface design.

Apply `$portfolio-vision` for user-facing narrative choices. Use
`$responsive-qa` after structural visual changes and `$verify-change` after
implementation.

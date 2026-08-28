---
name: verify-change
description: Run the smallest sufficient verification for changes to karbyshev.design using its actual npm scripts.
---

# Verify a change

Read `package.json` before choosing a command. Available checks are:

- `npm run lint` for meaningful TypeScript, React, CSS, and route changes.
- `npm run build` for route, configuration, dependency, font, or production
  behavior changes, and before handoff of substantial UI work.
- `npm run dev` plus a focused browser check for visual, responsive, or
  interaction changes.

There is no `test` or `typecheck` script: do not invent either. A microcopy or
trivial metadata edit usually needs no build; lint is sufficient for ordinary
implementation changes. Report exactly what was run and any intentionally
skipped higher-cost check.

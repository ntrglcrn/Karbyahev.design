---
name: design-system
description: Protect karbyshev.design's existing token architecture during UI implementation, visual changes, component or page creation, responsive work, design QA, and appearance-affecting Tailwind or CSS edits. Use when work touches typography, color, spacing, layout, grids, borders, radii, sizing, containers, or reusable visual values; skip pure backend, unrelated tests or maintenance, and internal canvas or motion math that creates no reusable design decision.
---

# Design-system guardrail

Before acting, read `design-system/README.md` and `design-system/tokens.json` in
full. If either is missing, stop and report that the design-system foundation
is unavailable. Inspect the current files every time; never rely on remembered
token names.

This skill protects token architecture while the task's implementation skill
drives the work. Preserve the portfolio's authored art direction and motion;
do not redesign adjacent UI or normalize unrelated values.

## Decide values

Preserve `raw value → Primitive (private) → Semantic (public) → Component`.
Primitive tokens are private design-system implementation details. Application
UI must never consume them directly; `Component → Primitive` is an architecture
violation. Components and pages consume semantic tokens only.

Before introducing a value:

1. Reuse an existing semantic token expressing the role.
2. Otherwise, inspect primitives internally; never consume one from application
   code. If the role is reusable, add the smallest justified semantic mapping.
3. If the value is also absent from primitives, add a primitive and semantic
   mapping only for a reusable design decision.
4. Keep legitimate one-off implementation or composition parameters raw and
   local.

Never solve a missing semantic role by using a primitive directly. A missing
role also does not automatically justify a new semantic alias: do not invent
component-specific semantics merely to satisfy validation. Prefer names that
describe reusable design intent over component, implementation, or palette
names. One responsive role should remain one semantic token where possible.

Treat typography roles, hierarchy, gutters, section spacing, standard gaps,
surfaces, text and border colors, reusable radii, content widths, component
dimensions, and interaction states as likely design decisions. Treat canvas
coordinates, DPR, interpolation, progress, transforms, rotation, scale,
choreography percentages, sticky-scene math, dynamic viewport calculations,
pointer paths, and unique decorative offsets as local mechanics. Do not
tokenize the latter merely for uniformity.

## Enforce invariants

- Reuse semantic typography roles instead of rebuilding font family, size,
  weight, line-height, and tracking combinations. Use existing project font
  definitions.
- Reuse semantic color roles; do not place reusable hex, rgb, rgba, hsl, or
  hsla values in components or leak primitive palette names into APIs.
- Reuse layout semantics for gutters, containers, content widths, section
  spacing, grid gaps, and breakpoints. Do not create near-duplicate containers.
- Reuse spacing, radius, and border roles. A unique art-direction offset may
  stay local.
- Dimensional primitives use even numeric values on the repository's 2px grid.
  The documented 1px hairline is allowed. Opacity, z-index, font weight, motion
  timing/easing, percentages, scale, rotation, unitless values, DPR, canvas
  values, and runtime coefficients are not dimensional primitives. Do not
  blindly round intentional local mechanics.
- Application UI must not consume project primitives through Tailwind utilities
  or generated APIs. Prefer semantic utilities or semantic CSS variables. Do
  not confuse generic Tailwind utilities with project design-token primitives.
- Review Tailwind arbitrary values and CSS custom properties by intent. Promote
  reusable design decisions; retain unique technical or art-direction geometry.
- `design-system/tokens.json` is the sole editable token source. Never edit
  generated `src/styles/tokens.css` by hand or introduce another token source.

When replacing a raw value, preserve the rendered result unless the task asks
for a visual change. Prefer visual fidelity over theoretical purity; retain and
briefly report an intentional local exception when normalization would damage
the composition.

## Verify

After relevant UI or design-system work, treat this as the authoritative
architecture gate:

```bash
npm run tokens:check
```

Do not suppress, whitelist, ignore, or work around a primitive-bypass failure.
Resolve it by reusing an existing semantic role, or by adding the smallest
justified semantic mapping to an existing primitive. Add a primitive only when
the reusable design value itself is absent; rebuild and run `tokens:check`
again. Do not create a meaningless semantic alias just to silence validation.

Also run the task's existing repository verification. If tokens changed, build
from `tokens.json` and confirm a second generation creates no unexpected diff.

Before finishing relevant UI work, scan only the changed files for newly added
raw colors, odd reusable dimensions, arbitrary Tailwind values, duplicate
spacing or typography, direct primitive consumption where a semantic role
exists, and manual generated-file edits. Do not turn a scoped task into a
repository-wide audit.

Report design-system details only when relevant: reused tokens, added or changed
tokens, intentional local exceptions, architectural conflicts, and the
`tokens:check` result.

For normal UI work, keep the workflow scoped to the source of truth, changed
files, and relevant validation. Use independent subagents only for large
refactors or explicit audits of semantic coverage, typography, layout,
responsive behavior, primitive bypasses, or visual regression. Never let
multiple agents concurrently edit `tokens.json`, generated tokens, or token
architecture; the primary agent owns those decisions.

# Design system

`tokens.json` is the only editable source for reusable visual values. Generated files must not be edited by hand.

## Model

`Primitive → Semantic → Component`

- A primitive records an available value.
- A semantic token assigns that value a reusable role.
- Components consume semantic CSS variables, Tailwind utilities, or generated `type-*` classes.
- Semantic leaves must reference primitives; raw semantic values fail validation.

## Dimensions

Reusable dimensional primitives use even pixel values on a 2px grid. The only 1px exception is `primitive.borderWidth.hairline`. Opacity, font weight, unitless line-height, percentages, breakpoints expressed as even rendered pixels, motion timing, transforms, canvas values, and interpolation coefficients are not spacing dimensions.

Before adding a value, reuse an existing semantic role, then an existing primitive. Add a primitive only when neither fits. Do not create duplicate primitives with the same raw value in one domain.

## Responsive tokens

A responsive role stays one semantic token with `default` and `responsive` mappings. Each variant references primitive breakpoints and primitive values; device-specific semantic roles are not created.

## Commands

- `npm run tokens:validate` validates structure, references, duplicates, and even dimensions.
- `npm run tokens:build` deterministically writes `src/styles/tokens.css`.
- `npm run tokens:check` validates tokens and fails when generated CSS is stale.
- `npm run build` runs `tokens:check` before the Next.js production build.

## Keep values local when

They exist for one composition or implementation: canvas/DPR math, scroll progress, physics, transforms, coordinates, keyframe choreography, sticky-scene pacing, one-off decorative offsets, and breakpoint epsilon values. Local values are intentional when they express mechanics rather than a reusable design decision.

When a local value becomes a repeated design decision, promote it to a primitive, map a semantic role, rebuild, and migrate consumers.

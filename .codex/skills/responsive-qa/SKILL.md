---
name: responsive-qa
description: Validate karbyshev.design visual changes across desktop, laptop, tablet, and mobile without reducing the mobile experience to hidden desktop effects.
---

# Responsive QA

Read `src/app/globals.css` and the changed component plus its CSS module.
Existing system breakpoints include 80rem for global gutters, 64rem/48rem for
component composition, and 23.375rem for the smallest layout. Hero additionally
adapts around 1024px and 640px.

Check at large desktop, laptop, tablet, and a 390px-wide mobile viewport:

- no horizontal overflow, clipping, or inaccessible content;
- hierarchy, text measure, `clamp()` type, and sticky/`svh` scenes remain
  intentional;
- touch targets, focus states, links, and contact remain usable;
- desktop motion is translated or simplified for touch rather than blindly
  hidden; reduced motion still exposes the same information.

Use a real local browser when the change affects layout or interaction. Report
only regressions and high-impact risks; do not turn routine QA into a redesign.

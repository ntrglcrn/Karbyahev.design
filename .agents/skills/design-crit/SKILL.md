---
name: design-crit
description: Critique karbyshev.design as a Senior/Lead Product Designer portfolio. Use whenever reviewing a page, section, case study, interaction, responsive state, typography, visual hierarchy, motion, or overall portfolio quality before or after implementation.
---

# Design Crit — karbyshev.design

Review the current implementation of `karbyshev.design` as a portfolio intended to position Alexander as a Senior/Lead Product Designer for international product companies.

Do not treat this as a generic landing-page design review.

The portfolio must communicate:

> This person doesn't just draw interfaces; he knows how to build products.

## Product context

The website has four simultaneous jobs:

1. Portfolio for Senior/Lead Product Designer roles.
2. Personal brand.
3. Job-search conversion tool.
4. Evidence of product, engineering, and product-building capability.

Primary audience:

- Head of Design
- Design Director
- Product Director
- CPO
- CTO
- startup CEO
- senior design/product recruiters
- potential clients

Primary areas of expertise that should be visible through the site:

- Product Design
- UX
- UI
- Design Systems
- Ecommerce
- Mobile Apps
- Web
- Product Strategy

`PDP Guard` is especially important because it demonstrates end-to-end product thinking, engineering literacy, experimentation, and the ability to build a product rather than only design interfaces.

---

# Review procedure

## 1. Inspect before judging

Before changing anything:

1. Read the relevant page/component implementation.
2. Inspect the surrounding section so the critique considers the full narrative.
3. Run or inspect the actual rendered experience when possible.
4. Review desktop first.
5. Also inspect laptop, tablet, and mobile behavior where relevant.
6. Check existing typography, spacing, tokens, motion, and reusable components before suggesting new patterns.

Do not critique isolated screenshots if the real implementation is available.

Do not edit code unless explicitly asked to implement the critique.

---

# 2. Evaluate the portfolio on these dimensions

## A. Senior / Lead signal

Ask:

- Does this feel like the portfolio of someone who can own a product area?
- Is there evidence of decision-making rather than only execution?
- Is product thinking more visible than decorative UI skill?
- Does the work demonstrate systems thinking?
- Does the site communicate ownership, ambiguity handling, prioritization, and outcomes?
- Would a Head of Design consider this person for Senior/Lead responsibilities?

Flag anything that makes the portfolio feel:

- junior
- Dribbble-like
- template-driven
- overly decorative
- implementation-focused without product reasoning
- generic agency-style
- visually fashionable but strategically empty

---

## B. First 15-second impression

Evaluate what a hiring manager understands without scrolling deeply.

They should quickly understand:

- who Alexander is
- what level he operates at
- what kind of products he works on
- why his work is interesting
- what to explore next

Look specifically at:

- hero
- title
- positioning statement
- first project preview
- visual hierarchy
- initial motion
- CTA / navigation

The hero must create curiosity without delaying understanding.

---

## C. Portfolio narrative

Review the page as a sequence, not a collection of sections.

Each transition should answer the reader's next implicit question.

Typical narrative:

Who is this?
→ What does he do?
→ What has he built?
→ How does he think?
→ What results did he create?
→ Can he operate beyond UI?
→ What else has he done?
→ How do I contact him?

Check whether any section:

- repeats information
- appears too early
- appears too late
- breaks momentum
- has no clear narrative purpose

---

## D. Case-study strength

For every featured case, distinguish between:

### Visual evidence
Screens, flows, prototypes, UI, motion, systems.

### Product evidence
Problem, constraints, research, decisions, metrics, tradeoffs, iteration.

### Ownership evidence
What Alexander personally drove.

### Outcome evidence
Business, customer, operational, or product impact.

Avoid case studies that become long chronological diaries.

Prefer:

Problem
→ insight
→ decision
→ solution
→ evidence
→ result

A recruiter should be able to skim the case and still understand its value.

---

## E. Visual hierarchy

Review:

- section hierarchy
- heading scale
- text density
- whitespace
- image scale
- project hierarchy
- focal points
- rhythm
- alignment
- visual balance

Every viewport should have a clear primary focal point.

Flag cases where:

- everything has equal emphasis
- project imagery is too small
- typography competes with the work
- giant typography exists without narrative purpose
- sections feel vertically inflated
- empty space looks accidental rather than intentional

---

## F. Typography

Typography is a major part of the identity.

Check:

- intended font is actually loaded and applied
- display and body typography have clear roles
- font weights are intentional
- line lengths remain readable
- line heights work at each breakpoint
- typography does not create unnecessary layout shifts
- visual character is consistent with the portfolio identity

Do not silently replace distinctive typography with generic Inter/SF-style typography.

Avoid making everything oversized just to make the portfolio look editorial.

---

## G. Motion

Motion must reinforce hierarchy, storytelling, spatial relationships, or interaction.

For every animation ask:

> What information does this animation communicate?

Good reasons:

- establish hierarchy
- introduce a case
- create continuity between sections
- reveal relationships
- communicate state
- improve perceived quality
- support storytelling

Bad reasons:

- something looked empty
- animation makes it feel premium
- every section needs motion
- another portfolio did it

Prefer a small number of memorable motion systems over many unrelated effects.

Watch for:

- scroll hijacking
- delayed access to content
- excessive parallax
- animation fatigue
- competing simultaneous motion
- movement that hurts text readability
- animation that creates performance problems

Respect `prefers-reduced-motion`.

---

## H. Handoff between cases

Case transitions are part of the storytelling system.

A transition should create continuity between the outgoing project and the next project.

Possible tools:

- scale
- masking
- image takeover
- typography handoff
- sticky transitions
- shared geometry
- color field transition
- spatial movement

Do not use a completely different transition style for every case.

The portfolio should feel like one designed system.

---

## I. Engineering quality

Visual sophistication must not be achieved through fragile implementation.

Consider:

- component boundaries
- duplicated layout hacks
- absolute positioning
- viewport-dependent magic numbers
- responsive behavior
- unnecessary client components
- animation cleanup
- event listener cleanup
- image optimization
- font loading
- accessibility
- semantic structure

Flag designs that require brittle implementation even if they look visually strong.

---

## J. Performance

Performance is part of design quality.

Pay attention to:

- CLS
- LCP
- INP
- TBT
- image weight
- font loading
- lazy loading
- bundle size
- expensive scroll listeners
- animation on layout properties
- unnecessary rerenders
- GPU-heavy effects

Prefer `transform` and `opacity` for motion when possible.

Do not recommend expensive visual effects unless their portfolio value clearly justifies the performance cost.

---

## K. Responsive quality

Use desktop-first design, but do not create a desktop-only composition.

Evaluate at minimum:

- large desktop
- laptop
- tablet
- mobile

Avoid separate mobile hacks whenever the same responsive system can solve the problem.

Responsive changes may alter composition, not only scale everything down.

Check specifically:

- hero height
- oversized typography
- project previews
- sticky sections
- horizontal layouts
- navigation
- touch targets
- text measure
- motion
- viewport-height behavior

---

## L. Originality

Look for places where the design feels copied from:

- trendy agency websites
- Awwwards conventions
- portfolio templates
- generic brutalist portfolios
- generic minimal Swiss portfolios

References are allowed.

The final result must still feel like a coherent identity belonging to Alexander.

Avoid visual novelty that obscures the work.

---

# 3. Prioritization

Do not return dozens of equally weighted observations.

Classify findings:

## P0 — Portfolio blocker

A problem that materially damages Senior/Lead perception, usability, accessibility, or the ability to understand the portfolio.

## P1 — High impact

A meaningful improvement to positioning, hierarchy, narrative, interaction, or project presentation.

## P2 — Polish

A worthwhile refinement that improves perceived quality but is not structurally important.

Ignore micro-polish when larger structural issues remain.

---

# 4. Critique format

Start with:

## Verdict

Give a concise assessment of the current design direction.

Answer:

- What level does the portfolio currently communicate?
- What is the strongest part?
- What is holding it back most?

Then:

## Findings

For every relevant finding provide:

### [P0/P1/P2] Short finding title

**What I see**

Describe the observable issue.

**Why it matters**

Explain how it affects hiring perception, portfolio narrative, usability, visual hierarchy, or performance.

**Recommendation**

Give a specific design direction.

When implementation details materially affect the solution, add:

**Implementation note**

Explain the technical constraint or preferred implementation.

---

# 5. End with three decisions

Always conclude with:

## Keep

The strongest thing that should not be accidentally removed during iteration.

## Change next

The single highest-leverage improvement.

## Do not add yet

Something tempting that should be postponed until more important issues are solved.

---

# Rules

- Be critical rather than agreeable.
- Do not praise every section.
- Do not manufacture issues to fill the report.
- Prefer 3–7 high-signal findings over 20 minor comments.
- Judge the design in context of Senior/Lead hiring.
- Separate personal aesthetic preference from objective design problems.
- Explain why a recommendation improves the portfolio.
- Do not optimize for Awwwards at the expense of hiring conversion.
- Do not simplify distinctive ideas merely because conventional portfolios are safer.
- Do not add visual effects without a narrative purpose.
- Do not recommend rebuilding working components without sufficient benefit.
- Do not write code unless implementation is explicitly requested.
- When there are multiple possible directions, recommend one primary direction rather than presenting an indecisive list.

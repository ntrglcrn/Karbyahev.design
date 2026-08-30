import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "design-system/tokens.json");
const outputPath = path.join(root, "src/styles/tokens.css");
const referencePattern = /^\{primitive\.([A-Za-z0-9.]+)\}$/;
const typographyProperties = new Set(["fontFamily", "fontSize", "fontWeight", "letterSpacing", "lineHeight"]);

const tokens = JSON.parse(await readFile(sourcePath, "utf8"));

function entries(value, prefix = []) {
  return Object.entries(value).flatMap(([key, child]) => {
    const next = [...prefix, key];
    return child && typeof child === "object" && !Array.isArray(child)
      ? entries(child, next)
      : [[next, child]];
  });
}

function leaves(value, prefix = []) {
  if (Array.isArray(value)) return value.flatMap((child, index) => leaves(child, [...prefix, String(index)]));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => leaves(child, [...prefix, key]));
  }
  return [[prefix, value]];
}

function get(pathParts) {
  return pathParts.reduce((value, key) => value?.[key], tokens);
}

function referencePath(value) {
  const match = typeof value === "string" && value.match(referencePattern);
  return match ? ["primitive", ...match[1].split(".")] : null;
}

function resolve(value) {
  const target = referencePath(value);
  if (!target) throw new Error(`Expected primitive reference, received ${JSON.stringify(value)}`);
  return get(target);
}

function validate() {
  if (tokens.$version !== 1 || !tokens.primitive || !tokens.semantic) {
    throw new Error("tokens.json must contain $version: 1, primitive, and semantic roots");
  }

  for (const [pathParts, value] of entries(tokens.primitive)) {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`Primitive ${pathParts.join(".")} must be a non-empty string`);
    }
  }

  for (const [pathParts, value] of leaves(tokens.semantic)) {
    const target = referencePath(value);
    if (!target) throw new Error(`Semantic ${pathParts.join(".")} must reference a primitive`);
    const resolved = get(target);
    if (typeof resolved !== "string") throw new Error(`Broken reference ${value} at semantic.${pathParts.join(".")}`);
  }

  for (const [pathParts, value] of entries(tokens.semantic)) {
    if (!Array.isArray(value)) continue;
    for (const [index, variant] of value.entries()) {
      const conditions = ["minWidth", "maxWidth", "media"].filter((key) => key in variant);
      if (conditions.length !== 1 || !Object.keys(variant).some((key) => !conditions.includes(key))) {
        throw new Error(`Responsive semantic.${pathParts.join(".")}.${index} needs one condition and one value`);
      }
    }
  }

  function validateTypography(value, pathParts = []) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(`Invalid typography role at semantic.typography.${pathParts.join(".")}`);
    }
    for (const [key, child] of Object.entries(value)) {
      const next = [...pathParts, key];
      if (child.default && Object.keys(child.default).some((property) => typographyProperties.has(property))) {
        const unknown = Object.keys(child.default).filter((property) => !typographyProperties.has(property));
        if (unknown.length) throw new Error(`Unknown typography properties at semantic.typography.${next.join(".")}: ${unknown.join(", ")}`);
        for (const [index, variant] of (child.responsive ?? []).entries()) {
          const properties = Object.keys(variant).filter((property) => !["minWidth", "maxWidth", "media"].includes(property));
          if (!properties.length || properties.some((property) => !typographyProperties.has(property))) {
            throw new Error(`Invalid typography variant at semantic.typography.${next.join(".")}.responsive.${index}`);
          }
        }
      } else {
        validateTypography(child, next);
      }
    }
  }
  validateTypography(tokens.semantic.typography);

  const dimensionalDomains = new Set(["borderWidth", "breakpoint", "fontSize", "radius", "size", "space"]);
  for (const domain of dimensionalDomains) {
    for (const [pathParts, value] of entries(tokens.primitive[domain] ?? {})) {
      if (domain === "borderWidth" && pathParts.at(-1) === "hairline" && value === "1px") continue;
      for (const match of value.matchAll(/(-?\d+(?:\.\d+)?)(px|rem)/g)) {
        const pixels = match[2] === "rem" ? Number(match[1]) * 16 : Number(match[1]);
        if (!Number.isInteger(pixels) || Math.abs(pixels) % 2 !== 0) {
          throw new Error(`Odd dimensional primitive primitive.${domain}.${pathParts.join(".")}: ${value}`);
        }
      }
    }
  }

  for (const [domain, values] of Object.entries(tokens.primitive)) {
    const seen = new Map();
    for (const [pathParts, raw] of entries(values)) {
      const canonical = String(raw).trim().toLowerCase().replace(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/, "#$1$1$2$2$3$3");
      const previous = seen.get(canonical);
      if (previous) throw new Error(`Duplicate primitive value in ${domain}: ${previous} and ${pathParts.join(".")}`);
      seen.set(canonical, pathParts.join("."));
    }
  }
}

function kebab(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
}

function variable(pathParts, prefix) {
  return `--${prefix}-${pathParts.map(kebab).join("-")}`;
}

function declarations(object) {
  return Object.entries(object)
    .filter(([property]) => typographyProperties.has(property))
    .map(([property, value]) => `  ${kebab(property)}: var(${variable(referencePath(value).slice(1), "primitive")});`)
    .join("\n");
}

function typographyRules(value = tokens.semantic.typography, pathParts = []) {
  const rules = [];
  for (const [key, child] of Object.entries(value)) {
    const next = [...pathParts, key];
    if (child.default && Object.keys(child.default).some((property) => typographyProperties.has(property))) {
      const selector = `.type-${next.map(kebab).join("-")}`;
      rules.push(`${selector} {\n${declarations(child.default)}\n}`);
      for (const variant of child.responsive ?? []) {
        const condition = variant.minWidth
          ? `(min-width: ${resolve(variant.minWidth)})`
          : variant.maxWidth
            ? `(width < ${resolve(variant.maxWidth)})`
            : resolve(variant.media);
        rules.push(`@media ${condition} {\n  ${selector} {\n${declarations(variant).split("\n").map((line) => `  ${line}`).join("\n")}\n  }\n}`);
      }
    } else {
      rules.push(...typographyRules(child, next));
    }
  }
  return rules;
}

function buildCss() {
  const primitiveLines = entries(tokens.primitive).map(([pathParts, value]) => `  ${variable(pathParts, "primitive")}: ${value};`);
  const semanticLines = entries(tokens.semantic)
    .filter(([, value]) => typeof value === "string")
    .map(([pathParts, value]) => `  ${variable(pathParts, "semantic")}: var(${variable(referencePath(value).slice(1), "primitive")});`);
  const publicAliases = [
    ["background", "color-background-primary"],
    ["foreground", "color-text-on-brand"],
    ["muted", "color-text-muted"],
    ["border", "color-border-on-brand"],
    ["accent", "color-accent-primary"],
    ["page-gutter", "layout-page-gutter-default"],
  ].map(([name, target]) => `  --${name}: var(--semantic-${target});`);
  const responsiveGutter = tokens.semantic.layout.pageGutter.responsive.map(({ minWidth, value }) =>
    `@media (min-width: ${resolve(minWidth)}) {\n  :root { --page-gutter: var(${variable(referencePath(value).slice(1), "primitive")}); }\n}`
  );
  const theme = [
    ["color-background", "--background"],
    ["color-foreground", "--foreground"],
    ["color-muted", "--muted"],
    ["color-border", "--border"],
    ["color-accent", "--accent"],
    ["color-surface-file", "--semantic-color-surface-file"],
    ["color-surface-file-cool", "--semantic-color-surface-file-cool"],
    ["color-surface-file-muted", "--semantic-color-surface-file-muted"],
    ["color-surface-sheet", "--semantic-color-surface-sheet"],
    ["color-ink-on-light", "--semantic-color-text-on-light"],
    ["color-collaborator-design", "--semantic-color-collaborator-design"],
    ["color-collaborator-product", "--semantic-color-collaborator-product"],
    ["color-collaborator-engineering", "--semantic-color-collaborator-engineering"],
    ["spacing-page-gutter", "--page-gutter"],
    ["spacing-grid", "--semantic-layout-grid-gap"],
    ["spacing-section", "--semantic-spacing-section-inset"],
    ["spacing-content", "--semantic-spacing-content-gap"],
    ["spacing-control-inline", "--semantic-spacing-control-inline"],
    ["spacing-control-start", "--semantic-spacing-control-block-start"],
    ["spacing-control-end", "--semantic-spacing-control-block-end"],
    ["spacing-stack-xs", "--semantic-spacing-stack-xsmall"],
    ["spacing-stack-sm", "--semantic-spacing-stack-small"],
    ["spacing-stack-md", "--semantic-spacing-stack-medium"],
    ["spacing-stack", "--semantic-spacing-stack-regular"],
    ["spacing-stack-lg", "--semantic-spacing-stack-large"],
    ["radius-surface", "--semantic-radius-surface"],
    ["radius-control", "--semantic-radius-control"],
    ["font-display", "--primitive-font-family-display"],
    ["font-sans", "--primitive-font-family-sans"],
  ].map(([name, target]) => `  --${name}: var(${target});`);
  theme.push(`  --breakpoint-ultra-wide: ${tokens.primitive.breakpoint.ultraWide};`);

  return [
    "/* DO NOT EDIT — generated from design-system/tokens.json */",
    "@import \"tailwindcss\";",
    ":root {",
    ...primitiveLines,
    ...semanticLines,
    ...publicAliases,
    "}",
    ...responsiveGutter,
    "@theme inline {",
    ...theme,
    "}",
    ...typographyRules(),
    ".presence-badge {",
    "  border: var(--semantic-border-hairline) solid var(--semantic-color-border-on-brand-control);",
    "  border-radius: var(--semantic-radius-control);",
    "  padding: var(--semantic-spacing-control-block-start) var(--semantic-spacing-control-inline) var(--semantic-spacing-control-block-end);",
    "  box-shadow: 0 var(--semantic-shadow-floating-offset-y) var(--semantic-shadow-floating-blur) var(--semantic-color-shadow-floating);",
    "}",
    ".opacity-subdued { opacity: var(--semantic-opacity-subdued); }",
    ".measure-display { max-width: var(--semantic-layout-measure-display); }",
    ".border-top-hairline { border-top: var(--semantic-border-hairline) solid currentColor; }",
    ".focus-ring:focus-visible {",
    "  outline: var(--semantic-border-focus-width) solid var(--accent);",
    "  outline-offset: var(--semantic-border-focus-offset);",
    "}",
    "",
  ].join("\n");
}

validate();
const css = buildCss();
const mode = process.argv[2];

if (mode === "--validate") {
  console.log("Design tokens are valid.");
} else if (mode === "--check") {
  const current = await readFile(outputPath, "utf8").catch(() => "");
  if (current !== css) throw new Error("Generated tokens are stale. Run npm run tokens:build.");
  console.log("Design tokens are valid and generated output is current.");
} else if (mode) {
  throw new Error(`Unknown option: ${mode}`);
} else {
  await writeFile(outputPath, css);
  console.log(`Built ${path.relative(root, outputPath)}.`);
}

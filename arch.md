# Architecture — Daria Forsiuk Portfolio

## Current State (March 2026)

### Files
```
index.html        — home page (all sections)
style.css         — all styles, single file
landing.html      — MM Landing case study
assets/           — images, SVGs, CV PDF
```

### Page structure (index.html)
```
<nav>                        fixed, 12-col grid desktop / 2-col mobile
<div.menu-overlay>           mobile slide-down overlay
<section.hero>               100vh full-bleed photo + name
<section.who-am-i#about>     bio block
<section.cases#work>         3 case cover cards
<section.skills#skills>      2-col skills grid
<section.contact#contact>    CTA + links
<footer.site-footer>         logo + copy + links
```

---

## Why Things Keep Breaking — Root Causes

### Problem 1: Desktop-first CSS
The current CSS writes the desktop layout first (12-col grid, fixed px widths), then overrides everything at `max-width: 900px`. This means **every section is written twice** — once for desktop, once for mobile. If Claude adds a property to desktop and forgets the mobile override, it breaks. If a mobile override is missing, the desktop value leaks through.

### Problem 2: No shared layout system
The CSS defines `.container` and `.grid` utility classes (lines 21-34) but **never uses them**. Instead, every section creates its own grid from scratch:
- `nav` → `repeat(12, minmax(0, 1fr))`
- `.hero-info` → `repeat(12, minmax(0, 1fr))`
- `.skills-grid` → `repeat(12, minmax(0, 1fr))`
- `.contact-grid` → `repeat(12, minmax(0, 1fr))`
- `.site-footer` → `repeat(12, minmax(0, 1fr))`
- `.case-item` → `382px 1fr` (completely different)
- `.wai-grid` → flexbox (no grid at all)

Same 12-col grid declared 5 separate times. Each one needs its own padding, its own mobile override.

### Problem 3: Hardcoded pixel widths
These values work at exactly 1440px and break at everything between 900px and 1440px:
- `.case-item` → `382px` left column
- `.wai-photo` → `328px`
- `.wai-bio` → `300px`
- `.contact-label` → `width: 184px`
- `.wai-top` → `max-width: calc(6 * 96px + 5 * 20px)` (676px)

At 1000px viewport, the cases section tries to fit 382px + image into 1000px - 68px margins = 932px. That leaves only 550px for the image. It works, but barely — and any future section with similar fixed widths will break.

### Problem 4: Inconsistent spacing
Every section handles side margins and vertical spacing differently:
- `.who-am-i` → `padding: 80px 34px 100px` (padding for sides AND vertical)
- `.cases` → `margin-top: 120px` (no side padding, children have their own padding)
- `.skills` → `margin-top: 120px; padding: 34px 0` (no side padding, grid child has `padding: 0 34px`)
- `.contact` → `padding: 140px 34px 120px`
- `.site-footer` → `margin: 120px 10px 10px; padding: 14px 34px`

Three different approaches to the same problem (getting 34px side margins on desktop, 24px on mobile).

### Problem 5: The 900-1100px danger zone
There is **no breakpoint** between 900px and 1440px. At 901px, the full desktop 12-column layout is active, but there's only 901px of space. Fixed-width columns (382px cases) eat most of it. The skills sticky sidebar splits 5/7 columns at 901px — the 5-column sidebar gets ~350px, which barely fits the headline text.

---

## Recommended Architecture

### Mobile-first: Why and What It Means

**Mobile-first means the base CSS (no media query) is the mobile layout.** Then you add complexity with `min-width` media queries as the screen grows.

Why this is better for a designer using Claude:
1. **Mobile is simpler** — single column, full width, stacked elements. It's the easy case.
2. **You only add complexity when there's room for it** — columns, sidebars, fixed widths only appear inside `@media (min-width: ...)`.
3. **If Claude forgets an override, the mobile layout shows** — which is simpler and usually still usable. With desktop-first, a missing override shows a broken desktop layout crammed into a phone.
4. **Less total CSS** — overrides add properties (from 1 column to 2 columns) instead of removing them (from 12 columns to 1 column).

### The Three Breakpoints

```
Base (no query)     →  mobile         (0 – 599px)
@media (min-width: 600px)  →  tablet  (600 – 1023px)
@media (min-width: 1024px) →  desktop (1024px+)
```

Why `1024px` instead of `900px`:
- 900px is too narrow for a real 12-column grid with 20px gutters
- 1024px is the natural point where a 2-column case layout has room to breathe
- iPads in landscape are 1024px — a common real device boundary

Why add `600px`:
- Currently there's nothing between 0 and 900px. A phone is 375px, a tablet is 768px. These need different layouts (e.g. hero name font size, case image size).

### The Shared Layout System

Instead of every section creating its own grid, define two reusable patterns:

**Pattern A: Section with side padding** (most sections)
```css
.section {
  padding-left: var(--margin);
  padding-right: var(--margin);
}
```
Where `--margin` is `24px` at base, `34px` at desktop.

**Pattern B: Section inner grid** (when you need columns)
```css
.section-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gutter);
  max-width: var(--grid-width);
  margin: 0 auto;
}

@media (min-width: 1024px) {
  .section-grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
}
```

Every section that needs a 12-col layout uses `.section-grid` inside its own wrapper. The grid only activates at desktop. On mobile, it's a single column by default.

### Updated CSS Custom Properties

```css
:root {
  /* Spacing */
  --margin: 24px;          /* side margins (mobile default) */
  --gutter: 20px;
  --section-gap: 72px;     /* vertical gap between sections (mobile default) */
  --grid-width: 1372px;

  /* Colors */
  --black: #0a0a0a;
  --white: #ffffff;
  --blue: #0500ff;
  --gray: #888888;

  /* Typography */
  --font: "Inter Tight", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
}

@media (min-width: 1024px) {
  :root {
    --margin: 34px;
    --section-gap: 120px;
  }
}
```

Now spacing is controlled in **one place**. Every section uses `var(--margin)` and `var(--section-gap)`. Change the token, everything updates.

### Vertical Spacing Rule

Every section except the hero gets:
```css
.section-name {
  margin-top: var(--section-gap);
}
```

No more mixing `margin-top` vs `padding-top` for inter-section spacing. Padding is for **internal** spacing within a section. Margin is for **between** sections.

### How Each Section Should Work

#### Nav
Already works well. Keep the current approach: fixed, own 12-col grid on desktop, 2-col on mobile. Nav is special — it doesn't follow the section pattern because it's fixed-position.

#### Hero
Full-bleed, no side margins. Already correct. No changes needed.

#### Who Am I
**Current problem:** Uses flexbox with hardcoded widths (328px photo, 300px bio).
**Fix:** On mobile, stack everything. On desktop, use the shared 12-col grid:
```
Mobile:    [label] [headline] [jump]  then  [photo + bio stacked, right-aligned]
Desktop:   cols 1-6: label + headline + jump
           cols 7-9: photo (3 cols wide)
           cols 10-12: bio (3 cols wide)
```
This way the photo and bio widths are **proportional** (3 columns each) instead of fixed px. At 1024px they'll be narrower. At 1440px they'll be wider. Both work.

#### Cases
**Current problem:** `grid-template-columns: 382px 1fr` — the 382px is fixed and too wide at smaller desktops.
**Fix:** Use a proportional split:
```
Mobile:    single column, stacked (image on top, text below)
Desktop:   grid-template-columns: 4fr 8fr
           (roughly 33%/67%, similar to current 382/1058 ratio)
```
`4fr 8fr` gives the same visual weight as the current layout at 1440px but **scales down gracefully** to 1024px.

#### Skills
**Current problem:** 12-col grid split 5/7 for sidebar/content. Works at 1440px. At 1024px the sidebar is cramped.
**Fix:**
```
Mobile:    single column (label, headline, then skills cards stacked)
Desktop:   grid-template-columns: 5fr 7fr  (same ratio, responsive)
```
Keep the sticky behavior via CSS `position: sticky` on the left column (already works). The JS sticky-release for the last row can stay.

#### Contact
**Current problem:** Uses 12-col grid, label in col 1, content in cols 6-13.
**Fix:** Same pattern as Who Am I — label in first few columns, content spanning the rest. Uses the shared section-grid.

#### Footer
Already uses 12-col grid. Keep as-is but use the shared grid class.

### Section Template for Claude

When Claude builds a new section, it should follow this template:

```html
<section class="section-name" id="anchor-name">
  <div class="section-name-grid section-grid">
    <!-- content here -->
  </div>
</section>
```

```css
/* Mobile-first (base) */
.section-name {
  margin-top: var(--section-gap);
  padding: 0 var(--margin);
}

/* Desktop additions */
@media (min-width: 1024px) {
  /* Only add properties that CHANGE from mobile */
}
```

Rules:
1. **Base styles = mobile.** Never write a desktop layout without a media query.
2. **Use `var(--margin)` for side padding.** Never hardcode `24px` or `34px`.
3. **Use `var(--section-gap)` for vertical spacing.** Never hardcode `72px` or `120px`.
4. **Use `fr` units for grid columns** when you need proportional splits. Never use fixed `px` for column widths.
5. **Only use fixed `px` widths for images and small UI elements** (photo dimensions, icon sizes, button padding).
6. **Every property in a `@media` block must be an _addition_ to the base**, not an override. If you find yourself writing `display: none` in a media query, you probably have the wrong default.

---

## Other Architecture Notes

### CSS File Structure
One `style.css` is fine. Organised in this order:
1. Tokens (custom properties)
2. Reset
3. Shared layout utilities (`.section-grid`)
4. Nav (fixed, special)
5. Each section in page order (hero, who-am-i, cases, skills, contact, footer)
6. Mobile menu overlay
7. Each section's responsive overrides grouped with the section (not in a giant `@media` block at the bottom)

**Important change:** Move each section's responsive rules **next to** the section's base rules, not in a separate block at the end of the file. This is the #1 thing that prevents "forgetting to update the mobile override" — if desktop and mobile rules are 800 lines apart, they drift.

Example:
```css
/* ---- CASES ---- */
.cases { ... }
.case-item { ... }

@media (min-width: 1024px) {
  .case-item { ... }
}
```

Not:
```css
/* ---- CASES ---- */
.cases { ... }
.case-item { ... }

/* ... 500 lines later ... */

@media (max-width: 900px) {
  .case-item { ... }
}
```

### Consistent Section ID Naming
- `id` = semantic name for linking (`#about`, `#work`, `#skills`, `#contact`)
- `class` = visual component name (`.who-am-i`, `.cases`, `.skills`, `.contact`)
- Always check both desktop nav AND mobile overlay nav point to the correct `id`

### Case Study Pages
Each case page shares the same nav, contact, and footer. Since there's no build tool, copy-paste is fine. Mark shared regions with comments:
```html
<!-- SHARED: nav -->
<nav>...</nav>
<!-- /SHARED: nav -->
```
When updating nav, search for `<!-- SHARED: nav -->` across all HTML files.

### SVG Strategy
- `inlineJitter()` pattern: fetch → parse → replace `<img>` with inline `<svg>` → animate
- Always URL-encode spaces in filenames in both HTML `src` and JS strings
- Never leave a jitter function defined but uncalled

### Asset Naming
New assets use hyphens: `case-cover-wave.png`. Existing spaced names stay (already URL-encoded everywhere).

### JavaScript
All inline at bottom of `<body>`. Fine for current scale. If it exceeds ~200 lines, extract to `main.js` with `defer`.

### Accessibility Baseline
Before launch:
- Wrap all sections in `<main>`
- `<nav aria-label="Main navigation">`
- Mobile overlay: trap focus when open
- Case links with `href="#"` → either real links or `aria-disabled="true"`

### Performance
- Google Fonts: `preconnect` tags present
- Consider WebP inside `<picture>` for case covers
- SVG animations already throttled with IntersectionObserver
- RAF cancelled on mouseleave

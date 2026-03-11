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

## Recommended Architecture Improvements

### 1. Split CSS into logical partials (when complexity grows)
Right now one `style.css` works fine. If the file exceeds ~600 lines of active rules, consider splitting:
```
base.css          — reset, tokens, grid, typography
nav.css           — nav + mobile overlay
sections.css      — hero, wai, cases, skills, contact, footer
```
Keep concatenated into a single file for production (no build tool needed — just concat with a simple shell script or by hand).

### 2. Consistent section ID naming convention
Every section that can be linked to needs an explicit `id`. Current state:
- `#about` → `.who-am-i`
- `#work` → `.cases`
- `#skills` → `.skills`
- `#contact` → `.contact`

Rule: the `id` is the semantic name of the content, the class is the visual component name. Keep them separate and always double-check both desktop nav links AND mobile overlay links point to the correct `id`.

### 3. Case study pages — consistent template
Each case study page should share the same shell:
```
<nav>               (same as index, copy-paste, no includes)
<section.case-hero> full-bleed cover image
<section.case-intro>
<section.case-body> (variable content blocks)
<section.contact>   (same CTA as index)
<footer>            (same as index)
```
For plain HTML with no build step, duplication is acceptable. Use `<!-- COMPONENT: nav -->` comments to mark shared regions so they're easy to find and update across files.

### 4. SVG inline strategy — keep current approach, encode filenames
The `inlineJitter()` pattern (fetch → innerHTML → replaceWith) is correct for adding stroke-jitter animation without touching the HTML. Rules:
- Asset filename with spaces → always URL-encode in HTML `src` AND in JS fetch string
- Every `catch(() => {})` should log to console in development: `catch(e => console.warn('inlineJitter failed:', e))`
- Never leave a jitter function defined but uncalled

### 5. Asset naming convention (enforce going forward)
Spaces in filenames cause repeated bugs (#2 in qa.md). Going forward:
```
✅  case-cover-wave.png
✅  case-cover-wave-mob.png
✅  architectural-plan.svg
❌  case cover wave.png
❌  architectural plan.svg
```
Existing assets can stay as-is (already URL-encoded in HTML). New assets should use hyphens.

### 6. JavaScript organisation
All JS is currently inline at the bottom of `index.html`. This is fine for the current scale. If it grows past ~200 lines, extract to `main.js` and load with `<script src="main.js" defer>`.

Current JS modules (logical, not actual files):
- `londonClock` — updates `#london-time` every 60s
- `navScroll` — nav frosted glass + dark/light colour switch
- `skillsSticky` — JS-assisted sticky for `.skills-left`
- `footerHide` — hides nav when footer is visible
- `mobileMenu` — overlay open/close
- `inlineJitter` — shared helper for skills SVG stroke jitter
- `casesArrow` — squiggly wave animation on case link hover
- `waiArrow` — squiggly wave animation on "jump to cases" hover

### 7. Accessibility baseline
Current gaps to address before launch:
- Add `<main>` wrapper around all page sections
- `<nav>` should have `aria-label="Main navigation"`
- Mobile overlay: trap focus inside when open (`tabindex`, focus first link on open, restore on close)
- Case links with `href="#"` (Wave, Tehnohata) should either be real links or `aria-disabled="true"` with `role="link"`
- Footer "go to top" link: currently `href="#"` — works with `scroll-behavior: smooth`, is acceptable

### 8. Performance
- Google Fonts: two `preconnect` tags present — correct
- Images: use WebP for case covers when possible (add `<source type="image/webp">` inside `<picture>`)
- SVG jitter animations: already throttled with IntersectionObserver — correct
- Animation RAF already cancelled on mouseleave — correct

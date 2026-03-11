# Project Rules

## Overview
Portfolio website for Daria Forsiuk. Plain HTML + CSS, no frameworks, no build tools.

## Stack
- HTML5 + CSS3 only
- No JavaScript frameworks
- No preprocessors (no Sass, no PostCSS)
- Prettier installed as dev dependency for CSS formatting
- Images stored in `assets/`

## File Structure
- `index.html` — home page
- `style.css` — all styles
- `assets/` — images and SVGs

## Design Tokens
- Black: `#0a0a0a`
- White: `#ffffff`
- Electric blue: `#0500ff` (also used as `#3638FF` at 0.7 opacity for SVG arrows)
- Gray: `#888888`
- Light background: `#f4f4f4`
- Font: Inter Tight only (no Helvetica, Arial, or other fallbacks)
- Mono font: IBM Plex Mono only

## Grid (desktop 1440px)
- 12 columns, 96px wide, 20px gutters, centered
- Total content width: 1372px
- Side margins: 34px on desktop, 24px on mobile

## Breakpoints
- `≤900px` — mobile/tablet
- `≤585px` — small mobile (hero name stacks)
- `≤480px` — extra small

## Spacing Rules
- Desktop section gap: 120px
- Mobile section gap: 72px (general rule between all sections)
- Mobile case cover gap: 48px between items
- Desktop case cover gap: 34px between items

## Typography Rules
- Never change image proportions (object-fit: cover/contain only, no stretching)
- `text-wrap: balance` on headings
- `text-wrap: pretty` on body paragraphs
- Em dash (—) must never start a line → use `&nbsp;—` before it
- Standalone "I" and "a" must never end a line → use `&nbsp;` after them
- Letter-spacing: 0 on all text (no tracking)
- `desk-br` class for desktop-only line breaks (hidden at ≤900px)

## Components

### Nav
- Fixed, 10px inset from viewport edges
- 12-col grid on desktop, 2-col on mobile
- Dark mode toggle via IntersectionObserver on hero
- Mobile: hamburger (MENU + filled circle dot, IBM Plex Mono 14px)

### Mobile Menu Overlay
- Slides down from top (`transform: translateY`)
- `visibility` + `pointer-events` used (not `display`) for animation
- Height: 62vh
- Closes on: overlay link click, close button click, outside click

### Hero
- 100vh, background image with cover
- `daria forsiuk` flush to bottom, font-size: 17.15vw desktop
- Mobile gradient overlay for text legibility
- Live London clock via `Intl.DateTimeFormat`

### Who Am I
- White background section
- Top: 6-col text block (label + headline + jump button)
- Bottom: photo (328×280px desktop, 240×209px mobile) + bio, right-aligned
- `overflow-x: hidden` on section to prevent layout overflow at mid-range viewports

### Case Covers (3 total)
- CSS Grid layout: `344px` left column + `1fr` image column
- First case has `.case-section-label` ("HERE'S SOME OF MY WORK")
- Subsequent cases use `.case-item--no-label` (no label row)
- `<picture>` element for responsive image swap at 900px
- `srcset` filenames with spaces must be URL-encoded (spaces → `%20`)
- Desktop: 34px right margin on image
- Mobile: square image frame (`aspect-ratio: 1/1`), 24px margins all around
- Internal mobile gaps: image→tags 24px, tags→desc 16px, desc→button 24px

### Arrows
- `squiggly arrow.svg` (134px) — used on "JUMP TO CASES" button
- `squiggly arrow cases.svg` (106px) — used on "VIEW CASE" buttons
- SVG arrow centreline sits 14px below button text (`margin-top: -1px`)

## Known Issues / Gotchas
- `overflow-x: hidden` on `body` (not `html`) creates a scroll container, which breaks `position: fixed` nav at mid-range viewports if any child overflows → always clip overflow at the section level
- Spaces in `srcset` attribute break `<picture>` parsing → URL-encode them
- `text-wrap: pretty` only fixes last-line orphans, not mid-paragraph single letters → use `&nbsp;` manually

## LinkedIn
https://www.linkedin.com/in/daria-forsiuk/

## Workflow
- User provides content and assets; Claude edits code directly
- Commit after each meaningful session
- Deploy target: GitHub Pages

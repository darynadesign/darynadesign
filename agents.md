# Project Rules

## Overview
Portfolio website for Daria Forsiuk. Plain HTML + CSS, no frameworks, no build tools.

## Stack
- HTML5 + CSS3 only
- No JavaScript frameworks
- No preprocessors (no Sass, no PostCSS)
- Images stored in `assets/`

## File Structure
- `index.html` — home page
- `style.css` — all styles
- `assets/` — images (portrait.jpg, project-1.jpg ... project-4.jpg)

## Design Tokens (from Figma mockup)
- Black: `#0a0a0a`
- White: `#ffffff`
- Electric blue: `#0500ff`
- Gray: `#888888`
- Light background: `#f4f4f4`
- Font: Inter Tight only (no system fallbacks like Helvetica or Arial)
- Mono font: IBM Plex Mono only

## Grid (1440px breakpoint)
- 12 columns, 96px wide, 20px gutters, centered
- Total content width: 1372px
- Side margins: 34px
- Use `.container` to constrain content width and center it
- Use `.grid` for 12-column CSS grid layouts

## Code Style
- CSS custom properties for all design tokens (defined in `:root`)
- Mobile-first responsive with breakpoints at 900px and 480px
- `clamp()` for fluid typography
- No inline styles

## Workflow
- User provides content and assets; Claude edits the code directly
- Commit after each meaningful change
- Deploy target: GitHub Pages

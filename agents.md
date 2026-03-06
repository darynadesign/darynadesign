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
- Font: Inter, Helvetica Neue, Arial (system fallback)

## Code Style
- CSS custom properties for all design tokens (defined in `:root`)
- Mobile-first responsive with breakpoints at 900px and 480px
- `clamp()` for fluid typography
- No inline styles

## Workflow
- User provides content and assets; Claude edits the code directly
- Commit after each meaningful change
- Deploy target: GitHub Pages

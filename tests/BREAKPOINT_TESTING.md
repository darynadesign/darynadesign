# Breakpoint & Accessibility Testing Workflow

Run this after any substantial layout or CSS change.

## When to run

- After adding or changing mobile/responsive styles
- After editing the Skills, Cases, Who Am I, or Contact sections
- After any change to `nav`, `hero`, or `site-footer`
- After adding new sections or refactoring the grid

## How to run

```bash
# Run all breakpoints
npx playwright test

# Run a specific breakpoint
npx playwright test --project=mobile-360
npx playwright test --project=tablet-768
npx playwright test --project=laptop-1280
npx playwright test --project=desktop-1440

# Run only breakpoint layout checks
npx playwright test -g "Breakpoint layout"

# Run only accessibility checks
npx playwright test -g "Accessibility"

# Show headed browser (useful for visual debugging)
npx playwright test --headed --project=mobile-360
```

## Breakpoints covered

| Project        | Width | Height | Type    |
|----------------|-------|--------|---------|
| mobile-360     | 360px | 800px  | mobile  |
| tablet-768     | 768px | 1024px | tablet  |
| laptop-1280    | 1280px| 800px  | laptop  |
| desktop-1440   | 1440px| 900px  | desktop |

CSS breakpoint: `≤900px` triggers mobile layout (hamburger nav, single-col skills, etc.)

## What the tests check

### Breakpoint layout
- No horizontal overflow (white strip on the right)
- No element bleeds beyond viewport right edge
- Skills section has correct blue background
- Skills items: 1 column at ≤900px, 2 columns at >900px
- Hero name stays within hero section
- Nav stays within viewport bounds

### Accessibility
- `<html lang="en">` present
- All `<img>` have `alt` attributes
- `<nav>` landmark visible
- Exactly one `<h1>` on the page
- All interactive elements (`a`, `button`) are focusable
- Skills text opacity > 0 (not invisible)
- Hero name does not overlap the nav bar

## Common failure patterns

| Symptom | Likely cause |
|---------|-------------|
| Horizontal overflow | A new element has fixed px width wider than viewport, or negative margin |
| Skills layout 2-col on mobile | Missing `grid-template-columns: 1fr` in `@media (max-width: 900px)` |
| Blue background missing | `background` overridden somewhere in mobile styles |
| Image missing alt | New `<img>` added without `alt=""` attribute |

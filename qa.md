# QA Log — Recurring Issues & Solutions

## 1. Anchor href / id mismatch

**Symptom:** Clicking a nav link does nothing or jumps to wrong place.
**Cause:** `href="#cases"` in mobile menu but the section has `id="work"`.
**Fix:** Always verify `href` value matches the exact `id` on the target element. Check all nav links (desktop + mobile overlay separately) against actual section IDs.
**Lesson:** Desktop nav and mobile overlay nav are written independently — they can drift. When adding/renaming a section, update both.

---

## 2. JS querySelector fails on URL-encoded src attributes

**Symptom:** SVG illustration not replaced / animation not applied. No JS error in console because `catch(() => {})` silently swallows failures.
**Cause:** HTML `src="assets/architectural%20plan.svg"` (URL-encoded) but JS `inlineJitter('assets/architectural plan.svg')` (unencoded). `querySelector('[src="..."]')` matches against the raw attribute string, not the resolved URL — so it fails to find the element.
**Fix:** Always use the same encoding in both HTML and JS. Prefer URL-encoded form (`%20` for spaces) in both places so the attribute selector matches.
**Rule to follow:** If an asset filename contains spaces, URL-encode the space in **both** the HTML `src`/`srcset` attribute and any JS string that references it.

---

## 3. Dead code accumulation (unused JS functions)

**Symptom:** Function defined but never called (e.g. `inlineHoverJitter`).
**Cause:** Function written speculatively or left over after a refactor.
**Fix:** Remove the function. If it will be needed later, it can be re-added.
**Rule to follow:** Don't leave defined-but-uncalled functions in `<script>`. If a feature is planned but not wired up yet, add a `// TODO:` comment or remove the dead code.

---

## 4. Dead CSS from design iteration

**Symptom:** ~30% of style.css were rules for classes that don't exist in HTML (`.project`, `.about`, `.values`, `.footer`, `.hero-text`, etc.) — leftovers from an earlier design direction.
**Fix:** Removed all dead CSS blocks. The live classes are now: nav, hero, who-am-i/wai-_, cases/case-_, skills/skills-_, contact/contact-_, site-footer/site-footer-_, menu-overlay_.
**Rule to follow:** After each major redesign iteration, grep for every CSS class in HTML and delete any CSS rule with no matching HTML element.

---

## 5. `<picture>` srcset breaks on unencoded spaces

**Symptom:** Mobile image doesn't load / browser falls back to default `<img>` src.
**Cause:** Spaces in filenames inside `srcset` attributes break `<picture>` parsing — the browser treats the space as a delimiter between candidates.
**Fix:** URL-encode spaces in `srcset` values: `assets/case%20cover%20wave%20mob.png`.
**Status:** Already fixed in HTML; this is a reminder to keep all future `srcset` values encoded.

---

## 6. `overflow-x: hidden` on `body` breaks `position: fixed`

**Symptom:** Fixed nav disappears or jumps at mid-range viewport widths when content overflows.
**Cause:** `overflow: hidden` on `body` (not `html`) creates a new scroll container, which clips `position: fixed` elements relative to it instead of the viewport.
**Fix:** Apply `overflow-x: hidden` at the **section level** (e.g. `.who-am-i { overflow-x: hidden; }`) rather than on `body`.
**Status:** Already applied correctly; documented here as a recurring trap.

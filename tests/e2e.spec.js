import { test, expect } from "@playwright/test";

// Breakpoints mirror CSS: hamburger shown at ≤900px, nav links hidden
const MOBILE_BP = 900;

const isDesktop = ({ viewport }) => !viewport || viewport.width >= MOBILE_BP;
const isMobile = ({ viewport }) => viewport && viewport.width < MOBILE_BP;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

// ─── Navigation ────────────────────────────────────────────────────────────────

test.describe("Navigation", () => {
  test("renders logo linking to home", async ({ page }) => {
    const logo = page.locator("nav .logo");
    await expect(logo).toBeVisible();
    await expect(logo).toHaveText("df.");
    await expect(logo).toHaveAttribute("href", "index.html");
  });

  test("renders portfolio label", async ({ page, viewport }) => {
    test.skip(isMobile({ viewport }), "desktop only – label hidden on mobile");
    await expect(page.locator(".nav-label")).toBeVisible();
    await expect(page.locator(".nav-label")).toHaveText("PORTFOLIO '26");
  });

  test("desktop nav links visible and point to correct anchors", async ({
    page,
    viewport,
  }) => {
    test.skip(isMobile({ viewport }), "desktop only – links hidden on mobile");
    await expect(page.locator('.nav-links a[href="#about"]')).toBeVisible();
    await expect(page.locator('.nav-links a[href="#work"]')).toBeVisible();
    await expect(page.locator('.nav-links a[href="#contact"]')).toBeVisible();
  });

  test("CV link opens in new tab", async ({ page, viewport }) => {
    test.skip(
      isMobile({ viewport }),
      "desktop only – CV link hidden on mobile",
    );
    const cvLink = page.locator("nav .nav-cta");
    await expect(cvLink).toHaveAttribute("target", "_blank");
    await expect(cvLink).toHaveAttribute("href", "assets/cv.pdf");
  });

  test("nav becomes dark after scrolling past hero", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).not.toHaveClass(/dark/);
    await page.evaluate(() => window.scrollBy(0, window.innerHeight + 100));
    await expect(nav).toHaveClass(/dark/);
  });

  test("nav loses dark class when scrolled back to hero", async ({ page }) => {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight + 100));
    const nav = page.locator("nav");
    await expect(nav).toHaveClass(/dark/);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(nav).not.toHaveClass(/dark/);
  });
});

// ─── Hero ──────────────────────────────────────────────────────────────────────

test.describe("Hero", () => {
  test("displays full name", async ({ page }) => {
    await expect(page.locator(".hero-name")).toHaveText("daria forsiuk");
  });

  test("shows london location", async ({ page }) => {
    await expect(page.locator(".hero-info-block--left")).toContainText(
      "london, uk",
    );
  });

  test("displays london time in correct format", async ({ page }) => {
    const timeEl = page.locator("#london-time");
    await expect(timeEl).toBeVisible();
    // Format: "GMT, HH:MM" or "BST, HH:MM"
    await expect(timeEl).toHaveText(/^(GMT|BST),\s\d{2}:\d{2}$/);
  });

  test("london time interval fires without errors", async ({ page }) => {
    const timeEl = page.locator("#london-time");

    // Install fake clock, fast-forward 60s so the setInterval callback runs
    await page.clock.install();
    await page.clock.fastForward(60_000);

    await expect(timeEl).toHaveText(/^(GMT|BST),\s\d{2}:\d{2}$/);
  });

  test("shows role labels", async ({ page }) => {
    const right = page.locator(".hero-info-block--right");
    await expect(right).toContainText("ui/ux designer");
    await expect(right).toContainText("ex-arch. designer");
  });
});

// ─── Mobile menu ───────────────────────────────────────────────────────────────

test.describe("Mobile menu", () => {
  test("hamburger button visible on mobile", async ({ page, viewport }) => {
    test.skip(isDesktop({ viewport }), "mobile only");
    await expect(page.locator(".nav-hamburger")).toBeVisible();
  });

  test("hamburger button hidden on desktop", async ({ page, viewport }) => {
    test.skip(isMobile({ viewport }), "desktop only");
    await expect(page.locator(".nav-hamburger")).toBeHidden();
  });

  test("overlay is hidden by default", async ({ page }) => {
    const overlay = page.locator("#menuOverlay");
    await expect(overlay).not.toHaveClass(/is-open/);
    await expect(overlay).toHaveAttribute("aria-hidden", "true");
  });

  test("hamburger opens the overlay", async ({ page, viewport }) => {
    test.skip(
      isDesktop({ viewport }),
      "mobile only – hamburger hidden on desktop",
    );
    await page.locator(".nav-hamburger").click();
    const overlay = page.locator("#menuOverlay");
    await expect(overlay).toHaveClass(/is-open/);
    await expect(overlay).toHaveAttribute("aria-hidden", "false");
  });

  test("opening menu locks body scroll", async ({ page, viewport }) => {
    test.skip(isDesktop({ viewport }), "mobile only");
    await page.locator(".nav-hamburger").click();
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe("hidden");
  });

  test("close button hides the overlay", async ({ page, viewport }) => {
    test.skip(isDesktop({ viewport }), "mobile only");
    await page.locator(".nav-hamburger").click();
    await page.locator("#menuClose").click();
    const overlay = page.locator("#menuOverlay");
    await expect(overlay).not.toHaveClass(/is-open/);
    await expect(overlay).toHaveAttribute("aria-hidden", "true");
  });

  test("closing menu restores body scroll", async ({ page, viewport }) => {
    test.skip(isDesktop({ viewport }), "mobile only");
    await page.locator(".nav-hamburger").click();
    await page.locator("#menuClose").click();
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe("");
  });

  test("clicking a nav link inside overlay closes the menu", async ({
    page,
    viewport,
  }) => {
    test.skip(isDesktop({ viewport }), "mobile only");
    await page.locator(".nav-hamburger").click();
    await page.locator(".menu-overlay-link").first().click();
    await expect(page.locator("#menuOverlay")).not.toHaveClass(/is-open/);
  });

  test("clicking the CTA inside overlay closes the menu", async ({
    page,
    viewport,
  }) => {
    test.skip(isDesktop({ viewport }), "mobile only");
    await page.locator(".nav-hamburger").click();
    await page.locator(".menu-overlay-cta").click();
    await expect(page.locator("#menuOverlay")).not.toHaveClass(/is-open/);
  });

  test("clicking outside the overlay closes the menu", async ({
    page,
    viewport,
  }) => {
    test.skip(isDesktop({ viewport }), "mobile only");
    await page.locator(".nav-hamburger").click();
    await expect(page.locator("#menuOverlay")).toHaveClass(/is-open/);
    await page.locator(".hero-name").click({ force: true });
    await expect(page.locator("#menuOverlay")).not.toHaveClass(/is-open/);
  });

  test("overlay contains logo, 3 nav links, 2 externals", async ({
    page,
    viewport,
  }) => {
    test.skip(isDesktop({ viewport }), "mobile only");
    await page.locator(".nav-hamburger").click();
    const overlay = page.locator("#menuOverlay");
    await expect(overlay.locator(".menu-overlay-logo")).toHaveText("df.");
    await expect(overlay.locator(".menu-overlay-link")).toHaveCount(3);
    await expect(overlay.locator(".menu-overlay-external")).toHaveCount(2);
  });

  test("linkedin external link opens in new tab", async ({
    page,
    viewport,
  }) => {
    test.skip(isDesktop({ viewport }), "mobile only");
    await page.locator(".nav-hamburger").click();
    const linkedin = page.locator(".menu-overlay-external").first();
    await expect(linkedin).toHaveAttribute("target", "_blank");
  });
});

// ─── Who Am I section ──────────────────────────────────────────────────────────

test.describe("Who Am I section", () => {
  test("section label is correct", async ({ page }) => {
    await expect(page.locator(".wai-label")).toHaveText("WHO AM I?");
  });

  test("headline is present", async ({ page }) => {
    await expect(page.locator(".wai-headline")).toContainText("Hey, I'm Daria");
  });

  test('"Jump to cases" link points to #work', async ({ page }) => {
    await expect(page.locator(".wai-jump")).toHaveAttribute("href", "#work");
  });

  test("photo is rendered", async ({ page }) => {
    const photo = page.locator(".wai-photo img");
    await expect(photo).toBeVisible();
    await expect(photo).toHaveAttribute("src", "assets/kid.png");
  });

  test("bio has 2 paragraphs", async ({ page }) => {
    await expect(page.locator(".wai-bio p")).toHaveCount(2);
  });
});

// ─── Cases section ─────────────────────────────────────────────────────────────

test.describe("Cases section", () => {
  test("renders exactly 3 case items", async ({ page }) => {
    await expect(page.locator(".case-item")).toHaveCount(3);
  });

  test("first case has section label", async ({ page }) => {
    await expect(page.locator(".case-section-label")).toHaveText(
      "HERE'S SOME OF MY WORK",
    );
  });

  test("every case has a VIEW CASE link", async ({ page }) => {
    const links = page.locator(".case-link");
    await expect(links).toHaveCount(3);
    for (const link of await links.all()) {
      await expect(link).toContainText("VIEW CASE");
    }
  });

  test("every case has a cover image", async ({ page }) => {
    await expect(page.locator(".case-image img")).toHaveCount(3);
  });

  test("every case has tags and description", async ({ page }) => {
    await expect(page.locator(".case-tags")).toHaveCount(3);
    await expect(page.locator(".case-desc")).toHaveCount(3);
  });

  test("cases section is accessible at #work", async ({ page }) => {
    await expect(page.locator(".cases")).toHaveAttribute("id", "work");
  });
});

// ─── Grid alignment ────────────────────────────────────────────────────────────

test.describe("Grid alignment: nav vs hero-info", () => {
  test("nav-label and hero-info-block--left start at same x (col 6)", async ({
    page,
    viewport,
  }) => {
    test.skip(isMobile({ viewport }), "desktop only");

    const rects = await page.evaluate(() => {
      const nav = document.querySelector("nav");
      const hero = document.querySelector(".hero");
      const heroInfo = document.querySelector(".hero-info");
      const cs = (el) => window.getComputedStyle(el);
      return {
        viewportWidth: window.innerWidth,
        bodyWidth: document.body.getBoundingClientRect().width,
        navRect: nav.getBoundingClientRect(),
        navPaddingLeft: parseFloat(cs(nav).paddingLeft),
        navPaddingRight: parseFloat(cs(nav).paddingRight),
        heroRect: hero.getBoundingClientRect(),
        heroInfoRect: heroInfo.getBoundingClientRect(),
        heroInfoPaddingLeft: parseFloat(cs(heroInfo).paddingLeft),
        navLabel: document.querySelector(".nav-label").getBoundingClientRect(),
        heroLeft: document
          .querySelector(".hero-info-block--left")
          .getBoundingClientRect(),
        navLinks: document.querySelector(".nav-links").getBoundingClientRect(),
        heroRight: document
          .querySelector(".hero-info-block--right")
          .getBoundingClientRect(),
      };
    });

    console.log("viewportWidth:", rects.viewportWidth);
    console.log("bodyWidth:", rects.bodyWidth);
    console.log("nav width:", rects.navRect.width, "left:", rects.navRect.left);
    console.log(
      "nav paddingLeft:",
      rects.navPaddingLeft,
      "paddingRight:",
      rects.navPaddingRight,
    );
    console.log("hero width:", rects.heroRect.width);
    console.log(
      "hero-info width:",
      rects.heroInfoRect.width,
      "paddingLeft:",
      rects.heroInfoPaddingLeft,
    );
    console.log("nav-label x:", rects.navLabel.left);
    console.log("hero-left x:", rects.heroLeft.left);
    console.log("nav-links x:", rects.navLinks.left);
    console.log("hero-right x:", rects.heroRight.left);
    console.log("diff col6:", rects.navLabel.left - rects.heroLeft.left);
    console.log("diff col9:", rects.navLinks.left - rects.heroRight.left);

    expect(
      Math.abs(rects.navLabel.left - rects.heroLeft.left),
    ).toBeLessThanOrEqual(1);
    expect(
      Math.abs(rects.navLinks.left - rects.heroRight.left),
    ).toBeLessThanOrEqual(1);
  });
});

// ─── Breakpoint layout: no overflow / white bleed ──────────────────────────────

test.describe("Breakpoint layout", () => {
  test("no horizontal overflow (no white right-edge strip)", async ({
    page,
  }) => {
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflows).toBe(false);
  });

  test("no element bleeds beyond viewport right edge (unclipped)", async ({
    page,
  }) => {
    const offending = await page.evaluate(() => {
      const vw = window.innerWidth;

      function hasClippingAncestor(el) {
        let node = el.parentElement;
        while (node && node !== document.body) {
          const ovx = window.getComputedStyle(node).overflowX;
          if (ovx === "hidden" || ovx === "clip") {
            // clipping ancestor found — check if the ancestor itself is within viewport
            return node.getBoundingClientRect().right <= vw + 2;
          }
          node = node.parentElement;
        }
        return false;
      }

      return [...document.querySelectorAll("*")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.right > vw + 2 && !hasClippingAncestor(el);
        })
        .map((el) => ({
          tag: el.tagName,
          cls: el.className.toString().slice(0, 60),
          right: Math.round(el.getBoundingClientRect().right),
        }))
        .slice(0, 10);
    });
    if (offending.length)
      console.log("Bleeding elements:", JSON.stringify(offending, null, 2));
    expect(offending).toEqual([]);
  });

  test("skills section has correct blue background (no white bleed)", async ({
    page,
  }) => {
    const bg = await page.evaluate(
      () =>
        window.getComputedStyle(document.querySelector(".skills"))
          .backgroundColor,
    );
    expect(bg).toBe("rgb(13, 8, 197)");
  });

  test("skills items layout: single column on mobile, two columns on desktop", async ({
    page,
    viewport,
  }) => {
    const cols = await page.evaluate(
      () =>
        window.getComputedStyle(document.querySelector(".skills-items"))
          .gridTemplateColumns,
    );
    const colCount = cols.trim().split(/\s+/).length;
    if (viewport && viewport.width <= 900) {
      expect(colCount).toBe(1);
    } else {
      expect(colCount).toBe(2);
    }
  });

  test("hero-name does not overflow hero section", async ({ page }) => {
    const overflow = await page.evaluate(() => {
      const name = document.querySelector(".hero-name");
      const hero = document.querySelector(".hero");
      return (
        name.getBoundingClientRect().right >
        hero.getBoundingClientRect().right + 2
      );
    });
    expect(overflow).toBe(false);
  });

  test("nav stays within viewport bounds", async ({ page }) => {
    const outside = await page.evaluate(() => {
      const nav = document.querySelector("nav");
      const r = nav.getBoundingClientRect();
      return r.right > window.innerWidth + 2 || r.left < -2;
    });
    expect(outside).toBe(false);
  });
});

// ─── Accessibility ──────────────────────────────────────────────────────────────

test.describe("Accessibility", () => {
  test("page lang attribute is set", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("all images have alt attributes", async ({ page }) => {
    const missing = await page.evaluate(() =>
      [...document.querySelectorAll("img")]
        .filter((img) => !img.hasAttribute("alt"))
        .map((img) => img.src),
    );
    expect(missing).toEqual([]);
  });

  test("nav landmark is present", async ({ page }) => {
    await expect(page.locator("nav")).toBeVisible();
  });

  test("page has exactly one h1", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("interactive elements are keyboard-focusable", async ({ page }) => {
    const notFocusable = await page.evaluate(() => {
      const interactives = [...document.querySelectorAll("a[href], button")];
      return interactives
        .filter((el) => {
          // Skip elements intentionally hidden by responsive layout or closed overlays
          if (el.closest(".menu-overlay")) return false; // overlay hidden when closed — expected
          if (el.closest(".nav-links")) return false; // desktop-only, hidden via CSS on mobile
          const s = window.getComputedStyle(el);
          return s.display === "none" && !el.closest("nav"); // nav items hidden on mobile are fine
        })
        .map((el) => el.textContent.trim().slice(0, 40) || el.className);
    });
    expect(notFocusable).toEqual([]);
  });

  test("colour contrast: skills section text not invisible", async ({
    page,
  }) => {
    // Checks that .skills-desc opacity is not 0 (i.e. text is visible)
    const opacities = await page.evaluate(() =>
      [...document.querySelectorAll(".skills-desc")].map((el) =>
        parseFloat(window.getComputedStyle(el).opacity),
      ),
    );
    opacities.forEach((op) => expect(op).toBeGreaterThan(0));
  });

  test("no text elements overlap nav", async ({ page }) => {
    const navBottom = await page.evaluate(
      () => document.querySelector("nav").getBoundingClientRect().bottom,
    );
    // The hero is fixed-height full-screen; its text elements start below nav
    const heroNameTop = await page.evaluate(
      () => document.querySelector(".hero-name").getBoundingClientRect().top,
    );
    // hero-name is flush to bottom of viewport so it will be well below nav
    expect(heroNameTop).toBeGreaterThan(navBottom);
  });
});

// ─── Page meta ─────────────────────────────────────────────────────────────────

test.describe("Page meta", () => {
  test("has correct title", async ({ page }) => {
    await expect(page).toHaveTitle("Daria Forsiuk");
  });

  test("has viewport meta tag", async ({ page }) => {
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
      "content",
      /width=device-width/,
    );
  });
});

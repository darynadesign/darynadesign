import { test, expect } from '@playwright/test';

// Breakpoints mirror CSS: hamburger shown at ≤900px, nav links hidden
const MOBILE_BP = 900;

const isDesktop = ({ viewport }) => !viewport || viewport.width >= MOBILE_BP;
const isMobile = ({ viewport }) => viewport && viewport.width < MOBILE_BP;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// ─── Navigation ────────────────────────────────────────────────────────────────

test.describe('Navigation', () => {
  test('renders logo linking to home', async ({ page }) => {
    const logo = page.locator('nav .logo');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveText('df.');
    await expect(logo).toHaveAttribute('href', 'index.html');
  });

  test('renders portfolio label', async ({ page, viewport }) => {
    test.skip(isMobile({ viewport }), 'desktop only – label hidden on mobile');
    await expect(page.locator('.nav-label')).toBeVisible();
    await expect(page.locator('.nav-label')).toHaveText("PORTFOLIO '26");
  });

  test('desktop nav links visible and point to correct anchors', async ({ page, viewport }) => {
    test.skip(isMobile({ viewport }), 'desktop only – links hidden on mobile');
    await expect(page.locator('.nav-links a[href="#about"]')).toBeVisible();
    await expect(page.locator('.nav-links a[href="#work"]')).toBeVisible();
    await expect(page.locator('.nav-links a[href="#contact"]')).toBeVisible();
  });

  test('CV link opens in new tab', async ({ page, viewport }) => {
    test.skip(isMobile({ viewport }), 'desktop only – CV link hidden on mobile');
    const cvLink = page.locator('nav .nav-cta');
    await expect(cvLink).toHaveAttribute('target', '_blank');
    await expect(cvLink).toHaveAttribute('href', 'assets/cv.pdf');
  });

  test('nav becomes dark after scrolling past hero', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).not.toHaveClass(/dark/);
    await page.evaluate(() => window.scrollBy(0, window.innerHeight + 100));
    await expect(nav).toHaveClass(/dark/);
  });

  test('nav loses dark class when scrolled back to hero', async ({ page }) => {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight + 100));
    const nav = page.locator('nav');
    await expect(nav).toHaveClass(/dark/);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(nav).not.toHaveClass(/dark/);
  });
});

// ─── Hero ──────────────────────────────────────────────────────────────────────

test.describe('Hero', () => {
  test('displays full name', async ({ page }) => {
    await expect(page.locator('.hero-name')).toHaveText('daria forsiuk');
  });

  test('shows london location', async ({ page }) => {
    await expect(page.locator('.hero-info-block--left')).toContainText('london, uk');
  });

  test('displays london time in correct format', async ({ page }) => {
    const timeEl = page.locator('#london-time');
    await expect(timeEl).toBeVisible();
    // Format: "GMT, HH:MM" or "BST, HH:MM"
    await expect(timeEl).toHaveText(/^(GMT|BST),\s\d{2}:\d{2}$/);
  });

  test('london time interval fires without errors', async ({ page }) => {
    const timeEl = page.locator('#london-time');

    // Install fake clock, fast-forward 60s so the setInterval callback runs
    await page.clock.install();
    await page.clock.fastForward(60_000);

    await expect(timeEl).toHaveText(/^(GMT|BST),\s\d{2}:\d{2}$/);
  });

  test('shows role labels', async ({ page }) => {
    const right = page.locator('.hero-info-block--right');
    await expect(right).toContainText('ui/ux designer');
    await expect(right).toContainText('ex-arch. designer');
  });
});

// ─── Mobile menu ───────────────────────────────────────────────────────────────

test.describe('Mobile menu', () => {
  test('hamburger button visible on mobile', async ({ page, viewport }) => {
    test.skip(isDesktop({ viewport }), 'mobile only');
    await expect(page.locator('.nav-hamburger')).toBeVisible();
  });

  test('hamburger button hidden on desktop', async ({ page, viewport }) => {
    test.skip(isMobile({ viewport }), 'desktop only');
    await expect(page.locator('.nav-hamburger')).toBeHidden();
  });

  test('overlay is hidden by default', async ({ page }) => {
    const overlay = page.locator('#menuOverlay');
    await expect(overlay).not.toHaveClass(/is-open/);
    await expect(overlay).toHaveAttribute('aria-hidden', 'true');
  });

  test('hamburger opens the overlay', async ({ page, viewport }) => {
    test.skip(isDesktop({ viewport }), 'mobile only – hamburger hidden on desktop');
    await page.locator('.nav-hamburger').click();
    const overlay = page.locator('#menuOverlay');
    await expect(overlay).toHaveClass(/is-open/);
    await expect(overlay).toHaveAttribute('aria-hidden', 'false');
  });

  test('opening menu locks body scroll', async ({ page, viewport }) => {
    test.skip(isDesktop({ viewport }), 'mobile only');
    await page.locator('.nav-hamburger').click();
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe('hidden');
  });

  test('close button hides the overlay', async ({ page, viewport }) => {
    test.skip(isDesktop({ viewport }), 'mobile only');
    await page.locator('.nav-hamburger').click();
    await page.locator('#menuClose').click();
    const overlay = page.locator('#menuOverlay');
    await expect(overlay).not.toHaveClass(/is-open/);
    await expect(overlay).toHaveAttribute('aria-hidden', 'true');
  });

  test('closing menu restores body scroll', async ({ page, viewport }) => {
    test.skip(isDesktop({ viewport }), 'mobile only');
    await page.locator('.nav-hamburger').click();
    await page.locator('#menuClose').click();
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe('');
  });

  test('clicking a nav link inside overlay closes the menu', async ({ page, viewport }) => {
    test.skip(isDesktop({ viewport }), 'mobile only');
    await page.locator('.nav-hamburger').click();
    await page.locator('.menu-overlay-link').first().click();
    await expect(page.locator('#menuOverlay')).not.toHaveClass(/is-open/);
  });

  test('clicking the CTA inside overlay closes the menu', async ({ page, viewport }) => {
    test.skip(isDesktop({ viewport }), 'mobile only');
    await page.locator('.nav-hamburger').click();
    await page.locator('.menu-overlay-cta').click();
    await expect(page.locator('#menuOverlay')).not.toHaveClass(/is-open/);
  });

  test('clicking outside the overlay closes the menu', async ({ page, viewport }) => {
    test.skip(isDesktop({ viewport }), 'mobile only');
    await page.locator('.nav-hamburger').click();
    await expect(page.locator('#menuOverlay')).toHaveClass(/is-open/);
    await page.locator('.hero-name').click({ force: true });
    await expect(page.locator('#menuOverlay')).not.toHaveClass(/is-open/);
  });

  test('overlay contains logo, 3 nav links, 2 externals', async ({ page, viewport }) => {
    test.skip(isDesktop({ viewport }), 'mobile only');
    await page.locator('.nav-hamburger').click();
    const overlay = page.locator('#menuOverlay');
    await expect(overlay.locator('.menu-overlay-logo')).toHaveText('df.');
    await expect(overlay.locator('.menu-overlay-link')).toHaveCount(3);
    await expect(overlay.locator('.menu-overlay-external')).toHaveCount(2);
  });

  test('linkedin external link opens in new tab', async ({ page, viewport }) => {
    test.skip(isDesktop({ viewport }), 'mobile only');
    await page.locator('.nav-hamburger').click();
    const linkedin = page.locator('.menu-overlay-external').first();
    await expect(linkedin).toHaveAttribute('target', '_blank');
  });
});

// ─── Who Am I section ──────────────────────────────────────────────────────────

test.describe('Who Am I section', () => {
  test('section label is correct', async ({ page }) => {
    await expect(page.locator('.wai-label')).toHaveText('WHO AM I?');
  });

  test('headline is present', async ({ page }) => {
    await expect(page.locator('.wai-headline')).toContainText("Hey, I'm Daria");
  });

  test('"Jump to cases" link points to #cases', async ({ page }) => {
    await expect(page.locator('.wai-jump')).toHaveAttribute('href', '#cases');
  });

  test('photo is rendered', async ({ page }) => {
    const photo = page.locator('.wai-photo img');
    await expect(photo).toBeVisible();
    await expect(photo).toHaveAttribute('src', 'assets/kid.png');
  });

  test('bio has 2 paragraphs', async ({ page }) => {
    await expect(page.locator('.wai-bio p')).toHaveCount(2);
  });
});

// ─── Cases section ─────────────────────────────────────────────────────────────

test.describe('Cases section', () => {
  test('renders exactly 3 case items', async ({ page }) => {
    await expect(page.locator('.case-item')).toHaveCount(3);
  });

  test('first case has section label', async ({ page }) => {
    await expect(page.locator('.case-section-label')).toHaveText("HERE'S SOME OF MY WORK");
  });

  test('every case has a VIEW CASE link', async ({ page }) => {
    const links = page.locator('.case-link');
    await expect(links).toHaveCount(3);
    for (const link of await links.all()) {
      await expect(link).toContainText('VIEW CASE');
    }
  });

  test('every case has a cover image', async ({ page }) => {
    await expect(page.locator('.case-image img')).toHaveCount(3);
  });

  test('every case has tags and description', async ({ page }) => {
    await expect(page.locator('.case-tags')).toHaveCount(3);
    await expect(page.locator('.case-desc')).toHaveCount(3);
  });

  test('cases section is accessible at #work', async ({ page }) => {
    await expect(page.locator('.cases')).toHaveAttribute('id', 'work');
  });
});

// ─── Grid alignment ────────────────────────────────────────────────────────────

test.describe('Grid alignment: nav vs hero-info', () => {
  test('nav-label and hero-info-block--left start at same x (col 6)', async ({ page, viewport }) => {
    test.skip(isMobile({ viewport }), 'desktop only');

    const rects = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      const hero = document.querySelector('.hero');
      const heroInfo = document.querySelector('.hero-info');
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
        navLabel: document.querySelector('.nav-label').getBoundingClientRect(),
        heroLeft: document.querySelector('.hero-info-block--left').getBoundingClientRect(),
        navLinks: document.querySelector('.nav-links').getBoundingClientRect(),
        heroRight: document.querySelector('.hero-info-block--right').getBoundingClientRect(),
      };
    });

    console.log('viewportWidth:', rects.viewportWidth);
    console.log('bodyWidth:', rects.bodyWidth);
    console.log('nav width:', rects.navRect.width, 'left:', rects.navRect.left);
    console.log('nav paddingLeft:', rects.navPaddingLeft, 'paddingRight:', rects.navPaddingRight);
    console.log('hero width:', rects.heroRect.width);
    console.log('hero-info width:', rects.heroInfoRect.width, 'paddingLeft:', rects.heroInfoPaddingLeft);
    console.log('nav-label x:', rects.navLabel.left);
    console.log('hero-left x:', rects.heroLeft.left);
    console.log('nav-links x:', rects.navLinks.left);
    console.log('hero-right x:', rects.heroRight.left);
    console.log('diff col6:', rects.navLabel.left - rects.heroLeft.left);
    console.log('diff col9:', rects.navLinks.left - rects.heroRight.left);

    expect(Math.abs(rects.navLabel.left - rects.heroLeft.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(rects.navLinks.left - rects.heroRight.left)).toBeLessThanOrEqual(1);
  });
});

// ─── Page meta ─────────────────────────────────────────────────────────────────

test.describe('Page meta', () => {
  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Daria Forsiuk');
  });

  test('has viewport meta tag', async ({ page }) => {
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
      'content',
      /width=device-width/,
    );
  });
});

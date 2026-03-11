import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    browserName: 'chromium',
  },
  projects: [
    {
      name: 'desktop-1440',
      use: {
        viewport: { width: 1440, height: 900 },
        isMobile: false,
      },
    },
    {
      name: 'laptop-1280',
      use: {
        viewport: { width: 1280, height: 800 },
        isMobile: false,
      },
    },
    {
      name: 'tablet-768',
      use: {
        viewport: { width: 768, height: 1024 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'mobile-360',
      use: {
        viewport: { width: 360, height: 800 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: 'npx serve . --listen 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});

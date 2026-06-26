/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const BASE_URL = process.env.PW_BASE_URL ?? 'http://0.0.0.0:3003';
const authDir = path.resolve('playwright/.auth');

export default defineConfig({
  testDir: './playwright/e2e',

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 1 : 0,

  workers: process.env.CI ? 2 : undefined,

  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',

    actionTimeout: 8_000,
    navigationTimeout: 15_000,

    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'general',
      testMatch: 'playwright/e2e/general/**/*.spec.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(authDir, 'owner.json'),
      },
    },

    {
      name: 'organizations',
      testMatch: 'playwright/e2e/organizations/**/*.spec.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(authDir, 'platformowner.json'),
      },
    },

    {
      name: 'rbac-guest',
      testMatch: 'playwright/e2e/rbac/guest.spec.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(authDir, 'guest.json'),
      },
    },
    {
      name: 'rbac-reporter',
      testMatch: 'playwright/e2e/rbac/reporter.spec.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(authDir, 'reporter.json'),
      },
    },
    {
      name: 'rbac-developer',
      testMatch: 'playwright/e2e/rbac/developer.spec.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(authDir, 'developer.json'),
      },
    },
    {
      name: 'rbac-maintainer',
      testMatch: 'playwright/e2e/rbac/maintainer.spec.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(authDir, 'maintainer.json'),
      },
    },

    {
      name: 'rbac-orgadmin',
      testMatch: 'playwright/e2e/rbac/organizations/orgAdmin.spec.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(authDir, 'orgadmin.json'),
      },
    },
    {
      name: 'rbac-orgviewer',
      testMatch: 'playwright/e2e/rbac/organizations/orgViewer.spec.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(authDir, 'orgviewer.json'),
      },
    },

    {
      name: 'rbac-org-owners',
      testMatch: 'playwright/e2e/rbac/organizations/platformAndOrgOwnerJourney.spec.ts',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

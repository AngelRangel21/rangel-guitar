import { defineConfig, devices } from '@playwright/test'

const isCI = process.env.CI === 'true' || process.env.CI === '1'
// Puerto propio para e2e: así nunca reutiliza el `bun dev` del 3000, que
// apunta al Supabase real en vez de al mock.
const E2E_PORT = 3100
const E2E_URL = `http://localhost:${E2E_PORT}`

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  // En CI la hidratación y la carga de sesión son más lentas que en local.
  expect: { timeout: isCI ? 10_000 : 5_000 },

  use: {
    baseURL: process.env.E2E_BASE_URL ?? E2E_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  webServer: [
    {
      command: 'bun run e2e:mock-supabase',
      url: 'http://127.0.0.1:54321/health',
      reuseExistingServer: !isCI,
      timeout: 30_000
    },
    {
      command: isCI ? 'bun run build && bun run start' : 'bun run dev',
      url: `${E2E_URL}/es`,
      reuseExistingServer: !isCI,
      timeout: 120_000,
      env: {
        PORT: String(E2E_PORT),
        NEXT_DIST_DIR: '.next/e2e',
        NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321',
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'e2e-publishable-key',
        NEXT_PUBLIC_DISABLE_ANALYTICS: 'true'
      }
    }
  ]
})

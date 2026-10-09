import { defineConfig } from 'vitest/config';

// Kept apart from vite.config.ts: the React Router plugin is not meant to run under Vitest.
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['src/**/*.integration.test.ts'],
  },
});

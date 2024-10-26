import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    typecheck: {
      enabled: true,
    },
    coverage: {
      include: ['src/core/**/*.ts'],
      exclude: ['src/core/types.ts'],
      reporter: ['html'],
    },
  },
})

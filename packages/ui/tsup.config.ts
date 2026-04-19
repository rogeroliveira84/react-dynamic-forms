import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    'react',
    'react-dom',
    'react-hook-form',
    '@rogeroliveira84/react-dynamic-forms',
  ],
  onSuccess: async () => {
    copyFileSync(resolve('src/styles/globals.css'), resolve('dist/styles.css'))
  },
})

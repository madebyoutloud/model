import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  treeshake: true,
  minify: process.env.MINIFY === 'true',
  outDir: './dist',
  format: ['esm', 'cjs'],
  dts: true,
  target: 'es2022',
  tsconfig: 'tsconfig.json',
})

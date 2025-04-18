# Vue & Nuxt

If you want to improve the type performance and readability inside `ref`, you can create a `types.d.ts` file in your project and add the following code:

```ts[types.d.ts]
import type { RawSymbol } from '@vue/reactivity'

declare module '@outloud/model' {
  interface Model {
    [RawSymbol]?: true
  }
}

export {}
```

If the `@vue/reactivity` dependency is not recognized (usually when using `pnpm`), install it as dev dependency.

## Nuxt
If you are using Nuxt, there is a bug in ESBuild and updating tsconfig won't work. Add this to `nuxt.config.ts` or any config with esbuild.

```ts[nuxt.config.ts]
export default defineNuxtConfig({
  vite: {
    esbuild: {
      tsconfigRaw: {}
    },
  }
})
```

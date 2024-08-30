# Installation

::: code-group
```sh-vue [npm]
npm add {{$packageJson.name}}
```
```sh-vue [pnpm]
pnpm add {{$packageJson.name}}
```
```sh-vue [yarn]
yarn add {{$packageJson.name}}
```
```sh-vue [bun]
bun add {{$packageJson.name}}
```
:::

## Setup
Enable `experimentalDecorators` in tsconfig.json.
```json[tsconfig.json]
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

### Nuxt
If you are using Nuxt with version < 3.12, there is a bug in ESBuild and updating tsconfig won't work. Add this to `nuxt.config.ts` or any config with esbuild.

```ts[nuxt.config.ts]
export default defineNuxtConfig({
  vite: {
    esbuild: {
      tsconfigRaw: {}
    },
  }
})
```

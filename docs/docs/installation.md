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

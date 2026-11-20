import { createConfig } from '@outloud/oxlint-config'

export default createConfig({
  features: { vue: false, nuxt: false },
  ignorePatterns: ['docs/**'],
})

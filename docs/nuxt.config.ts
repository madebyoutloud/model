export default defineNuxtConfig({
  extends: ['@outloud/docs'],
  site: {
    name: 'Model',
  },

  package: {
    path: '../',
  },

  mcp: {
    enabled: false,
  },

  nitro: {
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
})

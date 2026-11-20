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

  // docus adds nuxt-agent-discovery, which needs an origin, not the /model/ base URL
  agentDiscovery: {
    siteUrl: 'https://docs.outloud.dev',
  },

  nitro: {
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
})

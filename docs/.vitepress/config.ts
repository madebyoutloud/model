import { type HeadConfig, defineConfig } from 'vitepress'
import packageJson from '../../package.json'

const webUrl = process.env.WEB_URL ?? ''

const meta = [
  {
    name: 'robots',
    content: 'index, follow',
  },
  {
    itemprop: 'image',
    content: 'website',
  },
  {
    property: 'og:type',
    content: 'website',
  },
  // {
  //   property: 'og:image',
  //   content: webUrl + '/images/social.png',
  // },
  {
    property: 'twitter:card',
    content: 'summary_large_image',
  },
  // {
  //   property: 'twitter:image',
  //   content: webUrl + '/images/social.png',
  // },
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: packageJson.title,
  description: packageJson.description,

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  head: [
    [
      'link', {
        rel: 'icon',
        href: '/favicon.ico',
        sizes: '32x32',
      },
    ],
    [
      'link', {
        rel: 'icon',
        href: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    ...meta.map((item) => ['meta', item] as any),
  ],

  themeConfig: {
    logo: '/logo.svg',

    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },

    nav: [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: 'Docs',
        link: '/docs/getting-started',
        activeMatch: '/docs/',
      },
      {
        text: 'Outloud',
        link: 'https://outloud.co',
      },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          {
            text: 'Getting Started',
            link: '/docs/getting-started',
          }, {
            text: 'Installation',
            link: '/docs/installation',
          },
        ],
      },
      {
        text: 'Guide',
        items: [
          {
            text: 'Models',
            link: '/docs/guide/models',
          },
          {
            text: 'Relationships',
            link: '/docs/guide/relationships',
          },
          {
            text: 'Composition',
            link: '/docs/guide/composition',
          },
          {
            text: 'Mapping',
            link: '/docs/guide/mapping',
          },
          {
            text: 'Decorators',
            link: '/docs/guide/decorators',
          },
        ],
      },
      {
        text: 'API',
        items: [
          {
            text: 'Model',
            link: '/docs/api/model',
          },
        ],
      },
      {
        text: 'Decorators',
        items: [
          {
            text: 'Date',
            link: '/docs/decorators/date',
          },
          {
            text: 'Date & Time',
            link: '/docs/decorators/date-time',
          },
        ],
      },
    ],

    footer: {
      copyright: 'Copyright © 2024-present Outloud',
    },

    socialLinks: [
      {
        icon: 'github',
        link: packageJson.repository.url,
      },
    ],
  },
})

import { generateDocusMeta } from '@outloud/docs/config'
import packageJson from '~/package.json'

export default defineAppConfig({
  docus: {
    ...generateDocusMeta(packageJson),
  },
  nuxtIcon: {
    class: 'icon o-icon',
  },
})

import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'
import packageJson from '../../../packages/model/package.json'
import Layout from './Layout.vue'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.config.globalProperties.$packageJson = packageJson
  },
  Layout,
}

export default theme

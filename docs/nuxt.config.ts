import { resolve } from 'path'
import { addComponent, defineNuxtModule } from '@nuxt/kit'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@outloud/docs'],
  devtools: { enabled: false },

})

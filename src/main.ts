import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { createHead } from "@vueuse/head"

export const head = createHead()

loadFonts()

const app = createApp(App)
  .use(router)
  .use(vuetify)
  .use(head)
// app.config.errorHandler = () => null; // TODO
// app.config.warnHandler = () => null; // TODO
app.mount('#app')

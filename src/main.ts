import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Vuetify core
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Ícones (MDI)
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#111827',   // preto/cinza escuro (combina com o botão LOGIN)
          secondary: '#7C3AED', // roxo (pro "Register Here")
          surface: '#FFFFFF',
        },
      },
    },
  },
})

const app = createApp(App)
app.use(vuetify)
app.use(createPinia())       // se usar
app.use(router)              // se usar
app.mount('#app')

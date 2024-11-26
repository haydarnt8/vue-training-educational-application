import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import vuetifyConfig from './plugins/vuetify'
import App from './App.vue'
import router from './router'
const vuetify = createVuetify(vuetifyConfig)

const app = createApp(App)

app.use(vuetify)
app.use(createPinia())
app.use(router)

app.mount('#app')

window.onload = function () {
  const loader = document.getElementById('loader')
  if (loader) {
    loader.style.display = 'none'
  }
}

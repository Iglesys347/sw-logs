import { createApp, render } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// icons
import '@mdi/font/css/materialdesignicons.css'

// router
import router from "./router"

// pinia
import { createPinia } from 'pinia'



const vuetify = createVuetify({
    components,
    directives,
})

const renderApp = () => {
    createApp(App).use(vuetify).use(createPinia()).use(router).mount('#app')
};

renderApp()
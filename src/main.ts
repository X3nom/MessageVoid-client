import { createApp } from 'vue'
import "./main.css"
import App from './App.vue'

import PrimeVue from 'primevue/config';

createApp(App)
    .use(PrimeVue)
    .mount('#app')

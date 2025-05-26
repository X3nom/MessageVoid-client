import { createApp } from 'vue'
import "./main.css"
import App from './App.vue'

import PrimeVue from 'primevue/config';

import Home from './views/Home.vue';
import SelectId from './views/SelectId.vue';
import CreateId from './views/CreateId.vue';

import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  { path: '/', component: Home },
  { path: '/select-id', component: SelectId },
  { path: '/create-id', component: CreateId }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})




createApp(App)
    .use(router)
    .use(PrimeVue)
    .mount('#app')
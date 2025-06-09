import { createApp } from 'vue'
import "./main.css"
import App from './App.vue'

import PrimeVue from 'primevue/config';

import Home from './views/Main/Home.vue';
import SelectId from './views/SelectId.vue';
import CreateId from './views/CreateId.vue';

import { createRouter, createWebHistory } from 'vue-router'
import NewestMessagesPanel from './views/Main/Home/NewestMessagesPanel.vue';
import ChatPanel from './views/Main/Home/ChatPanel.vue';
import Main from './views/Main.vue';
import Settings from './views/Main/Settings.vue';


const routes = [
  { path: '/', component: Main, 
    children: [
      { path: '/home', component: Home, 
        children: [
          { path: '/newest', component: NewestMessagesPanel},
          { path: '/chat', component: ChatPanel}
        ]
      },
      { path: '/settings', component: Settings}
    ]
  },
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
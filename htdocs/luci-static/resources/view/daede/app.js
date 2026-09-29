import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import zhCN from './i18n/locales/zh-CN.js'
import enUS from './i18n/locales/en-US.js'

import './utils/yacd-theme.css'

const pinia = createPinia()

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: () => import('./views/Dashboard.vue'), meta: { title: 'nav.dashboard' } },
  { path: '/system-tuning', component: () => import('./views/SystemTuning.vue'), meta: { title: 'nav.systemTuning' } },
  { path: '/lan-isolation', component: () => import('./views/LanIsolation.vue'), meta: { title: 'nav.lanIsolation' } },
  { path: '/subscription', component: () => import('./views/Subscription.vue'), meta: { title: 'nav.subscription' } },
  { path: '/subscription/convert', component: () => import('./views/SubscriptionConvert.vue'), meta: { title: 'nav.subscriptionConvert' } },
  { path: '/online-update', component: () => import('./views/OnlineUpdate.vue'), meta: { title: 'nav.onlineUpdate' } },
  { path: '/settings', component: () => import('./views/Settings.vue'), meta: { title: 'nav.settings' } },
  { path: '/logs', component: () => import('./views/Logs.vue'), meta: { title: 'nav.logs' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
}

const locale = localStorage.getItem('daede-lang') || 'zh-CN'

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en-US',
  messages,
  globalInjection: true
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')

export { router, i18n, pinia }
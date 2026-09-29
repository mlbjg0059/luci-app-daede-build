import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: () => import('@/views/Dashboard.vue'), meta: { title: 'nav.dashboard' } },
  { path: '/system-tuning', component: () => import('@/views/SystemTuning.vue'), meta: { title: 'nav.systemTuning' } },
  { path: '/lan-isolation', component: () => import('@/views/LanIsolation.vue'), meta: { title: 'nav.lanIsolation' } },
  { path: '/subscription', component: () => import('@/views/Subscription.vue'), meta: { title: 'nav.subscription' } },
  { path: '/subscription/convert', component: () => import('@/views/SubscriptionConvert.vue'), meta: { title: 'nav.subscriptionConvert' } },
  { path: '/online-update', component: () => import('@/views/OnlineUpdate.vue'), meta: { title: 'nav.onlineUpdate' } },
  { path: '/settings', component: () => import('@/views/Settings.vue'), meta: { title: 'nav.settings' } },
  { path: '/logs', component: () => import('@/views/Logs.vue'), meta: { title: 'nav.logs' } }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
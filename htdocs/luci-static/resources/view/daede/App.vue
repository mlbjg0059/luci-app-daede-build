<template>
  <div id="app" class="daede-app">
    <YToastContainer />
    <header class="app-header">
      <div class="header-left">
        <router-link to="/dashboard" class="logo">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span class="logo-text">DAE</span>
        </router-link>
        <nav class="main-nav">
          <router-link
            v-for="route in navRoutes"
            :key="route.path"
            :to="route.path"
            class="nav-item"
            :class="{ active: $route.path.startsWith(route.path) }"
          >
            {{ t(route.meta.title) }}
          </router-link>
        </nav>
      </div>
      <div class="header-right">
        <div class="lang-selector">
          <select v-model="$i18n.locale" @change="changeLang($event.target.value)" class="lang-select">
            <option value="zh-CN">中文</option>
            <option value="en-US">English</option>
          </select>
        </div>
        <YTooltip content="刷新数据" placement="bottom">
          <button class="icon-btn" @click="refreshAll" :disabled="refreshing">
            <RefreshCw :class="{ 'animate-spin': refreshing }" />
          </button>
        </YTooltip>
        <YTooltip content="DAE 状态" placement="bottom">
          <DaedStatusIndicator />
        </YTooltip>
      </div>
    </header>
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="app-footer">
      <span>DAE Management Interface - YACD Style</span>
      <span>v{{ version }}</span>
    </footer>
    <YToastContainer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { RefreshCw } from 'lucide-vue-next'
import YTooltip from '@/components/YTooltip.vue'
import YToastContainer from '@/components/YToastContainer.vue'
import DaedStatusIndicator from '@/components/DaedStatusIndicator.vue'

const { t } = useI18n()
const router = useRouter()
const version = __APP_VERSION__ || '1.0.0'
const refreshing = ref(false)
const navRoutes = [
  { path: '/dashboard', meta: { title: 'nav.dashboard' } },
  { path: '/system-tuning', meta: { title: 'nav.systemTuning' } },
  { path: '/lan-isolation', meta: { title: 'nav.lanIsolation' } },
  { path: '/subscription', meta: { title: 'nav.subscription' } },
  { path: '/online-update', meta: { title: 'nav.onlineUpdate' } },
  { path: '/settings', meta: { title: 'nav.settings' } },
  { path: '/logs', meta: { title: 'nav.logs' } }
]

const changeLang = (lang) => {
  localStorage.setItem('daede-lang', lang)
}

const refreshAll = async () => {
  refreshing.value = true
  try {
    // 触发各页面的刷新逻辑
    router.currentRoute.value.matched.forEach(record => {
      if (record.components.default && record.components.default.refresh) {
        record.components.default.refresh()
      }
    })
  } finally {
    setTimeout(() => refreshing.value = false, 1000)
  }
}

onMounted(() => {
  // 检查 DAE 核心连接状态
  checkDaedStatus()
})

const checkDaedStatus = async () => {
  try {
    await fetch('/cgi-bin/daede-graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' })
    })
  } catch (e) {
    console.warn('DAE 核心连接失败:', e)
  }
}
</script>

<style scoped>
.daede-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--yacd-bg);
  color: var(--yacd-text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.app-header {
  height: 56px;
  background: var(--yacd-card);
  border-bottom: 1px solid var(--yacd-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--yacd-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 18px;
}

.logo-icon { width: 28px; height: 28px; }

.main-nav {
  display: flex;
  gap: 8px;
}

.nav-item {
  padding: 8px 16px;
  border-radius: var(--yacd-radius);
  color: var(--yacd-text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: var(--yacd-transition);
  white-space: nowrap;
}

.nav-item:hover {
  background: var(--yacd-bg);
  color: var(--yacd-text);
}

.nav-item.active {
  background: var(--yacd-primary);
  color: white;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.lang-select {
  padding: 6px 12px;
  border: 1px solid var(--yacd-border);
  border-radius: var(--yacd-radius);
  background: var(--yacd-card);
  color: var(--yacd-text);
  font-size: 13px;
  cursor: pointer;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: var(--yacd-radius);
  color: var(--yacd-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--yacd-transition);
}

.icon-btn:hover:not(:disabled) {
  background: var(--yacd-bg);
  color: var(--yacd-text);
}

.icon-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.animate-spin { animation: spin 1s linear infinite; }

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.app-main {
  flex: 1;
  padding: 24px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.app-footer {
  height: 40px;
  background: var(--yacd-card);
  border-top: 1px solid var(--yacd-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  font-size: 12px;
  color: var(--yacd-text-secondary);
}

@media (max-width: 768px) {
  .main-nav { display: none; }
  .app-header { padding: 0 16px; }
  .app-main { padding: 16px; }
  .app-footer { padding: 0 16px; }
}
</style>
<template>
  <div class="daed-status" :class="{ connected: connected }" @click="check" title="点击检查连接">
    <div class="daed-status__dot" :class="{ 'pulse': connected }" />
    <span class="daed-status__text">{{ connected ? t('common.connected') : t('common.disconnected') }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/api'

const { t } = useI18n()
const connected = ref(false)
let checkTimer = null

const check = async () => {
  try {
    await api.graphql({ query: '{ __typename }' })
    connected.value = true
  } catch (e) {
    connected.value = false
  }
}

onMounted(() => {
  check()
  checkTimer = setInterval(check, 30000)
})

watch(() => import.meta.env.VITE_API_BASE, check, { immediate: false })

onUnmounted(() => clearInterval(checkTimer))
</script>

<style scoped>
.daed-status { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 500; cursor: pointer; transition: var(--yacd-transition); user-select: none; }
.daed-status:hover { background: var(--yacd-bg); }
.daed-status__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--yacd-text-placeholder); transition: var(--yacd-transition); }
.daed-status.connected .daed-status__dot { background: var(--yacd-success); }
.daed-status__dot.pulse { animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.daed-status__text { white-space: nowrap; color: var(--yacd-text-secondary); }
.daed-status.connected .daed-status__text { color: var(--yacd-success); }
</style>
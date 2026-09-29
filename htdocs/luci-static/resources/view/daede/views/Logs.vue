<template>
  <div class="logs">
    <div class="page-header">
      <h1 class="page-title">{{ t('nav.logs') }}</h1>
      <div class="header-actions">
        <YSelect v-model="levelFilter" :options="levelOptions" style="width: 140px" />
        <YButton @click="clearLogs" variant="danger">{{ t('logs.clear') }}</YButton>
        <YButton @click="exportLogs">{{ t('logs.export') }}</YButton>
        <YButton @click="fetchLogs" :loading="loading" icon="RefreshCw">{{ t('common.refresh') }}</YButton>
      </div>
    </div>

    <YCard>
      <div class="log-container">
        <div v-for="log in filteredLogs" :key="log.id" class="log-entry" :class="`log--${log.level}`">
          <span class="log-time">{{ formatTime(log.time) }}</span>
          <span class="log-level">{{ log.level.toUpperCase() }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
        <div v-if="logs.length === 0" class="log-empty">{{ t('common.noData') }}</div>
      </div>
    </YCard>
  </template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RefreshCw } from 'lucide-vue-next'
import { formatTime } from '@/utils/format'

const { t } = useI18n()
const logs = ref([])
const loading = ref(false)
const levelFilter = ref('all')

const levelOptions = [
  { value: 'all', label: '全部' },
  { value: 'info', label: 'Info' },
  { value: 'warn', label: 'Warn' },
  { value: 'error', label: 'Error' },
  { value: 'debug', label: 'Debug' }
]

const filteredLogs = computed(() => {
  if (levelFilter.value === 'all') return logs.value
  return logs.value.filter(l => l.level === levelFilter.value)
}

const fetchLogs = async () => {
  loading.value = true
  try {
    // 从后端获取日志
    logs.value = [] // 示例数据
  } finally { loading.value = false }
}

const clearLogs = () => { logs.value = [] }
const exportLogs = () => {
  const blob = new Blob([logs.value.map(l => `${l.time} [${l.level.toUpperCase()}] ${l.message}`).join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `daede-logs-${Date.now()}.log`; a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => { fetchLogs(); const timer = setInterval(fetchLogs, 5000); return () => clearInterval(timer) })

return { logs, loading, levelFilter, levelOptions, filteredLogs, fetchLogs, clearLogs, exportLogs, formatTime, t }
</script>
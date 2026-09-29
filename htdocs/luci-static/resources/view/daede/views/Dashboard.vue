<template>
  <div class="dashboard">
    <div class="page-header">
      <h1 class="page-title">{{ t('nav.dashboard') }}</h1>
      <YButton @click="refresh" :loading="loading" icon="RefreshCw">{{ t('common.refresh') }}</YButton>
    </div>

    <div class="stats-grid">
      <YCard v-for="stat in stats" :key="stat.key" class="stat-card">
        <template #header>
          <div class="stat-header">
            <span class="stat-label">{{ stat.label }}</span>
            <component :is="stat.icon" class="stat-icon" :class="stat.color" />
          </div>
        </template>
        <div class="stat-body">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-unit">{{ stat.unit }}</span>
        </div>
      </YCard>
    </div>

    <div class="cards-grid mt-4">
      <YCard title="{{ t('dashboard.nodeStatus') }}" class="col-span-2">
        <YTable
          :columns="nodeColumns"
          :data="nodes"
          :loading="loadingNodes"
          @refresh="fetchNodes"
        >
          <template #status="{ row }">
            <span :class="['status-badge', row.connected ? 'status--online' : 'status--offline']">
              <span class="status-dot" />
              {{ row.connected ? t('dashboard.connected') : t('dashboard.disconnected') }}
            </span>
          </template>
          <template #traffic="{ row }">
            <div class="traffic-cell">
              <span class="traffic-down">↓ {{ formatBytes(row.download) }}</span>
              <span class="traffic-up">↑ {{ formatBytes(row.upload) }}</span>
            </div>
          </template>
        </YTable>
      </YCard>

      <YCard title="{{ t('dashboard.connectionList') }}" class="col-span-2">
        <YTable
          :columns="connColumns"
          :data="connections"
          :loading="loadingConns"
          @refresh="fetchConnections"
        >
          <template #chains="{ row }">
            <span class="chain-tag">{{ row.chains }}</span>
          </template>
          <template #rule="{ row }">
            <span class="rule-tag">{{ row.rule }}</span>
          </template>
          <template #type="{ row }">
            <span class="type-tag" :class="row.type.toLowerCase()">{{ row.type }}</span>
          </template>
        </YTable>
      </YCard>
    </div>
  </template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { RefreshCw, Server, Activity, Database, Network, TrendingUp } from 'lucide-vue-next'
import { formatBytes } from '@/utils/format'

const { t } = useI18n()
const store = useStore()

const loading = ref(false)
const loadingNodes = ref(false)
const loadingConns = ref(false)

const stats = ref([
  { key: 'download', label: t('dashboard.download'), value: 0, unit: '', icon: TrendingUp, color: 'text-green-500' },
  { key: 'upload', label: t('dashboard.upload'), value: 0, unit: '', icon: TrendingUp, color: 'text-red-500' },
  { key: 'connections', label: t('dashboard.activeConnections'), value: 0, unit: t('common.count'), icon: Activity, color: 'text-blue-500' },
  { key: 'cpu', label: t('dashboard.cpuUsage'), value: '0%', unit: '', icon: Server, color: 'text-orange-500' },
  { key: 'memory', label: t('dashboard.memoryUsage'), value: '0%', unit: '', icon: Database, color: 'text-purple-500' }
])

const nodes = ref([])
const connections = ref([])

const nodeColumns = [
  { prop: 'name', label: '节点名称', minWidth: '180' },
  { prop: 'status', label: '状态', width: '100', slot: 'status' },
  { prop: 'protocol', label: '协议', width: '100' },
  { prop: 'address', label: '地址', minWidth: '180' },
  { prop: 'traffic', label: '流量', width: '200', slot: 'traffic' },
  { prop: 'latency', label: '延迟', width: '100' }
]

const connColumns = [
  { prop: 'host', label: t('connections.host'), minWidth: '200' },
  { prop: 'process', label: t('connections.process'), minWidth: '120' },
  { prop: 'download', label: t('connections.download'), width: '100' },
  { prop: 'upload', label: t('connections.upload'), width: '100' },
  { prop: 'downloadSpeed', label: t('connections.downloadSpeed'), width: '120' },
  { prop: 'uploadSpeed', label: t('connections.uploadSpeed'), width: '120' },
  { prop: 'chains', label: t('connections.chains'), width: '140', slot: 'chains' },
  { prop: 'rule', label: t('connections.rule'), minWidth: '180', slot: 'rule' },
  { prop: 'type', label: t('connections.type'), width: '120', slot: 'type' }
]

const fetchStats = async () => {
  try {
    const res = await store.dae.api.getSystemStats()
    stats.value = stats.value.map(s => ({ ...s, value: s.key === 'download' ? formatBytes(res.download) : s.key === 'upload' ? formatBytes(res.upload) : s.key === 'connections' ? res.connections : s.key === 'cpu' ? res.cpu + '%' : res.memory + '%' }))
  } catch (e) { console.error('获取统计失败:', e) }
}

const fetchNodes = async () => {
  loadingNodes.value = true
  try { nodes.value = await store.dae.api.getNodes() } catch (e) { console.error('获取节点失败:', e) } finally { loadingNodes.value = false }
}

const fetchConnections = async () => {
  loadingConns.value = true
  try { connections.value = await store.dae.api.getConnections() } catch (e) { console.error('获取连接失败:', e) } finally { loadingConns.value = false }
}

const refresh = async () => { await Promise.all([fetchStats(), fetchNodes(), fetchConnections()]) }

onMounted(() => { refresh(); const timer = setInterval(refresh, 10000); return () => clearInterval(timer) })

return { stats, nodes, connections, nodeColumns, connColumns, loading, loadingNodes, loadingConns, refresh, t }
</script>

<style scoped>
.dashboard { }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.page-title { font-size: 20px; font-weight: 600; color: var(--yacd-text); }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
.stat-card { padding: 20px; }
.stat-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.stat-label { font-size: 13px; color: var(--yacd-text-secondary); font-weight: 500; }
.stat-icon { width: 20px; height: 20px; color: var(--yacd-text-secondary); }
.stat-icon.text-green-500 { color: var(--yacd-success); }
.stat-icon.text-red-500 { color: var(--yacd-danger); }
.stat-icon.text-blue-500 { color: var(--yacd-primary); }
.stat-icon.text-orange-500 { color: var(--yacd-warning); }
.stat-icon.text-purple-500 { color: #9B59B6; }
.stat-body { display: flex; align-items: baseline; gap: 4px; }
.stat-value { font-size: 28px; font-weight: 700; color: var(--yacd-text); line-height: 1; }
.stat-unit { font-size: 13px; color: var(--yacd-text-secondary); }
.cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); gap: 16px; }
.mt-4 { margin-top: 16px; }
.col-span-2 { grid-column: span 2; }
@media (max-width: 1024px) { .col-span-2 { grid-column: span 1; } }
.stat-card .y-card__body { padding: 16px; }
.traffic-cell { display: flex; flex-direction: column; gap: 4px; }
.traffic-down { color: var(--yacd-danger); font-size: 12px; }
.traffic-up { color: var(--yacd-success); font-size: 12px; }
.status-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 500; }
.status-badge.status--online { background: var(--yacd-success-light); color: var(--yacd-success); }
.status-badge.status--offline { background: var(--yacd-danger-light); color: var(--yacd-danger); }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.chain-tag { display: inline-block; padding: 2px 6px; background: var(--yacd-primary-light); color: var(--yacd-primary); border-radius: 4px; font-size: 11px; }
.rule-tag { display: inline-block; padding: 2px 6px; background: var(--yacd-bg); color: var(--yacd-text-secondary); border-radius: 4px; font-size: 11px; }
.type-tag { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 500; }
.type-tag.tproxy { background: var(--yacd-primary-light); color: var(--yacd-primary); }
.type-tag.redir { background: var(--yacd-warning-light); color: var(--yacd-warning); }
.type-tag.direct { background: var(--yacd-success-light); color: var(--yacd-success); }
.type-tag.reject { background: var(--yacd-danger-light); color: var(--yacd-danger); }
</style>
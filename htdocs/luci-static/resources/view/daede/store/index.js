import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api'

export const useDaeStore = defineStore('dae', () => {
  const stats = ref({ download: 0, upload: 0, connections: 0, cpu: 0, memory: 0 })
  const connections = ref([])
  const nodes = ref([])
  const groups = ref([])
  const subscriptions = ref([])
  const routing = ref({ rules: [], fallback: 'direct' })
  const dns = ref({ upstreams: [], rules: [] })
  const loading = ref(false)
  const error = ref(null)
  const daedConnected = ref(false)

  const connectedNodes = computed(() => nodes.value.filter(n => n.connected))
  const activeSubscriptions = computed(() => subscriptions.value.filter(s => s.enabled))

  const fetchStats = async () => {
    try {
      const res = await api.getSystemStats()
      stats.value = res
    } catch (e) {
      console.error('获取统计失败:', e)
    }
  }

  const fetchConnections = async () => {
    try {
      connections.value = await api.getConnections()
    } catch (e) {
      console.error('获取连接失败:', e)
    }
  }

  const fetchNodes = async () => {
    try {
      nodes.value = await api.getNodes()
    } catch (e) {
      console.error('获取节点失败:', e)
    }
  }

  const fetchGroups = async () => {
    try {
      groups.value = await api.getGroups()
    } catch (e) {
      console.error('获取策略组失败:', e)
    }
  }

  const fetchSubscriptions = async () => {
    try {
      subscriptions.value = await api.getSubscriptions()
    } catch (e) {
      console.error('获取订阅失败:', e)
    }
  }

  const fetchRouting = async () => {
    try {
      routing.value = await api.getRouting()
    } catch (e) {
      console.error('获取路由失败:', e)
    }
  }

  const fetchDns = async () => {
    try {
      dns.value = await api.getDns()
    } catch (e) {
      console.error('获取 DNS 失败:', e)
    }
  }

  const checkDaedConnection = async () => {
    try {
      await api.graphql({ query: '{ __typename }' })
      daedConnected.value = true
    } catch (e) {
      daedConnected.value = false
    }
  }

  const refreshAll = async () => {
    await Promise.all([
      fetchStats(),
      fetchConnections(),
      fetchNodes(),
      fetchGroups(),
      fetchSubscriptions(),
      fetchRouting(),
      fetchDns(),
      checkDaedConnection()
    ])
  }

  return {
    stats, connections, nodes, groups, subscriptions, routing, dns,
    loading, error, daedConnected,
    connectedNodes, activeSubscriptions,
    fetchStats, fetchConnections, fetchNodes, fetchGroups,
    fetchSubscriptions, fetchRouting, fetchDns, checkDaedConnection, refreshAll
  }
})
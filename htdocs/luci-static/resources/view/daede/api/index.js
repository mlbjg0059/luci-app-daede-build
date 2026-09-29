const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8081'

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '请求失败' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  graphql: (query, variables) => request('/graphql', { method: 'POST', body: JSON.stringify({ query, variables }) }),

  getSystemStats: () => request('/api/system/stats'),
  getSystemConfig: () => request('/api/system/config'),
  setSysctl: (params) => request('/api/system/sysctl', { method: 'POST', body: JSON.stringify(params) }),
  setFirewall: (params) => request('/api/system/firewall', { method: 'POST', body: JSON.stringify(params) }),

  getNodes: () => request('/api/nodes'),
  getGroups: () => request('/api/groups'),
  getSubscriptions: () => request('/api/subscriptions'),
  getRouting: () => request('/api/routing'),
  getDns: () => request('/api/dns'),
  getConnections: () => request('/api/connections'),

  getSystemConfig: () => request('/api/system/config'),
  setSysctl: (params) => request('/api/system/sysctl', { method: 'POST', body: JSON.stringify(params) }),
  setFirewall: (params) => request('/api/system/firewall', { method: 'POST', body: JSON.stringify(params) }),

  getSubscriptions: () => request('/api/subscriptions'),
  addSubscription: (data) => request('/api/subscriptions', { method: 'POST', body: JSON.stringify(data) }),
  updateSubscription: (id, data) => request(`/api/subscriptions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSubscription: (id) => request(`/api/subscriptions/${id}`, { method: 'DELETE' }),
  toggleSubscription: (id, enabled) => request(`/api/subscriptions/${id}/toggle`, { method: 'POST', body: JSON.stringify({ enabled }) }),
  testSubscription: (id) => request(`/api/subscriptions/${id}/test`, { method: 'POST' }),

  convertSubscription: (data) => request('/api/convert', { method: 'POST', body: JSON.stringify(data) }),
  applyConfig: (config) => request('/api/apply', { method: 'POST', body: JSON.stringify(config) }),

  checkUpdate: (url) => fetch(url).then(r => r.json()),
  installUpdate: (url, sha256) => request('/api/update/install', { method: 'POST', body: JSON.stringify({ packageUrl: url, sha256 }) }),

  getSystemConfig: () => request('/api/system/config'),
  setSysctl: (params) => request('/api/system/sysctl', { method: 'POST', body: JSON.stringify(params) }),
  setFirewall: (params) => request('/api/system/firewall', { method: 'POST', body: JSON.stringify(params) }),

  convertSubscription: (data) => request('/api/subscriptions/convert', { method: 'POST', body: JSON.stringify(data) }),
  checkUpdate: (url) => fetch(url).then(r => r.json()),
  installUpdate: (url, sha256) => request('/api/update/install', { method: 'POST', body: JSON.stringify({ packageUrl: url, sha256 }) }),

  checkUpdate: async (url) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('获取清单失败')
    return res.json()
  },

  installUpdate: async (packageUrl, sha256) => {
    const res = await request('/api/update/install', { method: 'POST', body: JSON.stringify({ packageUrl, sha256 }) })
    return res
  },

  convertSubscription: async (data) => {
    return request('/api/subscriptions/convert', { method: 'POST', body: JSON.stringify(data) })
  },

  getSystemConfig: async () => {
    return request('/api/system/config')
  },

  setSysctl: async (params) => {
    return request('/api/system/sysctl', { method: 'POST', body: JSON.stringify(params) })
  },

  setFirewall: async (params) => {
    return request('/api/system/firewall', { method: 'POST', body: JSON.stringify(params) })
  },

  getSubscriptions: async () => {
    return request('/api/subscriptions')
  },

  convertSubscription: async (data) => {
    return request('/api/subscriptions/convert', { method: 'POST', body: JSON.stringify(data) })
  },

  installUpdate: async (packageUrl, sha256) => {
    return request('/api/update/install', { method: 'POST', body: JSON.stringify({ packageUrl, sha256 }) })
  },

  checkUpdate: async (url) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('获取清单失败')
    return res.json()
  }
}
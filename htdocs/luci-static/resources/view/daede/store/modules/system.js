import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { api } from '@/api'
import { toast } from '@/utils/toast'

export const useSystemStore = defineStore('system', () => {
  const sysctl = reactive({
    'fs.file-max': 100000,
    'net.core.somaxconn': 2048,
    'net.ipv4.tcp_tw_reuse': 1,
    'net.ipv4.tcp_fin_timeout': 30,
    'vm.swappiness': 10
  })

  const firewall = reactive({
    icmp_echo_ignore_all: 0,
    lan_isolation: 0
  })

  const saving = ref(false)
  const sysctlSaved = ref(false)
  const firewallSaved = ref(false)

  const sysctlParams = [
    { key: 'fs.file-max', label: 'fs.file-max', min: 10000, max: 1000000, step: 10000, type: 'number' },
    { key: 'net.core.somaxconn', label: 'net.core.somaxconn', min: 128, max: 65535, step: 1, type: 'number' },
    { key: 'net.ipv4.tcp_tw_reuse', label: 'net.ipv4.tcp_tw_reuse', type: 'switch' },
    { key: 'net.ipv4.tcp_fin_timeout', label: 'net.ipv4.tcp_fin_timeout', min: 5, max: 600, step: 1, type: 'number' },
    { key: 'vm.swappiness', label: 'vm.swappiness', min: 0, max: 100, step: 1, type: 'number' }
  ]

  const fetchConfig = async () => {
    try {
      const res = await api.getSystemConfig()
      Object.assign(sysctl, res.sysctl)
      Object.assign(firewall, res.firewall)
    } catch (e) {
      console.error('获取系统配置失败:', e)
    }
  }

  const saveSysctl = async () => {
    const keys = ['fs.file-max', 'net.core.somaxconn', 'net.ipv4.tcp_tw_reuse', 'net.ipv4.tcp_fin_timeout', 'vm.swappiness']
    const payload = Object.fromEntries(keys.map(k => [k, sysctl[k]]))
    try {
      await api.setSysctl(payload)
      toast.success('内核参数已保存并生效')
    } catch (e) {
      throw e
    }
  }

  const saveFirewall = async () => {
    try {
      await api.setFirewall({ icmp_echo_ignore_all: firewall.icmp_echo_ignore_all, lan_isolation: firewall.lan_isolation })
      toast.success('防火墙规则已保存并生效')
    } catch (e) {
      throw e
    }
  }

  return { sysctl, firewall, saving, sysctlParams, fetchConfig, saveSysctl, saveFirewall }
})
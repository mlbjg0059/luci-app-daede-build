import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { api } from '@/api'
import { toast } from '@/utils/toast'

export const useNetworkStore = defineStore('network', () => {
  const firewall = reactive({
    icmp_echo_ignore_all: 0,
    lan_isolation: 0
  })

  const rules = ref([])
  const editingId = ref(null)
  const form = reactive({ name: '', cidr: '', blockPing: false, blockLanAccess: false })

  const fetchConfig = async () => {
    try {
      const res = await api.getSystemConfig()
      Object.assign(firewall, res.firewall)
      rules.value = JSON.parse(localStorage.getItem('daede-lan-rules') || '[]')
    } catch (e) {
      console.error('获取网络配置失败:', e)
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

  const addRule = () => {
    if (editingId.value) {
      const idx = rules.value.findIndex(r => r.id === editingId.value)
      if (idx > -1) rules.value[idx] = { ...form, id: editingId.value }
    } else {
      rules.value.push({ ...form, id: Date.now().toString() })
    }
    localStorage.setItem('daede-lan-rules', JSON.stringify(rules.value))
    resetForm()
  }

  const editRule = (rule) => {
    editingId.value = rule.id
    Object.assign(form, rule)
  }

  const deleteRule = (id) => {
    if (confirm('确定删除？')) {
      rules.value = rules.value.filter(r => r.id !== id)
      localStorage.setItem('daede-lan-rules', JSON.stringify(rules.value))
    }
  }

  const resetForm = () => {
    editingId.value = null
    Object.assign(form, { name: '', cidr: '', blockPing: false, blockLanAccess: false })
  }

  const cancelEdit = () => resetForm()

  return { firewall, rules, editingId, form, rules, addRule, editRule, deleteRule, cancelEdit, fetchConfig, saveFirewall }
})
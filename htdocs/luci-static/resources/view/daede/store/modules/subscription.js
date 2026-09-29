import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { api } from '@/api'
import { toast } from '@/utils/toast'

export const useSubscriptionStore = defineStore('subscription', () => {
  const subscriptions = ref([])
  const converting = ref(false)
  const convertResult = ref('')

  const fetchSubscriptions = async () => {
    try {
      subscriptions.value = await api.getSubscriptions()
    } catch (e) {
      console.error('获取订阅失败:', e)
    }
  }

  const convertSubscription = async (form) => {
    converting.value = true
    try {
      const res = await api.convertSubscription(form)
      convertResult.value = res.config
      toast.success('订阅转换成功')
      return res.config
    } catch (e) {
      throw e
    } finally {
      converting.value = false
    }
  }

  const applyConversion = async (config) => {
    try {
      await api.applyConfig(config)
      toast.success('配置已应用')
    } catch (e) {
      throw e
    }
  }

  const addSubscription = async (sub) => {
    try {
      await api.addSubscription(sub)
      await fetchSubscriptions()
      toast.success('订阅添加成功')
    } catch (e) {
      throw e
    }
  }

  const updateSubscription = async (id, data) => {
    try {
      await api.updateSubscription(id, data)
      await fetchSubscriptions()
      toast.success('订阅更新成功')
    } catch (e) {
      throw e
    }
  }

  const deleteSubscription = async (id) => {
    try {
      await api.deleteSubscription(id)
      await fetchSubscriptions()
      toast.success('订阅删除成功')
    } catch (e) {
      throw e
    }
  }

  const toggleSubscription = async (id, enabled) => {
    try {
      await api.toggleSubscription(id, enabled)
      await fetchSubscriptions()
    } catch (e) {
      throw e
    }
  }

  return { subscriptions, converting, convertResult, fetchSubscriptions, convertSubscription, applyConversion, addSubscription, updateSubscription, deleteSubscription, toggleSubscription }
})
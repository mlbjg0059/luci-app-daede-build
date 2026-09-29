import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { api } from '@/api'
import { toast } from '@/utils/toast'

export const useUpdateStore = defineStore('update', () => {
  const manifest = ref(null)
  const checking = ref(false)
  const installing = ref(false)
  const status = ref('idle')
  const message = ref('')

  const currentVersion = import.meta.env.APP_VERSION || '1.0.0'
  const manifestUrl = ref(localStorage.getItem('daede.update.manifestUrl') || 'https://gitee.com/dkzkerr/open-daeui/raw/master/daed-update.json')

  const checkUpdate = async () => {
    checking.value = true
    try {
      const res = await fetch(manifestUrl.value)
      if (!res.ok) throw new Error('获取清单失败')
      const data = await res.json()
      manifest.value = data
      localStorage.setItem('daede.update.manifestUrl', manifestUrl.value)
      return data
    } catch (e) {
      throw e
    } finally {
      checking.value = false
    }
  }

  const installUpdate = async () => {
    if (!manifest.value) throw new Error('无可用更新')
    installing.value = true
    try {
      await api.installUpdate(manifest.value.packageUrl, manifest.value.sha256)
      toast.success('安装完成，服务重启中...')
      setTimeout(() => location.reload(), 3000)
    } catch (e) {
      throw e
    } finally {
      installing.value = false
    }
  }

  const updateAvailable = computed(() => {
    if (!manifest.value) return false
    return compareVersions(manifest.value.version, currentVersion) > 0
  })

  function compareVersions(v1, v2) {
    const a = v1.split('.').map(Number)
    const b = v2.split('.').map(Number)
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const n1 = a[i] || 0
      const n2 = b[i] || 0
      if (n1 > n2) return 1
      if (n1 < n2) return -1
    }
    return 0
  }

  return { manifest, checking, installing, currentVersion, manifestUrl, checkUpdate, installUpdate, updateAvailable }
})
<template>
  <div class="online-update">
    <div class="page-header">
      <h1 class="page-title">{{ t('nav.onlineUpdate') }}</h1>
    </div>

    <YCard :description="t('updates.description')">
      <FormItem :label="t('updates.manifestUrl')" :description="t('updates.manifestDescription')">
        <YInput v-model="manifestUrl" :placeholder="t('updates.manifestDescription')" type="url" />
      </FormItem>

      <div class="flex gap-3 mb-4">
        <YButton @click="checkUpdate" :loading="checking" icon="RefreshCw">{{ t('updates.check') }}</YButton>
        <span class="text-sm text-muted">{{ t('updates.currentVersion', { version: currentVersion }) }}</span>
      </div>

      <div v-if="status === 'error'" class="alert error">{{ message }}</div>

      <div v-if="manifest" class="update-info">
        <div class="flex items-center justify-between gap-3 mb-3">
          <div class="flex items-center gap-2">
            <CheckCircle class="text-primary" /> {{ updateAvailable ? t('updates.available', { version: manifest.version }) : t('updates.latest') }}
          </div>
          <div v-if="updateAvailable" class="flex gap-3">
            <YButton @click="installUpdate" :loading="installing" type="primary">{{ t('updates.installNow') }}</YButton>
            <YButton variant="outline" as-child><a :href="manifest.packageUrl" target="_blank">{{ t('updates.downloadPackage') }}</a></YButton>
          </div>
        </div>
        <p v-if="manifest.releaseNotes" class="whitespace-pre-wrap text-sm text-muted mt-3">{{ manifest.releaseNotes }}</p>
        <p v-if="manifest.sha256" class="break-all font-mono text-xs text-muted mt-3">SHA-256: {{ manifest.sha256 }}</p>
        <p class="text-xs text-muted mt-3">{{ t('updates.installNote') }}</p>
      </div>

      <div v-if="installing" class="flex items-center gap-2 text-primary mt-4">
        <RefreshCw class="animate-spin" /> 正在下载安装，请勿关闭页面...
      </div>
    </YCard>
  </template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/api'
import { toast } from '@/utils/toast'
import { RefreshCw, CheckCircle } from 'lucide-vue-next'

const { t } = useI18n()
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8081'
const currentVersion = import.meta.env.APP_VERSION || '1.0.0'

const manifestUrl = ref(localStorage.getItem('daede.update.manifestUrl') || 'https://gitee.com/dkzkerr/open-daeui/raw/master/daed-update.json')
const manifest = ref(null)
const status = ref('idle')
const message = ref('')
const checking = ref(false)
const installing = ref(false)

const updateAvailable = computed(() => manifest.value ? compareVersions(manifest.value.version, currentVersion) > 0 : false)

const checkUpdate = async () => {
  checking.value = true; status.value = 'idle'
  try {
    const res = await fetch(manifestUrl.value)
    if (!res.ok) throw new Error('获取清单失败')
    const data = await res.json()
    manifest.value = data
    localStorage.setItem('daede.update.manifestUrl', manifestUrl.value)
    status.value = 'success'
  } catch (e) { status.value = 'error'; message.value = e.message } finally { checking.value = false }
}

const installUpdate = async () => {
  installing.value = true
  try {
    const res = await fetch(`${API_BASE}/api/update/install`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageUrl: manifest.value.packageUrl, sha256: manifest.value.sha256 })
    })
    if (!res.ok) throw new Error((await res.json()).error || '安装失败')
    toast.success('安装完成，服务重启中...')
    setTimeout(() => location.reload(), 3000)
  } catch (e) { toast.error(e.message) } finally { installing.value = false }
}

function compareVersions(v1, v2) {
  const a = v1.split('.').map(Number), b = v2.split('.').map(Number)
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const n1 = a[i] || 0, n2 = b[i] || 0
    if (n1 > n2) return 1; if (n1 < n2) return -1
  }
  return 0
}

return { manifestUrl, manifest, status, message, checking, installing, currentVersion, updateAvailable, checkUpdate, installUpdate, t }
</script>
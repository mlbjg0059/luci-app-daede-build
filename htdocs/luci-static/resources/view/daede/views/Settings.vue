<template>
  <div class="settings">
    <div class="page-header">
      <h1 class="page-title">{{ t('nav.settings') }}</h1>
    </div>

    <YCard title="常规设置">
      <FormItem :label="t('settings.language')" prop="language">
        <YSelect v-model="settings.language" :options="languageOptions" />
      </FormItem>
      <FormItem :label="t('settings.theme')" prop="theme">
        <YSelect v-model="settings.theme" :options="themeOptions" />
      </FormItem>
      <FormItem :label="t('settings.autoRefresh')" prop="autoRefresh">
        <YSwitch v-model="settings.autoRefresh" />
      </FormItem>
      <FormItem :label="t('settings.refreshInterval')" prop="refreshInterval">
        <YInputNumber v-model="settings.refreshInterval" :min="5" :max="300" :step="5" />
      </FormItem>
    </YCard>

    <YCard title="DAE 核心连接">
      <FormItem :label="t('settings.daeEndpoint')" prop="daeEndpoint">
        <YInput v-model="settings.daeEndpoint" placeholder="http://192.168.100.1:2023/graphql" />
      </FormItem>
      <FormItem :label="t('settings.clash2daeEndpoint')" prop="clash2daeEndpoint">
        <YInput v-model="settings.clash2daeEndpoint" placeholder="http://192.168.100.1:8081" />
      </FormItem>
    </YCard>

    <YCard title="关于">
      <div class="about-info">
        <p><strong>DAE Management Interface</strong> - YACD Style</p>
        <p>版本: {{ version }}</p>
        <p>基于 DAE 核心 (2023 端口) + luci-app-daede</p>
        <p class="mt-2"><a href="https://github.com/kenzok8/openwrt-daede" target="_blank">源码仓库</a></p>
      </div>
    </YCard>
  </template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const version = import.meta.env.APP_VERSION || '1.0.0'

const settings = reactive({
  language: localStorage.getItem('daede-lang') || 'zh-CN',
  theme: 'light',
  autoRefresh: true,
  refreshInterval: 10,
  daeEndpoint: 'http://192.168.100.1:2023/graphql',
  clash2daeEndpoint: 'http://192.168.100.1:8081'
})

const languageOptions = [{ value: 'zh-CN', label: '中文' }, { value: 'en-US', label: 'English' }]
const themeOptions = [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }, { value: 'auto', label: '跟随系统' }]

onMounted(() => {
  const saved = localStorage.getItem('daede-settings')
  if (saved) Object.assign(settings, JSON.parse(saved))
})

watch(settings, (val) => localStorage.setItem('daede-settings', JSON.stringify(val)), { deep: true })

const version = import.meta.env.APP_VERSION || '1.0.0'
return { settings, languageOptions, themeOptions, t, version }
</script>
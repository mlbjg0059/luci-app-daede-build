<template>
  <div class="system-tuning">
    <div class="page-header">
      <h1 class="page-title">{{ t('nav.systemTuning') }}</h1>
    </div>

    <YCard :title="t('systemTuning.kernelParams')" :description="t('systemTuning.kernelParamsDesc')" class="mb-4">
      <div class="form-grid">
        <FormItem v-for="item in kernelParams" :key="item.key" :label="t(item.labelKey)" :help="t(item.helpKey)">
          <YInputNumber v-model="form[item.key]" :min="item.min" :max="item.max" :step="item.step" v-if="item.type !== 'switch'" />
          <YSwitch v-model="form[item.key]" v-else />
          <template #help>{{ t(item.helpNoteKey, { current: form[item.key] }) }}</template>
        </FormItem>
      </div>
      <div class="form-actions">
        <YButton @click="saveSysctl" :loading="savingSysctl" type="primary">{{ t('common.save') }}</YButton>
      </div>
    </YCard>

    <YCard :title="t('systemTuning.firewallIsolation')" :description="t('systemTuning.firewallIsolationDesc')">
      <div class="switch-grid">
        <SwitchItem v-model="form.icmp_echo_ignore_all" :label="t('systemTuning.icmpEchoIgnore')" :help="t('systemTuning.icmpEchoIgnoreHelp')" :on-text="t('systemTuning.icmpEnabled')" :off-text="t('systemTuning.icmpDisabled')" @change="saveFirewall" />
        <SwitchItem v-model="form.lan_isolation" :label="t('systemTuning.lanIsolationSwitch')" :help="t('systemTuning.lanIsolationSwitchHelp')" :on-text="t('systemTuning.lanIsolationEnabled')" :off-text="t('systemTuning.lanIsolationDisabled')" @change="saveFirewall" />
      </div>
      <div class="form-actions">
        <YButton @click="saveFirewall" :loading="savingFirewall" type="primary">{{ t('common.save') }}</YButton>
      </div>
    </YCard>

    <YCard variant="info" class="mt-4">
      <template #header><span class="info-icon">ℹ️</span> {{ t('systemTuning.applyNoteTitle') }}</template>
      <ul class="note-list">
        <li v-for="note in applyNotes" :key="note">{{ t(note) }}</li>
      </ul>
    </YCard>
  </template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()

const form = reactive({
  'fs.file-max': 100000, 'net.core.somaxconn': 2048,
  'net.ipv4.tcp_tw_reuse': 1, 'net.ipv4.tcp_fin_timeout': 30,
  'vm.swappiness': 10, icmp_echo_ignore_all: 0, lan_isolation: 0
})
const savingSysctl = ref(false)
const savingFirewall = ref(false)

const kernelParams = [
  { key: 'fs.file-max', labelKey: 'systemTuning.fileMax', helpKey: 'systemTuning.fileMaxHelp', helpNoteKey: 'systemTuning.fileMaxNote', min: 10000, max: 1000000, step: 10000 },
  { key: 'net.core.somaxconn', labelKey: 'systemTuning.somaxconn', helpKey: 'systemTuning.somaxconnHelp', helpNoteKey: 'systemTuning.somaxconnNote', min: 128, max: 65535, step: 1 },
  { key: 'net.ipv4.tcp_tw_reuse', type: 'switch', labelKey: 'systemTuning.tcpTwReuse', helpKey: 'systemTuning.tcpTwReuseHelp' },
  { key: 'net.ipv4.tcp_fin_timeout', labelKey: 'systemTuning.tcpFinTimeout', helpKey: 'systemTuning.tcpFinTimeoutHelp', helpNoteKey: 'systemTuning.tcpFinTimeoutNote', min: 5, max: 600, step: 1 },
  { key: 'vm.swappiness', labelKey: 'systemTuning.swappiness', helpKey: 'systemTuning.swappinessHelp', helpNoteKey: 'systemTuning.swappinessNote', min: 0, max: 100, step: 1 }
]

const applyNotes = ['systemTuning.applyNote1', 'systemTuning.applyNote2', 'systemTuning.applyNote3', 'systemTuning.applyNote4']

const fetchConfig = async () => {
  try { const res = await store.system.api.getConfig(); Object.assign(form, res.sysctl, res.firewall) } catch (e) { console.error(e) }
}

const saveSysctl = async () => {
  savingSysctl.value = true
  try {
    const keys = ['fs.file-max', 'net.core.somaxconn', 'net.ipv4.tcp_tw_reuse', 'net.ipv4.tcp_fin_timeout', 'vm.swappiness']
    const payload = Object.fromEntries(keys.map(k => [k, form[k]]))
    await store.system.api.setSysctl(payload)
    toast.success(t('systemTuning.sysctlSaved'))
  } catch (e) { toast.error(e.message) } finally { savingSysctl.value = false }
}

const saveFirewall = async () => {
  try {
    await store.system.api.setFirewall({ icmp_echo_ignore_all: form.icmp_echo_ignore_all, lan_isolation: form.lan_isolation })
    toast.success(t('systemTuning.firewallSaved'))
  } catch (e) { toast.error(e.message) } finally { savingFirewall.value = false }
}

onMounted(() => fetchConfig())

const applyNotes = ['systemTuning.applyNote1', 'systemTuning.applyNote2', 'systemTuning.applyNote3', 'systemTuning.applyNote4']

return { form, kernelParams, applyNotes, savingSysctl, savingFirewall, saveSysctl, saveFirewall, t }
</script>
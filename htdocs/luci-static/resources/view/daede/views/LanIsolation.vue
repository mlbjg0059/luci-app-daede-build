<template>
  <div class="lan-isolation">
    <div class="page-header">
      <h1 class="page-title">{{ t('nav.lanIsolation') }}</h1>
    </div>

    <YCard :title="t('lanIsolation.globalProtection')" :description="t('lanIsolation.globalProtectionDesc')" class="mb-4">
      <SwitchItem v-model="firewall.icmp_echo_ignore_all" :label="t('lanIsolation.icmpEchoIgnore')" :help="t('lanIsolation.icmpEchoIgnoreHelp')" :on-text="t('lanIsolation.icmpEnabled')" :off-text="t('lanIsolation.icmpDisabled')" @change="saveFirewall" />
      <SwitchItem v-model="firewall.lan_isolation" :label="t('lanIsolation.lanIsolationSwitch')" :help="t('lanIsolation.lanIsolationSwitchHelp')" :on-text="t('lanIsolation.lanIsolationEnabled')" :off-text="t('lanIsolation.lanIsolationDisabled')" @change="saveFirewall" />
    </YCard>

    <YCard :title="t('lanIsolation.customRules')" :description="t('lanIsolation.customRulesDesc')">
      <FormCard :model="newRule" @submit="addRule" :editing="editingId">
        <FormItem :label="t('lanIsolation.ruleName')" prop="name" :help="t('lanIsolation.ruleNamePlaceholder')" required>
          <YInput v-model="newRule.name" :placeholder="t('lanIsolation.ruleNamePlaceholder')" />
        </FormItem>
        <FormItem :label="t('lanIsolation.cidr')" prop="cidr" required>
          <YInput v-model="newRule.cidr" placeholder="192.168.10.0/24" />
        </FormItem>
        <FormItem :label="t('lanIsolation.blockPing')" prop="blockPing">
          <YSwitch v-model="newRule.blockPing" :label="t('lanIsolation.blockPing)" :help="t('lanIsolation.blockPingHelp)" />
        </FormItem>
        <FormItem :label="t('lanIsolation.blockLanAccess')" prop="blockLanAccess">
          <YSwitch v-model="newRule.blockLanAccess" :label="t('lanIsolation.blockLanAccess)" :help="t('lanIsolation.blockLanAccessHelp)" />
        </FormItem>
        <template #footer>
          <YButton type="primary" :loading="submitting">{{ editingId ? t('common.update') : t('common.add') }}</YButton>
          <YButton v-if="editingId" @click="cancelEdit">{{ t('common.cancel') }}</YButton>
        </template>
      </FormCard>

      <YTable :columns="ruleColumns" :data="rules" :empty-text="t('lanIsolation.noRules')">
        <template #action="{ row }">
          <YButton size="small" @click="editRule(row)">{{ t('common.edit') }}</YButton>
          <YButton size="small" danger @click="deleteRule(row.id)">{{ t('common.delete') }}</YButton>
        </template>
      </YTable>
    </YCard>

    <YCard variant="info" class="mt-4">
      <template #header>ℹ️ {{ t('lanIsolation.noteTitle') }}</template>
      <ul class="note-list">
        <li v-for="tip in tips" :key="tip">{{ t(tip) }}</li>
      </ul>
    </YCard>
  </template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()

const firewall = reactive({ icmp_echo_ignore_all: 0, lan_isolation: 0 })
const rules = ref([])
const editingId = ref(null)
const newRule = reactive({ name: '', cidr: '', blockPing: false, blockLanAccess: false })
const submitting = ref(false)

const ruleColumns = [
  { prop: 'name', label: '规则名称', minWidth: '150' },
  { prop: 'cidr', label: 'IP 段', width: '180' },
  { prop: 'blockPing', label: '防 Ping', width: '100', render: v => v ? '✅' : '❌' },
  { prop: 'blockLanAccess', label: '禁止互访', width: '120', render: v => v ? '✅' : '❌' },
  { prop: 'action', label: '操作', width: '160', slot: 'action' }
]

const tips = ['lanIsolation.tip1', 'lanIsolation.tip2', 'lanIsolation.tip3']

const fetchConfig = async () => {
  try {
    const res = await store.network.api.getConfig()
    Object.assign(firewall, res.firewall)
    rules.value = JSON.parse(localStorage.getItem('daede-lan-rules') || '[]')
  } catch (e) { console.error(e) }
}

const saveFirewall = async () => {
  try { await store.network.api.setFirewall({ icmp_echo_ignore_all: firewall.icmp_echo_ignore_all, lan_isolation: firewall.lan_isolation }); toast.success(t('lanIsolation.firewallSaved')) } catch (e) { toast.error(e.message) }
}

const addRule = () => {
  if (editingId.value) { const idx = rules.value.findIndex(r => r.id === editingId.value); if (idx > -1) rules.value[idx] = { ...newRule, id: editingId.value } }
  else { rules.value.push({ ...newRule, id: Date.now().toString() }) }
  localStorage.setItem('daede-lan-rules', JSON.stringify(rules.value))
  resetForm()
}

const editRule = (rule) => { editingId.value = rule.id; Object.assign(newRule, rule) }
const deleteRule = (id) => { if (confirm('确定删除？')) { rules.value = rules.value.filter(r => r.id !== id); localStorage.setItem('daede-lan-rules', JSON.stringify(rules.value)) } }
const cancelEdit = () => { editingId.value = null; Object.assign(newRule, { name: '', cidr: '', blockPing: false, blockLanAccess: false }) }
const resetForm = () => { editingId.value = null; Object.assign(newRule, { name: '', cidr: '', blockPing: false, blockLanAccess: false }) }

onMounted(() => fetchConfig())

const tips = ['lanIsolation.tip1', 'lanIsolation.tip2', 'lanIsolation.tip3']

return { firewall, rules, editingId, newRule, submitting, ruleColumns, tips, saveFirewall, addRule, editRule, deleteRule, cancelEdit, t }
</script>
<template>
  <div class="subscription">
    <div class="page-header">
      <h1 class="page-title">{{ t('nav.subscription') }}</h1>
      <YButton @click="showAdd = true" icon="Plus">{{ t('subscription.addSubscription') }}</YButton>
    </div>

    <YCard>
      <YTable :columns="columns" :data="subscriptions" @refresh="fetchSubscriptions">
        <template #enabled="{ row }">
          <YSwitch v-model="row.enabled" @change="toggleSubscription(row.id, row.enabled)" />
        </template>
        <template #lastUpdate="{ row }">{{ row.lastUpdate ? formatDate(row.lastUpdate) : '-' }}</template>
        <template #nextUpdate="{ row }">{{ row.nextUpdate ? formatDate(row.nextUpdate) : '-' }}</template>
        <template #action="{ row }">
          <YButton size="small" @click="editSubscription(row)">{{ t('common.edit') }}</YButton>
          <YButton size="small" @click="testSubscription(row.id)">{{ t('subscription.test') }}</YButton>
          <YButton size="small" danger @click="deleteSubscription(row.id)">{{ t('common.delete') }}</YButton>
        </template>
      </YTable>
    </YCard>

    <YDialog v-model:visible="showAdd" :title="editingId ? t('subscription.editSubscription') : t('subscription.addSubscription')" width="600">
      <FormCard :model="form" @submit="saveSubscription">
        <FormItem :label="t('subscription.url')" prop="url" required>
          <YInput v-model="form.url" :placeholder="t('subscription.urlPlaceholder')" type="url" />
        </FormItem>
        <FormItem :label="t('subscription.name')" prop="name" required>
          <YInput v-model="form.name" :placeholder="t('subscription.namePlaceholder')" />
        </FormItem>
        <FormItem :label="t('subscription.group')" prop="group" required>
          <YInput v-model="form.group" :placeholder="t('subscription.groupNamePlaceholder')" />
        </FormItem>
        <FormItem :label="t('subscription.interval')" prop="interval">
          <YInputNumber v-model="form.interval" :min="1" :max="1440" :step="1" />
        </FormItem>
        <FormItem :label="t('subscription.enabled')" prop="enabled">
          <YSwitch v-model="form.enabled" />
        </FormItem>
        <template #footer>
          <YButton @click="showAdd = false">{{ t('common.cancel') }}</YButton>
          <YButton type="primary" :loading="submitting" @click="submitForm">{{ t('common.save') }}</YButton>
        </template>
      </FormCard>
    </YDialog>
  </template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { formatDate } from '@/utils/format'

const { t } = useI18n()
const store = useStore()

const subscriptions = ref([])
const showAdd = ref(false)
const editingId = ref(null)
const submitting = ref(false)
const form = reactive({ id: '', url: '', name: '', group: '', interval: 60, enabled: true })

const columns = [
  { prop: 'name', label: '订阅名称', minWidth: '180' },
  { prop: 'url', label: '订阅链接', minWidth: '250' },
  { prop: 'group', label: '策略组', width: '150' },
  { prop: 'enabled', label: '状态', width: '100', slot: 'enabled' },
  { prop: 'interval', label: '更新间隔(分)', width: '120' },
  { prop: 'lastUpdate', label: '最后更新', width: '160', slot: 'lastUpdate' },
  { prop: 'nextUpdate', label: '下次更新', width: '160', slot: 'nextUpdate' },
  { prop: 'action', label: '操作', width: '200', slot: 'action' }
]

const fetchSubscriptions = async () => {
  try { subscriptions.value = await store.subscription.api.fetchSubscriptions() } catch (e) { console.error(e) }
}

const editSubscription = (sub) => { editingId.value = sub.id; Object.assign(form, sub); showAdd.value = true }
const saveSubscription = async () => {
  submitting.value = true
  try {
    if (editingId.value) { await store.subscription.api.updateSubscription(editingId.value, form) }
    else { await store.subscription.api.addSubscription(form) }
    await fetchSubscriptions()
    showAdd.value = false
    resetForm()
  } catch (e) { toast.error(e.message) } finally { submitting.value = false }
}

const toggleSubscription = async (id, enabled) => {
  try { await store.subscription.api.toggleSubscription(id, enabled); await fetchSubscriptions() } catch (e) { toast.error(e.message) }
}

const deleteSubscription = async (id) => {
  if (confirm('确定删除？')) { try { await store.subscription.api.deleteSubscription(id); await fetchSubscriptions() } catch (e) { toast.error(e.message) } }
}

const testSubscription = async (id) => {
  try { await store.subscription.api.testSubscription(id); toast.success('测试完成') } catch (e) { toast.error(e.message) }
}

const resetForm = () => { editingId.value = null; Object.assign(form, { id: '', url: '', name: '', group: '', interval: 60, enabled: true }) }

onMounted(() => fetchSubscriptions())

return { subscriptions, showAdd, editingId, submitting, form, columns, fetchSubscriptions, editSubscription, saveSubscription, toggleSubscription, deleteSubscription, testSubscription, t }
</script>